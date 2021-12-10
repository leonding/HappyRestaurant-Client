var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_HERO_INFO_S] = this.onNetHeroInfos.bind(this)
        this.events[MSGCode.OP_GET_LINE_HERO_S] = this.onNetLineHero.bind(this)
        this.events[MSGCode.OP_SET_LINE_HERO_S] = this.onNetGuaJiHero.bind(this)
        this.events[MSGCode.OP_ADD_JOB_POINT_S] = this.onAddJobPoint.bind(this)
        this.events[MSGCode.OP_REMOVE_JOB_POINT_S] = this.onRemoveJobPoint.bind(this)
        this.events[MSGCode.OP_SKILL_SET_S] = this.onSkillSet.bind(this)

        this.events[MSGCode.OP_PUSH_HERO_ATTRIBUTE_S] = this.onHeroAttribute.bind(this)

        this.events[MSGCode.OP_STRENGTHEN_EQUIP_S] = this.onNetStrengthenEquip.bind(this)
        this.events[MSGCode.OP_WASH_EQUIP_S] = this.onNetXlEquip.bind(this)
        this.events[MSGCode.OP_GODLY_FUSE_S] = this.onNetGodlyFuse.bind(this)
        this.events[MSGCode.OP_GODLY_DEVOUR_S] = this.onNetGodlyDevour.bind(this)
        this.events[MSGCode.OP_CULTURE_S] = this.onCulture.bind(this)
        this.events[MSGCode.OP_CULTURE_Save_S] = this.onCultureSave.bind(this)
        this.events[MSGCode.OP_GODLY_INHERIT_S] = this.onNetInherit.bind(this)

        this.events[MSGCode.OP_TRAIN_S] = this.onTrainRet.bind(this)
        this.events[MSGCode.OP_AWAKEN_S] = this.onAwakenRet.bind(this)
        this.events[MSGCode.OP_OPEN_GEM_S] = this.onNetOpenGem.bind(this)
        this.events[MSGCode.OP_WEAR_GEM_S] = this.onNetWearGem.bind(this)

        this.events[MSGCode.OP_SUIT_UPLEVEL_S] = this.onNetSuitUp.bind(this)

        this.events[MSGCode.OP_UNLOCK_S] = this.onNetHeroUnlock.bind(this)
        this.events[MSGCode.OP_TUNE_S] = this.onNetHeroTune.bind(this)

        this.events[MSGCode.OP_HERO_RESERVATION_S] = this.onNetHeroReser.bind(this)
        this.events[MSGCode.OP_HERO_RESERVATION_INFO_S] = this.onNetHeroReserInfo.bind(this)

        this.events[MSGCode.OP_HERO_QUALITY_INFO_S] = this.onQualityInfo.bind(this)
        this.events[MSGCode.OP_HERO_QUALITY_S] = this.onHeroRiseQuality.bind(this)

        this.events[MSGCode.OP_ENCHANT_S] = this.onNetRune.bind(this)

        this.events[MSGCode.OP_WASH_HERO_S] = this.onNetHeroXl.bind(this)

        this.events[MSGCode.OP_HERO_UP_LEVEL_S] = this.onNetHeroUpLevel.bind(this)

        this.events[MSGCode.OP_SKILL_UNLOCK_S] = this.onNetSkillUnlock.bind(this)


        this.events[MSGCode.OP_HERO_RELATE_LIST_S] = this.onNetRelateList.bind(this)
        this.events[MSGCode.OP_HERO_AID_LIST_S] = this.onNetRekateAidList.bind(this)
        this.events[MSGCode.OP_USE_HEROAID_S] = this.onNetRelateAid.bind(this)
        this.events[MSGCode.OP_RELATE_REDTIP_S] = this.onNetRelateRed.bind(this)

        this.events[MSGCode.OP_HERO_SKIN_SET_S] = this.onNetSkinSet.bind(this)
        this.events[MSGCode.OP_CHIP_TO_HEROCOIN_S] = this.onNetChipExchange.bind(this)
        
        this.events[MSGCode.OP_POOL_HERO_SYNC] = this.onPoolHeroInfoSync.bind(this)
        this.events[MSGCode.OP_POOL_ACTION_S] = this.onPoolActions.bind(this)
        this.events[MSGCode.OP_HERO_DYN_INFO_S] = this.onNetHeroDynInfo.bind(this)
        this.events[MSGCode.OP_HERO_LOCK_S] = this.onNetHeroLock.bind(this)
        this.events[MSGCode.OP_HERO_WEAPON_S] = this.onHeroWeaponRet.bind(this)
    },
    onNetHeroLock(args){
        var hero = Gm.heroData.getHeroById(args.heroId)
        hero.lock = args.lock
        Gm.floating(args.lock?Ls.get(5286):Ls.get(5287))
    },
    onNetHeroDynInfo(args){
        Gm.ui.create("TeamListView",{isOther:true,heroData:Gm.heroData.toHeroInfo(args.heroInfo)})
    },
    onPoolHeroInfoSync:function(args){
        Gm.heroData.poolInfo = args.poolInfo || [{heroId:0,unloadTime:0}]
        Gm.heroData.coinUnlock = args.coinUnlock || 1
        Gm.heroData.crystalLevel = args.crystalLevel || 0
        Gm.heroData.stage = args.stage || 0
        Gm.heroData.getPoolLay()
    },
    onPoolActions:function(args){
        if (args.action == ConstPb.HeroPoolAction.RESET_HERO){
            Gm.ui.removeByName("HeroReLevel")
            Gm.ui.removeByName("HeroReLevelNew")
            var tmpHero = Gm.heroData.getHeroById(Gm.heroNet.poolHero)
            if (tmpHero){
                tmpHero.level = 1
                tmpHero.unlockSkillList = []
            }
            Gm.red.refreshEventState("heroSkill",Gm.heroNet.poolHero)
            Gm.heroData.getPoolLay()
            Gm.send(Events.LEVELUP_HERO,{heroId:Gm.heroNet.poolHero})
            Gm.send(Events.UPDATE_HERO,{heroId:Gm.heroNet.poolHero,isSkill:true})
        }else if(args.action == ConstPb.HeroPoolAction.UNLOCK_SITE){
            if (!Gm.heroData.m_bIsDiam){
                Gm.heroData.coinUnlock++
            }
            Gm.ui.removeByName("HeroReLevel")
            Gm.ui.removeByName("HeroReLevelNew")
            Gm.heroData.poolInfo.push({heroId:0,unloadTime:0})
            Gm.send(Events.CRYSTAL_RET,{type:1})
        }else if(args.action == ConstPb.HeroPoolAction.LAY_HERO){
            Gm.ui.removeByName("CrystalLayView")
            var idx = Gm.heroNet.poolIdx - 1
            Gm.heroData.poolInfo[idx].heroId = Gm.heroNet.poolHero
            Gm.heroData.poolInfo[idx].unloadTime = Gm.userData.getTime_m()
            Gm.send(Events.CRYSTAL_RET,{type:2,idx:idx})
            Gm.red.refreshEventState("heroSkill",Gm.heroNet.poolHero)
        }else if(args.action == ConstPb.HeroPoolAction.UNLOAD_HERO){
            Gm.ui.removeByName("HeroReLevel")
            Gm.ui.removeByName("HeroReLevelNew")
            var idx = Gm.heroNet.poolIdx - 1
            Gm.heroData.poolInfo[idx].heroId = 0
            Gm.heroData.poolInfo[idx].unloadTime = Gm.userData.getTime_m()

            var tmpHero = Gm.heroData.getHeroById(Gm.heroNet.poolHero)
            if (tmpHero){
                tmpHero.skillList = []
                tmpHero.unlockSkillList = []
            }
            Gm.send(Events.CRYSTAL_RET,{type:4,idx:idx})
            Gm.red.refreshEventState("heroSkill",Gm.heroNet.poolHero)
        }else if(args.action == ConstPb.HeroPoolAction.REFRESH_COOL){
            Gm.ui.removeByName("HeroReLevel")
            Gm.ui.removeByName("HeroReLevelNew")
            var idx = Gm.heroNet.poolIdx - 1
            Gm.heroData.poolInfo[idx].heroId = 0
            Gm.heroData.poolInfo[idx].unloadTime = 0
            Gm.send(Events.CRYSTAL_RET,{type:3,idx:idx})
        }else if(args.action == ConstPb.HeroPoolAction.UP_LEVEL_CRYSTAL){
            Gm.floating(Ls.get(8002))
            Gm.heroData.m_iPoolLevel = Gm.heroData.crystalLevel = Gm.heroNet.m_iNextLevel
            Gm.heroData.stage = Gm.heroNet.m_iNextStage
            Gm.send(Events.CRYSTAL_MAX)
            Gm.activityData.showLimitGift()
        }
    },
    onNetChipExchange:function(args){
        Gm.floating(Ls.get(3004))
    },
    onNetSkinSet(args){
        var hero = Gm.heroData.getHeroById(args.heroId)
        hero.setSkin(args.skin)
    },
    onNetRelateList(args){
        Gm.heroData.setRelates(args.heroRelateGroup)
        Gm.send(Events.RELATE_UPDATE)
    },
    onNetRekateAidList(args){
        args.idGroup = Gm.heroNet.idGroup
        Gm.ui.create("RelateActiveView",args)
    },
    onNetRelateAid(args){
        Gm.heroData.setRelateGroup(args.heroRelateGroup[0])
        Gm.send(Events.RELATE_UPDATE)
    },
    onNetRelateRed(args){
        if (args.isClear==1){
            Gm.heroData.relateReds = []
        }
        if (args.heroRelateGroup){
            Gm.heroData.setRelateReds(args.heroRelateGroup)
        }
        Gm.red.refreshEventState("relate")
    },
    onNetSkillUnlock:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            tmpHero.unlockSkillList.push(args.skillId)
        }
        Gm.send(Events.UNLOCK_SKILL,args)
    },
    onNetHeroUpLevel:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            if (Gm.heroNet.willLevel){
                tmpHero.level = Gm.heroNet.willLevel
            }else{
                tmpHero.level = tmpHero.level + 1
            }
            var tmpRet = Gm.heroData.getPoolLay()
            if (Gm.heroData.m_iPoolLevel == Gm.config.getPoolMax()){
                for(const i in tmpRet.tops){
                    tmpRet.tops[i].level = 1
                    Gm.heroData.poolInfo.unshift({heroId:tmpRet.tops[i].heroId,unloadTime:0})
                }
                Gm.heroData.crystalLevel = Gm.heroData.m_iPoolLevel
                Gm.heroData.coinUnlock+=tmpRet.tops.length
            }
        }
        Gm.red.refreshEventState("heroSkill",args.heroId)
        Gm.send(Events.LEVELUP_HERO,{heroId:args.heroId})
    },
    onQualityInfo:function(args){
        Gm.send(Events.FLYTO_HERO,args)
    },
    onHeroRiseQuality:function(args){

        var heroList = []
        for (var a = 0; a < args.infos.length; a++) {
            var newData = args.infos[a]

            for (let index = 0; index < newData.consumeHeroIds.length; index++) {
                const v = newData.consumeHeroIds[index];
                Gm.heroData.removeHero(v)
            }
            
            var tmpHero = Gm.heroData.getHeroById(newData.heroId)
            if (tmpHero){
                // var tmpHero = Gm.heroData.getHeroById(newData.heroId)
                const needList = [100,102,106,110,111,114,523]
                var fly_list = []
                for(const j in needList){
                    var tmpNew = 0
                    var tmpOld = 0
                    for(const k in newData.attribute){
                        if (newData.attribute[k].attrId == needList[j]){
                            tmpNew = newData.attribute[k].attrValue
                            break
                        }
                    }
                    for(const k in tmpHero.attribute){
                        if (tmpHero.attribute[k].attrId == needList[j]){
                            tmpOld = tmpHero.attribute[k].attrValue
                            break
                        }
                    }
                    if (tmpOld != tmpNew){
                        fly_list.push({id:needList[j],oldValue:tmpOld,newValue:tmpNew})
                    }
                }
                tmpHero.qualityId = newData.qualityId
                tmpHero.setAttrValue(newData.attribute,true)

                var heroConf = Gm.config.getHero(tmpHero.baseId,tmpHero.qualityId)
                tmpHero.skin = heroConf.skin_id
                if (heroConf.quality == Gm.config.getConst("hero_quality_lock")){
                    tmpHero.lock = true
                }
                if(tmpHero.qualityId % 100 > ExcWeaponFunc.getWeaponOpenQuility() && heroConf.weaponId){
                     Gm.heroData.setWeaponLevel(tmpHero.heroId,Gm.heroData.getWeaponLevel(tmpHero.heroId))
                }

                if (args.infos.length == 1){
                    // Gm.ui.create("UnLockHero",{qualityId:newData.qualityId,isFly:true})
                }else{
                    tmpHero.itemType = ConstPb.itemType.ROLE
                    heroList.push(tmpHero)
                }

                Gm.villaData.addVillaQualityId(tmpHero.baseId,tmpHero.qualityId)
            }
        }
        if (heroList.length > 0){
            Gm.receive(heroList)
        }
        Gm.ui.removeByName("HeroFlyAutoView")
        
        Gm.red.refreshEventState("heroFlyTo")
        args.isPlay = true
        Gm.red.refreshHero()
        Gm.send(Events.FLYTO_HERO,args)
        //武将升阶不换头像
        // if(!Gm.heroData.getHeroByQualityId(Gm.userInfo.head)){
        //     var tmpData = Gm.heroData.getAll()
        //     Gm.playerNet.changeHead(1,tmpData[0].qualityId)
        // }
    },
    onNetHeroReser(args){
        Gm.heroData.setReserv({baseId:args.baseId,reservation:true})
    },
    onNetHeroReserInfo(args){
       
        Gm.heroData.setReserv(args)
    },
    onNetHeroTune:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            var tuneLevel = args.tuneLevel || tmpHero.tuneLevel
            var tuneIntimacy = tmpHero.tuneIntimacy
            if (args.tuneIntimacy >= 0){
                tuneIntimacy = args.tuneIntimacy
            }
            var tuneRate = tmpHero.tuneRate
            if (args.tuneRate >= -1){
                tuneRate = args.tuneRate
            }
            tmpHero.setData({tuneLevel:tuneLevel,tuneIntimacy:tuneIntimacy,tuneRate:tuneRate})
        }
        var tmpName = "TuneView"
        var layer = Gm.ui.getLayer(tmpName)
        if(layer && layer.active){
            layer.getComponent(tmpName).updateView(tmpHero)
        }
    },
    onNetHeroUnlock:function(args){
        // Gm.heroData.initHero(args.infoList)
        // //新获得武将存入拼图内
        // Gm.pictureData.addNewHeros(args.infoList)

        // Gm.red.refreshEventState("heroNew")
        // Gm.send(Events.BAG_UPDATE)
        // if(!Gm.lotteryData.pauseUnlock){
        //     Gm.ui.create("UnLockHero",{baseId:args.infoList[0].baseId})
        // }
    },
    onCulture:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            var tmpList = []
            for(const i in args.curAttribute){
                for(const j in tmpHero.cultureAttribute){
                    if (tmpHero.cultureAttribute[j].attrId == args.curAttribute[i].attrId){
                        var tmpValue = tmpHero.cultureAttribute[j].attrValue || 0
                        tmpList.push({attrId:args.curAttribute[i].attrId,attrValue:args.curAttribute[i].attrValue - tmpValue})
                    }
                }
            }
            Gm.heroData.setLocalCultrue(tmpList)
        }
        Gm.heroData.saveCultrue(args.curAttribute,args.heroId)
        // if (args.newAttribute && args.newAttribute.length > 0){
        //     Gm.heroData.setLocalCultrue(args.newAttribute)
        // }
        Gm.send(Events.CULTRUE_HERO,args)
    },
    onCultureSave:function(args){
        if (args.heroId){
            Gm.heroData.saveLocalCultrue(args.heroId)
        }else{
            Gm.heroData.setLocalCultrue()
        }
        Gm.send(Events.CULTRUE_HERO,{})
    },
    onLogicSuss:function(){
        Gm.heroData.clearData()
        Gm.heroNet.getHero()
        Gm.heroNet.getLineHero()
    },
    onNetHeroInfos:function(args){
        Gm.heroData.initHero(args.infoList)
        Gm.heroData.initHeroChip(args.heroChipList)
        Gm.heroData.initUnLockHero(args.unlockHero)
        if (args.heroId != 0 ){
            Gm.send(Events.All_FIGHT_UPDATE)
            Gm.send(Events.UPDATE_HERO,{heroId:args.heroId})
        }
        Gm.red.refreshEventState("heroFlyTo")
    },
    onNetLineHero:function(args){
        if (args.targetId){
            var arenaInfoBox = Gm.ui.getScript("ArenaInfoBox")
            if (arenaInfoBox){
                arenaInfoBox.setLineHero(args)
            }else{
                if (args.heroInfo.length == 0){
                    Gm.floating(Ls.get(8003))
                    return
                }
                if (Gm.heroNet.readyData){
                    Gm.heroNet.readyData = null
                    var fightteam = Gm.ui.getScript("FightTeamView")
                    if (fightteam){
                        fightteam.setEnemyTeam(args)
                    }
                }else{
                   // Gm.floating("需要新阵营界面")
                }
            }

            // if (Gm.heroNet.lineType == ConstPb.lineHero.LINE_BOSS){
            //     if (arenaInfoBox){
            //         var arenaInfoBox = Gm.ui.getScript("ArenaInfoBox")
            //         arenaInfoBox.setLineHero(args)
            //     }
            // }else{
            //     if (args.heroInfo.length == 0){
            //         Gm.floating(Ls.get(8003))
            //         return
            //     }
            //     if (Gm.heroNet.readyData){
            //         Gm.heroNet.readyData = null
            //         var fightteam = Gm.ui.getScript("FightTeamView")
            //         if (fightteam){
            //             fightteam.setEnemyTeam(args)
            //         }
            //     }else{
            //         var arenaInfoBox = Gm.ui.getScript("ArenaInfoBox")
            //         if (arenaInfoBox){
            //             arenaInfoBox.setLineHero(args.lineHero)
            //         }else{
            //             Gm.floating("需要新阵营界面")
            //         }
            //     }
            // }
        }else{
            Gm.heroData.initLineHeros(args.lineHero)
            Gm.heroData.initHero(args.heroInfo)
            Gm.send(Events.All_FIGHT_UPDATE)
            Gm.red.refreshHero()
            Gm.red.refreshEventState("heroFlyTo")
        }
    },
    onNetGuaJiHero:function(args){
        Gm.heroData.setLineHero({type:Gm.heroNet.lineType,hero:Gm.heroNet.teamHeros})
        Gm.send(Events.All_FIGHT_UPDATE)
    },
    onAddJobPoint:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.info.heroId)
        if (tmpHero){
            tmpHero.setAttrValue(args.info.attribute)
            tmpHero.setData(args.info,"equipInfos")
        }
        Gm.send(Events.JOB_CHANGE,{hero:args.info})
        Gm.red.refreshEventState("heroJob")
        Gm.red.refreshEventState("heroSkill",args.info.heroId)
    },
    onRemoveJobPoint:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.info.heroId)
        if (tmpHero){
            tmpHero.setData(args.info,"equipInfos")
        }
        Gm.send(Events.JOB_CHANGE,{hero:args.info})
        Gm.red.refreshEventState("heroJob")
        Gm.red.refreshEventState("heroSkill",args.info.heroId)
    },
    onSkillSet:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero == null){
            return
        }
        if (tmpHero){
            tmpHero.setData({skillList:args.skillList})
        }
        Gm.red.refreshEventState("heroSkill",args.heroId)
        var tmpView = Gm.ui.getScript("SkillSetView")
        if (tmpView){
            tmpView.updateTops()
            tmpView.updateList()
        }
        Gm.send(Events.UPDATE_HERO,{heroId:args.heroId,isSkill:true})
    },
    onTrainRet:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            tmpHero.trainLevel = args.trainLevel
            tmpHero.trainExp = args.trainExp
        }
        Gm.send(Events.DRILL_HERO)
        // var tmpView = Gm.ui.getLayer("DrillView")
        // if (tmpView){
        //     tmpView.getComponent("DrillView").updateNow()
        // }
    },
    onAwakenRet:function(args){
        var tmpHero = Gm.heroData.getHeroById(args.heroId)
        if (tmpHero){
            tmpHero.awakenStage = args.awakenStage
        }
        Gm.send(Events.DRILL_HERO)
        // var tmpView = Gm.ui.getLayer("DrillView")
        // if (tmpView){
        //     tmpView.getComponent("DrillView").updateNow()
        // }
    },
    onHeroAttribute:function(args){
        var list = {fight:0,lastFight:0,attrList:[]}
        var hide = (args.heroInfo.length == 1)?args.hide:true
        var isReturn = false
        var isHelpHero = false
        for(const i in args.heroInfo){
            var tmpHero = Gm.heroData.getHeroById(args.heroInfo[i].heroId)
            if (tmpHero == null){
                tmpHero = Gm.bossTrialData.getHeroByHeroId(args.heroInfo[i].heroId)
                if (tmpHero){
                    isHelpHero = true
                }
            }
            if (tmpHero){
                let data = tmpHero.setAttrValue(args.heroInfo[i].attribute,hide)
                if (hide && !args.hide){
                    list.fight += data.fight
                    list.lastFight += data.lastFight
                    for(const j in data.attrList){
                        var tmpCan = true
                        for(const k in list.attrList){
                            if (list.attrList[k].attrId == data.attrList[j].attrId){
                                list.attrList[k].attrValue += data.attrList[j].attrValue
                                tmpCan = false
                                break
                            }
                        }
                        if (tmpCan){
                            list.attrList.push(data.attrList[j])
                        }
                    }
                }
            }else{
                isReturn = true
            }
        }
        if (isReturn){
            return
        }
        if (hide && !args.hide){
            Gm.showHeroAttr(list)
        }
        Gm.send(Events.All_FIGHT_UPDATE)
        Gm.send(Events.UPDATE_HERO,{heroId:args.heroId,isHelpHero:isHelpHero})
    },
    getEquip:function(){
        var equip
        // cc.log(Gm.equipNet.heroId,Gm.equipNet.equipId)
        if (Gm.equipNet.heroId == 0){
            equip = Gm.bagData.getEquitById(Gm.equipNet.equipId)
            
        }else{
            var hero = Gm.heroData.getHeroById(Gm.equipNet.heroId)
            equip = hero.getEquip(Gm.equipNet.equipId)
        }
        return equip
    },
    modifyEquip:function(attrValue,equip,attrType){
        equip = equip || this.getEquip()
        cc.log(equip)
        for (let index = 0; index < attrValue.length; index++) {
            const v = attrValue[index];
            for (let i = 0; i < equip.attrInfos.length; i++) {
                const v1 = equip.attrInfos[i];
                if (attrType == v1.attrGrade && v1.attrData.attrId == v.attrId){
                    v1.attrData.attrValue = v.attrValue 
                }
            }
        }
        return equip
    },
    onNetStrengthenEquip:function(args){
        var equip =  this.modifyEquip(args.attrData,null,1)
        equip.strength = args.strengthenLevel
        Gm.send(Events.All_FIGHT_UPDATE)
        Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.red.refreshHero()
    },
    onNetXlEquip:function(args){
        var equip =  this.modifyEquip(args.attrData,null,2)
        Gm.send(Events.All_FIGHT_UPDATE)
        Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
        Gm.send(Events.UPDATE_EQUIP,equip)
    },
    onNetGodlyFuse:function(args){
        var equip = this.getEquip()
        equip.secondGodlyAttrId = args.secondGodlyAttrId
        equip.secondGodlyLevel = args.secondGodlyLevel
        equip.secondGodlyExp = args.secondGodlyExp
        var targetEquip = Gm.bagData.getEquitById(Gm.equipNet.targetEquipId)
        targetEquip.godlyAttrId = 0
        targetEquip.starLevel = 0 
        for (let index = 0; index < targetEquip.attrInfos.length; index++) {
            const v = targetEquip.attrInfos[index];
            if (v.attrGrade == 3 && v.attrData.attrId == args.secondGodlyAttrId){
                equip.attrInfos.push(v)
                targetEquip.attrInfos.splice(index,1)
                break
            }
        }
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.send(Events.UPDATE_EQUIP,targetEquip)
        Gm.floating(Ls.get(8004))
    },  
    onNetGodlyDevour:function(args){
        var equip = this.getEquip()
        Func.dataMerge(equip,args.equipInfo)
        Gm.bagData.removeEquips(Gm.equipNet.targetEquipId)
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.showReward(args.returnItems)
    },
    onNetInherit:function(args){
        var equip = this.getEquip()
        var targetEquip
        if (Gm.equipNet.targetHeroId >0 ){
            var hero = Gm.heroData.getHeroById(Gm.equipNet.targetHeroId)
            targetEquip = hero.getEquip(Gm.equipNet.targetEquipId)
        }else{
            targetEquip = Gm.bagData.getEquitById(Gm.equipNet.targetEquipId)
        }

        for (let index = 0; index < args.equipInfo.length; index++) {
            const v = args.equipInfo[index];
            var newEquip = equip
            if (equip.equipId != v.equipId){
                newEquip = targetEquip
            }
            Func.dataMerge(newEquip,v)
        }
        Gm.showReward(args.returnItems)
        // Gm.send(Events.UPDATE_EQUIP,equip)
        // Gm.send(Events.UPDATE_EQUIP,targetEquip)
        // Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
        // Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.targetEquipId,isEquip:true})
    },
    onNetOpenGem:function(args){
        var equip = this.getEquip()
        for (let index = 0; index < equip.gemInfos.length; index++) {
            const v = equip.gemInfos[index];
            if (v.gemItemId == -1){
                v.gemItemId = 0
                break
            }
        }
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
    },
    onNetWearGem:function(args){
        var equip = this.getEquip()
        Func.dataMerge(equip,args.equipInfo)
        if (Gm.equipNet.gemType == 1){
            for (let index = 0; index < equip.gemInfos.length; index++) {
                const v = equip.gemInfos[index];
                if (v.pos == Gm.equipNet.pos){
                    v.gemItemId = Gm.equipNet.gemId
                }
            }
        }else if (Gm.equipNet.gemType == 2){
            for (let index = 0; index < equip.gemInfos.length; index++) {
                const v = equip.gemInfos[index];
                if (v.pos == Gm.equipNet.pos){
                    v.gemItemId = 0
                }
            }
        }else if (Gm.equipNet.gemType == 3){
            for (let index = 0; index < equip.gemInfos.length; index++) {
                const v = equip.gemInfos[index];
                if (v.gemItemId > 0){
                    v.gemItemId = 0
                }
            }
        }
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
    },
    onNetSuitUp:function(args){
        var equip = this.getEquip()
        if (args.score){
            equip.score = args.score
            equip.baseId = Gm.equipNet.nextEquipId


            var attrData = []
            for (var i = 0; i < args.attrInfos.length; i++) {
                var v = args.attrInfos[i]
                attrData[i] = {attrId:v.attrData.attrId,lastValue:v.attrData.attrValue,nowValue:v.attrData.attrValue}
            }
            
            for (let index = 0; index < equip.attrInfos.length; index++) {
                const v = equip.attrInfos[index];
                for (var i = 0; i < attrData.length; i++) {
                    if (attrData[i].attrId == v.attrData.attrId){
                        attrData[i].lastValue = v.attrData.attrValue
                    }
                }
                if(v.attrGrade == 3){
                    args.attrInfos.push(v)
                }
            }
            equip.attrInfos = args.attrInfos
            Gm.ui.create("EquipUpgradeAttrView",attrData)
        }
        
        equip.suitExp = args.suitExp
        Gm.send(Events.UPDATE_EQUIP,equip)
        Gm.send(Events.UPDATE_HERO,{heroId:Gm.equipNet.heroId,isEquip:true})
        // Gm.floating(Ls.get(8005))
        Gm.red.refreshEquipValue()
    },
    onNetRune(args){
        var equip = this.getEquip()
        equip.runeId = args.runeId
        equip.unlockTune.push(args.runeId)
        Gm.send(Events.UPDATE_EQUIP,equip)
    },
    onNetHeroXl(args){
        var hero = Gm.heroData.getHeroById(Gm.heroNet.heroId)
        for (let index = 0; index < args.attrData.length; index++) {
            const v = args.attrData[index];
            var dd = Func.forBy(hero.cultureAttribute,"attrId",v.attrId)
            dd.attrValue = v.attrValue
        }
    },
    //专属武器
    onHeroWeaponRet(data){
        if(data && data.type == 1){
            this.onExcWeaponUpgrade(data)
        }
        else if(data && data.type == 2){
            this.onExcWeaponReLevel(data)
        }
    },
    //专属武器升级
    onExcWeaponUpgrade(data){
        Gm.heroData.setWeaponLevel(data.heroId,Gm.heroData.getWeaponLevel(data.heroId) + 1)
        Gm.send(Events.UPDATE_EXCWEAPON_LEVEL)
        Gm.red.refreshEventState("heroExcWeapon")
        Gm.red.refreshEventState("heroExcWeaponRed")
    },
    //专属武器重置
    onExcWeaponReLevel(data){
        Gm.heroData.setWeaponLevel(data.heroId,1)
        Gm.send(Events.UPDATE_EXCWEAPON_LEVEL)
        Gm.red.refreshEventState("heroExcWeapon")
        Gm.red.refreshEventState("heroExcWeaponRed")
    },
    //是否可以升级
    checkCanUpWeapon(hero){
        //检查是否解锁专属武器
        var q = hero.qualityId % 100
        if(q<=11){
            return false
        }
        //是否有专属武器
        var heroConfig = Gm.config.getHero(hero.baseId)
        if(!heroConfig || heroConfig.weaponId==0){
            return false
        }
        //检查等级上限
        var weaponLevel = Gm.heroData.getWeaponLevel(hero.heroId)
        var maxLevelNum = (q - 11) * 10
        if(weaponLevel == maxLevelNum){
            return false
        }
        //最大等级检查
        var maxLevel = Gm.config.getWeaponMaxLevel()
        if(weaponLevel  == maxLevel){
            return false
        }
        //检查是否材料充足
        var config = Gm.config.getHero(hero.baseId)
        var weaponUpConfig = Gm.config.getWeaponCostConfig(weaponLevel+1,config.camp)
        for(var i=0;i<weaponUpConfig.cost.length;i++){
                var dd = {attrId:weaponUpConfig.cost[i].id ,num:weaponUpConfig.cost[i].num}
                var num = 0
                if (dd.attrId){
                    num = Gm.userInfo.getCurrencyNum(dd.attrId)
                }
                if (dd.num > num){
                    return false
                }
        }
        return true
    },
    //检查是否可以显示红点
    checkShowRedSprite(hero){
         //检查是否解锁专属武器
        var q = hero.qualityId % 100
        if(q<=11){
            return false
        }
        //是否有专属武器
        var heroConfig = Gm.config.getHero(hero.baseId)
        if(!heroConfig || heroConfig.weaponId==0){
            return false
        }

       var oldYokeKey = Gm.userInfo.id + "" + hero.heroId + "oldYokeMinLevel"
       var oldYokeMinLevel = parseInt(cc.sys.localStorage.getItem(oldYokeKey) || 0)
       var yokeMinLevel = ExcWeaponFunc.getYokeMinLevel(hero.baseId,hero.heroId,false,hero)
        if(oldYokeMinLevel < yokeMinLevel && ExcWeaponFunc.isInArray(ExcWeaponFunc.getOpenYokeLevelArray(),yokeMinLevel)){
            return true
        }
        return false
    }
});
