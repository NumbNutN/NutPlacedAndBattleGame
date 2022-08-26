// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import MessageCenter from "./MessageCenter";
import State, { ClickNutAction } from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectManager extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    moveRadiusPref: cc.Prefab = null;

    @property(cc.Prefab)
    attackRadiusPref: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    static Instance: EffectManager;

    onLoad(){
        super.onLoad();
        EffectManager.Instance = this;

    }

    start () {

    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_EFFECT;
    }

    ReceiveMessage(msg: Message): void {
        super.ReceiveMessage(msg);

        if(msg.Command == MessageCmd.CMD_CLICK_NUT_ACTION_CHANGED){
            let newRadius: cc.Node;
            switch(msg.Content){
                case ClickNutAction.MOVE:
                    newRadius = cc.instantiate(this.moveRadiusPref);
                    break;
                case ClickNutAction.ATTACK:
                    newRadius = cc.instantiate(this.attackRadiusPref);
                    break;
            }
            //2022-8-24
            //在生成新的范围圈之前销毁所有的圈
            MessageCenter.SendMessage(MessageType.TYPE_EFFECT,MessageCmd.CMD_EFFECT_CHANGE,newRadius)
            if(newRadius){
                newRadius.setParent(cc.director.getScene());
                newRadius.setPosition(State.actionNut.node.position);
            }
            
        }
        else if(msg.Command == MessageCmd.CMD_EFFECT_CHANGE){
            for(let cb of EffectManager.Instance.ReceiveList){
                cb.ReceiveMessage(msg);
            }
        }


    }

    // update (dt) {}
}
