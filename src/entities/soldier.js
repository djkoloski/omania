var Soldier = cc.Node.extend({
	MASS: 1,
	SPRINGCONSTANT: 300,
	DAMPING: 0.5,
	RADIUS: 17,
	scene: null,
	target: null,
	sprite: null,
	rigidbody: null,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;
		this.target = vec2();
		
		this.sprite = new cc.Sprite(res.target34x34_png);
		
		this.rigidbody = new Rigidbody();
		this.rigidbody.setMass(this.MASS);
		// TODO set initial position
		
		this.addChild(this.sprite, 0);
		
		this.scheduleUpdate();
		
		return true;
	},
	setTarget: function(target) {
		vec2.copy(this.target, target);
	},
	update: function(dt) {
		this.rigidbody.addSpringForce(this.target, this.SPRINGCONSTANT, this.DAMPING);
		
		this.rigidbody.update(dt);
		this.sprite.setPosition(vec2.point(this.rigidbody.position));
	}
});
