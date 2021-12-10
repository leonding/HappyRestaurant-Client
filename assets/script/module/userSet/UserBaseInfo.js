cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        nameLab:cc.Label,
        idLab:cc.Label,
        fightLab:cc.Label,
        unionLab:cc.Label,
        mapLab:cc.Label,
        signlab:cc.Label,

        teamNameLab:cc.Label,
        heroNode:cc.Node,
    },
    onLoad(){
        this.teamNameLab.string = ""
    },
    setData(data){
        this.data = data
        cc.log(this.data)
        // Func.newHead(data.head,this.headNode,data.qualityId,data.level)
        Func.newHead2(data.head,this.headNode)

        this.nameLab.string = data.name
        this.fightLab.string = Func.transNumStr(data.fightValue,true)
        this.signlab.string = data.sign || Ls.get(1720)
        this.m_iPlayer = data.playerId
        this.idLab.string = data.playerId
        if(data.allianceName){
            this.unionLab.string = data.allianceName
        }else{
            this.unionLab.string = Ls.get(1721)
        }

        if (data.mapId > 0){
            var mapConf = Gm.config.getMapById(data.mapId)
            this.mapLab.string = mapConf.mapName
        }else{
            this.mapLab.string = ""
        }
    },
    updateTeam(args){
        Func.destroyChildren(this.heroNode)
        this.m_tHeroList = []
        if (args.heroInfo.length > 0){
            for (let index = 0; index < args.lineHero[0].hero.length; index++) {
                const heroId = args.lineHero[0].hero[index];
                if (heroId > 0){
                    var hero = Func.forBy(args.heroInfo,"heroId",heroId)
                    var node = new cc.Node()
                    node.width = 95
                    node.height = 95
                    this.heroNode.addChild(node)
                    // Func.newHead(hero.baseId,node,hero.qualityId,hero.level)
                    if (node.itembase == null){
                        var itemBase = Gm.ui.getNewItem(node,true)
                        itemBase.node.scale = node.width/itemBase.node.width
                        itemBase.node.zIndex = -1
                        itemBase.setTips(false)
                        itemBase.setFb(this.onTeamClick.bind(this))
                        node.itemBase = itemBase
                        this.m_tHeroList.push(hero)
                    }
                    var level = hero.level
                    if (Gm.heroData.isInPool(hero.heroId)){
                        var tmpHeroData = Gm.config.getHero(hero.baseId,hero.qualityId)
                        level = Func.configHeroLv(hero,tmpHeroData)
                    }
                    node.itemBase.updateHero({baseId:hero.baseId,qualityId:hero.qualityId,level:level})
                }
            }
        }

        var teamType = args.lineHero[0].type
        var teamStr = ""
        if (teamType == ConstPb.lineHero.LINE_BOSS){
            teamStr = 1717 //"推图阵容"
        }else if (teamType == ConstPb.lineHero.LINE_PVP){
            teamStr = 1718 //"竞技场防守阵容"
        }else if (teamType == ConstPb.lineHero.LINE_TOWER){
            teamStr = 1719 //"爬塔阵容"
        }
        this.teamNameLab.string = Ls.get(teamStr)
    },
    onTeamClick:function(one){
        if (this.data.playerId != Gm.userInfo.id && !this.data.showHeroLine){
            Gm.floating(16)
            return
        }
        if (this.m_tHeroList && this.m_tHeroList.length > 0){
            var idx = 0
            var isOther = false
            var list = []
            for(const i in this.m_tHeroList){
                var hero = null
                if (this.m_iPlayer == Gm.userInfo.playerId){
                    hero = Gm.heroData.getHeroById(this.m_tHeroList[i].heroId)
                }else{
                    hero = Gm.heroData.toHeroInfo(this.m_tHeroList[i])
                    isOther = true
                }
                list.push(hero)
                if (this.m_tHeroList[i].qualityId == one.qualityId){
                    idx = Number(i)
                }
            }
            Gm.ui.create("TeamListView",{isOther:isOther,heroData:list[idx],list:list,enterName:this.enterName})
        }
    },
});

