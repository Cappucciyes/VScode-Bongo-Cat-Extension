import Entity from "./Entity";
import { coordinate, spriteLocationData } from "./types";

export default class Cat extends Entity {
    private catState: string;
    // private armData: spriteLocationData | undefined;

    constructor(keyLocation: coordinate[]) {
        super(0, 0)

        if (keyLocation.length === 0) {
            this.catState = 'default'
        } else if (keyLocation.length === 1) {
            if (keyLocation[0].x > 264) {
                this.catState = 'left'
                this._sx = 1000
                this._sy = 0
            }
            else {
                this.catState = 'right'
                this._sx = 500
                this._sy = 0
            }
        }
        else {
            this.catState = 'both'
            this._sx = 1500
            this._sy = 0
        }
    }

    get getCatState() {
        return this.catState
    }

    get getRightArmPoints() {
        return this.rightArmPoints;
    }

    get getLeftArmPoints() {
        return this.leftArmPoints;
    }

    public updateCat(newKeyLocation: coordinate[]) {
        if (newKeyLocation.length === 0) {
            this.catState = 'default'
            this._sx = 0;
            this._sy = 0
        } else if (newKeyLocation?.length === 1) {
            if (newKeyLocation[0].x > 264) {
                this.catState = 'left'
                this._sx = 1000
                this._sy = 0
            }
            else {
                this.catState = 'right'
                this._sx = 500
                this._sy = 0
            }
        }
        else {
            this.catState = 'both'
            this._sx = 1500
            this._sy = 0
        }
    }

    // starting point and the ending point of arms (which is drawn with Bezier curve)
    // if no hands are needed to be drawn (catState == 'default'), then it is undefined
    private leftArmPoints: spriteLocationData = {
        'startOuter': { x: 377, y: 215 },
        'startInner': { x: 381, y: 217 },
        'endInner': { x: 445, y: 238 },
        'endOuter': { x: 448, y: 242 },
    }

    private rightArmPoints: spriteLocationData = {
        'startOuter': { x: 194, y: 180 },
        'startInner': { x: 199, y: 181 },
        'endInner': { x: 252, y: 195 },
        'endOuter': { x: 255, y: 196 },
    }
}