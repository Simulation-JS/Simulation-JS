import { Circle, Color, Simulation, Vector, Vector3 } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();
canvas.start();

const circle = new Circle(new Vector(100, 100), 10, new Color(255, 0, 0));
canvas.add(circle);

circle.fill(new Color(255, 0, 0, 0), 0.25);
