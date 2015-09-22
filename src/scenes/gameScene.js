var GameScene = cc.Scene.extend({
	soldierLayer: null,
	dangerLayer: null,
	dialogLayer: null,
	hudLayer: null,
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
		
		this.scheduleUpdate();
	},
	update: function(dt) {
	}
});
