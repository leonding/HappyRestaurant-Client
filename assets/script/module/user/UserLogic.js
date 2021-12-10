var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        
    },
    register:function(){
        this.events[Events.ENTER_VIEW]          = this.onEnterView.bind(this)
        this.events[Events.POPUP_VIEW]          = this.onPopupView.bind(this)
        
        this.events[Events.SOCKET_CLOSE]        = this.onSocketClose.bind(this)

        this.events[MSGCode.OP_PUSH_REWARD_S]        = this.onNetReward.bind(this)
        this.events[MSGCode.OP_PUSH_CONSUMEITEM_S]   = this.onNetConsumeItem.bind(this)

        this.events[MSGCode.OP_PLAYER_CHANGE_NAME_S]   = this.onNetChangeName.bind(this)
        this.events[MSGCode.OP_PLAYER_SIGN_S]   = this.onNetChangeSign.bind(this)
        this.events[MSGCode.OP_CHANGE_HEAD_S]   = this.onChangeHeadRet.bind(this)
        this.events[MSGCode.OP_CDK_REWARD_S]   = this.onNetCdk.bind(this)
        this.events[MSGCode.OP_SAVE_NAME_AQQ_INFO_S] = this.onNetPushSave.bind(this)
    },
    onNewDay(){
        this.dayEndTime = 0
    },
    onNetCdk(args){
        Gm.ui.removeByName("CdkView")
    },
    onChangeHeadRet:function(args) {
        if (args.type == 1){
            Gm.userInfo.head = args.headId
        }
        if(args.type == 3 ){
            Gm.userInfo.homeHero = args.headId
        }
        Gm.ui.removeByName("ChangeHead")
        Gm.ui.removeByName("ChangeGoddess")
        if(args.type == 3){
            Gm.send(Events.USER_LIHUI_UPDATE,args)
        }else{
            Gm.send(Events.USER_INFO_UPDATE)
        }
        Gm.loginData.addServerHistory(Gm.loginData.lastServers.slice(-1)[0], Gm.loginData.getDeviceId(), Gm.userInfo.head, Gm.userInfo.name)
    },
    //奖励
    onNetReward:function(args){
        var conf = Gm.config.getRewardShowConfig(args.actionType) || {}
        if(args.actionType == null){
            conf = {showType:args.flag}
        }

        var show = []
        if(args.attrInfos && args.attrInfos.length > 0 ){//属性更改
            for (let index = 0; index < args.attrInfos.length; index++) {
                const v = args.attrInfos[index];
                if (conf.showType == 1){
                    show.push({attrId:v.attr || v.allianceAttr,attrValue:v.count})
                }else if(conf.showType == 3){
                    if (v.attr != 2003){
                        show.push({itemType:ConstPb.itemType.TOOL,count:v.count,baseId:v.attr || v.allianceAttr})
                    }
                }
                if (v.attr){
                    Gm.userInfo.modifyData(v,true)
                }else{
                    Gm.unionData.modifyData(v,true)
                }
            }
            Gm.send(Events.USER_INFO_UPDATE)
            Gm.send(Events.UNION_INFO_UPDATE)
            Gm.red.refreshEventState("activity")
        }
        if (args.items && args.items.length > 0){//道具更改
            var isBag = true
            var isEquip = false
            var isHero = false
            for (let index = 0; index < args.items.length; index++) {
                const v = args.items[index];
                if(v.itemType == ConstPb.itemType.EQUIP){
                    Gm.bagData.addEquip(v.equipInfo)
                    isEquip = true
                }else if (v.itemType == ConstPb.itemType.TOOL){
                    Gm.red.pushItem(v)
                    var item = Gm.bagData.getNewItem(v.id,v.baseId,v.itemCount)
                    Gm.bagData.changeItem(item)
                }else if (  v.itemType == ConstPb.itemType.HERO_CHIP){
                    Gm.heroData.changeChip({baseId:v.id,num:v.itemCount})
                }else if (v.itemType == ConstPb.itemType.HERO_CARD){
                    Gm.heroData.initHero([v.heroInfo])
                    Gm.pictureData.addNewHeros([v.heroInfo])
                    Gm.heroData.addUnLockHero([v.heroInfo])
                    Gm.unionData.addNewHeros([v.heroInfo])
                    Gm.villaData.addVillaQualityId(v.heroInfo.baseId,v.heroInfo.qualityId)
                    v.actionType = args.actionType
                    isBag = false
                    isHero = true
                }else if (v.itemType == ConstPb.itemType.HERO_SKIN){
                    Gm.userInfo.addSkin(v.baseId)
                    var skinConf = Gm.config.getSkin(v.baseId)
                    Gm.ui.create("UnLockHero",{qualityId:v.baseId,skinConf:skinConf})
                    if(skinConf.type == 1){ //运营活动可以购买的皮肤
                        skinConf = Gm.config.getGroupHeroBySkin(skinConf.id)
                    }
                    var heroConf = Gm.config.getHero(skinConf.idGroup || skinConf[0].idGroup)
                    var showData = {}
                    showData.itemType = ConstPb.itemType.HERO_SKIN
                    showData.baseId = heroConf.qualityProcess[heroConf.qualityProcess.length-1]
                    showData.skinId = v.baseId
                    show.push(showData)
                    continue
                }
                show.push(v)
            }
            // if (args.flag == 1){
            //     Gm.receive(args.items)
            // }
            if (isEquip){
                Gm.red.refreshEquip()
            }else{
                Gm.red.refreshEventState("bag")
                Gm.red.refreshEquipValue()
            }
            if (isHero){
                Gm.red.refreshEventState("heroFlyTo")    
                Gm.red.refreshEventState("villa")
            }
            Gm.red.refreshEventState("heroNew")
            if (isBag){
                Gm.send(Events.BAG_UPDATE)
            }
        }
        if (show.length > 0){
            if (conf.showType == 1){
                Gm.showAttr(show,true)
            }else if(conf.showType == 3){
                Gm.receive(show,conf.titleName)
            }
        }
    },
    onNetConsumeItem:function(args){
        if(args.consumeAttrInfo && args.consumeAttrInfo.length > 0 ){//属性更改
            for (let index = 0; index < args.consumeAttrInfo.length; index++) {
                const v = args.consumeAttrInfo[index];
                if(v.attr){
                    Gm.userInfo.modifyData(v)
                }else{
                    Gm.unionData.modifyData(v)
                }
            }
            Gm.send(Events.USER_INFO_UPDATE)
            Gm.send(Events.UNION_INFO_UPDATE)
        }
        if (args.consumeItem && args.consumeItem.length >0){
            for (let index = 0; index < args.consumeItem.length; index++) {
                const v = args.consumeItem[index];
                if(v.itemType == ConstPb.itemType.TOOL){
                    Gm.bagData.subItem(v)
                }else if (v.itemType == ConstPb.itemType.EQUIP){
                    Gm.bagData.removeEquips(v.id)
                }else if (v.itemType == ConstPb.itemType.HERO_CHIP){
                    v.num = v.count
                    Gm.heroData.subChip(v)
                }
            }
            Gm.red.refreshEquip()
            Gm.send(Events.BAG_UPDATE)
        }
    },
    onEnterView:function(args){
        var tmpViewName = args.type + "View"
        Gm.ui.create(tmpViewName,args,function(aa){
            Gm.send(Events.ENTER_VIEW_DONE,args)
        })
    },
    onPopupView:function(args){
        Gm.ui.create(args.viewName,args.data)
    },
    onSocketClose:function(args){
        this.dayEndTime = 0
        //断开连接-清除数据
        Gm.userData.clearTime()
    },
    onNetChangeName(args){
        Gm.userInfo.isChangeName = Gm.userInfo.isChangeName + 1
        Gm.userInfo.name = Gm.playerNet.newName
        Gm.send(Events.USER_INFO_UPDATE)
        Gm.ui.removeByName("NameChangeView")
    },
    onNetChangeSign(args){
        Gm.userInfo.signature = Gm.playerNet.newSign
        Gm.send(Events.USER_INFO_UPDATE)
        Gm.ui.removeByName("SignChangeView")
    },
    onNetPushSave(args){
        Gm.userData.setPushSwitch(args.close)
        Gm.userData.setShowHeroLine(args.showHeroLine)
    },
});
