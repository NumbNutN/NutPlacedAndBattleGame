// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemFrameManager from "./ItemFrameManager";
import State, { SelectedComp } from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class suspendItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private itemPrefName: string = "";
    // private _item :cc.Node;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let item: cc.Node;
        this.node.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
            this.node.setPosition(event.getLocation());
        })

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(State.canPlace){
                this.node.destroy();
                switch(State.selectedComp){
                    case SelectedComp.normalNut:
                        this.itemPrefName = "normalNut";
                        break;
                }
            }
            if(this.itemPrefName){
                console.debug("Now itemPrefName is"+this.itemPrefName);
                cc.loader.loadRes("./prefebs/"+this.itemPrefName,cc.Prefab,(err,pf)=>{
                    if(!pf){
                        console.debug("预制体为空");
                    }
                    item = cc.instantiate(pf);
                    if(!item){
                        console.debug("节点为空");
                    }
                    //绕过异步的问题
                    item.setParent(cc.director.getScene());
                    item.setPosition(event.getLocation()); 
                })
                  
                
            }
        })

    }

    update (dt) {
    }
}
