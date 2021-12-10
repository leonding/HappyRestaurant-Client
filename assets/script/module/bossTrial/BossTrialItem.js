cc.Class({
    extends: cc.Component,

    properties: {
        infoNode:cc.Node,
        headNode:cc.Node,
        yunNode:cc.Node,
        nameLab:cc.Label,
        fightLab:cc.Label,
        boxSpr:cc.Sprite,
        btnSpr:cc.Sprite,
        lockNode:cc.Node,
        unlockLab:cc.Label,
        tjTeamNode:cc.Node,
    },
    setData:function(bossId,index,_owner){
        this.owner = _owner
        this.bossId = bossId
        this.index = index
        this.conf = Gm.config.getZhenFaBossById(bossId)
        
        this.nameLab.string = this.conf.info
        
        var fight = 0 
        for (var i = 0; i < this.conf.monster.length; i++) {
            if (Gm.config.getMonster(this.conf.monster[i].id) == null){
                cc.error(this.conf.monster[i].id)    
            }
            fight = fight + Gm.config.getMonster(this.conf.monster[i].id).combat
        }
        this.fightLab.string = fight

       this.updateState()
    },
    showHead(){
        this.headNode.active = true
        if (this.headNode.children.length){
            return
        }
        var list = this.conf.monster
        for (var i = 0; i < list.length; i++) {
            var mId = list[i]
            var itemBase = Gm.ui.getNewItem(this.headNode,null,103)
            itemBase.setTips(false)
            itemBase.updateHero({baseId:mId.id,isMonster:true})
        }
    },
    updateUnlockLab(){
        var str = ""
        if (Gm.userInfo.maxMapId < this.conf.unlockMapId){//未解锁
            var mapConf = Gm.config.getMapById(this.conf.unlockMapId)
            str =  mapConf.mapName
            this.infoNode.active = false
            this.yunNode.active = true
            this.lockNode.active = true
        }else{
            if (!this.lockNode.active){
                return
            }
            if (this.index != 0){
                var lastId = Gm.bossTrialData.getMapIdByIndex(this.index-1)
                var lastConf = Gm.config.getZhenFaBossById(lastId)
                str = lastConf.info
            }
        }
        this.unlockLab.string = cc.js.formatStr( Ls.get(7900012),str)
    },
    updateState(){
        this.headNode.active = false
        this.yunNode.active = false
        this.tjTeamNode.active = false
        this.lockNode.active = false

        var nowIndex = Gm.bossTrialData.getSaveIndex()

        var sprIndex = 0
        if (this.index > nowIndex){
            if (nowIndex + 1 == this.index){//当前可打
                this.lockNode.active = false
                this.infoNode.active = true
                this.showHead()
            }else{
                this.infoNode.active = false
                this.yunNode.active = true
                this.lockNode.active = true
            }
        }else{//通过
            sprIndex = 1
            this.infoNode.active = true
            this.showHead()
        }

        this.updateUnlockLab()

        this.boxSpr.spriteFrame = this.owner.getBoxSf(sprIndex)
        this.btnSpr.spriteFrame = this.owner.getBtnSf(sprIndex)

        if (this.infoNode.active){
            if (this.conf.tuijian.length > 0){
                this.tjTeamNode.active = true
            }
        }
        // this.tjTeamNode.active = true
    },
    onZrHelpClick(){
        Gm.ui.create("BossTrialTeamHelpView",this.conf)
    },
    onBoxClick(){
        Gm.award({award:this.conf.reward})
    },
    onFightClick(){
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_ZHENFA_BOSS,bossId:this.bossId})

    },
});
