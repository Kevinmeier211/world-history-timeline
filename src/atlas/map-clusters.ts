/** Group overlapping 44px targets in screen space without inventing new place coordinates. */
export function clusterPoints<T>(
  points: { x: number; y: number; item: T }[],
  width: number,
  height: number,
) {
  const groups: { x: number; y: number; points: typeof points }[] = [];
  for (const point of points) {
    const touching = groups.filter((g) =>
      g.points.some(
        (p) =>
          (Math.abs(p.x - point.x) * width) / 100 < 46 &&
          (Math.abs(p.y - point.y) * height) / 100 < 46,
      ),
    );
    const members = [...touching.flatMap((g) => g.points), point];
    for (const group of touching) groups.splice(groups.indexOf(group), 1);
    groups.push({
      x: members.reduce((n, p) => n + p.x, 0) / members.length,
      y: members.reduce((n, p) => n + p.y, 0) / members.length,
      points: members,
    });
  }
  return groups;
}
