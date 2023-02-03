import { Point, Simulation, Arc, Color } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const pos = new Point(200, 200);

const arc = new Arc(pos, 35, 0, 90, 6, new Color(255, 0, 0), 40);
canvas.add(arc);

arc.setStartAngle(180, 0.5);
arc.setEndAngle(450, 0.5);
