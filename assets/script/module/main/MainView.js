var BaseView = require("BaseView")


// MainView
cc.Class({
    extends: BaseView,

    properties: {
        m_oBackground:cc.Sprite,

        enemy_prefabs: {
            default: [],
            type: cc.Prefab,
        },

        m_mapRoot:cc.Node,
    },

    onLoad () {
        this._super()
        
        this.queue_guest = [] //排队的客人
    },

    start () {
        this.gen_round_enmey();
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
   

    set_road_path: function (road_path){
        this.road_path = road_path
    },

    gen_round_enmey: function(){
        for(var i = 0; i < 1; i++) {
            this.scheduleOnce(function() {
                var enemy = cc.instantiate(this.enemy_prefabs[0]);
                this.m_mapRoot.addChild(enemy)
                enemy.active = true;
                var actor = enemy.getComponent("actor")   
                
                this.queue_guest.push(actor)

                actor.run_at_road(this.road_path)
            }.bind(this), 1 * i);
        }
    },

    getFrontGuest: function(guest) {
        var length = this.queue_guest.length
        for(var i = 0; i < length; i++) {
            if(this.queue_guest[i] === guest) {
                if(i == 0) {
                    return null
                }else{
                    return this.queue_guest[i-1]
                }
            }
        }
    }


});

