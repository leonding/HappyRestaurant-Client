var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureHeroHeadItem:cc.Prefab,
        descLab:cc.Label,
        enemyNode:cc.Node,
        awardNode:cc.Node,
        awardLab:cc.Label,
        bossSprite:cc.Node,
        limitNumLable:cc.Label,
    },
    onLoad:function(){
        var array = [324,325,326]
        this.popupUIData = {title:Ls.get(array[(this.openData.id -1)%3])}
        this._super()
    },
    register:function(){
        this.events[Events.SPORTS_UPDATE_MONSTER] = this.updateView.bind(this)
    },
    enableUpdateView(args){
        if(args){
            this.data = args
            var eventData = Gm.unionData.getMonsterData(this.data.id)
            if(!eventData || eventData.length == 0){
                    Gm.unionNet.showGVE(this.data.id)
            }
            else{
                this.updateView()
            }
        }
    },
    updateView(){
        Func.destroyChildren(this.awardNode)
        Func.destroyChildren(this.enemyNode)
        
        var eventData = Gm.unionData.getMonsterData(this.data.id)
        for (let index = 0; index < eventData.length; index++) {
            const v = eventData[index];
            var item = cc.instantiate(this.PictureHeroHeadItem)
            item.active = true
            this.enemyNode.addChild(item)
            var itemSp = item.getComponent("PictureHeroHeadItem")
            v.isMonster = true
            itemSp.setData(v)
            this.addBossSprite(item,v)
        }  

        //添加积分
        var eventGroupConf = Gm.config.getAllianceIslandsMonsterConfigById(this.data.id)
        var maxOpenId = Gm.unionData.getMaxOpenIslandId()
        if(maxOpenId == this.data.group){
             var scorShow = eventGroupConf.scorShow
             var array = scorShow.split("_")
            var itemBase = Gm.ui.getNewItem(this.awardNode)
            itemBase.node.scale = 0.85
            itemBase.setData({type:array[0],id:array[1],num:array[2]})
        }

         //技能描述
         this.descLab.string = eventGroupConf.info || ""

        //添加首通奖励
        if(Gm.unionData.hasFirstPassReward(this.data.id)){
            for (let index = 0; index < eventGroupConf.dropReward.length; index++) {
                const v = eventGroupConf.dropReward[index];
                var itemBase = Gm.ui.getNewItem(this.awardNode)
                itemBase.node.scale = 0.85
                itemBase.setData(v)
            }
        }

        //添加限制次数
        this.limitNumLable.string = Ls.get(800163) + Gm.unionData.getBattleLimit()
    },
    addBossSprite(item,monster){
        var tmpConfig = Gm.config.getHero(0,monster.qualityId)
        var skinConf =Gm.config.getSkin(tmpConfig.skin_id)
        if (skinConf.enlarge > 0){
            var titem = cc.instantiate(this.bossSprite)
            titem.active = true
            titem.x = -item.width/2 + 10
            titem.y  = item.height/2 - 5
            titem.anchorX = 0
            titem.anchorY = 1
            item.addChild(titem)
        }
    },
    onFightBtn(){
        if(Gm.unionData.canBattle(this.data.group)){
              Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_GVE,id:this.data.id,group:this.data.group})
              Gm.ui.removeByName("MonsterTeamView")
        }
        else{
            Gm.floating(1209 )
        }
    },
    onBack(){
        this._super()
        setTimeout(() => {
            if(Gm.ui.isExist("SportsModelSelectView")){
                 Gm.ui.getScript("SportsModelSelectView").checkShowNewChapter()
            }
        }, 2000);
    },
    getSceneData:function(){
        return this.data
    },
});

