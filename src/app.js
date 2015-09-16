
var TMLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var tileMap = new cc.TMXTiledMap("res/TileMap.tmx");
        this.addChild(tileMap,-1);

        var colliders = tileMap.getObjectGroup("Collide").getObjects();
        var dangers = tileMap.getObjectGroup("Danger").getObjects();

        return true;
    }
});



var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TMLayer();
        this.addChild(layer);
    }
});


