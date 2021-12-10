var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        //附魔
        runeListItems:{
            default: [],
            type: require("EquipRuneListItem"),
        },
        nowNode:cc.Node,
        nextNode:cc.Node,
        
        needNode:cc.Node,
        needListNode:cc.Node,
        changeNode:cc.Node,
        changeBtnLab:cc.Label,
        m_tips:cc.Node,
        m_tipsLabel:cc.Label,
    },
    onLoad () {
        this.nowNode.itemBase = Gm.ui.getNewItem(this.nowNode.getChildByName("itemNode"))
        this.nextNode.itemBase = Gm.ui.getNewItem(this.nextNode.getChildByName("itemNode"))

        this._super()
    },
    onEnable(){
        this._super()
    },
    updateView(owner){
        this.owner = owner

        if (this.nextItem){
            this.nextItem.setCheck(false)
            this.nextItem = null
        }

        this.nextNode.active = false

        this.updateEnchangt(this.owner.equip.runeId,this.nowNode)

        this.equipConf = Gm.config.getEquip(this.owner.equip.baseId)
        var list = this.equipConf.rune

        for (let index = 0; index < this.runeListItems.length; index++) {
            const v = this.runeListItems[index];
            v.setData(list[index],this)
        }
        this.onRuneItemClick()
    },
    isNowRuleId(runeId){
        return this.owner.equip.runeId == runeId
    },
    isUnlock(runeId){
        return Func.indexOf(this.owner.equip.unlockTune,runeId) >=0
    },
    getOtherEquipNum(runeId){
        var num = 0
        if (this.owner.hero){
            for (let index = 0; index < this.owner.hero.equipInfos.length; index++) {
                const v = this.owner.hero.equipInfos[index];
                if (v.equipId == this.owner.equip.equipId){
                    continue
                }
                if (v.runeId == runeId){
                    num = num + 1
                }
            }
        }
        return num
    },
    updateEnchangt(runeId,node,isNext){
        this.onHideTipsClick()
        var conf = Gm.config.getItem(runeId)
        var suitConf = Gm.config.getSuit(runeId)

        node.getChildByName("nameLab").getComponent(cc.Label).string = suitConf.equipmentName
        node.itemBase.setData({baseId:runeId})
        node.itemBase.node.active = true
        if (node.getChildByName("tipLab")){
            node.getChildByName("tipLab").active = false
        }

        var sum = this.getOtherEquipNum(runeId)
        var addNum = 0
        if (isNext){
            sum = sum + 1
        }else{
            if (this.nextItem){
                if (this.owner.equip.runeId == runeId){
                    addNum = addNum + 1
                }
            }else{
                if (this.owner.equip.runeId == runeId){
                    sum = sum + 1
                }
            }
        }

        var strs = [Ls.get(5040),Ls.get(5041),Ls.get(5042)]
        for (let index = 1; index <= 3; index++) {
            var baseNode = node.getChildByName("node"+index)
            baseNode.getChildByName("bgIcon1").active = false
            baseNode.getChildByName("imgIcon1").active = false
            baseNode.getChildByName("bgIcon2").active = false
            baseNode.getChildByName("imgIcon2").active = false

            baseNode.getChildByName("nameLab").getComponent(cc.Label).string = strs[index-1]

            var attr = suitConf["equipmentEffect" + (index*2)]
            var attrData = attr[0]
            var lab1 = baseNode.getChildByName("lab1").getComponent(cc.Label)
            lab1.string =Func.subName(EquipFunc.getBaseIdToName(attrData.id),6) 
            var lab2 = baseNode.getChildByName("lab2").getComponent(cc.Label)
            lab2.string = "  +"+EquipFunc.getBaseIdToNum(attrData.id,attrData.value) 
            if (sum/2 >= index){
                lab2.node.color = cc.color(255,0,0)
                // if (isNext){
                //     if (sum/2 == index){
                //         baseNode.getChildByName("bgIcon2").active = true
                //         baseNode.getChildByName("imgIcon2").active = true
                //     }
                // }
            }else{
                // if ((sum+addNum)/2 == index){
                //     baseNode.getChildByName("bgIcon1").active = true
                //     baseNode.getChildByName("imgIcon1").active = true
                // }
                lab2.node.color = cc.color(139,95,95)
            }
        }
        
    },
    onRuneItemClick(item){
        if (this.nextItem){
            this.nextItem.setCheck(false)
        }
        this.nextItem = item

        this.needNode.active = false
        this.changeNode.active = false

        if (this.nextItem){
            this.nextItem.setCheck(true)
            this.nextNode.active = true
            this.updateEnchangt(this.owner.equip.runeId,this.nowNode)
            this.updateEnchangt(this.nextItem.data.id,this.nextNode,true)

            if (this.isUnlock(this.nextItem.data.id)){
                this.changeNode.active = true
                this.changeBtnLab.string = Ls.get(5258)
            }else{
                this.needNode.active = true

                Func.destroyChildren(this.needListNode)
                var conf = Gm.config.getSuit(this.nextItem.data.id)
                for (let index = 0; index < conf.costItem.length; index++) {
                    const dd = conf.costItem[index];
                    var itemBase = Gm.ui.getNewItem(this.needListNode)
                    itemBase.node.scale = 0.72
                    itemBase.setData(dd)
                    itemBase.setLabStr("")
                    itemBase.setShowAccess(true)

                    var nn = new cc.Node()
                    nn.addComponent(cc.RichText)
                    var rich = nn.getComponent(cc.RichText)
                    rich.fontSize = 30
                    rich.string = Func.doubleLab(Gm.userInfo.getCurrencyNum(dd.id),dd.num)
                    itemBase.node.addChild(nn)
                    nn.y = -75
                }
            }
        }else{
           this.nextNode.active = true
           this.updateEnchangt(this.owner.equip.runeId,this.nowNode)
           this.changeNode.active = true
           this.changeBtnLab.string = Ls.get(5259)

           this.nextNode.itemBase.node.active = false
           this.nextNode.getChildByName("tipLab").active = true
           this.nextNode.itemBase.setData(null)
           this.nextNode.getChildByName("nameLab").getComponent(cc.Label).string = ""
            for (let index = 1; index <= 3; index++) {
                var baseNode = this.nextNode.getChildByName("node"+index)

                baseNode.getChildByName("nameLab").getComponent(cc.Label).string = "---"

                var lab1 = baseNode.getChildByName("lab1").getComponent(cc.Label)
                lab1.string = "---"
                var lab2 = baseNode.getChildByName("lab2").getComponent(cc.Label)
                lab2.string = ""
            }
            
        }
    },
    onBtn(){
        if (this.nextItem){
            var conf = Gm.config.getSuit(this.nextItem.data.id)
            for (let index = 0; index < conf.costItem.length; index++) {
                const dd = conf.costItem[index];
                if (Gm.userInfo.getCurrencyNum(dd.id) < dd.num){
                    Gm.floating(5051)
                    return
                }
            }
            if (!Gm.userData.isHintDay("runeType") ){
                var currName = Gm.config.getSuit(this.owner.equip.runeId).equipmentName
                var nextName = Gm.config.getSuit(this.nextItem.data.id).equipmentName
                var str = cc.js.formatStr(Ls.get(1542),currName,nextName)

                Gm.box({msg:str,title:Ls.get(1543),showToggle:true},(btnType,isChecked)=>{
                    if (btnType==1){
                        if (isChecked){
                            Gm.userData.setHintDay("runeType")
                        }
                        this.sendRune()
                    }
                })
                return
            }
            this.sendRune()
        }
    },
    onChangeBtn(){
        if(this.nextItem == null){
            return
        }
        this.sendRune()
    },
    sendRune(){
        Gm.equipNet.rune(this.owner.hero,this.owner.equip.equipId,this.nextItem.data.id)
    },

    onShowTipsClick(sender,data){
        var dataArr = data.split('_')
        var suitConf = Gm.config.getSuit(this.owner.equip.runeId)//now
        if(parseInt(dataArr[0]) == 2 && this.nextItem){ //next 
            suitConf = Gm.config.getSuit(this.nextItem.data.id)
        }


        var strs = [Ls.get(5040),Ls.get(5041),Ls.get(5042)]
        var attr = suitConf["equipmentEffect" + (dataArr[1]*2)]
        var attrData = attr[0]
        var str1 = strs[dataArr[1]-1]
        var str2 = EquipFunc.getBaseIdToName(attrData.id)
        var str3 = "  +"+EquipFunc.getBaseIdToNum(attrData.id,attrData.value) 
       
        if( (parseInt(dataArr[0]) == 2 && this.nextItem) || parseInt(dataArr[0]) == 1){
            this.m_tips.x =  sender.target.parent.parent.x -170
            this.m_tips.y =  sender.target.parent.y-50
            this.m_tips.active = true
        }
        str1+= str2 + str3
        this.setTips(str1)

    },

    onHideTipsClick(){
        this.m_tips.active = false
    },

    setTips(str){
        this.m_tipsLabel.string = str
    }
});


