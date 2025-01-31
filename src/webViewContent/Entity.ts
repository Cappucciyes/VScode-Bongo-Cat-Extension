export default class Entity {
    protected _sx: number;
    protected _sy: number;

    constructor(startingPointX: number, startingPointY: number) {
        this._sx = startingPointX;
        this._sy = startingPointY;
    }


    get sx() {
        return this._sx;
    }

    get sy() {
        return this._sy;
    }
}



