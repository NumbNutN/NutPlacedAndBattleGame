// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { Nut} from "./Interface";
import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
const {ccclass, property} = cc._decorator;

export enum SelectedComp{
    normalNut,
    sceneNut
}

export enum Mode{
    WAITMODE,
    OPERATEMODE,
    MOVEMODE
    
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

//我的第一个共享类

@ccclass
export default class State extends ManagerBase{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private static _instance;

    static selectedComp: SelectedComp;

    static canPlace: boolean = true;
    static canAttack: boolean;
    static canMove: boolean;

    static placeRemainder: number = 5;
    static _moveRemainder: number = 1;

    private static _mode :Mode = Mode.OPERATEMODE;

    static actionNut: Nut = null;
    static tarX: number;
    static tarY: number;
    static lastX: number;
    static lastY: number;

    onLoad(){
        super.onLoad();

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

        switch(State._mode){
            case Mode.WAITMODE:
                State.canPlace = false;
                State.canAttack = false;
                State.canMove = false;
                break;
            case Mode.OPERATEMODE:
                State.canPlace = true;
                State.canAttack = true;
                State.canMove = true;
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
        }
        else if(!State._moveRemainder){
            MessageCenter.SendMessage(MessageType.TYPE_UI,MessageCmd.CMD_MOVE_AVI,null);
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
        switch(msg.Command){
            //接收要移动的nut的地址
            case MessageCmd.CMD_NUT_TO_MOVE:
                //游戏模式修改为移动模式
                State.mode = Mode.MOVEMODE;
                State.actionNut = msg.Content;
                break;
            case MessageCmd.CMD_SET_NUT_TARGET_LOCATION:
                State.tarX = msg.Content[0];
                State.tarY = msg.Content[1];
                console.debug("已存储目标坐标 x:"+State.tarX+" y: "+State.tarY);
                break;

            case MessageCmd.CMD_MOVECHANCE_CHANGED:
                switch(msg.Content){
                    case Action.MOVE:
                        State.moveRemainder+=msg.Content;
                        console.debug("剩余数改变");
                        break;
                }


        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start () {
        
    }

    // update (dt) {}
}
