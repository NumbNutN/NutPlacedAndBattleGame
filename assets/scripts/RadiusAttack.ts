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
    /* 这个类的每个实例为小人的攻击范围圈
        定义了攻击范围的各种逻辑判断
        注意攻击范围UI消失的情况枚举：
        1.当前活动小人切换
        2.当前用户已经确定好移动操作
        3.当前移动模式切换到了其他模式
     */
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
