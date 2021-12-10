//chrome-devtools://devtools/bundled/inspector.html?v8only=true&ws=192.168.3.91:6086/00010002-0003-4004-8005-000600070008
const TIPS_NONE = [203,2016,1007,1008,2007,2008,121,521,123,2001]
cc.Class({
    properties: {
        logics:[]
    },

    startGm:function(){
        console.log("------------gm.start--------------")
        this.initClass()

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("隐藏")
            this.send(Events.ENTER_HIDE)
        }.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("显示")
            this.send(Events.ENTER_SHOW)
        }.bind(this));
    },
    initClass:function(){
        this.initDefine()
        this.initStatic()
        this.initCore()
        this.initUtil()
        this.initModule()
        this.initNet()
        this.initUI()

        this.netLogic = this.getLogic("NetLogic")
    },
    //常量,挂在window身上，
    initDefine:function(){
        window.Events = require("Events")
        window.MSGCode = require("MSGCode")
        window.Globalval = require("Globalval")
        window.CryptoJS = require("CryptoJS")
        window.ConstPb = {} //PB对应的枚举

        // var jsencryptmin = require("jsencryptmin")
        // window.JSEncrypt = new jsencryptmin.JSEncrypt()
    },
    //常量类，挂在window身上
    initStatic:function(){
        window.Bridge = require("Bridge")
        window.Func = require("Func")
        window.Character = require("Character")
        window.Ls = require("Languages")
        
        window.EquipFunc = require("EquipFunc")
        window.AtyFunc = require("AtyFunc")
        window.ActionFunc = require("ActionFunc")
        window.TowerFunc = require("TowerFunc")
        window.PictureFunc = require("PictureFunc")
        window.HeroFunc = require("HeroFunc")
        window.LotteryFunc = require("LotteryFunc")
        window.DungeonFunc = require("DungeonFunc")
        window.EventFunc = require("EventFunc")

        window.FilterWord = require("FilterWord")
        window.OreFunc = require("OreFunc")
        window.HegemonyFunc = require("HegemonyFunc")
    },
    initCore:function(){
        this.events = this.createClass("CoreEvents")
        this.http = this.createClass("CoreHttp")
        this.config = this.createClass("AllConfig")
    },
    initUtil:function(){
        this.load = this.createClass("LoadUtil")
        this.audio = this.createClass("AudioUtil")
    },
    initModule:function(){
        //对应logic和data
        this.createModuleItem("Net") //网络
        this.createModuleItem("User") //角色
        this.createModuleItem("Login") //登录
        this.createModuleItem("Mission") //任务
        this.createModuleItem("Mail") //任务
        this.createModuleItem("Shop") //商城

        this.userInfo = this.createClass("UserInfo")
    },
    initNet:function(){
        //proto对应文件
        var nets = ["Player","CommonProto","Task","Shop","Sign"]
        for(var i = 0 ;i < nets.length;i++){
            this[ lFirst(nets[i]) + "Net"] = this.createClass(nets[i] + "Net")
        }
    },
    initUI:function(){
        this.scene = this.createClass("SceneManager")
        this.ui = this.createClass("UiManager")
        this.red = this.createClass("RedManager")
    },
    createModuleItem:function(name){
        var logic = this.createClass(name + "Logic")
        if (logic){
            logic.setLogicName(name + "Logic")
            this.addLogic(logic)
        }
        var data = this.createClass(name + "Data")
        if (data){
            this[ lFirst(name) + "Data" ] = data
        }
    },
    addLogic:function(logic){
        if (this.getLogic(logic.logicName) == undefined ){
            this.logics.push(logic)
        }else{
            console.log("已有逻辑-后续处理移除",logic.logicName)
        }
    },
    onNewDay(){
        cc.log("进入新一天")
        for(var i = 0 ; i < this.logics.length;i++){
            this.logics[i].onNewDay()
        }
    },
    createClass:function(name){
        try {
            var cla = require(name)
            if (cla){
                var clas = new cla()
                return clas
            }
        } catch (e) {
            cc.log("createClass:" + e);
        }
        return null
    },
    getPb:function(pbName){
        cc.log(this.netLogic.protoCode.pbList)
        return this.netLogic.protoCode.pbList[pbName]
    },
    getLogic:function(logicName){
        for(var i = 0 ; i < this.logics.length;i++){
            if (logicName == this.logics[i].logicName){
                return this.logics[i]
            }
        }
    },
    removeLogic:function(logicName){
        for(var i = 0 ; i < this.logics.length;i++){
            if (logicName == this.logics[i].logicName){
                this.logics[i].removeEvent()
                this.logics.splice(i,1)
                break
            }
        }
    },
    sendHttp:function(args){
        this.http.send(args)
    },
    sendCmdHttp:function(cmd,args){
        return this.netLogic.sendCmdHttp(cmd,args || {})
    },
    send:function(name,args){    
        var dd = {}
        dd.name = name
        dd.args = args==undefined?{}:args
        this.events.dispatchGlobalEvent(dd)
    },
    loading:function(text,isAnim){
        this.loadingView = this.getView("Loading")
        this.loadingView.zIndex = 9
        if (this.loadingView != null){
            this.loadingView.active = true
            var script = this.loadingView.getComponent("Loading")
            script.updateLabel(text || "",isAnim)
        }
    },
    removeLoading:function(){
        if (this.loadingView){
            this.loadingView.active = false
        }
    },
    box:function(data,callback){
        callback  = callback || function(type){ console.log(type)}
        data.callback = callback
        Gm.ui.create("MessageBox",data)
    },
    award:function(data){
        Gm.ui.create("AwardBox",data)
    },
    receive:function(data,title){
        Gm.ui.create("AwardShowView",{list:data,title:title})
    },
    removeBox:function(){
        var layer = this.ui.getLayer("MessageBox")
        if (layer){
            layer.active = false
        }
    },
    //临时方案
    getView:function(name){
        return this.scene.getView(name)
    },
    //临时方案
    getViewScript:function(name){
        var view = this.getView(name)
        if (view){
            return view.getComponent(name)
        }
    },
    
    loadSubpackage:function(pathName,callback){
        if (CC_PREVIEW || CC_QQPLAY) {
            callback()
            return
        }
        cc.loader.downloader.loadSubpackage(pathName, err => {
            if (err) {
                console.error(err);
                return;
            }
            callback()
        });
    },
    isWx:function(){
        if (cc.sys.platform == cc.sys.WECHAT_GAME){
            return true
        }
        return false
    },
    floating:function(text){
        cc.log(text,"wwwwww")
        if (typeof(text) == "number"){
            text = Ls.get(text)
        }
        if (text == null || text == ""){
            return
        }
        var itemPerfab = this.getView("Tips")
        var item = cc.instantiate(itemPerfab)
        item.active = true
        this.ui.base.addChild(item)
        item.zIndex = Gm.ui.getPath("Tips")[2]
        var label = item.getChildByName("New Label").getComponent(cc.RichText)
        label.string = text.toString()
        if (label._linesWidth[0] > 600){
            label.maxWidth = 600
        }
        var delayAc = cc.delayTime(1.5)
        var ac = cc.fadeOut(4)
        var func = cc.callFunc(function(){
            item.removeFromParent(true)
            item.destroy()
        }, this);
        // var func = cc.destroySelf()
        var acs = cc.sequence(delayAc,ac,func)
        item.runAction(acs)

        // console.log("floating",text)
    },
    showReward:function(list){
        list = list || []
        if (list.length ==0){
            return
        }
        var tmpReturn = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.itemType == ConstPb.itemType.PLAYER_ATTR){ //玩家属性转换道具表
                v.itemType = ConstPb.itemType.TOOL
            }
            var conf
            var color = "ffffff"
            if(v.itemType == ConstPb.itemType.EQUIP){
                conf = Gm.config.getEquip(v.baseId)
                switch(conf.quality){
                    case 2:
                        color = "30ff00"
                    break
                    case 3:
                        color = "00baff"
                    break
                    case 4:
                        color = "ff00f6"
                    break
                    case 5:
                        color = "ff9c00"
                    break
                }
            }else if (v.itemType == ConstPb.itemType.TOOL){
                conf = Gm.config.getItem(v.baseId)
                color = "fffd0e"
            }
            if (conf){
                var tmpCounts = v.count || v.itemCount
                tmpReturn.push({str:"<color=#ffffff>" + Ls.get(Ls.get(103)) +  "</c><color="+color+">【"+conf.name+"】x"+tmpCounts+"</c>"})
            }
        }
        this.showAttr(tmpReturn)
    },
    showAttr:function(list,isPlayer){
        var shuxing = this.ui.base.getChildByName("shuxing")
        if (shuxing){
            shuxing.removeFromParent(true)
            shuxing.destroy()
        }
        list = list || []
        var tmpLens = list.length
        if (tmpLens == 0){
            return
        }
        var tmpFontSize = 40
        var waittime1 = 0.05
        var waittime2 = 1
        var tmpPart = new cc.Node()
        var tmpCounts = 0
        for (let index = 0; index < tmpLens; index++) {
            const v = list[index];
            var tmpNode = cc.instantiate(this.getView("attrItem"))
            tmpNode.active = true
            var ttf = tmpNode.getChildByName("label").getComponent(cc.RichText)
            ttf.handleTouchEvent =false
            var tmpCan = true
            if (v.str){
                ttf.string = v.str
            }else if(v.attrId){
                for(const i in TIPS_NONE){
                    if (v.attrId == TIPS_NONE[i]){
                        tmpCan = false
                        break
                    }
                }
                var tmpName0
                if (isPlayer){
                    tmpName0 = Gm.config.getPlayerAttr(v.attrId)
                }else{
                    tmpName0 = Gm.config.getBaseAttr(v.attrId)
                }
                if (tmpName0){
                    var showValue = v.attrValue
                    if(tmpName0.percentage == 1){
                        showValue = v.attrValue/100 + "%"
                    }
                    if (v.attrValue > 0){
                        var textColor = "<outline color='#000000' width=2><color=#ffffff>%s<color=#F5FE00> +%s</c></c></outline>"
                        ttf.string = cc.js.formatStr(textColor,tmpName0.childTypeName,showValue)
                    }else{
                        var textColor = "<outline color='#000000' width=2><color=#ffffff>%s<color=#18FF00> %s</c></c></outline>"
                        ttf.string = cc.js.formatStr(textColor,tmpName0.childTypeName,showValue)
                    }
                }else{
                    // ttf.string = "属性"+v.attrId
                    tmpCan = false
                }
            }
            if (tmpCan){
                tmpNode.y = (tmpLens - tmpCounts) * tmpFontSize
                tmpNode.parent = tmpPart
                tmpNode.scaleX = 100
                tmpNode.scaleY = 0
                var delayAc1 = cc.delayTime(waittime1 * index)
                var ac = cc.scaleTo(waittime1,1).easing(cc.easeBackOut())
                var delayAc2 = cc.delayTime(waittime2)
                var func = cc.destroySelf()
                var acs = cc.sequence(delayAc1,ac,delayAc2,func)
                tmpNode.runAction(acs)
                tmpCounts = tmpCounts + 1
            }else{
                tmpNode.active = false
            }
        }
        tmpPart.y = -(tmpLens/3)*tmpFontSize
        tmpPart.zIndex = 20
        var delayAc = cc.delayTime(waittime1 * tmpLens + waittime2)
        var func = cc.callFunc(function(){
            tmpPart.removeFromParent(true)
            tmpPart.destroy()
        }, this);
        var acs = cc.sequence(delayAc,func)
        tmpPart.runAction(acs)
        this.ui.base.addChild(tmpPart,20,"shuxing")
    },
    showHeroAttr(data){
        for (var i = data.attrList.length - 1; i >= 0; i--) {
            var v = data.attrList[i]
            if (Func.indexOf(TIPS_NONE,v.attrId) >= 0){
                data.attrList.splice(i,1)
            }
        }
        if (data.fight == data.lastFight && data.attrList.length == 0){
            return
        }
        var sp = Gm.ui.getScript("HeroAttributeChangeView")
        if (sp){
            sp.updateView(data,false)
            return
        }
        if(Gm.ui.isExist("ExcWeaponMainView")){
            data.weaponNewSkill = ExcWeaponFunc.hasNewWeaponSkill(data.heroId)
        }
        Gm.ui.create("HeroAttributeChangeView",data)
    },
    showLevelUp:function(){
        if (Gm.userInfo.m_iDestLv && Gm.userInfo.m_iOldLv){
            console.log("AccountLevelUP===:",Gm.userInfo.m_iOldLv,Gm.userInfo.m_iDestLv)
            Gm.ui.create("AccountLevelUP",{player:[Gm.userInfo.m_iOldLv,Gm.userInfo.m_iDestLv]})
        }else{
            Gm.activityData.showLimitGift()
        }
    },
    //添加武将检查列表
    checkBagAddTeam:function(addSize, func){
        var curItemSize = Gm.heroData.getAll().length
        var maxBagSize = Gm.userInfo.heroBagSize
        if(curItemSize+addSize > maxBagSize){
            var data = {btnNum:1,msg:Ls.get(50130),ok:Ls.get(1007),title:Ls.get(500048)}
            Gm.box(data,(btnType)=>{
                if(btnType == 1){
                    var main = Gm.ui.getScript("MainView")
                    main.showTeam()
                    if(func){
                        func()
                    }
                }
            })
            return false
        }
        return true
    },
    //检查背包是否已满
    checkBagAddItem:function(addSize,isprint){
        var curItemSize =  Gm.bagData.getAllEquips().length
        var maxBagSize = Gm.userInfo.pocketSize
        if(curItemSize + addSize > maxBagSize){
            if(isprint){
                Gm.floating(Ls.get(5013))
            }
            return false
        }
        return true
    },
    showAttr1:function(list,isPlayer,tipsNone){
        var shuxing = this.ui.base.getChildByName("shuxing")
        if (shuxing){
            shuxing.removeFromParent(true)
            shuxing.destroy()
        }
        list = list || []
        var tmpLens = list.length
        if (tmpLens == 0){
            return
        }
        var tmpFontSize = 40
        var waittime1 = 0.05
        var waittime2 = 1
        var tmpPart = new cc.Node()
        var tmpCounts = 0
        for (let index = 0; index < tmpLens; index++) {
            const v = list[index];
            var tmpNode = cc.instantiate(this.getView("attrItem"))
            tmpNode.active = true
            var ttf = tmpNode.getChildByName("label").getComponent(cc.RichText)
            ttf.handleTouchEvent =false
            var tmpCan = true
            if (v.str){
                ttf.string = v.str
            }else if(v.attrId){
                for(const i in tipsNone){
                    if (v.attrId == tipsNone[i]){
                        tmpCan = false
                        break
                    }
                }
                var tmpName0
                if (isPlayer){
                    tmpName0 = Gm.config.getPlayerAttr(v.attrId)
                }else{
                    tmpName0 = Gm.config.getBaseAttr(v.attrId)
                }
                if (tmpName0){
                    var showValue = v.attrValue
                    if(tmpName0.percentage == 1){
                        showValue = v.attrValue/100 + "%"
                    }
                    if (v.attrValue > 0){
                        var textColor = "<outline color='#000000' width=2><color=#ffffff>%s<color=#F5FE00> +%s</c></c></outline>"
                        ttf.string = cc.js.formatStr(textColor,tmpName0.childTypeName,showValue)
                    }else{
                        var textColor = "<outline color='#000000' width=2><color=#ffffff>%s<color=#18FF00> %s</c></c></outline>"
                        ttf.string = cc.js.formatStr(textColor,tmpName0.childTypeName,showValue)
                    }
                }else{
                    // ttf.string = "属性"+v.attrId
                    tmpCan = false
                }
            }
            if (tmpCan){
                tmpNode.y = (tmpLens - tmpCounts) * tmpFontSize
                tmpNode.parent = tmpPart
                tmpNode.scaleX = 100
                tmpNode.scaleY = 0
                var delayAc1 = cc.delayTime(waittime1 * index)
                var ac = cc.scaleTo(waittime1,1).easing(cc.easeBackOut())
                var delayAc2 = cc.delayTime(waittime2)
                var func = cc.destroySelf()
                var acs = cc.sequence(delayAc1,ac,delayAc2,func)
                tmpNode.runAction(acs)
                tmpCounts = tmpCounts + 1
            }else{
                tmpNode.active = false
            }
        }
        tmpPart.y = -(tmpLens/3)*tmpFontSize
        tmpPart.zIndex = 20
        var delayAc = cc.delayTime(waittime1 * tmpLens + waittime2)
        var func = cc.callFunc(function(){
            tmpPart.removeFromParent(true)
            tmpPart.destroy()
        }, this);
        var acs = cc.sequence(delayAc,func)
        tmpPart.runAction(acs)
        this.ui.base.addChild(tmpPart,20,"shuxing")
    },
});

