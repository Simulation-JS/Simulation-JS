import { Simulation, Circle, Point, Color, smoothStep } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const circle = new Circle(new Point(200, 200), 50, new Color(0, 0, 255), 0, 180, 2, 45, false, true);
canvas.add(circle);

setTimeout(() => {
  main();
}, 1000);

async function main() {
  await circle.setEndAngle(270, 1);
  circle.rotate(90, 1);
}
