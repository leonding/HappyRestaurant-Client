var DEFAULT_SCALE = 0.79

var OPENWITH_NONE = 0
var OPENWITH_CLICK = 1
var OPENWITH_AUTO = 2  //快速翻牌 连续打开
var OPENWITH_ALL = 3 //一键翻牌 全部打开

var OPENSTATE_NONE = 0
var OPENSTATE_FINISH = 1

cc.Class({
    extends: cc.Component,

    properties: {
        floorSpr:cc.Sprite,
        iconSpr:cc.Sprite,
        countLab:cc.RichText,
        bgSpr:cc.Sprite,
        spSsrIconSpr:cc.Sprite,
        jobSpr:cc.Sprite,
        roleCardBackSpr:cc.Sprite,
        toolCardBackSpr:cc.Sprite,
        roleSpr:cc.Sprite,
        roleSsr:cc.Sprite,
        roleName:cc.Label,
        roleCardFrontSpr:cc.Sprite,
    },
    onLoad(){
        // this.init();
    },
    updateQuality:function(quality){
        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(quality),function(sp,icon){
            icon.spriteFrame = sp
        },this.roleSsr)
    },
    updateRoleName:function(name){
        this.roleName.string = name
    },
    roleOnTouchEvent(){
        this.roleCardBackSpr.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
               this.m_nOpenWith = OPENWITH_CLICK 
               this.offTouchEvent()
               Gm.send(Events.HEROFRAME_ITEMCLICK,{itemType:this.itemType,qualityId:this.data.baseId,node:this})
               var animation = this.node.getComponent(cc.Animation)
               animation.play(this.m_strAnimationName)

               Gm.audio.playEffect("music/gacha/"+this.m_strTurnOverAudio)
        },this)
    },
    toolOnTouchEvent(){
        this.toolCardBackSpr.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
               this.m_nOpenWith = OPENWITH_CLICK 
               this.offTouchEvent()
               
               var animation = this.node.getComponent(cc.Animation)
               animation.play(this.m_strAnimationName)

               Gm.audio.playEffect("music/gacha/"+this.m_strTurnOverAudio)
        },this)
    },
    offTouchEvent(){
        this.roleCardBackSpr.node.off(cc.Node.EventType.TOUCH_START)
        this.toolCardBackSpr.node.off(cc.Node.EventType.TOUCH_START)
    },
    registerHeroCardFrontEvent(){
        this.roleCardFrontSpr.node.on(cc.Node.EventType.TOUCH_START, this.onHeroCardFrontClick.bind(this))
    },
    init(){
        this.baseList = {}
        this.defaultHeightScale = DEFAULT_SCALE
        
        this.m_nOpenWith = OPENWITH_NONE
        this.m_nOpenState = OPENSTATE_NONE
    },
    setTurnOverStopCallBack(callback){
        this.stopPlay_callback = callback
    },
    setAnimationName(name){
        this.m_strAnimationName = name
    },
    getAnimationName(){
        return this.m_strAnimationName
    },
    setAuto(){
        this.m_nOpenWith = OPENWITH_AUTO
    },
    isAuto(){
        return this.m_nOpenWith == OPENWITH_AUTO
    },
    setAll(){
        this.m_nOpenWith = OPENWITH_ALL
    },
    isAll(){
        return this.m_nOpenWith == OPENWITH_ALL
    },
    isClick(){
        return this.m_nOpenWith == OPENWITH_CLICK  
    },
    isNotOpen(){
        return this.m_nOpenWith == OPENWITH_NONE
    },
    isNotOpened(){
        return this.m_nOpenState == OPENSTATE_NONE
    },
    setOpened(){
        this.m_nOpenState = OPENSTATE_FINISH
    },
    isOpened(){
        return this.m_nOpenState == OPENSTATE_FINISH
    },
    setTurnOverAudio(audio){
        this.m_strTurnOverAudio = audio
    },
    getTurnOverAudio(){
        return this.m_strTurnOverAudio
    },
    setGoodQuality(is){
        this.m_bGoodQuality = is
    },
    isGoodQuality(){
        return this.m_bGoodQuality
    },
    setData(data,owner){
        this.owner = owner
        this.updateDefault()
        if(data==null){
            return
        }
        this.dataFormat(data)
        this.data = data

        this.itemType = this.data.itemType

        if (this.itemType == ConstPb.itemType.HERO_CARD){
            this.data.count = Ls.get(20049)
        }
        if (this.itemType == ConstPb.itemType.ROLE || this.itemType == ConstPb.itemType.HERO_CARD){
            this.itemType = ConstPb.itemType.ROLE
            if (this.data.baseId && this.data.qualityId == null){
                this.data.qualityId = this.data.baseId
            }
            var heroConf = Gm.config.getQulityHero(this.data.qualityId)
            this.updateQuality(heroConf.quality)
            this.updateRoleName(heroConf.name)
        }else if (this.itemType == ConstPb.itemType.EQUIP){
            this.itemType = this.data.itemType
            this.roleName.active = false
        }else{
            this.itemType = ConstPb.itemType.TOOL
            this.roleName.active = false
        }
        // this.conf = Gm.config.getItem(this.data.baseId)   
        var conf = this.getBaseClass().setData(this.data,this)
        if(conf){
            if(conf.hasOwnProperty("icon")){
                this.loadIcon("img/items/"+conf.icon)
            }else if(conf.hasOwnProperty("skin_id")){
                var skinConf = Gm.config.getSkin(this.data.skin || conf.skin_id)
                this.loadIcon("personal/bansh/"+skinConf.role)
            }
        }else{
            cc.error("HeroFrame ",this.data)
        }
        if(conf.hasOwnProperty("skin_id")){
            this.updateTeam(conf)
        }else{
            this.updateCount()
            if (this.data.itemType == ConstPb.itemType.HERO_CHIP){
                this.loadSpSsrIcon(null)
            }else{
                this.updateSsrIcon(conf)
            }
        }
        this.loadBottomFrame(conf.bottom_frame)
        this.loadFloor(conf.bottom_floor || "share_img_kd1")
    },
    updateDefault(){
        this.data = null
    },
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
    setLabStr(str){
        this.countLab.string = cc.js.formatStr("<outline color='#000000'>%s</outline>",str)
        this.countLab.node.parent.active = str != ""
    },
    loadFloor:function(floorStr){
        if(this.lastFloorStr == floorStr){
            return
        }
        this.lastFloorStr = floorStr
        
        Gm.load.loadSpriteFrame("img/heroFloor/" +floorStr,(sp,owner)=>{
            if (this.node && this.node.isValid){
                // var height = this.getHeight()
                owner.spriteFrame = sp
                // this.floorSpr.node.scale = this.defaultHeightScale
                // this.floorSpr.node.width = 0.9 * height
                // this.floorSpr.node.height = 0.9 * height
            }
        },this.floorSpr)
    },
    getHeight(){
        return DEFAULT_SIZE* this.defaultHeightScale
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
   updateTeam:function(conf){
        var res = Gm.config.getTeamType(conf.camp)
        Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
            if (icon && icon.node){
                icon.spriteFrame = sp
            }
        },this.jobSpr)
    },
    loadIcon:function(icon){
        var self = this
        if(icon == null){
            this.lastIconStr = null
            if(this.iconSpr){
                this.iconSpr.spriteFrame = null
            }
            if(this.roleSpr){
                this.roleSpr.spriteFrame = null
            }
            return
        }
        if(this.lastIconSpr == icon){
            return
        }
        this.lastIconStr = icon
        Gm.load.loadSpriteFrame(icon,(sp)=>{
            if(self.getIsActive()){
                if (self.data.itemType == ConstPb.itemType.TOOL){
                    self.iconSpr.spriteFrame = sp
                    self.iconSpr.node.scale = 1.9//self.defaultHeightScale
                // }else if(self.data.itemType == ConstPb.itemType.HERO_CHIP){
                //     self.iconSpr.node.scale = 1.9//self.defaultHeightScale
                }else if(self.data.itemType == ConstPb.itemType.HERO_CARD){
                    self.roleSpr.spriteFrame = sp    
                }
            }
        })
    },
    getIsActive(){
        if(this.data && this.node && this.node.isValid){
            return true
        }
        return false
    },
    loadBottomFrame:function(bFrame){
        if(this.lastQualityStr == bFrame){
            return
        }
        this.lastQualityStr = bFrame
        Gm.ui.getItemFrame(bFrame,(spr)=>{
            if(this.node && this.node.isValid){
                this.bgSpr.spriteFrame = spr
                // this.bgSpr.node.scale = this.defaultHeightScale
                if(this.baseList[this.itemType] && this.baseList[this.itemType].bgSpr){
                    this.baseList[this.itemType].bgSpr.spriteFrame = spr
                }
            }
        })
    },
    updateCount(){
        var str = ""
        var tmpCount = this.data.count || this.data.itemCount
        if(tmpCount){
            if (typeof(tmpCount) == "string"){
                str = tmpCount
            }else{
                str = "x"+Func.transNumStr(tmpCount)
            }
        }else{
            str = ""
        }
        this.setLabStr(str)
    },
    loadSpSsrIcon(str){
        if (str){
            this.spSsrIconSpr.node.active = true
            if(this.lastSsrIcon == str){
                return
            }
            Gm.load.loadSpriteFrame("img/equipLogo/"+str,(sp,owner)=>{
                owner.spriteFrame = sp
            },this.spSsrIconSpr)
        }else{
            this.spSsrIconSpr.node.active = false
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
    updateSsrIcon(conf){
        if(conf && conf.equip && conf.equip > 0){
            var equipConf = Gm.config.getEquip(conf.equip)
            if(equipConf && equipConf.equipClass >0){
                // this.owner.loadSsrIcon("ssr_equip_" + equipConf.equipClass)
                var spStr = "ssr_equip_sp_1"
                this.loadSpSsrIcon(spStr)
                this.updateJob(equipConf)
                return
            }
        }else if (conf && conf.type == 999){
            this.loadSpSsrIcon("ssr_equip_sp_1")
            return
        }
        // this.owner.loadSsrIcon(null)
        this.loadSpSsrIcon(null)
        this.updateJob()
    },
    stopTurnOverCardAction(){
        if(this.stopPlay_callback){
            this.stopPlay_callback(this)
        }
    },
    getBaseClass(){
        var item = this.baseList[this.itemType]
        if(item == null){
            item = Gm.ui.getBaseItem(this.itemType)
            // this.node.addChild(item.node)
            // this.baseList[this.itemType] = item
        }
        // item.node.active = false
        return item
    },
    onHeroCardFrontClick(){
        if(!this.owner.isAllOpen(this.owner.itemAniNodes)){
            return
        } 
        if(this.m_nOpenState == OPENSTATE_FINISH && this.data.itemType == ConstPb.itemType.HERO_CARD){
            var items = Gm.getLogic("LotteryLogic").getLotteryItems()
            var item = null
            for(var i = 0; i < items.length; i++){
                if(items[i].baseId == this.data.baseId){
                    item = items[i]
                    break
                }
            }  
            var data = {}
            data.qualityId = this.data.qualityId
            data.item = item          
            Gm.ui.create("HeroTjView",data,function(view){
                var heroView = view.getComponent("HeroTjView")
                heroView.setPathBtnVisible(false)
            })
        }
    },
});
