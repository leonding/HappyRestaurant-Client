var BaseView = require("BaseView")
var MAX_LV = 100
cc.Class({
    extends: BaseView,
    properties: {
        valueNodes:{
            default: [],
            type: cc.Node,
        },
        lvLab:cc.Label,
        barLab:cc.Label,
        bar:cc.ProgressBar,
        barTopSpr:cc.Node,
        EquipUpgradeItem:cc.Node,
        scrollView:cc.ScrollView,
        toggleNode:cc.Node,

        buttonsNode:cc.Node,
        consumeUI:require("ConsumeUI"),
        oneKeyBtn:cc.Button,
        oenBtnSpr:cc.Sprite,
        oneBtnLab:cc.Label,
        okBtn:cc.Button,

        maxNode:cc.Node,
        tipsNode:cc.Node,
    },
    onLoad () {
        this.consumeData = Func.itemSplit(Gm.config.getConst("suit_eat_one_exp_cost"))[0]
        this._super()
    },
    onEnable(){
        this._super()
    },
    getProgress(progress){
        if (progress >0 && progress < 35/637){
            return progress + 35/637
        }
        return progress
    },
    updateView(owner){
        this.owner = owner
        var currConf = Gm.config.getEquip(this.owner.equip.baseId)
        this.maxExp = currConf.suitUpExp
        Gm.equipNet.nextEquipId = currConf.levelUpEquip

        


        this.bar.progress = this.getProgress(this.owner.equip.suitExp/this.maxExp)
        this.buttonsNode.active = currConf.levelUpEquip > 0
        this.maxNode.active = currConf.levelUpEquip == 0

        var primarys = EquipFunc.getEquipPrimarys(this.owner.equip)

        var nextConf
        if (currConf.levelUpEquip > 0){
            nextConf = Gm.config.getEquip(currConf.levelUpEquip)
            this.lvLab.string = Ls.lv() + nextConf.level
        }else{
            this.lvLab.string = Ls.lv() + currConf.level
        }
        for (let index = 0; index < this.valueNodes.length; index++) {
            var baseNode = this.valueNodes[index]
            var lab1 = baseNode.getChildByName("lab1").getComponent(cc.Label)
            var lab2 = baseNode.getChildByName("lab2").getComponent(cc.Label)
            var equipChangeLable = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            var primarysIndex = index
            var attrData = primarys[primarysIndex].attrData;
            lab1.string =  EquipFunc.getBaseIdToName(attrData.attrId)
            lab2.string = EquipFunc.getBaseIdToNum(attrData.attrId,attrData.attrValue) 

            if (nextConf){
                var nextData = Func.forBy(nextConf.mainAttr,"AttriID",attrData.attrId)
                var addNum = EquipFunc.getStrengthenAddNum(nextConf.level,this.owner.equip.strength,attrData.attrId)
                equipChangeLable.setNum(nextData.value+addNum,attrData.attrValue)
            }else{
                equipChangeLable.hideArrow()
            }
        }

        this.updateCostList(0)
    },
    onToggleContainerClick(sender){
        var i = 0
        for (let index = 0; index < this.toggleNode.children.length; index++) {
            const v = this.toggleNode.children[index];
            if (v.getComponent(cc.Toggle).isChecked){
                i = index
            }
        }
        this.updateCostList(i)
    },
    updateCostList(index){
        var sps = Gm.bagData.getItemsByType(104)
        this.itemDatas = []
        if (index == 0){
            this.itemDatas = sps
        }else{
            for (let i = 0; i < sps.length; i++) {
                const v = sps[i];
                var itemConf = Gm.config.getItem(v.baseId)
                var equipConf = Gm.config.getEquip(itemConf.equip)
                if (equipConf.jobLimit == 0 || equipConf.jobLimit == index){
                    this.itemDatas.push(v)
                }
            }
        }

        this.itemDatas.sort(function(a,b){
            if (a.count == b.count){
                var item1 = Gm.config.getItem(a.baseId)
                var item2 = Gm.config.getItem(b.baseId)
                return item1.train_exp - item2.train_exp
            }
            return a.count - b.count
        })

        if (index == 0){
            var list = Gm.bagData.getItemsByType(134)
            if (list.length > 0){
                this.itemDatas.unshift(list[0])
            }
        }
        this.tipsNode.active = this.itemDatas.length == 0

        this.removeAllPoolItem(this.scrollView.content)

        this.itemBoxs = []
        for (var i = 0; i < this.itemDatas.length; i++) {
            var item = this.getPoolItem()
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("EquipUpgradeItem")
            itemSp.setData(this.itemDatas[i],this)
            this.itemBoxs.push(itemSp)
        }
        this.onItemClick()
    },
     //子类继承
    getBasePoolItem(){
        return this.EquipUpgradeItem
    },
    onItemClick(item){
        var addExp = 0
        for (var i = 0; i < this.itemBoxs.length; i++) {
            var v = this.itemBoxs[i]
            addExp = addExp + v.getExp()
        }
        this.sumExp  = addExp + this.owner.equip.suitExp
        this.consumeNum = this.consumeData.num * addExp

        this.okBtn.interactable = addExp > 0
        this.consumeUI.node.active = addExp > 0
        this.consumeUI.setData({id:this.consumeData.id,need:this.consumeNum})
        this.setOneChoice(addExp > 0)
        

        if (item == null && addExp > 0){
            Gm.floating(cc.js.formatStr(Ls.get(5294),addExp))
        }

        this.barLab.string = cc.js.formatStr("%s/%s",this.sumExp,this.maxExp)
        this.barTopSpr.active = true
        if (addExp > 0){
            this.barTopSpr.width = Math.min(this.getProgress(this.sumExp/this.maxExp),1)*637    
        }else{
            this.barTopSpr.width = 0
        }
    },
    setOneChoice(is){
        this.isOne = is
        this.oneBtnLab.string = Ls.get(is?50093:5183)
        var str = is?"button_btn_hua4":"button_btn_hua2"
        Gm.load.loadSpriteFrame("img/button/" + str,(sp,owner)=>{
            owner.spriteFrame = sp
        },this.oenBtnSpr)
    },
    onOneKeyClick(){
        this.setOneChoice(!this.isOne)
        if (!this.isOne){
            this.clearSelect()
            return
        }

        var needExp = this.maxExp - (this.owner.equip.suitExp || 0)
        var nowExp = 0
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            var exp = v.conf.train_exp
            var needNum = Math.ceil(needExp/exp)
            if (needNum >= v.data.count){
                v.setSelectNum(v.data.count)
                needExp = needExp - (v.data.count * v.conf.train_exp)
            }else{
                v.setSelectNum(needNum)
                needExp = 0
            }
            if (needExp <=0){
                break
            }
        }
        this.onItemClick()
        if (this.sumExp - this.owner.equip.suitExp == 0){
            Gm.floating(8300003)
        }
    },
    clearSelect(){
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            v.setSelectNum(0)
        }
    },
    isAddExpFull(){
        return this.sumExp >= this.maxExp
    },
    onBtn(){
        if(this.owner.conf.levelUpEquip > 0){
            var list = []
            for (let index = 0; index < this.itemBoxs.length; index++) {
                const v = this.itemBoxs[index];
                if (v.stoneNum > 0){
                    list.push({baseId:v.data.baseId,count:v.stoneNum})
                }
            }
            if (list.length == 0){
                return
            }

            if (!Gm.userInfo.checkCurrencyNum({attrId:this.consumeData.id,num:this.consumeNum})){
                return
            }


            Gm.equipNet.suitUp(this.owner.hero,this.owner.equip.equipId,list)
        }
    },
});

