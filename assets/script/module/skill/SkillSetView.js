var BaseView = require("BaseView")

// SkillSetView
cc.Class({
    extends: BaseView,

    properties: {
        m_oSkillPerfab:cc.Prefab,
        m_oSkillCell:cc.Prefab,
        m_oSkillTop:cc.Prefab,

        m_tTopList:{
            default: [],
            type: cc.Node,
        },
        m_tSecList:{
            default: [],
            type: cc.Node,
        },

        m_tListSkill:{
            default: [],
            type: cc.Node,
        },
        m_oFreeTimes:cc.Label,
        m_oSelFree:cc.Node,
        m_oSelItem:cc.Node,
        m_oSelBtn:cc.Node,

        seletSpr:cc.Node,
    },
    onLoad () {
        this._super()
    },
    register:function(){
        this.events[Events.UNLOCK_SKILL] = this.updateList.bind(this)
        this.events[Events.BAG_UPDATE] = this.updateList.bind(this)
    },
    isOther(){
        return Gm.heroData.getHeroById(this.m_oData.heroId)?false:true
    },
    enableUpdateView:function(args){
    	if (args){
            Gm.red.add(this.m_oSelBtn,"heroSkill",args.heroId)//职业点
            cc.log(args)
            this.m_oData = args
            if(this.isOther()){
                this.m_oSelBtn.active = false
                if (this.m_oData.isHelpHero){
                    this.m_oSelBtn.active = true
                }
            }
            var self = this
            var tmpHeroData = Gm.config.getHero(args.baseId,args.qualityId)
            this.m_tSkillList = []
            // console.log("heroData==:",heroData)
            // Func.destroyChildren(this.m_oHeroScroll.content)
            var insertSkill = function(destData,node,list){
                var tmpCell = null
                if (destData){
                    tmpCell = cc.instantiate(self.m_oSkillTop)
                }else{
                    tmpCell = cc.instantiate(self.m_oSkillCell)
                }
                tmpCell.parent = node
                var tmpSpt = tmpCell.getComponent("SkillSetCell")
                if (destData){
                    tmpSpt.setIdx(0)
                    tmpSpt.setOwner(self,Gm.config.getSkill(destData))
                }else{
                    tmpSpt.setIdx(1)
                    tmpSpt.setOwner(self)
                }
                if (list){
                    list.push(tmpSpt)
                }
            }
            insertSkill(tmpHeroData.attack_skill,this.m_tTopList[0])
            insertSkill(tmpHeroData.passive_skill,this.m_tTopList[1])

            insertSkill(null,this.m_tSecList[0],this.m_tSkillList)
            insertSkill(null,this.m_tSecList[1],this.m_tSkillList)

            // this.updateTops()

            var updateIcon = function(node,data){
                Gm.load.loadSpriteFrame("personal/skillicon/" +data.picture,function(sp,icon){
                    icon.spriteFrame = sp
                },node.getComponent(cc.Sprite))
            }
            var unlockLevel = Gm.config.getConst("unlock_level").split("|")
            for(const i in unlockLevel){
                const v = Gm.config.getSkill(tmpHeroData.passive_skills[i])
                updateIcon(this.m_tListSkill[i].getChildByName("spr"),v)
                this.m_tListSkill[i].baseId = tmpHeroData.passive_skills[i]
            }
            this.updateList()
        }
    },
    updateTops:function(){
        var skillList
        if (this.isOther()){
            skillList = this.m_oData.skillList
        }else{
            var heroData = Gm.heroData.getHeroById(this.m_oData.heroId)
            skillList = heroData.skillList
        }
        for(const i in this.m_tSkillList){
            if (skillList[i]){
                this.m_tSkillList[i].setOwner(this,Gm.config.getSkill(skillList[i]))
                this.m_tSkillList[i].m_oPageSpt.setAddNode(false)
            }else{
                this.m_tSkillList[i].setOwner(this)
                if(this.m_oData.unlockSkillList.length>i){
                    this.m_tSkillList[i].m_oPageSpt.setAddNode(true)
                }
                else{
                    this.m_tSkillList[i].m_oPageSpt.setAddNode(false)
                }
            }
            this.m_tSkillList[i].m_oPageSpt.setBackSprite()
        }
    },
    updateList:function(){
        var freeNums = Gm.config.getConst("free_skill")
        var unlockLevel = Gm.config.getConst("unlock_level").split("|")
        var tmpHeroData = Gm.config.getHero(this.m_oData.baseId,this.m_oData.qualityId)
        var heroLevel = Func.configHeroLv(this.m_oData,tmpHeroData)
        for(const i in unlockLevel){
            var ned = this.m_tListSkill[i].getChildByName("level")
            var has = this.m_tListSkill[i].getChildByName("has")
            var btn = this.m_tListSkill[i].getComponent(cc.Button)
            var suo = this.m_tListSkill[i].getChildByName("suo")
            var spr = this.m_tListSkill[i].getChildByName("spr")
            // spr.color = cc.color(80,80,80)
            if (heroLevel < unlockLevel[i]){//没到等级-(boss试炼女神特殊处理)
                ned.getComponent(cc.Label).string = Ls.lv()+unlockLevel[i]+Ls.get(1205)
                ned.active = true
                has.active = false
                // btn.interactable = false
                suo.active = true
            }else{//已到等级
                ned.active = false
                // btn.interactable = true
                has.active = false
                suo.active = true
                for(const j in this.m_oData.unlockSkillList){
                    if (this.m_oData.unlockSkillList[j] == tmpHeroData.passive_skills[i]){//已解锁
                        // spr.color = cc.color(255,255,255)
                        suo.active = false
                        break
                    }
                }
                for(const j in this.m_oData.skillList){
                    if (this.m_oData.skillList[j] == tmpHeroData.passive_skills[i]){//已装备
                        has.active = true
                        // spr.color = cc.color(80,80,80)
                        break
                    }
                }
            }
            
        }
        this.m_iFreeNums = freeNums - this.m_oData.unlockSkillList.length
        if (this.m_iFreeNums < 0){
            this.m_iFreeNums = 0
        }
        this.m_oFreeTimes.string = this.m_iFreeNums
        var tmpIdx = this.m_iSelIdx || 0
        this.m_iSelIdx = -1
        this.updateInfo(tmpIdx)
        this.updateTops()
    },
    updateInfo:function(destIdx){
        if (this.m_iSelIdx != destIdx){
            this.m_iSelIdx = destIdx
            const nod = this.m_tListSkill[this.m_iSelIdx]
            this.seletSpr.x = 0//nod.x
            this.seletSpr.y = 0//nod.y
            this.seletSpr.zIndex = -1
            this.seletSpr.parent = nod
            this.m_oSelFree.active = false
            this.m_oSelItem.active = false
            var lab = this.m_oSelBtn.getChildByName("lab").getComponent(cc.Label)
            if (nod.getChildByName("level").active){ // 没到等级
                lab.string = Ls.get(1008)
                // this.m_oSelBtn.getComponent(cc.Button).interactable = false
            }else{
                // this.m_oSelBtn.getComponent(cc.Button).interactable = true
                if (nod.getChildByName("suo").active){//没解锁
                    if (this.m_oData.isHelpHero){
                        lab.string = Ls.get("不可解锁")
                        return
                    }
                    if (this.m_iFreeNums <= 0){
                        var unlockMaterial = Gm.config.getConst("unlock_material").split("_")
                        this.m_oSelItem.active = true
                        var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:unlockMaterial[1]})
                        var spr = this.m_oSelItem.getChildByName("spr")
                        var need = this.m_oSelItem.getChildByName("need")
                        var used = this.m_oSelItem.getChildByName("used")

                        Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                            icon.spriteFrame = sp
                        },spr.getComponent(cc.Sprite))
                        var tmpHas = Gm.bagData.getNum(unlockMaterial[1])
                        need.getComponent(cc.Label).string = unlockMaterial[2]
                        used.getComponent(cc.Label).string = tmpHas
                        if (tmpHas < unlockMaterial[2]){
                            used.color = cc.color(255,0,0)
                        }else{
                            used.color = cc.color(255,255,255)
                        }
                    }else{
                        this.m_oSelFree.active = true
                    }
                    lab.string = Ls.get(1205)
                }else{
                    if (nod.getChildByName("has").active){//已装备
                        lab.string = Ls.get(5104)
                    }else{
                        lab.string = Ls.get(5126)
                    }
                }
            }
            // const v = Gm.config.getSkill(nod.baseId)
        }
    },
    onListCell:function(sender,value){
        var y = sender.target.parent.y + sender.target.y + sender.target.height
        Gm.ui.create("TipsInfoView",{id:this.m_tListSkill[value].baseId,x:sender.target.x,y:y})
        this.updateInfo(value)
    },
    onSelClick:function(){
        const nod = this.m_tListSkill[this.m_iSelIdx]
        if (!nod.getChildByName("level").active){
            if (nod.getChildByName("suo").active){//没解锁
                if (this.m_oData.isHelpHero){
                    return
                }
                Gm.audio.playEffect("music/14_chara_lvup")
                if (this.m_iFreeNums > 0){
                    Gm.heroNet.skillUnlock(this.m_oData.heroId,nod.baseId)
                }else{
                    var unlockMaterial = Gm.config.getConst("unlock_material").split("_")
                    var tmpNums = Gm.bagData.getNum(unlockMaterial[1])
                    if (!Gm.userInfo.checkCurrencyNum({attrId:unlockMaterial[1],num:unlockMaterial[2]})){
                        console.log("unlockMaterial===:",unlockMaterial)
                        // Gm.floating(Ls.get(300024))
                    }else{
                        Gm.heroNet.skillUnlock(this.m_oData.heroId,nod.baseId)
                    }
                }
            }else{
                var tmpList = []
                for(const i in this.m_tSkillList){
                    if (this.m_tSkillList[i].m_oData){
                        tmpList.push(this.m_tSkillList[i].m_oData.baseId)
                    }
                }
                console.log("tmpList===:",tmpList,this.m_tSkillList)
                if (nod.getChildByName("has").active){//已装备
                    Gm.audio.playEffect("music/03_popup_close")
                    for(const i in tmpList){
                        if (tmpList[i] == nod.baseId){
                            tmpList.splice(i,1)
                            break
                        }
                    }
                    Gm.heroNet.skillSet(this.m_oData.heroId,tmpList)
                }else{
                    Gm.audio.playEffect("music/06_page_tap")
                    if (tmpList.length >= 2){
                        Gm.floating(Ls.get(9013))
                        return
                    }
                    var tmpHas = true
                    for(const i in tmpList){
                        if (tmpList[i] == nod.baseId){
                            tmpHas = false
                            break
                        }
                    }
                    if (tmpHas){
                        tmpList.push(nod.baseId)
                    }
                    Gm.heroNet.skillSet(this.m_oData.heroId,tmpList)
                }
            }
        }else{
            Gm.floating(Ls.get(1008))
        }
    },
    onCloseClick:function(){
    	this.onBack()
    },
});

