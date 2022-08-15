// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageCenter{

    //管理者消息推送名单
    static ManagersList: ManagerBase[] = [];

    //发送消息
    static Send(msg: Message){
        for(let manager of this.ManagersList){
            manager.ReceiveMessage(msg);
        }
    }

    //包装消息
    static SendMessage(type:MessageType,command:MessageCmd,content:any){
        let msg = new Message(type,command,content);
        this.Send(msg);
        console.debug("消息中心接收消息：");
        console.debug(msg);
    }

    //将管理者注册为消息订阅者
    static RegisterReceiver(mb:ManagerBase){
        this.ManagersList.push(mb);
    }


    
}
