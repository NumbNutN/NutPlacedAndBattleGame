// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import State,{Process} from "./State";
import MessageCenter from "./MessageCenter";
import { MessageType,MessageCmd } from "./Message";


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            State.canAttack = true;
        })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            State.canAttack = false;
        })
    }
    // update (dt) {}
}
