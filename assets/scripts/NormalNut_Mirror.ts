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
import State, { Action, ClickNutAction, Owner, SelectedComp } from "./State"
import { Mode,Process } from "./State";

@ccclass
export default class NormalNutMirror extends Nut{

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
    update (dt) {
        if(State.action == Process.MOVING && State.actionNut == this){
            if(Math.abs(this.node.x-State.tarX)>3){
                this.node.x-=(this.lastX-State.tarX)*dt/3;
            }
            if(Math.abs(this.node.y-State.tarY)>3){
                this.node.y-=(this.lastY-State.tarY)*dt/3;
            }
            if(Math.abs(this.node.x-State.tarX)<=3&&Math.abs(this.node.y-State.tarY)<=3){

                this.moveChanceRemainder -=1;
            }
        }

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