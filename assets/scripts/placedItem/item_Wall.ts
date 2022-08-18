// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import State, { SelectedComp } from "../State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';



    start () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            State.selectedComp = SelectedComp.WALL;

            // let suspendItem = cc.instantiate(this.suspendWallPre);
            // suspendItem.setParent(cc.director.getScene());
            // suspendItem.setPosition(event.getLocation());

            // let suspendItem :cc.Node;

            // cc.loader.loadRes("./prefebs/suspend_Wall_Pre",cc.Prefab,(err,pf)=>{
            //     if(!pf){
            //         console.debug("预制体为空");
            //     }
            //     suspendItem = cc.instantiate(pf);
            //     if(!suspendItem){
            //         console.debug("节点为空");
            //     }
            //     //绕过异步的问题
            //     suspendItem.setParent(cc.director.getScene());
            //     suspendItem.setPosition(event.getLocation()); 
            // })
        })

    }

    // update (dt) {}
}
