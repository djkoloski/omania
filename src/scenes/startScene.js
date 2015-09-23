var StartLayer = cc.Layer.extend({
    ctor: function(scene) {
        this._super();

        var keyListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key, event) {
                this.startGame(key);
            }.bind(this)
        });

        this.isKeyboardEnabled = true;
        cc.eventManager.addListener(keyListener, this);

        var helloLabel = new cc.LabelTTF("Press Spacebar to Play", "Arial", 38);
        helloLabel.x = cc.winSize.width/2;
        helloLabel.y = cc.winSize.height/2;

        this.addChild(helloLabel, 5);
    },
    startGame: function(key){
        if (key == cc.KEY.space) {
            //cc.director.pushScene(StartScene);
            window.scene = new GameScene();
            cc.director.runScene(window.scene);
            console.log("Start");
        }
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});