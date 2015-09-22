var FORMATION = {
	CLUMP_CENTER: 0,
	LEFT: 1,
	RIGHT: 2,
	TOP: 3,
	BOTTOM: 4
};

var SoldierLayer = cc.Layer.extend({
	NUM_SOLDIERS: 64,
	SOLDIER_ORDER: 50,
	EDGE_OFFSET: 32,
	SOLDIER_SPACING: 60,
	scene: null,
	soldiers: null,
	formation: null,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;
		
		this.initSoldiers();
		this.setFormation(FORMATION.CLUMP_CENTER);
		
		var keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: function(key, event) {
				this.requestFormationType(key);
			}.bind(this)
		});
		
		this.isKeyboardEnabled = true;
		cc.eventManager.addListener(keyListener, this);
	},
	// Initialize soldiers
	initSoldiers: function() {
		this.soldiers = [];
		
		for (var i = 0; i < SoldierLayer.prototype.NUM_SOLDIERS; ++i) {
			this.soldiers.push(new Soldier(this.scene));
			this.addChild(this.soldiers[i], SoldierLayer.prototype.SOLDIER_ORDER);
		}
	},
	// Takes key press and calls functions to set corresponding formation
	requestFormationType: function(key) {
		switch (key) {
			case cc.KEY.space: // Space
				this.setFormation(FORMATION.CLUMP_CENTER);
				break;
			case cc.KEY.a: // A
				this.setFormation(FORMATION.LEFT);
				break;
			case cc.KEY.d: // D
				this.setFormation(FORMATION.RIGHT);
				break;
			case cc.KEY.w: // W
				this.setFormation(FORMATION.TOP);
				break;
			case cc.KEY.s: // F
				this.setFormation(FORMATION.BOTTOM);
				break;
			default:
				break;
		}
	},
	// Sets the formation of the soldiers
	setFormation: function(formation) {
		// Shuffle the soldiers
		for (var i = 0; i < this.soldiers.length - 2; ++i) {
			var j = Math.floor(Math.random() * (this.soldiers.length - i)) + i;
			var temp = this.soldiers[i];
			this.soldiers[i] = this.soldiers[j];
			this.soldiers[j] = temp;
		}
		
		var size = cc.winSize;

		switch (formation) {
			case FORMATION.CLUMP_CENTER:
				for (var i = 0; i < this.soldiers.length; ++i) {
					var layer = Math.ceil(Math.sqrt(9 + 12 * i) / 6 - 0.5);
					if (layer == 0)
						this.soldiers[i].setTarget(vec2(size.width / 2, size.height / 2));
					else {
						var prevLayer = layer - 1;
						var index = i - (3 * Math.pow(prevLayer, 2) + 3 * prevLayer + 1);
						var angle = index % 3 * 2 + Math.floor(index % 6 / 3);
						var offset = Math.floor(index / 6);
						this.soldiers[i].setTarget(
							vec2(
								size.width / 2 + (Math.cos(Math.PI / 3 * angle) * layer + Math.cos(Math.PI / 3 * (angle + 2)) * offset) * SoldierLayer.prototype.SOLDIER_SPACING,
								size.height / 2 + (Math.sin(Math.PI / 3 * angle) * layer + Math.sin(Math.PI / 3 * (angle + 2)) * offset) * SoldierLayer.prototype.SOLDIER_SPACING
							)
						);
					}
				}
				break;
			case FORMATION.LEFT:
				var height = Math.floor(cc.winSize.height / (SoldierLayer.prototype.SOLDIER_SPACING + 1));
				var width = Math.ceil(this.soldiers.length / height);
				for (var i = 0; i < this.soldiers.length; ++i) {
					var x = Math.floor(i / height);
					var y = i % height;
					var inLine = Math.min(this.soldiers.length - x * height, height);
					this.soldiers[i].setTarget(
						vec2(
							SoldierLayer.prototype.EDGE_OFFSET + x * SoldierLayer.prototype.SOLDIER_SPACING,
							cc.winSize.height / (inLine + 1) * (y + 1)
						)
					);
				}
				break;
			case FORMATION.RIGHT:
				var height = Math.floor(cc.winSize.height / (SoldierLayer.prototype.SOLDIER_SPACING + 1));
				var width = Math.ceil(this.soldiers.length / height);
				for (var i = 0; i < this.soldiers.length; ++i) {
					var x = Math.floor(i / height);
					var y = i % height;
					var inLine = Math.min(this.soldiers.length - x * height, height);
					this.soldiers[i].setTarget(
						vec2(
							cc.winSize.width - SoldierLayer.prototype.EDGE_OFFSET - x * SoldierLayer.prototype.SOLDIER_SPACING,
							cc.winSize.height / (inLine + 1) * (y + 1)
						)
					);
				}
				break;
			case FORMATION.BOTTOM:
				var width = Math.floor(cc.winSize.width / (SoldierLayer.prototype.SOLDIER_SPACING + 1));
				var height = Math.ceil(this.soldiers.length / height);
				for (var i = 0; i < this.soldiers.length; ++i) {
					var y = Math.floor(i / width);
					var x = i % width;
					var inLine = Math.min(this.soldiers.length - y * width, width);
					this.soldiers[i].setTarget(
						vec2(
							cc.winSize.width / (inLine + 1) * (x + 1),
							SoldierLayer.prototype.EDGE_OFFSET + y * SoldierLayer.prototype.SOLDIER_SPACING
						)
					);
				}
				break;
			case FORMATION.TOP:
				var width = Math.floor(cc.winSize.width / (SoldierLayer.prototype.SOLDIER_SPACING + 1));
				var height = Math.ceil(this.soldiers.length / height);
				for (var i = 0; i < this.soldiers.length; ++i) {
					var y = Math.floor(i / width);
					var x = i % width;
					var inLine = Math.min(this.soldiers.length - y * width, width);
					this.soldiers[i].setTarget(
						vec2(
							cc.winSize.width / (inLine + 1) * (x + 1),
							cc.winSize.height - SoldierLayer.prototype.EDGE_OFFSET - y * SoldierLayer.prototype.SOLDIER_SPACING
						)
					);
				}
				break;
			default:
				break;
		}
		
		this.formation = formation;
	},
	removeByLambda: function(lambda) {
		var newSoldiers = [];
		for (var i = 0; i < this.soldiers.length; ++i) {
			if (lambda(this.soldiers[i]))
				this.removeChild(this.soldiers[i]);
			else
				newSoldiers.push(this.soldiers[i]);
		}
		this.soldiers = newSoldiers;
	}
});
