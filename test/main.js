import { Point, Simulation, Arc, Color } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const arc = new Arc(new Point(100, 100), 10, 0, Math.PI, new Color(255, 0, 0));
canvas.add(arc);
