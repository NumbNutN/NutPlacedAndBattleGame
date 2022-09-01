// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import ComponentBase from "./ComponentBase";
import NutBase from "./Nut/NutBase";
import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import NutManager from "./Nut/NutManager";
import CompoundBase from "./workingTable/CompoundBase";
import EquipAccessoriesBase from "./equipItem/EquipAccessoriesBase";
import NormalNutMirror from "./mirror/NormalNut_Mirror";
import NormalNut from "./Nut/NormalNut";
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
    ATTACKMODE,
    COMPOUNDMODE,
    FREEZEMODE
    
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
    static moveRemainder: number;
    static attackRemainder: number;

    private static _mode :Mode = Mode.OPERATEMODE;

    static actionNut: NormalNut = null;
    static tarX: number;
    static tarY: number;
    static lastX: number;
    static lastY: number;

    static curID: number = 0;
    static curPickableID: number = 0;

    static selectedCompound: CompoundBase = null;
    static selectedAccessory: EquipAccessoriesBase = null;

    //2022-8-29  储存被选中的对方nut
    static selectedEnemyNut: NormalNutMirror = null;

    //2022-8-22
    //State管理类的实例
    static Instance: State;

    static distributeNewID():number{
        return State.curID++;
    }

    static distributeNewPickableItemID():number{
        return State.curPickableID++;
    }

    private static temp: number;

    static _clickNutAction: ClickNutAction  = ClickNutAction.MOVE;   //0代表移动模式  1代表攻击

    onLoad(){
        super.onLoad();
        State.Instance = this;


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

    private static _action: Process = Process.DO_NOTHING;

    static set action(value: Process){
        State._action = value;
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


    static get mode(){
        return State._mode;
    }

    static set mode(value: Mode){
        State._mode = value;
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
                State.canPlace = true;
                // State.canAttack = true;
                // State.canMove = true;
                break;
            case Mode.BUILDMODE:
                console.debug("建筑模式");
                break;
        }
    }


    SetMessageType(): MessageType {
        return MessageType.TYPE_STATE;
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Type != this.messageType && msg.Type){
            return;
        }
        switch(msg.Command){
            case MessageCmd.CMD_MOVECHANCE_CHANGED:
                this.updateMoveRemainder();
                break;
            case MessageCmd.CMD_ROUND_OVER:
                //当一个回合结束后
                State.mode = Mode.OPERATEMODE;
            //2022-8-22
            case MessageCmd.CMD_ATTACKCHANCE_CHANGED:
                this.updateAttackRemainder();

        }
    }

    //2022-8-22
    updateMoveRemainder(){
        State.temp = 0;
        for(let nut of NutManager.Instance.ReceiveList){
            State.temp+=nut.moveChanceRemainder;
        }
        State.moveRemainder = State.temp;
        MessageCenter.SendMessage(MessageType.TYPE_UI,MessageCmd.CMD_UI_VALUE_CHANGE,null);

    }

    updateAttackRemainder(){
        State.temp = 0;
        for(let nut of NutManager.Instance.ReceiveList){
            State.temp+=nut.attackChanceRemainder;
        }
        State.attackRemainder = State.temp;
        MessageCenter.SendMessage(MessageType.TYPE_UI,MessageCmd.CMD_UI_VALUE_CHANGE,null);
    }

    //返回两个nut之间的距离
    //2022-8-21  其他物件（城堡、城墙等同样生效）
    static distanceBetweenTwoNut(nutA: any,nutB: any):number{
        return Math.sqrt(Math.pow(nutA.node.x-nutB.node.x,2)+Math.pow(nutA.node.y-nutB.node.y,2));
    }


    start () {
        //2022-8-22
        //初始化的时候就把数值设置好
        this.updateMoveRemainder();
        this.updateAttackRemainder();
        //设置好当前的模式
        State.mode = Mode.FREEZEMODE;
        State.action = Process.DO_NOTHING;
        
    }

    // update (dt) {}
}
