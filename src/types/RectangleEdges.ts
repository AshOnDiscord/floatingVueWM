import Vec2d, { Vec2dImpl } from "./Position";

export default interface RectangleEdges {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export class RectangleEdgesImpl {
  public top: number;
  public right: number;
  public bottom: number;
  public left: number;

  constructor({ top, right, bottom, left }: RectangleEdges) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }

  public static fromEdges(
    top: number,
    right: number,
    bottom: number,
    left: number,
  ): RectangleEdgesImpl {
    return new RectangleEdgesImpl({ top, right, bottom, left });
  }

  public static fromVec2dAndSize(
    position: Vec2d,
    size: Vec2d,
  ): RectangleEdgesImpl {
    return new RectangleEdgesImpl({
      top: position.y,
      right: position.x + size.x,
      bottom: position.y + size.y,
      left: position.x,
    });
  }

  public getSize(): Vec2dImpl {
    return new Vec2dImpl(this.right - this.left, this.bottom - this.top);
  }

  public getPosition(): Vec2dImpl {
    return new Vec2dImpl(this.left, this.top);
  }

  public getCenter(): Vec2dImpl {
    return new Vec2dImpl(
      (this.left + this.right) / 2,
      (this.top + this.bottom) / 2,
    );
  }
}
