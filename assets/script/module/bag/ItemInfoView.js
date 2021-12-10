var BaseView = require("BaseView")
const max_num = 100
// MessageBox
cc.Class({
    extends: BaseView,
    properties: {
        itemIcon:cc.Node,
        descLab:cc.Label,
        numNode:cc.Node,
        numRich:cc.RichText,
        numSlider:cc.Slider,
        btn1:cc.Node,
        btn2:cc.Node,
        btnLab1:cc.Label,
        btnLab2:cc.Label,
        btn3:cc.Node,
        btnLab3:cc.Label,
        boxNode:cc.Node,
        boxSctrollView:cc.ScrollView,
        newItem:cc.Prefab,
        boxItemNode:cc.Node,
        label:cc.Node,
        m_choiceNode:cc.Node,
        m_filterPb:cc.Prefab,
        m_filterNode:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.itemBase = Gm.ui.getNewItem(this.itemIcon)
    },
    onEnable:function(){
        this._super()
    },
    runOpenAction(){
        this.conf = this.itemBase.updateItem(this.openData)
        this.popupUI.setTitle(this.conf.name)
        if(this.conf.type  == ConstPb.propsType.CHOICE_BOX){
            this.tipsNode = this.popupNode.getChildByName("TipsBaseNew")
            this.popupUI.setHeight(this.tipsNode.height)
            this.popupUI.node.y = this.tipsNode.y

            this.itemBase.node.parent = this.boxItemNode
        }
        this._super()
    },
    register:function(){
        this.events[MSGCode.OP_PROPS_USE_S] = this.onNetBagUse.bind(this)
        this.events[MSGCode.OP_CHIP_MAKE_EQUIP_S] = this.onNetChipMake.bind(this)
    },
    onNetBagUse:function(args){
        if (args.opType == 1){
            this.updateNode()
            if (this.itemData.count == 0){
                this.onBack()
            }
        }
    },
    onNetChipMake(args){
        this.onBack()
    },
    enableUpdateView:function(args){
        if (args){
            this.itemData = args
            this.updateNode()
        }
    },
    updateNode:function(){
        if(this.conf.type  == ConstPb.propsType.CHOICE_BOX){
            this.updateBoxNode()
            return
        }
        this.descLab.string = this.conf.description
        this.boxNode.active = false
        this.btn1.active = false
        this.btn2.active = false
        this.btn3.active = false
        this.m_choiceNode.active = false
        this.count = 1

        if (this.conf.open_type == 0){ //关闭
            this.btn3.active = true
            this.btnLab3.string = Ls.get(3008)
        }else if (this.conf.open_type == 1 || this.conf.open_type == 4){ //使用
            // if(this.itemData.count > 1 && this.conf.useMultiple == 1){
            //     this.btn1.active = true
            //     this.btn2.active = true
            //     this.btnLab1.string = Ls.get(3009)
            //     this.btnLab2.string = cc.js.formatStr(Ls.get(3010),Math.min(this.itemData.count,10) )
            // }else{  
            //     this.btn3.active = true
            //     this.btnLab3.string = Ls.get(3009)
            // }
            this.btn3.active = true
            this.btnLab3.string = Ls.get(3009)
            this.numNode.active = true
            this.count = this.itemData.count
            this.setSliderProgress()
        }else if (this.conf.open_type == 3){ //合成
            if (this.conf.type == 2){//宝石合成
                var gemCon = Gm.config.getGem(this.itemData.baseId)
                if (gemCon.level == 10){
                    this.btn3.active = true
                    this.btnLab3.string = Ls.get(3008)
                }else{
                    if (this.itemData.count > 1){
                        this.btn1.active = true
                        this.btn2.active = true
                        this.btnLab1.string = Ls.get(3011)
                        this.btnLab2.string = Ls.get(3015)
                    }else{
                        this.btn3.active = true
                        this.btnLab3.string = Ls.get(3011)
                    }
                }
            }else if(this.conf.type == 999){//武将碎片
                this.btn3.active = true
                if (Gm.heroData.getHeroByBaseId(this.itemData.baseId)){
                    this.btnLab3.string = Ls.get(5200)
                }else{
                    this.btnLab3.string = Ls.get(3008)
                }
            }
        }
    },

    updateBoxNode(){
        this.m_boxItems = []
        this.m_currentSelectIndex = -1
        var self = this
        this.label.active = false
        this.m_choiceNode.active = true

        var tmpFilter = cc.instantiate(this.m_filterPb)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_filterNode.addChild(tmpFilter)
        this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
            if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                this.m_iFilterValue = filter
                this.m_iJobValue = job
                this.updateHeroList()
            }
        }.bind(this))
    },

    updateHeroList(){
        var tmpData = Func.itemSplit(this.conf.containItem)
        var tmpGiao = []
        for(const i in tmpData){
            var baseId = Math.floor(tmpData[i].id / 1000)
            if (baseId == 0){
                baseId = Gm.config.getQulityHero(tmpData[i].id).idGroup
            }
            var tmpConfig = Gm.config.getHero(baseId)
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.camp)&&
                (this.m_iJobValue == 0 || this.m_iJobValue == tmpConfig.job)){
                tmpGiao.push(tmpData[i])
            }
        }

        this.boxSctrollView.stopAutoScroll()
        Func.destroyChildren(this.boxSctrollView.content)
        this.m_boxItems = []
        this.m_currentSelectIndex = -1
        Gm.ui.simpleScroll(this.boxSctrollView,tmpGiao,function(itemData,tmpIdx){
            var v = itemData
            var itemSelect = cc.instantiate(this.newItem)
            var sp = Gm.ui.getNewItem(itemSelect.getChildByName("New Node"))
            this.boxSctrollView.content.addChild(itemSelect)
            sp.setData(v)
            sp.setTips(false)
            var itemSelectScript = itemSelect.getComponent("NewItemSelect")
            itemSelectScript.setIndex(tmpIdx-1)
            itemSelectScript.setHeroId(itemData.id)
            this.m_boxItems.push(itemSelect)
            itemSelectScript.setFb(this.onSelectClick.bind(this))
            return itemSelect
        }.bind(this))
    },
    onSelectClick(context){
        if( context.getIndex() != this.m_currentSelectIndex){
            if(this.m_currentSelectIndex != -1){
                this.m_boxItems[this.m_currentSelectIndex].getComponent("NewItemSelect").setSelect()
            }
            this.m_currentSelectIndex = context.getIndex()
            this.m_selectHeroId = context.getHeroId()
            context.setSelect()
        }
    },

    isTrainExp(count){
        if (this.conf.open_type == 4 && this.conf.train_exp != 0){
            var isNeed = Gm.bagData.getNum(this.conf.train_exp) > 0
            if (!isNeed){
                Gm.floating(Ls.get(3012))
            }
            return isNeed
        }else if (this.conf.type == ConstPb.propsType.EQUIP_BOX){
            // cc.log(this.conf.containItem,"wwwwwwwwwwwwwww")
            // var count = 1
            //  var tmpAry = Func.itemSplit(this.conf.containItem)
            //  for (var i = 0; i < tmpAry.length; i++) {
            //     var v = tmpAry[i]
            //     if (v.type == ConstPb.itemType.EQUIP){
            //         count = count + v.num
            //     }
            //  }
            if (count > Gm.bagData.getSurplusBagSize()){
                Gm.floating(5013)
                return false
            }
        }else if(this.conf.type == ConstPb.propsType.CHOICE_BOX){
            if(this.m_currentSelectIndex == undefined || this.m_currentSelectIndex == -1){
               Gm.floating(Ls.get(7100032))
                return false
            }
            let isMax = Gm.checkBagAddTeam(1, function(){
                this.onBack()
             }.bind(this))
             return isMax
        }
        return true
    },
    onBtn1:function(){
        cc.log("11111111")
        if (this.conf.open_type == 3){
            this.onBtn3()
            return
        }
        if (this.isTrainExp(this.count)){
            this.onBack()
            if(this.conf.type  == ConstPb.propsType.CHOICE_BOX){
                var tmpData = Func.itemSplit(this.conf.containItem)
                let useIdx = -1
                for(let key in tmpData){
                    if(tmpData[key].id == this.m_selectHeroId){
                        useIdx = parseInt(key) 
                        break
                    }
                }
              Gm.bagNet.useBag(this.itemData.id,1,null,null,useIdx)
            }else{
                Gm.bagNet.useBag(this.itemData.id,this.count)
            }
        }
    },
    onBtn2:function(){
        cc.log("222")
        if (this.conf.open_type == 3){
            if (this.conf.type == 2){//宝石一键合成
                var gemConf = Gm.config.getGem(this.itemData.baseId)
                if (Gm.userInfo.silver < gemConf.costSilver){
                    Gm.floating(Ls.get(5031))
                    return
                }
                if (Math.floor(this.itemData.count/2) ==0){
                    Gm.floating(Ls.get(5032))
                    return
                }
                Gm.bagNet.useBag(this.itemData.id,0,1,1)
                this.onBack()
                return
            }
        }
    },
    onBtn3:function(){
        cc.log("333")
        if(this.conf.type  != ConstPb.propsType.CHOICE_BOX){
            this.onBack()
        }
        if (this.conf.open_type == 1 || this.conf.open_type == 4){
            this.onBtn1()
        }else if (this.conf.open_type == 3){
            if (this.conf.type == 2){//宝石合成
                var gemCon = Gm.config.getGem(this.itemData.baseId)
                if (gemCon.level == 10){
                    return
                }
                Gm.ui.create("GemMakeView",this.itemData)
            }else if(this.conf.type == 999){//武将碎片
                if (Gm.heroData.getHeroByBaseId(this.itemData.baseId)){
                    Gm.ui.create("GemMakeView",this.itemData)
                }
            }
        }
    },
    onJiaClick(){
        this.count = Math.min(this.count + 1,this.itemData.count)
        this.setSliderProgress()
    },
    onJianClick(){
        this.count = Math.max(this.count - 1,1)
        this.setSliderProgress()
    },
    updateSliderProgress(slider,progress,isProgress){
        slider.progress = progress
        var sliderWidth = slider.node.width
        slider.node.getChildByName("Background").width = progress*sliderWidth
        if (isProgress){
            this.count = Math.max(1,Math.ceil(progress * this.itemData.count))
        }
        this.numRich.string = cc.js.formatStr("%s/%s",this.count,this.itemData.count)
    },
    onSliderUpdate(sender,value){
        this.updateSliderProgress(sender,sender.progress,true)
    },
    setSliderProgress(){
         this.updateSliderProgress(this.numSlider,this.count/this.itemData.count)
    },
});

