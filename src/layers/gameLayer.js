var GameLayer = cc.Layer.extend({
	scene: null,
	soldiers: null,
	tileMap: null,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;
		
		this.initSoldiers();
		this.initTileMap();
		
		var mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseMove: function(event) {
				this.requestFormationCenter(event.getLocationX(), event.getLocationY());
			}.bind(this)
		});
		var keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: function(key, event) {
				this.requestFormationType(key);
			}.bind(this)
		});
		
		this.isKeyboardEnabled = true;
		cc.eventManager.addListener(mouseListener, this);
		cc.eventManager.addListener(keyListener, this);
		
		return true;
	},
	initSoldiers: function() {
		this.soldiers = [];
		
		for (var i = 0; i < 20; ++i) {
			var soldier = new Soldier(
				this.scene.space,
				40 + i % 5 * 70,
				40 + Math.floor(i / 5) * 70,
				cc.winSize.width / 2,
				cc.winSize.height / 2
			);
			this.addChild(soldier, 10);
			this.soldiers.push(soldier);
		}
	},
	initTileMap: function() {
		this.tileMap = new cc.TMXTiledMap('res/TileGameResources/TileMap.tmx');
		this.addChild(this.tileMap, 0);
	},
	requestFormationCenter: function(x, y) {
		// PLACEHOLDER CODE
		for (var i = 0; i < this.soldiers.length; ++i)
			this.soldiers[i].target = new cp.v(x, y);
		// update soldiers' targets
	},
	requestFormationType: function(key) {
		// update soldiers' offsets from the center
	}
});
