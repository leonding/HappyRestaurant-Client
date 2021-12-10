var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureHeroHeadItem:cc.Node,
        scrollView:cc.ScrollView,
        needSpr:cc.Sprite,
        havaNumLab:cc.Label,
    },
    onLoad:function(){
        this.popupUIData = {title:5190}
        this._super()
    },
    register:function(){
        this.events[Events.SPORTS_HERO_REVIVE] = this.onHeroRevive.bind(this)
        this.events[Events.SPORTS_HERO_REVIVE_ALL] = this.updateView.bind(this)
    },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    getNeedId(){
        var itemId ="allianceact_revive_item"
        return Gm.config.getConst(itemId)
    },
    updateView(){
        Gm.ui.getConstIcon(this.getNeedId(),(sp)=>{
            if(this.needSpr && this.needSpr.node && this.needSpr.node.isValid){
                this.needSpr.spriteFrame = sp
            }
        })

        Func.destroyChildren(this.scrollView.content)

        var list = Gm.unionData.getSportsHeroData()
         list.sort(function(a,b){
             if(a.hp == 0 && b.hp!=0){
                 return -1
             }
             else if(a.hp != 0 && b.hp==0){
                 return 1
             }
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
        for (let index = 0; index < list.length; index++) {
            var item = cc.instantiate(this.PictureHeroHeadItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("PictureHeroHeadItem")
            itemSp.setData(list[index],this)
            this.items.push(itemSp)
        }
        this.updateNeed()
    },
    updateNeed(){
        var haveNum = Gm.bagData.getNum(this.getNeedId())
        if(haveNum>0 || Gm.unionData.reviceHeroHasFree()){
            this.havaNumLab.node.color = new cc.color(144,111,78)
        }
        else{
            this.havaNumLab.node.color = new cc.color(255,0,0)
        }
        if(Gm.unionData.reviceHeroHasFree()){
             this.havaNumLab.string = Ls.get(20024)
        }
        else{
              this.havaNumLab.string = haveNum
        }
    },
    onHeroRevive(data){
        for (let index = 0; index < this.items.length; index++) {
            const  v = this.items[index];
            if(v.data.heroId == data.heroId){
                v.setDead(false)
                break
            }
        }
        this.updateNeed()
    },
    onOkBtn(){
        if(Gm.unionData.getHeroDeadNum() == 0){
            Gm.floating(Ls.get(5453))
        }
        else{
            var haveNum = Gm.bagData.getNum(this.getNeedId())
            if(haveNum>0 || Gm.unionData.reviceHeroHasFree()){
                var data = {}
                data.msg =  cc.js.formatStr(Ls.get(2336))//
                if(Gm.unionData.reviceHeroHasFree()){
                    data.msg = cc.js.formatStr(Ls.get(2336))
                }
                Gm.box(data,function(btnType){
                    if(btnType == 1){
                        Gm.unionNet.reviveHero()
                    }
                })
            }
            else{
                  Gm.floating(Ls.get(5455))
            }
        }
    },
});

