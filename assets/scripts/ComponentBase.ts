// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Message from "./Message";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentBase extends cc.Component {
    ReceiveMessage(msg:Message){
        
    }

}
