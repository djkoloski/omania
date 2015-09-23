var GameOverLayer = cc.Layer.extend({
    BACKGROUND: res.floor_png,
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

        var background = new cc.Sprite(GameOverLayer.prototype.BACKGROUND);
        background.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        var gameOverLabel = new cc.LabelTTF("Press R to Restart", "Arial", 38);
        //var gameOverLabel = new cc.Sprite(GameOverLayer.prototype.TEXT);
        gameOverLabel.setPosition(cc.winSize.width/2, cc.winSize.height/4);

        this.addChild(background, 4);
        this.addChild(gameOverLabel, 5);
    },
    endGame: function(key){
        if (key == cc.KEY.r) {
            window.scene = new StartScene();
            cc.director.runScene(window.scene);
            console.log("Restart");
        }
    }
});

var GameOverScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameOverLayer();
        this.addChild(layer);
    }
});