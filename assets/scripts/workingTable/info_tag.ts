// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MaterialBase } from "../materialTab/MaterialManager";
import State from "../State";
import CompoundBase from "./CompoundBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InfoTag extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    btn_make_compound_pref: cc.Prefab = null;

    cursorAimed: boolean = false;

    directingCompound: CompoundBase;

    //合成物贴图
    compoundIcon: cc.Node;
    //材料贴图列表
    materialIconList: cc.Node[] = [];
    //材料数量贴图
    materialNumLabelList: cc.Node[] = [];

    



    start () {
        this.directingCompound = State.selectedCompound;
            this.cursorAimed = true;
            
            //加载合成物贴图
            this.compoundIcon = new cc.Node();
            this.compoundIcon.addComponent(cc.Sprite);
            cc.loader.loadRes(this.directingCompound.itemIcon,cc.SpriteFrame,(err,sp)=>{
                this.compoundIcon.getComponent(cc.Sprite).spriteFrame = sp;
            });
            this.compoundIcon.setParent(this.node);
            this.compoundIcon.setPosition(-30,70);

            //加载材料贴图
            for(let material of this.directingCompound.materialConsumeList){
                //加载材料贴图
                let newMaterialIcon = new cc.Node();
                newMaterialIcon.addComponent(cc.Sprite);
                cc.loader.loadRes(material[0].icon,cc.SpriteFrame,(err,sp)=>{
                    newMaterialIcon.getComponent(cc.Sprite).spriteFrame = sp;
                });
                newMaterialIcon.setParent(this.node);
                newMaterialIcon.setPosition(-60,0);
                this.materialNumLabelList.push(newMaterialIcon);
                //加载材料数量
                let newNumLabel = new cc.Node();
                newNumLabel.color = cc.color(0,0,0);
                newNumLabel.addComponent(cc.Label);
                newNumLabel.getComponent(cc.Label).string = (material[1] as unknown) as string;
                newNumLabel.setParent(this.node);
                newNumLabel.setPosition(20,0);
                this.materialNumLabelList.push(newNumLabel);  
                //加载描述
                let descriptionLabel = new cc.Node();
                descriptionLabel.color = cc.color(0,0,0);
                descriptionLabel.addComponent(cc.Label);
                descriptionLabel.getComponent(cc.Label).string = this.directingCompound.description;
                descriptionLabel.setParent(this.node);
                descriptionLabel.getComponent(cc.Label).fontSize = 20;
                descriptionLabel.setPosition(0,-70);

                //加载button
                // let buildBtn = new cc.Node();
                // buildBtn.addComponent(cc.Button);
                let buildBtn = cc.instantiate(this.btn_make_compound_pref);
                buildBtn.setParent(this.node);
                buildBtn.setPosition(0,0);
                let buildEvent = new cc.Component.EventHandler();
                buildEvent.target = this.node;
                buildEvent.component = "info_tag";
                buildEvent.handler = "makeCompound";
                buildBtn.getComponent(cc.Button).clickEvents.push(buildEvent);
                buildBtn.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
                    //event.stopPropagation();
                    this.cursorAimed = true;
                })

            }
            this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
                this.cursorAimed = true;
            });
            
        // this.node.on(cc.Node.EventType.MOUSE_ENTER,(event)=>{
        //     event.cancelBubble = true;
        //     this.cursorAimed = true;
            
        //     //加载合成物贴图
        //     this.compoundIcon = new cc.Node();
        //     this.compoundIcon.addComponent(cc.Sprite);
        //     cc.loader.loadRes(this.directingCompound.itemIcon,cc.SpriteFrame,(err,sp)=>{
        //         this.compoundIcon.getComponent(cc.Sprite).spriteFrame = sp;
        //     });
        //     this.compoundIcon.setParent(this.node);
        //     this.compoundIcon.setPosition(-30,70);

        //     //加载材料贴图
        //     for(let material of this.directingCompound.materialConsumeList){
        //         //加载材料贴图
        //         let newMaterialIcon = new cc.Node();
        //         newMaterialIcon.addComponent(cc.Sprite);
        //         cc.loader.loadRes(material[0].icon,cc.SpriteFrame,(err,sp)=>{
        //             newMaterialIcon.getComponent(cc.Sprite).spriteFrame = sp;
        //         });
        //         newMaterialIcon.setParent(this.node);
        //         newMaterialIcon.setPosition(-60,0);
        //         this.materialNumLabelList.push(newMaterialIcon);
        //         //加载材料数量
        //         let newNumLabel = new cc.Node();
        //         newNumLabel.color = cc.color(0,0,0);
        //         newNumLabel.addComponent(cc.Label);
        //         newNumLabel.getComponent(cc.Label).string = (material[1] as unknown) as string;
        //         newNumLabel.setParent(this.node);
        //         newNumLabel.setPosition(20,0);
        //         this.materialNumLabelList.push(newNumLabel);  
        //         //加载描述
        //         let descriptionLabel = new cc.Node();
        //         descriptionLabel.color = cc.color(0,0,0);
        //         descriptionLabel.addComponent(cc.Label);
        //         descriptionLabel.getComponent(cc.Label).string = this.directingCompound.description;
        //         descriptionLabel.setParent(this.node);
        //         descriptionLabel.getComponent(cc.Label).fontSize = 20;
        //         descriptionLabel.setPosition(0,-70);

        //         //加载button
        //         // let buildBtn = new cc.Node();
        //         // buildBtn.addComponent(cc.Button);
        //         let buildBtn = cc.instantiate(this.btn_make_compound_pref);
        //         buildBtn.setParent(this.node);
        //         buildBtn.setPosition(0,0);
        //         let buildEvent = new cc.Component.EventHandler();
        //         buildEvent.target = this.node;
        //         buildEvent.component = "info_tag";
        //         buildEvent.handler = "makeCompound";
        //         buildBtn.getComponent(cc.Button).clickEvents.push(buildEvent);
        //         buildBtn.on(cc.Node.EventType.MOUSE_MOVE,(event)=>{
        //             //event.stopPropagation();
        //             this.cursorAimed = true;
        //         })

        //     }
        // })

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,(event)=>{
            this.cursorAimed = false;
            if(!this.node.getBoundingBoxToWorld().contains(event.getLocation())){
                this.node.destroy();
            }
        })

        
    }

    makeCompound(){
        let canMake: boolean = true;
        for(let material of this.directingCompound.materialConsumeList){
            canMake = canMake && material[0].checkConsumeAviliable(-material[1])
        }
        if(canMake){
            for(let material of this.directingCompound.materialConsumeList){
                material[0].changeOwnNum(-material[1])
            }
            this.directingCompound.createCompound();
        }
        
    }
}
