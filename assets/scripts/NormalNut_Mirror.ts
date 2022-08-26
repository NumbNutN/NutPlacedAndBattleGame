// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import ComponentBase from "./ComponentBase";
import {PlacedItem,ValueObsever} from "./Interface"
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import Nut from "./Nut";
import NutManager from "./NutManager";
import OnLineManager from "./OnLineManager";
import State, { Action, ClickNutAction, Owner, SelectedComp } from "./State"
import { Mode,Process } from "./State";

@ccclass
export default class NormalNutMirror extends ComponentBase{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private _cursorAimedFrame: cc.Node;
    
    @property(cc.Prefab)
    cursorAimedFramePref :cc.Prefab = null;

    @property(cc.Prefab)
    barPref: cc.Prefab = null;

    @property(cc.Prefab)
    healBarPref: cc.Prefab = null;

    @property(cc.Prefab)
    shieldBarPref: cc.Prefab = null;


    @property(cc.Prefab)
    ringPref: cc.Prefab = null;

    private static _instance :NormalNutMirror = null;

    private _heal: number = 100;
    private fullHeal: number = 100;
    private _shield: number = 50;
    private fullShield: number = 50;


    valueObserver: Array<any> = new Array<any>();

    private owner: Owner = Owner.SELF;

    moveChanceRemainder: number;
    attackChanceRemainder: number;

    tarX: number;
    tarY: number;

    lastX: number;
    lastY: number;

    healBar: cc.Node;
    shieldBar: cc.Node;

    ID: number;

    ani;

    @property(cc.Prefab)
    attackSuspendedIconPref: cc.Prefab;

    attackSuspendedIcon: cc.Node;

    get heal(){
        return this._heal;
    }

    //2022_8_10 血条的消息推送
    set heal(value){
        this.healBar.getComponent(cc.Sprite).fillRange = value/this.fullHeal;
        if(value>this.fullHeal){
            this._heal = this.fullHeal;
        }
        else if(value<=0){
            this._heal = 0;
            //注销该实例
            NutManager.Instance.WithDrawReceiver(this);
            this.node.destroy();
        }
        else{
            this._heal = value;
        }        
    }

    get shield(){
        return this._shield;
    }

    set shield(value){
        this.shieldBar.getComponent(cc.Sprite).fillRange = value/this.fullShield;
        if(value>this.fullShield){
            this._heal = this.fullShield;
        }
        else if(value<=0){
            this._shield = 0;
        }
        else{
            this._shield = value;
        }        
    }

    private _moving: boolean;

    moveRadiusCircle: cc.Node;



    onLoad () {
        NutManager.Instance.RegisterReceiver(this);
        
        this.moveChanceRemainder =1;
        this.attackChanceRemainder = 1;
    }

    start () {
        this.node.zIndex = 1;
        //this.node.setSiblingIndex(100);
        //生成血条和盾
        this.healBar = cc.instantiate(this.healBarPref);
        this.healBar.setParent(this.node);
        this.healBar.setPosition(0,30);
        // this.valueObserver.push(healBar);

        this.shieldBar = cc.instantiate(this.shieldBarPref);
        this.shieldBar.setParent(this.node);
        this.shieldBar.setPosition(0,40);
        // this.valueObserver.push(shieldBar);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,30);

        let shieldBarFrame = cc.instantiate(this.barPref);
        shieldBarFrame.setParent(this.node);
        shieldBarFrame.setPosition(0,40);


        let ring = cc.instantiate(this.ringPref);
        ring.setParent(this.node);
        ring.setPosition(0,-20);

        //2022-8-26 联机内容
        //加入OnLineManager类的mirrorNutList
        OnLineManager.Instance.mirrorNutList.push(this);

        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            if(!this._cursorAimedFrame){
                this._cursorAimedFrame = cc.instantiate(this.cursorAimedFramePref);
                this._cursorAimedFrame.setParent(this.node);
                this._cursorAimedFrame.setPosition(0,0);
            }
            if(State.mode == Mode.ATTACKMODE){
                if(State.distanceBetweenTwoNut(State.actionNut,this)<= State.actionNut.attackRadius && !this.attackSuspendedIcon){
                    console.debug("侦测到敌人");
                    this.attackSuspendedIcon = cc.instantiate(this.attackSuspendedIconPref);
                    this.attackSuspendedIcon.setParent(cc.director.getScene());
                    this.attackSuspendedIcon.setPosition(event.getLocation());

                }
            }

            
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            console.debug("离开敌人");
            if(this._cursorAimedFrame){
                this._cursorAimedFrame.destroy();
                this._cursorAimedFrame = null;
            }
            if(this.attackSuspendedIcon){
                this.attackSuspendedIcon.destroy();
                this.attackSuspendedIcon = null;
            }
        })

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            //对当前攻击方的剩余攻击数二次判断
            //第一次在攻击范围圈的生成
            if(State.distanceBetweenTwoNut(State.actionNut,this)<= State.actionNut.attackRadius && State.actionNut.attackChanceRemainder){
                console.debug("对敌人造成伤害");
                this.heal -= State.actionNut.atk;
                //2022-8-22
                //攻击方攻击机会-1
                State.actionNut.attackChanceRemainder-=1;
                MessageCenter.SendMessage(MessageType.TYPE_STATE,MessageCmd.CMD_ATTACKCHANCE_CHANGED,null);

            }
        })

    }
    //2022-8-24 小人的移动逻辑
    moving(time:number,x:number,y:number){
        let actionMove = cc.moveTo(time,x,y);
        let actionStopAni = cc.callFunc(()=>{
            //移动完成后的调整
            this.ani.stop();
        })
        let seq = cc.sequence(actionMove,actionStopAni);
        //定义容器动作，相应移动时间后停止动画
        this.node.runAction(seq);
        //开始移动
        this.ani = this.getComponent(cc.Animation);
        this.ani.play("walking_normal_nut");
        //播放行走动画

        console.debug('当前移动小人的id为：');
        console.debug(this.ID);
        }

    update (dt) {

    }
    ReceiveMessage(msg: Message): void {
        switch(msg.Command){
            case MessageCmd.CMD_ROUND_OVER:
                // this.hasMoveInThisRound = false;
                this.attackChanceRemainder =1;
                break;
        }
        
    }
}