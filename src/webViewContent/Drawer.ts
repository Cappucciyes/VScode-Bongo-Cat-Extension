import Cat from "./Cat";
import Keyboard from "./Keyboard";
import { coordinate, spriteLocationData } from "./types";

export default class Drawer {
    private canvasContext: CanvasRenderingContext2D;
    private spriteSource: HTMLImageElement;
    public cat;
    public keyboard;

    constructor(canvas: HTMLCanvasElement, cat: Cat, keyboard: Keyboard) {
        this.canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
        this.cat = cat;
        this.keyboard = keyboard;
        this.spriteSource = new Image();
    }

    public drawBeginningScreen() {
        this.spriteSource.onload = () => {
            this.canvasContext.drawImage(this.spriteSource, this.cat.sx, this.cat.sy, 500, 500, 0, 0, 500, 500);
            this.canvasContext.drawImage(this.spriteSource, this.keyboard.sx, this.keyboard.sy, 500, 500, 0, 0, 500, 500);
        }
        let buffer = document.getElementById("sprite") as HTMLImageElement
        this.spriteSource.src = buffer.src;
    }


    public drawCatTyping() {
        this.canvasContext.clearRect(0, 0, 500, 500)
        this.canvasContext.drawImage(this.spriteSource, this.cat.sx, this.cat.sy, 500, 500, 0, 0, 500, 500);
        this.canvasContext.drawImage(this.spriteSource, this.keyboard.sx, this.keyboard.sy, 500, 500, 0, 0, 500, 500);

        if (this.cat.getCatState == 'right') {
            this.drawArms(this.cat.getRightArmPoints, this.keyboard.getKeyLocation()[0])
        }
        else if (this.cat.getCatState == 'left') {
            this.drawArms(this.cat.getLeftArmPoints, this.keyboard.getKeyLocation()[0])
        }
        else if (this.cat.getCatState == 'both') {
            console.log("both arm event fired")
            this.drawArms(this.cat.getRightArmPoints, this.keyboard.getKeyLocation()[0])
            this.drawArms(this.cat.getLeftArmPoints, this.keyboard.getKeyLocation()[1])
        }
        else if (this.cat.getCatState == 'default') {
            console.log("default cat drawn")
        }
    }

    private drawArms(armData: spriteLocationData, keyLocation: coordinate) {
        let controlPoint: coordinate;

        controlPoint = this.findCurveControlPoint(armData['startOuter'], armData['endOuter'], keyLocation)
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = "black";
        this.canvasContext.moveTo(armData['startOuter'].x, armData['startOuter'].y);
        this.canvasContext.quadraticCurveTo(controlPoint.x, controlPoint.y, armData["endOuter"].x, armData["endOuter"].y);
        this.canvasContext.stroke();
        this.canvasContext.fill();

        controlPoint = this.findCurveControlPoint(armData['startInner'], armData['endInner'], keyLocation)
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = "white";
        this.canvasContext.moveTo(armData['startInner'].x, armData['startInner'].y);
        this.canvasContext.quadraticCurveTo(controlPoint.x, controlPoint.y, armData["endInner"].x, armData["endInner"].y);
        this.canvasContext.stroke();
        this.canvasContext.fill();
    }

    private findCurveControlPoint(start: coordinate, end: coordinate, middle: coordinate): coordinate {
        // Quadratic Bézier curves : B(t) = P2 + (1-t)^2(P0 - P1) +t^2(P2 - P1) in this case, t= 0.5
        let result: coordinate = {
            x: 2 * middle.x - 0.5 * end.x - 0.5 * start.x,
            y: 2 * middle.y - 0.5 * end.y - 0.5 * start.y
        }

        return result
    }
}

