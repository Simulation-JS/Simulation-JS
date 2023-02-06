// global vars
let currentMousePos: Point;
let currentMouseEvent: MouseEvent;
const validEvents = ['mousemove', 'click', 'hover', 'mouseover', 'mouseleave'] as const;
type ValidEvents = typeof validEvents[number];

type LerpFunc = (n: number) => number;

export class Vector {
  x: number;
  y: number;
  mag: number;
  startAngle: number;
  startX: number;
  startY: number;
  rotation: number;
  constructor(x: number, y: number, r = 0) {
    this.x = x;
    this.y = y;
    this.mag = pythag(x, y);
    this.startAngle = radToDeg(atan2(y, x));
    this.startX = x;
    this.startY = y;
    this.rotation = r;
    this.setRotation();
  }
  rotate(deg: number) {
    this.rotation += deg;
    this.setRotation();
    return this;
  }
  rotateTo(deg: number) {
    this.rotation = deg;
    this.setRotation();
    return this;
  }
  private setRotation() {
    this.rotation = minimizeRotation(this.rotation);
    const deg = this.rotation * (Math.PI / 180);
    this.x = this.startX * Math.cos(deg) - this.startY * Math.sin(deg);
    this.y = this.startX * Math.sin(deg) + this.startY * Math.cos(deg);
  }
  draw(c: CanvasRenderingContext2D, pos = new Point(0, 0), color = new Color(0, 0, 0), thickness = 1) {
    c.beginPath();
    c.strokeStyle = color.toHex();
    c.lineWidth = thickness;
    const r = window.devicePixelRatio;
    c.moveTo(pos.x * r, pos.y * r);
    c.lineTo(pos.x * r + this.x * r, pos.y * r + this.y * r);
    c.stroke();
    c.closePath();
  }
  normalize() {
    if (this.mag != 0) {
      this.x /= this.mag;
      this.startX /= this.mag;
      this.y /= this.mag;
      this.startY /= this.mag;
      this.mag = 1;
    }
    return this;
  }
  multiply(n: number) {
    this.x *= n;
    this.startX *= n;
    this.y *= n;
    this.startY *= n;
    this.mag *= n;
    return this;
  }
  add(v: Vector) {
    this.x += v.x;
    this.startX += v.x;
    this.y += v.x;
    this.startY += v.x;
    this.updateMag();
    return this;
  }
  multiplyX(n: number) {
    this.x *= n;
    this.startX *= n;
    this.updateMag();
    return this;
  }
  multiplyY(n: number) {
    this.y *= n;
    this.startY *= n;
    this.updateMag();
    return this;
  }
  divide(n: number) {
    this.x /= n;
    this.startX /= n;
    this.y /= n;
    this.startY /= n;
    this.mag /= n;
    return this;
  }
  appendMag(value: number) {
    if (this.mag != 0) {
      const newMag = this.mag + value;
      this.normalize();
      this.multiply(newMag);
      this.mag = newMag;
    }
    return this;
  }
  appendX(value: number) {
    this.x += value;
    this.startX += value;
    this.updateMag();
    return this;
  }
  appendY(value: number) {
    this.y += value;
    this.startY += value;
    this.updateMag();
    return this;
  }
  setX(value: number) {
    this.x = value;
    this.startX = value;
    this.updateMag();
    return this;
  }
  setY(value: number) {
    this.y = value;
    this.startY = value;
    this.updateMag();
    return this;
  }
  private updateMag() {
    this.mag = pythag(this.x, this.y);
  }
  setMag(value: number) {
    this.normalize();
    this.multiply(value);
    this.mag = value;
    return this;
  }
  clone() {
    return new Vector(this.x, this.y, this.rotation);
  }
  format() {
    return `(${this.x}, ${this.y})`;
  }
}

export class SimulationElement {
  pos: Point;
  color: Color;
  sim: HTMLCanvasElement | null;
  constructor(pos: Point, color = new Color(0, 0, 0)) {
    this.pos = pos;
    this.color = color;
    this.sim = null;
  }
  draw(_: CanvasRenderingContext2D) {}
  setSimulationElement(el: HTMLCanvasElement) {
    this.sim = el;
  }
  fill(color: Color, t = 0, f?: LerpFunc) {
    const currentColor = new Color(this.color.r, this.color.g, this.color.b);
    const colorClone = color.clone();
    const changeR = colorClone.r - this.color.r;
    const changeG = colorClone.g - this.color.g;
    const changeB = colorClone.b - this.color.b;

    const func = () => {
      this.color = colorClone;
    };

    return transitionValues(
      func,
      (p) => {
        currentColor.r += changeR * p;
        currentColor.g += changeG * p;
        currentColor.b += changeB * p;
        this.color.r = currentColor.r;
        this.color.g = currentColor.g;
        this.color.b = currentColor.b;
      },
      func,
      t,
      f
    );
  }
  moveTo(p: Vector, t = 0, f?: LerpFunc) {
    const changeX = p.x - this.pos.x;
    const changeY = p.y - this.pos.y;

    return transitionValues(
      () => {
        this.pos = p;
      },
      (p) => {
        this.pos.x += changeX * p;
        this.pos.y += changeY * p;
      },
      () => {
        this.pos.x = p.x;
        this.pos.y = p.y;
      },
      t,
      f
    );
  }
  move(p: Vector, t = 0, f?: LerpFunc) {
    const changeX = p.x;
    const changeY = p.y;
    const startPos = new Point(this.pos.x, this.pos.y);

    return transitionValues(
      () => {
        this.pos.x += p.x;
        this.pos.y += p.y;
      },
      (p) => {
        this.pos.x += changeX * p;
        this.pos.y += changeY * p;
      },
      () => {
        this.pos.x = startPos.x + p.x;
        this.pos.y = startPos.y + p.y;
      },
      t,
      f
    );
  }
}

