// LoterryTopCell
cc.Class({
    extends: cc.Component,

    properties: {
        rolePicSpr:cc.Sprite,
        kuangSpr:cc.Sprite,
        btn:cc.Button,
        btnLab:cc.Label,
        labOutline:cc.LabelOutline,
        m_zheNode:cc.Node,
        textRich:cc.RichText,
        bg1SpriteFrame:cc.SpriteFrame,
        bgSprite:cc.Sprite,
        skinIconSpr:cc.Sprite,
    },
    setOwner:function(owner){
        this.owner = owner
    },
    setData(skinConf){
        this.skinConf = skinConf
        this.setNowShow(false)

        Gm.load.loadSpriteFrame("personal/banshnew/" +skinConf.role,function(sp,icon){
            icon.spriteFrame = sp
        },this.rolePicSpr)

        Gm.load.loadSpriteFrame("img/camp/" +skinConf.skinIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.skinIconSpr)
        
        this.updateState()  
    },
    updateState(){
        if (this.owner.heroData == null && !Gm.userInfo.hasSkinById(this.skinConf.id)){//玩家未持有该英雄并有没有皮肤
            this.btn.node.active = false
            this.m_zheNode.active = true
            // this.kuangSpr.setMaterial(0,this.gray)
            return
        }
        var btnStr = ""
        var colorOutline = cc.color(86,86,86)
        var btnState = false
        this.m_isLock = this.skinConf.quality > this.owner.heroConf.quality || (this.skinConf.type ==1 && !Gm.userInfo.hasSkinById(this.skinConf.id))
        if (this.m_isLock){ //皮肤未解锁
            btnStr = 2329
            this.m_zheNode.active = true
            // this.kuangSpr.setMaterial(0,this.gray)
        }else{
            if (this.owner.heroData && this.owner.heroData.skin == this.skinConf.id){
                btnStr = 400041
            }else{
                btnStr = 400040
                btnState = true
                colorOutline = cc.color(50,128,50)
            }
        }
        this.btn.interactable = btnState
        this.btnLab.string = Ls.get(btnStr)
        this.labOutline.color = colorOutline
    },

    setTextBySkinType(isShow){
        if(!isShow){
            this.textRich.node.parent.active = false 
        }

        if(!this.m_isLock){
            return 
        }

        if(this.skinConf.type == 0 ){
           this.textRich.node.parent.active = true 
           this.btn.node.active = false
           this.textRich.string = Ls.get(400042)
        }else if(this.skinConf.type == 1){
            if(this.skinConf.viewId.length > 0 ){ //购买
                this.btnLab.string = Ls.get(1007)
                this.btn.interactable  = true
                let colorOutline = cc.color(50,128,50)
                this.labOutline.color = colorOutline
                this.m_isCanBuy = this.m_isLock
            }else{
                this.btn.node.active = false
                this.textRich.node.parent.active = true 
                this.bgSprite.spriteFrame = this.bg1SpriteFrame 
                this.textRich.string = Ls.get(400043)
            }
   
        }

    },
    onBtnClick(){

        if(!this.m_isCanBuy && this.m_opt && this.m_opt == 1){ 
            //看板娘切换皮肤逻辑
            this.onChangeHeadClick()
            this.m_cb(this.m_index)
            return
        }

        if (this.owner.isMove || this.owner.heroData == null){
            return
        }
        if(this.m_isCanBuy){ //如果皮肤未解锁并且可以购买
            //跳转到购买界面
            Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.HERO_SKIN,baseId:this.owner.heroData.baseId})    
        }else{
            Gm.heroNet.setSkin(this.owner.heroData.heroId,this.skinConf.id)
        }
    },
    setNowShow(isNow){
        this.btn.node.active = isNow
        if (this.owner.heroData == null){
            this.btn.node.active = false
        }
    },
    onChangeHeadClick(){
        console.log("onchangeClick")
    
        let data = Gm.config.getGroupHeroBySkin(this.skinConf.id)
        let qualityId = data[0].id
        Gm.playerNet.changeHead(3,qualityId)
    },  
    setOpt(opt){
        this.m_opt = opt 
        console.log("opt ====>",this.m_opt)
        if(!this.m_isLock){
          this.setAvailable() 
        }
    },

    setForbidden(){
        this.btn.interactable = false
        this.labOutline.color = cc.color(86,86,86)
    },

    setAvailable(){
        let colorOutline = cc.color(50,128,50)
        this.btn.interactable = true
        this.btnLab.string = Ls.get(400040)
        this.labOutline.color = colorOutline
    },
    
    setFb(cb,index){
        this.m_cb = cb 
        this.m_index = index
    }

});

