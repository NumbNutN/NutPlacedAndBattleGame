// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "./ComponentBase";
import ManagerBase from "./ManagerBase";
import Nut from "./Nut";

const {ccclass, property} = cc._decorator;

class MsgNutPos{
    nutID: number;
    tarPos: number[];

    constructor(nutID:number,tarX:number,tarY:number){
        this.nutID = nutID;
        this.tarPos.push(tarX);
        this.tarPos.push(tarY);
    }
}

class MsgNutValue{
    nutID: number;
    newHeal: number;
    newDefense: number;

    constructor(nutID:number,newHeal: number,newDefense: number){
        this.nutID = nutID;
        this.newHeal = newHeal;
        this.newDefense = newDefense;
    }
}

@ccclass
export default class NewClass extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    static mirrorNutList: any[] = [];
    static mirrorWallList: any[] = [];

    //"SynchroNutPosition"
    //


    socket: Socket = null;
    start () {
        this.socket= io.connect("http://localhost:3000");//127.0.0.1
        //判断是否连接成功
        this.socket.on('connect',(data)=>{
            console.debug("远程服务连接成功");
        });

    }

    SynChroNewNut(nutID:number,[x,y]:number[]){
        let msg = new MsgNutPos(nutID,x,y);
        let json = JSON.stringify(msg);
        this.socket.emit("SynChroNewNut",json);
    }

    SynchroNutPosition(nutID: number,[tarX,tarY]:number[]){
        //思路
        //把nut对应的mirror地址、目标的x,y坐标传过去
        //直接把id传过去
        let msg = new MsgNutPos(nutID,tarX,tarY);
        let json = JSON.stringify(msg);
        this.socket.emit("SynchroNutPosition",json);
    }

    SynchroNutValue(){
        //同步血量，将nutmirror对应的本体传过来
        //血量的减少由mirror控制
    }

    SynchroCreateWall(){
        //同步城墙
        //把城墙的x,y坐标传过来
    }

    SynchroWallValue(){
        //同步城墙血量
        //把城墙的血量传过来
    }

}
