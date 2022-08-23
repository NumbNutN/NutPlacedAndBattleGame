import ComponentBase from "./ComponentBase";

enum NutType{
    NormalNut,
    Shooter,
    Builder,
    Killer,
    King
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Nut extends ComponentBase {
    //  private _heal: number;
    //  _actionRandom: number;
    //  _atk: number;

    //一回合移动机会
    moveChanceRemainder: number;
    //一回合攻击机会
    attackChanceRemainder: number;

    //攻击半径
    attackRadius: number;
    //移动半径
    moveRadius: number;

    //攻击力
    atk: number;

    mirrorNut: ComponentBase;

    moving(){

    }





    // get heal(){
    //     return this._heal;
    // }

    // set heal(value){
    //     this._heal = value;
    // }

    // static Create(nutType: NutType){
    //     let nut: Nut;
    //     switch(nutType){
    //         case NutType.NormalNut:
    //             nut = new NormalNut();
    //     }
    // }

}


// class NormalNut extends Nut{
    
//     constructor(){
//         super();
//         this._heal = 50;

//     }
// }

// class Builder extends Nut{
//     constructor(){
//         super();
//         this._heal = 100;
//     }
// }