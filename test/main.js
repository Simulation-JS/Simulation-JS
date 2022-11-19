import { Simulation, Square, Point, Color } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const square = new Square(new Point(100, 100), 100, 100, new Color(255, 0, 0));
canvas.add(square);

square.on('hover', () => {
  square.fill(new Color(0, 255, 0), 0.15);
}, () => {
  square.fill(new Color(255, 0, 0), 0.15);
});
