import Vec2d, { Vec2dImpl } from "./Position";

interface Sides<Type> {
  top: Type;
  right: Type;
  bottom: Type;
  left: Type;
}

interface Bounds {
  min?: number;
  max?: number;
}

interface BoundedValue {
  value: number;
  bounds: Bounds;
}
type BV = BoundedValue; // Alias for internal usage in this file

const BoundedValueUtils = {
  bind: (boundedValue: BV): number =>
    Math.min(
      Math.max(boundedValue.value, boundedValue.bounds.min ?? -Infinity),
      boundedValue.bounds.max ?? Infinity,
    ),
};
const BVUtils = BoundedValueUtils; // Alias for internal usage in this file

type RectangleSides = Sides<number>;
type RectSides = RectangleSides; // Alias for internal usage in this file

const RectangleSidesUtils = {
  /* From */
  fromCoordinates: (
    top: number,
    right: number,
    bottom: number,
    left: number,
  ): RectSides => ({
    top,
    right,
    bottom,
    left,
  }),

  fromPositionAndSize: (position: Vec2d, dimensions: Vec2d): RectSides => ({
    top: position.y,
    right: position.x + dimensions.x,
    bottom: position.y + dimensions.y,
    left: position.x,
  }),

  /* To */
  toPosition: (sides: RectSides): Vec2d => new Vec2dImpl(sides.left, sides.top),

  toSize: (sides: RectSides): Vec2d =>
    new Vec2dImpl(sides.right - sides.left, sides.bottom - sides.top),

  toPositionAndSize: (sides: RectSides): { position: Vec2d; size: Vec2d } => ({
    position: RSUtils.toPosition(sides),
    size: RSUtils.toSize(sides),
  }),

  /* Modify */
  set: (
    sides: RectSides,
    { top, right, bottom, left }: Partial<RectSides>,
  ): RectSides => ({
    top: top ?? sides.top,
    right: right ?? sides.right,
    bottom: bottom ?? sides.bottom,
    left: left ?? sides.left,
  }),

  setTop: (sides: RectSides, top: number): RectSides =>
    RSUtils.set(sides, { top }),

  setRight: (sides: RectSides, right: number): RectSides =>
    RSUtils.set(sides, { right }),

  setBottom: (sides: RectSides, bottom: number): RectSides =>
    RSUtils.set(sides, { bottom }),

  setLeft: (sides: RectSides, left: number): RectSides =>
    RSUtils.set(sides, { left }),

  /* Bounded Modify */
  setBounded: (
    sides: RectSides,
    { top, right, bottom, left }: Partial<Sides<BV>>,
  ): RectSides => ({
    top: top ? BVUtils.bind(top) : sides.top,
    right: right ? BVUtils.bind(right) : sides.right,
    bottom: bottom ? BVUtils.bind(bottom) : sides.bottom,
    left: left ? BVUtils.bind(left) : sides.left,
  }),

  setTopBounded: (sides: RectSides, top: BV): RectSides =>
    RSUtils.setBounded(sides, { top }),

  setRightBounded: (sides: RectSides, right: BV): RectSides =>
    RSUtils.setBounded(sides, { right }),

  setBottomBounded: (sides: RectSides, bottom: BV): RectSides =>
    RSUtils.setBounded(sides, { bottom }),

  setLeftBounded: (sides: RectSides, left: BV): RectSides =>
    RSUtils.setBounded(sides, { left }),

  /* Transform */
  translate: (sides: RectSides, translation: Vec2d): RectSides => ({
    top: sides.top + translation.y,
    right: sides.right + translation.x,
    bottom: sides.bottom + translation.y,
    left: sides.left + translation.x,
  }),

  scale: (sides: RectSides, scale: Vec2d): RectSides => ({
    top: sides.top * scale.y,
    right: sides.right * scale.x,
    bottom: sides.bottom * scale.y,
    left: sides.left * scale.x,
  }),
};

const RSUtils = RectangleSidesUtils; // Alias for internal usage in this file

export default Sides;
export type { Bounds, BoundedValue, RectangleSides };
export { RectangleSidesUtils, BoundedValueUtils };
