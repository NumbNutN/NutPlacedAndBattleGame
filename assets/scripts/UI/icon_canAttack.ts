// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State,{SelectedComp,Mode} from "../State";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            State.clickNutMode = 1; //点击小人后为攻击模式
            if(State.selectedComp == SelectedComp.NUT_IN_GROUND){
                if(State.mode == Mode.MOVEMODE){
                    return;
                }
                State.mode = Mode.MOVEMODE;
            }
        })
    }

    start () {

    }

    // update (dt) {}
}
