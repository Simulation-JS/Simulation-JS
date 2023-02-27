type LerpFunc = (n: number) => number;
type SimulationElementType = 'line' | 'circle' | 'polygon' | 'square' | 'arc' | 'collection';
type SimulationElement3dType = 'cube' | 'plane';

export class LightSource {
  pos: Vector3;
  id: string;
  intensity: number;
  constructor(pos: Vector3, intensity = 1, id = '') {
    this.pos = pos;
    this.id = id;
    this.intensity = intensity;
  }
}

export class Camera {
  pos: Vector3;
  rot: Vector3;
  constructor(pos: Vector3, rot: Vector3) {
    this.pos = pos;
    rot.x = radToDeg(rot.x);
    rot.y = radToDeg(rot.y);
    rot.z = radToDeg(rot.z);
    this.rot = rot;
  }
}

export class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  format() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  rotateX(val: number) {
    const initialY = this.y;
    const initialZ = this.z;
    this.y = initialY * Math.cos(val) - initialZ * Math.sin(val);
    this.z = initialY * Math.sin(val) + initialZ * Math.cos(val);
  }
  rotateY(val: number) {
    const initialX = this.x;
    const initialZ = this.z;
    this.x = initialX * Math.cos(val) + initialZ * Math.sin(val);
    this.z = -initialX * Math.sin(val) + initialZ * Math.cos(val);
  }
  rotateZ(val: number) {
    const initialX = this.x;
    const initialY = this.y;
    this.x = initialX * Math.cos(val) - initialY * Math.sin(val);
    this.y = initialX * Math.sin(val) + initialY * Math.cos(val);
    return this;
  }
  rotate(vec: Vector3) {
    this.rotateZ(degToRad(vec.z));
    this.rotateX(degToRad(vec.x));
    this.rotateY(degToRad(vec.y));
    return this;
  }
  multiply(val: number) {
    this.x *= val;
    this.y *= val;
    this.z *= val;
    return this;
  }
  divide(val: number) {
    this.x /= val;
    this.y /= val;
    this.z /= val;
    return this;
  }
  add(vec: Vector3) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
  sub(vec: Vector3) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }
  getMag() {
    return pythag(pythag(this.x, this.y), this.z);
  }
  getRotation() {
    const ay = radToDeg(Math.atan2(this.x, this.z));
    const ax = radToDeg(Math.atan2(this.y, this.z));
    return new Vector(ax, ay);
  }
  dot(vec: Vector3) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }
  normalize() {
    const mag = this.getMag();
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    return this;
  }
  cross(vec: Vector3) {
    const i = [this.y, this.z, vec.y, vec.z];
    const j = [this.x, this.z, vec.x, vec.z];
    const k = [this.x, this.y, vec.x, vec.y];
    const determinantI = i[0] * i[3] - i[1] * i[2];
    const determinantJ = j[0] * j[3] - j[1] * j[2];
    const determinantK = k[0] * k[3] - k[1] * k[2];
    return new Vector3(determinantI, -determinantJ, determinantK);
  }
}

export class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getRotation() {
    return radToDeg(Math.atan2(this.y, this.x));
  }
  getMag() {
    return pythag(this.x, this.y);
  }
  rotate(deg: number) {
    const rotation = this.getRotation();
    const mag = this.getMag();
    this.x = Math.cos(degToRad(rotation + deg)) * mag;
    this.y = Math.sin(degToRad(rotation + deg)) * mag;
    return this;
  }
  draw(c: CanvasRenderingContext2D, pos = new Vector(0, 0), color = new Color(0, 0, 0), thickness = 1) {
    c.beginPath();
    c.strokeStyle = color.toHex();
    c.lineWidth = thickness;
    c.moveTo(pos.x, pos.y);
    c.lineTo(pos.x + this.x, pos.y + this.y);
    c.stroke();
    c.closePath();
  }
  normalize() {
    const mag = this.getMag();
    if (mag != 0) {
      this.x /= mag;
      this.y /= mag;
    }
    return this;
  }
  multiply(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }
  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  divide(n: number) {
    this.x /= n;
    this.y /= n;
    return this;
  }
  appendMag(value: number) {
    const mag = this.getMag();
    if (mag != 0) {
      const newMag = mag + value;
      this.normalize();
      this.multiply(newMag);
    }
    return this;
  }
  clone() {
    return new Vector(this.x, this.y);
  }
  format() {
    return `(${this.x}, ${this.y})`;
  }
}

