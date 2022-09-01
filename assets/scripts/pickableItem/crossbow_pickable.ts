// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Crossbow from "../equipItem/crossbow";
import State from "../State";

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            let dis = Math.abs(State.actionNut.node.getPosition().sub(this.node.getPosition()).mag());
            if (State.actionNut.pickRaduis >= dis){
                State.actionNut.addAccessory(Crossbow.Instance());
                this.node.destroy();
            }
        })

    }

    // update (dt) {}
}
