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
    moveRadiusPref: cc.Prefab = null;

    @property(cc.Prefab)
    attackRadiusPref: cc.Prefab = null;

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

    private _moving: boolean;

    moveRadiusCircle: cc.Node;



    onLoad () {
        NutManager.Instance.RegisterReceiver(this);
        
        this.moveChanceRemainder =1;
        this.attackChanceRemainder = 1;
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

        cc.loader.loadRes("red_ring",cc.SpriteFrame,(err,sp)=>{
            ring.getComponent(cc.Sprite).spriteFrame = sp;
        });


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
            if(State.distanceBetweenTwoNut(State.actionNut,this)<= State.actionNut.attackRadius){
                this.heal -= State.actionNut.attack;
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