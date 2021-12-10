cc.Class({
    extends: cc.Component,

    properties: {
        bgSpr:cc.Sprite,
        doorSpr:cc.Sprite,
        spineNode:cc.Node,
        yunNode:cc.Node,
        numLab:cc.Label,
        headNode:cc.Node,
        tgNode:cc.Node,
        tzBtn:cc.Node,
        fightPerfab:cc.Prefab,
    },
    setData:function(towerNum,towerType){
        this.towerNum = towerNum
        this.towerType = towerType
        this.towerId = TowerFunc.towerNumToId(towerType,towerNum)

        this.conf = Gm.config.getTower(this.towerId)
        this.numLab.string = this.conf.name

        this.spineNode.active = false
        this.tzBtn.active = false
        this.yunNode.active = false
        this.tgNode.active = false
        this.doorSpr.node.active = false
        if (this.towerId > Gm.towerData.getId(towerType)){
            this.doorSpr.node.active = true
            if (Gm.towerData.getId(towerType) + 1 == this.towerId){
                this.tzBtn.active = true
                this.showSpine()
            }else{
                this.yunNode.active = true
            }
        }else{
            this.tgNode.active = true
            
        }

        Gm.load.loadSpriteFrame("img/tower/tower_img_bg_" + this.conf.group,(sp,owner)=>{
            if(this.node && this.node.isValid){
                owner.spriteFrame = sp
            }
        },this.bgSpr)

        Gm.load.loadSpriteFrame("img/tower/tower_img_men_" + this.conf.group,(sp,owner)=>{
            owner.spriteFrame = sp
        },this.doorSpr)

        var xx = [59,85,68,31]
        this.doorSpr.node.y = xx[this.conf.group]
    },
    showSpine(){
        this.spineNode.active = true

        var list = this.conf.monsterIds
        for (var i = 0; i < list.length; i++) {
            var mId = list[i]
            var monster = Gm.config.getMonster(mId)

            var tmpPage = cc.instantiate(this.fightPerfab)
            tmpPage.scale = 0.7
            this.spineNode.addChild(tmpPage)
            var tmpSpt = tmpPage.getComponent("FightHeroCell")
            tmpSpt.setOwner(this,1)
            tmpSpt.setData(monster)

        }
        this.spineNode.width = 720/6*list.length
    },
    onTowerInfo(){
        cc.log(this.conf)
        // Gm.ui.create("TowerInfoView",this.conf)
        Gm.battleNet.towerLast(this.conf.id)
    },
    onHeadBtn(){
        // Gm.battleNet.towerLast(this.conf.id)
    },
    onTzBtn(){
        TowerFunc.showFightTeam(this.towerId)
        // Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_TOWER,towerId:this.towerId})
    },
});
