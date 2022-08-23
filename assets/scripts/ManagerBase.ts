// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "./ComponentBase";
import Message, {MessageType} from "./Message"
import MessageCenter from "./MessageCenter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerBase extends ComponentBase {
    /*
    这是所有管理者的基类
    */


    ReceiveList: any[] = [];
    //当前管理类接收的消息类型(enum MessageType)
    messageType: MessageType;

    //所有管理者都要用super调用基类onLoad()方法
    onLoad(){
        this.messageType = this.SetMessageType();
        //把自己注册到消息中心
        MessageCenter.RegisterReceiver(this);
        console.debug("管理者已注册：");
        console.debug(this);
        
    }

    //方法：设置当前管理类的消息类型，由实例化重写
    SetMessageType(): MessageType{
        return;
    };

    //注册消息监听
    RegisterReceiver(cb: ComponentBase){
        this.ReceiveList.push(cb);
    }

    WithDrawReceiver(cb: ComponentBase){
        this.ReceiveList.splice(this.ReceiveList.indexOf(cb),1);
    }

    //接收消息并向下分发
    ReceiveMessage(msg: Message): void {
        console.debug("管理者接收到消息:");
        console.debug(msg);
        super.ReceiveMessage(msg);
        //判断消息类型
        if(this.messageType != msg.Type && msg.Type){
            return;
        }
        //开始分发
        for(let cb of this.ReceiveList){
            console.debug("已分发给：")
            console.debug(cb);
            cb.ReceiveMessage(msg);
        }

    }

}
