// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageType } from "./Message";

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




    // LIFE-CYCLE CALLBACKS:

    SetMessageType(): MessageType {
        return MessageType.TYPE_NUT;
    }

    onLoad () {
        super.onLoad();
        NutManager.Instance = this;

    }

    start () {
        

    }


    // update (dt) {}


}