export class SimulationElement {
  pos: Vector;
  color: Color;
  sim: HTMLCanvasElement | null;
  type: SimulationElementType | null;
  running: boolean;
  _3d = false;
  id: string;
  constructor(pos: Vector, color = new Color(0, 0, 0), type: SimulationElementType | null = null, id = '') {
    this.pos = pos;
    this.color = color;
    this.sim = null;
    this.type = type;
    this.running = true;
    this.id = id;
  }
  end() {
    this.running = false;
  }
  draw(_: CanvasRenderingContext2D) {}
  setSimulationElement(el: HTMLCanvasElement) {
    this.sim = el;
  }
  setId(id: string) {
    this.id = id;
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
        return this.running;
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
        return this.running;
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
    const startPos = new Vector(this.pos.x, this.pos.y);

    return transitionValues(
      () => {
        this.pos.x += p.x;
        this.pos.y += p.y;
      },
      (p) => {
        this.pos.x += changeX * p;
        this.pos.y += changeY * p;
        return this.running;
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
  a: number;
  constructor(r: number, g: number, b: number, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }
  private compToHex(c: number) {
    const hex = Math.round(c).toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }
  toHex() {
    return (
      '#' +
      this.compToHex(this.r) +
      this.compToHex(this.g) +
      this.compToHex(this.b) +
      this.compToHex(this.a * 255)
    );
  }
}

// extend SimulationElement so it can be added to the
// Simulation scene
export class SceneCollection extends SimulationElement {
  name: string;
  scene: (SimulationElement | SimulationElement3d)[];
  sim: HTMLCanvasElement | null = null;
  _isSceneCollection = true;
  camera: Camera;
  displaySurface: Vector3;
  ratio;
  lightSources: LightSource[];
  ambientLighting: number;
  constructor(name = '') {
    super(new Vector(0, 0));
    this.name = name;
    this.scene = [];
    this.camera = new Camera(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    this.displaySurface = new Vector3(0, 0, 0);
    this.ratio = 1;
    this.lightSources = [];
    this.ambientLighting = 0;
  }
  set3dObjects(cam: Camera, displaySurface: Vector3, ratio: number) {
    this.camera = cam;
    this.displaySurface = displaySurface;
    this.ratio = ratio;
  }
  setAmbientLighting(val: number) {
    this.ambientLighting = val;
    this.scene.forEach((obj) => {
      if ((obj as SceneCollection)._isSceneCollection) {
        (obj as SceneCollection).setAmbientLighting(this.ambientLighting);
      }
    });
  }
  end() {
    super.end();
    this.scene.forEach((item) => item.end());
  }
  setPixelRatio(num: number) {
    this.ratio = num;
  }
  add(element: SimulationElement | SimulationElement3d, id: string | null = null) {
    if (!this.sim) return;
    element.setSimulationElement(this.sim);
    if (id !== null) {
      element.setId(id);
    }
    if ((element as SceneCollection)._isSceneCollection) {
      (element as SceneCollection).set3dObjects(this.camera, this.displaySurface, this.ratio);
    }
    this.scene.push(element);
  }
  private updateSceneLightSources() {
    this.scene.forEach((obj) => {
      if ((obj as SceneCollection)._isSceneCollection) {
        (obj as SceneCollection).setLightSources(this.lightSources);
      }
    });
  }
  setLightSources(sources: LightSource[]) {
    this.lightSources = sources;
    this.updateSceneLightSources();
  }
  addLightSource(source: LightSource) {
    this.lightSources.push(source);
    this.updateSceneLightSources();
  }
  removeLightSourceWithId(id: string) {
    this.lightSources = this.lightSources.filter((source) => source.id !== id);
    this.updateSceneLightSources();
  }
  getLightSourceWithId(id: string) {
    for (let i = 0; i < this.lightSources.length; i++) {
      if (this.lightSources[i].id === id) return this.lightSources[i];
    }
    return null;
  }
  removeWithId(id: string) {
    this.scene = this.scene.filter((item) => item.id !== id);
  }
  removeWithObject(element: SimulationElement) {
    this.scene = this.scene.filter((item) => item === element);
  }
  setSimulationElement(sim: HTMLCanvasElement) {
    this.sim = sim;
    for (const element of this.scene) {
      element.setSimulationElement(sim);
    }
  }
  draw(c: CanvasRenderingContext2D) {
    for (const element of this.scene) {
      if (element._3d) {
        (element as SimulationElement3d).draw(
          c,
          this.camera,
          this.displaySurface,
          this.ratio,
          this.lightSources,
          this.ambientLighting
        );
      } else {
        (element as SimulationElement).draw(c);
      }
    }
  }
  empty() {
    this.scene = [];
  }
}

export class SimulationElement3d {
  pos: Vector3;
  color: Color;
  sim: HTMLCanvasElement | null;
  type: SimulationElement3dType | null;
  running: boolean;
  _3d = true;
  id: string;
  lighting: boolean;
  constructor(
    pos: Vector3,
    color = new Color(0, 0, 0),
    lighting = false,
    type: SimulationElement3dType | null = null,
    id = ''
  ) {
    this.pos = pos;
    this.color = color;
    this.sim = null;
    this.type = type;
    this.running = true;
    this.id = id;
    this.lighting = lighting;
  }
  setLighting(val: boolean) {
    this.lighting = val;
  }
  setId(id: string) {
    this.id = id;
  }
  end() {
    this.running = false;
  }
  draw(
    _ctx: CanvasRenderingContext2D,
    _camera: Camera,
    _displaySurface: Vector3,
    _ratio: number,
    _lightSources: LightSource[],
    _ambientLighting: number
  ) {}
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
        return this.running;
      },
      func,
      t,
      f
    );
  }
  moveTo(p: Vector3, t = 0, f?: LerpFunc) {
    const changeX = p.x - this.pos.x;
    const changeY = p.y - this.pos.y;
    const changeZ = p.z - this.pos.z;

    return transitionValues(
      () => {
        this.pos = p;
      },
      (p) => {
        this.pos.x += changeX * p;
        this.pos.y += changeY * p;
        this.pos.z += changeZ * p;
        return this.running;
      },
      () => {
        this.pos.x = p.x;
        this.pos.y = p.y;
        this.pos.z = p.z;
      },
      t,
      f
    );
  }
  move(p: Vector3, t = 0, f?: LerpFunc) {
    const changeX = p.x;
    const changeY = p.y;
    const changeZ = p.z;
    const startPos = new Vector3(this.pos.x, this.pos.y, this.pos.z);

    return transitionValues(
      () => {
        this.pos.x += p.x;
        this.pos.y += p.y;
        this.pos.z += p.z;
      },
      (p) => {
        this.pos.x += changeX * p;
        this.pos.y += changeY * p;
        this.pos.z += changeZ * p;
        return this.running;
      },
      () => {
        this.pos.x = startPos.x + p.x;
        this.pos.y = startPos.y + p.y;
        this.pos.z = startPos.z + p.z;
      },
      t,
      f
    );
  }
}

export class Line extends SimulationElement {
  startPoint: Vector;
  endPoint: Vector;
  thickness: number;
  constructor(p1: Vector, p2: Vector, color = new Color(0, 0, 0), thickness = 1) {
    super(new Vector(0, 0), color, 'line');
    this.startPoint = p1;
    this.endPoint = p2;
    this.thickness = thickness;
  }
  clone() {
    return new Line(this.startPoint.clone(), this.endPoint.clone(), this.color.clone(), this.thickness);
  }
  setStart(p: Vector, t = 0, f?: LerpFunc) {
    const xChange = p.x - this.startPoint.x;
    const yChange = p.y - this.startPoint.y;

    return transitionValues(
      () => {
        this.startPoint = p;
      },
      (p) => {
        this.startPoint.x += xChange * p;
        this.startPoint.y += yChange * p;
        return this.running;
      },
      () => {
        this.startPoint = p;
      },
      t,
      f
    );
  }
  setEnd(p: Vector, t = 0, f?: LerpFunc) {
    const xChange = p.x - this.endPoint.x;
    const yChange = p.y - this.endPoint.y;

    return transitionValues(
      () => {
        this.endPoint = p;
      },
      (p) => {
        this.endPoint.x += xChange * p;
        this.endPoint.y += yChange * p;
        return this.running;
      },
      () => {
        this.endPoint = p;
      },
      t,
      f
    );
  }
  moveTo(p: Vector, t = 0) {
    return new Promise<void>(async (resolve) => {
      await Promise.all([this.setStart(p, t), this.setEnd(this.endPoint.clone().add(p), t)]);
      resolve();
    });
  }
  move(v: Vector, t = 0) {
    return this.moveTo(this.startPoint.clone().add(v), t);
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.lineWidth = this.thickness;
    c.strokeStyle = this.color.toHex();
    c.moveTo(this.startPoint.x, this.startPoint.y);
    c.lineTo(this.endPoint.x, this.endPoint.y);
    c.stroke();
    c.closePath();
  }
}

export class Circle extends SimulationElement {
  radius: number;
  startAngle: number;
  endAngle: number;
  counterClockwise: boolean;
  thickness: number;
  rotation: number;
  fillCircle: boolean;
  constructor(
    pos: Vector,
    radius: number,
    color = new Color(0, 0, 0),
    startAngle: number = 0,
    endAngle: number = 360,
    thickness = 1,
    rotation = 0,
    fill = true,
    counterClockwise = false
  ) {
    super(pos, color, 'circle');
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.counterClockwise = counterClockwise;
    this.thickness = thickness;
    this.rotation = rotation;
    this.fillCircle = fill;
  }
  setCounterClockwise(val: boolean) {
    this.counterClockwise = val;
  }
  setFillCircle(val: boolean) {
    this.fillCircle = val;
  }
  draw(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.strokeStyle = this.color.toHex();
    c.fillStyle = this.color.toHex();
    c.lineWidth = this.thickness;
    c.arc(
      this.pos.x,
      this.pos.y,
      this.radius,
      degToRad(this.startAngle + this.rotation),
      degToRad(this.endAngle + this.rotation),
      this.counterClockwise
    );
    if (this.endAngle > 0 && this.startAngle + 360 > this.endAngle) {
      c.lineTo(this.pos.x, this.pos.y);
      c.moveTo(this.pos.x, this.pos.y);
      c.lineTo(
        this.pos.x + Math.cos(degToRad(this.rotation)) * this.radius,
        this.pos.y + Math.sin(degToRad(this.rotation)) * this.radius
      );
    }
    c.stroke();
    if (this.fillCircle) {
      c.fill();
    }
    c.closePath();
  }
  contains(p: Vector) {
    return distance(p, this.pos) < this.radius;
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
        return this.running;
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
        return this.running;
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
        return this.running;
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
        return this.running;
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
        this.endAngle += angleChange * p;
        return this.running;
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
        return this.running;
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
        return this.running;
      },
      () => {
        this.rotation = deg;
      },
      t,
      f
    );
  }
  clone() {
    return new Circle(
      this.pos.clone(),
      this.radius,
      this.color.clone(),
      this.startAngle,
      this.endAngle,
      this.thickness,
      this.rotation,
      this.counterClockwise
    );
  }
}

