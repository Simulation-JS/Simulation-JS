import { Simulation, Point, Color, Polygon } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const poly = new Polygon(
  new Point(200, 200),
  [new Point(0, 0), new Point(-50, 50), new Point(50, 50)],
  new Color(0, 255, 100)
);
canvas.add(poly);

(async () => {
  await poly.setPoints([...poly.points.map((p) => p.clone()), new Point(50, 0)], 1);
  await poly.setPoints(
    [new Point(-100, -100), new Point(100, -100), new Point(-100, 100), new Point(100, 100)],
    1
  );
  await poly.setPoints(
    [new Point(-100, -100), new Point(100, -100), new Point(100, 100), new Point(-100, 100)],
    1
  );
  poly.rotate(90, 1);
})();
