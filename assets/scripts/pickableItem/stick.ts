// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import State from "../State";
import { Stick } from "../materialTab/MaterialManager";
import PickableItemBase from "./PickableItemBase";
import OnLineManager from "../OnLineManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends PickableItemBase {

    itemPrefab: string = "stick";

    start () {
        OnLineManager.SynchroNewPickableItem(this.itemPrefab,this.node.getPosition());
        super.start();
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            let dis = Math.abs(State.actionNut?.node.getPosition().sub(this.node.getPosition()).mag());
            if (State.actionNut?.pickRaduis >= dis){
                Stick.Instance().changeOwnNum(1);
                this.node.destroy();
                OnLineManager.SynchroDestroyPickableItem(this.itemID);
            }
        })

    }

    // update (dt) {}
}