export class Polygon extends SimulationElement {
  offsetPoint: Vector;
  points: Vector[];
  rotation: number;
  constructor(
    pos: Vector,
    points: Vector[],
    color = new Color(0, 0, 0),
    r = 0,
    offsetPoint = new Vector(0, 0)
  ) {
    super(pos, color, 'polygon');
    this.offsetPoint = offsetPoint;
    this.points = points.map((p) => {
      return new Vector(p.x + this.offsetPoint.x, p.y + this.offsetPoint.y);
    });
    this.rotation = r;
  }
  setPoints(points: Vector[], t = 0, f?: LerpFunc) {
    const lastPoint = this.points.length > 0 ? this.points[this.points.length - 1] : new Vector(0, 0);
    if (points.length > this.points.length) {
      while (points.length > this.points.length) {
        this.points.push(new Vector(lastPoint.x, lastPoint.y));
      }
    }

    const initial = this.points.map((p) => p.clone());
    const changes = [
      ...points.map((p, i) => p.clone().sub(this.points[i])),
      ...this.points
        .slice(points.length, this.points.length)
        .map((point) => (points[points.length - 1] || new Vector(0, 0)).clone().sub(point))
    ];

    return transitionValues(
      () => {
        this.points = points.map((p) => new Vector(p.x + this.offsetPoint.x, p.y + this.offsetPoint.y));
      },
      (p) => {
        this.points = this.points.map((point, i) => {
          point.x += (changes[i]?.x || 0) * p;
          point.y += (changes[i]?.y || 0) * p;
          return point;
        });
        return this.running;
      },
      () => {
        this.points = initial.map((p, i) => {
          p.x += changes[i].x;
          p.y += changes[i].y;
          return p.clone();
        });
        this.points.splice(points.length, this.points.length);
      },
      t,
      f
    );
  }
  clone() {
    return new Polygon(
      this.pos.clone(),
      [...this.points.map((p) => p.clone())],
      this.color.clone(),
      this.rotation,
      this.offsetPoint.clone()
    );
  }
  rotate(deg: number, t = 0, f?: LerpFunc) {
    const newRotation = this.rotation + deg;
    return transitionValues(
      () => {
        this.rotation = newRotation;
      },
      (p) => {
        this.rotation += deg * p;
        return this.running;
      },
      () => {
        this.rotation = newRotation;
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
        return this.running;
      },
      () => {
        this.rotation = deg;
      },
      t,
      f
    );
  }
  draw(c: CanvasRenderingContext2D) {
    const points = this.points.map((p) => p.clone().rotate(this.rotation));
    c.beginPath();
    c.fillStyle = this.color.toHex();
    if (points.length > 0) {
      c.moveTo(points[0].x + this.pos.x, points[0].y + this.pos.y);
      for (let i = 1; i < points.length; i++) {
        c.lineTo(points[i].x + this.pos.x, points[i].y + this.pos.y);
      }
    }
    c.fill();
    c.closePath();
  }
}

