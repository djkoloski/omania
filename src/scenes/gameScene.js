var GameScene = cc.Scene.extend({
	gameLayer: null,
	dialogLayer: null,
	hudLayer: null,
	onEnter: function() {
		this._super();
		
		this.gameLayer = new GameLayer(this);
		this.dialogLayer = new DialogLayer(this);
		//this.hudLayer = new HUDLayer(this);
		
		this.addChild(this.gameLayer);
		this.addChild(this.dialogLayer);
		//this.addChild(this.hudLayer);
		
		this.scheduleUpdate();
	},
	update: function(dt) {
	}
});
