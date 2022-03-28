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

    },

    start () {
        this.startGenGuestListener()
        this.startLineupListener()
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

    get_road_path: function(){
        return this.road_path;
    },

    genGuest: function(){
        var enemy = cc.instantiate(this.enemy_prefabs[0]);
        this.m_mapRoot.addChild(enemy)
        enemy.active = true;
        var actor = enemy.getComponent("actor")   
        
        Gm.homeData.queue_guest.push(actor)

        var roadname = "road_lineup"

        actor.run_at_road(roadname, this.road_path[roadname])
    },

    startGenGuestListener: function(){
        this.schedule(()=>{
            this.genGuest()
        }, 5)
    },

    startLineupListener: function(){
        this.schedule(()=>{
            this.selectSeat()
        }, 1)
    },
    
    selectSeat: function(){
        var guest = this.getFirstGuest()
        if(guest && guest.isSelectSeatAction()) {
            var index = Gm.homeData.getSeatFirstIdleIndex();
            if(index != -1) {
                // cc.log("===================", index)
                var road_name = "road_in_seat_" + (index + 1)
                Gm.homeData.setSeatUse(index)
                Gm.homeData.removeGuestLineupFirst()
                guest.setState("WALK")
                guest.setAction("SELECT_SEAT")
                guest.setSeat(index+1)
                guest.run_at_road(road_name, this.road_path[road_name])
            }
        }
    },

    oneKeyFull: function(){
        for(var i = 0; i < 20; i++) {
            this.scheduleOnce(function() {
                this.genGuest()
            }.bind(this), 1 * i);
        }
    },

    getFirstGuest: function(){
        return Gm.homeData.queue_guest[0]
    },

    getFrontGuest: function(guest) {
        var length = Gm.homeData.queue_guest.length
        for(var i = 0; i < length; i++) {
            if(Gm.homeData.queue_guest[i] === guest) {
                if(i == 0) {
                    return null
                }else{
                    return Gm.homeData.queue_guest[i-1]
                }
            }
        }
    }


});

