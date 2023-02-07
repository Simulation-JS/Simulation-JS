import { Simulation, Square, Color, Point } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();
canvas.setBgColor(new Color(0, 0, 0));

const square1 = new Square(new Point(100, 100), 50, 50, new Color(255, 0, 0));
canvas.add(square1);
