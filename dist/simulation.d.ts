declare type LerpFunc = (n: number) => number;
declare type SimulationElementType = 'line' | 'circle' | 'polygon' | 'square' | 'arc' | 'collection';
export declare class Vector {
    x: number;
    y: number;
    mag: number;
    startAngle: number;
    startX: number;
    startY: number;
    rotation: number;
    constructor(x: number, y: number, r?: number);
    rotate(deg: number): this;
    rotateTo(deg: number): this;
    private setRotation;
    draw(c: CanvasRenderingContext2D, pos?: Point, color?: Color, thickness?: number): void;
    normalize(): this;
    multiply(n: number): this;
    sub(v: Vector): this;
    add(v: Vector): this;
    multiplyX(n: number): this;
    multiplyY(n: number): this;
    divide(n: number): this;
    appendMag(value: number): this;
    appendX(value: number): this;
    appendY(value: number): this;
    setX(value: number): this;
    setY(value: number): this;
    private updateMag;
    setMag(value: number): this;
    clone(): Vector;
    format(): string;
}
export declare class SimulationElement {
    pos: Point;
    color: Color;
    sim: HTMLCanvasElement | null;
    type: SimulationElementType | null;
    running: boolean;
    constructor(pos: Point, color?: Color, type?: SimulationElementType | null);
    end(): void;
    draw(_: CanvasRenderingContext2D): void;
    setSimulationElement(el: HTMLCanvasElement): void;
    fill(color: Color, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
    move(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
}
export declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    clone(): Color;
    private compToHex;
    toHex(): string;
}
export declare class Point extends Vector {
    constructor(x: number, y: number);
    clone(): Point;
}
export declare class SceneCollection extends SimulationElement {
    name: string;
    scene: SimulationElement[];
    idObjs: {
        [key: string]: SimulationElement;
    };
    constructor(name?: string);
    end(): void;
    add(element: SimulationElement, id?: string | null): void;
    removeWithId(id: string): void;
    removeWithObject(element: SimulationElement): void;
    setSimulationElement(sim: HTMLCanvasElement): void;
    draw(c: CanvasRenderingContext2D): void;
    empty(): void;
}
export declare class Line extends SimulationElement {
    startPoint: Point;
    endPoint: Point;
    rotation: number;
    thickness: number;
    vec: Vector;
    constructor(p1: Point, p2: Point, color?: Color, thickness?: number, r?: number);
    clone(): Line;
    setStart(p: Point, t?: number, f?: LerpFunc): Promise<void>;
    setEnd(p: Point, t?: number, f?: LerpFunc): Promise<void>;
    private setVector;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Point, t?: number): Promise<void>;
    move(v: Vector, t?: number): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
}
export declare class Circle extends SimulationElement {
    radius: number;
    startAngle: number;
    endAngle: number;
    counterClockwise: boolean;
    thickness: number;
    rotation: number;
    fillCircle: boolean;
    constructor(pos: Point, radius: number, color?: Color, startAngle?: number, endAngle?: number, thickness?: number, rotation?: number, fill?: boolean, counterClockwise?: boolean);
    setCounterClockwise(val: boolean): void;
    setFillCircle(val: boolean): void;
    draw(c: CanvasRenderingContext2D): void;
    scale(value: number, t?: number, f?: LerpFunc): Promise<void>;
    contains(p: Point): boolean;
    scaleRadius(scale: number, t?: number, f?: LerpFunc): Promise<void>;
    setRadius(value: number, t?: number, f?: LerpFunc): Promise<void>;
    setThickness(val: number, t?: number, f?: LerpFunc): Promise<void>;
    setStartAngle(angle: number, t?: number, f?: LerpFunc): Promise<void>;
    setEndAngle(angle: number, t?: number, f?: LerpFunc): Promise<void>;
    rotate(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    clone(): Circle;
}
export declare class Polygon extends SimulationElement {
    offsetPoint: Point;
    offsetX: number;
    offsetY: number;
    points: Point[];
    rotation: number;
    constructor(pos: Point, points: Point[], color: Color, r?: number, offsetPoint?: Point);
    setPoints(points: Point[], t?: number, f?: LerpFunc): Promise<void>;
    clone(): Polygon;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    private setPointRotation;
    draw(c: CanvasRenderingContext2D): void;
}
export declare class Square extends SimulationElement {
    width: number;
    height: number;
    rotation: number;
    private showNodeVectors;
    private showCollisionVectors;
    hovering: boolean;
    events: Event[];
    offsetPoint: Point;
    topLeft: Vector;
    topRight: Vector;
    bottomLeft: Vector;
    bottomRight: Vector;
    v1: Vector;
    v2: Vector;
    v3: Vector;
    v4: Vector;
    v5: Vector;
    constructor(pos: Point, width: number, height: number, color: Color, offsetPoint?: Point, rotation?: number);
    updateOffsetPosition(p: Point): void;
    setNodeVectors(show: boolean): void;
    setCollisionVectors(show: boolean): void;
    private setRotation;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
    scale(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleWidth(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleHeight(value: number, t?: number, f?: LerpFunc): Promise<void>;
    setWidth(value: number, t?: number): Promise<void>;
    setHeight(value: number, t?: number): Promise<void>;
    contains(p: Point): boolean;
    private updateDimensions;
    clone(): Square;
}
declare class Event {
    event: string;
    callback: Function;
    constructor(event: string, callback: Function);
}
export declare class Simulation {
    scene: SimulationElement[];
    idObjs: {
        [key: string]: SimulationElement;
    };
    fitting: boolean;
    private bgColor;
    canvas: HTMLCanvasElement | null;
    width: number;
    height: number;
    ratio: number;
    private running;
    private _prevReq;
    events: Event[];
    constructor(id: string);
    private render;
    end(): void;
    add(element: SimulationElement, id?: string | null): void;
    removeWithId(id: string): void;
    removeWithObject(element: SimulationElement): void;
    on<K extends keyof HTMLElementEventMap>(event: K, callback: Function): void;
    removeListener<K extends keyof HTMLElementEventMap>(event: K, callback: Function): void;
    fitElement(): void;
    setSize(x: number, y: number): void;
    setBgColor(color: Color): void;
    private resizeCanvas;
    empty(): void;
}
export declare function pythag(x: number, y: number): number;
export declare function distance(p1: Point, p2: Point): number;
export declare function degToRad(deg: number): number;
export declare function radToDeg(rad: number): number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function smoothStep(t: number): number;
export declare function linearStep(n: number): number;
/**
 * @param callback1 - called when t is 0
 * @param callback2 - called every frame until the animation is finished
 * @param callback3 - called after animation is finished
 * @param t - animation time (seconds)
 * @returns {Promise<void>}
 */
export declare function transitionValues(callback1: () => void, callback2: (percent: number) => boolean | void, callback3: () => void, t: number, func?: (n: number) => number): Promise<void>;
export declare function compare(val1: any, val2: any): boolean;
export declare function frameLoop<T extends (...args: any[]) => any>(cb: T): (...params: Parameters<T>) => void;
declare const _default: {
    Vector: typeof Vector;
    SimulationElement: typeof SimulationElement;
    Color: typeof Color;
    Point: typeof Point;
    SceneCollection: typeof SceneCollection;
    Line: typeof Line;
    Circle: typeof Circle;
    Polygon: typeof Polygon;
    Square: typeof Square;
    Simulation: typeof Simulation;
    pythag: typeof pythag;
    distance: typeof distance;
    degToRad: typeof degToRad;
    radToDeg: typeof radToDeg;
    transitionValues: typeof transitionValues;
    compare: typeof compare;
};
export default _default;
