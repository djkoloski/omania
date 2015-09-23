/**
 * Created by kortrk on 9/12/2015.
 */
/*README:
 * What to know about these additions:
 *  -to use the textbox, run the function
 *	  openDialog("whatever the heck you want");
 *   It will run format and run your text AND disappear! Magic!
 *
 *   You can set a breakpoint after which the next text will appear
 *   in a clear window by typing '\n'
 *
 *   The openDialog function takes three variables-
 *   openDialog("text you want",
 *   callback_function, //called at completion of all text scrolling
 *   res.anySpeakerSprite_png );//or _jpg, of course.
 *   >>Make your speakerSprite 130x130, please.<<
 *
 *   Speaker sprite can appear on either side. Change which side it
 *   goes on by changing this.dialogueSpriteOnLeft (so false puts it on right)
 *
 */
var TextBoxLayer = cc.Layer.extend({
	STATE: {
		OPENING: 0,
		OPEN: 1,
		PAUSED: 2,
		CLOSING: 3,
		CLOSED: 4
	},
	OPENING_TIME: 0.5,
	NEXT_CHAR_TIME: 0.05,
	PAUSE_TIME: 1.0,
	CLOSING_TIME: 0.5,
	CLOSED_OFFSET_Y: -100,
	OPEN_OFFSET_Y: 100,
	LINE_LENGTH: 70,
	LINES_PER_DIALOG: 4,
	SPEAKER_SPRITE_OFFSET: 400,
	state: null,
	dialogs: null,
	currentDialog: null,
	currentIndex: null,
	timer: null,
	label: null,
	background: null,
	dialogueSpriteOnLeft: true,
	ctor: function(){
		this._super();
		
		this.state = this.STATE.CLOSED;
		this.dialogs = [];
		this.currentDialog = 0;
		this.currentIndex = 0;
		this.timer = 0.0;
		this.label = new cc.LabelTTF('', 'Arial', 20);
		this.label.setColor(0,0,0,0);
		this.background = new cc.Sprite(res.Textbox_png);
		//variables that will receive their values when
		//openDialog is called
		this.callBack = null;
		this.speakerSprite = null;
		
		this.addChild(this.label, 5);
		this.addChild(this.background);
		
		this.scheduleUpdate();
	},
	transitionState: function(newState) {
		this.state = newState;
		switch (newState) {
			case this.STATE.OPENING:
				this.setLabelText('');
				this.timer = this.OPENING_TIME;
				this.setYOffset(this.CLOSED_OFFSET_Y);
				break;
			case this.STATE.OPEN:
				this.setLabelText('');
				this.timer = 0.0;
				this.currentIndex = 0;
				this.setYOffset(this.OPEN_OFFSET_Y);
				break;
			case this.STATE.PAUSED:
				this.timer = this.PAUSE_TIME;
				break;
			case this.STATE.CLOSING:
				this.timer = this.CLOSING_TIME;
				break;
			case this.STATE.CLOSED:
				this.setLabelText('');
				this.timer = 0.0;
				this.setYOffset(this.CLOSED_OFFSET_Y);
				if (this.callBack != null)
					this.callBack();
				break;
			default:
				throw new Error('Invalid transition state');
				break;
		}
	},
	openDialog: function(string, callbackFunc, picture) {
		//make the picture 300x300 for best quality
		this.dialogs = [];
		var lines = [];
		var line = '';
		var index = 0;
		var toomany = 0;
		this.callBack=callbackFunc;
		if (picture != null) {
			this.speakerSprite = new cc.Sprite(picture);
			this.addChild(this.speakerSprite);
		}
		while (index < string.length) {
			var nextSpace = string.indexOf(' ', index);
			var nextNewline = string.indexOf('\n', index);
			
			var chop = 0;
			var endDialog = false;
			if (nextSpace != -1 && (nextSpace < nextNewline || nextNewline == -1))
				chop = nextSpace;
			else {
				chop = nextNewline;
				endDialog = true;
			}
			if (chop == -1) {
				chop = string.length;
				endDialog = true;
			} else
				chop += 1;
			
			var delta = chop - index;
			
			if (line.length + delta > this.LINE_LENGTH) {
				lines.push(line);
				line = '';
			}
			line = (line + string.substring(index, chop)).replace('\n', '');
			if (endDialog) {
				lines.push(line);
				line = '';
				this.dialogs.push(lines.join('\n'));
				lines = [];
			}
			if (lines.length >= this.LINES_PER_DIALOG)
				this.dialogs.push(lines.splice(0, this.LINES_PER_DIALOG).join('\n'));
			index = chop;
			
			++toomany;
			if (toomany > 1000)
				break;
		}
		
		this.currentDialog = 0;
		this.currentIndex = 0;
		this.transitionState(this.STATE.OPENING);
	},

	closeDialog: function() {
		this.transitionState(this.STATE.CLOSING);
	},
	getCurrentDialog: function() {
		return this.dialogs[this.currentDialog];
	},
	setLabelText: function(string) {
		this.label.setString(string);
	},
	setYOffset: function(y) {
		var position = cc.p(cc.winSize.width / 2, y);
		this.label.setPosition(position);
		this.background.setPosition(position);
		var speakerOffset;
		if (this.dialogueSpriteOnLeft)
			speakerOffset = -this.SPEAKER_SPRITE_OFFSET;
		else
			speakerOffset=this.SPEAKER_SPRITE_OFFSET;
		this.speakerSprite.setPosition(cc.winSize.width/2+speakerOffset, y);
	},
	update: function(dt) {
		this.timer -= dt;
		if (this.timer < 0) {
			switch (this.state) {
				case this.STATE.OPENING:
					this.transitionState(this.STATE.OPEN);
					break;
				case this.STATE.OPEN:
					if (this.currentIndex >= this.getCurrentDialog().length)
						this.transitionState(this.STATE.PAUSED);
					else {
						++this.currentIndex;
						this.setLabelText(this.getCurrentDialog().substr(0, this.currentIndex));
						this.timer = this.NEXT_CHAR_TIME;
					}
					break;
				case this.STATE.PAUSED:
					if (this.currentDialog >= this.dialogs.length)
						this.transitionState(this.STATE.CLOSING);
					else {
						if (this.currentDialog < this.dialogs.length - 1) {
							++this.currentDialog;
							this.currentIndex = 0;
							this.transitionState(this.STATE.OPEN);
						} else
							this.transitionState(this.STATE.CLOSING);
					}
					break;
				case this.STATE.CLOSING:
					this.transitionState(this.STATE.CLOSED);
					break;
				case this.STATE.CLOSED:
					break;
				default:
					throw new Error('Invalid state');
			}
		} else {
			var t = this.timer / this.OPENING_TIME;
			switch (this.state) {
				case this.STATE.OPENING:
					this.setYOffset(t * this.CLOSED_OFFSET_Y + (1.0 - t) * this.OPEN_OFFSET_Y);
					break;
				case this.STATE.CLOSING:
					this.setYOffset(t * this.OPEN_OFFSET_Y + (1.0 - t) * this.CLOSED_OFFSET_Y);
					break;
				default:
					break;
			}
		}
	}
});

/*References:
	textBoxLayer:
		http://cocos2d-x.org/docs/tutorial/framework/html5/parkour-game-with-javascript-v3.0/chapter3/en

Next steps:
	Make the string disappear after a certain time
		SET TIMEOUT
		CANCEL TIMEOUT
	More importantly, make text animatedly appear
*/
