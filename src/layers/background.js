var BackgroundLayer = cc.Layer.extend({
    tiles:null,
    ctor: function(scene) {
        this._super();

        var size = cc.winSize;

        var tile1 = new cc.Sprite(res.background_sand_scroll_png);
        var tile2 = new cc.Sprite(res.background_sand_scroll_png);
        var tile3 = new cc.Sprite(res.background_sand_scroll_png);
        var tile4 = new cc.Sprite(res.background_sand_scroll_png);
        tile1.setPosition(size.width/2, size.height);
        tile2.setPosition(size.width/2, size.height/2);
        tile3.setPosition(size.width/2,0);
        tile4.setPosition(size.width/2, 3*size.height/2);

        this.tiles = [tile1, tile2, tile3, tile4];

        this.addChild(tile1);
        this.addChild(tile2);
        this.addChild(tile3);
        this.addChild(tile4);

        this.scheduleUpdate();
    },
    update: function() {
        for (var i = 0; i < this.tiles.length; ++i) {
            this.tiles[i].y -= 3;
            if (this.tiles[i].y <= -cc.winSize.height/2) {
                this.tiles[i].y = 3*cc.winSize.height/2;
            }
        }
    }
});