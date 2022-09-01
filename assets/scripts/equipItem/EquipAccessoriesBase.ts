// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { InventoryItemBase } from "../inventory/InventoryManager";
import NutBase from "../Nut/NutBase";

const {ccclass, property} = cc._decorator;

export enum AccessoryProperty{
    IDENTITY_MARK,   //unchangeable
    BUFF  //disappear in several rounds
}

export enum AccessoryPlace{
    HEAD,
    BODY,
    FEET
}
@ccclass
export default class EquipAccessoriesBase extends cc.Component {

    //持有者
    host: NutBase;

    //性质
    property;

    //有效期
    validDate: number;

    //指向仓库物件
    pointToInventoryItem: InventoryItemBase;

    //配件的贴图
    accessoryIconStr: string;
    accessoryIcon: cc.Node;

    //发射弹药的Prefab
    ammoPref: string;

    //弹药的贴图（联机发送使用）
    ammoIconStr: string;

    //贴图的位置
    accessoryPlace: AccessoryPlace;

    setBuff(){
        this.accessoryIcon = new cc.Node();
        this.accessoryIcon.addComponent(cc.Sprite);
        cc.loader.loadRes(this.accessoryIconStr,cc.SpriteFrame,(err,sp)=>{
            this.accessoryIcon.getComponent(cc.Sprite).spriteFrame = sp;
        });
        this.accessoryIcon.setParent(this.host.node);
        this.accessoryIcon.setPosition(-2,-7);
        this.accessoryIcon.setScale(0.25,0.25);
        this.accessoryIcon.angle = 45;
    }

    resumeBuff(){

    }

    start () {

    }

    // update (dt) {}
}
