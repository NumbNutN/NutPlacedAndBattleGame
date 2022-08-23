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

    // hasMoveInThisRound: boolean;
    // hasAttackInThisRound: boolean;
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
        // for(let observer of this.valueObserver){
        //     observer.ValueChanged(this._shield/this.fullShield);
        // }
    }

    // set tarX(value){
    //     this.tarX = value;
    //     this.lastX = this.node.x;
    //     this._moving = true;
    // }

    // set tarY(value){
    //     this.tarY = value;
    //     this.lastY = this.node.y;
    //     this._moving = true;
    // }



    static Instance(){
        if(!NormalNut._instance){
            NormalNut._instance = new NormalNut();
        }
        return NormalNut._instance;
    }

    moving(){
        this.ani = this.getComponent(cc.Animation);
        //播放动画
        this.ani.play("walking_normal_nut");
    }

    stop(){
        this.ani.stop();
    }



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NutManager.Instance.RegisterReceiver(this);
        
        this.moveChanceRemainder =1;
        this.attackChanceRemainder = 1;
        // this.hasMoveInThisRound = false;
        // this.hasAttackInThisRound = false;
    }

    start () {
        //this.node.setSiblingIndex(100);
        this.node.zIndex = 1;
        //生成血条和盾
        this.healBar = cc.instantiate(this.healBarPref);
        this.healBar.setParent(this.node);
        this.healBar.setPosition(0,30);
        //this.valueObserver.push(this.healBar);

        this.shieldBar = cc.instantiate(this.shieldBarPref);
        this.shieldBar.setParent(this.node);
        this.shieldBar.setPosition(0,40);
        //this.valueObserver.push(shieldBar);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,30);

        let shieldBarFrame = cc.instantiate(this.barPref);
        shieldBarFrame.setParent(this.node);
        shieldBarFrame.setPosition(0,40);

        //生成ID
        this.ID = State.distributeNewID();

        //2022-8-22
        //每次生成新的小人时重新计算全局移动和攻击机会
        State.Instance.updateMoveRemainder();
        State.Instance.updateAttackRemainder();
        

        //告知生成新的镜像nut

        // let ring = cc.instantiate(this.ringPref);
        // let ring = new cc.Node();
        // ring.addComponent(cc.Sprite);


        // //根据敌我生成光环
        // switch(this.owner){
        //     case Owner.SELF:
        //         cc.loader.loadRes("blue_ring",cc.SpriteFrame,(err,sp)=>{
        //             ring.getComponent(cc.Sprite).spriteFrame = sp;
        //         });
        //         break;
        //     case Owner.ENEMY:
        //         cc.loader.loadRes("red_ring",cc.SpriteFrame,(err,sp)=>{
        //             ring.getComponent(cc.Sprite).spriteFrame = sp;
        //         });
        //         break;
        // }
        // cc.loader.loadRes("blue_ring",cc.SpriteFrame,(err,sp)=>{
        //     ring.getComponent(cc.Sprite).spriteFrame = sp;
        // });
        this.ring = cc.instantiate(this.ringPref);
        this.ring.setParent(this.node);
        this.ring.setPosition(0,-20);


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
            //是否进入操作模式
            if(State.mode == Mode.OPERATEMODE){
                State.actionNut = this;
                switch(State.clickNutAction){
                    case ClickNutAction.MOVE:
                        if(!this.moveChanceRemainder){
                            break;
                        }
                        //储存当前的(x,y)坐标
                        State.lastX = this.node.x;
                        State.lastY = this.node.y;
                        this.moveRadiusCircle = cc.instantiate(this.moveRadiusPref);
                        this.moveRadiusCircle.setParent(cc.director.getScene());
                        this.moveRadiusCircle.setPosition(this.node.position);
                        //this._moving = true;  局部状态，错误的
                        //把当前Nut节点寄存到State
                        //State.actionNut = this;  被信息中心取代
                        State.selectedComp = SelectedComp.NUT_IN_GROUND;
                        MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_NUT_TO_MOVE,this);
                        break;
                    case ClickNutAction.ATTACK:
                        if(!this.attackChanceRemainder){
                            break;
                        }
                        let attackRadius = cc.instantiate(this.attackRadiusPref);
                        // attackRadius.setParent(this.node);
                        // attackRadius.setPosition(0,0);
                        attackRadius.setParent(cc.director.getScene());
                        attackRadius.setPosition(this.node.position);

                        break;



                }
            }
        })
    }
    update (dt) {
        if(State.action == Process.MOVING && State.actionNut == this){
            if(Math.abs(this.node.x-State.tarX)>3){
                this.node.x-=(State.lastX-State.tarX)*dt/3;
            }
            if(Math.abs(this.node.y-State.tarY)>3){
                this.node.y-=(State.lastY-State.tarY)*dt/3;
            }
            if(Math.abs(this.node.x-State.tarX)<=3&&Math.abs(this.node.y-State.tarY)<=3){
                // this._moving = false;
                State.action = Process.DO_NOTHING;
                //MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MOVEING_DONE,null);
                // console.debug("发送消息2");
                // let dic: {[key:string]:any} = {
                //     sender:this,
                //     value:-1
                // }
                this.moveChanceRemainder -=1;
                MessageCenter.SendMessage(MessageType.TYPE_STATE,MessageCmd.CMD_MOVECHANCE_CHANGED,null);
                // this.hasMoveInThisRound = true;
                
                State.mode = Mode.OPERATEMODE;
                this.stop();
                
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
