interface coordinate {
    x: number;
    y: number;
}

interface spriteLocationData {
    [key: string]: coordinate
}


export { coordinate, spriteLocationData }