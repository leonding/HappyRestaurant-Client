var ExtendsView = require("FriendItem")
cc.Class({
    extends: ExtendsView,
    properties: {
        applyBtn:cc.Node,
        cancelBtn:cc.Node,
    },
    setData(data,owner){ //viewType 0,黑名单1搜索，2审核列表
        data.arenaFightInfo = []
        data.arenaFightInfo.playerId = data.playerId
        
        data.arenaFightInfo.level = Gm.heroData.getMaxHeroLv()
        data.arenaFightInfo.head = data.qualityId
        data.arenaFightInfo.fightValue = data.fight || 0

        var conf = Gm.config.getHero(0,data.qualityId)
        data.arenaFightInfo.name = data.ownerName
        
        this._super(data,owner)

        this.serverLab.string = conf.name

        this.applyBtn.active = !data.request
        this.cancelBtn.active = !this.applyBtn.active
    },
    onApplyClick(){
        if (Gm.friendData.hireList && Gm.friendData.hireList.length == 3){
            Gm.floating(7066)
            return
        }
        if (Gm.friendData.getApplyHireNum()>=Gm.config.getConst("hire_aid_apply_limit")){
            Gm.floating(7077)
            return
        }
        Gm.friendNet.hireApply(this.data.heroId,0)
    },
    onCancelClick(){
        Gm.box({msg:Ls.get(7078)},(btnType)=>{
            if (btnType == 1){
                Gm.friendNet.hireApply(this.data.heroId,1)
            }
        })
    },
    onHeadClick(){
        cc.log("获取详情信息")
        Gm.heroNet.dynInfo(this.data.heroId)
    },
    
});
