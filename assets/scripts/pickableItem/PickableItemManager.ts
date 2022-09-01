// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OnLineManager from "../OnLineManager";
import State from "../State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PickableItemManager extends cc.Component {

    static createNewItem(itemType: string,x:number,y:number){
        let newItem: cc.Node;
        cc.loader.loadRes("./prefebs/pickable_prefabs/"+itemType,cc.Prefab,(err,pf)=>{
            if(!pf){
                console.debug("预制体为空");
            }
            newItem = cc.instantiate(pf);
            if(!newItem){
                 console.debug("节点为空");
            }
            newItem.setParent(cc.director.getScene());
            newItem.setPosition(x,y);
            OnLineManager.Instance.pickableItemdic[State.curPickableID-1] = newItem.getComponent(itemType);
            OnLineManager.SynchroNewPickableItem(itemType,newItem.getPosition());
        })
    }
}
