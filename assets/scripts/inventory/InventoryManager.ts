// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum InventoryItemProperty{
    INHERENT,    //固有的，依照某些条件使用的
    COMSUMEABLE  //消耗的，使用后即消失
}

export class InventoryItemBase{
    itemFrame: cc.Node = null;
    item: cc.Node = null;

    itemPref: string;

    _ownNum: number = 0;

    showNumLabel: cc.Node;

    icon: string;

    changeOwnNum(value){
        console.debug("弩箭数量改变");
        //当该物品已存在时
        if(this._ownNum){
            //如果刚好消耗完
            if(this._ownNum+value==0){
                this._ownNum = 0;
                InventoryManager.Instance.destroyFrame(this);
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
                InventoryManager.Instance.createFrame(this.itemPref,this);
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

export class ItemCrossbow extends InventoryItemBase{
    itemPref = "item_crossbow_pref";

    private static instance: ItemCrossbow;
    static Instance():ItemCrossbow{
        if(!ItemCrossbow.instance){
            ItemCrossbow.instance = new ItemCrossbow();
        }
        return ItemCrossbow.instance;
    }
}


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

    static Instance: InventoryManager;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        InventoryManager.Instance = this;
        this.create("item_NormalNut");
        this.create("item_Wall");
    }

    // update (dt) {}

    framePush(){
        this._currentX += 200;
    }

    frameBack(){
        this._currentX -= 200;
    }

    create(res){
        //加载物品框(Item Frame)
        let newFrame = cc.instantiate(this.itemFramePref);
        newFrame.setParent(this.node);
        newFrame.x = this._currentX;
        newFrame.y = 0;
        //物品框右移
        this.framePush();

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

    //2022-8-28
    createFrame(res,obj: InventoryItemBase){
        //加载物品框(Item Frame)
        console.debug("生成弩箭");
        obj.itemFrame = cc.instantiate(this.itemFramePref);
        obj.itemFrame.setParent(this.node);
        obj.itemFrame.x = this._currentX;
        obj.itemFrame.y = 0;
        //物品框右移
        this.framePush();

        cc.loader.loadRes("./prefebs/inventory_item_prefabs/"+res,cc.Prefab,(err,pf)=>{
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

    destroyFrame(obj: InventoryItemBase){
        obj.itemFrame?.destroy();
        obj.item?.destroy();
        obj.showNumLabel?.destroy();
        //物品栏上移
        this.frameBack();
    }    
}
