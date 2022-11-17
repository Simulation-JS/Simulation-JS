declare module 'simulationjs' {
  declare class Vector {
    x: number;
    y: number;
    mag: number;
    startAngle: number;
    startX: number;
    startY: number;
    rotation: number;
    constructor(x: number, y: number, r = 0);
    rotate: (deg: number) => void;
    rotateTo: (deg: number) => void;
    #setRotation: () => void;
    draw: (
      c: CanvasRenderingContext2D,
      pos = new Point(0, 0),
      color = '#000000',
      s = 1,
      t = 1
    ) => void;
    normalize: () => void;
    multiply: (n: number) => void;
    multiplyX: (n: number) => void;
    multiplyY: (n: number) => void;
    divide: (n: number) => void;
    appendMag: (value: number) => void;
    appendX: (value: number) => void;
    appendY: (value: number) => void;
    setX: (value: number) => void;
    setY: (value: number) => void;
    #updateMag: () => void;
    setMag: (value: number) => void;
    clone: () => Vector;
    format: () => string;
  }

  declare class SimulationElement {
    pos: Point;
    color: Color;
    sim: HTMLCanvasElement | null;
    constructor(pos: Point, color = new Color(0, 0, 0));
    setSimulationElement: (el: HTMLCanvasElement) => void;
    fill: (color: Color, t = 0) => Promise;
    moveTo: (p: Point, t = 0) => Promise;
    move: (p: Point, t = 0) => Promise;
  }

  declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    #compToHex: (c: number) => string;
    toHex: () => string;
  }

  declare class Point extends Vector {
    constructor(x: number, y: number);
    clone: () => Point;
    add: (p: Point) => Point;
    format: () => string;
  }

  declare class SceneCollection extends SimulationElement {
    name: string;
    scene: SimulationElement[];
    idObjs: {
      [key: string]: SimulationElement;
    };
    constructor(n = '');
    add: (element: SimulationElement, id: string | null = null) => void;
    removeWithId: (id: string) => void;
    removeWithObject: (element: SimulationElement) => void;
    setSimulationElement: (sim: HTMLCanvasElement) => void;
    draw: (c: CanvasRenderingContext2D) => void;
  }

  declare class Line extends SimulationElement {
    start: Point;
    end: Point;
    rotation: number;
    thickness: number;
    constructor(p1: Point, p2: Point, thickness: number, color: Color, r = 0);
    clone: () => Line;
    setStart: (p: Point, t = 0) => Promise;
    setEnd: (p: Point, t = 0) => Promise;
    #setVector: () => void;
    rotate: (deg: number, t = 0) => Promise;
    rotateTo: (deg: number, t = 0) => Promise;
    moveTo: (p: Point, t = 0) => Promise;
    move: (v: Vector, t = 0) => Promise;
    draw: (c: CanvasRenderingContext2D) => Promise;
  }

  declare class Circle extends SimulationElement {
    radius: number;
    hovering: boolean;
    events: string[];
    constructor(pos: Point, radius: number, color: Color);
    clone: () => Circle;
    draw: (c: CanvasRenderingContext2D) => void;
    setRadius: (value: number, t = 0) => Promise;
    scale: (value: number, t = 0) => Promise;
    #checkEvents: () => void;
    on: (event: string, callback1: Function, callback2: Function) => void;
    contains: (p: Point) => void;
  }

  declare class Polygon extends SimulationElement {
    rawPoints: Point[];
    offsetPoint: Point;
    offsetX: number;
    offsetY: number;
    points: Point[];
    rotation: number;
    constructor(
      pos: Point,
      points: Point[],
      color: Color,
      r = 0,
      offsetPoint = new Point(0, 0)
    );
    setPoints: (points: Point[]) => void;
    clone: () => Polygon;
    rotate: (deg: number) => void;
    rotateTo: (deg: number) => void;
    #setRotation: () => void;
    draw: (c: CanvasRenderingContext2D) => void;
  }

  declare class Event {
    name: string;
    callback: string;
    constructor(name: string, callback: Function);
  }

  declare class Square extends SimulationElement {
    width: number;
    height: number;
    rotation: number;
    showNodeVectors: boolean;
    showCollisionVectors: boolean;
    hovering: boolean;
    events: string[];
    constructor(
      pos: Point,
      width: number,
      height: number,
      color: Color,
      offsetPoint = new Point(0, 0),
      rotation = 0
    );
    updateOffsetPosition: (p: Point) => void;
    setNodeVectors: (show: boolean) => void;
    setCollisionVectors: (show: boolean) => void;
    #setRotation: () => void;
    rotate: (deg: number, t = 0) => Promise;
    rotateTo: (deg: number, t = 0) => Promise;
    draw: (c: CanvasRenderingContext2D) => void;
    scale: (value: number, t = 0) => Promise;
    #getInitialStartAndMag: () => {
      topRightClone: Vector;
      topLeftClone: Vector;
      bottomLeftClone: Vector;
      bottomRightClone: Vector;
    };
    #getProcessedStartAndMag: (component: string) => any;
    scaleWidth: (value: number, t = 0) => Promise;
    scaleHeight: (value: number, t = 0) => Promise;
    setWidth: (value: number, t = 0) => Promise;
    setHeight: (value: number, t = 0) => Promise;
    contains: (p: Point) => boolean;
    #updateDimentions: () => void;
    #checkEvents: () => void;
    on: (event: string, callback1: Function, callback2: Function) => void;
    clone: () => Square;
  }

  declare class Simulation {
    scene: SimulationElement[];
    idObjs: {
      [key: string]: string;
    };
    fitting: boolean;
    bgColor: string;
    canvas: HTMLCanvasElement;
    constructor(id: string, frameRate = 60);
    #render: (c: CanvasRenderingContext2D) => void;
    add: (element: SimulationElement, id = null) => void;
    removeWithId: (id: string) => void;
    removeWithObject: (element: SimulationElement) => void;
    on: (event: string, callback: Function) => void;
    fitElement: () => void;
    setSize: (x: number, y: number) => void;
    setBgColor: (color: Color) => void;
    #resizeCanvas: (c: CanvasRenderingContext2D) => void;
  }

  declare function abs(num: number): number;

  declare function pythag(x: number, y: number): number;

  declare function distance(p1: Point, p2: Point): number;

  declare function atan2(x: number, y: number): number;

  declare function degToRad(deg: number): number;

  declare function radToDeg(rad: number): number;

  declare function transitionValues(
    callback1: Function,
    callback2: Function,
    callback3: Function,
    t: number
  ): Promise;

  declare function compare(val1: any, val2: any): boolean;
}
