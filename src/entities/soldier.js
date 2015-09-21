var Soldier = cc.Node.extend({
	space: null,
	target: null,
	sprite: null,
	body: null,
	shape: null,
	radius: 32,
	mass: 1,
	springConstant: 300,
	damping: 0.5,
	ctor: function(space, startX, startY, targetX, targetY) {
		this._super();
		
		this.space = space;
		this.target = cp.v(targetX, targetY);
		
		this.sprite = new cc.PhysicsSprite(res.target50x50_png);
		var contentSize = this.sprite.getContentSize();
		
		this.body = new cp.Body(this.mass, cp.momentForBox(this.mass, contentSize.width, contentSize.height));
		this.shape = new cp.CircleShape(this.body, this.radius, cp.vzero);
		
		this.space.addBody(this.body);
		this.space.addShape(this.shape);
		
		this.sprite.setBody(this.body);
		
		this.body.p = cc.p(startX, startY);
		
		this.addChild(this.sprite, 0);
		
		this.scheduleUpdate();
		
		return true;
	},
	update: function(dt) {
		var toBody = cp.v.sub(this.body.p, this.target);
		var x = cp.v.len(toBody);
		var v = cp.v.normalize(toBody);
		var c = this.damping * 2 * Math.sqrt(this.mass * this.springConstant);
		var impulse = cp.v.add(
			cp.v.add(
				cp.v.mult(
					v,
					-this.springConstant * x * dt
				),
				cp.v.mult(
					cp.v(this.body.vx, this.body.vy),
					-c * dt
				)
			),
			cp.v(
				Math.random() * 10,
				Math.random() * 10
			)
		);
		this.body.applyImpulse(impulse, cp.vzero);
	}
});
