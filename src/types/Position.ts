export default interface Vec2d {
  x: number;
  y: number;
}

export class Vec2dImpl implements Vec2d {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  public clone(): Vec2dImpl {
    return new Vec2dImpl(this.x, this.y);
  }

  public add(pos: Vec2dImpl): Vec2dImpl {
    return new Vec2dImpl(this.x + pos.x, this.y + pos.y);
  }

  public sub(pos: Vec2dImpl): Vec2dImpl {
    return new Vec2dImpl(this.x - pos.x, this.y - pos.y);
  }

  public multi(factor: number): Vec2dImpl {
    return new Vec2dImpl(this.x * factor, this.y * factor);
  }

  public div(factor: number): Vec2dImpl {
    return new Vec2dImpl(this.x / factor, this.y / factor);
  }

  public eq(pos: Vec2dImpl): boolean {
    return this.x === pos.x && this.y === pos.y;
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  public toArray(): [number, number] {
    return [this.x, this.y];
  }

  public static fromArray(arr: [number, number]): Vec2dImpl {
    return new Vec2dImpl(arr[0], arr[1]);
  }

  public static fromObject(obj: Vec2d): Vec2dImpl {
    return new Vec2dImpl(obj.x, obj.y);
  }

  public static fromString(str: string): Vec2dImpl {
    const [x, y] = str
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map((val) => parseInt(val, 10));
    return new Vec2dImpl(x, y);
  }
}
