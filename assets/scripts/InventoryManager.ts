// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class InventoryManager extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    itemFramePref: cc.Prefab = null;

    private _currentX = 100;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //加载物品框(Item Frame)
        let newFrame = cc.instantiate(this.itemFramePref);
        newFrame.setParent(this.node);
        newFrame.x = this._currentX;
        newFrame.y = 0;
        //物品框右移
        this.framePush();

        let newItem = new cc.Node();
        newItem.setParent(newFrame);
        newItem.addComponent(cc.Sprite);
        cc.loader.loadRes("nut_01",cc.SpriteFrame,(err,sp)=>{
            newItem.getComponent(cc.Sprite).spriteFrame = sp;
        });
        newItem.setPosition(0,0);
    }

    // update (dt) {}

    framePush(){
        this._currentX += 200;
    }

    create(res){
        //加载物品框(Item Frame)
        let newFrame = cc.instantiate(this.itemFramePref);
        newFrame.setParent(this.node);
        newFrame.x = this._currentX;
        newFrame.y = 0;
        //物品框右移
        this.framePush();

        let newItem = new cc.Node();
        newItem.setParent(newFrame);
        newItem.addComponent(cc.Sprite);
        cc.loader.loadRes(res,cc.SpriteFrame,(err,sp)=>{
            newItem.getComponent(cc.Sprite).spriteFrame = sp;
        });
        newItem.setPosition(0,0);
        
    }

    
}