export class Plane extends SimulationElement3d {
  points: Vector3[];
  wireframe: boolean;
  fillPlane: boolean;
  constructor(
    pos: Vector3,
    points: Vector3[],
    color = new Color(0, 0, 0),
    fill = true,
    wireframe = false,
    lighting = false
  ) {
    super(pos, color, lighting, 'plane');
    this.points = points;
    this.fillPlane = fill;
    this.wireframe = wireframe;
  }
  clone() {
    return new Plane(
      this.pos.clone(),
      this.points.map((p) => p.clone()),
      this.color.clone(),
      this.fillPlane,
      this.wireframe
    );
  }
  setPoints(points: Vector3[], t = 0, f?: LerpFunc) {
    const lastPoint = this.points.length > 0 ? this.points[this.points.length - 1] : new Vector3(0, 0, 0);
    if (points.length > this.points.length) {
      while (points.length > this.points.length) {
        this.points.push(new Vector3(lastPoint.x, lastPoint.y, lastPoint.z));
      }
    }

    const initial = this.points.map((p) => p.clone());
    const changes = [
      ...points.map((p, i) => p.clone().sub(this.points[i])),
      ...this.points
        .slice(points.length, this.points.length)
        .map((point) => (points[points.length - 1] || new Vector3(0, 0, 0)).clone().sub(point))
    ];

    return transitionValues(
      () => {
        this.points = points.map((p) => new Vector3(p.x, p.y, p.z));
      },
      (p) => {
        this.points = this.points.map((point, i) => {
          point.x += (changes[i]?.x || 0) * p;
          point.y += (changes[i]?.y || 0) * p;
          point.z += (changes[i]?.z || 0) * p;
          return point;
        });
        return this.running;
      },
      () => {
        this.points = initial.map((p, i) => {
          p.x += changes[i].x;
          p.y += changes[i].y;
          p.z += changes[i].z;
          return p.clone();
        });
        this.points.splice(points.length, this.points.length);
      },
      t,
      f
    );
  }
  draw(
    c: CanvasRenderingContext2D,
    camera: Camera,
    displaySurface: Vector3,
    _ratio: number,
    lightSources: LightSource[],
    ambientLighting: number
  ) {
    let dampen = 0;
    const maxDampen = 2;
    if (this.lighting) {
      for (let i = 0; i < lightSources.length; i++) {
        const center = this.getCenter();
        const normal = center.clone().sub(this.pos).normalize();
        const vec = new Vector3(
          center.x + lightSources[i].pos.x,
          center.y + lightSources[i].pos.y,
          center.z - lightSources[i].pos.z
        );
        const angle = angleBetweenVector3(normal, vec);
        dampen += Math.max(
          ambientLighting,
          (Math.max(0, 90 - Math.abs(angle)) / 90) * lightSources[i].intensity
        );
        dampen = Math.min(dampen, maxDampen);
      }
    }

    c.beginPath();
    c.strokeStyle = '#000000';

    const tempColor = this.color.clone();
    if (this.lighting) {
      tempColor.r *= dampen;
      tempColor.g *= dampen;
      tempColor.b *= dampen;
      tempColor.r = clamp(tempColor.r, 0, 255);
      tempColor.g = clamp(tempColor.g, 0, 255);
      tempColor.b = clamp(tempColor.b, 0, 255);
    }
    c.fillStyle = tempColor.toHex();

    c.lineWidth = 2;
    for (let i = 0; i < this.points.length; i++) {
      let p1: ProjectedPoint;
      let p2: ProjectedPoint;
      if (i === this.points.length - 1) {
        p1 = projectPoint(this.points[i], camera, displaySurface);
        p2 = projectPoint(this.points[0], camera, displaySurface);
      } else {
        p1 = projectPoint(this.points[i], camera, displaySurface);
        p2 = projectPoint(this.points[i + 1], camera, displaySurface);
      }
      if (!p1.behindCamera && !p2.behindCamera) {
        if (i === 0) {
          c.moveTo(p1.point.x, p1.point.y);
        }
        c.lineTo(p2.point.x, p2.point.y);
      }
    }
    if (this.wireframe) c.stroke();
    if (this.fillPlane) c.fill();
    c.closePath();
  }
  getNormals() {
    if (this.points.length >= 3) {
      const vec1 = this.points[0].clone().sub(this.points[1]);
      const vec2 = this.points[1].clone().sub(this.points[2]);
      const res = vec1.cross(vec2).normalize();
      return [res, res.clone().multiply(-1)];
    }
    return [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];
  }
  getCenter() {
    const avgVec = this.points.reduce((acc, curr) => acc.add(curr), new Vector3(0, 0, 0));
    avgVec.divide(this.points.length);
    return avgVec;
  }
}

