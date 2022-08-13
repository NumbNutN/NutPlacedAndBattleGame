// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import {PlacedItem,Nut,ValueObsever} from "./Interface"
import State from "./State"
import { Mode } from "./State";

@ccclass
export default class NormalNut extends cc.Component implements PlacedItem,Nut{

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

    private static _instance :NormalNut = null;

    valueObserver: Array<any> = new Array<any>();

    private _heal: number = 100;
    private fullHeal: number = 100;
    private _shield: number = 50;
    private fullShield: number = 50;
    private _actionRandom: number = 10;
    private _atk: number = 10;

    private _tarX: number;
    private _tarY: number;

    private _lastX: number;
    private _lastY: number;

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

    set tarX(value){
        this._tarX = value;
        this._lastX = this.node.x;
        this._moving = true;
    }

    set tarY(value){
        this._tarY = value;
        this._lastY = this.node.y;
        this._moving = true;
    }

    static Instance(){
        if(!NormalNut._instance){
            NormalNut._instance = new NormalNut();
        }
        return NormalNut._instance;
    }



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

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
            if(State.mode = Mode.OPERATEMODE){
                this.moveRadius = cc.instantiate(this.moveRadiusPref);
                this.moveRadius.setParent(this.node);
                this.moveRadius.setPosition(0,0);
            }
        })
    }
    update (dt) {
        if(this._moving){
            if(Math.abs(this.node.x-this._tarX)>3){
                this.node.x-=(this._lastX-this._tarX)*dt/3
            }
            if(Math.abs(this.node.y-this._tarY)>3){
                this.node.y-=(this._lastY-this._tarY)*dt/3
            }
            if(Math.abs(this.node.x-this._tarX)<=3&&Math.abs(this.node.y-this._tarY)<=3){
                this._moving = false;
            }
        }

    }
    onMouseMove() {
        
    }
}
