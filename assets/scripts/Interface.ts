export interface SelectableCompo{
    OnMouseMove();
    OnMouseClick(err,event);
}

export interface PlacedItem{
    onMouseMove();
}

export interface Nut{
    heal: number;
}

export interface ValueObsever{
    ValueChanged(value: number);
}