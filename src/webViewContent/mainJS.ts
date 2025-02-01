import Keyboard from './Keyboard'
import Cat from './Cat'
import Drawer from './Drawer'


const CANVAS: HTMLCanvasElement = document.getElementById("mainCanvas") as HTMLCanvasElement
const CANVAS_SIZE = 500

function main() {
    let keyboard: Keyboard = new Keyboard();
    console.log("main called")

    let cat = new Cat(keyboard.getKeyLocation())

    if (CANVAS) {
        CANVAS.height = CANVAS_SIZE
        CANVAS.width = CANVAS_SIZE
    }

    let drawer: Drawer = new Drawer(CANVAS, cat, keyboard)
    drawer.drawBeginningScreen();

    window.addEventListener('resize', () => {
        CANVAS.height = 500
        CANVAS.width = 500;

        drawer.drawBeginningScreen();
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