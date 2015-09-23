var StartLayer = cc.Layer.extend({
    BACKGROUND: res.floor_png,
    TITLE: res.floor_png,
    BUTTON: res.floor_png,
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

        var background = new cc.Sprite(StartLayer.prototype.BACKGROUND);
        background.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        var title = new cc.Sprite(StartLayer.prototype.TITLE);
        title.setPosition(512,412);
        var startButton = new cc.LabelTTF("Press Spacebar to Play", "Arial", 38);
        //var startButton = new cc.Sprite(StartLayer.prototype.BUTTON);
        startButton.setPosition(cc.winSize.width/2, cc.winSize.height/4);

        this.addChild(background, 4);
        this.addChild(title,5);
        this.addChild(startButton, 6);
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