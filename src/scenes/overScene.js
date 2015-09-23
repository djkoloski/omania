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

        var goodbyeLabel = new cc.LabelTTF("The last of your soldiers has fallen.\nPress R to Restart", "Arial", 38);
        goodbyeLabel.x = cc.winSize.width/2;
        goodbyeLabel.y = cc.winSize.height/2;

        //backframe=new cc.Sprite(res.Restart_png);
        //backframe.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        //this.addChild(backframe);
        this.addChild(goodbyeLabel, 5);
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