export class Color {
  r: number;
  g: number;
  b: number;
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  clone() {
    return new Color(this.r, this.g, this.b);
  }
  private compToHex(c: number) {
    const hex = Math.round(c).toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }
  toHex() {
    return '#' + this.compToHex(this.r) + this.compToHex(this.g) + this.compToHex(this.b);
  }
}

export class Point extends Vector {
  constructor(x: number, y: number) {
    super(x, y);
  }
  clone() {
    return new Point(this.x, this.y);
  }
}

// extend SimulationElement so it can be added to the
// Simulation scene
export class SceneCollection extends SimulationElement {
  name: string;
  scene: SimulationElement[];
  idObjs: { [key: string]: SimulationElement };
  constructor(name = '') {
    super(new Point(0, 0));
    this.name = name;
    this.scene = [];
    this.idObjs = {};
  }
  add(element: SimulationElement, id: string | null = null) {
    if (this.sim != null) {
      element.setSimulationElement(this.sim);
    }
    if (id != null) {
      this.idObjs[id] = element;
    } else {
      this.scene.push(element);
    }
  }
  removeWithId(id: string) {
    delete this.idObjs[id];
  }
  removeWithObject(element: SimulationElement) {
    for (const el of this.scene) {
      if (el == element) {
        this.scene.splice(this.scene.indexOf(el), 1);
        return;
      }
    }
    for (const key of Object.keys(this.idObjs)) {
      if (this.idObjs[key] == element) {
        delete this.idObjs[key];
        return;
      }
    }
  }
  setSimulationElement(sim: HTMLCanvasElement) {
    this.sim = sim;
    for (const element of this.scene) {
      element.setSimulationElement(sim);
    }
  }
  draw(c: CanvasRenderingContext2D) {
    for (const element of this.scene) {
      element.draw(c);
    }
    for (const element of Object.values(this.idObjs)) {
      element.draw(c);
    }
  }
  empty() {
    this.scene = [];
    this.idObjs = {};
  }
}

export class Line extends SimulationElement {
  start: Point;
  end: Point;
  rotation: number;
  thickness: number;
  vec: Vector;
  constructor(p1: Point, p2: Point, color = new Color(0, 0, 0), thickness = 1, r = 0) {
    super(p1, color);
    this.start = p1;
    this.end = p2;
    this.rotation = r;
    this.thickness = thickness;
    this.vec = new Vector(0, 0);
    this.setVector();
  }
  clone() {
    return new Line(this.start.clone(), this.end.clone(), this.color.clone(), this.thickness, this.rotation);
  }
  setStart(p: Point, t = 0, f?: LerpFunc) {
    const xChange = p.x - this.start.x;
    const yChange = p.y - this.start.y;

    return transitionValues(
      () => {
        this.start = p;
      },
      (p) => {
        this.start.x += xChange * p;
        this.start.y += yChange * p;
      },
      () => {
        this.start = p;
      },
      t,
      f
    );
  }
  setEnd(p: Point, t = 0, f?: LerpFunc) {
    const xChange = p.x - this.end.x;
    const yChange = p.y - this.end.y;

    return transitionValues(
      () => {
        this.end = p;
        this.setVector();
      },
      (p) => {
        this.end.x += xChange * p;
        this.end.y += yChange * p;
        this.setVector();
      },
      () => {
        this.end = p;
        this.setVector();
      },
      t,
      f
    );
  }
  private setVector() {
    this.vec = new Vector(this.end.x - this.start.x, this.end.y - this.start.y);
    this.vec.rotateTo(this.rotation);
  }
  rotate(deg: number, t = 0, f?: LerpFunc) {
    const start = this.rotation;

    return transitionValues(
      () => {
        this.rotation += deg;
        this.vec.rotate(deg);
      },
      (p) => {
        this.rotation += deg * p;
        this.vec.rotate(deg * p);
      },
      () => {
        this.rotation = start + deg;
        this.rotation = minimizeRotation(this.rotation);
      },
      t,
      f
    );
  }
  rotateTo(deg: number, t = 0, f?: LerpFunc) {
    const rotationChange = deg - this.rotation;

    return transitionValues(
      () => {
        this.rotation = deg;
        this.vec.rotateTo(deg);
      },
      (p) => {
        this.rotation += rotationChange * p;
        this.vec.rotateTo(this.rotation);
      },
      () => {
        this.rotation = deg;
        this.rotation = minimizeRotation(this.rotation);
        this.vec.rotateTo(deg);
      },
      t,
      f
    );
  }
  moveTo(p: Point, t = 0) {
    return this.setStart(p, t);
  }
  move(v: Vector, t = 0) {
    return this.moveTo(this.start.add(v), t);
  }
  draw(c: CanvasRenderingContext2D) {
    this.vec.draw(
      c,
      new Point(this.start.x * window.devicePixelRatio, this.start.y * window.devicePixelRatio),
      this.color,
      this.thickness
    );
  }
}

