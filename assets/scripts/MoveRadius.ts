// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NormalNut from "./NormalNut";
import State from "./State";
import { Action } from "./State";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    //存储小人移动前的状态
    saveMoveState(event){
        State.tarX = event.getLocation().x;
        State.tarY = event.getLocation().y;
    }

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            State._canMove = true;
            // this._canMove = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            State._canMove = false;
            // this._canMove = false;
        })
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            console.debug("click the radius");  //tick
            this.saveMoveState(event);
            // State.tarX = event.getLocation().x;
            // State.tarY = event.getLocation().y;
            // NormalNut.Instance().tarX = event.getX;
            // NormalNut.Instance().tarY = event.getY;
            this.node.destroy();
            State.action = Action.MOVING;
        })

        
    }

    // update (dt) {}
}
