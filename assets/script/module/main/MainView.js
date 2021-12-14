var BaseView = require("BaseView")


// MainView
cc.Class({
    extends: BaseView,

    properties: {
        m_oBackground:cc.Sprite,
    },

    onLoad () {
        this._super()
    
    },
    onEnable(){
        this._super()
        Gm.send(Events.ENTER_MAIN)
    },
    enableUpdateView:function(destData){
        if (destData){
            // cc.error("enableUpdateView destData===:",destData)
            if (!Bridge.getAppType()){

            }
         
        }
    },

    onUserUpdate:function(){
     
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE]  = this.onUserUpdate.bind(this)
    },

    onEmailClick:function(){
        
        var data = {}
        data.playerId = 1
        data.number = 21

        Gm.getLogic("HomeLogic").sendTableClean(data)

    },
   



});

