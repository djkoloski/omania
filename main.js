var g_resolutionWidth = 1024;
var g_resolutionHeight = 768;

cc.game.onStart = function(){
	var startScene = GameScene;
	
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(g_resolutionWidth, g_resolutionHeight, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        window.scene = new startScene();
        cc.director.runScene(window.scene);
    }, this);
};
cc.game.run();
