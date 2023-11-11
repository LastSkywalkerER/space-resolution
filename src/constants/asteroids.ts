export const createCoordinate = (
  from: number = 5,
  to: number = 50,
  withMinus: boolean = true,
) =>
  Math.floor(Math.random() * (to - from) + from) *
  (withMinus && Math.round(Math.random()) === 0 ? -1 : 1);

export const asteroids: [number, number, number][] = Array.from(
  Array(50),
  () => [createCoordinate(), -1, createCoordinate()],
);
