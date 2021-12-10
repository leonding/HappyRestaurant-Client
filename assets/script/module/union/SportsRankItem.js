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
    setData:function(data,rank,owner){
        this.owner = owner
        this.data = data

        var tmpLevel = this.data.level
        var tmpName = this.data.name
        var tmpFight = this.data.score
        var tmpHead = this.data.headId
   
        Func.newHead2(tmpHead,this.headNode)
        this.nameLab.string = Ls.lv()+tmpLevel+"  "+tmpName
        this.unionLab.string = this.data.alliancename || ""

        this.fightLab.string  = data.score

        this.fightLab.string = Func.transNumStr(tmpFight,true)


        if (rank == 0){
            this.rankLab.node.parent.active = true
            this.rankSpr.node.active = false
            this.rankLab.string = Ls.get(800026)
        }else{
            this.rankLab.node.parent.active = rank > 3
            this.rankSpr.node.active = !(rank > 3)
            if (this.rankSpr.node.active){
                Gm.load.loadSpriteFrame("img/tower/tower_icon_hz"+rank,function(sp,icon){
                     if(icon && icon.node.isValid){
                        icon.spriteFrame = sp
                     }
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
            dd.lineType = ConstPb.lineHero.LINE_GVE
            Gm.ui.create("ArenaInfoBox",dd)
        }else{
            Gm.floating(Ls.get(2012))
        }
    },
});


