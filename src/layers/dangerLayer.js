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
	LEFT_HITTING_LEFT: -342 / 2,
	LEFT_HITTING_RIGHT: 342 / 2,
	RIGHT_HITTING_LEFT: -342 / 2,
	RIGHT_HITTING_RIGHT: 342 / 2,
	scene: null,
	type: null,
	timer: null,
	warningSprite: null,
	hittingSprite: null,
	curve: null,
	state: null,
	ctor: function(scene, type, timer) {
		this._super();
		
		this.scene = scene;
		this.type = type;
		this.timer = timer;
		
		switch (this.type) {
			case DANGERTYPE.LEFT:
				this.warningSprite = new cc.Sprite(res.warnings_vert_png);
				this.warningSprite.setPosition(cc.winSize.width / 6, cc.winSize.height / 2);
				this.hittingSprite = new cc.Sprite(res.water_left_png);
				this.hittingSprite.setPosition(-342 / 2, cc.winSize.height / 2);
				this.curve = new BounceCurve(0.5, new HalfSigmoid(-0.5));
				break;
			case DANGERTYPE.RIGHT:
				this.warningSprite = new cc.Sprite(res.warnings_vert_png);
				this.warningSprite.setPosition(cc.winSize.width * 5 / 6, cc.winSize.height / 2);
				this.hittingSprite = new cc.Sprite(res.water_right_png);
				this.hittingSprite.setPosition(cc.winSize.width + 342 / 2, cc.winSize.height / 2);
				this.curve = new BounceCurve(0.5, new HalfSigmoid(-0.5));
				break;
			case DANGERTYPE.TOP:
				this.warningSprite = new cc.Sprite(res.warnings_horiz_png);
				this.warningSprite.setPosition(cc.winSize.width / 2, cc.winSize.height * 5 / 6);
				break;
			case DANGERTYPE.BOTTOM:
				this.warningSprite = new cc.Sprite(res.warnings_horiz_png);
				this.warningSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 6);
				break;
			case DANGERTYPE.INSIDE:
				this.warningSprite = new cc.Sprite(res.warnings_inside_png);
				this.warningSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
				break;
			case DANGERTYPE.OUTSIDE:
				this.warningSprite = new cc.Sprite(res.warnings_outside_png);
				this.warningSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
				break;
			default:
				break;
		}
		this.addChild(this.warningSprite);
		// TODO: take this out when everything has a hitting sprite
		if (this.hittingSprite)
			this.addChild(this.hittingSprite);
		
		this.transitionState(Danger.prototype.STATE.WARNING);
		
		this.scheduleUpdate();
	},
	transitionState: function(newState) {
		this.state = newState;
		switch (newState) {
			case Danger.prototype.STATE.WARNING:
				this.warningSprite.setVisible(true);
				// TODO: take this out when everything has a hitting sprite
				if (this.hittingSprite)
					this.hittingSprite.setVisible(false);
				break;
			case Danger.prototype.STATE.HITTING:
				this.warningSprite.setVisible(false);
				// TODO: take this out when everything has a hitting sprite
				if (this.hittingSprite)
					this.hittingSprite.setVisible(true);
				break;
			default:
				break;
		}
	},
	update: function(dt) {
		switch (this.state) {
			case Danger.prototype.STATE.WARNING:
				this.timer -= dt;
				if (this.timer <= 0.0) {
					this.execute();
					this.transitionState(Danger.prototype.STATE.HITTING);
				}
				break;
			case Danger.prototype.STATE.HITTING:
				this.curve.update(dt);
				switch (this.type) {
					case DANGERTYPE.LEFT:
						this.hittingSprite.setPosition(
							Danger.prototype.LEFT_HITTING_LEFT + this.curve.getValue() * (Danger.prototype.LEFT_HITTING_RIGHT - Danger.prototype.LEFT_HITTING_LEFT),
							this.hittingSprite.getPosition().y
						);
						break;
					case DANGERTYPE.RIGHT:
						this.hittingSprite.setPosition(
							cc.winSize.width + Danger.prototype.RIGHT_HITTING_RIGHT + this.curve.getValue() * (Danger.prototype.RIGHT_HITTING_LEFT - Danger.prototype.RIGHT_HITTING_RIGHT),
							this.hittingSprite.getPosition().y
						);
						break;
					default:
						break;
				}
				break;
			default:
				break;
		}
	},
	isFinished: function() {
		return this.state == Danger.prototype.STATE.HITTING && this.curve.isFinished();
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