export class Cube extends SimulationElement3d {
  width: number;
  height: number;
  depth: number;
  planes: Plane[] = [];
  points: Vector3[] = [];
  rotation: Vector3;
  fillCube: boolean;
  wireframe: boolean;
  constructor(
    pos: Vector3,
    width: number,
    height: number,
    depth: number,
    color = new Color(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    fill = true,
    wireframe = false,
    lighting = false
  ) {
    super(pos, color, lighting, 'cube');
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.wireframe = wireframe;
    this.fillCube = fill;
    this.rotation = rotation;
    this.generatePoints();
    this.generatePlanes();
  }
  generatePoints() {
    this.points = [
      new Vector3(-this.width / 2, -this.height / 2, -this.depth / 2),
      new Vector3(this.width / 2, -this.height / 2, -this.depth / 2),
      new Vector3(this.width / 2, this.height / 2, -this.depth / 2),
      new Vector3(-this.width / 2, this.height / 2, -this.depth / 2),
      new Vector3(-this.width / 2, -this.height / 2, this.depth / 2),
      new Vector3(this.width / 2, -this.height / 2, this.depth / 2),
      new Vector3(this.width / 2, this.height / 2, this.depth / 2),
      new Vector3(-this.width / 2, this.height / 2, this.depth / 2)
    ];
  }
  private generatePlanes() {
    const points = this.points.map((p) => p.clone().rotate(this.rotation).add(this.pos));
    this.planes = [
      new Plane(
        this.pos,
        [points[0], points[1], points[2], points[3]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      ),
      new Plane(
        this.pos,
        [points[0], points[1], points[5], points[4]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      ),
      new Plane(
        this.pos,
        [points[4], points[5], points[6], points[7]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      ),
      new Plane(
        this.pos,
        [points[3], points[2], points[6], points[7]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      ),
      new Plane(
        this.pos,
        [points[0], points[3], points[7], points[4]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      ),
      new Plane(
        this.pos,
        [points[2], points[1], points[5], points[6]],
        this.color,
        this.fillCube,
        this.wireframe,
        this.lighting
      )
    ];
  }
  private updatePlanes() {
    const points = this.points.map((p) => p.clone().rotate(this.rotation).add(this.pos));
    const pointsArr = [
      [points[0], points[1], points[2], points[3]],
      [points[0], points[1], points[5], points[4]],
      [points[4], points[5], points[6], points[7]],
      [points[3], points[2], points[6], points[7]],
      [points[0], points[3], points[7], points[4]],
      [points[2], points[1], points[5], points[6]]
    ];
    this.planes.forEach((plane, index) => {
      plane.setPoints(pointsArr[index]);
    });
  }
  rotate(amount: Vector3, t = 0, f?: LerpFunc) {
    const initial = this.rotation.clone();
    return transitionValues(
      () => {
        this.rotation.x = initial.x + amount.x;
        this.rotation.y = initial.y + amount.y;
        this.rotation.z = initial.z + amount.z;
      },
      (p) => {
        this.rotation.x += amount.x * p;
        this.rotation.y += amount.y * p;
        this.rotation.z += amount.z * p;
        return this.running;
      },
      () => {
        this.rotation.x = initial.x + amount.x;
        this.rotation.y = initial.y + amount.y;
        this.rotation.z = initial.z + amount.z;
      },
      t,
      f
    );
  }
  rotateTo(amount: Vector3, t = 0, f?: LerpFunc) {
    const changeX = amount.x - this.rotation.x;
    const changeY = amount.y - this.rotation.y;
    const changeZ = amount.z - this.rotation.z;

    return transitionValues(
      () => {
        this.rotation.x = amount.x;
        this.rotation.y = amount.y;
        this.rotation.z = amount.z;
      },
      (p) => {
        this.rotation.x += changeX * p;
        this.rotation.y += changeY * p;
        this.rotation.z += changeZ * p;
        return this.running;
      },
      () => {
        this.rotation.x = amount.x;
        this.rotation.y = amount.y;
        this.rotation.z = amount.z;
      },
      t,
      f
    );
  }
  draw(
    c: CanvasRenderingContext2D,
    camera: Camera,
    displaySurface: Vector3,
    _ratio: number,
    lightSources: LightSource[],
    ambientLighting: number
  ) {
    this.updatePlanes();
    this.planes = sortPlanes(this.planes, camera);
    for (let i = 0; i < this.planes.length; i++) {
      this.planes[i].draw(c, camera, displaySurface, _ratio, lightSources, ambientLighting);
    }
  }
}

export class Square extends SimulationElement {
  width: number;
  height: number;
  rotation: number;
  private showNodeVectors: boolean;
  hovering: boolean;
  events: Event[];
  offsetPoint: Vector;
  topLeft: Vector;
  topRight: Vector;
  bottomLeft: Vector;
  bottomRight: Vector;
  constructor(
    pos: Vector,
    width: number,
    height: number,
    color = new Color(0, 0, 0),
    offsetPoint = new Vector(0, 0),
    rotation = 0
  ) {
    super(pos, color, 'square');
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.showNodeVectors = false;
    this.hovering = false;
    this.events = [];
    this.topLeft = new Vector(0, 0);
    this.topRight = new Vector(0, 0);
    this.bottomLeft = new Vector(0, 0);
    this.bottomRight = new Vector(0, 0);
    this.offsetPoint = offsetPoint;
    this.updateOffsetPosition(offsetPoint);
  }
  private generateVectors() {
    this.topLeft = new Vector(-this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
    this.topRight = new Vector(this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
    this.bottomLeft = new Vector(-this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
    this.bottomRight = new Vector(this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
  }
  updateOffsetPosition(p: Vector) {
    this.offsetPoint = p.clone();
    this.generateVectors();
  }
  setNodeVectors(show: boolean) {
    this.showNodeVectors = show;
  }
  rotate(deg: number, t = 0, f?: LerpFunc) {
    const initial = this.rotation;

    return transitionValues(
      () => {
        this.rotation = initial + deg;
      },
      (p) => {
        this.rotation += deg * p;
        return this.running;
      },
      () => {
        this.rotation = initial + deg;
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
        return this.running;
      },
      () => {
        this.rotation = deg;
      },
      t,
      f
    );
  }
  draw(c: CanvasRenderingContext2D) {
    this.generateVectors();
    const topRight = this.topRight.clone().rotate(this.rotation);
    const topLeft = this.topLeft.clone().rotate(this.rotation);
    const bottomRight = this.bottomRight.clone().rotate(this.rotation);
    const bottomLeft = this.bottomLeft.clone().rotate(this.rotation);

    c.beginPath();
    c.fillStyle = this.color.toHex();
    c.moveTo(this.pos.x + topLeft.x + this.offsetPoint.x, this.pos.y + topLeft.y + this.offsetPoint.y);
    c.lineTo(this.pos.x + topRight.x + this.offsetPoint.x, this.pos.y + topRight.y + this.offsetPoint.y);
    c.lineTo(
      this.pos.x + bottomRight.x + this.offsetPoint.x,
      this.pos.y + bottomRight.y + this.offsetPoint.y
    );
    c.lineTo(this.pos.x + bottomLeft.x + this.offsetPoint.x, this.pos.y + bottomLeft.y + this.offsetPoint.y);
    c.fill();
    c.closePath();

    if (this.showNodeVectors) {
      this.topLeft.draw(c, new Vector(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
      this.topRight.draw(c, new Vector(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
      this.bottomLeft.draw(c, new Vector(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
      this.bottomRight.draw(c, new Vector(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
    }
  }
  scale(value: number, t = 0, f?: LerpFunc) {
    return new Promise<void>(async (resolve) => {
      await Promise.all([this.scaleWidth(value, t, f), this.scaleHeight(value, t, f)]);
      resolve();
    });
  }
  scaleWidth(value: number, t = 0, f?: LerpFunc) {
    const width = this.width * value;
    return this.setWidth(width, t, f);
  }
  scaleHeight(value: number, t = 0, f?: LerpFunc) {
    const height = this.height * value;
    return this.setHeight(height, t, f);
  }
  setWidth(value: number, t = 0, f?: LerpFunc) {
    const initial = this.width;
    const change = value - initial;

    return transitionValues(
      () => {
        this.width = value;
      },
      (p) => {
        this.width += change * p;
        return this.running;
      },
      () => {
        this.width = value;
      },
      t,
      f
    );
  }
  setHeight(value: number, t = 0, f?: LerpFunc) {
    const initial = this.height;
    const change = value - initial;

    return transitionValues(
      () => {
        this.height = value;
      },
      (p) => {
        this.height += change * p;
        return this.running;
      },
      () => {
        this.height = value;
      },
      t,
      f
    );
  }
  contains(p: Vector) {
    const topLeftVector = this.topLeft.clone();
    const topRightVector = this.topRight.clone();
    const bottomLeftVector = this.bottomLeft.clone();
    const cursorVector = new Vector(
      p.x - this.pos.x - this.offsetPoint.x,
      p.y - this.pos.y - this.offsetPoint.y
    );
    cursorVector.rotate(-this.rotation);

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

class Event {
  event: string;
  callback: Function;
  constructor(event: string, callback: Function) {
    this.event = event;
    this.callback = callback;
  }
}

export class Simulation {
  scene: (SimulationElement | SimulationElement3d)[];
  fitting: boolean;
  bgColor: Color;
  canvas: HTMLCanvasElement | null = null;
  width: number = 0;
  height: number = 0;
  ratio: number;
  running: boolean;
  _prevReq: number;
  events: Event[];
  ctx: CanvasRenderingContext2D | null = null;
  camera: Camera;
  center: Vector;
  displaySurface: Vector3;
  forward = new Vector3(0, 0, 1);
  backward = new Vector3(0, 0, -1);
  left = new Vector3(-1, 0, 0);
  right = new Vector3(1, 0, 0);
  up = new Vector3(0, -1, 0);
  down = new Vector3(0, 1, 0);
  lightSources: LightSource[];
  ambientLighting: number;
  constructor(
    id: string,
    cameraPos = new Vector3(0, 0, -200),
    cameraRot = new Vector3(0, 0, 0),
    displaySurfaceDepth?: number,
    center = new Vector(0, 0),
    displaySurfaceSize?: Vector
  ) {
    this.scene = [];
    this.fitting = false;
    this.bgColor = new Color(255, 255, 255);
    this.running = true;
    this._prevReq = 0;
    this.events = [];
    this.camera = new Camera(cameraPos, cameraRot);
    this.center = center;
    this.displaySurface = new Vector3(0, 0, 0);
    this.ratio = window.devicePixelRatio;
    this.lightSources = [];
    this.ambientLighting = 0;

    this.setDirections();

    const defaultDepth = 2000;

    this.canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!this.canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    window.addEventListener('resize', () => this.resizeCanvas(this.canvas));
    this.resizeCanvas(this.canvas);

    if (displaySurfaceSize) {
      this.displaySurface = new Vector3(
        displaySurfaceSize.x,
        displaySurfaceSize.y,
        displaySurfaceDepth || defaultDepth
      );
    } else {
      this.displaySurface = new Vector3(this.width / 2, this.height / 2, displaySurfaceDepth || defaultDepth);
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;

    this.render(ctx);
  }
  private updateSceneLightSources() {
    this.scene.forEach((obj) => {
      if ((obj as SceneCollection)._isSceneCollection) {
        (obj as SceneCollection).setLightSources(this.lightSources);
      }
    });
  }
  setLightSources(sources: LightSource[]) {
    this.lightSources = sources;
    this.updateSceneLightSources();
  }
  addLightSource(source: LightSource) {
    this.lightSources.push(source);
    this.updateSceneLightSources();
  }
  removeLightSourceWithId(id: string) {
    this.lightSources = this.lightSources.filter((source) => source.id !== id);
    this.updateSceneLightSources();
  }
  getLightSourceWithId(id: string) {
    for (let i = 0; i < this.lightSources.length; i++) {
      if (this.lightSources[i].id === id) return this.lightSources[i];
    }
    return null;
  }
  setAmbientLighting(val: number) {
    this.ambientLighting = val;
    this.scene.forEach((obj) => {
      if ((obj as SceneCollection)._isSceneCollection) {
        (obj as SceneCollection).setAmbientLighting(this.ambientLighting);
      }
    });
  }
  setDirections() {
    const degRotation = new Vector3(
      radToDeg(this.camera.rot.y),
      radToDeg(this.camera.rot.x),
      radToDeg(this.camera.rot.z)
    );
    this.forward = new Vector3(0, 0, 1).rotate(degRotation);
    this.backward = this.forward.clone().multiply(-1);
    this.left = new Vector3(-1, 0, 0).rotate(degRotation);
    this.right = this.left.clone().multiply(-1);
  }
  render(c: CanvasRenderingContext2D) {
    if (!this.canvas) return;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    c.beginPath();
    c.fillStyle = this.bgColor.toHex();
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    c.closePath();

    for (const element of this.scene) {
      if (element._3d) {
        (element as SimulationElement3d).draw(
          c,
          this.camera,
          this.displaySurface,
          this.ratio,
          this.lightSources,
          this.ambientLighting
        );
      } else {
        (element as SimulationElement).draw(c);
      }
    }
    if (this.running) {
      this._prevReq = window.requestAnimationFrame(() => this.render(c));
    }
  }
  end() {
    this.running = false;
    for (let i = 0; i < this.scene.length; i++) {
      this.scene[i].end();
    }
    window.removeEventListener('resize', () => this.resizeCanvas(this.canvas));
    window.cancelAnimationFrame(this._prevReq);
  }
  add(element: SimulationElement | SimulationElement3d, id: string | null = null) {
    if (!this.canvas) return;
    element.setSimulationElement(this.canvas);
    if (id !== null) {
      element.setId(id);
    }
    if ((element as SceneCollection)._isSceneCollection) {
      (element as SceneCollection).set3dObjects(this.camera, this.displaySurface, this.ratio);
      (element as SceneCollection).setAmbientLighting(this.ambientLighting);
    }
    this.scene.push(element);
  }
  removeWithId(id: string) {
    this.scene = this.scene.filter((item) => item.id !== id);
  }
  removeWithObject(element: SimulationElement) {
    this.scene = this.scene.filter((item) => item === element);
  }
  on<K extends keyof HTMLElementEventMap>(event: K, callback: Function) {
    if (!this.canvas) return;
    this.events.push(new Event(event, callback));
    // @ts-ignore
    this.canvas.addEventListener(event, callback);
  }
  removeListener<K extends keyof HTMLElementEventMap>(event: K, callback: Function) {
    this.events = this.events.filter((e) => {
      if (e.event === event && e.callback == callback) {
        if (this.canvas) {
          // @ts-ignore
          this.canvas.removeEventListener(e.event, e.callback);
        }
        return false;
      }
      return true;
    });
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
  resizeCanvas(c: HTMLCanvasElement | null) {
    if (!c) return;
    if (!this.canvas) return;
    if (this.fitting) {
      if (c.parentElement) {
        const width = c.parentElement.clientWidth;
        const height = c.parentElement.clientHeight;
        this.canvas.width = width * this.ratio;
        this.canvas.height = height * this.ratio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
      }
    }
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.displaySurface.x = this.width / 2;
    this.displaySurface.y = this.height / 2;
  }
  empty() {
    this.scene = [];
  }
  moveCamera(v: Vector3, t = 0, f?: LerpFunc) {
    const initial = this.camera.pos.clone();
    return transitionValues(
      () => {
        this.camera.pos.add(v);
      },
      (p) => {
        this.camera.pos.x += v.x * p;
        this.camera.pos.y += v.y * p;
        this.camera.pos.z += v.z * p;
        return this.running;
      },
      () => {
        this.camera.pos = initial.add(v);
      },
      t,
      f
    );
  }
  moveCameraTo(v: Vector3, t = 0, f?: LerpFunc) {
    const changeX = v.x - this.camera.pos.x;
    const changeY = v.y - this.camera.pos.y;
    const changeZ = v.z - this.camera.pos.z;
    return transitionValues(
      () => {
        this.camera.pos = v.clone();
      },
      (p) => {
        this.camera.pos.x += changeX * p;
        this.camera.pos.y += changeY * p;
        this.camera.pos.z += changeZ * p;
        return this.running;
      },
      () => {
        this.camera.pos = v.clone();
      },
      t,
      f
    );
  }
  rotateCamera(v: Vector3, t = 0, f?: LerpFunc) {
    const initial = this.camera.rot.clone();
    return transitionValues(
      () => {
        this.camera.rot.x = initial.x + degToRad(v.x);
        this.camera.rot.y = initial.y + degToRad(v.y);
        this.camera.rot.z = initial.z + degToRad(v.z);
        this.setDirections();
      },
      (p) => {
        this.camera.rot.x += degToRad(v.x) * p;
        this.camera.rot.y += degToRad(v.y) * p;
        this.camera.rot.z += degToRad(v.z) * p;
        this.setDirections();
        return this.running;
      },
      () => {
        this.camera.rot.x = initial.x + degToRad(v.x);
        this.camera.rot.y = initial.y + degToRad(v.y);
        this.camera.rot.z = initial.z + degToRad(v.z);
        this.setDirections();
      },
      t,
      f
    );
  }
  rotateCameraTo(v: Vector3, t = 0, f?: LerpFunc) {
    const changeX = degToRad(v.x) - this.camera.rot.x;
    const changeY = degToRad(v.y) - this.camera.rot.y;
    const changeZ = degToRad(v.z) - this.camera.rot.z;
    return transitionValues(
      () => {
        this.camera.rot = v.clone();
        this.setDirections();
      },
      (p) => {
        this.camera.rot.x += changeX * p;
        this.camera.rot.y += changeY * p;
        this.camera.rot.z += changeZ * p;
        this.setDirections();
        return this.running;
      },
      () => {
        this.camera.rot = v.clone();
        this.setDirections();
      },
      t,
      f
    );
  }
}

export function pythag(x: number, y: number) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

export function distance(p1: Vector, p2: Vector) {
  return pythag(p1.x - p2.x, p1.y - p2.y);
}

export function distance3d(vec1: Vector3, vec2: Vector3) {
  return Math.sqrt(
    Math.pow(vec2.x - vec1.x, 2) + Math.pow(vec2.y - vec1.y, 2) + Math.pow(vec2.z - vec1.z, 2)
  );
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
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
  callback2: (percent: number) => boolean,
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
      let prevFrame = 0;
      const step = (t: number, f: (n: number) => number) => {
        const newT = f(t);
        const canContinue = callback2(newT - prevPercent);
        if (!canContinue) {
          window.cancelAnimationFrame(prevFrame);
          return;
        }
        prevPercent = newT;
        if (t < 1) {
          prevFrame = window.requestAnimationFrame(() => step(t + inc, f));
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

export function frameLoop<T extends (...args: any[]) => any>(cb: T): (...params: Parameters<T>) => void {
  let prevFrame = 0;
  function start(...args: Parameters<T>) {
    let res = cb(...args);
    if (res === false) {
      window.cancelAnimationFrame(prevFrame);
      return;
    }
    if (!Array.isArray(res)) res = args;
    prevFrame = window.requestAnimationFrame(() => start(...res));
  }
  return (...p: Parameters<T>) => {
    start(...p);
  };
}

type ProjectedPoint = {
  point: Vector;
  behindCamera: boolean;
};

function getTopPoint(points: Vector3[], camera: Camera) {
  return points.reduce(
    (prev, curr) => (distance3d(curr, camera.pos) <= distance3d(prev, camera.pos) ? curr : prev),
    points[0]
  );
}

function getAveragePointDist(points: Vector3[], camera: Camera) {
  return points.reduce((prev, curr) => prev + distance3d(curr, camera.pos), 0);
}

function sortPlanes(planes: Plane[], camera: Camera) {
  const res = planes.sort((a, b) => {
    const topPointA = getTopPoint(a.points, camera);
    const topPointB = getTopPoint(b.points, camera);
    const distA = distance3d(topPointA, camera.pos);
    const distB = distance3d(topPointB, camera.pos);
    if (distA === distB) {
      const avgDistA = getAveragePointDist(a.points, camera);
      const avgDistB = getAveragePointDist(b.points, camera);
      return avgDistB - avgDistA;
    }
    return distB - distA;
  });
  return res;
}

export function projectPoint(p: Vector3, cam: Camera, displaySurface: Vector3): ProjectedPoint {
  const mat1 = [
    [1, 0, 0],
    [0, Math.cos(cam.rot.x), Math.sin(cam.rot.x)],
    [0, -Math.sin(cam.rot.x), Math.cos(cam.rot.x)]
  ];
  const mat2 = [
    [Math.cos(cam.rot.y), 0, -Math.sin(cam.rot.y)],
    [0, 1, 0],
    [Math.sin(cam.rot.y), 0, Math.cos(cam.rot.y)]
  ];
  const mat3 = [
    [Math.cos(cam.rot.z), Math.sin(cam.rot.z), 0],
    [-Math.sin(cam.rot.z), Math.cos(cam.rot.z), 0],
    [0, 0, 1]
  ];
  const mat4 = [[p.x - cam.pos.x], [p.y - cam.pos.y], [p.z - cam.pos.z]];
  const matRes1 = [
    [
      mat1[0][0] * mat2[0][0] + mat1[0][1] * mat2[1][0] + mat1[0][2] * mat2[2][0],
      mat1[0][0] * mat2[0][1] + mat1[0][1] * mat2[1][1] + mat1[0][2] * mat2[2][1],
      mat1[0][0] * mat2[0][2] + mat1[0][1] * mat2[1][2] + mat1[0][2] * mat2[2][2]
    ],
    [
      mat1[1][0] * mat2[0][0] + mat1[1][1] * mat2[1][0] + mat1[1][2] * mat2[2][0],
      mat1[1][0] * mat2[0][1] + mat1[1][1] * mat2[1][1] + mat1[1][2] * mat2[2][1],
      mat1[1][0] * mat2[0][2] + mat1[1][1] * mat2[1][2] + mat1[1][2] * mat2[2][2]
    ],
    [
      mat1[2][0] * mat2[0][0] + mat1[2][1] * mat2[1][0] + mat1[2][2] * mat2[2][0],
      mat1[2][0] * mat2[0][1] + mat1[2][1] * mat2[1][1] + mat1[2][2] * mat2[2][1],
      mat1[2][0] * mat2[0][2] + mat1[2][1] * mat2[1][2] + mat1[2][2] * mat2[2][2]
    ]
  ];
  const matRes2 = [
    [
      matRes1[0][0] * mat3[0][0] + matRes1[0][1] * mat3[1][0] + matRes1[0][2] * mat3[2][0],
      matRes1[0][0] * mat3[0][1] + matRes1[0][1] * mat3[1][1] + matRes1[0][2] * mat3[2][1],
      matRes1[0][0] * mat3[0][2] + matRes1[0][1] * mat3[1][2] + matRes1[0][2] * mat3[2][2]
    ],
    [
      matRes1[1][0] * mat3[0][0] + matRes1[1][1] * mat3[1][0] + matRes1[1][2] * mat3[2][0],
      matRes1[1][0] * mat3[0][1] + matRes1[1][1] * mat3[1][1] + matRes1[1][2] * mat3[2][1],
      matRes1[1][0] * mat3[0][2] + matRes1[1][1] * mat3[1][2] + matRes1[1][2] * mat3[2][2]
    ],
    [
      matRes1[2][0] * mat3[0][0] + matRes1[2][1] * mat3[1][0] + matRes1[2][2] * mat3[2][0],
      matRes1[2][0] * mat3[0][1] + matRes1[2][1] * mat3[1][1] + matRes1[2][2] * mat3[2][1],
      matRes1[2][0] * mat3[0][2] + matRes1[2][1] * mat3[1][2] + matRes1[2][2] * mat3[2][2]
    ]
  ];
  const matRes3 = [
    [matRes2[0][0] * mat4[0][0] + matRes2[0][1] * mat4[1][0] + matRes2[0][2] * mat4[2][0]],
    [matRes2[1][0] * mat4[0][0] + matRes2[1][1] * mat4[1][0] + matRes2[1][2] * mat4[2][0]],
    [matRes2[2][0] * mat4[0][0] + matRes2[2][1] * mat4[1][0] + matRes2[2][2] * mat4[2][0]]
  ];
  const d = new Vector3(matRes3[0][0], matRes3[1][0], matRes3[2][0]);

  const bx = (displaySurface.z * d.x) / d.z + displaySurface.x;
  const by = (displaySurface.z * d.y) / d.z + displaySurface.y;

  return {
    point: new Vector(bx, by),
    behindCamera: d.z <= 0
  };
}

export function randInt(range: number, min = 0) {
  return Math.floor(Math.random() * (range - min)) + min;
}

export function randomColor() {
  return new Color(randInt(255), randInt(255), randInt(255));
}

export function vector3DegToRad(vec: Vector3) {
  return new Vector3(degToRad(vec.x), degToRad(vec.y), degToRad(vec.z));
}

export function vector3RadToDeg(vec: Vector3) {
  return new Vector3(radToDeg(vec.x), radToDeg(vec.y), radToDeg(vec.z));
}

export function angleBetweenVector3(vec1: Vector3, vec2: Vector3) {
  const dot = vec1.dot(vec2);
  let val = dot / (vec1.getMag() * vec2.getMag());
  val = Math.acos(val);
  return radToDeg(val);
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export default {
  Vector,
  SimulationElement,
  SimulationElement3d,
  Color,
  SceneCollection,
  Line,
  Circle,
  Polygon,
  Square,
  Simulation,
  pythag,
  distance,
  degToRad,
  radToDeg,
  transitionValues,
  compare,
  Cube,
  Camera,
  Plane,
  lerp,
  smoothStep,
  linearStep,
  frameLoop,
  randInt,
  randomColor,
  vector3DegToRad,
  vector3RadToDeg,
  angleBetweenVector3
};
