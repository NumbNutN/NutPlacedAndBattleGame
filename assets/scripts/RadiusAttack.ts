// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State,{ClickNutAction, Process} from "./State";
import MessageCenter from "./MessageCenter";
import Message, { MessageType,MessageCmd } from "./Message";
import EffectManager from "./EffectMnanger";
import ComponentBase from "./ComponentBase";


@ccclass
export default class NewClass extends ComponentBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EffectManager.Instance.RegisterReceiver(this);
    }

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            State.canAttack = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            State.canAttack = false;
        })
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_CLICK_NUT_ACTION_CHANGED){
            if(msg.Content != ClickNutAction.ATTACK){
                EffectManager.Instance.ReceiveList.splice(EffectManager.Instance.ReceiveList.indexOf(this),1);
                this.node.destroy();
            }
        }
    }


    // update (dt) {}
}
