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
import State, { ClickNutAction,Mode } from "./State";
import { Process } from "./State";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends ComponentBase {
    /* 这个类的每个实例为小人的移动范围圈
        定义了移动范围的各种逻辑判断
        注意移动范围UI消失的情况枚举：
        1.当前活动小人切换
        2.当前用户已经确定好移动操作
        3.当前移动模式切换到了其他模式
     */

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';


    onLoad () {
        EffectManager.Instance.RegisterReceiver(this);
    }


    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            State.canMove = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            State.canMove = false;
        })
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event)=>{
            if(State.canMove && State.actionNut.moveChanceRemainder){
                
                //移动范围销毁条件2：当前用户已经确定好移动操作
                EffectManager.Instance.WithDrawReceiver(this);
                //从该物件对应的管理者名单中注销该物件，避免以后消息推送出现错误
                this.node.destroy();
                //将该物件销毁
                
                State.actionNut.moving(3,event.getLocation());
                //执行小人移动逻辑
                            
                State.actionNut.moveChanceRemainder -=1;
                MessageCenter.SendMessage(MessageType.TYPE_STATE,MessageCmd.CMD_MOVECHANCE_CHANGED,null);
                //消息推送，移动次数发生变化     
            }
            
        })
    }

    ReceiveMessage(msg: Message): void {
        //控件将不关心Action的转变，统一接收EffectManager的一个命令控制
        if(msg.Command == MessageCmd.CMD_EFFECT_CHANGE){
            //移动范围销毁条件1：当前切换了活动小人
            //移动范围销毁条件3：当前移动模式切换到了其他模式
            if(msg.Content != this.node){
                EffectManager.Instance.WithDrawReceiver(this);
                this.node.destroy();
            }
        }
    }

    // update (dt) {}
}
