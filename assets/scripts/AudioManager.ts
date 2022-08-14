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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //播放器
        let player: cc.AudioSource = this.getComponent(cc.AudioSource);
        //加载音频
        cc.loader.loadRes("goat",cc.AudioClip,(res,clip)=>{
            //赋值音频
            player.clip = clip;
            //播放
            player.play();
            //是否正在播放
            //player.isPlaying :boolean
            //暂停
            player.pause();
            //恢复
            player.resume();
            //停止
            player.stop();
            //是否循环播放
            player.loop = true;
            player.volume = 1;
        });

    }

    // update (dt) {}
}
