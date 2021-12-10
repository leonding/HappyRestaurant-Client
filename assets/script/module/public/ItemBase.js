// ItemBase
cc.Class({
    extends: cc.Component,

    properties: {
        m_oIconSpr:cc.Sprite,
        m_oNumsLab:cc.Label,
        bgSpr:cc.Sprite,
        itemType:0,
        choiceNode:cc.Node,
        strengthLab:cc.Label,
        ssrIcon:cc.Sprite,
        equipSpIcon:cc.Sprite,
        equipGems:require("EquipGems"),
        flashNode:cc.Node,
        selectSpr:cc.Sprite,
        jobIcon:cc.Sprite,
    },
    activeSelect(spr){
        // this.selectSpr
        this.selectSpr.spriteFrame = spr
    },
    setData:function(data){

    },
    setItemType:function(destType){
        if (destType == 1){
            var cla = require("HeroContnt")
            this.m_sHero = new cla()
            this.m_sHero.setOwner(this)
        }else{

        }
    },
    setBindSize:function(){

    },
    setTips:function(isShow){
        this.tipsShow = isShow
    },
    onLoad:function(){
        this.setChoice(false)
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_END,function  (event) {
            if (self.fb && self.data){
                // if (self.m_iTouchTime >= touch_time_max && self.ab){
                //     console.log("已经回调持续案件")
                // }else{
                    self.fb(self.data,self.itemType,self)
                // }
            }
            if (self.tipsShow && self.data){
                // cc.log(self.data)
                Gm.ui.create("ItemTipsView",{data:self.data,itemType:self.itemType,pos:event.touch._point})
            }
            // self.updateTime(0)
        })
        // this.node.on(cc.Node.EventType.TOUCH_START,function  (event) {
        //     self.updateTime(0.1)
        // })
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,function  (event) {
        //     self.updateTime(0)
        // })
    },
    setChoice:function(isShow,str){
        if (this.choiceNode){
            this.choiceNode.active = isShow
            if (str){
                this.choiceNode.getComponent(cc.Label).string = str
            }
        }
    },
    setStrengthLv:function(lv){
        if (this.strengthLab){
            if (lv == null || lv==0){
                this.strengthLab.string = ""
            }else{
                this.strengthLab.string = "+" + lv
            }
        }
    },
    setFb:function(_fb){
        this.fb = _fb
    },
    cheackItemRed:function(destValue){
        this.m_bCheackNum = destValue
        if (this.m_bCheackNum){
            if (this.data && this.data.baseId){
                var count = 0
                if (this.data.baseId == 1002){
                    count = Gm.userInfo.silver
                }else if(this.data.baseId == 1001){
                    count = Gm.userInfo.getGolden()
                }else{
                    var conf = Gm.config.getItem(this.data.baseId)
                    if (conf.type == 999){
                        count = Gm.heroData.getChipNum(this.data.baseId)
                    }else{
                        count = Gm.bagData.getNum(this.data.baseId)
                    }
                }
                this.m_oNumsLab.string = Func.transNumStr(count)+"/"+Func.transNumStr(this.data.count)
                if (count < this.data.count){
                    this.m_oNumsLab.node.color = cc.color(255,0,0)
                }else{
                    this.m_oNumsLab.node.color = cc.color(255,255,255)
                }
            }
        }else{
            this.m_oNumsLab.node.color = cc.color(255,255,255)
        }
    },
    // updateTime:function(destValue){
    //     this.m_iTouchTime = destValue
    //     this.m_iUpdateTime = destValue
    // },
    setDefault:function(){
        this.setChoice(true)
        this.itemType = 0 
        this.updateItem()
    },
    updateCount(){
        this.m_oNumsLab.string = this.data.count
    },
    updateItem:function(data){//道具
        if (this.lvLab){
            this.lvLab.string = ""
        }
        Func.destroyChildren(this.flashNode)
        this.jobIcon.spriteFrame = null
        if (data){
            this.createEquipLv()
            this.data = data
            this.itemType = ConstPb.itemType.TOOL
            if(data.count || data.count ==0){
                if (typeof(data.count) == "string"){
                    this.m_oNumsLab.string = data.count
                }else{
                    this.m_oNumsLab.string = "x"+Func.transNumStr(data.count)
                }
            }else{
                this.m_oNumsLab.string = ""
            }
            var con = Gm.config.getItem(data.baseId)
            if (con == null){
                this.m_oNumsLab.string = "error"+ data.baseId 
                return
            }
            this.lvLab.string = Func.itemName(con.name)
            this.lvLab.node.y = -80
            this.loadIcon(con.icon)
            this.loadBottomFrameSp(con.bottom_frame)
            this.updateGem()
            this.setChoice(false)
            this.setStrengthLv(0)
            this.setSrrActive(false)
            this.equipSpIcon.node.active = false
            if(con.equip && con.equip > 0){
                var equipCon = Gm.config.getEquip(con.equip)
                if(equipCon && equipCon.equipClass >0){
                    this.equipSpIcon.node.active = true
                    this.setSrrActive(true)
                    this.loadSsrIcon("ssr_equip_" + equipCon.equipClass)
                    var spStr = "ssr_equip_sp_"
                    if (equipCon.equipClass == 3){
                        spStr = spStr + "3"
                    }else{
                        spStr = spStr + "1"
                    }
                    Gm.load.loadSpriteFrame("img/ssr/"+spStr,function(sp,owner){
                        owner.spriteFrame = sp
                    },this.equipSpIcon.getComponent(cc.Sprite))
                }
            }
            return con
        }else{
            this.data = null
            this.lastIconStr = null
            this.lastQualityStr = null
            this.m_oIconSpr.getComponent(cc.Sprite).spriteFrame = null
            this.m_oNumsLab.string = ""
            this.loadBottomFrameSp("share_img_k1")
            this.setStrengthLv(0)
            this.setSrrActive(false)
            this.equipSpIcon.node.active = false
            this.equipGems.setData()
        }
    },
    bagUpdateDefault(){
        this.data = null
        this.m_oNumsLab.string = ""
        this.setStrengthLv(0)
        this.setSrrActive(false)
        this.equipSpIcon.node.active = false
        this.equipGems.setData()
    },
    setSrrActive:function(isShow){
        this.ssrIcon.node.active = isShow
        if(!isShow){
            this.lastSsrIcon = null
        }
    },
    loadBottomFrameSp:function(bFrame){
        var self= this
        if (this.lastQualityStr == bFrame){
            return
        }
        this.lastQualityStr = bFrame
        Gm.ui.getItemFrame(bFrame,function(spr){
            if (self.node){
                self.bgSpr.spriteFrame = spr
                self.bgSpr.node.width = self.bgSpr.node.height = 107
            }
        })
        //heroFrame
    },
    updateGem:function(){//宝石

    },
    updateSp:function(){//碎片

    },
    updateEquip:function(data){//装备
        // this.updateItem()
        this.data = data
        this.itemType = ConstPb.itemType.EQUIP
        Func.destroyChildren(this.flashNode)
        this.equipSpIcon.node.active = false
        if (data){
            this.createEquipLv()
            var con = Gm.config.getEquip(data.baseId)
            if (this.lvLab){
                this.lvLab.string = Ls.lv() + con.level
            }
            this.m_oNumsLab.string = "" //con.name
            this.loadIcon(con.icon)
            this.loadBottomFrameSp(con.bottom_frame)
            this.setChoice(false)
            this.setStrengthLv(data.strength)
            if (con.equipClass == 0 ){
                this.setSrrActive(false)
            }else{
                this.setSrrActive(true)
                this.loadSsrIcon("ssr_equip_"+ Math.min(con.equipClass,3))
            }
            var tmpKuang = EquipFunc.getGodlyEffect(this.data)
            if (tmpKuang.length > 0){
                Gm.load.loadPerfab("perfab/ui/"+tmpKuang,function(sp){
                    if(this.data && this.flashNode.isValid){
                        var nowKuang = EquipFunc.getGodlyEffect(this.data)
                        if (nowKuang == tmpKuang){
                            this.flashNode.addChild(cc.instantiate(sp))
                        }
                    }
                }.bind(this))
            }
            
            this.equipGems.setData(data)
            return con
        }else{
            this.setSrrActive(false)
            this.equipGems.setData()
        }
    },
    updateHero:function(data){
        if (this.lvLab){
            this.lvLab.string = ""
        }
        this.equipSpIcon.node.active = false
        this.data = data
        if (data){
            this.createEquipLv()
            this.itemType = ConstPb.itemType.ROLE
            var con = Gm.config.getHero(data.baseId || 0,data.qualityId)
            this.m_oNumsLab.string = ""
            this.lvLab.string = con.name
            this.lvLab.node.y = -80
            this.loadBottomFrameSp(con.bottom_frame)
            this.setChoice(false)
            this.setStrengthLv(0)
            this.setSrrActive(true)
            this.loadSsrIcon("ssr_hero_"+ con.quality)

            Gm.load.loadSpriteFrame("personal/head/"+con.picture,function(sp,owner){
                owner.spriteFrame = sp
                owner.node.width = 95
                owner.node.height = 95
            },this.m_oIconSpr.getComponent(cc.Sprite))

            var conf
            if (con.idGroup){
                conf = Gm.config.getHero(con.idGroup)
            }else{
                conf = con
            }
            var tmpJob = Gm.config.getJobWithId(conf.job)
            Gm.load.loadSpriteFrame("texture/jobs/"+tmpJob.icon,function(sp,icon){
                if (self.data){
                    icon.spriteFrame = sp
                    icon.node.width = icon.node.height = 33
                }
            },this.jobIcon)
            return con
        }else{
            this.setSrrActive(false)
        }
    },
    loadSsrIcon:function(ssr){
        var self = this
        if (ssr){
            if(this.lastSsrIcon == ssr){
                return
            }
            this.lastSsrIcon = ssr
            Gm.load.loadSpriteFrame("img/ssr/"+ssr,function(sp,owner){
                owner.spriteFrame = sp
            },this.ssrIcon.getComponent(cc.Sprite))
        }else{
            this.setSrrActive(false)
        }
    },
    loadIcon:function(icon){
        var self = this
        if(this.lastIconStr == icon){
            return
        }
        this.lastIconStr = icon
        Gm.load.loadSpriteFrame("img/items/" +icon,function(sp,owner){
                owner.spriteFrame = sp
                if (Gm.config.getHero(self.data.baseId)){
                    owner.node.width = 95
                    owner.node.height = 95
                }
        },this.m_oIconSpr.getComponent(cc.Sprite))
    },
    createEquipLv:function(){
        if (this.lvLab){
            return
        }
        var lvNode = new cc.Node()
        lvNode.y = -80
        var lab = lvNode.addComponent(cc.Label)
        lab.font = Gm.ui.getFont()
        this.node.addChild(lvNode,0,"lvLab")
        this.lvLab = lab
        lab.fontSize = 22
        this.equipLvActive(false)
    },
    equipLvActive:function(visi){
        if (this.lvLab){
            this.lvLab.node.active = visi
        }
    },
    // update(dt){
    //     if (this.m_iTouchTime && this.ab){
    //         this.m_iTouchTime = this.m_iTouchTime + dt
    //         if (this.m_iTouchTime - this.m_iUpdateTime >= touch_update){
    //             this.m_iUpdateTime = this.m_iTouchTime
    //             console.log("持续案件")
    //             this.ab(this.data,this.itemType)
    //         }
    //     }
    // },
});

