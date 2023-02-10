import { frameLoop } from '../src/simulation';

const loop = frameLoop((a: number) => {
  console.log(String.fromCharCode(a));
  if (a > 100) {
    return false;
  }
  return [a + 1];
});

loop(0);
