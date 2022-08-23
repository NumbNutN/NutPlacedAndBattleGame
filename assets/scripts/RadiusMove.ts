// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "./ComponentBase";
import EffectManager from "./EffectMnanger";
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import State, { ClickNutAction } from "./State";
import { Process } from "./State";
const {ccclass, property} = cc._decorator;

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

    // //存储小人移动前的状态
    // saveMoveState(event){
    //     State.tarX = event.getLocation().x;
    //     State.tarY = event.getLocation().y;
    // }

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            State.canMove = true;
            // this._canMove = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            State.canMove = false;
            // this._canMove = false;
        })
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(State.canMove){
                //this.saveMoveState(event);
                let tarLoc: number[] = [event.getLocation().x,event.getLocation().y];
                MessageCenter.SendMessage(MessageType.TYPE_STATE,MessageCmd.CMD_SET_NUT_TARGET_LOCATION,tarLoc);
                // State.tarX = event.getLocation().x;
                // State.tarY = event.getLocation().y;
                // NormalNut.Instance().tarX = event.getX;
                // NormalNut.Instance().tarY = event.getY;
                EffectManager.Instance.WithDrawReceiver(this);
                this.node.destroy();
                State.action = Process.MOVING;
                State.actionNut.moving();
                console.debug(State.actionNut);
            }
            
        })
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Command == MessageCmd.CMD_CLICK_NUT_ACTION_CHANGED){
            if(msg.Content != ClickNutAction.MOVE){
                EffectManager.Instance.ReceiveList.splice(EffectManager.Instance.ReceiveList.indexOf(this),1);
                this.node.destroy();
            }
        }
    }

    // update (dt) {}
}
