import { Simulation, Square, Color, Point, Vector } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const square = new Square(new Point(100, 100), 50, 50, new Color(255, 0, 0));
canvas.add(square);

square.rotate(180, 1);
square.move(new Vector(200, 50), 1);
