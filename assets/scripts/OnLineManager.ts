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
export default class OnLineManager extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    normal_nut_pref: cc.Prefab = null;

    mirrorNutList: any[] = [];
    mirrorWallList: any[] = [];

    static matchID: number;

    static Instance: OnLineManager;

    //"SynchroNutPosition"
    //


    socket: any = null;
    start () {
        OnLineManager.Instance = this;
        this.socket= io.connect("http://localhost:5050");

        this.socket.on('connect',(data)=>{
            console.debug("连接成功");
            //显示本机id
            this.node.getChildByName("personalId").getComponent(cc.Label).string = `${this.socket.id}`;

            this.socket.on('matchid',(data)=>{
                OnLineManager.matchID = data;
                this.node.getChildByName("opponentId").getComponent(cc.Label).string = `${data}`
            });

            this.socket.on("SynChroNewNut",(data)=>{
                console.debug('接收到对手新建的nut');
                console.debug(data);
                let nut = cc.instantiate(this.normal_nut_pref) as any;
                nut.setParent(cc.director.getScene());
                nut.x = data['x'];
                nut.y = data['y'];
                nut.ID = data['nutID'];

                
            });

            this.socket.on("SynchroNutPosition",(data)=>{
                let mirror;
                console.debug(this.mirrorNutList);
                for(mirror of this.mirrorNutList){
                    if(mirror.ID == data["nutID"]){
                        break;
                    }
                }
                mirror.moving(3,Number(data['x']),Number(data['y']));
            })

            
        });

    }

    static SynChroNewNut(nutID:number,[x,y]:number[]){
        // let msg = new MsgNutPos(nutID,x,y);
        // let json = JSON.stringify(msg);
        OnLineManager.Instance.socket.emit("SynChroNewNut",
        {
            'socketID':OnLineManager.matchID,
            "nutID":nutID,
            "x":x,
            "y":y
        });
    }

    static SynchroNutPosition(nutID: number,[tarX,tarY]:number[]){
        //思路
        //把nut对应的mirror地址、目标的x,y坐标传过去
        //直接把id传过去
        // let msg = new MsgNutPos(nutID,tarX,tarY);
        // let json = JSON.stringify(msg);
        OnLineManager.Instance.socket.emit("SynchroNutPosition",
        {
            'socketID':OnLineManager.matchID,
            "nutID":nutID,
            "x":tarX,
            "y":tarY
        });
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
