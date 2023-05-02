export type LerpFunc = (n: number) => number;
type SimulationElementType = 'line' | 'circle' | 'polygon' | 'square' | 'arc' | 'collection';
type SimulationElement3dType = 'cube' | 'plane' | 'line';
export declare class LightSource {
    pos: Vector3;
    id: string;
    intensity: number;
    constructor(pos: Vector3, intensity?: number, id?: string);
}
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
    rotateX(val: number): void;
    rotateY(val: number): void;
    rotateZ(val: number): this;
    rotate(vec: Vector3): this;
    multiply(val: number): this;
    divide(val: number): this;
    add(vec: Vector3): this;
    sub(vec: Vector3): this;
    getMag(): number;
    getRotation(): Vector;
    dot(vec: Vector3): number;
    normalize(): this;
    cross(vec: Vector3): Vector3;
}
export declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    getRotation(): number;
    getMag(): number;
    rotate(deg: number): this;
    draw(c: CanvasRenderingContext2D, pos?: Vector, color?: Color, thickness?: number): void;
    normalize(): this;
    multiply(n: number): this;
    sub(v: Vector): this;
    add(v: Vector): this;
    divide(n: number): this;
    appendMag(value: number): this;
    dot(vec: Vector): number;
    clone(): Vector;
    format(): string;
}
export declare class SimulationElement {
    pos: Vector;
    color: Color;
    type: SimulationElementType | null;
    running: boolean;
    _3d: boolean;
    id: string;
    constructor(pos: Vector, color?: Color, type?: SimulationElementType | null, id?: string);
    end(): void;
    draw(_: CanvasRenderingContext2D): void;
    setId(id: string): void;
    fill(color: Color, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
    move(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
}
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a?: number);
    clone(): Color;
    private compToHex;
    toHex(): string;
}
export declare class SceneCollection extends SimulationElement {
    name: string;
    scene: (SimulationElement | SimulationElement3d)[];
    _isSceneCollection: boolean;
    camera: Camera;
    displaySurface: Vector3;
    ratio: number;
    lightSources: LightSource[];
    ambientLighting: number;
    planesSortFunc: (planes: Plane[], cam: Camera) => Plane[];
    constructor(name?: string);
    setSortFunc(func: (planes: Plane[], cam: Camera) => Plane[]): void;
    set3dObjects(cam: Camera, displaySurface: Vector3, ratio: number): void;
    setAmbientLighting(val: number): void;
    end(): void;
    setPixelRatio(num: number): void;
    add(element: SimulationElement | SimulationElement3d, id?: string | null): void;
    private updateSceneLightSources;
    setLightSources(sources: LightSource[]): void;
    addLightSource(source: LightSource): void;
    removeLightSourceWithId(id: string): void;
    getLightSourceWithId(id: string): LightSource | null;
    removeWithId(id: string): void;
    removeWithObject(element: SimulationElement): void;
    draw(c: CanvasRenderingContext2D): void;
    empty(): void;
}
export declare class SimulationElement3d {
    pos: Vector3;
    color: Color;
    type: SimulationElement3dType | null;
    running: boolean;
    _3d: boolean;
    id: string;
    lighting: boolean;
    constructor(pos: Vector3, color?: Color, lighting?: boolean, type?: SimulationElement3dType | null, id?: string);
    setLighting(val: boolean): void;
    setId(id: string): void;
    end(): void;
    draw(_ctx: CanvasRenderingContext2D, _camera: Camera, _displaySurface: Vector3, _ratio: number, _lightSources: LightSource[], _ambientLighting: number): void;
    fill(color: Color, t?: number, f?: LerpFunc): Promise<void>;
    moveTo(p: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    move(p: Vector3, t?: number, f?: LerpFunc): Promise<void>;
}
export declare class Line extends SimulationElement {
    startPoint: Vector;
    endPoint: Vector;
    thickness: number;
    constructor(p1: Vector, p2: Vector, color?: Color, thickness?: number);
    clone(): Line;
    setStart(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
    setEnd(p: Vector, t?: number, f?: LerpFunc): Promise<void>;
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
    constructor(pos: Vector, points: Vector[], color?: Color, r?: number, offsetPoint?: Vector);
    setPoints(points: Vector[], t?: number, f?: LerpFunc): Promise<void>;
    clone(): Polygon;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
}
export declare class Plane extends SimulationElement3d {
    points: Vector3[];
    wireframe: boolean;
    fillPlane: boolean;
    constructor(pos: Vector3, points: Vector3[], color?: Color, fill?: boolean, wireframe?: boolean, lighting?: boolean);
    clone(): Plane;
    setPoints(points: Vector3[], t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D, camera: Camera, displaySurface: Vector3, ratio: number, lightSources: LightSource[], ambientLighting: number): void;
    getNormals(): Vector3[];
    getCenter(): Vector3;
}
export declare class Cube extends SimulationElement3d {
    width: number;
    height: number;
    depth: number;
    planes: Plane[];
    points: Vector3[];
    rotation: Vector3;
    fillCube: boolean;
    wireframe: boolean;
    constructor(pos: Vector3, width: number, height: number, depth: number, color?: Color, rotation?: Vector3, fill?: boolean, wireframe?: boolean, lighting?: boolean);
    generatePoints(): void;
    private generatePlanes;
    private updatePoints;
    private updatePlanes;
    rotate(amount: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(amount: Vector3, t?: number, f?: LerpFunc): Promise<void>;
    setHeight(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    setDepth(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    setWidth(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleHeight(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleWidth(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleDepth(amount: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D, camera: Camera, displaySurface: Vector3, _ratio: number, lightSources: LightSource[], ambientLighting: number): void;
}
export declare class Square extends SimulationElement {
    width: number;
    height: number;
    rotation: number;
    private showNodeVectors;
    hovering: boolean;
    offsetPoint: Vector;
    topLeft: Vector;
    topRight: Vector;
    bottomLeft: Vector;
    bottomRight: Vector;
    constructor(pos: Vector, width: number, height: number, color?: Color, offsetPoint?: Vector, rotation?: number);
    private generateVectors;
    updateOffsetPosition(p: Vector): void;
    setNodeVectors(show: boolean): void;
    rotate(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    rotateTo(deg: number, t?: number, f?: LerpFunc): Promise<void>;
    draw(c: CanvasRenderingContext2D): void;
    scale(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleWidth(value: number, t?: number, f?: LerpFunc): Promise<void>;
    scaleHeight(value: number, t?: number, f?: LerpFunc): Promise<void>;
    setWidth(value: number, t?: number, f?: LerpFunc): Promise<void>;
    setHeight(value: number, t?: number, f?: LerpFunc): Promise<void>;
    contains(p: Vector): boolean;
    clone(): Square;
}
declare class Event {
    event: string;
    callback: Function;
    constructor(event: string, callback: Function);
}
export declare class Line3d extends SimulationElement3d {
    p1: Vector3;
    p2: Vector3;
    thickness: number;
    constructor(p1: Vector3, p2: Vector3, color?: Color, thickness?: number, lighting?: boolean, id?: string);
    draw(ctx: CanvasRenderingContext2D, camera: Camera, displaySurface: Vector3, ratio: number): void;
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
    forward: Vector3;
    backward: Vector3;
    left: Vector3;
    right: Vector3;
    up: Vector3;
    down: Vector3;
    lightSources: LightSource[];
    ambientLighting: number;
    planesSortFunc: (planes: Plane[], cam: Camera) => Plane[];
    constructor(el: string | HTMLCanvasElement, cameraPos?: Vector3, cameraRot?: Vector3, displaySurfaceDepth?: number, center?: Vector, displaySurfaceSize?: Vector);
    setSortFunc(func: (planes: Plane[], cam: Camera) => Plane[]): void;
    private updateSceneLightSources;
    setLightSources(sources: LightSource[]): void;
    addLightSource(source: LightSource): void;
    removeLightSourceWithId(id: string): void;
    getLightSourceWithId(id: string): LightSource | null;
    setAmbientLighting(val: number): void;
    setDirections(): void;
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
export declare function distance3d(vec1: Vector3, vec2: Vector3): number;
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
export declare function transitionValues(callback1: () => void, callback2: (deltaT: number, t: number) => boolean, callback3: () => void, transitionLength: number, func?: (n: number) => number): Promise<void>;
export declare function compare(val1: any, val2: any): boolean;
type Shift<T extends any[]> = ((...args: T) => any) extends (arg1: any, ...rest: infer R) => any ? R : never;
export declare function frameLoop<T extends (...args: any[]) => any>(cb: T): (...params: Shift<Parameters<T>>) => void;
type ProjectedPoint = {
    point: Vector;
    behindCamera: boolean;
};
export declare function sortPlanes(planes: Plane[], camera: Camera): Plane[];
export declare function projectPoint(p: Vector3, cam: Camera, displaySurface: Vector3): ProjectedPoint;
export declare function randInt(range: number, min?: number): number;
export declare function randomColor(): Color;
export declare function vector3DegToRad(vec: Vector3): Vector3;
export declare function vector3RadToDeg(vec: Vector3): Vector3;
export declare function angleBetweenVector3(vec1: Vector3, vec2: Vector3): number;
export declare function clamp(value: number, min: number, max: number): number;
declare const _default: {
    Vector: typeof Vector;
    SimulationElement: typeof SimulationElement;
    SimulationElement3d: typeof SimulationElement3d;
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
    Camera: typeof Camera;
    Plane: typeof Plane;
    lerp: typeof lerp;
    smoothStep: typeof smoothStep;
    linearStep: typeof linearStep;
    frameLoop: typeof frameLoop;
    randInt: typeof randInt;
    randomColor: typeof randomColor;
    vector3DegToRad: typeof vector3DegToRad;
    vector3RadToDeg: typeof vector3RadToDeg;
    angleBetweenVector3: typeof angleBetweenVector3;
    clamp: typeof clamp;
    Line3d: typeof Line3d;
    sortPlanes: typeof sortPlanes;
};
export default _default;
