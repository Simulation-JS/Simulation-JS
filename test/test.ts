import { Square, randInt, Vector, Color, Simulation, Circle, Line, frameLoop } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const square = new Square(
  new Vector(300, 300),
  100,
  100,
  new Color(randInt(255), randInt(255), randInt(255))
);
canvas.add(square);

const circle = new Circle(new Vector(0, 0), 4, new Color(0, 0, 0));
canvas.add(circle);

const line = new Line(new Vector(0, 0), new Vector(0, 0), new Color(255, 0, 0), 2);
canvas.add(line);

let mousePos = new Vector(0, 0);
canvas.on('mousemove', (e: MouseEvent) => {
  const p = new Vector(e.offsetX * canvas.ratio, e.offsetY * canvas.ratio);
  mousePos = p;
});

frameLoop(() => {
  line.setStart(square.pos);
  line.setEnd(mousePos);
  circle.moveTo(mousePos);
  if (square.contains(mousePos)) {
    console.log('yes');
  } else {
    console.log('no');
  }
})();

(async function main() {
  await square.rotate(90, 1);
  main();
})();
