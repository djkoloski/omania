var Soldier = cc.Node.extend({
	space: null,
	phalanx: null,
	index: null,
	target: null,
	formationCenter: null,
	sprite: null,
	body: null,
	shape: null,
	radius: 32,
	mass: 1,
	springConstant: 300,
	damping: 0.5,
	ctor: function(space, phalanx, index) {
		this._super();
		
		this.space = space;
		this.phalanx = phalanx;
		this.index = index;
		this.target = cp.v((2 * this.phalanx - 7) * 40, this.index * 40 + 50);
		this.formationCenter = cp.v(0, 0);
		
		this.sprite = new cc.PhysicsSprite(res.target50x50_png);
		var contentSize = this.sprite.getContentSize();
		
		this.body = new cp.Body(this.mass, cp.momentForBox(this.mass, contentSize.width, contentSize.height));
		this.shape = new cp.CircleShape(this.body, this.radius, cp.vzero);
		
		this.space.addBody(this.body);
		this.space.addShape(this.shape);
		
		this.sprite.setBody(this.body);
		
		this.body.p = cc.p(this.target.x, this.target.y);
		
		this.addChild(this.sprite, 0);
		
		this.scheduleUpdate();
		
		return true;
	},
	update: function(dt) {
		var toBody = cp.v.sub(this.body.p, cp.v.add(this.target, this.formationCenter));
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
	},
	setFormationCenter: function(centerX, centerY) {
		this.formationCenter = cp.v(centerX, centerY);
	}
});
