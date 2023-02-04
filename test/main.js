import { Point, Simulation, Vector, Color, Polygon, Circle } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const poly = new Polygon(
  new Point(300, 300),
  [new Point(0, 0), new Point(100, 0), new Point(50, 50), new Point(0, 50)],
  new Color(255, 0, 0),
  0,
  new Point(-50, -25)
);
canvas.add(poly);

let rotation = 0;
const rotationStep = 0.5;
const speed = 2;
(function main() {
  const vec = new Vector(speed, 0);
  vec.rotateTo(rotation);
  poly.move(vec);
  poly.rotateTo(rotation);
  rotation += rotationStep;
  requestAnimationFrame(main);
})();
