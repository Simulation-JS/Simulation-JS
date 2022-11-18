import { Simulation, Square, Point, Color, Vector } from '../dist/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const square = new Square(new Point(100, 100), 50, 50, new Color(255, 0, 0));
canvas.add(square);

square.move(new Vector(100, 0), 1);
