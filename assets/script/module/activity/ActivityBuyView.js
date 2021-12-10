var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        awardItem:cc.Node,
        numLab:cc.Label,
        okLab:cc.Label,
        descLab:cc.Label,
        descLabCenterYPos:0.0,
        scrollView: cc.ScrollView
    },
    onLoad(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.conf = Gm.config.getEventPayRewardId(args)
            this.updateView()
        }
    },
    updateView(){
        this.popupUI.setData({title:this.conf.name})
        this.descLab.string = ""

        var award
        // if (this.conf.id == AtyFunc.PAY_CZJI || this.conf.id == AtyFunc.PAY_ZJLB){
        //     this.descLab.string = this.conf.name
        // }else 
        if (this.conf.childType == AtyFunc.TYPE_MONTH_CARD){
            if (AtyFunc.isPay(this.conf.id)){
                award = this.conf.reward
            }else{
                award = this.conf.battlePassReward
            }
        }else{
            award = this.conf.reward
            if(this.conf.childType == AtyFunc.TYPE_NORMAL_DOAMIND){
                award = Func.copyArr(award)
                var payConf = Gm.config.getPayProductAtyId(this.conf.id)
                if (!Gm.userInfo.getHasPayId(payConf.itemId)){
                    var newAward = {}
                    newAward.num = payConf.firstGift
                    newAward.id = ConstPb.playerAttr.GOLD
                    newAward.type = ConstPb.itemType.TOOL

                    award.push(newAward)
                }
            }
        }
        award = Func.dataMerge([],award)
        if (award){
            if (AtyFunc.isPay(this.conf.id) && AtyFunc.getPrice(this.conf.id) > 0){
                award.push({type:ConstPb.itemType.TOOL,id:ConstPb.playerAttr.VIP_EXP,num:AtyFunc.getVipExp(this.conf.id)})                
            }
            Gm.ui.simpleScroll(this.scrollView,award,function(tmpData,tmpIdx){
                var item = cc.instantiate(this.awardItem)
                item.active = true
                this.scrollView.content.addChild(item)
                
                var sp = Gm.ui.getNewItem(item.getChildByName("itemNode"))
                var conf = sp.setData(tmpData)
                if(this.conf.childType == AtyFunc.TYPE_NORMAL_DOAMIND ){
                    sp.setDiamondIcon()
                }
                var lab = item.getChildByName("lab").getComponent(cc.Label)

                lab.string = conf.name + tmpData.num
                cc.log(tmpIdx,award.length)
                if (tmpIdx == award.length){
                    item.getChildByName("fgtNode").active = false
                }
                return item
            }.bind(this))
            // for (let index = 0; index < award.length; index++) {
            //     const v = award[index];

            //     var item = cc.instantiate(this.awardItem)
            //     item.active = true
            //     this.scrollView.content.addChild(item)
                
            //     var sp = Gm.ui.getNewItem(item.getChildByName("itemNode"))
            //     var conf = sp.setData(v)
            //     if(this.conf.childType == AtyFunc.TYPE_NORMAL_DOAMIND ){
            //         sp.setDiamondIcon()
            //     }
            //     var lab = item.getChildByName("lab").getComponent(cc.Label)

            //     lab.string = conf.name + v.num
            //     if (index == award.length -1){
            //         item.getChildByName("fgtNode").active = false
            //     }
            // }
        }
        if (this.conf.quota == 0){
            this.numLab.string = Ls.get(5300)
        }else{
            var str = ""
            if (AtyFunc.isPay(this.conf.id)){
                this.okLab.string = AtyFunc.getPriceStr(this.conf.id)
                str = Ls.get(5301)
            }else{
                this.okLab.string = Ls.get(30003)
                str = Ls.get(5302)
                if (this.conf.childType == AtyFunc.TYPE_MONTH_CARD){
                    str = Ls.get(5303)
                }
            }
            this.numLab.string = cc.js.formatStr(Ls.get(str),this.conf.quota)
        }
        
    },
    onOkBtn(){
        AtyFunc.checkBuy(this.conf.id)
    },
    setDescLabCenterY(){
        this.desLabTopPosY = this.descLab.node.y
        this.descLab.node.y = this.descLabCenterYPos
    },
    onDisable(){
        if(this.desLabTopPosY){
            this.descLab.node.y = this.desLabTopPosY
            this.desLabTopPosY = null
        }
    },
});

