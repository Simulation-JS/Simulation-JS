import {
  Vector3,
  Plane,
  Square,
  randInt,
  Vector,
  Color,
  Simulation,
  Circle,
  Line,
  frameLoop,
  Polygon,
  radToDeg,
  randomColor
} from '../src/simulation';

const canvas = new Simulation('canvas', new Vector3(0, 0, -250), new Vector3(0, 0, 0));
canvas.fitElement();

function timeFunc(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

const size = 80;
let vertices = 3;
const plane = new Plane(new Vector3(0, 0, 0), [], randomColor(), true, true);
canvas.add(plane);

function generatePoints(n: number, s: number) {
  return Array(n)
    .fill(new Vector3(0, 0, 0))
    .map((_, i) => new Vector3(1, 0, 0).multiply(s).rotate(new Vector3(0, 0, (360 / n) * i)));
}

(async function main() {
  await plane.setPoints(generatePoints(vertices, size), 2, timeFunc);
  vertices++;
  main();
})();

let pressingW = false;
let pressingA = false;
let pressingS = false;
let pressingD = false;
let pressingSpace = false;
let pressingShift = false;

const keydownEvents = {
  w: () => (pressingW = true),
  a: () => (pressingA = true),
  s: () => (pressingS = true),
  d: () => (pressingD = true),
  ' ': () => (pressingSpace = true),
  shift: () => (pressingShift = true)
};

const keyupEvents = {
  w: () => (pressingW = false),
  a: () => (pressingA = false),
  s: () => (pressingS = false),
  d: () => (pressingD = false),
  ' ': () => (pressingSpace = false),
  shift: () => (pressingShift = false)
};

let looking = false;
canvas.on('mousedown', () => {
  looking = true;
});

canvas.on('mouseup', () => {
  looking = false;
});

let prev = new Vector(0, 0);
canvas.on('mousemove', (e: MouseEvent) => {
  const dampen = 1000;
  const point = new Vector(e.offsetX, e.offsetY);
  if (looking) {
    const amount = new Vector(radToDeg(point.y - prev.y) / dampen, radToDeg(point.x - prev.x) / dampen);
    amount.multiplyX(-1);
    amount.multiply(-1);
    canvas.rotateCamera(new Vector3(amount.x, amount.y, 0));
  }
  prev = point;
});

addEventListener('keydown', (e: KeyboardEvent) => {
  const f = keydownEvents[e.key.toLowerCase()];
  f && f();
});

addEventListener('keyup', (e: KeyboardEvent) => {
  const f = keyupEvents[e.key.toLowerCase()];
  f && f();
});

const speed = 2;
frameLoop(() => {
  if (pressingW) {
    canvas.moveCamera(
      new Vector3(
        Math.sin(canvas.camera.rot.y) * Math.cos(canvas.camera.rot.x) * speed,
        0,
        Math.cos(canvas.camera.rot.y) * Math.cos(canvas.camera.rot.x) * speed
      )
    );
  }
  if (pressingA) {
    canvas.moveCamera(
      new Vector3(
        -Math.sin(canvas.camera.rot.y + Math.PI / 2) * speed,
        0,
        -Math.cos(canvas.camera.rot.y + Math.PI / 2) * speed
      )
    );
  }
  if (pressingS) {
    canvas.moveCamera(
      new Vector3(
        -Math.sin(canvas.camera.rot.y) * Math.cos(canvas.camera.rot.x) * speed,
        0,
        -Math.cos(canvas.camera.rot.y) * Math.cos(canvas.camera.rot.x) * speed
      )
    );
  }
  if (pressingD) {
    canvas.moveCamera(
      new Vector3(
        Math.sin(canvas.camera.rot.y + Math.PI / 2) * speed,
        0,
        Math.cos(canvas.camera.rot.y + Math.PI / 2) * speed
      )
    );
  }
  if (pressingSpace) {
    canvas.moveCamera(new Vector3(0, -speed, 0));
  }
  if (pressingShift) {
    canvas.moveCamera(new Vector3(0, speed, 0));
  }
})();
