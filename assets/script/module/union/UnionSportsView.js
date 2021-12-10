var BaseView = require("BaseView")
// UnionSportsView
cc.Class({
    extends: BaseView,

    properties: {
        m_oIslandNode:cc.Node,
        m_oContentNodes:{
          default:[],
          type:cc.Node  
        },
        m_oTimeDesLab:cc.Label,
        m_oTimeLabel:cc.Label,
        sportsBtn:cc.Node
    },
    onLoad () {
        this._super()
        this.maxOpenIslandId = Gm.unionData.getMaxOpenIslandId()
        this.islandConfigData = Gm.config.getAllianceIslandsConfig()
        this.createUI()
        this.endTime = Gm.unionData.getSportsEndTime()
        this.addTimes()
        Gm.red.add(this.sportsBtn,"union","taskFinished")
        if(Gm.unionData.sportsIsOpen()){
            this.m_oTimeDesLab.string = Ls.get(5446)
        }
        else{
             this.m_oTimeDesLab.string = Ls.get(5854)
        }
    },
    register:function(){
         this.events[Events.SPORTS_TOWER_UPDATE] = this.updateView.bind(this)
    },
    createUI(){
        var configLength = this.islandConfigData.length
        this.m_oLandItemJs = []
        for(let i=0;i<this.m_oContentNodes.length;i++){
            if(i<configLength){
                var item  = cc.instantiate(this.m_oIslandNode)
                item.active = true
                item.x = 0
                item.y = 0
                this.m_oContentNodes[i].active = true
                item.parent = this.m_oContentNodes[i]
                var js = item.getComponent("SportsIslandItem")
                js.setData(this.islandConfigData[i],this.maxOpenIslandId)
                this.m_oLandItemJs.push(js);
            }
            else{
                this.m_oContentNodes[i].active = false
            }
        }
    },
    updateView(){
        if(!Gm.ui.isExist("SportsModelSelectView")){
            var maxOpenIslandId = Gm.unionData.getMaxOpenIslandId()
            if(this.maxOpenIslandId != maxOpenIslandId){
                this.maxOpenIslandId = maxOpenIslandId
                for(var i=0;i<this.m_oLandItemJs.length;i++){
                    var js = this.m_oLandItemJs[i]
                    js.setData(this.islandConfigData[i],this.maxOpenIslandId)
                }
            }
        }
        this.updatePercent()
    },
    updatePercent(){
        for(var i=0;i<this.m_oLandItemJs.length;i++){
            var js = this.m_oLandItemJs[i]
            js.updatePercent()
        }
    },

    //按钮点击
    onRankBtnClick(){
        cc.log("onRankBtnClick")
        if(!Gm.unionData.sportsIsOpen()){
            Gm.floating(Ls.get(200016))
            return
        }
        Gm.ui.create("SportsRankView",true)
    },
    onLogBtnClick(){
        if(!Gm.unionData.sportsIsOpen()){
            Gm.floating(Ls.get(200016))
            return
        }
        cc.log("onLogBtnClick")
    },
    onBagBtnClick(){
        if(!Gm.unionData.sportsIsOpen()){
            Gm.floating(Ls.get(200016))
            return
        }
        Gm.ui.create("SportsBagView",true)
    },
    //联盟竞技任务
    onSportsBtnClick(){
        cc.log("onSportsBtnClick")
        if(!Gm.unionData.sportsIsOpen()){
            Gm.floating(Ls.get(200016))
            return
        }
        Gm.ui.create("SportsMissionView",true,function(){
            
        })
    },


    //更新结束时间
    onDestroy(){
        this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        if(!Gm.unionData.sportsIsOpen()){
            var tmpTime = (Gm.unionData.getNextOpenTime() - Gm.userData.getTime_m())/1000
            if (tmpTime > 0){
                this.m_oTimeLabel.string = Func.timeToTSFM(tmpTime)
            }
            else{
                this.closeViews()
            }
            return
        }
        var tmpTime = (this.endTime - Gm.userData.getTime_m())/1000
        if (tmpTime > 0){
            this.m_oTimeLabel.string = Func.timeToTSFM(tmpTime)
        }else{
           this.closeViews()
        }
    },
    closeViews(){
        //赛季结束关闭
        Gm.ui.removeByName("UnionSportsView")
        Gm.ui.removeByName("SportsMissionView")
        Gm.ui.removeByName("SportsRankView")
        Gm.ui.removeByName("SportsReviveView")
        Gm.ui.removeByName("AwardBox")
        Gm.ui.removeByName("SportsBagView")
        Gm.ui.removeByName("MonsterTeamView")
        Gm.ui.removeByName("SportsRewardAction")
        Gm.ui.removeByName("NewChapterAction")
        Gm.ui.removeByName("SportsModelSelectView")
    },
    getSceneData:function(){
        return true
    },
});

