import { Mode } from "./State";

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
}

export interface ValueObsever{
    ValueChanged(value: number);
}

export interface ModeObsever{
    ModeChanged(mode:Mode);
}