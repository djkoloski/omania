var CollisionTestLayer = cc.Layer.extend({
	soldiers: null,
	space: null,
	formation: 0,
	mouseLocX: 0,
	mouseLocY: 0,
	formX: 40 + i % 5 * 70,
	formY: 40 + Math.floor(i / 5) * 70,
	textBoxLayer: null,
	ctor: function(space) {
		this._super();
		
		this.soldiers = [];
		this.space = space;
		
		var size = cc.winSize;
		
		for (var i = 0; i < 20; ++i) {
			var soldier = new Soldier(
				this.space,
				40 + i % 5 * 70,
				40 + Math.floor(i / 5) * 70,
				size.width / 2,
				size.height / 2
			);
			this.addChild(soldier);
			this.soldiers.push(soldier);
		}
		
		var layerNameLabel = new cc.LabelTTF('Collision test', 'Arial', 16);
		layerNameLabel.setAnchorPoint(0, 0);
		var labelSize = layerNameLabel.getContentSize();
		layerNameLabel.x = 0;
		layerNameLabel.y = size.height - labelSize.height;
		
		this.addChild(layerNameLabel, 5);

		var keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this.onKeyPressed.bind(this)
		});
		var mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseMove: this.onMouseMove.bind(this)
		});
		
		this.isKeyboardEnabled = true;
		cc.eventManager.addListener(keyListener, this);
		cc.eventManager.addListener(mouseListener, this);
		
		this.textBoxLayer = new TextBoxLayer();
		this.addChild(this.textBoxLayer);
		
		return true;
	},

	onKeyPressed: function(key, event) {

		for (var i = 0; i < this.soldiers.length; ++i) {
			switch (key) {
				case cc.KEY.q:
					this.soldiers[i].target = new cp.v(this.mouseLocX - 150 + i % 5 * 65, this.mouseLocY + Math.floor(i / 5) * 65);
					this.formation = 0;
					break;
				case cc.KEY.w:
					if (i < this.soldiers.length/2) {
						this.soldiers[i].target = new cp.v((this.mouseLocX - 325) + i % 3 * 65, this.mouseLocY + Math.floor(i/3) * 65);
					}
					else {
						this.soldiers[i].target = new cp.v((this.mouseLocX + 195) + (i-this.soldiers.length/2)%3 * 65, this.mouseLocY + Math.floor((i-this.soldiers.length/2)/3) * 65);
					}
					this.formation = 1;
					break;
				case cc.KEY.e:
					this.soldiers[i].target = new cp.v(this.mouseLocX - 30 + i % 2 * 65, this.mouseLocY + Math.floor(i/2) * 65);
					this.formation = 2;
					break;
				default:
					break;
			}
		}
	},
	onMouseMove: function(mouse, event) {

		this.mouseLocX = mouse.getLocationX();
		this.mouseLocY = mouse.getLocationY();

		for (var i = 0; i < this.soldiers.length; ++i) {
			switch (this.formation) {
				case 0:
					this.soldiers[i].target = new cp.v(this.mouseLocX - 150 + i % 5 * 65, this.mouseLocY + Math.floor(i / 5) * 65);
					break;
				case 1:
					if (i < this.soldiers.length/2) {
						this.soldiers[i].target = new cp.v((this.mouseLocX - 325) + i % 3 * 65, this.mouseLocY + Math.floor(i/3) * 65);
					}
					else {
						this.soldiers[i].target = new cp.v((this.mouseLocX + 195) + (i-this.soldiers.length/2)%3 * 65, this.mouseLocY + Math.floor((i-this.soldiers.length/2)/3) * 65);
					}
					break;
				case 2:
					this.soldiers[i].target = new cp.v(this.mouseLocX - 30 + i % 2 * 65, this.mouseLocY + Math.floor(i/2) * 65);
				default:
					break;
			}
		}
	}
});

var CollisionTestScene = cc.Scene.extend({
	space: null,
	layer: null,
	onEnter: function() {
		this._super();
		
		this.initPhysics();
		
		this.layer = new CollisionTestLayer(this.space);
		
		this.addChild(this.layer);
		
		this.scheduleUpdate();
	},
	initPhysics: function() {
		this.space = new cp.Space();
		this.space.gravity = cp.v(0, 0);
	},
	update: function(dt) {
		this.space.step(dt);
	}
});
