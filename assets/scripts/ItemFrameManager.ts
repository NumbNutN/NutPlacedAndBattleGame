// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {SelectableCompo} from "./Interface"
import {SelectedComp} from "./State"
import State from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemFrameManager extends cc.Component implements SelectableCompo{

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    suspendItemPref: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(!State.selectedComp){
                State.selectedComp = SelectedComp.NORMAL_NUT;
                let suspendItem = cc.instantiate(this.suspendItemPref);
                suspendItem.setParent(cc.director.getScene());
                suspendItem.setPosition(event.getLocation());
            }
        })
    }

    // update (dt) {}

    OnMouseMove() {
        
    }

    OnMouseClick(self,event) {
        
        

    }
}


