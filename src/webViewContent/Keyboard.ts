import Entity from "./Entity"
import { spriteLocationData, coordinate } from "./types";


export default class Keyboard extends Entity {
    private keyPressed: string
    // private action: string
    constructor() {
        super(0, 0)
        this.keyPressed = '';
        this._sx = 5000;
        this._sy = 4500;
    }

    // inner logic of how we will assume which key was pressed based on the input log
    private processKeyPressed(log: string) {
        if (log == 'tab' || log == 'backSpace') {
            this.keyPressed = log
        }
        else if (log.length <= 1) {
            this.keyPressed = log
        } else if (log.slice(0, 2) === '\r\n') {
            this.keyPressed = '\r\n'
        } else {
            this.keyPressed = log[0]
        }
    }

    // if multiple key coordinates are given, then the location of key on the right(cat's pov) is give first
    public getKeyLocation(): coordinate[] {
        let result = [];
        let flag: boolean = true

        if (this.keyPressed === 'tab' || this.keyPressed === 'backSpace') {
            result.push(this.keyLocation[this.keyPressed])
            flag = false
        }

        // check if new character is an alphabet
        if (this.keyPressed.toUpperCase() != this.keyPressed.toLowerCase() && flag) {
            if (this.keyPressed.toLowerCase() in this.keyLocation) {
                result.push(this.keyLocation[this.keyPressed.toLowerCase()])
            }

            // add shift when new char is a capital letter
            if (this.keyPressed.toUpperCase() === this.keyPressed) {
                if (this.keyLocation[this.keyPressed.toLowerCase()].x < 264) { // the alphabet key is on the right side
                    result.push(this.keyLocation['lShift'])
                }
                else {
                    result.unshift(this.keyLocation['rShift'])
                }
            }

            flag = false
        }

        // 2. if the new character is a number, '\n'  or ' '
        if (!isNaN(Number(this.keyPressed)) && this.keyPressed in this.keyLocation && flag) {
            result.unshift(this.keyLocation[this.keyPressed])
            flag = false
        }

        // 3. special characters
        if (this.keyPressed in this.keyLocation && flag) {
            result.push(this.keyLocation[this.keyPressed])

            if (this.specialCharsWithShifts.includes(this.keyPressed)) {
                if (this.keyLocation[this.keyPressed.toLowerCase()].x < 264) { // the alphabet key is on the right side
                    result.push(this.keyLocation['lShift'])
                }
                else {
                    result.unshift(this.keyLocation['rShift'])
                }
            }
            flag = false
        }


        console.log(result)
        return result;
    }

