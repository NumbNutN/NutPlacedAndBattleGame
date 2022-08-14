// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { ActionObsevers, ModeObsever } from "./Interface";
import State, { Mode ,Action} from "./State";

@ccclass
export default class Info extends cc.Component implements ModeObsever{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        State.modeObsevers.push(this);
    }

    ModeChanged(mode: Mode) {
        switch(mode){
            case Mode.WAITMODE:
                this.node.getComponent(cc.Label).string = "等待模式";
                break;
            case Mode.OPERATEMODE:
                this.node.getComponent(cc.Label).string = "操作模式";
                break;
        }
    }



    // update (dt) {}
}
