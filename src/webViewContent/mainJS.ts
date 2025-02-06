import Keyboard from './Keyboard'
import Cat from './Cat'
import Drawer from './Drawer'


const CANVAS: HTMLCanvasElement = document.getElementById("mainCanvas") as HTMLCanvasElement
const DEFAULT_SIZE = 500

function main() {
    let keyboard: Keyboard = new Keyboard();
    console.log("main called")

    let cat = new Cat(keyboard.getKeyLocation())

    if (CANVAS) {
        CANVAS.height = Math.min(DEFAULT_SIZE, window.innerWidth)
        CANVAS.width = Math.min(DEFAULT_SIZE, window.innerWidth)
    }

    let drawer: Drawer = new Drawer(CANVAS, cat, keyboard)
    drawer.drawBeginningScreen();

    window.addEventListener('resize', () => {
        if (window.innerWidth < 500) {
            CANVAS.height = window.innerWidth
            CANVAS.width = window.innerWidth;
        }
        else {
            CANVAS.height = DEFAULT_SIZE
            CANVAS.width = DEFAULT_SIZE;
        }

        drawer.updateScale(CANVAS.width);
        drawer.drawCatTyping();
    })

    window.addEventListener('message', (event) => {
        const message = event.data
        switch (message.action) {
            case 'default':
                drawer.keyboard.updateKeyboard('')
                drawer.cat.updateCat([])
                drawer.drawCatTyping()
                break;
            case 'typing':
                drawer.keyboard.updateKeyboard(message.changes)
                drawer.cat.updateCat(drawer.keyboard.getKeyLocation())
                drawer.drawCatTyping()
                break;
            case 'tab':
                drawer.keyboard.updateKeyboard('tab')
                drawer.cat.updateCat(drawer.keyboard.getKeyLocation())
                drawer.drawCatTyping()
                break;
            case 'backSpace':
                drawer.keyboard.updateKeyboard('backSpace')
                drawer.cat.updateCat(drawer.keyboard.getKeyLocation())
                drawer.drawCatTyping()
                break;
            default:
                console.log("message recieved but no actions were taken")
        }
    })
}

main()