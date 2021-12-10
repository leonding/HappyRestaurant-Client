var BaseView = require("BaseView")


const TYPE_RESET = 0//重置

// HeroReLevel
cc.Class({
    extends: BaseView,
    properties: {
        // m_oTitle:cc.Label,

        m_oNodReset:cc.Node,

        m_oOldNod:cc.Node,
        m_oNewNod:cc.Node,
        m_oResetTips:cc.Node,
        m_oCostTypeSprite:cc.Sprite,
        m_oMidLabel:cc.Label,
        m_oJianLab:cc.Label,


        m_oReardNode:{
            default:[],
            type:cc.Node
        },

        m_oExcWeaponItem:cc.Prefab,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7200006)}
        this._super()
    },
    getNewItem(parent){
        var item = cc.instantiate(this.m_oExcWeaponItem)
        parent.addChild(item)
        item.scale = parent.width / item.width
        return item.getComponent("ExcWeaponItem")
    },
    enableUpdateView:function(args){
        if (args){
            this.heroId = args.hero.baseId
            this.hero = args.hero
            this.weaponLevel = args.weaponLevel

            this.idx = args.idx
            this.m_iType = TYPE_RESET
            if (args.type){
                this.m_iType = args.type
            }
            this.m_oNodReset.active = false
            if (this.m_iType == TYPE_RESET){
                // this.m_oTitle.string = Ls.get(7200006)
                this.m_oNodReset.active = true
                this.m_oResetTips.active = true
                var itemOld = this.getNewItem(this.m_oOldNod)
                itemOld.setUI(ExcWeaponFunc.getExcWeaponIconInfo(this.heroId,this.weaponLevel))
                var itemNew = this.getNewItem(this.m_oNewNod)
                itemNew.setUI(ExcWeaponFunc.getExcWeaponIconInfo(this.heroId,1))

                this.m_oJianLab.string = Ls.get(8007)
                var str = Gm.config.getConst("hero_weapon_reset_cost")
                var array = str.split("_")
                var obj = {type:parseInt(array[0]),id:parseInt(array[1]),num:parseInt(array[2])}
                var needNum = parseInt(obj.num)
                this.m_oMidLabel.string = "x"+needNum
                var config =  Gm.config.getItem(obj.id)
                Gm.load.loadSpriteFrame("/img/share/"+config.icon,function(sp,icon){
                    if(icon && icon.node && icon.node.isValid){
                        icon.spriteFrame = sp
                    }
                },this.m_oCostTypeSprite)

                var tmpIt = Func.itemConfig({itemType:obj.type,id:obj.id})
                if (tmpIt.num < needNum){
                    this.checkData = {attrId:obj.id,num:needNum}
                    this.m_bCanDo = 1
                }else{
                    this.m_bCanDo = 0
                }
                if (this.weaponLevel== 1){
                    this.m_bCanDo = 2
                }
                this.setReardNode()
            }
        }
    },
    onOkClick:function(){
        if (this.m_bCanDo == 1){
            if (this.checkData){
                Gm.userInfo.checkCurrencyNum(this.checkData)    
                this.onBack()
            }else{
                Gm.floating(Ls.get(20011))    
            }
        }else if(this.m_bCanDo == 2){
            Gm.floating(Ls.get(9013))
        }else{
            Gm.heroNet.excWeaponReLevel(this.hero.heroId)
            this.onBack()
        }
    },
    setReardNode(){
        var data = this.getReardData()
        for(var i=0;i<this.m_oReardNode.length;i++){
            if(data[i]){
                 this.m_oReardNode[i].active = true
                 var newItem = Gm.ui.getNewItem(this.m_oReardNode[i],true)
                 newItem.setData(data[i])
                 if(data[i].type == ConstPb.itemType.ROLE){
                     this.m_oReardNode[i].scale = 1.08
                     newItem.setLabStr("x" + data[i].num,new cc.Color(255,0,0))
                     newItem.setCountLabAnchorX(0.5)
                     newItem.setCountLabPositionX(-45)
                     newItem.setLabelFontSize(24)
                 }
            }
            else{
                this.m_oReardNode[i].active = false
            }
        }
    },
    getReardData(){
        var data = Gm.config.getConfig("WeaponCostConfig")
        var tdata = []
        var config = Gm.config.getHero(this.hero.baseId)
        for(var i=0;i<data.length;i++){
            if(data[i].level <= this.weaponLevel && (data[i].camp == 0 || data[i].camp == config.camp)){
                var consume = data[i].cost
                for(var j=0;j<consume.length;j++){
                    if(!tdata[consume[j].id]){
                        tdata[consume[j].id] = Func.copyObj(consume[j])
                    }
                    else{
                         tdata[consume[j].id].num = tdata[consume[j].id].num + consume[j].num
                    }
                }
            }
        }
        var reData = []
        var j=0
        for(var i in tdata){
            reData[j] = tdata[i]
            reData[j].count = tdata[i].num
            j++
        }
        return reData
    },
});

