// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OnLineManager from "../OnLineManager";
import State from "../State";
import AmmoBase from "./AmmoBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bolt extends AmmoBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    ammoIcon: string = "bolt";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //2022-8-30 碰撞检测
        cc.director.getCollisionManager().enabled = true;


    }

    //产生碰撞
    onCollisionEnter(other){
        console.debug("弩箭攻击到人"+other.tag);
        if(other.tag == 0){
            let mirror = other.node.getComponent("NormalNut_Mirror");
            //被攻击方扣除生命值并播放受击动画
            mirror.heal -= State.actionNut.atk;
            
            //2022-8-30 联机功能将伤害发送给对方
            OnLineManager.SynchroNutValue(mirror.ID,-State.actionNut.atk);

            //箭矢销毁
            this.node.destroy();
        }
        
    }

    // update (dt) {}
}
