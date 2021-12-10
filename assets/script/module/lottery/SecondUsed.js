var BaseView = require("BaseView")
const items = [200105,200106]
// SecondUsed

cc.Class({
    extends: BaseView,
    properties: {
        m_oItemPerfab:cc.Prefab,
        m_tItemNode:{
            default: [],
            type: cc.Node,
        },
    },
    onLoad(){
        this._super()
        for(const i in this.m_tItemNode){
            var tmpGift = this.m_tItemNode[i].getChildByName("m_oGiftNode")

            var itemSp = Gm.ui.getNewItem(tmpGift)
            var conf = itemSp.updateItem({baseId:items[i]})

            // var conf = Gm.config.getItem(items[i])
            var tmpName = this.m_tItemNode[i].getChildByName("m_oNameLab")
            tmpName.getComponent(cc.Label).string = conf.name

            var tmpInfo = this.m_tItemNode[i].getChildByName("m_oInfoLab")
            tmpInfo.getComponent(cc.Label).string = conf.description
        }
    },
    cheack:function(){
        if (this.activityID){
            var tmpDataAll = Gm.lotteryData.getLottery(this.activityID)
            for(const i in tmpDataAll.fieldArry){
                var tmpData = tmpDataAll.fieldArry[i]
                var tmpHero = Gm.heroData.getHeroByBaseId(tmpData.end)
                var tmpConfig = Gm.config.getHero(tmpData.end)
                var tmpChip = Gm.heroData.getChipNum(tmpData.end)
                if (tmpHero){
                    var tmpTotal = Gm.config.getChipNow(tmpData.end,Gm.config.getQulityHero(tmpHero.qualityId).quality)
                    if (tmpTotal > tmpChip){
                        return true
                    }
                }else{
                    var tmpTotal = tmpConfig.hero_chip_num + Gm.config.getChipNow(tmpData.end,tmpConfig.quality)
                    if (tmpTotal > tmpChip){
                        return true
                    }
                }
            }
        }
        return false
    },
    enableUpdateView:function(args){
        if (args){
            this.activityID = args
            this.m_iUseItem = Gm.lotteryData.getData(args).offerStatus
            this.updateInfo()
        }
    },
    updateInfo:function(){
        for(const i in this.m_tItemNode){
            var tmpBtn = this.m_tItemNode[i].getChildByName("m_oMakeBtn")
            var tmpNum = this.m_tItemNode[i].getChildByName("m_oNumslab")
            var item = Gm.bagData.getItemByBaseId(items[i])
            if (item && item.count){
                tmpNum.getComponent(cc.Label).string = Ls.get(20029)+item.count
            }else{
                tmpNum.getComponent(cc.Label).string = Ls.get(20030)
            }
            if (this.cheack()){
                if (this.m_iUseItem){
                    tmpBtn.getComponent(cc.Button).interactable = false
                    if (this.m_iUseItem == items[i]){
                        var tmpLab = tmpBtn.getChildByName("m_oBtnLab")
                        tmpLab.getComponent(cc.Label).string = Ls.get(20031)
                    }
                }else{
                    tmpBtn.getComponent(cc.Button).interactable = true
                    var tmpLab = tmpBtn.getChildByName("m_oBtnLab")
                    tmpLab.getComponent(cc.Label).string = Ls.get(20032)
                }
            }else{
                tmpBtn.getComponent(cc.Button).interactable = false
                var tmpLab = tmpBtn.getChildByName("m_oBtnLab")
                tmpLab.getComponent(cc.Label).string = Ls.get(20033)
            }
        }
    },
    onUseBtn1:function(){
        if (this.m_iUseItem){
            return
        }
        var item = Gm.bagData.getItemByBaseId(items[0])
        if (item && item.count){
            Gm.cardNet.sendUseOffer(this.activityID,items[0])
        }else{
            Gm.floating(Ls.get(20034))
        }
    },
    onUseBtn2:function(){
        if (this.m_iUseItem){
            return
        }
        var item = Gm.bagData.getItemByBaseId(items[1])
        if (item && item.count){
            Gm.cardNet.sendUseOffer(this.activityID,items[1])
        }else{
            Gm.floating(Ls.get(20034))
        }
    },
});

