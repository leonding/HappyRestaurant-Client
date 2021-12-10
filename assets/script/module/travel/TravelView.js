var BaseView = require("BaseView")
// TravelView
const TRAVEL_SELF = 1
const TRAVEL_TEAM = 2

cc.Class({
    extends: BaseView,

    properties: {
        btnFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        itemPerfab: cc.Prefab,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        m_oTravelTime:cc.Label,
        m_oBtnSelf:cc.Button,
        m_oBtnTeam:cc.Button,
        m_oBtnUsed:cc.Button,

        m_oBtnNode:{
            default: [],
            type: cc.Node,
        },
        // m_oSeletSpr:cc.Node,
        selectType:-1,
        m_oBlankTipNode:cc.Node,//空白页提示
    },
    onLoad(){
        this._super()
        Gm.red.add(this.m_oBtnNode[0],"travel",TRAVEL_SELF)
        Gm.red.add(this.m_oBtnNode[1],"travel",TRAVEL_TEAM)
        if (Gm.config.getVip().oneKey == 1){
            Gm.red.add(this.m_oBtnSelf.node,"travel",TRAVEL_SELF)
            Gm.red.add(this.m_oBtnTeam.node,"travel",TRAVEL_TEAM)
        }
        this.addTimes()
    },
    enableUpdateView:function(args){
        if (args){
            this.select(this.m_iDestPage || TRAVEL_SELF)
        }
    },
    updateList:function(isTips){
        var tmpData = Gm.travelData.getData(this.selectType)
        var time = Gm.userData.getTime_m()
        tmpData.sort(function(a,b){
            var at = 0
            var adone = false
            var bt = 0
            var bdone = false
            if (a.startTime){
                at = a.config.time - Math.floor((time - a.startTime)/1000)
                adone = (at <= 0 || a.finishTime)
            }
            if (b.startTime){
                bt = b.config.time - Math.floor((time - b.startTime)/1000)
                bdone = (bt <= 0 || b.finishTime)
            }
            if (adone || bdone){
                if (adone && bdone){
                    if (a.config.star != b.config.star){
                        return b.config.star - a.config.star
                    }else{
                        return b.index - a.index
                    }
                }
                if (adone){
                    return -1
                }
                if (bdone){
                    return 1
                }
            }else{
                if (a.startTime && b.startTime){
                    return at - bt
                }
                if (a.startTime){
                    return 1
                }
                if (b.startTime){
                    return -1
                }
                if (a.config.star != b.config.star){
                    return b.config.star - a.config.star
                }else{
                    return b.index - a.index
                }
            }
        })
        // console.log("tmpData===:",tmpData)
        Func.destroyChildren(this.scrollView.content)
        this.items = []
        var reward = false // 一键领奖
        var wordto = false // 一键委派
        if (tmpData && tmpData.length > 0){
            Gm.ui.simpleScroll(this.scrollView,tmpData,function(data,tmpIdx){
                var item = cc.instantiate(this.itemPerfab)
                this.scrollView.content.addChild(item)
                var tmpSpt = item.getComponent("TravelCell")
                tmpSpt.setOwner(this,data)
                this.items.push(tmpSpt)
                if (tmpSpt.m_iType == 2){
                    reward = true
                }
                if (tmpSpt.m_iType == 0){
                    wordto = true
                }
                return item
            }.bind(this))
            
            var nums = this.getRefreshCount()
            var total = this.getRefreshTotal()
        }else{
            if (!Gm.travelData.refreshDailyTime){
                Gm.travelNet.sendTravelOpen()
            }
        }
        this.scrollView.scrollToTop()
        if (this.selectType == TRAVEL_SELF){
            this.m_oBtnSelf.node.active = true
            this.m_oBtnTeam.node.active = false
        }else{
            this.m_oBtnSelf.node.active = false
            this.m_oBtnTeam.node.active = true
        }
        this.checkBlank(tmpData, this.selectType)
        this.updateOneKey(reward,wordto)
        if (isTips){
            Gm.floating(Ls.get(600020))
        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            for(const i in this.m_oBtnNode){
                // if (checkint(i) == this.selectType - 1){
                //     this.m_oSeletSpr.x = this.m_oBtnNode[i].x
                // }
                var spr = this.m_oBtnNode[i].getChildByName("selectSpr")
                spr.active = (checkint(i) == this.selectType - 1)
            }
            this.sendBi()
            this.updateList()
        }
    },
    onBtnUpdate:function(){
        var type = this.m_iOKTeam
        if (this.selectType == TRAVEL_SELF){
            type = this.m_iOKSelf
        }
        if (type == 1){
            var list = []
            var tmpData = Gm.travelData.getData(this.selectType)
            var userTime = Gm.userData.getTime_m()
            for(const i in tmpData){
                const data = tmpData[i]
                if (data.startTime){
                    var pass = Math.floor((userTime - data.startTime)/1000 )
                    var time = data.config.time - pass
                    if (time <= 0 || data.finishTime){
                        list.push(data.index)
                    }
                }
            }
            // for(const i in this.items){
            //     if (this.items[i].m_oData && this.items[i].m_iType == 2){
            //         list.push(this.items[i].m_oData.index)
            //     }
            // }
            Gm.travelNet.sendTravelReceive(list)
        }else if(type == 2){
            var list = []
            var max = this.getTotalCount()
            var num = 0
            for(const i in this.items){
                if (this.items[i].m_iType == 0){
                    list.push(this.items[i].m_oData)
                    num++
                    if (num == max){
                        break
                    }
                }
            }
            if (this.selectType == TRAVEL_TEAM){
                Gm.travelNet.sendTravelAidList({list:list,type:this.selectType})
            }else{
                Gm.ui.create("TravelOneKey",{list:list,type:this.selectType})
            }
        }
    },
    onBtnUsed:function(){
        Gm.ui.create("TravelUsed",this.selectType)
    },
    onCloseClick:function(){
        this.onBack()
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        var tmpDaily = Gm.travelData.getDailyTime()
        if (tmpDaily == 0){
            Gm.travelData.refreshDailyTime = 0
            Gm.travelNet.sendTravelDailyRefresh()
        }
        var tmpTime = Gm.travelData.getTaskTime()
        if (tmpTime > 0){
            this.m_oTravelTime.string = Func.timeToTSFM(tmpTime)
        }else{
            this.m_oTravelTime.string = Ls.get(600056)
            if (tmpTime == 0){
                Gm.travelData.refreshTaskTime = 0
                Gm.travelNet.sendTravelTaskRefresh(1,this.selectType == TRAVEL_TEAM)
            }
        }
        var reward = false // 一键领奖
        var wordto = false // 一键委派
        for(const i in this.items){
            this.items[i].updateTime()
            if (this.items[i].m_iType == 2){
                reward = true
            }
            if (this.items[i].m_iType == 0){
                wordto = true
            }
        }
        this.updateOneKey(reward,wordto)
    },
    updateOneKey:function(reward,wordto){
        var tmpKey = 0
        if (reward){
            tmpKey = 1
        }else if(wordto){
            tmpKey = 2
        }
        if (Gm.config.getVip().oneKey == 0){
            tmpKey = 3
        }
        var btn = this.m_oBtnTeam
        var type = this.m_iOKTeam
        if (this.selectType == TRAVEL_SELF){
            btn = this.m_oBtnSelf
            type = this.m_iOKSelf
        }
        if (type != tmpKey){
            type = tmpKey
            if (this.selectType == TRAVEL_SELF){
                this.m_iOKSelf = tmpKey
            }else{
                this.m_iOKTeam = tmpKey
            }
            var spr = btn.node.getComponent(cc.Sprite)
            var lab = btn.node.getChildByName("Label").getComponent(cc.Label)
            var tip = btn.node.getChildByName("tips").getComponent(cc.Label)
            tip.string = ""
            switch(tmpKey){
                case 1:
                    spr.spriteFrame = this.btnFrame[1]
                    btn.interactable = true
                    lab.string = Ls.get(600109)
                    break
                case 2:
                    spr.spriteFrame = this.btnFrame[0]
                    btn.interactable = true
                    lab.string = Ls.get(600110)
                    break
                case 0:
                    spr.spriteFrame = this.btnFrame[0]
                    btn.interactable = false
                    lab.string = Ls.get(600110)
                    break
                case 3:
                    spr.spriteFrame = this.btnFrame[0]
                    btn.interactable = false
                    lab.string = Ls.get(600110)
                    tip.string = cc.js.formatStr(Ls.get(600115),Gm.config.getMinVip("oneKey"))
                    break
            }
        }
    },

    //
    onSelfClick:function(){
        this.select(TRAVEL_SELF)
    },
    onTeamClick:function(){
        this.select(TRAVEL_TEAM)
    },
    getTravelCount:function(){
        if (this.selectType == TRAVEL_SELF){
            return Gm.travelData.travelTaskCount1
        }else{
            return Gm.travelData.travelTaskCount2
        }
    },
    getRefreshCount:function(){
        if (this.selectType == TRAVEL_SELF){
            return Gm.travelData.refreshTaskCount1
        }else{
            return Gm.travelData.refreshTaskCount2
        }
    },
    getTotalCount:function(){
        var vip = Gm.config.getVip(15)
        if (this.selectType == TRAVEL_SELF){
            return vip.travelTaskNum
        }else{
            return vip.teamTravelTaskNum
        }
    },
    getRefreshTotal:function(){
        var vip = Gm.config.getVip()
        if (this.selectType == TRAVEL_SELF){
            return vip.travelRefreshNum
        }else{
            return vip.teamTravelRefreshNum
        }
    },
    checkBlank:function(data, type){
        var isBlank = data.length == 0
        this.m_oBlankTipNode.active = isBlank
        if(isBlank){
            var tip = type == 1?5404:5405
            this.m_oBlankTipNode.getChildByName("friendTipsLab").getComponent(cc.Label).string = Ls.get(tip)
        }
    }
});

