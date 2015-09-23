var GameScene = cc.Scene.extend({
	DANGER_TIME: 4, // Time per danger spawn
	DANGER_DUR: 2, // Duration until danger occurs/finishes
	TIME_INRC: .5, // Amount to subtract from DANGER_TIME at each level
	DUR_INRC: .3, // Amount to subtract from DANGER_DUR at each level
	TIME_CAP: 1.5, // Cap for the shortest time for DANGER_TIME
	DUR_CAP:.7, // Cap for the shortest time for DANGER_DUR
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
				// TODO: make this * 6 again when all the dangers are fully implemented
				var randDanger = Math.floor(Math.random() * 2);
				console.log(randDanger,this.DANGER_DUR);
				this.dangerLayer.spawn(randDanger, this.DANGER_DUR);
				this.dangerTimer = this.DANGER_TIME;
			}
		}
		if (this.levelTimer > 0.0) {
			this.levelTimer -= dt;
			if (this.levelTimer <= 0.0) {
				this.DANGER_DUR -= this.DUR_INRC;
				if (this.DANGER_DUR <= this.DUR_CAP) {
					this.DANGER_DUR = this.DUR_CAP;
				}
				this.DANGER_TIME -= this.TIME_INRC;
				if (this.DANGER_TIME <= this.TIME_CAP) {
					this.DANGER_TIME = this.TIME_CAP;
				}
				this.levelTimer = this.LEVEL_TIME;
			}
		}
	}
});
