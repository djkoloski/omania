
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var size = cc.winSize;

        var tileMap = new cc.TMXTiledMap("res/TileGameResources/TileMap.tmx");
        this.addChild(tileMap,0);

        cc.log(tileMap);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    layer: null,
    textLayer: null,
    onEnter:function () {
        this._super();
        this.layer = new HelloWorldLayer();
        this.addChild(this.layer);
        this.textLayer= new TextBoxLayer();
        this.textLayer.init();
        this.addChild(this.textLayer);
    }
});

