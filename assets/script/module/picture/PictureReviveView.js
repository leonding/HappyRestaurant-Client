var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureHeroHeadItem:cc.Node,
        scrollView:cc.ScrollView,
        needSpr:cc.Sprite,
        numLab:cc.Label,
    },
    onLoad:function(){
        this.popupUIData = {title:2333}
        this._super()
    },
    register:function(){
        this.events[MSGCode.OP_REVIVEALL_PIC_S] = this.onReviveAll.bind(this)
    },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    getNeedId(){
        var itemId = this.openData.treasure?"secret_place_revive_item":"picture_puzzle_revive_item"
        return Gm.config.getConst(itemId)
    },
    updateView(){
        Gm.ui.getConstIcon(this.getNeedId(),(sp)=>{
            this.needSpr.spriteFrame = sp
        })

        Func.destroyChildren(this.scrollView.content)

        var list = Gm.pictureData.getData(this.openData.treasure).heroInfo
        list.sort((a,b)=>{
            if ((a.hp == 0 && b.hp == 0) || (a.hp != 0 && b.hp != 0)){
                if (b.level == a.level){
                    var confA = Gm.config.getHero(a.baseId,a.qualityId)
                    var confB = Gm.config.getHero(b.baseId,b.qualityId)
                    if (confA.quality == confB.quality){
                        if (confB.camp == confA.camp){
                            return confA.idGroup - confB.idGroup
                        }
                        return confB.camp - confA.camp
                    }else{
                        return confB.quality - confA.quality
                    }
                    return -1
                }else{
                    return b.level - a.level
                }
            }else {
                return a.hp==0?-1:1
            }
        })

        this.items = []

        Gm.ui.simpleScroll(this.scrollView,list,function(itemData,tmpIdx){
            var item = cc.instantiate(this.PictureHeroHeadItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("PictureHeroHeadItem")
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
            return item
        }.bind(this))

        // for (let index = 0; index < list.length; index++) {
        //     var item = cc.instantiate(this.PictureHeroHeadItem)
        //     item.active = true
        //     this.scrollView.content.addChild(item)
        //     var itemSp = item.getComponent("PictureHeroHeadItem")
        //     itemSp.setData(list[index],this)
        //     this.items.push(itemSp)
        // }
        this.updateNeed()
    },
    updateNeed(){
        var deadNum = Gm.pictureData.getDeadNum(this.openData.treasure)
        this.numLab.string = Gm.bagData.getNum(this.getNeedId())
    },
    onReviveAll(){
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            v.setDead(false)
        }
        this.updateNeed()
    },
    onOkBtn(){
        if(Gm.pictureData.getDeadNum(this.openData.treasure) == 0){
            Gm.floating(2334)
            return
        }
        if (!Gm.userInfo.checkCurrencyNum({attrId:this.getNeedId(),num:1})){
            return
        }
        // if (Gm.bagData.getNum(this.getNeedId()) == 0){
        //     Gm.floating(3012)
        //     return
        // }

        Gm.box({msg:Ls.get(2336)},(btnType)=>{
            if (btnType == 1){
                Gm.gamePlayNet.reviveAll(this.openData.treasure)
            }
        })

    },
});

