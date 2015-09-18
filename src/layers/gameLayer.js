var GameLayer = cc.Layer.extend({
	FORMATION: {
		BLOCK_HORIZ: 0,
		CLUMP_CENTER: 1,
		CLUMP_SPLIT: 2,
		ARROWS: 3
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
	requestFormationCenter: function(x, y) {
		for (var i = 0; i < this.soldiers.length; ++i)
			this.soldiers[i].setFormationCenter(x, y);
	},
	requestFormationType: function(key) {
		console.log(key);
		switch (key) {
			case 65: // A
				this.setFormation(this.FORMATION.BLOCK_HORIZ);
				break;
			case 83: // S
				this.setFormation(this.FORMATION.CLUMP_CENTER);
				break;
			case 68: // D
				this.setFormation(this.FORMATION.CLUMP_SPLIT);
				break;
			case 70: // F
				this.setFormation(this.FORMATION.ARROWS);
				break;
			default:
				break;
		}
	},
	setFormation: function(formation) {
		switch (formation) {
			case this.FORMATION.BLOCK_HORIZ:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = cp.v(
						(2 * soldier.phalanx - 7) * 50,
						(soldier.index - 1) * 50
					);
				}
				break;
			case this.FORMATION.CLUMP_CENTER:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = cp.v(0, 0);
				}
				break;
			case this.FORMATION.CLUMP_SPLIT:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					soldier.target = cp.v((Math.floor(soldier.phalanx / 4) * 2 - 1) * 200, 0);
				}
				break;
			case this.FORMATION.ARROWS:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var soldier = this.soldiers[i];
					var arrowIndex = Math.floor(soldier.phalanx / 2);
					var formIndex = soldier.phalanx % 2 * 3 + soldier.index;
					var x = 0;
					var y = 0;
					switch (formIndex) {
						case 0:
							x = -50;
							y = -25;
							break;
						case 1:
							x = -25;
							y = 0;
							break;
						case 2:
							x = 0;
							y = 25;
							break;
						case 3:
							x = 0;
							y = -25;
							break;
						case 4:
							x = 50;
							y = -25;
							break;
						case 5:
							x = 25;
							y = 0;
							break;
						default:
							break;
					}
					soldier.target = cp.v(x + (arrowIndex * 2 - 3) * 100, y);
				}
				break;
			default:
				break;
		}
	}
});
