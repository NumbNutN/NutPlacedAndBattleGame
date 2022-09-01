// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { ItemCrossbow } from "../inventory/InventoryManager";
import { MaterialBase } from "../materialTab/MaterialManager";
import { Stick } from "../materialTab/MaterialManager";
import State from "../State";
import CompoundBase from "./CompoundBase";

@ccclass
export default class CrossbowCompound extends CompoundBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    info_tag_pref: cc.Prefab = null;

    infoTag: any;

    static instance: CrossbowCompound;

    //物品贴图
    itemIcon: string = "crossbow_side";

    //材料消耗列表
    materialConsumeList: [material:MaterialBase,quantity:number][] = [
        [Stick.Instance(),2]
    ];
    //描述
    description: string = "能够让人感到刺痛";

    start () {
        CrossbowCompound.instance = this;
        //给选项框设置鼠标进入事件
        this.node.getParent().on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
            this.infoTag?.destroy();
            this.infoTag = cc.instantiate(this.info_tag_pref);
            this.infoTag.setParent(this.node);
            this.infoTag.setScale(2,2);
            this.infoTag.setPosition(-200,-100);
            //取消aim
            this.infoTag.cursorAimed = false;
        })
        //存储当前选中的合成物
        State.selectedCompound = this;

        this.node.getParent().on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            if(!this.node.getBoundingBoxToWorld().contains(event.getLocation())){
                if(!this.infoTag?.cursorAimed){
                    this.infoTag?.destroy();
                }
            }
            
            
        })

    }

    //生成弩箭到仓库Inventory
    createCompound(){
        ItemCrossbow.Instance().changeOwnNum(1);
    }

    // update (dt) {}
}
