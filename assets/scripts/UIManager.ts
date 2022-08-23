// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import { MessageType } from "./Message";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends ManagerBase {
    /*
    这个管理类管理所有的UI控件
    当信息分发给它的管理控件时，
    Message信息体的Type属性应为TYPE_UI
    */

    static Instance: UIManager;
    
    onLoad(): void {
        super.onLoad();
        UIManager.Instance = this;

    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_UI;
    }


}
