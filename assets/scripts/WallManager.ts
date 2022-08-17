// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "./ManagerBase";
import Message, { MessageCmd, MessageType } from "./Message";
import State, { Mode } from "./State";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WallManager extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    dotPre: cc.Prefab = null;

    @property(cc.Prefab)
    wallPreviewPre: cc.Prefab = null;

    @property(cc.Prefab)
    wallPre: cc.Prefab = null;

    @property
    wallNuminWidth: number = 20;

    @property
    wallNuminHeight: number = 12;

    x: number;
    y: number;
    width: number;
    height: number;
    dotList: cc.Node[] = [];
    wallWidth: number;
    wallHeight: number;
    showWindow: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.x = this.node.getParent().getChildByName("showWindow").x;
        this.y = this.node.getParent().getChildByName("showWindow").y;
        this.width = this.node.getParent().getChildByName("showWindow").width;
        this.height = this.node.getParent().getChildByName("showWindow").height;
        this.wallWidth = this.width/this.wallNuminWidth;
        this.wallHeight = this.height/this.wallNuminHeight;
        this.showWindow = this.node.getParent().getChildByName("showWindow");

    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_BUILD;
    }

    ReceiveMessage(msg: Message): void {
        let newDot: cc.Node;
        if(msg.Type == MessageType.TYPE_BUILD && msg.Type){
            switch(msg.Command){
                case MessageCmd.CMD_MODECHANGED:
                    if(msg.Content == Mode.BUILDMODE){
                        //生成城墙的预览
                        for(let i = 0;i<=this.wallNuminWidth;i++){
                            for(let j=0;j<=this.wallNuminHeight;j++){
                                newDot = cc.instantiate(this.dotPre);
                                newDot.setParent(this.showWindow);
                                newDot.setPosition(i*this.wallWidth,j*this.wallHeight);
                                this.dotList.push(newDot);
                            }
                        }
                        
                        

                    }
            }
        }
    }

    // update (dt) {}
}
