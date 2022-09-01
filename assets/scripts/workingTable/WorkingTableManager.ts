// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ManagerBase from "../ManagerBase";
import CompoundBase from "./CompoundBase";

const {ccclass, property} = cc._decorator;


class Crossbow extends CompoundBase{
    
}

class Stone extends CompoundBase{
    materialPref = "stone_material";

    private static instance: Stone;
    static Instance():Stone{
        if(!Stone.instance){
            Stone.instance = new Stone();
        }
        return Stone.instance;
    }
}


@ccclass
export default class WorkingTableManager extends ManagerBase {

    //这里定义了各种材料的数量
    _stickNum: number;
    _stoneNum: number;

    @property(cc.Prefab)
    itemFramePref: cc.Prefab = null;

    static Instance: WorkingTableManager;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    private _currentY = -100;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        WorkingTableManager.Instance = this;
        this.createFrame("corssbow_compound_pref");

    }

    // update (dt) {}

    framePush(){
        this._currentY -= 200;
    }

    frameBack(){
        this._currentY += 200;
    }

    createFrame(res){
        //加载物品框(Item Frame)
        let itemFrame = cc.instantiate(this.itemFramePref);
        itemFrame.setParent(this.node);
        itemFrame.y = this._currentY;
        itemFrame.x = 0;
        //物品框下移
        this.framePush();

        cc.loader.loadRes("./prefebs/compound_prefabs/"+res,cc.Prefab,(err,pf)=>{
            if(!pf){
                console.debug("预制体为空");
            }
            let item = cc.instantiate(pf);
            if(item){
                console.debug("节点为空");
            }
            //绕过异步的问题
            item.setParent(itemFrame);
            item.setPosition(0,0);
        }) 

    }

    destroyFrame(obj: CompoundBase){
        obj.itemFrame?.destroy();
        obj.item?.destroy();
        //物品栏上移
        this.frameBack();
    }
}
