import { Simulation, Point, Color, Polygon } from '../src/simulation';

const canvas = new Simulation('canvas');
canvas.fitElement();

const poly = new Polygon(
  new Point(0, 0),
  [new Point(0, 0), new Point(-50, 50), new Point(50, 50)],
  new Color(0, 255, 100)
);

const start = new Point(200, 200);
const amount = 4;
const padding = 40;
for (let i = 0; i < amount; i++) {
  for (let j = 0; j < amount; j++) {
    const p = poly.clone();
    const valX = 200 * j + padding * j;
    const valY = 200 * i + padding * i;
    const point = start.clone().add(new Point(valX, valY));
    p.moveTo(point);
    p.fill(
      new Color(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      )
    );
    canvas.add(p);
  }
}
main();

async function main() {
  let action1: Promise<void>[] = [];
  for (let i = 0; i < canvas.scene.length; i++) {
    canvas.scene[i].fill(
      new Color(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      ),
      2
    );
    action1.push(
      (canvas.scene[i] as Polygon).setPoints([...poly.points.map((p) => p.clone()), new Point(50, 0)], 1)
    );
  }
  await Promise.all(action1);

  let action2: Promise<void>[] = [];
  for (let i = 0; i < canvas.scene.length; i++) {
    action2.push(
      (canvas.scene[i] as Polygon).setPoints(
        [new Point(-100, -100), new Point(100, -100), new Point(-100, 100), new Point(100, 100)],
        1
      )
    );
  }
  await Promise.all(action2);

  let action3: Promise<void>[] = [];
  for (let i = 0; i < canvas.scene.length; i++) {
    canvas.scene[i].fill(
      new Color(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      ),
      2
    );
    action3.push(
      (canvas.scene[i] as Polygon).setPoints(
        [new Point(-100, -100), new Point(100, -100), new Point(100, 100), new Point(-100, 100)],
        1
      )
    );
  }
  await Promise.all(action3);

  for (let i = 0; i < canvas.scene.length; i++) {
    (canvas.scene[i] as Polygon).rotate(90, 1);
  }
}
