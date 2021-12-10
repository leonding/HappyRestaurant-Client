cc.Class({
    extends: cc.Component,
    properties: {
        tipsLab:cc.Label,
        // needRich:cc.RichText,
        itemNode:cc.Node,
        progressbar:cc.ProgressBar,
        topSpr:cc.Sprite,
        barLab:cc.Label,
        
        lab11:cc.Label,
        lab21:cc.Label,
        equipChangeLab11:require("EquipChangeLable"),

        lab12:cc.Label,
        lab22:cc.Label,
        equipChangeLab12:require("EquipChangeLable"),
    },
    setData:function(godlyData,owner){
        this.godlyData = godlyData
        this.owner = owner

        if (this.itemBase == null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.node.scale = this.itemNode.width/this.itemBase.node.width
            this.itemBase.setData({baseId:1002,type:10000})

            var nn = new cc.Node()
            nn.anchorX = 0
            nn.x = 40
            nn.addComponent(cc.RichText)
            var rich = nn.getComponent(cc.RichText)
            rich.fontSize = 22
            this.itemNode.addChild(nn)
            this.needRich = rich
        }

        this.godlyConf = Gm.config.getGodly(godlyData.level,godlyData.attrId)

        this.tipsLab.string = EquipFunc.getGodlyName(this.godlyConf)
        this.lab11.string = Ls.get(800138)
        this.lab21.string = Ls.lv() + godlyData.level

        this.lab12.string = EquipFunc.getBaseIdToName(this.godlyConf.attributeId)
        var value = 0
        if (godlyData.level > 0){
            value = EquipFunc.getBaseIdToNum(this.godlyConf.attributeId,this.godlyConf.attributeValue) 
        }
        this.lab22.string = value

        this.barLab.string = cc.js.formatStr("%s/%s",this.godlyData.exp,this.godlyConf.upExp)
        this.progressbar.progress = this.godlyData.exp/this.godlyConf.upExp
        this.updateAddExp(0)
        this.updateConsume(0,0)
    },
    updateAddExp(addExp){
        this.addExp = addExp
        this.sumExp = this.godlyData.exp+this.addExp

        this.barLab.string = cc.js.formatStr("%s/%s",this.sumExp,this.godlyConf.upExp)
        this.topSpr.node.active = true
        this.topSpr.node.setContentSize(cc.size(Math.min((this.sumExp/this.godlyConf.upExp),1)*655, this.topSpr.node.height))

        this.equipChangeLab11.hideArrow()
        this.equipChangeLab12.hideArrow()
        if (this.isUp() && !this.isMaxLevel() ){
            var nextConf = Gm.config.getGodly(this.godlyData.level+1,this.godlyData.attrId)
            this.equipChangeLab11.setNum(this.godlyData.level+1,this.godlyData.level)
            this.equipChangeLab12.setNum(nextConf.attributeValue,this.godlyConf.attributeValue,this.godlyData.attrId)
        }
    },
    isUp(){
        return this.sumExp >= this.godlyConf.upExp
    },
    getUpNeedExp(){
        return this.godlyConf.upExp - this.godlyData.exp
    },
    updateConsume(num){
        this.itemNode.active = num > 0
        this.consumeNum = num 
        if (num == 0){
            this.needRich.string = ""
        }else{
            this.needRich.string = Func.doubleLab(Gm.userInfo.silver,num)
        }
    },
    setSumConsume(sum){
        if (Gm.userInfo.silver < sum){
            var color = "<color=#ff0000>%s</c><color=#524036>/%s</color>"
            var str = cc.js.formatStr(color,Func.transNumStr(Gm.userInfo.silver),Func.transNumStr(this.consumeNum))
            this.needRich.string = str
        }
    },
    isMaxLevel(){
        return this.godlyData.level == Gm.config.getConst("godly_devour_max_level")
    },
    isUpLevel(exp){
        return this.isMaxLevel() || exp >= this.getUpNeedExp()
    },
});


