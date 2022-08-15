// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { Process } from "../State";
import ComponentBase from "../ComponentBase";
import Message, { MessageCmd } from "../Message";
import UIManager from "../UIManager";

@ccclass
export default class info_action extends ComponentBase{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //super.onLoad(); //??这句话什么BUg
        UIManager.Instance.RegisterReceiver(this);
        
    }

    // start () {
    //     State.actionObsevers.push(this);
    // }

    // ActionChanged(action: Action){
    //     switch(action){
    //         case Action.MOVING:
    //             this.node.getComponent(cc.Label).string = "移动中";
    //             break;
    //         case Action.DO_NOTHING:
    //             this.node.getComponent(cc.Label).string = "什么都不做";
    //             break;
    //     }
    // }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_ACTIONCHANGED){
            console.debug("检测到行动改变");
            switch(msg.Content){
                case Process.MOVING:
                    this.node.getComponent(cc.Label).string = "移动中";
                    break;
                case Process.DO_NOTHING:
                    this.node.getComponent(cc.Label).string = "什么都不做";
                    break;
            }
        }
    }

    // update (dt) {}
}
