// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { ActionObsevers } from "./Interface";
import { Action } from "./State";
import State from "./State";

@ccclass
export default class info_action extends cc.Component implements ActionObsevers{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        State.actionObsevers.push(this);
    }

    ActionChanged(action: Action){
        switch(action){
            case Action.MOVING:
                this.node.getComponent(cc.Label).string = "移动中";
                break;
            case Action.DO_NOTHING:
                this.node.getComponent(cc.Label).string = "什么都不做";
                break;
        }
    }

    // update (dt) {}
}
