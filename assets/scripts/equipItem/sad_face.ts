// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import NutBase from "../Nut/NutBase";
import Crossbow from "./crossbow";
import { AccessoryPlace } from "./EquipAccessoriesBase";
import EquipAccessoriesBase, { AccessoryProperty } from "./EquipAccessoriesBase";

@ccclass
export default class SadFace extends EquipAccessoriesBase {

    //持有者
    host: NutBase;

    //性质
    property = AccessoryProperty.BUFF;

    //配件的贴图
    accessoryIconStr: string = "";

    //弹药的贴图（联机发送使用）
    ammoIconStr: string = "bolt_vertical";

    //贴图的位置
    accessoryPlace: AccessoryPlace = AccessoryPlace.BODY;

    private static instance: SadFace;
    static Instance():SadFace{
        if(!SadFace.instance){
            SadFace.instance = new SadFace();
        }
        return SadFace.instance;
    }

    setBuff(){
        super.setBuff();
        //降低攻击力
        this.host.atk*=0.5;
    }

    resumeBuff(){
        this.host.atk/=0.5;
    }



    start () {
        

    }
}
