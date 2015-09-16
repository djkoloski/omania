var CollisionTestLayer = cc.Layer.extend({
	soldiers: null,
	space: null,
	formation: 0,
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
		
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan.bind(this)
		});
		var keyListener = cc.EventListener.create({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this.onKeyPressed.bind(this)
		});
		
		this.isKeyboardEnabled = true;
		cc.eventManager.addListener(touchListener, this);
		cc.eventManager.addListener(keyListener, this);
		
		this.textBoxLayer = new TextBoxLayer();
		this.addChild(this.textBoxLayer);
		
		return true;
	},
	onTouchBegan: function(touch, event) {
		for (var i = 0; i < this.soldiers.length; ++i) {
			this.soldiers[i].target = new cp.v(touch.getLocationX(), touch.getLocationY());
		}
	},
	onKeyPressed: function(key, event) {
		for (var i = 0; i < this.soldiers.length; ++i) {
			switch (this.formation) {
				case 0:
					this.soldiers[i].target = new cp.v(40 + i % 5 * 70, 40 + Math.floor(i / 5) * 70);
					break;
				case 1:
					this.soldiers[i].target = new cp.v(40 + Math.floor(i / 5) * 70, 40 + i % 5 * 70);
					break;
				case 2:

					this.soldiers[i].target = new cp.v(cc.winSize.width/2 + i % 2 * 60, 40 + Math.floor(i/2) * 60);
				default:
					break;
			}
		}
		//this.formation = (this.formation + 1) % 2;
		this.formation++;
		if (this.formation > 2) {this.formation = 0;}
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
