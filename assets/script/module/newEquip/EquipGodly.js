var BaseView = require("BaseView")
var godlyTypeToItem = [0,117,118]
cc.Class({
    extends: BaseView,
    properties: {
        //神器
        EquipGodlyListitem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        godlyBar:{
            default: [],
            type: require("EquipGodlyBarItem"),
        },
        oenBtnSpr:cc.Sprite,
        oneBtnLab:cc.Label,
        toggle1:cc.Toggle,
        toggle2:cc.Toggle,
        devourBtn:cc.Button,
        // guide
        baseInfoNode:cc.Node,
        currGemNode:cc.Node,
        m_oBlankTipNode:cc.Node,//空白页提示            
    },
    onLoad () {
        var ws = Gm.config.getItemsByType(117)
        ws = ws.concat(Gm.config.getItemsByType(118))
        this.stoneConfList = ws

        this.toggle1.godlyType = 1
        this.toggle2.godlyType = 2

        this.isLoad = true
        this._super()
    },
    onEnable(){
        this._super()
    },
    setOneChoice(is){
        this.isOne = is
        this.oneBtnLab.string = Ls.get(is?50093:5183)
        var str = is?"button_btn_hua4":"button_btn_hua2"
        Gm.load.loadSpriteFrame("img/button/" + str,(sp,owner)=>{
            owner.spriteFrame = sp
        },this.oenBtnSpr)
        
    },
    updateView(owner){
        this.owner = owner
        Func.destroyChildren(this.scrollView.content)
        
        for (let index = 0; index < this.owner.equip.godlyAttr.length; index++) {
            const v = this.owner.equip.godlyAttr[index];
            this.godlyBar[index].setData(v,this)
        }

        this.itemBoxs = []
        for (let index = 0; index < this.stoneConfList.length; index++) {
            const itemConf = this.stoneConfList[index];
            var itemData = Gm.bagData.getItemByBaseId(itemConf.id)
            if (itemData){
                var item = cc.instantiate(this.EquipGodlyListitem)
                item.active = true
                this.scrollView.content.addChild(item)
                var sp = item.getComponent("EquipGodlyListitem")
                sp.setData(itemData,this)
                this.itemBoxs.push(sp)
            }
        }
        this.scrollView.scrollToTop()

        this.setOneChoice(false)

        this.checkBlank(this.itemBoxs)
        if (!this.isLoad){
            return
        }
        for (let index = 1; index <= 2; index++) {
            var toggle = this["toggle" + index]
            const v = this.godlyBar[index-1];
            if (!v.isMaxLevel() && v.godlyConf.godlyType == index){
                toggle.isChecked = true
            }
        }
        this.isLoad = false
    },
    onItemClick(item){
        var sumConsume = 0
        var sumExp = 0
        for (let index = 0; index < this.godlyBar.length; index++) {
            const v = this.godlyBar[index];
            var attrId = v.godlyData.attrId

            var selectData = this.getSelectData(attrId)
            v.updateAddExp(selectData.exp)
            v.updateConsume(selectData.consume)
            sumConsume = sumConsume + selectData.consume
            sumExp = sumExp + selectData.exp
        }
        this.godlyBar[0].setSumConsume(sumConsume)
        this.godlyBar[1].setSumConsume(sumConsume)

        this.devourBtn.interactable = sumConsume > 0
        this.setOneChoice(sumConsume > 0)

        if (item == null){
            Gm.floating(cc.js.formatStr(Ls.get(5294),sumExp))
        }
    },
    getSelectData(attrId){
        var data = {exp:0,consume:0}
        var godly_stone_devour_cost = Gm.config.getConst("godly_stone_devour_cost")
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            if (v.stoneNum > 0){
                var stoneType = Func.indexOf(godlyTypeToItem,v.conf.type)
                if(Gm.config.getGodly(0,attrId).godlyType == stoneType){
                    data.exp = data.exp + v.getExp()
                    data.consume = data.consume + (v.getExp()*godly_stone_devour_cost)
                }
            }
        }
        return data
    },
    onToggle(sender,value){
        sender.node.godlyType = checkint(value)
        var icon = sender.node.getChildByName("icon")
        icon.x = sender.isChecked?22:-22
        if (sender.isChecked){
            Gm.audio.playEffect("music/03_popup_close")
        }else{
            Gm.audio.playEffect("music/02_popup_open")
        }

        if(sender.isChecked){
            for (let index = 0; index < this.godlyBar.length; index++) {
                const v = this.godlyBar[index];
                if (v.isMaxLevel() && v.godlyConf.godlyType == value){
                    sender.isChecked = false
                    Gm.floating(Ls.get(5295))
                }
            }
        }
    },
    clearSelect(){
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            v.setSelectNum(0)
        }
    },
    onOneBtn(){
        this.setOneChoice(!this.isOne)
        if (!this.isOne){
            this.clearSelect()
            return
        }
        var godlyType = 0
        if (this.toggle1.isChecked && (this.toggle1.isChecked == this.toggle2.isChecked)){
            godlyType = 3
        }else if (this.toggle1.isChecked){//无双
            godlyType = 1
        }else if (this.toggle2.isChecked){//传说
            godlyType = 2
        }

        if (godlyType == 0){
            this.setOneChoice(!this.isOne)
            Gm.floating(Ls.get(5296))
            return
        }

        var exps = [0,0,0]
        var flags = [0,0,0]
        for (let i = 0; i < this.godlyBar.length; i++) {
            const barItem = this.godlyBar[i];
            flags[i+1] = barItem.isUpLevel(exps[i])
        }

        var addStone = (type)=>{
            var godlyIndex = type
            if (flags[godlyIndex]){
                return
            }
            var bar = this.godlyBar[godlyIndex-1]
            var needExp = bar.getUpNeedExp() - exps[godlyIndex]

            var stoneItem = this.getStoneItem(type)
            for (let index = 0; index < stoneItem.length; index++) {
                const v = stoneItem[index];
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
        }

        if(godlyType > 0){
            if (godlyType == 3){
                addStone(1)
                addStone(2)
            }else{
                addStone(godlyType)
            }
        }
        this.onItemClick()
        
    },
    getStoneItem(godlyType){
        var list = []
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            if (v.conf.type == godlyTypeToItem[godlyType]){
                list.push(v)
            }
        }
        list.sort(function(a,b){
            return a.conf.id - b.conf.id
        })
        return list
    },
    onBtn(){
        var sumConsume = 0
        for (let index = 0; index < this.godlyBar.length; index++) {
            const v = this.godlyBar[index];
            var attrId = v.godlyData.attrId
            var selectData = this.getSelectData(attrId)
            
            sumConsume = sumConsume + selectData.consume
        }
        if (sumConsume == 0){
            return
        }

        if (Gm.userInfo.silver < sumConsume){
            Gm.floating(Ls.get(1538))
            return
        }

        var list = []
        var stoneList = []
        for (let index = 0; index < this.itemBoxs.length; index++) {
            const v = this.itemBoxs[index];
            if (v.stoneNum > 0){
                stoneList.push({itemId:v.data.baseId,count:v.stoneNum})
            }
        }

        if (list.length > 0 || stoneList.length >0){
            Gm.equipNet.devour(this.owner.hero,this.owner.equip.equipId,list,stoneList)
        }
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },      
});

