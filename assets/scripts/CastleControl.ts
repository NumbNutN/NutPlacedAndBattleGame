// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import State from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    castlePref :cc.Prefab = null;

    @property(cc.Prefab)
    healBarPref: cc.Prefab = null;

    @property(cc.Prefab)
    barPref: cc.Prefab = null;

    healBar: cc.Node;

    private _heal:number;
    fullHeal: number = 100;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let castleSp = cc.instantiate(this.castlePref);
        castleSp.setParent(this.node);
        castleSp.setPosition(0,0);

        //生成血条和盾
        let healBar = cc.instantiate(this.healBarPref);
        healBar.setParent(this.node);
        healBar.setPosition(0,80);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,80);

    }

    get heal(){
        return this._heal;
    }

    set heal(value){
        //血条状态刷新
        this.healBar.getComponent(cc.Sprite).fillRange = value/this.fullHeal;
        if(value>this.fullHeal){
            this._heal = this.fullHeal;
        }
        else if(value<=0){
            this._heal = 0;
            MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_GAME_OVER,false);
        }
        else{
            this._heal = value;
        }        
    }

    start () {

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            //对当前攻击方的剩余攻击数二次判断
            //第一次在攻击范围圈的生成
            if(State.distanceBetweenTwoNut(State.actionNut,this)<= State.actionNut.attackRadius && State.actionNut.attackChanceRemainder){
                console.debug("对地方城堡攻击！");
                this.heal -= State.actionNut.atk;
                //2022-8-22
                //攻击方攻击机会-1
                State.actionNut.attackChanceRemainder-=1;
                MessageCenter.SendMessage(MessageType.TYPE_STATE,MessageCmd.CMD_ATTACKCHANCE_CHANGED,null);

            }
        })

    }

    // update (dt) {}
}
