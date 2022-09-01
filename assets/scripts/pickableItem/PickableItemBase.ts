// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State from "../State";

@ccclass
export default class PickableItemBase extends cc.Component {

    itemPrefab: string;

    // LIFE-CYCLE CALLBACKS:

    itemID: number;

    
    start () {
        //分类可拾取物品ID
        this.itemID = State.distributeNewPickableItemID();

    }

    // update (dt) {}
}
