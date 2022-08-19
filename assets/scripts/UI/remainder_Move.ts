// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "../ComponentBase";
import Message, { MessageCmd } from "../Message";
import UIManager from "../UIManager";
import State from "../State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RemainderMove extends ComponentBase {

    protected onLoad(): void {
        UIManager.Instance.RegisterReceiver(this);
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_UI_VALUE_CHANGE){
            // this.node.getComponent(cc.Label).string = (State.moveRemainder+msg.Content["value"]) as string;
            this.node.getComponent(cc.Label).string = (State.moveRemainder as unknown) as string;
        }
    }
}
