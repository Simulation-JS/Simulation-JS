import { Simulation, Square, Point, Color } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const square = new Square(new Point(200, 200), 50, 50, new Color(255, 0, 0));
canvas.add(square);

canvas.on('mousemove', (e: MouseEvent) => {
  const p = new Point(e.offsetX * canvas.ratio, e.offsetY * canvas.ratio);
  square.updateOffsetPosition(p.sub(square.pos));
});

(async function main() {
  await square.rotate(360, 4);
  main();
})();
