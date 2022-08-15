// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Message{
    Type: MessageType;
    Command: MessageCmd;
    Content: any;

    constructor(type:MessageType,command:MessageCmd,content:any){
        this.Type = type;
        this.Command = command;
        this.Content = content;
    }

}

export enum MessageType{
    TYPE_ANY,  //向所有的管理层寄送
    TYPE_UI,
    TYPE_STATE
    
}

export enum MessageCmd{
    CMD_MODECHANGED,   //行动模式改变
    CMD_ACTIONCHANGED,  //当前行动改变
    CMD_MOVECHANCE_CHANGED,  //当前移动机会改变
    CMD_ACTIONCHANCE_CHANGED,  //当前行动机会改变
    CMD_NUT_TO_MOVE,   //人员打开了移动模式
    CMD_SET_NUT_TARGET_LOCATION
}

//消息体
/*
{
    Type: TYPE_UI
    Command:CMD_MODECHANGED
    content::enum Mode
}
*/