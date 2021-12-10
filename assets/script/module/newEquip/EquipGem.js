var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        //宝石
        EquipGemListItem:cc.Node,
        currGemNodes:cc.Node,
        currGemScroll: {
        	default: null,
        	type: cc.ScrollView
        },
        unwearGemBtn:cc.Button,
        // guide
        baseInfoNode:cc.Node,
        currGemNode:cc.Node,
        m_oBlankTipNode:cc.Node,//空白页提示              
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    updateView(owner){
        this.owner = owner
        this.owner.equip.gemInfos.sort(function(a,b){
            return a.pos - b.pos
        })
        if (this.currGemNodes.children.length == 0){
            this.gemsNodes = []
            for (let index = 0; index < 4; index++) {
                var item = cc.instantiate(this.EquipGemListItem)
                item.active = true
                this.currGemNodes.addChild(item)
                this.gemsNodes.push(item.getComponent("EquipGemListItem"))
            }
        }
        var btnState = false
        for (let index = 0; index < this.owner.equip.gemInfos.length; index++) {
            const v = this.owner.equip.gemInfos[index];
            this.gemsNodes[v.pos].setGemData(v,this)
            if (!btnState && v.gemItemId > 0){
                btnState = true
            }
        }
        this.unwearGemBtn.interactable = btnState

        Func.destroyChildren(this.currGemScroll.content)

        this.hasChildType = []
        for (let index = 0; index < this.owner.equip.gemInfos.length; index++) {
            const v = this.owner.equip.gemInfos[index];
            if (v.gemItemId >0){
                this.hasChildType.push({childType:Gm.config.getItem(v.gemItemId).childType,level:Gm.config.getGem(v.gemItemId).level})
            }
        }

        var items = Gm.bagData.getGemByPart(this.owner.conf.part)
        Gm.bagData.itemSort(items)
        for (let index = 0; index < items.length; index++) {
            const itemData = items[index];
            var con = Gm.config.getItem(itemData.baseId)
            var gemConf = Gm.config.getGem(itemData.baseId)

            var hasData = Func.forBy(this.hasChildType,"childType",con.childType)
            if (hasData && gemConf.level <= hasData.level){
                continue
            }
            var sItem = cc.instantiate(this.EquipGemListItem)
            sItem.active = true
            this.currGemScroll.content.addChild(sItem)
            var sp = sItem.getComponent("EquipGemListItem")
            sp.setData(itemData,this)
        }
        this.currGemScroll.scrollToTop()
        this.checkBlank(items)
    },
    
    onGemUnwearBtn(){
        Gm.audio.playEffect("music/18_gem_release")
        Gm.equipNet.waerGem(this.owner.hero,this.owner.equip.equipId,3,0,0)
    },
    onGemItemClick(itemData){
        if (itemData.gemItemId == -1){
            var unlockNum = 0
            for (let index = 0; index < this.gemsNodes.length; index++) {
                const v = this.gemsNodes[index];
                if (v.isUnlock()){
                    unlockNum = unlockNum +1
                }
            }
            var num = Gm.config.getConst("punch_deplete_"+(unlockNum+1))
            Gm.box({msg:cc.js.formatStr(Ls.get(1532),num),title:Ls.get(1533)},(btnType)=>{
                if (btnType== 1){
                    if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:num})){
                        Gm.equipNet.openGem(this.owner.hero,this.owner.equip.equipId)
                    }
                }
            })
        }else if (itemData.gemItemId > 0){
            Gm.audio.playEffect("music/17_gem_wear")
            Gm.equipNet.waerGem(this.owner.hero,this.owner.equip.equipId,2,0,itemData.pos)
        }
    },
    onGemListClick(item){
        if (item.gemData){
            this.onGemItemClick(item.gemData)
            return
        }

        


        var itemData = item.data

        var con = Gm.config.getItem(itemData.baseId)
        var gemConf = Gm.config.getGem(itemData.baseId)

        var hasData = Func.forBy(this.hasChildType,"childType",con.childType)
        if (hasData && gemConf.level > hasData.level){
            Gm.floating(Ls.get(5297))
            return
        }

        var pos = -1
        for (let index = 0; index < this.gemsNodes.length; index++) {
            const v = this.gemsNodes[index];
            if (v.gemData.gemItemId == 0){
                pos = v.gemData.pos
                break
            }
        }
        if (pos == -1){
            return
        }
        Gm.audio.playEffect("music/17_gem_wear")
        Gm.equipNet.waerGem(this.owner.hero,this.owner.equip.equipId,1,itemData.id,pos)
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },        
});

