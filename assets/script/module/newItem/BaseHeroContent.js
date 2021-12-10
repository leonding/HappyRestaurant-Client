// BaseItem
cc.Class({
    extends: cc.Component,
    properties: {
        teamSpr:cc.Sprite,
        lockNod:cc.Node,
        lockLab:cc.RichText,
        readyNod:cc.Node,
        campNew:cc.Node,
        hireLock:cc.Node,
        hireNode:cc.Node,
        hireLab:cc.Label,
        bgSpr:cc.Sprite,
        starNode:cc.Node,
    },
    setData(data,owner){
        this.node.active = true
        this.owner = owner
        this.data = data

        if (this.data.isMonster){
            if (this.data.qualityId && this.data.qualityId > 1000000){
                this.conf = Gm.config.getHero(0,this.data.qualityId)
            }else{
                this.monsterConf = Gm.config.getMonster(this.data.baseId)
                this.conf = Gm.config.getHero(0,this.monsterConf.heroQualityID)
                this.data.qualityId = this.monsterConf.heroQualityID
            }
        }else{
            if (this.data.qualityId < 1000000){
                this.conf = Gm.config.getHero(this.data.baseId)
            }else{
                this.conf = Gm.config.getHero(0,this.data.qualityId)
            }
        }

        HeroFunc.heroStar(this.starNode,this.conf.quality)
        
        this.updateCount()
        this.updateSsrIcon()
        this.updateChip()
        this.updateTeam()
        this.setHeroReady(false)
        this.updateHelpHero()
        return this.conf
    },
    check:function(){
        if (this.isHireFull){
            Gm.floating(Ls.get(5354))
            return false
        }
        if (this.m_iLockHire){
            Gm.floating(Ls.get(5326))
            return false
        }
        return true
    },
    updateHire:function(lineType){
        if (this.data.isHire){
            var constKey
            if (lineType == ConstPb.lineHero.LINE_BOSS){
                constKey = "aid_success_use_limit_map"
            }else if (lineType == ConstPb.lineHero.LINE_TOWER || lineType == ConstPb.lineHero.LINE_TOWER1 || lineType == ConstPb.lineHero.LINE_TOWER2 || lineType == ConstPb.lineHero.LINE_TOWER3){
                constKey = "aid_success_use_limit_tower_map"
            }
            var str = cc.js.formatStr("%s/%s",Gm.friendData.getHireCount(lineType),Gm.config.getConst(constKey))
            // this.owner.setLabStr(str)
            this.hireNode.active = true
            this.hireLab.string = str
            this.isHireFull = Gm.friendData.getHireCount(lineType)>=Gm.config.getConst(constKey)
            this.updateHireLock()
        }
    },
    lockSame:function(destValue){
        this.m_bLockSame = destValue
        this.updateHireLock()
    },
    lockHire:function(destValue){
        this.m_iLockHire = destValue
        this.updateHireLock()
    },
    updateHireLock:function(){
        if (this.isHireFull || this.m_iLockHire || this.m_bLockSame){
            this.hireLock.active = true
        }else{
            this.hireLock.active = false
        }
    },
    canTouch:function(){
        return !(this.readyNod.active || this.hireLock.active)
    },
    updateTeam:function(){
        var res = Gm.config.getTeamType(this.data.camp || this.conf.camp)
        Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
            if (icon && icon.node){
                icon.spriteFrame = sp
            }
        },this.teamSpr)
    },
    updateChip:function(){
        if (this.data.isChip){
            this.lockNodActive(true)
            var total = this.conf.hero_chip_num
            if (this.data.isTj){
                var minConf =  Gm.config.getHero(this.conf.idGroup)
                total  = minConf.hero_chip_num
            }
            this.lockLab.string = ""
            // this.lockLab.string = "<color=ffff00>"+Gm.heroData.getChipNum(this.data.baseId)+"</c><color=ffffff>/"+total+"</c>"
            this.campNew.active = this.data.chipOpen
        }else{
            this.lockNodActive(false)
        }
    },
    lockNodActive(isShow){
        this.lockNod.active = isShow
        this.lockLab.string = ""
    },
    updateCount(){
        var str = ""
        var outline = '#000000'
        var color = '#F8F2E2'
        if(this.data.isMonster){
            if (this.monsterConf){
                str = Ls.lv() + HeroFunc.monsterFormatLv(this.monsterConf.level)
            }else{
                str = Ls.lv() + this.data.level
            }
        }else{
            if(this.data.level){
                if (this.data.heroId && Gm.heroData.isInPool(this.data.heroId)){
                    str = Ls.lv() + Func.configHeroLv(this.data,this.conf)
                    color = '#65FF3C'
                }else{
                    str = Ls.lv() + this.data.level
                }
            }
        }
        
        this.owner.setLabStr(str,color,outline)
    },
    updateSsrIcon(){
        this.owner.loadSsrIcon(null)
    },
    setHeroReady:function(destValue){
        this.readyNod.active = destValue
    },
    isReady:function(){
        return this.readyNod.active
    },
    updateHelpHero(){
        if (this.data.isHelpHero){
            if (this.helpHeroIcon == null){
                this.helpHeroIcon = new cc.Node()
                this.helpHeroIcon.addComponent(cc.Sprite)

                this.node.addChild(this.helpHeroIcon,10)
                this.helpHeroIcon.x = this.node.width/2-28
                this.helpHeroIcon.y = this.node.height/2-28

                Gm.load.loadSpriteFrame("img/bossshilian/sl_icon_xz",function(sp,icon){
                    if (icon && icon.node){
                        icon.spriteFrame = sp
                    }
                },this.helpHeroIcon.getComponent(cc.Sprite))
            }
            this.helpHeroIcon.active = true
        }else if (this.helpHeroIcon) {
            this.helpHeroIcon.active = false
        }
    },
    showJob:function(job){
         var res = Gm.config.getJobType(job)
        Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.teamSpr)
    }
});

