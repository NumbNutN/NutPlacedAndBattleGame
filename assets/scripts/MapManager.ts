// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapManager extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // cc.resources.load("3;21'55''S 63;15'15''W 909k",cc.SpriteFrame,(err,sp)=>{
        //     this.node.getComponent(cc.Sprite).spriteFrame = sp;
        // });  3.0.0
        cc.loader.loadRes("3;01'10''S 58;15'39''W 70k_1280x720",cc.SpriteFrame,(err,sp)=>{
            this.node.getComponent(cc.Sprite).spriteFrame = sp;
        });
    }

    // update (dt) {}
}

function CreateMap(){

}
