enum NutType{
    NormalNut,
    Shooter,
    Builder,
    Killer,
    King
}


class Nut{

    protected _heal: number;
    protected _actionRandom: number;
    protected _atk: number;

    get heal(){
        return this._heal;
    }

    set heal(value){
        this._heal = value;
    }

    static Create(nutType: NutType){
        let nut: Nut;
        switch(nutType){
            case NutType.NormalNut:
                nut = new NormalNut();
        }
    }
}

class NormalNut extends Nut{
    
    constructor(){
        super();
        this._heal = 50;

    }
}

class Builder extends Nut{
    constructor(){
        super();
        this._heal = 100;
    }
}