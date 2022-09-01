// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { InventoryItemBase, ItemCrossbow } from "../inventory/InventoryManager";
import NutBase from "../Nut/NutBase";
import EquipAccessoriesBase, { AccessoryProperty } from "./EquipAccessoriesBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Crossbow extends EquipAccessoriesBase {

    //弹药的Prefabs
    ammoPref: string = "bolt_vertical";

    //持有者
    host: NutBase;

    //性质
    property = AccessoryProperty.IDENTITY_MARK;


    //指向仓库物件
    pointToInventoryItem: InventoryItemBase = ItemCrossbow.Instance();

    //配件的贴图
    accessoryIconStr: string = "crossbow_side";

    //弹药的贴图（联机发送使用）
    ammoIconStr: string = "bolt_vertical";

    private static instance: Crossbow;
    static Instance():Crossbow{
        if(!Crossbow.instance){
            Crossbow.instance = new Crossbow();
        }
        return Crossbow.instance;
    }

    setBuff(){
        super.setBuff();
        //攻击范围+10
        this.host.attackChanceRemainder += 10;
        //攻击力+10
        this.host.atk+=10;  
        //改变攻击动作
        this.host.attackMotion = "nut_shooting_crossbow";      
    }

    resumeBuff(){
        this.host.attackChanceRemainder -= 10;
        this.host.atk-=10;
    }



    start () {
        

    }

    // update (dt) {}
}
