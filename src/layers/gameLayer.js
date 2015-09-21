var GameLayer = cc.Layer.extend({
	FORMATION: {
		CLUMP_CENTER: 0,
		LEFT: 1,
		RIGHT: 2,
		TOP: 3,
		BOTTOM:4
	},
	TILE_MAP_ORDER: 0,
	SOLDIER_ORDER: 50,
	scene: null,
	tileMap: null,
	soldiers: null,
	formation: null,
	formationCenter: null,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;
		
		this.initSoldiers();
		this.initTileMap();
		this.setFormation(this.FORMATION.CLUMP_CENTER);

		var keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: function(key, event) {
				this.requestFormationType(key);
			}.bind(this)
		});
		
		this.isKeyboardEnabled = true;
		cc.eventManager.addListener(keyListener, this);
		
		return true;
	},
	// Initialize soldiers
	initSoldiers: function() {
		this.soldiers = [];
		
		for (var i = 0; i < 24; ++i) {
			var x = Math.floor(i / 3);
			var y = i % 3;
			this.soldiers.push(
				new Soldier(
					this.scene.space,
					x,
					y
				)
			);
			this.addChild(this.soldiers[i], this.SOLDIER_ORDER);
		}
	},
	initTileMap: function() {
		this.tileMap = new cc.TMXTiledMap('res/TileGameResources/TileMap.tmx');
		this.addChild(this.tileMap, this.TILE_MAP_ORDER);
	},
	// Takes key press and calls functions to set corresponding formation
	requestFormationType: function(key) {
		console.log(key);
		switch (key) {
			case cc.KEY.space: // Space
				this.setFormation(this.FORMATION.CLUMP_CENTER);
				break;
			case cc.KEY.a: // A
				this.setFormation(this.FORMATION.LEFT);
				break;
			case cc.KEY.d: // D
				this.setFormation(this.FORMATION.RIGHT);
				break;
			case cc.KEY.w: // W
				this.setFormation(this.FORMATION.TOP);
				break;
			case cc.KEY.s: // F
				this.setFormation(this.FORMATION.BOTTOM);
				break;
			default:
				break;
		}
	},
	// Sets the formation of the soldiers
	setFormation: function(formation) {

		var size = cc.winSize;

		switch (formation) {
			case this.FORMATION.CLUMP_CENTER:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = new cp.v(size.width/2, size.height/2);
				}
				break;
			case this.FORMATION.LEFT:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = new cp.v((32) +  i % 2 * 64, (32) + Math.floor(i / 2) * 64);
				}
				break;
			case this.FORMATION.RIGHT:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = new cp.v((size.width - 96) +  i % 2 * 64, (32) + Math.floor(i / 2) * 64);
				}
				break;
			case this.FORMATION.TOP:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = new cp.v((32) + i % 12 * 96, (size.height - 96) + Math.floor(i/12) * 64);
				}
				break;
			case this.FORMATION.BOTTOM:
			case this.FORMATION.TOP:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = new cp.v((32) + i % 12 * 96, (32) + Math.floor(i/12) * 64);
				}
			default:
				break;
		}
	}
});
