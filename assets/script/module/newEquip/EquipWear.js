var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        EquipWearListItem:cc.Node,
        scrollView:{
        	default: null,
        	type: cc.ScrollView
        },
        //穿装备
        newNode:cc.Node,
        itemNode:cc.Node,
        nameLab:cc.Label,
        zyLab:cc.Label,
        scoreLab:cc.Label,
        primarysNode:cc.Node,

        //换装
        changeNode:cc.Node,
        lastPrimarysNode:cc.Node,
        changePrimarysNode:cc.Node,

        backBtn:cc.Node,
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    updateView(owner){
        this.owner = owner
        this.changeWearList()
    },
    updateNextView(){
        this.backBtn.active = false
        this.newNode.active = false
        this.changeNode.active = false

        if(this.owner.equip == null){
            this.newNode.active = true
            if (this.itemBase == null){
                this.itemBase = Gm.ui.getNewItem(this.itemNode)
            }
            this.conf = Gm.config.getEquip(this.nextEquip.baseId)
            this.itemBase.updateEquip(this.nextEquip)
            this.nameLab.string = this.conf.name
    
            this.zyLab.string = Gm.config.getJobType(this.conf.jobLimit).childTypeName
            this.scoreLab.string = this.nextEquip.score

            EquipFunc.equipCommonBaseView(this.primarysNode,this.nextEquip)
        }else{
            this.backBtn.active = true
            this.changeNode.active = true

            var nowConf = Gm.config.getEquip(this.owner.equip.baseId)

            EquipFunc.equipCommonBaseViewConf(this.lastPrimarysNode,nowConf.mainAttr)

            
            if (this.nextEquip == null){
                for (let index = 0; index < 4; index++) {
                    var baseNode = this.changePrimarysNode.getChildByName("node" +(index+1))
                    baseNode.active = false
                }
                return
            }
            var nextConf = Gm.config.getEquip(this.nextEquip.baseId)

            var lastPrimarys = nowConf.mainAttr
            
            var nextPrimarys = nextConf.mainAttr
            for (let index = 0; index < nextPrimarys.length; index++) {
                const v = nextPrimarys[index];
                var has = Func.forBy(lastPrimarys,"AttriID",v.AttriID)
                if (has){
                    v.has = true
                }else{
                    v.has = false
                }
            }
            
            nextPrimarys.sort(function(a,b){
                if (a.has == b.has){
                    return a.AttriID - b.AttriID    
                }
                return a.has?-1:1
            })
            EquipFunc.equipCommonBaseViewConf(this.changePrimarysNode,nextPrimarys)
            for (let index = 0; index < 4; index++) {
                var baseNode = this.changePrimarysNode.getChildByName("node" +(index+1))
                if (nextPrimarys[index]){
                    var attrData = nextPrimarys[index]
                    var equipChangeLable = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")

                    var lastNum = 0
                    var has = Func.forBy(lastPrimarys,"AttriID",attrData.AttriID)
                    if (has){
                        lastNum = has.value
                    }
                    equipChangeLable.setNum(attrData.value,lastNum,attrData.AttriID)
                }else{
                    baseNode.active = false
                }
            }
        }

    },
    forBy(list,id){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.attrData.attrId == id){
                return v.attrData
            }
        }
        return null
    },
    onItemClick(item){
        if (this.lastItem){
            if (this.lastItem != item){
                this.lastItem.setCheck(false)
            }
        }
        this.lastItem = item

        this.nextEquip = null
        for (let index = 0; index < this.wearList.length; index++) {
            const v = this.wearList[index];
            if (v.isCheck()){
                this.nextEquip = v.data
                break
            }
        }
        this.updateNextView()
    },
    changeWearList(){
        var items = Gm.bagData.getEquipsByPart(this.owner.part,Gm.config.getHero(this.owner.hero.baseId).job)
        items.sort(function(a,b){
            return b.score - a.score
        })
        Func.destroyChildren(this.scrollView.content)
        if (items.length == 0){
            this.onBackView()
            return
        }
        this.wearList = []
        for (let index = 0; index < items.length; index++) {
            const itemData = items[index];
            var item = cc.instantiate(this.EquipWearListItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("EquipWearListItem")
            itemSp.setData(itemData,this)
            this.wearList.push(itemSp)
        }

        this.scrollView.scrollToTop()
        if (this.wearList[0]){
            if (this.owner.equip == null || (this.wearList[0].data.score > this.owner.equip.score)){
                this.wearList[0].setCheck(true)
                return
            }
        }
        this.onItemClick()
    },
    onWearEquipBtn(){
        if(this.nextEquip == null){
            return
        }
        if (EquipFunc.isCanInherit(this.owner.equip,this.nextEquip)){
            var dd = {msg:Ls.get(1546),btnNum:2}
            dd.ok = Ls.get(1547)
            dd.cancel = Ls.get(1548)
            Gm.box(dd,(btnType)=>{
                if (btnType == 1){
                    // Gm.equipNet.inherit(this.owner.hero,this.owner.equip.equipId,this.nextEquip.equipId)
                    Gm.equipNet.wear(this.owner.hero,[this.nextEquip.equipId],0,true)
                }else{
                    Gm.equipNet.wear(this.owner.hero,[this.nextEquip.equipId])
                }
            })
            return
        }
        Gm.equipNet.wear(this.owner.hero,[this.nextEquip.equipId])
    },
    isRed(equip){
        return this.owner.hero && (this.owner.equip == null || equip.score > this.owner.equip.score)
    },
    onBackView(){
        this.owner.onWearClick()
    },
});

