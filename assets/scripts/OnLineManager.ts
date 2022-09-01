// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "./ComponentBase";
import ManagerBase from "./ManagerBase";
import NormalNutMirror from "./mirror/NormalNut_Mirror";
import NormalNut from "./Nut/NormalNut";
import NutBase from "./Nut/NutBase";
import PickableItemBase from "./pickableItem/PickableItemBase";
import State, { Mode } from "./State";

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

export enum OnLineState{
    YOUR_ROUND,
    LOSE,
    VICTORY
}

@ccclass
export default class OnLineManager extends ManagerBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    normal_nut_pref: cc.Prefab = null;

    // mirrorNutList: any[] = [];
    // mirrorWallList: any[] = [];

    mirrorNutdic: {[key: string]:NormalNutMirror} = {};
    nutdic: {[ley: string]:NormalNut} = {}; 
    pickableItemdic:{[ley: string]:PickableItemBase} = {};

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
                //nut.ID = data['nutID'];
                //console.debug(nut.getComponent('NormalNut_Mirror'));
                this.mirrorNutdic[data['nutID']] = nut.getComponent('NormalNut_Mirror');
                nut.getComponent('NormalNut_Mirror').ID = data['nutID'];

                
            });

            this.socket.on("SynchroNutPosition",(data)=>{
                let mirror = this.mirrorNutdic[data['nutID']] as any;
                // console.debug(this.mirrorNutList);
                // for(mirror of this.mirrorNutList){
                //     if(mirror.ID == data["nutID"]){
                //         break;
                //     }
                // }
                mirror?.moving(3,Number(data['x']),Number(data['y']));
            });

            this.socket.on("SynchroNutAni",(data)=>{
                let mirror = this.mirrorNutdic[data['nutID']];
                console.debug(mirror.node);
                let ani = mirror.node.getComponent(cc.Animation);
                ani.play(data["ani"]);
            });

            this.socket.on("SynchroLaunchAmmo",(data)=>{
                cc.loader.loadRes(data['ammoType'],cc.SpriteFrame,(err,sp)=>{
                    let ammo = new cc.Node();
                    ammo.addComponent(cc.Sprite);
                    ammo.getComponent(cc.Sprite).spriteFrame = sp;
                    ammo.setParent(cc.director.getScene());
                    ammo.setPosition(data['bgX'],data['bgY']);
                    ammo.angle = data['angle'];
                    //弹道
                    let actionTrajectory = cc.moveTo(1,data['eX'],data['eY']);
                    let actionDestroy = cc.callFunc(()=>{
                        ammo.destroy();
                    })
                    let seq = cc.sequence(actionTrajectory,actionDestroy);
                    ammo.runAction(seq);
                });

            });

            this.socket.on("SynchroNutValue",(data)=>{
                let mirror = this.nutdic[data['nutID']];
                mirror.heal += data["value"];
            })

            //同步消息后创建新的可拾取物品
            this.socket.on("SynchroNewPickableItem",(data)=>{
                let newItem: cc.Node;
                cc.loader.loadRes("./prefebs/pickable_prefabs/"+data['itemType'],cc.Prefab,(err,pf)=>{
                    if(!pf){
                        console.debug("预制体为空");
                    }
                    newItem = cc.instantiate(pf);
                    if(!newItem){
                        console.debug("节点为空");
                    }
                    newItem.setParent(cc.director.getScene());
                    newItem.setPosition(data["pos"]);
                    this.pickableItemdic[State.curPickableID-1] = newItem.getComponent(data['itemType']);
                })
            })

            //销毁已经被拾取的可拾取物品
            this.socket.on("SynchroDestroyPickableItem",(data)=>{
                this.pickableItemdic[data["itemID"]].node.destroy();
            })

            //切换当前状态
            this.socket.on("ChangeState",(data)=>{
                switch(data['state']){
                    case OnLineState.YOUR_ROUND:
                        State.mode = Mode.OPERATEMODE;
                        break;
                    
                }
                

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

    static SynchroNutAni(nutID: number,ani:string){
        //同步nut的动画
        OnLineManager.Instance.socket.emit("SynchroNutAni",
        {
            'socketID':OnLineManager.matchID,
            "nutID":nutID,
            "ani":ani
        });
    }

    static SynchroLaunchAmmo([bgX,bgY]:number[],[eX,eY]:number[],angle:number,ammotype:string){
        OnLineManager.Instance.socket.emit("SynchroLaunchAmmo",
        {
            'socketID':OnLineManager.matchID,
            'bgX':bgX,
            'bgY':bgY,
            'eX':eX,
            'eY':eY,
            'angle': angle,
            'ammoType':ammotype
        });
    }

    static SynchroNutValue(nutID: number,value: number){
        //同步血量，将nutmirror对应的本体传过来
        //血量的减少由mirror控制
        OnLineManager.Instance.socket.emit("SynchroNutValue",
        {
            'socketID':OnLineManager.matchID,
            'nutID':nutID,
            'value': value
        })
    }

    static SynchroNewPickableItem(type:string,pos:cc.Vec2){
        //同步全局可拾取物品 创建
        OnLineManager.Instance.socket.emit("SynchroNewPickableItem",
        {
            'socketID':OnLineManager.matchID,
            'itemType':type,
            'pos':pos
        })
    }

    static SynchroDestroyPickableItem(itemID: number){
        //同步全局可拾取物品 销毁
        console.log("已发送同步物品的请求");
        OnLineManager.Instance.socket.emit("SynchroDestroyPickableItem",
        {
            'socketID':OnLineManager.matchID,
            'itemID':itemID
        })
    }

    static ChangeState(state: OnLineState){
        OnLineManager.Instance.socket.emit("ChangeState",
        {
            'socketID':OnLineManager.matchID,
            'state':state
        })
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
