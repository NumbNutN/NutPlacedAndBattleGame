import { Mode,Process } from "./State";

export interface SelectableCompo{
    OnMouseMove();
    OnMouseClick(err,event);
}

export interface PlacedItem{
    onMouseMove();
}

export interface Nut{
    heal: number;
    tarX: number;
    tarY: number;
    moveChanceRemainder: number;
    attackChanceRemainder: number;


}

export interface ValueObsever{
    ValueChanged(value: number);
}

