var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureHeroHeadItem:cc.Node,
        scrollView:cc.ScrollView,
        //timeLab:cc.Label
    },
    onLoad:function(){
        this.popupUIData = {title:2333}
        this._super()
    },
    register:function(){
        this.events[Events.SPORTS_HERO_REVIVE] = this.onHeroRevive.bind(this)
        this.events[Events.SPORTS_HERO_REVIVE_ALL] = this.onReviveAll.bind(this)
    },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    onHeroRevive(){
          this.updateView()
    },
    //全部复活
    onReviveAll(){
        Gm.ui.removeByName("SportsReviveView")
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.unionData.getSportsDeadHeroData()
        list.sort(function(a,b){
            if (a.chipOpen && b.chipOpen){
                return b.num - a.num
            }else{
                if (a.chipOpen){
                    return -9999
                }
                if (b.chipOpen){
                    return 9999
                }
                if (a.num && b.num){
                    return b.num - a.num
                }else{
                    if (a.num){
                        return 9999
                    }
                    if (b.num){
                        return -9999
                    }
                    var confA = Gm.config.getHero(a.baseId,a.qualityId)
                    var confB = Gm.config.getHero(b.baseId,b.qualityId)
                    var levelA = a.level
                    var levelB = b.level
                    if (Gm.heroData.isInPool(a.heroId)){
                        levelA = Func.configHeroLv(a,confA)
                    }
                    if (Gm.heroData.isInPool(b.heroId)){
                        levelB = Func.configHeroLv(b,confB)
                    }
                    if (levelA == levelB){
                        if (confA.quality == confB.quality){
                            return confB.camp - confA.camp
                        }else{
                            return confB.quality - confA.quality
                        }
                        return -1
                    }else{
                        return levelB - levelA
                    }
                }
            }
        })

        this.items = []
        var self = this
        for (let index = 0; index < list.length; index++) {
            var item = cc.instantiate(this.PictureHeroHeadItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("PictureHeroHeadItem")
            itemSp.setData(list[index],this)
            itemSp.itemBase.setTips(false)
            this.items.push(itemSp)
            item.on(cc.Node.EventType.TOUCH_START,function(event){
                self.onItemSelect(this)
            }.bind(item))
        }
    },
    onItemSelect(item){
        var itemSp = item.getComponent("PictureHeroHeadItem")
        for(let index=0;index<this.items.length;index++){
            if(this.items[index].data.heroId == itemSp.data.heroId){
                this.items[index].node.getChildByName("selectSprite").active = true
            }
            else{
                this.items[index].node.getChildByName("selectSprite").active = false
            }
        }
    },
    onOkBtn(){
        if(Gm.bagData.getNum(Gm.config.getConst("allianceact_revive_item"))==0){
            Gm.floating(Ls.get(5455))
            return
        }
        var itemJs = null
        for(var i=0;i<this.items.length;i++){
            if(this.items[i].node.getChildByName("selectSprite").active){
                itemJs = this.items[i]
                break;
            }
        }
        if(itemJs){
            Gm.unionNet.reviveHero(itemJs.data.heroId)
        }
    },
    
    //更新结束时间
    onDestroy(){
        //this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        var tmpTime = (this.endTime - Gm.userData.getTime_m())/1000
        if (tmpTime >= 0){
            this.timeLab.string = Func.timeToTSFM(tmpTime)
        }else{
            Gm.ui.removeByName("SportsReviveView")
        }
    },
});

