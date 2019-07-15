import Point from "./point.js"

export default class Circle {
  constructor(start, end, vel, c) {
    this.pos = new Point(start.x, start.y);
    this.start = new Point(start.x, start.y);
    this.target = new Point(end.x, end.y);
    this.vel = new Point(vel.x, vel.y);
    this.moving = true;
    this.show = false;
    this.color = c;
  }

  update(dt) {
    if (this.moving) {
      this.pos.x += dt * this.vel.x;
      this.pos.y += dt * this.vel.y;
      let x = this.target.x - this.pos.x,
        y = this.target.y - this.pos.y;
      x *= x;
      y *= y;
      if (x + y < 2) {
        this.pos = this.target.copy();
        this.target = this.start.copy();
        this.moving = false;
        this.vel.set(-this.vel.x, -this.vel.y);
      }
    }
    return this.moving;
  }

  draw(ctx, fill) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 26, 0, 2 * Math.PI);
    if (fill) ctx.fill();
    if (this.show) {
      ctx.fillStyle = "white";
      ctx.fill();
    }
    ctx.stroke();
  }
}