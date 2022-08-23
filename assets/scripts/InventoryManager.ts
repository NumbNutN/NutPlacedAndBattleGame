// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class InventoryManager extends cc.Component {
    /*
    这个管理类负责管理下方物品放置栏
    当需要为物品栏添加一个新的物品
    在start()函数调用create()方法即可，传递一个cc.Prefab的字符串名
    Prefeb统一放置在assert/resources/prefabs
    如果该ts文件的路径转变，需要响应的修改create函数中的相对路径

    2022-08-13 创建该管理类
    2022-08-20 补充注释
    */

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
