// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "./ComponentBase";
import {MessageType} from "./Message"
import MessageCenter from "./MessageCenter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerBase extends ComponentBase {


    private ReceiveList: ComponentBase[] = [];
    //当前管理类接收的消息类型(enum MessageType)
    messageType: MessageType;

    //所有管理者都要用super调用基类onLoad()方法
    onLoad(){
        this.messageType = this.SetMessageType();
        //把自己注册到消息中心
        MessageCenter.RegisterReceiver(this);
    }

    //方法：设置当前管理类的消息类型，由实例化重写
    SetMessageType(): MessageType{
        return;
    };

    //注册消息监听
    RegisterReceiver(cb: ComponentBase){
        this.ReceiveList.push(cb);
    }

}
