import { Simulation, Square, Point, Color } from '../dist/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const square = new Square(new Point(100, 100), 100, 100, new Color(0, 0, 0));
canvas.add(square);

let colorIndex = 0;
const colors = [new Color(255, 0, 0), new Color(0, 255, 0), new Color(0, 0, 255)];

async function fillSquare() {
  console.log(colors[colorIndex]);
  await square.fill(colors[colorIndex], 1);
  colorIndex++;
  if (colorIndex > colors.length - 1) colorIndex = 0;
  fillSquare();
}
fillSquare();
