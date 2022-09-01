// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ComponentBase from "../ComponentBase";

const {ccclass, property} = cc._decorator;

export class MaterialBase{

    itemFrame: cc.Node = null;
    item: cc.Node = null;

    materialPref: string;

    _ownNum: number = 0;

    showNumLabel: cc.Node;

    icon: string;


    

    checkConsumeAviliable(value){
            //如果消耗量小于拥有量
            if(this._ownNum+value<0){
                return false;
            }
            else{
                return true;
            }
    }

    changeOwnNum(value){
        //当该物品已存在时
        if(this._ownNum){
            //如果消耗量小于拥有量
            if(this._ownNum+value<0){
                return 0;
            }
            //如果刚好消耗完
            else if(this._ownNum+value==0){
                this._ownNum = 0;
                MaterialManager.Instance.destroyFrame(this);
            }
            //其余情况
            else{
                this._ownNum += value;
                this.showNumLabel.getComponent(cc.Label).string = (this._ownNum as unknown) as string;
            }
        }
        //当该物品不存在时
        else{
            //拥有量大于0
            if(value>0){
                MaterialManager.Instance.createFrame(this.materialPref,this);
                this._ownNum+=value;
                this.showNumLabel.getComponent(cc.Label).string = (this._ownNum as unknown) as string;
            }
            //消耗
            else{
                return 0;
            }
        }
    }
}

export class Stick extends MaterialBase{
    materialPref = "stick_material";
    icon = "stick";

    private static instance: Stick;
    static Instance():Stick{
        if(!Stick.instance){
            Stick.instance = new Stick();
        }
        return Stick.instance;
    }
}

export class Stone extends MaterialBase{
    materialPref = "stone_material";
    icon = "stone";

    private static instance: Stone;
    static Instance():Stone{
        if(!Stone.instance){
            Stone.instance = new Stone();
        }
        return Stone.instance;
    }
}

@ccclass
export default class MaterialManager extends ComponentBase {

    //这里定义了各种材料的数量
    _stickNum: number;
    _stoneNum: number;

    @property(cc.Prefab)
    itemFramePref: cc.Prefab = null;

    static Instance: MaterialManager;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    private _currentY = -100;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        MaterialManager.Instance = this;

        Stick.Instance().changeOwnNum(20);
        Stone.Instance().changeOwnNum(2);

    }

    // update (dt) {}

    framePush(){
        this._currentY -= 200;
    }

    frameBack(){
        this._currentY += 200;
    }

    createFrame(res,obj: MaterialBase){
        //加载物品框(Item Frame)
        obj.itemFrame = cc.instantiate(this.itemFramePref);
        obj.itemFrame.setParent(this.node);
        obj.itemFrame.y = this._currentY;
        obj.itemFrame.x = 0;
        //物品框下移
        this.framePush();

        cc.loader.loadRes("./prefebs/material_prefabs/"+res,cc.Prefab,(err,pf)=>{
            if(!pf){
                console.debug("预制体为空");
            }
            obj.item = cc.instantiate(pf);
            if(!obj.item){
                console.debug("节点为空");
            }
            //绕过异步的问题
            obj.item.setParent(obj.itemFrame);
            obj.item.setPosition(0,0);
        }) 

        obj.showNumLabel = new cc.Node();
        obj.showNumLabel.color = cc.color(0,0,0);
        obj.showNumLabel.addComponent(cc.Label);
        obj.showNumLabel.setParent(obj.itemFrame);
        obj.showNumLabel.setPosition(-70,55);
        obj.showNumLabel.zIndex = 1;
    }

    destroyFrame(obj: MaterialBase){
        obj.itemFrame?.destroy();
        obj.item?.destroy();
        obj.showNumLabel?.destroy();
        //物品栏上移
        this.frameBack();
    }

    // update (dt) {}
}


