var GameOverLayer = cc.Layer.extend({
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

        var goodbyeLabel = new cc.LabelTTF("Press R to Restart", "Arial", 38);
        goodbyeLabel.x = cc.winSize.width/2;
        goodbyeLabel.y = cc.winSize.height/2;

        this.addChild(goodbyeLabel, 5);
    },
    endGame: function(key){
        if (key == cc.KEY.r) {
            //cc.director.pushScene(GameOverScene);
            cc.director.runScene(new StartScene);
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