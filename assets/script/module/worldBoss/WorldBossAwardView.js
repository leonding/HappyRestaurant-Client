var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        awardNodes:cc.Node,
        unionLab:cc.Label,
        unionScoreLab:cc.Label,
        playerScoreLab:cc.Label,
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    getRankStr(rank){
        if (rank > 0){
            return rank
        }else{
            return Ls.get(7100011)
        }   
    },
    updateView(){
        this.unionLab.string =  Ls.get(50060) + "：" +Gm.unionData.getUnionName()
        // this.unionScoreLab.string = Ls.get(7100005) + "：" + (this.openData.allianceRank?this.openData.allianceRank:Ls.get(7100011))
        // this.playerScoreLab.string = Ls.get(7100006) + "：" + (this.openData.rank?this.openData.rank:Ls.get(7100011))

        this.unionScoreLab.string = Ls.get(7100005) + "：" + this.getRankStr(this.openData.allianceRank)
        this.playerScoreLab.string = Ls.get(7100006) + "：" + this.getRankStr(this.openData.rank)

        var list = Gm.config.getWorldBossRankAward()
        for (var i = 0; i < list.length; i++) {
            if (list[i].rank == 0){
                list[i].rank = 50
                break
            }
        }
        list.sort(function(a,b){
            return a.rank - b.rank
        })

        var teamAward  = this.getAward(this.openData.allianceRank,list,"guildReward")
        var playerAward  = this.getAward(this.openData.rank,list,"personalReward")
        

        var awardList = [teamAward,playerAward]



        var awards = []
        for (var i = 0; i < awardList.length; i++) {
            for (var j = 0; j < awardList[i].length; j++) {
                var v = awardList[i][j]
                var dd = Func.forBy(awards,"id",v.id)
                if (dd){
                    dd.num = dd.num + v.num
                }else{
                    awards.push({type:v.type,id:v.id,num:v.num})
                }
            }
        }

        cc.log(this.openData.allianceRank,this.openData.rank,awardList,awards)

        this.awardNodes.scale = 0.9
        for (let index = 0; index < awards.length; index++) {
            const v = awards[index];
            var item = Gm.ui.getNewItem(this.awardNodes)
            item.setData(v)
        }
         
    },
    getAward(rank,list,key){
        if (rank == 0){
            return []
        }
        var ll = []
        for (var i = list.length - 1; i >= 0; i--) {
            var v = list[i]
            if (rank >= v.rank){
                return v[key]
            }
        }
        return []
    },
    onClick(){
        this.onBack()
    },
});

