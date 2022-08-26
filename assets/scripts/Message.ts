// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Message{
    /*
    这是程序组件相互通信传递的信息体的标准格式
    Type: 决定信息将由信息中心递送给哪一个管理者
    Command: 描述了信息的具体任务
    Content: 补充了一些细节，一般特定的Command决定了你的Content遵从什么格式

    2022-08-15 创建该内容
    2022-08-20 注释补充
    */
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
    TYPE_STATE,
    TYPE_BUILD,
    TYPE_WINDOW,
    TYPE_NUT,
    TYPE_EFFECT
    
}

export enum MessageCmd{
    CMD_MODECHANGED,   //行动模式改变
    CMD_ACTIONCHANGED,  //当前行动改变
    CMD_MOVECHANCE_CHANGED,  //当前移动机会改变
    CMD_BUILDCHANCE_CHANGED,  //当前行动机会改变
    CMD_ATTACKCHANCE_CHANGED, //当前攻击机会改变
    // CMD_NUT_TO_MOVE,   //人员打开了移动模式
    // CMD_SET_NUT_TARGET_LOCATION, //确认人员要前往指定位置 2022-8-24 由于新的移动方案，这个给State发送tarX，Y的方式已经弃用
    // CMD_MOVE_OVER, //移动次数用完
    // CMD_ATTACK_OVER, //攻击次数用完
    // CMD_BUILD_OVER, //建造次数用完
    // CMD_MOVE_AVI, //移动次数可用
    // CMD_ATTACK_AVI, //攻击次数可用
    // CMD_BUILD_AVI, //建造次数可用
    CMD_UI_VALUE_CHANGE,
    CMD_MOVEING_DONE, //完成移动
    CMD_ROUND_OVER, //本回合结束
    CMD_CLICK_NUT_ACTION_CHANGED, //单击小人的逻辑改变
    //2022-8-24
    CMD_GAME_OVER,
    //2-22-8-24
    CMD_EFFECT_CHANGE


}

//消息体
/*
{
    Type: TYPE_UI
    Command:CMD_MODECHANGED
    content::enum Mode
}
*/