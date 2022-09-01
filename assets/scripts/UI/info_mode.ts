// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import ComponentBase from "../ComponentBase";
import Message, { MessageCmd } from "../Message";
import State, { Mode ,Process} from "../State";
import UIManager from "../UIManager";

@ccclass
export default class Info_Mode extends ComponentBase{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UIManager.Instance.RegisterReceiver(this);
    }

    start () {
        // State.modeObsevers.push(this);
    }

    // ModeChanged(mode: Mode) {
    //     switch(mode){
    //         case Mode.WAITMODE:
    //             this.node.getComponent(cc.Label).string = "等待模式";
    //             break;
    //         case Mode.OPERATEMODE:
    //             this.node.getComponent(cc.Label).string = "操作模式";
    //             break;
    //     }
    // }

    ReceiveMessage(msg: Message): void {
        if (msg.Command == MessageCmd.CMD_MODECHANGED){
            switch(msg.Content){
                case Mode.WAITMODE:
                    this.node.getComponent(cc.Label).string = "等待模式";
                    break;
                case Mode.OPERATEMODE:
                    this.node.getComponent(cc.Label).string = "操作模式";
                    break;
                case Mode.MOVEMODE:
                    this.node.getComponent(cc.Label).string = "移动模式";
                    break;
                case Mode.BUILDMODE:
                    this.node.getComponent(cc.Label).string = "建筑模式";
                    break;
                case Mode.ATTACKMODE:
                    this.node.getComponent(cc.Label).string = "攻击模式";
                    break;
                case Mode.COMPOUNDMODE:
                    this.node.getComponent(cc.Label).string = "配件模式";
                    break;
                case Mode.FREEZEMODE:
                    this.node.getComponent(cc.Label).string = "等待别人出手";
                    break;
            }
        }
    }



    // update (dt) {}
}
