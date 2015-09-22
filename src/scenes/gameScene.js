var GameScene = cc.Scene.extend({
	soldierLayer: null,
	dangerLayer: null,
	dialogLayer: null,
	hudLayer: null,
	timer: null,
	onEnter: function() {
		this._super();
		
		this.soldierLayer = new SoldierLayer(this);
		this.dangerLayer = new DangerLayer(this);
		this.dialogLayer = new DialogLayer(this);
		//this.hudLayer = new HUDLayer(this);
		this.timer = 5;
		
		this.addChild(this.soldierLayer);
		this.addChild(this.dangerLayer);
		this.addChild(this.dialogLayer);
		//this.addChild(this.hudLayer);
		
		this.scheduleUpdate();
	},
	update: function(dt) {
		if (this.timer > 0.0) {
			this.timer -= dt;
			if (this.timer <= 0.0) {
				var randDanger = Math.trunc(Math.random() * 6);
				var randTime = Math.trunc((Math.random() * 2) + 1);
				console.log(randDanger,randTime);
				this.dangerLayer.spawn(randDanger, randTime);
				this.timer = 5;
			}
		}
	}
});
