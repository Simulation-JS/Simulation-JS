import { Simulation, Square, Color, Point, Vector, smoothStep } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();
canvas.setBgColor(new Color(0, 0, 0));

const square1 = new Square(new Point(100, 100), 80, 80, new Color(255, 0, 0));
canvas.add(square1);

const square2 = new Square(new Point(100, 215), 80, 80, new Color(0, 0, 255));
canvas.add(square2);

square1.move(new Vector(400, 0), 1.5);
square2.move(new Vector(400, 0), 1.5, smoothStep);
