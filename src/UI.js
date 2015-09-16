/**
 * Created by kortrk on 9/12/2015.
 */
/*README:
 * What to know about these additions:
 *  -The only important change in app.js are the lines
 *	  var textLayer= new TextBoxLayer();
 *	  textLayer.init();
 *	  this.addChild(textLayer);
 *  -to use the textbox, run the function
 *	  setDisplayText("whatever the heck you want!");
 *		  or
 *	  UI.display("your text here");
 *   If you set it to "", the text box disappears! Magic!
 *   for Arial at size 20, I shoot for a max of 33 characters on a
 *   line, 5 lines in the textbox. The fitting of text is based on
 *   the filler textbox image I used.
 *
 *   You are welcome to try to format the text yourself using
 *   \n. The code will either graciously accept your suggestions
 *   or graciously ignore you.
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
	LINE_LENGTH: 27,
	LINES_PER_DIALOG: 4,
	state: null,
	dialogs: null,
	currentDialog: null,
	currentIndex: null,
	timer: null,
	label: null,
	background: null,
	ctor: function(){
		this._super();
		
		this.state = this.STATE.CLOSED;
		this.dialogs = [];
		this.currentDialog = 0;
		this.currentIndex = 0;
		this.timer = 0.0;
		this.label = new cc.LabelTTF('', 'Arial', 20);
		this.background = new cc.Sprite(res.Textbox_png);
		
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
				break;
			default:
				throw new Error('Invalid transition state');
				break;
		}
	},
	openDialog: function(string) {
		this.dialogs = [];
		var lines = [];
		var line = '';
		var index = 0;
		var toomany = 0;
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
