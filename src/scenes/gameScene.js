var GameScene = cc.Scene.extend({
	space: null,
	gameLayer: null,
	dialogLayer: null,
	hudLayer: null,
	onEnter: function() {
		this._super();
		
		this.space = new cp.Space();
		this.space.gravity = cp.v(0, 0);
		
		this.gameLayer = new GameLayer(this);
		this.dialogLayer = new DialogLayer(this);
		//this.hudLayer = new HUDLayer(this);
		
		this.addChild(this.gameLayer);
		this.addChild(this.dialogLayer);
		//this.addChild(this.hudLayer);
		
		this.scheduleUpdate();
	},
	update: function(dt) {
		this.space.step(dt);
	}
});