    public updateKeyboard(changes: string) {
        this.processKeyPressed(changes)

        if (this.keyPressed in this.keyboardLocation) {
            this._sx = this.keyboardLocation[this.keyPressed].x;
            this._sy = this.keyboardLocation[this.keyPressed].y;
        }
        else {
            this._sx = 5000;
            this._sy = 4500;
        }
    }
    readonly keyLocation: spriteLocationData = {
        'q': { x: 392, y: 324 },
        'w': { x: 364, y: 316 },
        'e': { x: 337, y: 308 },
        'r': { x: 309, y: 300 },
        't': { x: 281, y: 292 },
        'y': { x: 254, y: 285 },
        'u': { x: 226, y: 277 },
        'i': { x: 198, y: 269 },
        'o': { x: 171, y: 261 },
        'p': { x: 143, y: 253 },
        'a': { x: 399, y: 300 },
        's': { x: 372, y: 293 },
        'd': { x: 345, y: 286 },
        'f': { x: 317, y: 279 },
        'g': { x: 290, y: 272 },
        'h': { x: 263, y: 264 },
        'j': { x: 236, y: 257 },
        'k': { x: 208, y: 250 },
        'l': { x: 181, y: 243 },
        'z': { x: 398, y: 277 },
        'x': { x: 371, y: 270 },
        'c': { x: 344, y: 263 },
        'v': { x: 317, y: 256 },
        'b': { x: 289, y: 248 },
        'n': { x: 262, y: 241 },
        'm': { x: 235, y: 234 },
        'lShift': { x: 431, y: 290 },
        'rShift': { x: 141, y: 213 },
        ' ': { x: 341, y: 242 },
        '\r\n': { x: 100, y: 222 },
        '\n': { x: 100, y: 222 },
        '1': { x: 398, y: 350 },
        '2': { x: 369, y: 340 },
        '3': { x: 340, y: 335 },
        '4': { x: 312, y: 327 },
        '5': { x: 283, y: 320 },
        '6': { x: 254, y: 312 },
        '7': { x: 225, y: 305 },
        '8': { x: 197, y: 297 },
        '9': { x: 168, y: 290 },
        '0': { x: 139, y: 282 },
        '!': { x: 398, y: 350 },
        '@': { x: 369, y: 342 },
        '#': { x: 340, y: 335 },
        '$': { x: 312, y: 327 },
        '%': { x: 283, y: 320 },
        '^': { x: 254, y: 307 },
        '&': { x: 225, y: 305 },
        '*': { x: 197, y: 297 },
        '(': { x: 168, y: 290 },
        '()': { x: 168, y: 290 },
        ')': { x: 139, y: 282 },

        //special character
        '`': { x: 424, y: 365 },
        '-': { x: 116, y: 273 },
        '=': { x: 86, y: 273 },
        '[': { x: 95, y: 242 },
        '[]': { x: 95, y: 242 },
        ']': { x: 70, y: 240 },
        '\\': { x: 72, y: 234 },
        ';': { x: 158, y: 236 },
        '\'': { x: 131, y: 231 },
        '\'\'': { x: 131, y: 231 },
        ',': { x: 212, y: 230 },
        '.': { x: 185, y: 223 },
        '/': { x: 158, y: 219 },

        //special character + shift
        '~': { x: 424, y: 365 },
        '_': { x: 116, y: 273 },
        '+': { x: 86, y: 273 },
        '{': { x: 95, y: 242 },
        '{}': { x: 95, y: 242 },
        '}': { x: 70, y: 240 },
        '|': { x: 72, y: 234 },
        ':': { x: 158, y: 236 },
        '"': { x: 131, y: 231 },
        '""': { x: 131, y: 231 },
        '<': { x: 212, y: 230 },
        '>': { x: 185, y: 223 },
        '?': { x: 158, y: 219 },

        // tab and backspace
        'tab': { x: 430, y: 340 },
        'backSpace': { x: 55, y: 254 }
    }

    private specialCharsWithShifts = ['~', '_', '+', '{', '{}', '}', '|', ':', '"', '""', '<', '>', '?', '!', '@', '#', '$', '%', '^', '&', '*', '(', '()', ')']

