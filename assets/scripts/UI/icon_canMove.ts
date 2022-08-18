// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "../ComponentBase";
import Message, { MessageCmd, MessageType } from "../Message";
import State, { ClickNutAction, Mode, SelectedComp } from "../State";
import UIManager from "../UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Icon_canMove extends ComponentBase{

    onLoad(){
        UIManager.Instance.RegisterReceiver(this);

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            State.clickNutAction = ClickNutAction.MOVE; // 点击小人后为移动模式
            if(State.selectedComp == SelectedComp.NUT_IN_GROUND){
                if(State.mode == Mode.MOVEMODE){
                    return;
                }
                State.mode = Mode.MOVEMODE;
            }
        })
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
