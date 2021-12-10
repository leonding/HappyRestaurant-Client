var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        heroItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        filterPerfab:cc.Prefab,
        filterNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:7027}

        this._super()

        var tmpFilter = cc.instantiate(this.filterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.filterNode.addChild(tmpFilter)
        this.filterNode.active = false
        this.m_iFilterValue  = 0
        this.m_iJobValue  = 0
    },
    enableUpdateView(args){
        if (args){
            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job
                    this.updateView()
                }
            }.bind(this))
            this.filterNode.active = true

            this.updateView()
        }
    },
    // register:function(){
    //     this.events[MSGCode.OP_EDIT_AID_HERO_S] = this.updateView.bind(this)
    // },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.heroData.heros

        list.sort((a,b)=>{
            if (b.level == a.level){
                var confA = Gm.config.getHero(a.baseId,a.qualityId)
                var confB = Gm.config.getHero(b.baseId,b.qualityId)
                if (confA.quality == confB.quality){
                    return confB.camp - confA.camp
                }else{
                    return confB.quality - confA.quality
                }
                return -1
            }else{
                return b.level - a.level
            }
        })
        this.items = []
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var dd = Gm.friendData.getAidByHeroId(v.heroId)
            if (dd == null){
                var conf = Gm.config.getHero(v.baseId)

                if ((this.m_iFilterValue == 0 || this.m_iFilterValue == conf.camp)&&
                        (this.m_iJobValue == 0 || this.m_iJobValue == conf.job)){
                    var item = cc.instantiate(this.heroItem)

                    item.active = true
                    this.scrollView.content.addChild(item)
                    // Func.newHead(v.baseId,item,v.qualityId,v.level)
                    if (item.itembase == null){
                        var itemBase = Gm.ui.getNewItem(item,true)
                        // itemBase.node.scale = item.width/itemBase.node.width
                        itemBase.node.zIndex = -1
                        itemBase.setTips(false)
                        item.itemBase = itemBase
                    }
                    item.itemBase.updateHero({baseId:v.baseId,qualityId:v.qualityId,level:v.level})
                    item.getChildByName("checkSp").active = false
                    
                    // var conf = Gm.config.getHero(v.baseId,v.qualityId)
                    // item.getChildByName("nameLab").getComponent(cc.Label).string = conf.name
                    item.heroId = v.heroId
                    this.items.push(item)
                }
            }
        }
    },
    onItemClick(sender){
        var aidData = Gm.friendData.getAidByHeroId(sender.target.heroId)
        if (aidData && aidData.aidFriName ){
            Gm.floating(Ls.get(7036))
            return
        }
        var check = sender.currentTarget.getChildByName("checkSp")
        var max = Gm.config.getConst("friend_max_aid")
        if (!check.active && this.getHeroIds().length == max){
            Gm.floating(Ls.get(7035))
            return
        }
        check.active = !check.active
    },
    getHeroIds(){
        var list = []
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            if (v.getChildByName("checkSp").active){
                list.push(v.heroId)
            }
        }
        for (var i = 0; i < Gm.friendData.aidList.length; i++) {
            var v = Gm.friendData.aidList[i]
            list.push(v.heroId)
        }
        return list
    },
    onBtn(){
        var list = this.getHeroIds()
        if (list.length ==0){
            return
        }
        Gm.friendNet.changeAid(list)
    }
});

