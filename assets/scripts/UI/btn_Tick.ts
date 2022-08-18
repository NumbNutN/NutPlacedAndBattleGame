// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "../ComponentBase";
import Message, { MessageCmd } from "../Message";
import State, { Mode } from "../State";
import UIManager from "../UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends ComponentBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // @property(cc.Prefab)
    // tickPref: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UIManager.Instance.RegisterReceiver(this);
    }

    start () {
        this.node.opacity = 0;

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(State.mode == Mode.BUILDMODE){
                State.mode = Mode.OPERATEMODE;
            }
        })

    }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_MODECHANGED){
            if(msg.Content == Mode.BUILDMODE){
                this.node.opacity = 255;
            }
        }
    }

    

    // update (dt) {}
}
