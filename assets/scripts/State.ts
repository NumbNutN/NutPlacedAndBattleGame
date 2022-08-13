// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum SelectedComp{
    normalNut,
    sceneNut
}

export enum Mode{
    WAITMODE,
    OPERATEMODE
    
}

export enum Operation{
    move,
    place,
    attack,
    pause
}

//我的第一个共享类

@ccclass
export default class State extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private static _instance;

    static selectedComp: SelectedComp;

    static canPlace: boolean = true;
    static canAttack: boolean;
    static canMove: boolean;

    static tarX: number;
    static tarY: number;

    private static _mode :Mode = Mode.OPERATEMODE;

    static get mode(){
        return State._mode;
    }

    static set mode(value: Mode){
        State._mode = value;
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
