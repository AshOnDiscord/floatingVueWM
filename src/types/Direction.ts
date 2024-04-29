enum Direction {
  northWest = "nw",
  north = "n",
  northEast = "ne",
  west = "w",
  empty = "",
  east = "e",
  southWest = "sw",
  south = "s",
  southEast = "se",
}

export default Direction;

export const DirectionGroups = {
  north: [Direction.northWest, Direction.north, Direction.northEast],
  east: [Direction.northEast, Direction.east, Direction.southEast],
  south: [Direction.southEast, Direction.south, Direction.southWest],
  west: [Direction.southWest, Direction.west, Direction.northWest],
};
