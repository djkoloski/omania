var EndGameLayer = cc.Layer.extend({
    BACKGROUND: res.floor_png,
    TITLE: res.floor_png,
    TEXT: res.floor_png,
    ctor: function(scene) {
        this._super();

        var keyListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key, event) {
                this.endGame(key);
            }.bind(this)
        });

        this.isKeyboardEnabled = true;
        cc.eventManager.addListener(keyListener, this);

        var background = new cc.Sprite(EndGameLayer.prototype.BACKGROUND);
        //var background = new cc.LabelTTF("GAME\nOVER", "Courier New", 144);
        //background.setColor(cc.color(255,230,225,1));
        background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        //var title = new cc.Sprite(StartLayer.prototype.TITLE);
        var title = new cc.LabelTTF("YOU WIN", "Courier New", 144);
        title.setPosition(cc.winSize.width/2, 3*cc.winSize.height/4);
        var endText = new cc.LabelTTF("Press R to Replay", "Arial", 38);
        //var gameOverLabel = new cc.Sprite(GameOverLayer.prototype.TEXT);
        endText.setPosition(cc.winSize.width/2, cc.winSize.height/4);

        this.addChild(background, 4);
        this.addChild(title, 5);
        this.addChild(endText, 5);
    },
    endGame: function(key){
        if (key == cc.KEY.r) {
            window.scene = new StartScene();
            cc.director.runScene(window.scene);
            console.log("Replay");
        }
    }
});

var EndScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new EndGameLayer();
        this.addChild(layer);
    }
});
