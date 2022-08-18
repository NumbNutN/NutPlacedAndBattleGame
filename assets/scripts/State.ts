// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import ComponentBase from "./ComponentBase";
import { Nut} from "./Interface";
import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
const {ccclass, property} = cc._decorator;

export enum SelectedComp{
    NORMAL_NUT,
    WALL,
    NUT_IN_GROUND
}

export enum Mode{
    WAITMODE,
    OPERATEMODE,
    MOVEMODE,
    BUILDMODE,
    ATTACKMODE
    
}

export enum Process{
    MOVING,
    ATTACKING,
    BUILDING,
    DO_NOTHING
}

export enum Action{
    MOVE,
    BUILD,
    ATTACK
}

export enum Owner{
    SELF,
    ENEMY
}

export enum ClickNutAction{
    MOVE,
    ATTACK
}

//我的第一个共享类

@ccclass
export default class State extends ManagerBase{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private static _instance;

    static _selectedComp: SelectedComp;

    static canPlace: boolean = true;
    static canAttack: boolean;
    static canMove: boolean = true;
    static canBuildWall: boolean = true;

    static canPlaceNut: boolean = true;

    static placeRemainder: number = 5;
    static _moveRemainder: number = 1;

    private static _mode :Mode = Mode.OPERATEMODE;

    static actionNut: ComponentBase = null;
    static tarX: number;
    static tarY: number;
    static lastX: number;
    static lastY: number;

    static _clickNutAction: ClickNutAction  = ClickNutAction.MOVE;   //0代表移动模式  1代表攻击

    onLoad(){
        super.onLoad();

    }

    static get clickNutAction(){
        return this._clickNutAction;
    }

    static set clickNutAction(value){
        if(State._clickNutAction == value){
            return;
        }
        //这里的顺序不关键
        State._clickNutAction = value;
        MessageCenter.SendMessage(MessageType.TYPE_EFFECT,MessageCmd.CMD_CLICK_NUT_ACTION_CHANGED,value);
        
    }
    static set selectedComp(value){
        this._selectedComp = value;
        switch(value){
            case SelectedComp.WALL:
                this.mode = Mode.BUILDMODE;
        }
    }

    static get selectedComp(){
        return this._selectedComp;
    }

    //static actionObsevers: Array<ActionObsever> = new Array<ActionObsever>();
    private static _action: Process = Process.DO_NOTHING;

    static set action(value: Process){
        State._action = value;
        // for(let observer of State.actionObsevers){
        //     observer.ActionChanged(value);
        // }
        switch(value){
            case Process.MOVING:
                State.mode = Mode.WAITMODE;
                break;
        }
        //将行动改变告知UI
        MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_ACTIONCHANGED,value);
        
    }

    static get action(){
        return State._action;
    }

    // static modeObsevers: Array<ModeObsever> = new Array<ModeObsever>();

    static get mode(){
        return State._mode;
    }

    static set mode(value: Mode){
        State._mode = value;
        // for(let observer of State.modeObsevers){
        //     observer.ModeChanged(value);
        // }
        //将模式转变告知天下
        MessageCenter.SendMessage(MessageType.TYPE_ANY,MessageCmd.CMD_MODECHANGED,value);
        console.debug("模式转变");

        switch(State._mode){
            case Mode.WAITMODE:
                State.canPlace = false;
                State.canAttack = false;
                State.canMove = false;
                console.debug("等待模式");
                break;
            case Mode.OPERATEMODE:
                // State.canPlace = true;
                // State.canAttack = true;
                // State.canMove = true;
                break;
            case Mode.BUILDMODE:
                console.debug("建筑模式");
                break;
        }
    }

    static get moveRemainder(){
        return State._moveRemainder;
    }

    static set moveRemainder(value){
        console.debug("当前的剩余数"+value);
        if(value == 0){
            MessageCenter.SendMessage(MessageType.TYPE_UI,MessageCmd.CMD_MOVE_OVER,null);
            console.debug("发送的管理员为：");
            console.debug(this);
            State.canMove = false;
        }
        else if(!State._moveRemainder){
            MessageCenter.SendMessage(MessageType.TYPE_UI,MessageCmd.CMD_MOVE_AVI,null);
            console.debug("发送的管理员为：");
            console.debug(this);
        }
        State._moveRemainder = value;
    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_STATE;
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Type != this.messageType && msg.Type){
            return;
        }
        // console.debug("接收到消息"+msg.Command);  //两次
        switch(msg.Command){
            case MessageCmd.CMD_NUT_TO_MOVE:
                //当用户指定一个小人时
                //游戏模式修改为移动模式
                State.mode = Mode.MOVEMODE;
                State.actionNut = msg.Content;
                break;
            case MessageCmd.CMD_SET_NUT_TARGET_LOCATION:
                //当用户确认一个小人将要移动到指定位置时
                State.tarX = msg.Content[0];
                State.tarY = msg.Content[1];
                console.debug("已存储目标坐标 x:"+State.tarX+" y: "+State.tarY);
                break;
            case MessageCmd.CMD_MOVECHANCE_CHANGED:
                //当小人完成行动时
                console.debug("改变数值发送者为：");
                console.debug(msg.Content["sender"]);
                console.debug("剩余数改变,改变后的值为"+(State.moveRemainder+msg.Content["value"]));
                State.moveRemainder=State.moveRemainder+msg.Content["value"];
                break;
            case MessageCmd.CMD_ROUND_OVER:
                //当一个回合结束后
                State.mode = Mode.OPERATEMODE;
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start () {
        
    }

    // update (dt) {}
}
