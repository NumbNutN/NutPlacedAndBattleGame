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

    moveChanceRemainder: number;
    attackChanceRemainder: number;

    attackRadius: number;
    moveRadiusCircle: number;



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