import {
  Simulation,
  Vector3,
  Cube,
  frameLoop,
  Vector,
  degToRad,
  Square,
  Color,
  smoothStep,
  radToDeg
} from '../src/simulation';

const canvas = new Simulation('canvas', new Vector3(0, 0, -200), new Vector3(0, 0, 0));
canvas.fitElement();

const cube = new Cube(
  new Vector3(0, 0, 0),
  100,
  100,
  100,
  new Color(random(255), random(255), random(255)),
  true,
  true
);
canvas.add(cube);

function random(range: number) {
  return Math.floor(Math.random() * range);
}

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
