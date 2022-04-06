export type Position = {
  ratio: number; // [0-1]
};

export function create({ ratio }: { ratio: number }): Position {
  return {
    ratio,
  };
}

export const start = create({
  ratio: 0,
});
