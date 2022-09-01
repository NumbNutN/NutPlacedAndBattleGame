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
    wallPreviewList: cc.Node[] = [];
    wallWidth: number;
    wallHeight: number;
    showWindow: cc.Node;

    pos: [number,number,number][];



    static Instance: WallManager;

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
        WallManager.Instance = this;

        this.pos= [[1/2*this.wallWidth,0,0],[0,1/2*this.wallHeight,90],
        [1/2*this.wallWidth,1/2*this.wallHeight,45],[1/2*this.wallWidth,1/2*this.wallHeight,-45]];

        let newDot: cc.Node;
        let newPreview: cc.Node;

        //生成城墙的预览
        for(let i = 0;i<=this.wallNuminWidth;i++){
            for(let j=0;j<=this.wallNuminHeight;j++){
                //console.debug("生成点");
                newDot = cc.instantiate(this.dotPre);
                newDot.setParent(this.showWindow);
                newDot.setPosition(i*this.wallWidth,j*this.wallHeight);
                newDot.opacity = 0;
                this.dotList.push(newDot);

            }
        }
        for(let i =0;i<=this.dotList.length-this.wallNuminHeight-this.wallNuminWidth-2;i++){
            // console.debug(i%this.wallNuminHeight);
            // if((i+1)%this.wallNuminHeight){
                for(let j=0;j<this.pos.length;j++){
                    newPreview = cc.instantiate(this.wallPreviewPre);
                    //console.debug(""+i+" "+j);
                    newPreview.setParent(this.showWindow);
                    newPreview.setPosition(Math.floor(i/this.wallNuminHeight)*this.wallWidth+this.pos[j][0],(i%this.wallNuminHeight)*this.wallHeight+this.pos[j][1]);
                    //console.debug(Math.floor(i/this.wallNuminHeight)*this.wallWidth+this.pos[j][0]+" "+((i%this.wallNuminHeight)*this.wallHeight+this.pos[j][1]));
                    //newPreview.setPosition(Math.floor(i/this.wallNuminHeight*this.pos[j][0]),i%this.wallNuminHeight*this.pos[j][1]);
                    newPreview.angle = this.pos[j][2];
                    newPreview.opacity = 0;
                    this.wallPreviewList.push(newPreview);
                    
                }
            //}
            
            
        }
        console.debug(this.dotList);
        console.debug(this.wallPreviewList);


    }

    SetMessageType(): MessageType {
        return MessageType.TYPE_BUILD;
    }

    ReceiveMessage(msg: Message): void {
        if(msg.Type != this.messageType && msg.Type){
            return;
        }
            switch(msg.Command){
                case MessageCmd.CMD_MODECHANGED:
                    if(msg.Content == Mode.BUILDMODE){
                        //生成城墙的预览
                        for(let i = 0;i<this.dotList.length;i++){
                            this.dotList[i].opacity = 255;
                        }
                        for(let i =0;i<this.wallPreviewList.length;i++){
                            this.wallPreviewList[i].opacity = 0;
                            }
                        
                        }
                    else{
                        //销毁点
                        for(let i = 0;i<this.dotList.length;i++){
                            this.dotList[i].opacity = 0;
                        }
                        for(let i =0;i<this.wallPreviewList.length;i++){
                            this.wallPreviewList[i].opacity = 0;
                            // this.wallPreviewList[i].off(cc.Node.EventType.MOUSE_DOWN);
                            // this.wallPreviewList[i].off(cc.Node.EventType.MOUSE_ENTER);
                            
                        }
                    
                
                        }
            }
        }

    // update (dt) {}
    }
