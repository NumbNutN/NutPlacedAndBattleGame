// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageType } from "./Message";
import Nut from "./Nut";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NutManager extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property
    normalNutHeal :number = 100;
    @property
    normalNutShield: number = 50;

    static Instance: ManagerBase;

    ReceiveList: Nut[] = [];
    // NutList: Nut[] = [];


    SetMessageType(): MessageType {
        return MessageType.TYPE_NUT;
    }

    onLoad () {
        super.onLoad();
        NutManager.Instance = this;

    }

    static moveChanceInNewRound():number{
        return this.Instance.ReceiveList.length;
    }

    start () {
        

    }


    // update (dt) {}


}
