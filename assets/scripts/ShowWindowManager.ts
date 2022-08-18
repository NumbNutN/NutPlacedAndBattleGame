// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import State, { Mode } from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        


    }
    SetMessageType(): MessageType {
        return 
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Type!=MessageType.TYPE_WINDOW && msg.Type){
            return;
        }
        switch(msg.Command){
            case MessageCmd.CMD_MODECHANGED:
                if(msg.Content==Mode.BUILDMODE){
                    this.node.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
                        
                    })
                }
        }
    }

    // update (dt) {}
}
