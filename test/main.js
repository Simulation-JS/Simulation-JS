import { Point, Simulation, Square, Color } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const square = new Square(new Point(50, 50), 50, 50, new Color(255, 0, 0));
canvas.add(square);
square.setNodeVectors(true);
square.rotate(342, 1);
