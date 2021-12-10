var BaseView = require("BaseView")
const touch_update = 0.2
const MAX_LV = 160
cc.Class({
    extends: BaseView,
    properties: {
        heroBackSpr:cc.Sprite,
        personSpine:sp.Skeleton,
        HeroFeelItem:cc.Node,
        scroll:cc.ScrollView,

        nameLab:cc.Label,
        bar:cc.ProgressBar,
        barLab:cc.Label,
        lvLab:cc.Label,

        btn:cc.Node,
        itemBgSpf:{
            default: [],
            type: cc.SpriteFrame,

        }
    },
    onLoad () {
        this._super()

        var bags = Gm.config.getItemsByType(ConstPb.propsType.FEEL_UP)
        // cc.log(bags)

        this.items = []
        for (var i = 0; i < bags.length; i++) {
            var item = cc.instantiate(this.HeroFeelItem)
            item.active = true
            var itemSp = item.getComponent("HeroFeelItem")
            itemSp.setData(bags[i],this)
            // this.scroll.content.addChild(item)

            this.items.push(itemSp)
        }


        this.touchTime = 0.5
        this.vocTouchTime = 0.5

        this.btn.on(cc.Node.EventType.TOUCH_START,function  (event) {
            this.isTouch = true
            this.updateTime = 0
            this.vocUpdateTime =0
            this.onUpClick()
            this.onVoc()
        }.bind(this))
        this.btn.on(cc.Node.EventType.TOUCH_CANCEL,function  (event) {
            this.isTouch = false
        }.bind(this))
        this.btn.on(cc.Node.EventType.TOUCH_END,function  (event) {
            this.isTouch = false
        }.bind(this))
    },
    update(value){
        if (this.isTouch){
            this.updateTime = this.updateTime + value
            if (this.updateTime > this.touchTime){
                this.updateTime = 0
                this.onUpClick()
            }

            this.vocUpdateTime = this.vocUpdateTime + value
            if (this.vocUpdateTime > this.vocTouchTime){
                this.vocUpdateTime = 0
                this.onVoc()
            }
        }
    },
    onVoc(){
        var list = this.vHeroData.lv>=5?[17,18,17,18]:[14,15,14,15]
        var vocName = list[Func.random(1,4)-1]
        Gm.audio.playDub("voc0" + vocName)
    },
    onDestroy(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            // cc.log(args)
            this.qualityIndex = -1
            var index = -1
            for (var i = 0; i < this.openData.list.length; i++) {
                if (this.openData.list[i].qualityId == this.openData.qualityId){
                    index = i
                    break
                }
            }
            this.updateChoice(index)
        }
    },
    register:function(){
        this.events[MSGCode.OP_VILLA_FEEL_S] = this.onNetVillaFeel.bind(this)
        this.events[Events.BAG_UPDATE] = this.onBagUpdate.bind(this)
    },
    onBagUpdate(){
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].updateItemCount()
        }
        this.itemSort()

        if (this.lastItem && this.lastItem.reladCount == 0){
            if (this.lastItem){
                this.onItemClick(this.lastItem)
            }
            this.onItemClick(this.items[0])
        }
    },
    onNetVillaFeel(){
        if (this.lastItem){
            this.lastItem.updateItemCount()
            if (this.lastItem.reladCount == 0){
                this.itemSort()
            }
        }
        this.updateExp()
    },
    onLeftClick(){
        this.updateChoice(Math.max(0,this.qualityIndex-1))
    },
    onRightClick(){
        this.updateChoice(Math.min(this.openData.list.length -1,this.qualityIndex+1))
    },
    updateChoice(index){
        if (index == this.qualityIndex){
            return
        }
        this.qualityIndex = index
        if (this.qualityIndex <0){
            return
        }
       
        this.qualityId = this.openData.list[this.qualityIndex].qualityId
        this.updateView()
    },
    updateExp(){
        this.feelConf = Gm.config.getHeroFeelByLv(this.heroConf.idGroup,this.vHeroData.lv)

        this.barLab.string = cc.js.formatStr("%s/%s",this.vHeroData.nowExp,this.feelConf.exp)
        if (this.vHeroData.nowExp == 0 && this.vHeroData.nowExp == this.feelConf.exp){
            this.barLab.string = "max"
        }
        this.lvLab.string = this.vHeroData.lv
        this.bar.progress = this.vHeroData.nowExp/this.feelConf.exp

        if (this.btn.getComponent(cc.Button).interactable != !this.vHeroData.isMax){
            this.btn.getComponent(cc.Button).interactable = !this.vHeroData.isMax    
        }
    },
    updateView(){
        this.heroConf = Gm.config.getHero(0,this.qualityId)
        var heros = Gm.heroData.getHerosByBaseId(this.heroConf.idGroup)
        this.skinConf = HeroFunc.tjSkinConf(heros,this.heroConf.idGroup)

        var quality = this.heroConf.quality

        this.nameLab.string = this.heroConf.name

        this.vHeroData = Gm.villaData.getVillaHeroData(this.heroConf.idGroup)
        
        this.updateExp()
        Gm.load.loadSpriteFrame("img/bg/"+this.skinConf.background,function(sp,icon){
            icon.spriteFrame = sp
        },this.heroBackSpr)

        Gm.load.loadSkeleton(this.skinConf.rolePic,(sp,owner)=>{
            owner.skeletonData = sp
            owner.setAnimation(0, "ziran", true)
        },this.personSpine)



        for (var i = 0; i < this.items.length; i++) {
            var v = this.items[i]
            if (Func.forBy(this.heroConf.likesItems,"id",v.itemConf.id)){
                v.setLove(true)
            }else{
                v.setLove(false)
            }
        }
        this.itemSort()

        if (this.lastItem){
            this.onItemClick(this.lastItem)
        }
        this.onItemClick(this.items[0])
    },
    itemSort(){
        this.scroll.content.removeAllChildren()

        this.items.sort(function(a,b){
            // var a = nodea.getComponent("HeroFeelItem")
            // var b = nodea.getComponent("HeroFeelItem")
            if ((a.reladCount == 0 && b.reladCount == 0) || (a.reladCount > 0 && b.reladCount > 0)){
                if (a.isLove == b.isLove){
                    if (a.itemConf.quality == b.itemConf.quality){
                        return a.reladCount - b.reladCount
                    }
                    return b.itemConf.quality - a.itemConf.quality
                }
                return a.isLove?-1:1
            }
            return a.reladCount > 0?-1:1
        })

        for (var i = 0; i < this.items.length; i++) {
            this.scroll.content.addChild(this.items[i].node)
        }

        // var layout = this.scroll.content.getComponent(cc.Layout)
        // layout._layoutDirty = true
        // layout.updateLayout()
    },
    onItemClick(item){
        if (this.lastItem){
            this.lastItem.setCheck(false)
            if (this.lastItem == item){
                this.lastItem = null
                return
            }
        }
        this.lastItem = item
        this.lastItem.setCheck(true)
        cc.log(item)
    },
    onUpClick(){
        
        if (this.vHeroData.isMax){
            // if (Gm.config.getConst("hero_intimate_max") == 1){
                this.isTouch = false
                Gm.floating(5466)
                return
            // }
        }

        if (this.lastItem){
            if (!Gm.userInfo.checkCurrencyNum({attrId:this.lastItem.itemConf.id,num:1})){
                this.isTouch = false
                return
            }

            var maxExp = VillaFunc.getMaxExpByQuality(this.heroConf.idGroup,this.heroConf.quality)
            if (this.vHeroData.upPoints >= maxExp){
                this.isTouch = false
                Gm.floating(5851)//"品质限制"
                return
            }else if (this.vHeroData.upPoints +  this.lastItem.itemConf.train_exp > maxExp){
                this.isTouch = false
                Gm.box({msg:Ls.get(5852)},(btnType)=>{//"弹窗"
                    if (btnType == 1){
                        Gm.villaNet.feel(this.heroConf.idGroup,this.lastItem.itemConf.id)
                    }
                })
                return
            }

            Gm.villaNet.feel(this.heroConf.idGroup,this.lastItem.itemConf.id)
            // if (this.lastItem.reladCount == 0){
            //     Gm.floating("数量不足")
            //     this.isTouch = false
            //     return
            // }
        }
    },
    onLvInfoClick(){
        Gm.ui.create("FeelLvAddtionView",this.vHeroData)
    },
});

