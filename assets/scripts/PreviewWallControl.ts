// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import State, { Mode } from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    wallPre: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            if(State.mode == Mode.BUILDMODE){
                this.node.opacity = 70;
            }  
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            if(State.mode == Mode.BUILDMODE){
                this.node.opacity = 0;
            }
            
        })
        //放置墙
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            event.stopPropagation();
            if(State.mode == Mode.BUILDMODE){    
                let wall = cc.instantiate(this.wallPre);
                wall.setParent(this.node.getParent());
                wall.setPosition(this.node.position);
                wall.angle = this.node.angle;
                //销毁自己
                this.node.destroy();
            }
            
            
        })

    }

    // update (dt) {}
}
