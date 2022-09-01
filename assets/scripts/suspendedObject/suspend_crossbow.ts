// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Crossbow from "../equipItem/crossbow";
import { InventoryItemBase, ItemCrossbow } from "../inventory/InventoryManager";
import State, { Action, Mode, Process } from "../State";
import SuspendObjectBase from "./SuspendObjectBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SuspendCrossbow extends SuspendObjectBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    pointToInventoryItem: InventoryItemBase = ItemCrossbow.Instance();

    start () {

        this.node.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
            this.node.setPosition(event.getLocation());
        })

        State.mode = Mode.COMPOUNDMODE;
        State.selectedAccessory = Crossbow.Instance();

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            this.node.destroy();
            State.mode = Mode.OPERATEMODE;
        });
        
    }

    // update (dt) {}
}
