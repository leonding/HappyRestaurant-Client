var ExtendsView = require("FriendItem")
cc.Class({
    extends: ExtendsView,
    properties: {
        applyBtn:cc.Node,
        cancelBtn:cc.Node,
    },
    setData(data,owner,isActive){
        data.arenaFightInfo = []
        data.arenaFightInfo.playerId = data.playerId
        
        data.arenaFightInfo.level = Gm.heroData.getMaxHeroLv()
        data.arenaFightInfo.head = data.qualityId
        data.arenaFightInfo.fightValue = data.fight || 0

        var conf = Gm.config.getHero(0,data.qualityId)
        data.arenaFightInfo.name = conf.name

        this._super(data,owner)

        this.serverLab.string = data.ownerName
        this.applyBtn.active = isActive
        this.cancelBtn.active = isActive
    },
    onOkClick(){
        Gm.friendNet.hireReplyApply(this.data.heroId,1,this.data.applyId)
    },
    onCancelClick(){
        Gm.friendNet.hireReplyApply(this.data.heroId,0,this.data.applyId)
    },
    
});
