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
export default class NormalNut extends Nut{

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
    moveRadiusPref: cc.Prefab = null;

    @property(cc.Prefab)
    attackRadiusPref: cc.Prefab = null;

    @property(cc.Prefab)
    
    ringPref: cc.Prefab = null;

    private static _instance :NormalNut = null;

    valueObserver: Array<any> = new Array<any>();

    private owner: Owner = Owner.SELF;

    private _heal: number = 100;
    private fullHeal: number = 100;
    private _shield: number = 50;
    private fullShield: number = 50;
    private _actionRandom: number = 100;
    atk: number = 10;

    moveChanceRemainder: number;
    attackChanceRemainder: number;

    attackRadius: number = 100;

    //2022_8_19
    healBar: cc.Node;
    shieldBar: cc.Node;


    tarX: number;
    tarY: number;

    lastX: number;
    lastY: number;

    ani: any;

    ID: number;

    private _moving: boolean;

    moveRadiusCircle: cc.Node;
    ring: cc.Node;

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

    //2022-8-24 小人的移动逻辑
    moving(time:number,pos:cc.Vec2){
        State.action = Process.MOVING;
        let actionMove = cc.moveTo(time,pos);
        let actionStopAni = cc.callFunc(()=>{
            //移动完成后的调整
            this.ani.stop();
            State.action = Process.DO_NOTHING;
            State.mode = Mode.OPERATEMODE;
        })
        let seq = cc.sequence(actionMove,actionStopAni);
        //定义容器动作，相应移动时间后停止动画
        this.node.runAction(seq);
        //开始移动
        this.ani = this.getComponent(cc.Animation);
        this.ani.play("walking_normal_nut");
        //播放行走动画


        //test
        console.debug('当前移动小人的id为：');
        console.debug(this.ID);
        //2022-8-26 联机同步
        OnLineManager.SynchroNutPosition(this.ID,[pos.x,pos.y]);
    }



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NutManager.Instance.RegisterReceiver(this);
        
        this.moveChanceRemainder =1;
        this.attackChanceRemainder = 1;
        //创建移动和攻击次数计数器，当该人物该回合计数器为0时无法进行一些操作

        
    }

    start () {
        this.node.zIndex = 1;
        //设置了元素覆盖的优先级

        this.healBar = cc.instantiate(this.healBarPref);
        this.healBar.setParent(this.node);
        this.healBar.setPosition(0,30);

        this.shieldBar = cc.instantiate(this.shieldBarPref);
        this.shieldBar.setParent(this.node);
        this.shieldBar.setPosition(0,40);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,30);

        let shieldBarFrame = cc.instantiate(this.barPref);
        shieldBarFrame.setParent(this.node);
        shieldBarFrame.setPosition(0,40);
        //生成血条和盾的UI

        this.ID = State.distributeNewID();
        //生成ID

        //2022-8-22
        //每次生成新的小人时重新计算全局移动和攻击机会
        State.Instance.updateMoveRemainder();
        State.Instance.updateAttackRemainder();
        

        this.ring = cc.instantiate(this.ringPref);
        this.ring.setParent(this.node);
        this.ring.setPosition(0,-20);
        //生成光环下标

        //2022-8-26 联机部分
        OnLineManager.SynChroNewNut(this.ID,[this.node.x,this.node.y]);


        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            if(!this._cursorAimedFrame){
                this._cursorAimedFrame = cc.instantiate(this.cursorAimedFramePref);
                this._cursorAimedFrame.setParent(this.node);
                this._cursorAimedFrame.setPosition(0,0);
            } 
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            if(this._cursorAimedFrame){
                this._cursorAimedFrame.destroy();
                this._cursorAimedFrame = null;
            }
        })

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            /*
            当小人被单击
            有多种情况需要判断

            2022-8-24 因为移动逻辑更改，不再需要记录Nut原先的坐标
             */
            
            if(State.mode == Mode.OPERATEMODE || State.mode == Mode.ATTACKMODE || State.mode == Mode.MOVEMODE){
                //判断是否进入操作模式，只有该玩家的操作模式下才能单击执行小人的活动
                // State.actionNut = this;
                // //将当前小人储存为State状态类的当前活动小人，所有类和对象都可以访问它
                switch(State.clickNutAction){
                    //State.clickNutAction状态机，记录单击小人后应当切为移动还是攻击模式，
                    //记录了玩家上一次的操作以确定，为了优化游戏体验
                    case ClickNutAction.MOVE:
                        this.moveRadiusCircle = cc.instantiate(this.moveRadiusPref);
                        this.moveRadiusCircle.setParent(cc.director.getScene());
                        this.moveRadiusCircle.setPosition(this.node.position);
                        MessageCenter.SendMessage(MessageType.TYPE_EFFECT,MessageCmd.CMD_EFFECT_CHANGE,this.moveRadiusCircle);
                        //告知EffectManager杀掉该移动圈以外的圈
                        State.selectedComp = SelectedComp.NUT_IN_GROUND;
                        //State.selectedComp状态 说明当前选中的物件为“在场景中的小人”
                        State.mode = Mode.MOVEMODE;
                        State.actionNut = this;
                        //推送消息给State，游戏模式更改为移动模式
                        break;
                    case ClickNutAction.ATTACK:
                        State.actionNut = this;
                        let attackRadius = cc.instantiate(this.attackRadiusPref);
                        attackRadius.setParent(cc.director.getScene());
                        attackRadius.setPosition(this.node.position);
                        State.mode = Mode.ATTACKMODE;
                        //创建可视攻击范围，与Nut节点并列关系，以确立相互覆盖规则（nut图层应在圈上）
                        MessageCenter.SendMessage(MessageType.TYPE_EFFECT,MessageCmd.CMD_EFFECT_CHANGE,attackRadius);
                        //告知EffectManager杀掉该移动圈以外的圈
                        break;
                }
            }
        })
    }
    update (dt) {
        
    }

    ReceiveMessage(msg: Message): void {
        /*
        消息推送： 每个组件均可以向信息中心发送消息，信息中心会将消息转发给有关的
        管理类实例，管理类又会把消息转发给自己管理的所有组件实例
        */
        switch(msg.Command){
            case MessageCmd.CMD_ROUND_OVER:
                this.moveChanceRemainder = 1;
                this.attackChanceRemainder =1;
                break;
                //当一回合结束后，自身的攻击机会恢复
        }
        
    }

}
