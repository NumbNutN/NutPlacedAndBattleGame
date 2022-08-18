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
        
        this.create("item_NormalNut");
        this.create("item_Wall");
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

        // let newItem = new cc.Node();
        // newItem.setParent(newFrame);
        // newItem.addComponent(cc.Sprite);
        // cc.loader.loadRes(res,cc.SpriteFrame,(err,sp)=>{
        //     newItem.getComponent(cc.Sprite).spriteFrame = sp;
        // });
        // newItem.setPosition(0,0);

        let item: cc.Node;
        cc.loader.loadRes("./prefebs/"+res,cc.Prefab,(err,pf)=>{
            if(!pf){
                console.debug("预制体为空");
            }
            item = cc.instantiate(pf);
            if(!item){
                console.debug("节点为空");
            }
            //绕过异步的问题
            item.setParent(newFrame);
            item.setPosition(0,0); 
        })
        
    }

    
}
