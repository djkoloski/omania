var GameScene = cc.Scene.extend({
	DANGER_TIME: 4, // Time per danger spawn
	DANGER_DUR: 2, // Duration until danger occurs/finishes
	LEVEL_TIME: 10, // How long before DANGER_TIME and DANGER_DUR are shorten
	soldierLayer: null,
	dangerLayer: null,
	dialogLayer: null,
	hudLayer: null,
	dangerTimer: null,
	levelTimer: null,
	onEnter: function() {
		this._super();
		
		this.soldierLayer = new SoldierLayer(this);
		this.dangerLayer = new DangerLayer(this);
		this.dialogLayer = new DialogLayer(this);
		//this.hudLayer = new HUDLayer(this);
		
		this.addChild(this.soldierLayer);
		this.addChild(this.dangerLayer);
		this.addChild(this.dialogLayer);
		//this.addChild(this.hudLayer);

		this.dangerTimer = this.DANGER_TIME;
		this.levelTimer = this.LEVEL_TIME;

		this.scheduleUpdate();
	},
	update: function(dt) {
		if (this.dangerTimer > 0.0) {
			this.dangerTimer -= dt;
			if (this.dangerTimer <= 0.0) {
				var randDanger = Math.trunc(Math.random() * 6);
				console.log(randDanger,this.DANGER_DUR);
				this.dangerLayer.spawn(randDanger, this.DANGER_DUR);
				this.dangerTimer = this.DANGER_TIME;
			}
		}
		if (this.levelTimer > 0.0) {
			this.levelTimer -= dt;
			if (this.levelTimer <= 0.0) {
				this.DANGER_DUR -= .3;
				if (this.DANGER_DUR <= .70) {
					this.DANGER_DUR = .70;
				}
				this.DANGER_TIME -= .5;
				if (this.DANGER_TIME <= 2) {
					this.DANGER_TIME = 2;
				}
				this.levelTimer = this.LEVEL_TIME;
			}
		}
	}
});
