var ProgressLayer = cc.Layer.extend({
	BAR_LENGTH: 585,
	PROGRESS_POS_ON_SCREEN_Y: 700,
	scene: null,
	state: null,
	//currentPointerPos: null,
	tanBarImage: null,
	greenBarImage: null,
	pointerImage: null,
	dialogueSpriteOnLeft: true,
	ctor: function(scene) {
		this._super();
		
		this.scene = scene;

		this.tanBarImage = new cc.Sprite(res.progressbar_left_png);
		this.greenBarImage = new cc.Sprite(res.progressbar_done_png);
		this.pointerImage = new cc.Sprite(res.progressbar_thumb_png);

		this.tanBarImage.setPosition(cc.winSize.width / 2,this.PROGRESS_POS_ON_SCREEN_Y);
		this.pointerImage.setPosition(this.tanBarImage.x-this.tanBarImage.width / 2 + 115,
									this.tanBarImage.y+17);

		this.addChild(this.tanBarImage);
		this.addChild(this.pointerImage);
		
		this.scheduleUpdate();
	},
	movePointer: function(number) {
		//number is between 0.0 and 1.0
		
		if (number != null) {
			offset=this.BAR_LENGTH*number;
			this.pointerImage.setPosition(this.tanBarImage.x - this.tanBarImage.width / 2
				+110 + offset, this.tanBarImage.y + 17);
		}
	},
	update: function(dt) {
	}
});
