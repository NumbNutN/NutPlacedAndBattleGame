// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { Nut,ModeObsever,ActionObsever} from "./Interface";
import { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
const {ccclass, property} = cc._decorator;

export enum SelectedComp{
    normalNut,
    sceneNut
}

export enum Mode{
    WAITMODE,
    OPERATEMODE
    
}

export enum Action{
    MOVING,
    ATTACKING,
    BUILDING,
    DO_NOTHING
}

//我的第一个共享类

@ccclass
export default class State extends cc.Component{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private static _instance;

    static selectedComp: SelectedComp;

    static canPlace: boolean = true;
    static canAttack: boolean;
    static canMove: boolean;

    private static _mode :Mode = Mode.OPERATEMODE;

    static actionNut: Nut = null;
    static tarX: number;
    static tarY: number;
    static lastX: number;
    static lastY: number;

    static actionObsevers: Array<ActionObsever> = new Array<ActionObsever>();
    private static _action: Action = Action.DO_NOTHING;

    static set action(value: Action){
        for(let observer of State.actionObsevers){
            observer.ActionChanged(value);
        }

        
        console.debug("action change to "+value);
        State._action = value;
        switch(value){
            case Action.MOVING:
                State.mode = Mode.WAITMODE;
                break;
        }
    }

    static get action(){
        return State._action;
    }

    static modeObsevers: Array<ModeObsever> = new Array<ModeObsever>();

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

    static Instance(){
        if(!State._instance){
            State._instance = new State();
        }
        return State._instance;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start () {
        
    }

    // update (dt) {}
}
