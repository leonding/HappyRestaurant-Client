cc.Class({
    extends: cc.Component,
    properties: {
        discountLab:cc.Label,
        spr:cc.Sprite,
        lab1:cc.Label,
        lab2:cc.RichText,
        lab3:cc.RichText,
        labItemNameVip:cc.RichText, //vip页面专用
        labItemName:cc.Label,
        itemNode:cc.Node,
        btn:cc.Button,
        btnLab:cc.Label,
        tipLab:cc.Label,
        diamndBg:cc.Sprite,
        dayItemBg:cc.Sprite,
        monthItemBg:cc.Sprite,
        nodeZhe:cc.Node,
        diamondNode:cc.Node,
    },

    onLoad(){
    },

    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if (this.data.childType == AtyFunc.TYPE_TIME_NOOB ||this.data.childType == AtyFunc.TYPE_TIME_LIMIT ){
            this.tipLab.string = data.name
        }

        this.lab1.string = ""
        this.lab2.string = ""
        this.lab3.string = ""
        this.labItemName.string = ""
        this.labItemNameVip.string  = ""
        this.diamondNode.active = false
        this.itemNode.destroyAllChildren()

        var discount  = this.data.discount/100
        if (discount != 0){
            this.discountLab.string = (100-discount) + "%"
            this.discountLab.node.parent.active = true
        }else{
            this.discountLab.node.parent.active = false
        }

        var self = this
        Gm.load.loadSpriteFrame("img/activity/" +data.giftIcon,function(sp,icon){
            if (icon && icon.node && icon.node.isValid){   
                icon.spriteFrame = sp
                icon.sizeMode = cc.Sprite.SizeMode.TRIMMED
            }
        },this.spr)

        let award = Func.copyArr(Gm.config.getEventPayRewardId(this.data.id).reward)

        if(this.isDiamond()){
            var payConf = Gm.config.getPayProductAtyId(this.data.id)
            if (!Gm.userInfo.getHasPayId(payConf.itemId)){
                let newAward = {}
                newAward.num = payConf.firstGift
                newAward.id = ConstPb.playerAttr.GOLD
                newAward.type = ConstPb.itemType.TOOL

                award.push(newAward)
            }
        }
        
        for (let index = 0; index < award.length; index++) {
            const v = award[index];
            var sp = Gm.ui.getNewItem(this.itemNode)
            sp.setData(v)
            sp.setTips(true)
            var item = Gm.config.getItem(v.id)
            if(item && item.type == ConstPb.propsType.CHOICE_BOX){
                sp.setFb((data,itemType,context)=>{
                    Gm.ui.create("ChoiceBoxInfoView",data)
                    return false
                })
            }
         
            if(this.isDiamond()){
                sp.setDiamondIcon()
            }else if(!this.isDiamond() && v.id == ConstPb.playerAttr.PAY_GOLD ){
                sp.setDiamondIcon()
            }
            sp.node.scale = 0.8
            sp.node.x += index * (sp.node.width * sp.node.scale) + 50 + index * 8
            sp.node.y += 28
        }

        if (!this.isDiamond()){//非钻石礼包
            this.setBuyNum()
        }else{
            
        }
   

        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.node)
        }
        this.redNode.active = false

        this.updateItem()
    },

    setBuyNum(){
        var num = 0
        if(Gm.activityData.isHasAty(this.data.id)){
            num = Gm.activityData.getAtyId(this.data.id).num
        }
        let forMatStr = cc.js.formatStr("<color=#FFFFFF><size=20><outline color=#000000 width=2> %s:</outline></size></c><color=#FCFF00><size=20><outline color=#000000 width=2>%s</outline></size></c>",Ls.get(5304) , this.data.quota - num ) 
        this.lab2.string = forMatStr
    },

    updateItem(){
        this.btnLab.string = AtyFunc.getPriceStr(this.data.id)    
        this.btn.interactable = true
        this.redNode.active = AtyFunc.getPrice(this.data.id) == 0 && !Gm.activityData.isHasAty(this.data.id)
        this.diamndBg.node.active = AtyFunc.TYPE_NORMAL_DOAMIND <= this.data.childType &&  this.data.childType <= AtyFunc.TYPE_NORMAL_MONTH
        this.monthItemBg.node.active = this.data.childType == AtyFunc.TYPE_NORMAL_MONTH
        this.dayItemBg.node.active = this.data.childType == AtyFunc.TYPE_NORMAL_DAY
        this.labItemName.node.active = this.data.childType != AtyFunc.TYPE_TIME_NOOB && this.data.childType != AtyFunc.TYPE_TIME_LIMIT 
        this.lab2.node.active = this.data.childType != AtyFunc.TYPE_NORMAL_DOAMIND
        if (this.isDiamond()){//钻石礼包
            this.diamondNode.active = true
            var payConf = Gm.config.getPayProductAtyId(this.data.id)
            this.labItemNameVip.string = cc.js.formatStr("<color=#FFFFFF><size=20><outline color=#000000 width=2>%s</outline></size></c>",cc.js.formatStr(Ls.get(5306),payConf.goldNum )) 
            if (!Gm.userInfo.getHasPayId(payConf.itemId)){
                let forMatStr = ""
                var l2ForMat = cc.js.formatStr(Ls.get(5364),payConf.firstGift)
                forMatStr = "<color=#FCFF00><outline color=#000000 width=2><size=20>%s</outline></size></c>"
                this.labItemNameVip.string =cc.js.formatStr("<color=#FFFFFF><size=20><outline color=#000000 width=2>%s</outline></size></c>",cc.js.formatStr(Ls.get(5364),payConf.goldNum))    + "<color=#FFFFFF><size=20><outline color=#000000 width=2>+</outline></size></c>" +cc.js.formatStr(forMatStr,l2ForMat) 

                forMatStr = "<color=#00FFFC><size=15><outline color=#000000 width=2> %s</outline></size></c><color=#FAFF6A><size=20><outline color=#000000 width=2>%s</outline></size></color><color=#00FFFF><size=23>!</size></c>"
                this.lab3.string = cc.js.formatStr(forMatStr,Ls.get(5305),Ls.get(5361))
            }else{
                this.lab3.string = ""
            }
            this.labItemName.string = cc.js.formatStr(Ls.get(5363),payConf.goldNum) 
        }else{
            this.labItemName.string = this.data.name 
            if( Gm.activityData.isHasAty(this.data.id)){
                this.setBuyNum()
                if (Gm.activityData.getAtyId(this.data.id).num >= this.data.quota){
                    this.btnLab.string = Ls.get(5307)
                    this.btn.interactable = false
                    this.nodeZhe.active = true
                }
            }
        }
    },
    isDiamond(){
        return this.data.childType == AtyFunc.TYPE_NORMAL_DOAMIND
    },
    onInfoBtn(){
        if(Gm.activityData.isHasAty(this.data.id) && Gm.activityData.getAtyId(this.data.id).num >= this.data.quota && !this.isDiamond()){
            return
        }
        Gm.ui.create("ActivityBuyView",this.data.id)
    },
    onBtn(){
        if(Gm.activityData.isHasAty(this.data.id) && Gm.activityData.getAtyId(this.data.id).num >= this.data.quota && !this.isDiamond()){
            return
        }
        AtyFunc.checkBuy(this.data.id)
    },
});


