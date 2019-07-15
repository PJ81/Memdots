export default class Point {
  constructor(x = 0, y = 0) {
    this.x;
    this.y;
    this.set(x, y);
  }
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Point(this.x, this.y);
  }
}