export class Circle extends SimulationElement {
  radius: number;
  hovering: boolean;
  events: Event[];
  constructor(pos: Point, radius: number, color: Color) {
    super(pos, color);
    this.radius = radius;
    this.hovering = false;
    this.events = [];
  }
  clone() {
    return new Circle(this.pos.clone(), this.radius, this.color.clone());
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.fillStyle = this.color.toHex();
    c.arc(
      this.pos.x * window.devicePixelRatio,
      this.pos.y * window.devicePixelRatio,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    c.fill();
    c.closePath();
    this.checkEvents();
  }
  setRadius(value: number, t = 0, f?: LerpFunc) {
    const radiusChange = value - this.radius;

    return transitionValues(
      () => {
        this.radius = value;
      },
      (p) => {
        this.radius += radiusChange * p;
      },
      () => {
        this.radius = value;
      },
      t,
      f
    );
  }
  scale(value: number, t = 0, f?: LerpFunc) {
    const radiusChange = this.radius * value - this.radius;
    const finalValue = this.radius * value;

    return transitionValues(
      () => {
        this.radius = finalValue;
      },
      (p) => {
        this.radius += radiusChange * p;
      },
      () => {
        this.radius = finalValue;
      },
      t,
      f
    );
  }
  private checkEvents() {
    this.events.forEach((event) => {
      const name = event.name;
      switch (name) {
        case 'mouseover': {
          if (!this.hovering && currentMousePos && this.contains(currentMousePos)) {
            this.hovering = true;
            event.callback(currentMouseEvent);
          }
          break;
        }
        case 'mouseleave': {
          if (this.hovering && currentMousePos && !this.contains(currentMousePos)) {
            this.hovering = false;
            event.callback(currentMouseEvent);
          }
          break;
        }
        default:
          break;
      }
    });
  }
  on(event: ValidEvents, callback1: (event: MouseEvent) => void, callback2?: (event: MouseEvent) => void) {
    if (!validEvents.includes(event)) {
      console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
      return;
    }

    // specific events
    if (event === 'mousemove') {
      if (!this.sim) return;
      this.sim.addEventListener('mousemove', (e) => {
        const p = new Point(e.offsetX, e.offsetY);
        if (this.contains(p)) {
          callback1(e);
        }
      });
    } else if (event === 'hover') {
      this.on('mouseover', callback1);
      if (!callback2) return;
      this.on('mouseleave', callback2);
    } else if (event === 'click') {
      if (!this.sim) return;
      this.sim.addEventListener('click', (e) => {
        const p = new Point(e.clientX, e.clientY);
        if (this.contains(p)) {
          callback1(e);
        }
      });
    } else {
      const newEvent = new Event(event, callback1);
      this.events.push(newEvent);
    }
  }
  contains(p: Point) {
    return distance(p, this.pos) < this.radius;
  }
}

export class Polygon extends SimulationElement {
  rawPoints: Point[];
  offsetPoint: Point;
  offsetX: number;
  offsetY: number;
  points: Point[];
  rotation: number;
  constructor(pos: Point, points: Point[], color: Color, r = 0, offsetPoint = new Point(0, 0)) {
    super(pos, color);
    this.rawPoints = points;
    this.offsetPoint = offsetPoint;
    this.offsetX = this.offsetPoint.x;
    this.offsetY = this.offsetPoint.y;
    this.points = points.map((p) => {
      return new Point(p.x + this.offsetX, p.y + this.offsetY);
    });
    this.rotation = r;
    this.setRotation();
  }
  setPoints(points: Point[]) {
    this.points = points.map((p) => {
      return new Point(p.x + this.offsetX, p.y + this.offsetY);
    });
  }
  clone() {
    return new Polygon(
      this.pos.clone(),
      [...this.rawPoints],
      this.color.clone(),
      this.rotation,
      this.offsetPoint.clone()
    );
  }
  rotate(deg: number) {
    this.rotation += deg;
    this.setRotation();
  }
  rotateTo(deg: number) {
    this.rotation = deg;
    this.setRotation();
  }
  private setRotation() {
    this.rotation = minimizeRotation(this.rotation);
    this.points = this.points.map((p) => {
      p.rotateTo(this.rotation);
      return p;
    });
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.fillStyle = this.color.toHex();
    const r = window.devicePixelRatio;
    c.moveTo(this.points[0].x * r + this.pos.x * r, this.points[0].y * r + this.pos.y * r);
    for (let i = 1; i < this.points.length; i++) {
      c.lineTo(this.points[i].x * r + this.pos.x * r, this.points[i].y * r + this.pos.y * r);
    }
    c.fill();
    c.closePath();
  }
}

export class Event {
  name: string;
  callback: (event: MouseEvent) => void;
  constructor(name: string, callback: (event: MouseEvent) => void) {
    this.name = name;
    this.callback = callback;
  }
}

export class Square extends SimulationElement {
  width: number;
  height: number;
  rotation: number;
  private showNodeVectors: boolean;
  private showCollisionVectors: boolean;
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
  constructor(
    pos: Point,
    width: number,
    height: number,
    color: Color,
    offsetPoint = new Point(0, 0),
    rotation = 0
  ) {
    super(pos, color);
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.showNodeVectors = false;
    this.showCollisionVectors = false;
    this.hovering = false;
    this.events = [];
    this.topLeft = new Vector(0, 0);
    this.topRight = new Vector(0, 0);
    this.bottomLeft = new Vector(0, 0);
    this.bottomRight = new Vector(0, 0);
    this.v1 = new Vector(0, 0);
    this.v2 = new Vector(0, 0);
    this.v3 = new Vector(0, 0);
    this.v4 = new Vector(0, 0);
    this.v5 = new Vector(0, 0);
    this.offsetPoint = offsetPoint;
    this.updateOffsetPosition(offsetPoint);
  }
  updateOffsetPosition(p: Point) {
    this.offsetPoint = p.clone();
    this.topLeft = new Vector(-this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
    this.topRight = new Vector(this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
    this.bottomLeft = new Vector(-this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
    this.bottomRight = new Vector(this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
    this.setRotation();
  }
  setNodeVectors(show: boolean) {
    this.showNodeVectors = show;
  }
  setCollisionVectors(show: boolean) {
    this.showCollisionVectors = show;
  }
  setRotation() {
    this.topLeft.rotateTo(this.rotation);
    this.topRight.rotateTo(this.rotation);
    this.bottomLeft.rotateTo(this.rotation);
    this.bottomRight.rotateTo(this.rotation);
  }
  rotate(deg: number, t = 0, f?: LerpFunc) {
    const startRotation = this.rotation;

    const func = () => {
      this.rotation = startRotation + deg;
      this.rotation = minimizeRotation(this.rotation);
      this.setRotation();
    };

    return transitionValues(
      func,
      (p) => {
        this.rotation += deg * p;
        this.setRotation();
      },
      func,
      t,
      f
    );
  }
  rotateTo(deg: number, t = 0, f?: LerpFunc) {
    const rotationChange = deg - this.rotation;

    const func = () => {
      this.rotation = deg;
      this.rotation = minimizeRotation(this.rotation);
      this.setRotation();
    };

    return transitionValues(
      func,
      (p) => {
        this.rotation += rotationChange * p;
        this.setRotation();
      },
      func,
      t,
      f
    );
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.fillStyle = this.color.toHex();
    const r = window.devicePixelRatio;
    c.moveTo(
      this.pos.x * r + this.topLeft.x * r + this.offsetPoint.x * r,
      this.pos.y * r + this.topLeft.y * r + this.offsetPoint.y * r
    );
    c.lineTo(
      this.pos.x * r + this.topRight.x * r + this.offsetPoint.x * r,
      this.pos.y * r + this.topRight.y * r + this.offsetPoint.y * r
    );
    c.lineTo(
      this.pos.x * r + this.bottomRight.x * r + this.offsetPoint.x * r,
      this.pos.y * r + this.bottomRight.y * r + this.offsetPoint.y * r
    );
    c.lineTo(
      this.pos.x * r + this.bottomLeft.x * r + this.offsetPoint.x * r,
      this.pos.y * r + this.bottomLeft.y * r + this.offsetPoint.y * r
    );
    c.fill();
    c.closePath();

    if (this.showNodeVectors) {
      this.topLeft.draw(
        c,
        new Point(this.pos.x * r + this.offsetPoint.x * r, this.pos.y * r + this.offsetPoint.y * r)
      );
      this.topRight.draw(
        c,
        new Point(this.pos.x * r + this.offsetPoint.x * r, this.pos.y * r + this.offsetPoint.y * r)
      );
      this.bottomLeft.draw(
        c,
        new Point(this.pos.x * r + this.offsetPoint.x * r, this.pos.y * r + this.offsetPoint.y * r)
      );
      this.bottomRight.draw(
        c,
        new Point(this.pos.x * r + this.offsetPoint.x * r, this.pos.y * r + this.offsetPoint.y * r)
      );
    }

    if (this.showCollisionVectors) {
      const testVecs = [this.v1, this.v2, this.v3, this.v4, this.v5];
      if (testVecs.some((el) => el)) {
        testVecs.forEach((vec) =>
          vec.draw(c, new Point(this.pos.x * r, this.pos.y * r), new Color(0, 0, 255))
        );
      }
    }

    this.checkEvents();
  }
  scale(value: number, t = 0, f?: LerpFunc) {
    const topRightMag = this.topRight.mag;
    const topLeftMag = this.topLeft.mag;
    const bottomRightMag = this.bottomRight.mag;
    const bottomLeftMag = this.bottomLeft.mag;

    const topRightChange = topRightMag * value - topRightMag;
    const topLeftChange = topLeftMag * value - topLeftMag;
    const bottomRightChange = bottomRightMag * value - bottomRightMag;
    const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;

    return transitionValues(
      () => {
        this.topRight.multiply(value);
        this.topLeft.multiply(value);
        this.bottomRight.multiply(value);
        this.bottomLeft.multiply(value);

        this.updateDimensions();
      },
      (p) => {
        this.topRight.appendMag(topRightChange * p);
        this.topLeft.appendMag(topLeftChange * p);
        this.bottomRight.appendMag(bottomRightChange * p);
        this.bottomLeft.appendMag(bottomLeftChange * p);
      },
      () => {
        this.topRight.normalize();
        this.topRight.multiply(topRightMag * value);

        this.topLeft.normalize();
        this.topLeft.multiply(topLeftMag * value);

        this.bottomRight.normalize();
        this.bottomRight.multiply(bottomRightMag * value);

        this.bottomLeft.normalize();
        this.bottomLeft.multiply(bottomLeftMag * value);

        this.updateDimensions();
      },
      t,
      f
    );
  }
  scaleWidth(value: number, t = 0, f?: LerpFunc) {
    const topRightClone = this.topRight.clone();
    const topLeftClone = this.topLeft.clone();
    const bottomRightClone = this.bottomRight.clone();
    const bottomLeftClone = this.bottomLeft.clone();
    const topRightMag = topRightClone.mag;
    const topLeftMag = topLeftClone.mag;
    const bottomRightMag = bottomRightClone.mag;
    const bottomLeftMag = bottomLeftClone.mag;

    const topRightChange = topRightMag * value - topRightMag;
    const topLeftChange = topLeftMag * value - topLeftMag;
    const bottomRightChange = bottomRightMag * value - bottomRightMag;
    const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;

    return transitionValues(
      () => {
        this.topRight.multiplyX(value);
        this.topLeft.multiplyX(value);
        this.bottomRight.multiplyX(value);
        this.bottomLeft.multiplyX(value);

        this.updateDimensions();
      },
      (p) => {
        this.topRight.appendX(topRightChange * p);
        this.topLeft.appendX(topLeftChange * p);
        this.bottomRight.appendX(bottomRightChange * p);
        this.bottomLeft.appendX(bottomLeftChange * p);
      },
      () => {
        topRightClone.setX(1);
        topRightClone.multiplyX(topRightMag * value);
        this.topRight = topRightClone.clone();

        topLeftClone.setX(1);
        topLeftClone.multiplyX(topLeftMag * value);
        this.topLeft = topLeftClone.clone();

        bottomRightClone.setX(1);
        bottomRightClone.multiplyX(bottomRightMag * value);
        this.bottomRight = bottomRightClone.clone();

        bottomLeftClone.setX(1);
        bottomLeftClone.multiplyX(bottomLeftMag * value);
        this.bottomLeft = bottomLeftClone.clone();

        this.updateDimensions();
      },
      t,
      f
    );
  }
  scaleHeight(value: number, t = 0, f?: LerpFunc) {
    const topRightClone = this.topRight.clone();
    const topLeftClone = this.topLeft.clone();
    const bottomRightClone = this.bottomRight.clone();
    const bottomLeftClone = this.bottomLeft.clone();
    const topRightMag = topRightClone.mag;
    const topLeftMag = topLeftClone.mag;
    const bottomRightMag = bottomRightClone.mag;
    const bottomLeftMag = bottomLeftClone.mag;

    const topRightChange = topRightMag * value - topRightMag;
    const topLeftChange = topLeftMag * value - topLeftMag;
    const bottomRightChange = bottomRightMag * value - bottomRightMag;
    const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;

    return transitionValues(
      () => {
        this.topRight.multiplyY(value);
        this.topLeft.multiplyY(value);
        this.bottomRight.multiplyY(value);
        this.bottomLeft.multiplyY(value);

        this.updateDimensions();
      },
      (p) => {
        this.topRight.appendY(topRightChange * p);
        this.topLeft.appendY(topLeftChange * p);
        this.bottomRight.appendY(bottomRightChange * p);
        this.bottomLeft.appendY(bottomLeftChange * p);
      },
      () => {
        topRightClone.setY(1);
        topRightClone.multiplyY(topRightMag * value);
        this.topRight = topRightClone.clone();

        topLeftClone.setY(1);
        topLeftClone.multiplyY(topLeftMag * value);
        this.topLeft = topLeftClone.clone();

        bottomRightClone.setY(1);
        bottomRightClone.multiplyY(bottomRightMag * value);
        this.bottomRight = bottomRightClone.clone();

        bottomLeftClone.setY(1);
        bottomLeftClone.multiplyY(bottomLeftMag * value);
        this.bottomLeft = bottomLeftClone.clone();

        this.updateDimensions();
      },
      t,
      f
    );
  }
  setWidth(value: number, t = 0) {
    const scale = value / this.width;
    return this.scaleWidth(scale, t);
  }
  setHeight(value: number, t = 0) {
    const scale = value / this.height;
    return this.scaleHeight(scale, t);
  }
  contains(p: Point) {
    const topLeftVector = new Vector(this.topLeft.x, this.topLeft.y);
    topLeftVector.rotateTo(-this.rotation);
    this.v1 = topLeftVector;

    const topRightVector = new Vector(this.topRight.x, this.topRight.y);
    topRightVector.rotateTo(-this.rotation);
    this.v2 = topRightVector;

    const bottomLeftVector = new Vector(this.bottomLeft.x, this.bottomLeft.y);
    bottomLeftVector.rotateTo(-this.rotation);
    this.v3 = bottomLeftVector;

    const bottomRightVector = new Vector(this.bottomRight.x, this.bottomRight.y);
    bottomRightVector.rotateTo(-this.rotation);
    this.v4 = bottomRightVector;

    const cursorVector = new Vector(
      p.x - this.pos.x - this.offsetPoint.x,
      p.y - this.pos.y - this.offsetPoint.y
    );
    cursorVector.rotateTo(-this.rotation);
    this.v5 = cursorVector;

    if (
      cursorVector.x > bottomLeftVector.x &&
      cursorVector.x < topRightVector.x &&
      cursorVector.y > topLeftVector.y &&
      cursorVector.y < bottomLeftVector.y
    ) {
      return true;
    }
    return false;
  }
  private updateDimensions() {
    this.height = this.topRight.y + this.bottomRight.y;
    this.width = this.topRight.x + this.topLeft.x;
  }
  private checkEvents() {
    this.events.forEach((event) => {
      const name = event.name;
      switch (name) {
        case 'mouseover': {
          if (!this.hovering && currentMousePos && this.contains(currentMousePos)) {
            this.hovering = true;
            event.callback(currentMouseEvent);
          }
          break;
        }
        case 'mouseleave': {
          if (this.hovering && currentMousePos && !this.contains(currentMousePos)) {
            this.hovering = false;
            event.callback(currentMouseEvent);
          }
          break;
        }
        default:
          break;
      }
    });
  }
  on(event: ValidEvents, callback1: (event: MouseEvent) => void, callback2?: (event: MouseEvent) => void) {
    if (!validEvents.includes(event)) {
      console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
      return;
    }

    // specific events
    if (event === 'mousemove') {
      if (!this.sim) return;
      this.sim.addEventListener('mousemove', (e) => {
        const p = new Point(e.clientX, e.clientY);
        if (this.contains(p)) {
          callback1(e);
        }
      });
    } else if (event === 'click') {
      if (!this.sim) return;
      this.sim.addEventListener('click', (e) => {
        const p = new Point(e.clientX, e.clientY);
        if (this.contains(p)) {
          callback1(e);
        }
      });
    } else if (event === 'hover') {
      this.on('mouseover', callback1);
      if (!callback2) return;
      this.on('mouseleave', callback2);
    } else {
      const newEvent = new Event(event, callback1);
      this.events.push(newEvent);
    }
  }
  clone() {
    return new Square(
      this.pos.clone(),
      this.width,
      this.height,
      this.color.clone(),
      this.offsetPoint.clone(),
      this.rotation
    );
  }
}

export class Arc extends SimulationElement {
  radius: number;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
  thickness: number;
  rotation: number;
  constructor(
    pos: Point,
    radius: number,
    startAngle: number,
    endAngle: number,
    thickness = 1,
    color = new Color(0, 0, 0),
    rotation = 0,
    counterClockwise = false
  ) {
    super(pos, color);
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.counterClockwise = counterClockwise;
    this.thickness = thickness;
    this.rotation = rotation;
  }
  scaleRadius(scale: number, t = 0, f?: LerpFunc) {
    const initialRadius = this.radius;
    const scaleChange = this.radius * scale - this.radius;

    return transitionValues(
      () => {
        this.radius *= scale;
      },
      (p) => {
        this.radius += scaleChange * p;
      },
      () => {
        this.radius = initialRadius * scale;
      },
      t,
      f
    );
  }
  setRadius(value: number, t = 0, f?: LerpFunc) {
    const radChange = value - this.radius;

    return transitionValues(
      () => {
        this.radius = value;
      },
      (p) => {
        this.radius += radChange * p;
      },
      () => {
        this.radius = value;
      },
      t,
      f
    );
  }
  setThickness(val: number, t = 0, f?: LerpFunc) {
    const thicknessChange = val - this.thickness;

    return transitionValues(
      () => {
        this.thickness = val;
      },
      (p) => {
        this.thickness += thicknessChange * p;
      },
      () => {
        this.thickness = val;
      },
      t,
      f
    );
  }
  setStartAngle(angle: number, t = 0, f?: LerpFunc) {
    const angleChange = angle - this.startAngle;

    return transitionValues(
      () => {
        this.startAngle = angle;
      },
      (p) => {
        this.startAngle += angleChange * p;
      },
      () => {
        this.startAngle = angle;
      },
      t,
      f
    );
  }
  setEndAngle(angle: number, t = 0, f?: LerpFunc) {
    const angleChange = angle - this.endAngle;

    return transitionValues(
      () => {
        this.endAngle = angle;
      },
      (p) => {
        this.endAngle += angleChange / p;
      },
      () => {
        this.endAngle = angle;
      },
      t,
      f
    );
  }
  rotate(amount: number, t = 0, f?: LerpFunc) {
    const initialRotation = this.rotation;
    const rotationChange = this.rotation + amount - this.rotation;

    return transitionValues(
      () => {
        this.rotation += amount;
      },
      (p) => {
        this.rotation += rotationChange * p;
      },
      () => {
        this.rotation = initialRotation + amount;
      },
      t,
      f
    );
  }
  rotateTo(deg: number, t = 0, f?: LerpFunc) {
    const rotationChange = deg - this.rotation;

    return transitionValues(
      () => {
        this.rotation = deg;
      },
      (p) => {
        this.rotation += rotationChange * p;
      },
      () => {
        this.rotation = deg;
      },
      t,
      f
    );
  }
  clone() {
    return new Arc(
      this.pos.clone(),
      this.radius,
      this.startAngle,
      this.endAngle,
      this.thickness,
      this.color.clone(),
      this.rotation,
      this.counterClockwise
    );
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.strokeStyle = this.color.toHex();
    c.lineWidth = this.thickness;
    c.arc(
      this.pos.x,
      this.pos.y,
      this.radius,
      degToRad(this.startAngle + this.rotation),
      degToRad(this.endAngle + this.rotation),
      this.counterClockwise
    );
    c.stroke();
    c.closePath();
  }
}

export class Simulation {
  scene: SimulationElement[];
  idObjs: { [key: string]: SimulationElement };
  fitting: boolean;
  private bgColor: Color;
  canvas: HTMLCanvasElement | null;
  width: number = 0;
  height: number = 0;
  constructor(id: string) {
    this.scene = [];
    this.idObjs = {};
    this.fitting = false;
    this.bgColor = new Color(255, 255, 255);

    this.canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!this.canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }
    this.canvas.addEventListener('mousemove', (e) => {
      currentMousePos = new Point(e.offsetX, e.offsetY);
      currentMouseEvent = e;
    });

    window.addEventListener('resize', () => this.resizeCanvas(this.canvas));
    this.resizeCanvas(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.render(ctx);
  }
  private render(c: CanvasRenderingContext2D) {
    if (!this.canvas) return;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    c.beginPath();
    c.fillStyle = this.bgColor.toHex();
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    c.closePath();

    for (const element of this.scene) {
      element.draw(c);
    }
    Object.values(this.idObjs).forEach((element) => {
      element.draw(c);
    });
    window.requestAnimationFrame(() => this.render(c));
  }
  add(element: SimulationElement, id: string | null = null) {
    if (!this.canvas) return;
    element.setSimulationElement(this.canvas);
    if (id !== null) {
      this.idObjs[id] = element;
    } else {
      this.scene.push(element);
    }
  }
  removeWithId(id: string) {
    if (this.idObjs[id] !== undefined) {
      delete this.idObjs[id];
    }
  }
  removeWithObject(element: SimulationElement) {
    for (const el of this.scene) {
      if (compare(el, element)) {
        this.scene.splice(this.scene.indexOf(el), 1);
        return;
      }
    }
    for (const key of Object.keys(this.idObjs)) {
      if (compare(this.idObjs[key], element)) {
        delete this.idObjs[key];
      }
    }
  }
  on(event: string, callback: (e: any) => void) {
    if (!this.canvas) return;
    this.canvas.addEventListener(event, callback);
  }
  fitElement() {
    if (!this.canvas) return;
    this.fitting = true;
    this.resizeCanvas(this.canvas);
  }
  setSize(x: number, y: number) {
    if (!this.canvas) return;
    this.canvas.width = x;
    this.canvas.height = y;
    this.fitting = false;
  }
  setBgColor(color: Color) {
    this.bgColor = color.clone();
  }
  private resizeCanvas(c: HTMLCanvasElement | null) {
    if (!c) return;
    if (!this.canvas) return;
    if (this.fitting) {
      if (c.parentElement) {
        const width = c.parentElement.clientWidth;
        const height = c.parentElement.clientHeight;
        this.canvas.width = width * window.devicePixelRatio;
        this.canvas.height = height * window.devicePixelRatio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
      }
    }
    this.width = this.canvas.width / window.devicePixelRatio;
    this.height = this.canvas.height / window.devicePixelRatio;
  }
  empty() {
    this.scene = [];
    this.idObjs = {};
  }
}

export function abs(num: number) {
  return Math.abs(num);
}

export function pythag(x: number, y: number) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function distance(p1: Point, p2: Point) {
  return pythag(p1.x - p2.x, p1.y - p2.y);
}

export function atan2(x: number, y: number) {
  return Math.atan2(y, x);
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function minimizeRotation(rotation: number) {
  while (rotation > 360) rotation -= 360;
  return rotation;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothStep(t: number) {
  const v1 = t * t;
  const v2 = 1 - (1 - t) * (1 - t);
  return lerp(v1, v2, t);
}

export function linearStep(n: number) {
  return n;
}

/**
 * @param callback1 - called when t is 0
 * @param callback2 - called every frame until the animation is finished
 * @param callback3 - called after animation is finished
 * @param t - animation time (seconds)
 * @returns {Promise<void>}
 */
export function transitionValues(
  callback1: () => void,
  callback2: (percent: number) => void,
  callback3: () => void,
  t: number,
  func?: (n: number) => number
): Promise<void> {
  return new Promise((resolve) => {
    if (t == 0) {
      callback1();
      resolve();
    } else {
      const inc = 1 / (60 * t);
      let prevPercent = 0;
      const step = (t: number, f: (n: number) => number) => {
        const newT = f(t);
        callback2(newT - prevPercent);
        prevPercent = newT;
        if (t < 1) {
          window.requestAnimationFrame(() => step(t + inc, f));
        } else {
          callback3();
          resolve();
        }
      };
      step(0, func ? func : linearStep);
    }
  });
}

export function compare(val1: any, val2: any) {
  const nullUndefArr = [null, undefined];
  if (nullUndefArr.includes(val1) || nullUndefArr.includes(val2)) {
    if (val1 === val2) return true;
    return false;
  }
  if (typeof val1 !== typeof val2) return false;

  if (Array.isArray(val1) && Array.isArray(val2)) {
    for (let i = 0; i < Math.max(val1.length, val2.length); i++) {
      if (!compare(val1[i], val2[i])) return false;
    }
    return true;
  } else if (Array.isArray(val1) || Array.isArray(val2)) return false;

  if (typeof val1 === 'object' && typeof val2 === 'object') {
    const compareForKeys = (keys: string[], obj1: object, obj2: object) => {
      for (let i = 0; i < keys.length; i++) {
        if (typeof obj1[keys[i] as keyof object] !== typeof obj2[keys[i] as keyof object]) {
          return false;
        }

        if (typeof obj1[keys[i] as keyof object] === 'object') {
          return compare(obj1[keys[i] as keyof object], obj2[keys[i] as keyof object]);
        }

        if (obj1[keys[i] as keyof object] !== obj2[keys[i] as keyof object]) {
          return false;
        }
      }
      return true;
    };

    const obj1Keys = Object.keys(val1);
    const obj2Keys = Object.keys(val2);

    const key1Result = compareForKeys(obj1Keys, val1, val2);
    const key2Result = compareForKeys(obj2Keys, val1, val2);

    if (key1Result && key2Result) return true;
    return false;
  }

  return val1 === val2;
}

export default {
  Vector,
  SimulationElement,
  Color,
  Point,
  SceneCollection,
  Line,
  Circle,
  Polygon,
  Square,
  Simulation,
  abs,
  pythag,
  distance,
  atan2,
  degToRad,
  radToDeg,
  transitionValues,
  compare
};
