// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import ComponentBase from "./ComponentBase";
import {PlacedItem,Nut,ValueObsever} from "./Interface"
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import NutManager from "./NutManager";
import State, { Action, Owner, SelectedComp } from "./State"
import { Mode,Process } from "./State";

@ccclass
export default class NormalNut extends ComponentBase implements Nut{

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
    ringPref: cc.Prefab = null;

    private static _instance :NormalNut = null;

    valueObserver: Array<any> = new Array<any>();

    private owner: Owner = Owner.SELF;

    private _heal: number = 100;
    private fullHeal: number = 100;
    private _shield: number = 50;
    private fullShield: number = 50;
    private _actionRandom: number = 10;
    private _atk: number = 10;

    hasMoveInThisRound: boolean;

    tarX: number;
    tarY: number;

    lastX: number;
    lastY: number;

    private _moving: boolean;

    moveRadius: cc.Node;

    get heal(){
        return this._heal;
    }

    set heal(value){
        if(value>0){
            this._heal = value;
        }
        else{
            this._heal = 0;
        }
        for(let observer of this.valueObserver){
            observer.ValueChanged(this._heal/this.fullHeal);
        }
    }

    get shield(){
        return this._shield;
    }

    set shield(value){
        if(value>0){
            this._shield = value;
        }
        else{
            this._shield = 0;
        }
        for(let observer of this.valueObserver){
            observer.ValueChanged(this._shield/this.fullShield);
        }
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



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        NutManager.Instance.RegisterReceiver(this);
        this.hasMoveInThisRound = false;
    }

    start () {
        //生成血条和盾
        let healBar = cc.instantiate(this.healBarPref);
        healBar.setParent(this.node);
        healBar.setPosition(0,30);
        this.valueObserver.push(healBar);

        let shieldBar = cc.instantiate(this.shieldBarPref);
        shieldBar.setParent(this.node);
        shieldBar.setPosition(0,40);
        this.valueObserver.push(shieldBar);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,30);

        let shieldBarFrame = cc.instantiate(this.barPref);
        shieldBarFrame.setParent(this.node);
        shieldBarFrame.setPosition(0,40);


        // let ring = cc.instantiate(this.ringPref);
        let ring = new cc.Node();
        ring.addComponent(cc.Sprite);
        ring.setParent(this.node);
        ring.setPosition(0,-20);
        //根据敌我生成光环
        switch(this.owner){
            case Owner.SELF:
                cc.loader.loadRes("blue_ring",cc.SpriteFrame,(err,sp)=>{
                    ring.getComponent(cc.Sprite).spriteFrame = sp;
                });
                break;
            case Owner.ENEMY:
                cc.loader.loadRes("red_ring",cc.SpriteFrame,(err,sp)=>{
                    ring.getComponent(cc.Sprite).spriteFrame = sp;
                });
                break;
        }


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
            if(State.mode == Mode.OPERATEMODE)
            if(State.mode == Mode.OPERATEMODE && this.hasMoveInThisRound == false){
                
                //储存当前的(x,y)坐标
                this.lastX = this.node.x;
                this.lastY = this.node.y;
                this.moveRadius = cc.instantiate(this.moveRadiusPref);
                this.moveRadius.setParent(this.node);
                this.moveRadius.setPosition(0,0);
                //this._moving = true;  局部状态，错误的
                //把当前Nut节点寄存到State
                //State.actionNut = this;  被信息中心取代
                State.selectedComp = SelectedComp.NUT_IN_GROUND;
                MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_NUT_TO_MOVE,this);
                
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
                // this._moving = false;
                State.action = Process.DO_NOTHING;
                //MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MOVEING_DONE,null);
                console.debug("发送消息2");
                let dic: {[key:string]:any} = {
                    sender:this,
                    value:-1
                }
                MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MOVECHANCE_CHANGED,dic);
                this.hasMoveInThisRound = true;
            }
        }

    }
    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_ROUND_OVER){
            this.hasMoveInThisRound = false;
        }
    }
    onMouseMove() {
        
    }
}
