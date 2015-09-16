/**
 * Created by kortrk on 9/12/2015.
 */
/*README:
 * What to know about these additions:
 *  -The only important change in app.js are the lines
 *      var textLayer= new TextBoxLayer();
 *      textLayer.init();
 *      this.addChild(textLayer);
 *  -to use the textbox, run the function
 *      setDisplayText("whatever the heck you want!");
 *          or
 *      UI.display("your text here");
 *   If you set it to "", the text box disappears! Magic!
 *   Shoot for a max of 33 characters on a line, 5 lines.
 *
 */
/*UI 'class'*/
/* Here's a fake header file to help you visualize the 'class'
UI{
    string currentText="";
    //boolean paused=false;

    void display(string x){}
        //Sets currentText of UI to x.
}

 */
var UI= {"currentText":"Hello whale", "paused":false};

//we begin the UI class with a function to
//display a given piece of text in a text area
function setDisplayText(text){
    UI.currentText=text;
}

UI.display=setDisplayText;

var TextBoxLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
        this.scheduleUpdate ();
    },

        //EXPERIMENTING WITH PAUSE- IGNORE
        //cc.eventManager.addListener(
        //    {
        //        event: cc.EventListener.KEYBOARD,
        //        onKeyPressed: function (key, event) {
        //            console.log("key=" + key.toString());
        //            if (key.toString()==27 && cc.director.isPaused())
        //                cc.director.resume();
        //            if (key.toString()==27) cc.director.pause();
        //        }
        //    }, this);
        //
        //if (cc.director.isPaused){
        //    console.log("isPaused");
        //}
        //else console.log("isn't Paused")

        //this.subscribeUpdate();

    displayText: function(string) {
        //console.log(string);
        this.textBuffer+=string;

        if (string!="") {
            UI.currentText = " ";
        }
        else{
            UI.currentText="";
        }

        //2. get the screen size of your game canvas
        var winsize = cc.director.getWinSize();

        //3. calculate the center point
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        //4. create a background image and set it's position at the center of the screen

        var textpos = cc.p(winsize.width/2, this.spritebg.height/2);
        if (UI.currentText==""){
            textpos=cc.p(winsize.width/2, -1000);
            //hide it way offscreen
        }
        this.spritebg.setPosition(textpos);

        // position the label on the center of the screen
        this.helloLabel.x = winsize.width / 2;
        this.helloLabel.y = this.spritebg.height / 2;
        if (UI.currentText==""){ //hide it offscreen
            this.helloLabel.y= -1000;
        }
        this.helloLabel.setFontFillColor(new cc.Color(0,0,0,0));
        this.helloLabel.setString(UI.currentText);
        // add the label as a child to this layer

    },
    init:function(){
        //call super class's super function
        this._super();

        this.helloLabel = new cc.LabelTTF(UI.currentText, "Arial", 20);

        this.spritebg = new cc.Sprite(res.Textbox_png);

        this.textBuffer="";

        this.spaceLeftOnLine=27;

        this.numLinesUsed=0;

        this.time_since=0;

        this.displayText("");

        this.addChild(this.helloLabel, 5);

        this.addChild(this.spritebg);
    },
    update: function(dt) {
        if (this.textBuffer=="") return;
        console.log(this.time_since);
        this.time_since+=dt;
        if (this.time_since<.05) return;
        else this.time_since=0;

        if (this.numLinesUsed==5){
            UI.currentText=" ";
            this.numLinesUsed=0;
        }
        //now that that's out of the way...
        UI.currentText+=this.textBuffer[0];
        this.textBuffer=this.textBuffer.slice(1);
        this.spaceLeftOnLine-=1;
        this.helloLabel.setString(UI.currentText);
        if (this.spaceLeftOnLine<=0 && (UI.currentText[UI.currentText.length-1]==' '
            ||UI.currentText[UI.currentText.length-1]=='\n')){
            UI.currentText+="\n";
            this.spaceLeftOnLine=27;
            this.numLinesUsed+=1;
        }
        //if (this.spaceLeftOnLine<-5){
        //    UI.currentText+="\n";
        //    this.spaceLeftOnLine=33;
        //    this.numLinesUsed+=1;
        //}
    }
});

/*References:
    textBoxLayer:
        http://cocos2d-x.org/docs/tutorial/framework/html5/parkour-game-with-javascript-v3.0/chapter3/en

Next steps:
    Make the string disappear after a certain time
        SET TIMEOUT
        CANCEL TIMEOUT
    More importantly, make text animatedly appear
*/