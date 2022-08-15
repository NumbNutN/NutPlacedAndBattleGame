// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "../ComponentBase";
import Message, { MessageCmd, MessageType } from "../Message";
import UIManager from "../UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Icon_canMove extends ComponentBase{

    onLoad(){
        UIManager.Instance.RegisterReceiver(this);
    }

    ReceiveMessage(msg: Message): void {
        switch(msg.Command){
            case MessageCmd.CMD_MOVE_OVER:
                this.node.opacity = 60;
                break;
            case MessageCmd.CMD_MOVE_AVI:
                this.node.opacity = 255;
                break;
        }
        
    }
}
