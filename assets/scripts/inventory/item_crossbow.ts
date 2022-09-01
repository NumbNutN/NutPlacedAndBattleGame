// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State,{Mode,SelectedComp} from "../State";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        console.debug("点击弩箭");
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(State.mode == Mode.OPERATEMODE || State.mode == Mode.MOVEMODE ||State.mode == Mode.ATTACKMODE ||State.mode == Mode.COMPOUNDMODE){
                State.selectedComp = SelectedComp.NORMAL_NUT;

                let suspendItem :cc.Node;
                
                cc.loader.loadRes("./prefebs/suspend_prefabs/suspend_crossbow_pref",cc.Prefab,(err,pf)=>{
                    if(!pf){
                        console.debug("预制体为空");
                    }
                    suspendItem = cc.instantiate(pf);
                    if(!suspendItem){
                        console.debug("节点为空");
                    }
                    //绕过异步的问题
                    suspendItem.setParent(cc.director.getScene());
                    suspendItem.setPosition(event.getLocation()); 
                })
            }
        })

    }

    // update (dt) {}
}
