// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    castlePref :cc.Prefab = null;

    @property(cc.Prefab)
    healBarPref: cc.Prefab = null;

    @property(cc.Prefab)
    barPref: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let castleSp = cc.instantiate(this.castlePref);
        castleSp.setParent(this.node);
        castleSp.setPosition(0,0);

        //生成血条和盾
        let healBar = cc.instantiate(this.healBarPref);
        healBar.setParent(this.node);
        healBar.setPosition(0,80);

        let healBarFrame = cc.instantiate(this.barPref);
        healBarFrame.setParent(this.node);
        healBarFrame.setPosition(0,80);

    }

    start () {

    }

    // update (dt) {}
}
