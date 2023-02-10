import { frameLoop } from '../src/simulation';

const loop = frameLoop((a: number) => {
  console.log(String.fromCharCode(a));
  return [a + 1];
});

loop(0);
