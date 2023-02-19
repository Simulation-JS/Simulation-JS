import { Polygon as p, Simulation as s, Vector as v, Color as c } from '../src/simulation';
let t = (x: number) =>
    x == 0 ? 0 : x == 1 ? 1 : Math.pow(2, -10 * x) * Math.sin(((x * 10 - 0.75) * (2 * Math.PI)) / 3) + 1,
  cc = !0,
  pr = 3,
  g = (n: number, s: number) =>
    Array(n)
      .fill(new v(0, 0))
      .map((_, i) => new v(1, 0).multiply(s).rotate((360 / n) * i)),
  d = new s('canvas'),
  l = 100,
  h = new p(new v(500, 500), g(3, l), new c(0, 123, 255));
d.fitElement();
d.add(h);
addEventListener(
  'keydown',
  (e: KeyboardEvent) =>
    cc &&
    (async () => {
      let k = e.key.trim(),
        n = +k;
      if (!isNaN(n) && k.length > 0) {
        (cc = !1),
          pr > n ? await h.setPoints(g(n, l), 0.2) : await h.setPoints(g(n, l), 1.2, t),
          (pr = n),
          (cc = !0);
      }
    })()
);
