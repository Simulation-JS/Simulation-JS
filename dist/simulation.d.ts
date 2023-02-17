declare type LerpFunc = (n: number) => number;
declare type SimulationElementType = 'line' | 'circle' | 'polygon' | 'square' | 'arc' | 'collection';
declare type SimulationElement3dType = 'cube';
export declare class Camera {
    pos: Vector3;
    rot: Vector3;
    constructor(pos: Vector3, rot: Vector3);
}
export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    format(): string;
    clone(): Vector3;
    multiply(val: number): this;
    add(vec: Vector3): this;
}
export declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    getRotation(): number;
    getMag(): number;
    rotate(deg: number): this;
    rotateTo(deg: number): this;
    draw(c: CanvasRenderingContext2D, pos?: Vector, color?: Color, thickness?: number): void;
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
    setMag(value: number): this;
    clone(): Vector;
    format(): string;
}
export declare class SimulationElement {
    pos: Vector;
    color: Color;
    sim: HTMLCanvasElement | null;
    type: SimulationElementType | null;
    running: boolean;
    _3d: boolean;
    id: string;
    constructor(pos: Vector, color?: Color, type?: SimulationElementType | null, id?: string);
    end(): void;
    draw(_: CanvasRenderingContext2D): void;
    setSimulationElement(el: HTMLCanvasElement): void;
    setId(id: string): void;
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
export declare class SceneCollection extends SimulationElement {
    name: string;
    scene: (SimulationElement | SimulationElement3d)[];
    sim: HTMLCanvasElement | null;
    _isSceneCollection: boolean;
    camera: Camera;
    displaySurface: Vector3;
    ratio: number;
    constructor(name?: string);
    set3dObjects(cam: Camera, displaySurface: Vector3, ratio: number): void;
    end(): void;
    setPixelRatio(num: number): void;
    add(element: SimulationElement, id?: string | null): void;
    removeWithId(id: string): void;
    removeWithObject(element: SimulationElement): void;
    setSimulationElement(sim: HTMLCanvasElement): void;
    draw(c: CanvasRenderingContext2D): void;
    empty(): void;
}
export declare class SimulationElement3d {
    pos: Vector3;
    color: Color;
    sim: HTMLCanvasElement | null;
    type: SimulationElement3dType | null;
    running: boolean;
    _3d: boolean;
    id: string;
    constructor(pos: Vector3, color?: Color, type?: SimulationElement3dType | null, id?: string);
    setId(id: string): void;
    end(): void;
    draw(_ctx: CanvasRenderingContext2D, _camera: Camera, _displaySurface: Vector3, _ratio: number): void;
    setSimulationElement(el: HTMLCanvasElement): void;
    fill(color: Color, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    move(p: Vector3, t?: number, f?: LerpFunc): Promise<void>;
}
export declare class Line extends SimulationElement {
    startPoint: Vector;
    endPoint: Vector;
    rotation: number;
    thickness: number;
    vec: Vector;
    constructor(p1: Vector, p2: Vector, color?: Color, thickness?: number, r?: number);
    clone(): Line;
    setStart(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
    setEnd(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
    private setVector;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Vector, t?: number): Promise<void>;
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
    constructor(pos: Vector, radius: number, color?: Color, startAngle?: number, endAngle?: number, thickness?: number, rotation?: number, fill?: boolean, counterClockwise?: boolean);
    setCounterClockwise(val: boolean): void;
    setFillCircle(val: boolean): void;
    draw(c: CanvasRenderingContext2D): void;
    scale(value: number, t?: number, f?: LerpFunc): Promise<void>;
    contains(p: Vector): boolean;
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
    offsetPoint: Vector;
    points: Vector[];
    rotation: number;
    constructor(pos: Vector, points: Vector[], color: Color, r?: number, offsetPoint?: Vector);
    setPoints(points: Vector[], t?: number, f?: LerpFunc): Promise<void>;
    clone(): Polygon;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
}
export declare class Cube extends SimulationElement3d {
    width: number;
    height: number;
    depth: number;
    points: Vector3[];
    constructor(pos: Vector3, x: number, y: number, z: number, color?: Color);
    draw(c: CanvasRenderingContext2D, camera: Camera, displaySurface: Vector3, ratio: number): void;
}
export declare class Square extends SimulationElement {
    width: number;
    height: number;
    rotation: number;
    private showNodeVectors;
    private showCollisionVectors;
    hovering: boolean;
    events: Event[];
    offsetPoint: Vector;
    topLeft: Vector;
    topRight: Vector;
    bottomLeft: Vector;
    bottomRight: Vector;
    v1: Vector;
    v2: Vector;
    v3: Vector;
    v4: Vector;
    v5: Vector;
    constructor(pos: Vector, width: number, height: number, color?: Color, offsetPoint?: Vector, rotation?: number);
    private resetVectors;
    updateOffsetPosition(p: Vector): void;
    setNodeVectors(show: boolean): void;
    setCollisionVectors(show: boolean): void;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
    scale(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleWidth(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleHeight(value: number, t?: number, f?: LerpFunc): Promise<void>;
    setWidth(value: number, t?: number): Promise<void>;
    setHeight(value: number, t?: number): Promise<void>;
    contains(p: Vector): boolean;
    private updateDimensions;
    clone(): Square;
}
declare class Event {
    event: string;
    callback: Function;
    constructor(event: string, callback: Function);
}
export declare class Simulation {
    scene: (SimulationElement | SimulationElement3d)[];
    fitting: boolean;
    bgColor: Color;
    canvas: HTMLCanvasElement | null;
    width: number;
    height: number;
    ratio: number;
    running: boolean;
    _prevReq: number;
    events: Event[];
    ctx: CanvasRenderingContext2D | null;
    camera: Camera;
    center: Vector;
    displaySurface: Vector3;
    constructor(id: string, cameraPos?: Vector3, cameraRot?: Vector3, displaySurfaceDepth?: number, center?: Vector, displaySurfaceSize?: Vector);
    render(c: CanvasRenderingContext2D): void;
    end(): void;
    add(element: SimulationElement | SimulationElement3d, id?: string | null): void;
    removeWithId(id: string): void;
    removeWithObject(element: SimulationElement): void;
    on<K extends keyof HTMLElementEventMap>(event: K, callback: Function): void;
    removeListener<K extends keyof HTMLElementEventMap>(event: K, callback: Function): void;
    fitElement(): void;
    setSize(x: number, y: number): void;
    setBgColor(color: Color): void;
    resizeCanvas(c: HTMLCanvasElement | null): void;
    empty(): void;
    moveCamera(v: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    moveCameraTo(v: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    rotateCamera(v: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    rotateCameraTo(v: Vector3, t?: number, f?: LerpFunc): Promise<void>;
}
export declare function pythag(x: number, y: number): number;
export declare function distance(p1: Vector, p2: Vector): number;
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
export declare function transitionValues(callback1: () => void, callback2: (percent: number) => boolean, callback3: () => void, t: number, func?: (n: number) => number): Promise<void>;
export declare function compare(val1: any, val2: any): boolean;
export declare function frameLoop<T extends (...args: any[]) => any>(cb: T): (...params: Parameters<T>) => void;
export declare function projectPoint(p: Vector3, cam: Camera, displaySurface: Vector3): Vector;
declare const _default: {
    Vector: typeof Vector;
    SimulationElement: typeof SimulationElement;
    Color: typeof Color;
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
    Cube: typeof Cube;
};
export default _default;
