var DANGERTYPE = {
	LEFT: 0,
	RIGHT: 1,
	TOP: 2,
	BOTTOM: 3,
	INSIDE: 4,
	OUTSIDE: 5
};

var Danger = cc.Node.extend({
	LEFT_LEFT: 0,
	LEFT_RIGHT: 290,
	RIGHT_LEFT: 1024 + 50 - 341,
	RIGHT_RIGHT: 1024,
	TOP_BOTTOM: 768 - 215,
	TOP_TOP: 768,
	BOTTOM_BOTTOM: 0,
	BOTTOM_TOP: 256 - 30,
	INSIDE_RADIUS: 100,
	OUTSIDE_RADIUS: 375,
	STATE: {
		WARNING: 0,
		HITTING: 1,
	},
	scene: null,
	type: null,
	timer: null,
	sprite: null,
	state: null,
	ctor: function(scene, type, timer) {
		this._super();
		
		this.scene = scene;
		this.type = type;
		this.timer = timer;
		this.state = Danger.prototype.STATE.WARNING;
		
		switch (this.type) {
			case DANGERTYPE.LEFT:
				this.sprite = new cc.Sprite(res.warnings_vert_png);
				this.sprite.setPosition(cc.winSize.width / 6, cc.winSize.height / 2);
				break;
			case DANGERTYPE.RIGHT:
				this.sprite = new cc.Sprite(res.warnings_vert_png);
				this.sprite.setPosition(cc.winSize.width * 5 / 6, cc.winSize.height / 2);
				break;
			case DANGERTYPE.TOP:
				this.sprite = new cc.Sprite(res.warnings_horiz_png);
				this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height * 5 / 6);
				break;
			case DANGERTYPE.BOTTOM:
				this.sprite = new cc.Sprite(res.warnings_horiz_png);
				this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 6);
				break;
			case DANGERTYPE.INSIDE:
				this.sprite = new cc.Sprite(res.warnings_inside_png);
				this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
				break;
			case DANGERTYPE.OUTSIDE:
				this.sprite = new cc.Sprite(res.warnings_outside_png);
				this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
				break;
			default:
				break;
		}
		this.addChild(this.sprite);
		
		this.scheduleUpdate();
	},
	transitionState: function(newState) {
		this.state = newState;
		switch(newState) {
			case Danger.prototype.STATE.HITTING:
				switch(this.type) {
					case DANGERTYPE.LEFT:
						this.sprite = new cc.Sprite(res.water_placeholder_png);
						this.sprite.setPosition(cc.winSize.width / 6, cc.winSize.height / 2);
						break;
					case DANGERTYPE.RIGHT:
						this.sprite = new cc.Sprite(res.water_placeholder_png);
						this.sprite.setPosition(cc.winSize.width * 5 / 6, cc.winSize.height / 2);
						break;
					case DANGERTYPE.TOP:
						this.sprite = new cc.Sprite(res.warnings_horiz_png);
						this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height * 5 / 6);
						break;
					case DANGERTYPE.BOTTOM:
						this.sprite = new cc.Sprite(res.warnings_horiz_png);
						this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 6);
						break;
					case DANGERTYPE.INSIDE:
						this.sprite = new cc.Sprite(res.boulder_png);
						this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
						break;
					case DANGERTYPE.OUTSIDE:
						this.sprite = new cc.Sprite(res.arrows_png);
						this.sprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
						break;
					default:
						break;
				}

		}

		}
	}
	update: function(dt) {
		if (this.timer > 0.0) {
			this.timer -= dt;
			if (this.timer <= 0.0)
				this.execute();
		}
	},
	isFinished: function() {
		return this.timer <= 0.0;
	},
	execute: function() {
		switch (this.type) {
			case DANGERTYPE.LEFT:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var left = soldier.rigidbody.position[0] + Soldier.prototype.RADIUS;
						var right = soldier.rigidbody.position[0] - Soldier.prototype.RADIUS;
						return right > Danger.prototype.LEFT_LEFT && left < Danger.prototype.LEFT_RIGHT;
					}
				);
				break;
			case DANGERTYPE.RIGHT:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var left = soldier.rigidbody.position[0] + Soldier.prototype.RADIUS;
						var right = soldier.rigidbody.position[0] - Soldier.prototype.RADIUS;
						return right > Danger.prototype.RIGHT_LEFT && left < Danger.prototype.RIGHT_RIGHT;
					}
				);
				break;
			case DANGERTYPE.TOP:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var bottom = soldier.rigidbody.position[1] - Soldier.prototype.RADIUS;
						var top = soldier.rigidbody.position[1] + Soldier.prototype.RADIUS;
						return top > Danger.prototype.TOP_BOTTOM && bottom < Danger.prototype.TOP_TOP;
					}
				);
				break;
			case DANGERTYPE.BOTTOM:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var bottom = soldier.rigidbody.position[1] - Soldier.prototype.RADIUS;
						var top = soldier.rigidbody.position[1] + Soldier.prototype.RADIUS;
						return top > Danger.prototype.BOTTOM_BOTTOM && bottom < Danger.prototype.BOTTOM_TOP;
					}
				);
				break;
			case DANGERTYPE.INSIDE:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var dist = vec2.dist(soldier.rigidbody.position, vec2(cc.winSize.width / 2, cc.winSize.height / 2));
						return dist < Danger.prototype.INSIDE_RADIUS + Soldier.prototype.RADIUS;
					}
				);
				break;
			case DANGERTYPE.OUTSIDE:
				this.scene.soldierLayer.removeByLambda(
					function(soldier) {
						var dist = vec2.dist(soldier.rigidbody.position, vec2(cc.winSize.width / 2, cc.winSize.height / 2));
						return dist > Danger.prototype.OUTSIDE_RADIUS - Soldier.prototype.RADIUS;
					}
				);
				break;
			default:
				break;
		}
	}
});

var DangerLayer = cc.Layer.extend({
	DANGER_ORDER: 10,
	scene: null,
	dangers: null,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;
		this.dangers = [];
		
		this.scheduleUpdate();
	},
	update: function(dt) {
		for (var i = 0; i < this.dangers.length; ++i) {
			if (this.dangers[i].isFinished()) {
				this.removeChild(this.dangers[i]);
				this.dangers.splice(i, 1);
				--i;
			}
		}
	},
	spawn: function(type, timer) {
		var danger = new Danger(this.scene, type, timer);
		this.dangers.push(danger);
		this.addChild(danger);
	}
});
