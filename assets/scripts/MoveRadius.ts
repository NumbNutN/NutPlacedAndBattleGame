// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NormalNut from "./NormalNut";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private _canMove: boolean;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            this._canMove = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            this._canMove = false;
        })
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            
            NormalNut.Instance().tarX = event.getX;
            NormalNut.Instance().tarY = event.getY;
        })



    }

    // update (dt) {}
}
