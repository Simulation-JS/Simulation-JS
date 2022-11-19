import { Simulation, Square, Point, Color, SceneCollection } from '../dist/simulation';

const canvas = new Simulation('canvas', 60);
canvas.fitElement();

const collection = new SceneCollection('epic');

const square = new Square(new Point(100, 100), 100, 100, new Color(255, 0, 0));
collection.add(square);

canvas.add(collection);

square.on('hover', () => {
  square.fill(new Color(0, 255, 0), 0.15);
}, () => {
  square.fill(new Color(255, 0, 0), 0.15);
});
