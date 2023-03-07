import {
  Simulation,
  Vector3,
  Cube,
  frameLoop,
  Vector,
  Color,
  radToDeg,
  randomColor,
  SceneCollection,
  LightSource
} from '../src/simulation';

const canvas = new Simulation('canvas', new Vector3(0, 0, -250), new Vector3(0, 0, 0));
canvas.fitElement();
// canvas.setAmbientLighting(0.4);

const test = new SceneCollection('test');
canvas.add(test);

const cube = new Cube(
  new Vector3(0, 0, 0),
  100,
  100,
  100,
  // new Color(0, 123, 255),
  randomColor(),
  new Vector3(0, 0, 0),
  true,
  true,
  true
);
test.add(cube);

canvas.addLightSource(new LightSource(new Vector3(-100, -100, -100), 1, 's1'));
// canvas.addLightSource(new LightSource(new Vector3(0, -20, -100), 1, 's1'));

function timeFunc(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

(async function main() {
  // await cube.rotate(new Vector3(360, 360, 0), 8);
  await cube.rotate(new Vector3(90, 0, 0), 2, timeFunc);
  // main();
  // await cube.rotate(new Vector3(360, 360, 0), 8);
  // cube.setLighting(false);
  // main();
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
    amount.x *= -1;
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
    canvas.moveCamera(canvas.forward);
  }
  if (pressingA) {
    canvas.moveCamera(canvas.left);
  }
  if (pressingS) {
    canvas.moveCamera(canvas.backward);
  }
  if (pressingD) {
    canvas.moveCamera(canvas.right);
  }
  if (pressingSpace) {
    canvas.moveCamera(new Vector3(0, -speed, 0));
  }
  if (pressingShift) {
    canvas.moveCamera(new Vector3(0, speed, 0));
  }
})();
