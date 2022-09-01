// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from "../State";
import { Stone } from "../materialTab/MaterialManager";
import PickableItemBase from "./PickableItemBase";
import OnLineManager from "../OnLineManager";

@ccclass
export default class NewClass extends PickableItemBase {

    itemPrefab: string = "stone";

    start () {
        super.start();
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            let dis = Math.abs(State.actionNut.node.getPosition().sub(this.node.getPosition()).mag());
            if (State.actionNut.pickRaduis >= dis){
                Stone.Instance().changeOwnNum(1);
                this.node.destroy();
                OnLineManager.SynchroDestroyPickableItem(this.itemID);
            }
        })
    }

    // update (dt) {}
}
