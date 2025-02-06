import Cat from "./Cat";
import Keyboard from "./Keyboard";
import { coordinate, spriteLocationData } from "./types";

export default class Drawer {
    private canvasContext: CanvasRenderingContext2D;
    private spriteSource: HTMLImageElement;
    private scale: number
    private spriteDefaultWidth: number
    private spriteDefaultHeight: number
    public cat;
    public keyboard;

    constructor(canvas: HTMLCanvasElement, cat: Cat, keyboard: Keyboard) {
        this.canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
        this.cat = cat;
        this.keyboard = keyboard;
        this.spriteSource = new Image();
        this.spriteDefaultHeight = this.spriteSource.height
        this.spriteDefaultWidth = this.spriteSource.width

        this.scale = Math.min(canvas.width / 500, 1)
    }

    public drawBeginningScreen() {
        this.spriteSource.onload = () => {
            this.spriteDefaultHeight = this.spriteSource.height
            this.spriteDefaultWidth = this.spriteSource.width
            this.canvasContext.drawImage(this.spriteSource, this.cat.sx, this.cat.sy, 500, 500, 0, 0, 500 * this.scale, 500 * this.scale);
            this.canvasContext.drawImage(this.spriteSource, this.keyboard.sx, this.keyboard.sy, 500, 500, 0, 0, 500 * this.scale, 500 * this.scale);
        }
        let buffer = document.getElementById("sprite") as HTMLImageElement
        this.spriteSource.src = buffer.src;
    }


    public drawCatTyping() {
        this.canvasContext.clearRect(0, 0, 500 * this.scale, 500 * this.scale)
        console.log(this.spriteSource.width, this.scale)
        this.canvasContext.drawImage(this.spriteSource, this.cat.sx, this.cat.sy, 500, 500, 0, 0, 500 * this.scale, 500 * this.scale);
        this.canvasContext.drawImage(this.spriteSource, this.keyboard.sx, this.keyboard.sy, 500, 500, 0, 0, 500 * this.scale, 500 * this.scale);

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
        this.canvasContext.moveTo(armData['startOuter'].x * this.scale, armData['startOuter'].y * this.scale);
        this.canvasContext.quadraticCurveTo(controlPoint.x * this.scale, controlPoint.y * this.scale, armData["endOuter"].x * this.scale, armData["endOuter"].y * this.scale);
        this.canvasContext.stroke();
        this.canvasContext.fill();

        controlPoint = this.findCurveControlPoint(armData['startInner'], armData['endInner'], keyLocation)
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = "white";
        this.canvasContext.moveTo(armData['startInner'].x * this.scale, armData['startInner'].y * this.scale);
        this.canvasContext.quadraticCurveTo(controlPoint.x * this.scale, controlPoint.y * this.scale, armData["endInner"].x * this.scale, armData["endInner"].y * this.scale);
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

    public updateScale(canvasSize: number) {
        this.scale = Math.min(canvasSize / 500, 1)
        // console.log(this.spriteSource.width, canvasSize)
    }
}

