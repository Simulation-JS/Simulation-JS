import { Simulation, Square, Color, Point, smoothStep, linearStep } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();
canvas.setBgColor(new Color(0, 0, 0));

const square1 = new Square(new Point(100, 100), 50, 50, new Color(255, 0, 0));
canvas.add(square1);

const square2 = new Square(new Point(100, 175), 50, 50, new Color(0, 0, 255));
canvas.add(square2);

square1.move(new Point(500, 0), 2, linearStep);
square2.move(new Point(500, 0), 2, smoothStep);
