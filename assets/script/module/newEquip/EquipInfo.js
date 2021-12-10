var BaseView = require("BaseView")
var GEM_VIEW_ID = 100003
var GODLY_VIEW_ID = 100002
cc.Class({
    extends: BaseView,

    properties: {
        //详情
        infoBaseNode:cc.Node,
        infoGodlyNode:cc.Node,
        infoGemNode:cc.Node,
        infoRuneNode:cc.Node,

        godlyTipsLab:cc.Label,
        gemTipsLab:cc.Label,

        wearBtn:cc.Button,
        unwearBtn:cc.Button,
        smeltBtn:cc.Button,
    },
    onLoad () {
        this._super()

        this.gems = []
        for (let index = 1; index <= 4; index++) {
            var gemItemNode = this.infoGemNode.getChildByName("node"+index).getChildByName("icon")
            gemItemNode.active = true
            var itemSp = Gm.ui.getNewItem(gemItemNode)
            itemSp.node.scale = gemItemNode.width/itemSp.node.width
            this.gems.push(itemSp)
        }
    },
    onEnable(){
        this._super()
    },
    updateView(owner){ //基础
        this.owner = owner
        cc.log(this.owner.equip)

        var isHero = this.owner.hero?true:false
        this.wearBtn.node.active = isHero
        this.unwearBtn.node.active = isHero

        this.smeltBtn.node.active = !isHero

        if (this.owner.isOther()){
            this.wearBtn.node.active = false
            this.unwearBtn.node.active = false
            this.smeltBtn.node.active = false
        }

        var primarys = EquipFunc.getEquipPrimarys(this.owner.equip)
        for (let index = 0; index < 4; index++) {
            var baseNode = this.infoBaseNode.getChildByName("node" +(index+1))
            if (primarys[index]){
                baseNode.active = true
                var attrData = primarys[index].attrData
                baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.attrId)
                baseNode.getChildByName("lab2").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrData.attrId,attrData.attrValue) 
            }else{
                baseNode.active = false
            }
        }
        
        //神器
        this.godlyTipsLab.string = ""
        if (!Func.isUnlock(GODLY_VIEW_ID)){
            var config = Gm.config.getViewById(GODLY_VIEW_ID)
            this.godlyTipsLab.string = config.tips
            this.infoGodlyNode.getChildByName("node1").active = false
            this.infoGodlyNode.getChildByName("node2").active = false
        }

        var  colorStr = "%s%s"//<color=#8B5F5F>%s%s</c>
        for (let index = 0; index < this.owner.equip.godlyAttr.length; index++) {
            const v = this.owner.equip.godlyAttr[index];
            var godlyConf = Gm.config.getGodly(v.level,v.attrId)

            var baseNode = this.infoGodlyNode.getChildByName("node" +(index+1))
            baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getGodlyName(godlyConf)
            baseNode.getChildByName("lvLab").getComponent(cc.Label).string = cc.js.formatStr("Lv.%s",v.level) 

            
            var idStr = EquipFunc.getBaseIdToName(godlyConf.attributeId)
            var valueStr = "  +0"

            if(v.level > 0){
                valueStr = "  +" + EquipFunc.getBaseIdToNum(godlyConf.attributeId,godlyConf.attributeValue) 
                // valueStr = cc.js.formatStr("<color=#08A300>%s</c>",valueStr)
            }
            
            baseNode.getChildByName("lab2").getComponent(cc.RichText).string = cc.js.formatStr(colorStr, idStr,valueStr)
        }
        
        //宝石
        for (let index = 1; index <= 4; index++) {
            this.infoGemNode.getChildByName("node" + (index)).active = false
        }
        this.gemTipsLab.string = ""

        var gemIndex = 0
        for (let index = 0; index < this.owner.equip.gemInfos.length; index++) {
            const v = this.owner.equip.gemInfos[index];
            var baseNode = this.infoGemNode.getChildByName("node" +(gemIndex+1))
            if (v.gemItemId >0){
                baseNode.active = true
                var gemCon = Gm.config.getGem(v.gemItemId)
                baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(gemCon.attrId)
                baseNode.getChildByName("lab2").getComponent(cc.Label).string = "+"+EquipFunc.getBaseIdToNum(gemCon.attrId,gemCon.value) 


                this.gems[gemIndex].updateItem({baseId:v.gemItemId})
                gemIndex = gemIndex+ 1
            }else{
                baseNode.active = false
            }
        }
        if (gemIndex == 0){
            if (Func.isUnlock(GEM_VIEW_ID)){
                this.gemTipsLab.string = Ls.get(1531)
            }else{
                var config = Gm.config.getViewById(GEM_VIEW_ID)
                this.gemTipsLab.string = config.tips
            }
        }

        //附魔
        this.infoRuneNode.active = this.owner.equip.runeId >0
        if (this.infoRuneNode.active){
            var sum = 0
            if (this.owner.hero){
                for (let index = 0; index < this.owner.hero.equipInfos.length; index++) {
                    const v = this.owner.hero.equipInfos[index];
                    if (v.runeId == this.owner.equip.runeId){
                        sum = sum + 1
                    }
                }
            }
            var suitConf = Gm.config.getSuit(this.owner.equip.runeId)

            var strs = [Ls.get(5040),Ls.get(5041),Ls.get(5042)]
            for (let index = 1; index <= 3; index++) {
                var baseNode = this.infoRuneNode.getChildByName("node"+index)
                var attr = suitConf["equipmentEffect" + (index*2)]
                var attrData = attr[0]
                var lab1 = baseNode.getChildByName("lab1").getComponent(cc.Label)
                lab1.string = EquipFunc.getBaseIdToName(attrData.id)
                var lab2 = baseNode.getChildByName("lab2").getComponent(cc.RichText)
                lab2.string = "+"+ EquipFunc.getBaseIdToNum(attrData.id,attrData.value) 
                if (sum/2 >= index){
                    lab2.node.color = cc.color(8,163,0)
                }else{
                    lab2.node.color = cc.color(139,95,95)
                }
            }
        }
    },
    onWearClick(){
        this.owner.onWearClick()
    },
    onUnwearClick(){
        this.owner.onUnwearClick()
    },
    onSmeltClick(){
        this.owner.onSmeltClick()
    },
});

