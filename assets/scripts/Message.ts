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
    TYPE_ANY,
    TYPE_UI
    
}

export enum MessageCmd{
    CMD_MODECHANGED,
    CMD_ACTIONCHANGED,
    CMD_MOVECHANCE_CHANGED,
    CMD_ACTIONCHANCE_CHANGED
}
