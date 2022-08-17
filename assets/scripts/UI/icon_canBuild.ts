// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import UIManager from "../UIManager";
import Message from "../Message";
import { MessageType,MessageCmd } from "../Message";
@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        UIManager.Instance.RegisterReceiver(this);
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Type == MessageType.TYPE_UI && msg.Command == MessageCmd.CMD_BUILD_OVER){
            this.node.opacity = 60;
        }
    }
}
