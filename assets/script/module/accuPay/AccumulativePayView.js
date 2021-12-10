var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemNodes:cc.Node,
       // btn:cc.Sprite,
        playBtn:cc.Button,
        m_oBtnLabel:cc.Label,

        m_desc:cc.Label,
        m_tips:cc.RichText,

        m_bgSprite:cc.Sprite,

        m_btnList:{
            default:[],
            type:cc.Button
        },

        m_skillNodeList:{
            default:[],
            type:cc.Node
        },
        m_skillNode_1:cc.Node,
        m_skillNode_2:cc.Node,

        buyBtn:cc.Button,

        m_titleImg:cc.Sprite,
    },
    onEnable(){
        this._super()
        this.m_config = Gm.config.getAccumulativePayConfig(AtyFunc.ACCU_PAY_TYPE)
        this.initView()
        this.updateView()
    },

    initView(){
        //初始化技能信息
        for(let index in this.m_config){
            let heroIds = []
            for(let key in this.m_config[index].item){
                if(this.m_config[index].item[key].type == ConstPb.itemType.HERO_CARD){
                    heroIds.push(this.m_config[index].item[key].id)
                }
            }
            if(heroIds.length == 1){
                this.initSkillInfo(heroIds[0],this.m_skillNodeList[0])
            }else if(heroIds.length == 2){
                this.initSkillInfo(heroIds[0],this.m_skillNodeList[1])
                this.initSkillInfo(heroIds[1],this.m_skillNodeList[2])
            }
        }

        //初始化按钮
        for(let key in this.m_btnList){
            Gm.red.add(this.m_btnList[key].node,"accuPay","accuPaybtn_"+key)
            let node = this.m_btnList[key].node.getChildByName("New Label")
            node.getComponent(cc.Label).string = Ls.get("8100009")+ this.m_config[key].costSymbol+this.m_config[key].cost
        }

        Gm.load.loadSpriteFrame("img/leichong/"+this.m_config[0].titleImage,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_titleImg)

        var canReceiveId = Gm.accumulativePayData.getCanReceiveId(AtyFunc.FIRS_PAY_TYPE)
        this.m_currentSelectIndex = 0
        if(canReceiveId != -1){
            this.m_currentSelectIndex = canReceiveId
            this.setSelectBtn(canReceiveId)
        }else{
            this.setSelectBtn(0)
        }
    },

    initSkillInfo(heroId,skillNode){
        var baseId = parseInt(heroId / 1000) 
        var heroConf = Gm.config.getHero(baseId)
        var labelNode = skillNode.getChildByName("skillLabel_1")
        labelNode.getComponent(cc.Label).string = heroConf.name
        var ssrSpr = skillNode.getChildByName("icon").getComponent(cc.Sprite)
        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(heroId % 100),function(sp,icon){
            icon.spriteFrame = sp
        },ssrSpr)

        for(let i = 0; i<heroConf.location.length; i++){
           let info =  Gm.config.getTypeConfigById(heroConf.location[i]).childTypeName
           let labelNode = skillNode.getChildByName("skillLabel_"+(i+2))
           labelNode.getComponent(cc.Label).string = info
        }
    },

    updateView(){
        Gm.audio.playEffect("music/02_popup_open")
        var num = 0
        Func.destroyChildren(this.itemNodes)
        //this.playBtn.node.active = false
        var conf = this.m_config[this.m_currentSelectIndex]
        var heroCount = 0
        for (let index = 0; index < conf.item.length; index++) {
            const v = conf.item[index];
            var itemBase = Gm.ui.getNewItem(this.itemNodes)
            itemBase.setData(v)
            itemBase.setFb(this.itemFb.bind(this))
            itemBase.setTips(true)
            num = num + 1
            if (v.type == ConstPb.itemType.HERO_CARD){
            //    this.playBtn.node.active = true
                heroCount++
            }else{
                itemBase.node.scale = 0.9
            }
        }
        this.m_desc.string = conf.description
        this.m_skillNode_1.active = heroCount == 1
        this.m_skillNode_2.active = heroCount == 2
        var diffPrice = conf.cost - Gm.accumulativePayData.getStoreAmount()
        var satus = Gm.accumulativePayData.isReceiveFirstActivityReward(conf.id) 
        if(diffPrice > 0){
            this.m_tips.string =  cc.js.formatStr(conf.tips,diffPrice)
        }else if(diffPrice <= 0 && satus == 1){
            this.m_tips.string = cc.js.formatStr("<color=#ffffff><size = 23>%s</size></c>",Ls.get(8200001)) 
        } else if(diffPrice <= 0 && satus == 2){
            this.m_tips.string = cc.js.formatStr("<color=#ffffff><size = 30>%s</size></c>",Ls.get(2328)) 
        }

        this.itemNodes.width = num *107 + (num-1)*26

        Gm.load.loadSpriteFrame("img/leichong/"+conf.LiHui,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_bgSprite)

        this.updateBtn(conf.id)
    },
    itemFb(data,itemType,owner){
        if(itemType == ConstPb.itemType.EQUIP){
            Gm.ui.create("ItemDetailView",{item:data})
            return false 
        }else{
            return true
        }
    },
    updateBtn(id){
        var status = Gm.accumulativePayData.isReceiveFirstActivityReward(id)
        if(status == 1){
            this.m_oBtnLabel.string = Ls.get(1001)
        }else if(status == 0){
            this.m_oBtnLabel.string = Ls.get(422)
        }else if(status == 2){
            this.m_oBtnLabel.string = Ls.get(1002)
        }
        this.buyBtn.interactable = status != 2
    },

    onChangePayClick(target,data){
        if(parseInt(data) != this.m_currentSelectIndex){
            this.m_currentSelectIndex = parseInt(data)
            this.setSelectBtn(this.m_currentSelectIndex)
            this.updateView()
        }

    },

    setSelectBtn(selectIndex){
        for(let key in this.m_btnList){
            this.m_btnList[key].interactable = key != selectIndex
        }
    },

    onBtn(){
        var conf = this.m_config[this.m_currentSelectIndex]
        var status = Gm.accumulativePayData.isReceiveFirstActivityReward(conf.id)
        var config = Gm.config.getAccumulativePayConfigById(conf.id)
        var isMax = Func.checkBag(config.item,()=>{
            this.onBack()
        })
        if(!isMax){
            return
        }
        if(status == 1){
            Gm.activityNet.firstPayReward(conf.id)
        }else if(status == 0){
            Gm.audio.playEffect("music/06_page_tap")
            Gm.ui.jump(200001)
        }
    },

    getSceneData:function(){
        return true
    },
  
});