    readonly keyboardLocation: spriteLocationData = {
        'q': { x: 2000, y: 0 },
        'w': { x: 2500, y: 0 },
        'e': { x: 3000, y: 0 },
        'r': { x: 3500, y: 0 },
        't': { x: 4000, y: 0 },
        'y': { x: 4500, y: 0 },
        'u': { x: 5000, y: 0 },
        'i': { x: 0, y: 500 },
        'o': { x: 500, y: 500 },
        'p': { x: 1000, y: 500 },
        'a': { x: 1500, y: 500 },
        's': { x: 2000, y: 500 },
        'd': { x: 2500, y: 500 },
        'f': { x: 3000, y: 500 },
        'g': { x: 3500, y: 500 },
        'h': { x: 4000, y: 500 },
        'j': { x: 4500, y: 500 },
        'k': { x: 5000, y: 500 },
        'l': { x: 0, y: 1000 },
        'z': { x: 500, y: 1000 },
        'x': { x: 1000, y: 1000 },
        'c': { x: 1500, y: 1000 },
        'v': { x: 2000, y: 1000 },
        'b': { x: 2500, y: 1000 },
        'n': { x: 3000, y: 1000 },
        'm': { x: 3500, y: 1000 },
        'Q': { x: 4000, y: 1000 },
        'W': { x: 4500, y: 1000 },
        'E': { x: 5000, y: 1000 },
        'R': { x: 0, y: 1500 },
        'T': { x: 500, y: 1500 },
        'Y': { x: 1000, y: 1500 },
        'U': { x: 1500, y: 1500 },
        'I': { x: 2000, y: 1500 },
        'O': { x: 2500, y: 1500 },
        'P': { x: 3000, y: 1500 },
        'A': { x: 3500, y: 1500 },
        'S': { x: 4000, y: 1500 },
        'D': { x: 4500, y: 1500 },
        'F': { x: 5000, y: 1500 },
        'G': { x: 0, y: 2000 },
        'H': { x: 500, y: 2000 },
        'J': { x: 1000, y: 2000 },
        'K': { x: 1500, y: 2000 },
        'L': { x: 2000, y: 2000 },
        'Z': { x: 2500, y: 2000 },
        'X': { x: 3000, y: 2000 },
        'C': { x: 3500, y: 2000 },
        'V': { x: 4000, y: 2000 },
        'B': { x: 4500, y: 2000 },
        'N': { x: 5000, y: 2000 },
        'M': { x: 0, y: 2500 },
        ' ': { x: 0, y: 3000 },
        '\r\n': { x: 500, y: 3000 },
        '\n': { x: 500, y: 3000 },
        '1': { x: 500, y: 2500 },
        '2': { x: 1000, y: 2500 },
        '3': { x: 1500, y: 2500 },
        '4': { x: 2000, y: 2500 },
        '5': { x: 2500, y: 2500 },
        '6': { x: 3000, y: 2500 },
        '7': { x: 3500, y: 2500 },
        '8': { x: 4000, y: 2500 },
        '9': { x: 4500, y: 2500 },
        '0': { x: 5000, y: 2500 },


        '!': { x: 1000, y: 3000 },
        '@': { x: 1500, y: 3000 },
        '#': { x: 2000, y: 3000 },
        '$': { x: 2500, y: 3000 },
        '%': { x: 3000, y: 3000 },
        '^': { x: 3500, y: 3000 },
        '&': { x: 4000, y: 3000 },
        '*': { x: 4500, y: 3000 },
        '(': { x: 5000, y: 3000 },
        '()': { x: 0, y: 3500 },
        ')': { x: 500, y: 3500 },

        //special character
        '`': { x: 1000, y: 3500 },
        '-': { x: 1500, y: 3500 },
        '=': { x: 2000, y: 3500 },
        '[': { x: 2500, y: 3500 },
        '[]': { x: 3000, y: 3500 },
        ']': { x: 3500, y: 3500 },
        '\\': { x: 4000, y: 3500 },
        ';': { x: 4500, y: 3500 },
        '\'': { x: 5000, y: 3500 },
        '\'\'': { x: 0, y: 4000 },
        ',': { x: 500, y: 4000 },
        '.': { x: 1000, y: 4000 },
        '/': { x: 1500, y: 4000 },

        //special character + shift
        '~': { x: 2000, y: 4000 },
        '_': { x: 2500, y: 4000 },
        '+': { x: 3000, y: 4000 },
        '{': { x: 3500, y: 4000 },
        '{}': { x: 4000, y: 4000 },
        '}': { x: 4500, y: 4000 },
        '|': { x: 5000, y: 4000 },
        ':': { x: 0, y: 4500 },
        '"': { x: 500, y: 4500 },
        '""': { x: 1000, y: 4500 },
        '<': { x: 1500, y: 4500 },
        '>': { x: 2000, y: 4500 },
        '?': { x: 2500, y: 4500 },

        // tab and backspace
        'tab': { x: 3000, y: 4500 },
        'backSpace': { x: 3500, y: 4500 }
    }
}