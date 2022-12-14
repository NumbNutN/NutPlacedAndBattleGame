// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Message,{MessageCmd} from "../Message";
import State from "../State";
import UIManager from "../UIManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    //2022-8-22
    protected onLoad(): void {
        UIManager.Instance.RegisterReceiver(this);
    }


    start () {

    }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_UI_VALUE_CHANGE){
            this.node.getComponent(cc.Label).string = (State.attackRemainder as unknown) as string;
        }
    }

    // update (dt) {}
}
