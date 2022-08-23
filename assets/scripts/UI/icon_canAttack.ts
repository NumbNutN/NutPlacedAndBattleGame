// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State,{SelectedComp,Mode, ClickNutAction} from "../State";
import Message,{MessageCmd} from "../Message";
import UIManager from "../UIManager";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UIManager.Instance.RegisterReceiver(this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            console.debug("点击了攻击模式");
            State.clickNutAction = ClickNutAction.ATTACK; //点击小人后为攻击模式
            if(State.selectedComp == SelectedComp.NUT_IN_GROUND){
                if(State.mode == Mode.ATTACKMODE){
                    return;
                }
                State.mode = Mode.ATTACKMODE;
            }
        })
    }

    start () {

    }

    ReceiveMessage(msg: Message): void {

        if(msg.Command == MessageCmd.CMD_UI_VALUE_CHANGE){
            if(State.attackRemainder){
                this.node.opacity = 255;
            }
            else{
                this.node.opacity = 60;
            }
        
        }
    }

    // update (dt) {}
}
