cc.Class({
    extends: cc.Component,
    properties: {
        rankSpr:cc.Sprite,
        rankLab:cc.Label,
        headNode:cc.Node,
        nameLab:cc.Label,
        unionLab:cc.Label,
        fightSpr:cc.Sprite,
        fightLab:cc.Label,
    },
    setData:function(data,rank,owner,rankType){
        this.owner = owner
        this.data = data
        this.rankType = rankType

        var tmpLevel = this.data.level
        var tmpName = this.data.name
        var tmpFight = this.data.fightValue
        var tmpHead = this.data.head
        var tmpUnion = this.data.allianceName
        if (this.data.type == ConstPb.roleType.MONSTER){
            var tmpConfig = Gm.config.getArenaMon(data.playerId)
            tmpLevel = tmpConfig.level
            tmpName = tmpConfig.name
            tmpFight = tmpConfig.power
            tmpHead = tmpConfig.icon
        }
        Func.newHead2(tmpHead,this.headNode)
        this.nameLab.string = Ls.lv()+tmpLevel+"  "+tmpName
        this.unionLab.string = this.data.allianceName || ""


        var tmpNum = 0
        var imageName = ""
        if (rankType == ConstPb.rankType.RANK_ARENA){
            imageName = "share_icon_jf"
            tmpNum = data.arenaPoint || 0
        }else if (rankType == ConstPb.rankType.RANK_TOTALFIGHT){
            imageName = "share_img_zd"
            tmpNum = Func.transNumStr(tmpFight,true)
        }else if (rankType == ConstPb.rankType.RANK_TOWER){
            imageName = "share_icon_pt"
            tmpNum = data.towerId
        }

        Gm.load.loadSpriteFrame("img/share/"+ imageName,function(sp,icon){
            icon.spriteFrame = sp
        },this.fightSpr)
        this.fightLab.string  = tmpNum


        if (rank == 0){
            this.rankLab.node.parent.active = true
            this.rankSpr.node.active = false
            this.rankLab.string = Ls.get(800026)
        }else{
            this.rankLab.node.parent.active = rank > 3
            this.rankSpr.node.active = !(rank > 3)
            if (this.rankSpr.node.active){
                Gm.load.loadSpriteFrame("img/tower/tower_icon_hz"+rank,function(sp,icon){
                    icon.spriteFrame = sp
                },this.rankSpr)
            }else{
                this.rankLab.string = rank
            }
        }
    },
    onClick(){
        cc.log(this.data)
        if (this.data.type != ConstPb.roleType.MONSTER){
            if (this.data.playerId == Gm.userInfo.id){
                return
            }
            var dd = {player:this.data,enterName:"RankView"}
            if (this.rankType == ConstPb.rankType.RANK_TOTALFIGHT){
                dd.lineType = ConstPb.lineHero.LINE_BOSS
            }else if (this.rankType == ConstPb.rankType.RANK_ARENA){
                dd.lineType = ConstPb.lineHero.LINE_PVP
            }else if (this.rankType == ConstPb.rankType.RANK_TOWER){
                dd.lineType = ConstPb.lineHero.LINE_TOWER
            }
            Gm.ui.create("ArenaInfoBox",dd)
        }else{
            Gm.floating(Ls.get(2012))
        }
    },
});


