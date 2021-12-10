// NewItem
var DEFAULT_SIZE = 159
var MAX_SCALE = 1 //女神界面，正常比例
var DEFAULT_SCALE = 0.69

cc.Class({
    extends: cc.Component,
    properties: {
        floorSpr:cc.Sprite,
        iconSpr:cc.Sprite,
        countLab:cc.RichText,
        bgSpr:cc.Sprite,
        addNode:cc.Node,
        lockLayer:cc.Node,
        ssrIconSpr:cc.Sprite,
        jobSpr:cc.Sprite,
        diamondTypeSpr:cc.Sprite,
        tipsShow:true,
        showAccess:false
    },
    onLoad(){
        this.init()
    },

    init(){
        if (this.isInit){
            return
        }
        this.isInit = true
        this.baseList = {}
        this.diamondTypeSprArr = []
        this.defaultHeightScale = DEFAULT_SCALE
        this.addTouch()
    },
    addTouch:function(){
        this.m_iTime = 0
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.m_iTime = new Date().getTime()
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.m_iTime = 0
        })
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            if (this.data && this.m_iTime >= 0){
                this.m_iTime = 0
                if (!this.check()){
                    return
                }
                if (this.fb){
                    var aa = this.fb(this.data,this.itemType,this)
                    if (aa){
                        if (this.tipsShow){
                            Gm.ui.create("ItemTipsView",{data:this.data,itemType:this.itemType,pos:event.touch._point})
                        }
                    }
                }else if (this.tipsShow){
                    if(this.data.itemType == ConstPb.itemType.HERO_SKIN){
                        var conf = Gm.config.getHero(parseInt(this.data.qualityId/1000),this.data.qualityId)
                        var skinConf = Gm.config.getSkin(conf.skin_id)
                        Gm.ui.create("HeroShowView",{skinconf:skinConf})
                    }else{
                        Gm.ui.create("ItemTipsView",{data:this.data,itemType:this.itemType,pos:event.touch._point})
                    }
                }
                if (this.data && this.showAccess){
                    Gm.ui.create("HeroAccessView",this.data)
                }
            }
        })
    },
    check:function(){
        var tmpRet = true
        for (const key in this.baseList) {
            if (this.baseList[key].check){
                tmpRet = this.baseList[key].check() && tmpRet
            }
        }
        return tmpRet
    },
    setShowAccess(bo){
        this.showAccess = bo
        this.tipsShow = false
    },
    setTips:function(isShow){
        this.tipsShow = isShow
    },
    setFb:function(_fb){
        this.fb = _fb
    },
    setAlso:function(){
        this.m_bAlso = true
    },
    getBaseClass(){
        var item = this.baseList[this.itemType]
        if (item == null){
            item = Gm.ui.getBaseItem(this.itemType)
            this.node.addChild(item.node)
            item.node.scale = this.getHeight()/item.node.height
            // item.node.width = item.node.height = this.getHeight()
            this.baseList[this.itemType] = item
        }
        item.node.active = true
        return item
    },
    //---------------------已知具体物品,{baseId:0}-----------
    updateItem(data){
        if (data){
            data.itemType = ConstPb.itemType.TOOL
        }
        return this.setData(data)
    },
    updateEquip(data){
        if (data){
            data.itemType = ConstPb.itemType.EQUIP
        }
        return this.setData(data)
    },
    updateHero(data){
        if (data){
            data.itemType = ConstPb.itemType.ROLE
        }
        return this.setData(data)
    },
    //---------------------配置结构、服务器奖励结构、已知具体物品结构-----------
    dataFormat(dd){
        if (dd.qualityId){
            return
        }
        if (dd.hasOwnProperty("type")){//配置表结构{type:1,id:2,num:3}
            dd.itemType = dd.type
            if (dd.baseId){
                return
            }
            dd.baseId = dd.id
            dd.count = dd.num || 0
        }else if (dd.hasOwnProperty("itemType")){//服务器结构{itemType:1,baseId:2,count:3}
            dd.type = dd.itemType
            if (dd.id){
                return
            }
            dd.baseId = dd.baseId
            dd.count = dd.count || 0
        }
        if(dd.hasOwnProperty("itemCount")){
            dd.count = dd.itemCount
        }
    },
    setData(data){
        this.init()
        this.updateDefault()
        if (data==null){
            this.iconSpr.spriteFrame = null
            this.lastIconStr = null
            this.setLabStr("")
            this.loadBottomFrame(this.defaultBottomFrame || "share_img_k1")
            this.loadFloor(this.defaultFloor || "share_img_kd1")
            this.loadSsrIcon(null)
            this.updateJob()
            this.setBindSize()

            return
        }
        this.dataFormat(data)
        this.data = data

        this.itemType = this.data.itemType

        if (this.itemType == ConstPb.itemType.HERO_CARD){
            this.data.count = Ls.get(20049)
        }

        if (this.itemType == ConstPb.itemType.ROLE || this.itemType == ConstPb.itemType.HERO_CARD || this.itemType == ConstPb.itemType.HERO_SKIN){
            this.itemType = ConstPb.itemType.ROLE
            if (this.data.baseId && this.data.qualityId == null){
                this.data.qualityId = this.data.baseId
            }
        }else if (this.itemType == ConstPb.itemType.EQUIP){
            this.itemType = this.data.itemType
        }else{
            this.itemType = ConstPb.itemType.TOOL
        }
        // this.setBindSize()
        this.hideAll()
        var conf = this.getBaseClass().setData(this.data,this)
        this.setBindSize(conf)
        if (conf){
            if (this.data.noHead != true){//特殊处理
                if (conf.hasOwnProperty("icon")){
                    this.loadIcon("img/items/" +conf.icon)
                }else if (conf.hasOwnProperty("skin_id")){
                    var skinConf = Gm.config.getSkin(this.data.skin || conf.skin_id)
                    this.loadIcon("personal/head/"+skinConf.picture)
                }
            }
        }else{
            cc.error("找不到配置",this.data,this.itemType)
            return
        }
        this.loadBottomFrame(conf.bottom_frame)
        this.loadFloor(conf.bottom_floor || "share_img_kd1")

        this.setChoice(false)
        return conf
    },
    updateCount(){
        this.getBaseClass().updateCount()
    },
    updateDefault(){
        this.data = null
        this.hideAll()
    },
    hideAll(){
        for (const key in this.baseList) {
            const v = this.baseList[key];
            if (v.node){
                v.node.active = false
            }
        }
        this.updateLock(false)
    },
    setLabStr(str,color,outline){
        if (color && outline){
            this.countLab.string = cc.js.formatStr("<outline color=%s><color=%s>%s</c></outline>",outline,color,str)
        }else{
            this.countLab.string = cc.js.formatStr("<outline color='#000000'>%s</outline>",str)
        }
        this.countLab.node.parent.active = str != ""
    },
    setLabelFontSize(number){
        this.countLab.fontSize = number
    },
    setLabeLFontPositionY(number){
        this.countLab.node.y = number
    },
    updateCountLabX(offsetX){
        this.countLab.node.x =  this.countLab.node.parent.width / 2 - this.countLab._labelWidth / 2 - offsetX
    },
    loadIcon:function(icon){
        if (icon == null){
            this.lastIconStr = null
            if (this.iconSpr){
                this.iconSpr.spriteFrame = null
            }
            return
        }
        if(this.lastIconStr == icon){
            return
        }
        this.lastIconStr = icon
        Gm.load.loadSpriteFrame(icon,(sp,owner)=>{
            if(this.getIsActive()){
                owner.spriteFrame = sp
                owner.node.scale = 1
                if (this.itemType == ConstPb.itemType.ROLE){
                    if (this.data.qualityId){
                        owner.node.scale = this.defaultHeightScale
                        if(this.data.itemType == ConstPb.itemType.HERO_SKIN){
                            owner.node.scale = 0.78
                        }
                    }
                }
                // if (this.data.qualityId || Gm.config.getHero(this.data.baseId || 0,this.data.qualityId)){
                    // owner.node.scale = this.defaultHeightScale * 0.78
                    // var height = this.getHeight()
                    // owner.node.width = height*0.78
                    // owner.node.height = height*0.78
                // }
            }
        },this.iconSpr)
    },
    loadBottomFrame:function(bFrame){
        if (this.lastQualityStr == bFrame){
            return
        }
        this.lastQualityStr = bFrame
        Gm.ui.getItemFrame(bFrame,(spr)=>{
            if (this.node && this.node.isValid && this.lastQualityStr == bFrame){
                this.bgSpr.spriteFrame = spr
                this.bgSpr.node.scale = this.defaultHeightScale
                if (this.baseList[this.itemType] && this.baseList[this.itemType].bgSpr){
                    this.baseList[this.itemType].bgSpr.spriteFrame = spr
                }
                // this.bgSpr.node.width = this.bgSpr.node.height = this.getHeight()
            }
        })
    },
    loadFloor:function(floorStr){
        if(this.lastFloorStr == floorStr){
            return
        }
        this.lastFloorStr = floorStr
        
        Gm.load.loadSpriteFrame("img/heroFloor/" +floorStr,(sp,owner)=>{
            if (this.node && this.node.isValid){
                var height = this.getHeight()
                owner.spriteFrame = sp
                owner.node.scale = this.defaultHeightScale //* 0.9
                // owner.node.width = 0.9 * height
                // owner.node.height = 0.9 * height
                if(this.data && this.data.itemType != ConstPb.itemType.ROLE){
                    owner.node.scale = this.defaultHeightScale * 1.1
                }
            }
        },this.floorSpr)
    },
    updateJob(equipConf){//针对装备
         if (equipConf && equipConf.jobLimit > 0 && equipConf.isSuit >0){
            this.jobSpr.node.active = true
            
            var res = Gm.config.getJobType(equipConf.jobLimit)
            Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                icon.spriteFrame = sp
            },this.jobSpr)
        }else{
            this.jobSpr.node.active = false
        }
    },
    loadSsrIcon(ssr){
        // if (ssr){
        //     this.ssrIconSpr.node.active = true
        //     this.updateCountLabSize()
        //     if(this.lastSsrIcon == ssr){
        //         return
        //     }
        //     this.lastSsrIcon = ssr
        //     Gm.load.loadSpriteFrame("img/equipLogo/"+ssr,(sp)=>{
        //         if(this.getIsActive()){
        //             this.ssrIconSpr.spriteFrame = sp
        //         }
        //     })
        // }else{
        //     this.ssrIconSpr.node.active = false
        // }
        // this.updateCountLabSize()
    },
    updateCountLabSize(){
        if (this.countLab.node.parent.active){
            if (this.ssrIconSpr.node.active){
                this.countLab.overflow = cc.Label.Overflow.CLAMP
                this.countLab.node.width = 95
                this.countLab.horizontalAlign = cc.Label.HorizontalAlign.RIGHT
            }else{
                this.countLab.overflow = cc.Label.Overflow.NONE
                this.countLab.horizontalAlign = cc.Label.HorizontalAlign.CENTER
            }
        }
    },
    getIsActive(){
        if (this.data && this.node && this.node.isValid ){
            return true
        }
        return false
    },
    getHeight(){
        return DEFAULT_SIZE* this.defaultHeightScale
    },
    setBindSize(conf){
        this.countLab.node._activeInHierarchy = true;
       this.countLab._updateRichText()
        var isHero = conf && conf.hasOwnProperty("skin_id")
        this.node.width = this.node.height = this.getHeight()
        if (this.defaultHeightScale == DEFAULT_SCALE){
            // this.countLab.node.parent.width = 100
            // this.countLab.node.parent.height = 26
            // this.countLab.node.width = 100
            // this.countLab.node.parent.y = -37

            // this.countLab.fontSize = 20
            // this.countLab.node.height = 22
            // this.ssrIconSpr.node.y = -40
            
            if (this.itemType == ConstPb.itemType.ROLE){
                this.countLab.node.x =  this.countLab.node.parent.width / 2 - this.countLab._labelWidth / 2+3
                this.countLab.node.y = 3
                this.countLab.fontSize = 18
                this.countLab.node.scale = 0.77
            }else if(this.itemType == ConstPb.itemType.EQUIP){
                this.countLab.fontSize = 18
                this.countLab.node.x =  this.countLab.node.parent.width / 2 - this.countLab._labelWidth / 2 - 5
            }else{
                this.countLab.node.x = 0
            }
        }else{
            this.countLab.node.parent.width = 140
            this.countLab.node.parent.height = 32
            this.countLab.node.width = 140
            this.countLab.node.parent.y = -50

            this.countLab.fontSize = 18
            this.countLab.node.height = 28
            this.ssrIconSpr.node.y = -54

            this.countLab.node.scale = 1.2
            
            if (this.itemType == ConstPb.itemType.ROLE){
                this.countLab.node.x =  this.countLab.node.parent.width / 2 - this.countLab._labelWidth / 2 - 14
            //     this.countLab.node.y = 5
            }
        }

        if (this.newWidth && this.node.width != this.newWidth){
            this.node.scale = this.newWidth/this.node.width
            this.node.width = this.node.height = this.newWidth
        }
    },
    setMaxHeight(){
        this.defaultHeightScale = MAX_SCALE
    },
    setChoice(isShow,isAction){
        this.addNode.active = isShow
        this.addNode.stopAllActions()
        this.addNode.scale = 1
        if (isShow){
            if (isAction){
                var acList = new Array()
                var time = 1.5
                acList.push(cc.scaleTo(time,0.5))
                acList.push(cc.scaleTo(time,1))
                this.addNode.runAction(cc.repeatForever(cc.sequence(acList)))
            }
        }

    },
    setGray(isGray){
        if (isGray){
            Gm.ui.setGray(this.iconSpr.node)
        }else{
            Gm.ui.removeGray(this.iconSpr.node)
        }
    },
    updateLock:function(isLock){
        this.lockLayer.active = isLock
    },
    updateLockCheck(isShow){
        this.lockLayer.getChildByName("readyNod").active = isShow
    },
    setDefaultBottomFrame(sprName,floorSprName){
        this.defaultBottomFrame = sprName
        this.defaultFloor = floorSprName
    },
    setHuiFrame(){
        this.setDefaultBottomFrame("share_img_huise","travel_img_zhezhao")
    },
    showGetIcon(){
        this.updateLock(true)
        this.updateLockCheck(false)

        if (this.lockLayer.getChildByName("getNode") == null){
            var nn = new cc.Node()
            var sprite = nn.addComponent(cc.Sprite)
            this.lockLayer.addChild(nn,1,"getNode")

            Gm.load.loadSpriteFrame("img/share/share_img_get",function(sp,icon){
                icon.spriteFrame = sp
            },sprite)
        }
    },
    setCountLabAnchorX(x){
         this.countLab.node.anchorX = x
    },
    setCountLabPositionX(x){
        this.countLab.node.x =  this.countLab.node.parent.width / 2 + x
    },
    //设置countLabel右对齐
    setCountLabRightAlign(){
        var config = Gm.config.getItem(this.data.baseId)
        if(config && config.type != 104 &&  config.type != 999 && config.type != 125){
            this.countLab.fontSize = 16
            this.countLab.node.anchorX = 0.5
            this.countLab.node.x = 0
        }
        else{
            this.countLab.fontSize = 16
            this.countLab.node.anchorX = 1
            this.countLab.node.x = this.countLab.node.parent.width / 2
        }
    },

    setDiamondIcon(){
        if(this.data.id == ConstPb.playerAttr.PAY_GOLD || this.data.id == ConstPb.playerAttr.GOLD ){
            var iconFileNanme = ""
            iconFileNanme = this.data.id == ConstPb.playerAttr.PAY_GOLD ? "share_img_ychang" : "share_img_wchang"

            if(this.diamondTypeSprArr[iconFileNanme] == undefined){
                let self = this
                Gm.load.loadSpriteFrame("img/share/"+iconFileNanme,function(sp,icon){
                    icon.spriteFrame = sp
                    self.diamondTypeSprArr[iconFileNanme] = sp
                },this.diamondTypeSpr)
            }else{
                this.diamondTypeSpr.spriteFrame = this.diamondTypeSprArr[iconFileNanme]
            }
      
        }
    },
    update(){
        if (this.m_iTime > 0){
            var time = new Date().getTime()
            if (time - this.m_iTime > 1500 && this.m_bAlso){
                var hero = Gm.heroData.getHeroById(this.data.heroId)
                if (hero){
                    this.m_iTime = -1
                    Gm.ui.create("TeamListView",{heroData:hero,isOther:false})
                }else{
                    this.m_iTime = 0
                }
            }
        }
    },
});

