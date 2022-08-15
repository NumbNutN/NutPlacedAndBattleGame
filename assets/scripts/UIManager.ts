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

    static Instance: UIManager;
    
    onLoad(): void {
        super.onLoad();
        UIManager.Instance = this;

    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_UI;
    }


}
