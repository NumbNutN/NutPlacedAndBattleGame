// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { MaterialBase } from "../materialTab/MaterialManager";

@ccclass
export default class CompoundBase extends cc.Component {

    itemFrame: cc.Node = null;
    item: cc.Node = null;

    materialPref: string;

    @property(cc.Prefab)
    info_tag_pref: cc.Prefab = null;

    infoTag: cc.Node;

    //物品贴图
    itemIcon: string = "crossbow_side";

    //材料消耗列表
    materialConsumeList: [material:MaterialBase,quantity:number][];
    //描述
    description: string = "能够让人感到刺痛";

    createCompound(){
        
    }


    

    start(){
        
    }
}
