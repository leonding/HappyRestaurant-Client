// TravelCell
const CELL_WAIT = 0
const CELL_PLAY = 1
const CELL_GET = 2

const c1 = "#F1BC08"
const c2 = "#40FE37"

cc.Class({
    extends: cc.Component,

    properties: {
    	m_oNameLab:cc.Label,
        m_oStarNode:cc.Node,
        m_oStarNod: {
            default: [],
            type: cc.Node,
        },
        m_oTimeBar:cc.ProgressBar,
        m_oTimeLab:cc.Label,
        m_oItemNode:cc.Node,
        m_oQulitySpr:cc.Sprite,
        m_oJobTeamNod:cc.Node,
        m_oJobSpr:{
            default: [],
            type: cc.Sprite,
        },
        m_oBtnWait:cc.Node,
        m_oBtnPlay:cc.Node,
        m_oBtnGet:cc.Node,
        m_oItemTrue:cc.Node,
        m_oLostTime:cc.Label,

        usedNode:cc.Node,
        lostLab:cc.Label,
    },
    setOwner:function(destOwner,data){
    	this.m_oOwner = destOwner
    	this.m_oNameLab.string = data.config.name
        Func.destroyChildren(this.m_oItemNode)
        for(const i in data.config.reward){
            var tmpData = data.config.reward[i]
            // var tmpPage = cc.instantiate(this.m_oItemPerfab)
            // tmpPage.parent = this.m_oItemNode
            var tmpSpt = Gm.ui.getNewItem(this.m_oItemNode)
            tmpSpt.setData(tmpData)
            // if(tmpData.type == ConstPb.itemType.EQUIP){
            //     tmpSpt.updateEquip({baseId:tmpData.id,count:tmpData.num})
            // }else{
            //     tmpSpt.updateItem({baseId:tmpData.id,count:tmpData.num})
            // }
        }
        this.m_oItemTrue.active = data.plus
    	for(const i in this.m_oStarNod){
			this.m_oStarNod[i].getChildByName("star").active = i < data.config.star
    	}

        var tmpNeed = []
        for(const i in data.config.conditionStr){
            var qulity = data.config.conditionStr[i].type
            var total = data.config.conditionStr[i].condition
            if (qulity < 7000){
                this.m_oQulitySpr.node.qulity = qulity
                var tmpHeroRes = Gm.config.getHeroType(qulity)
                Gm.load.loadSpriteFrame("img/travel/" +tmpHeroRes.currencyIcon,function(sp,icon){
                    icon.spriteFrame = sp
                },this.m_oQulitySpr)
            }else{
                for(var j = 0;j < total;j++){
                    tmpNeed.push({type:qulity,condition:1})
                }
            }
        }
        
        for(const i in this.m_oJobSpr){
            var tmpData = tmpNeed[i]
            if (tmpData){
                var res = Gm.config.getTeamType(tmpData.type%10)
                Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                    icon.spriteFrame = sp
                },this.m_oJobSpr[i])
                this.m_oJobSpr[i].node.qulity = tmpData.type
                if (tmpData.condition > 1){
                    var lab = this.m_oJobSpr[i].node.getChildByName("lab")
                    lab.active = true
                    lab.getComponent(cc.Label).string = tmpData.condition
                }else{
                    this.m_oJobSpr[i].node.getChildByName("lab").active = false
                }
            }else{
                this.m_oJobSpr[i].node.active = false
            }
        }
    	this.updateData(data)
    },
    updateData:function(data){
    	this.m_oData = data
    	if (this.m_oData.startTime){
            var pass = Math.floor((Gm.userData.getTime_m() - this.m_oData.startTime)/1000 )
            var time = this.m_oData.config.time - pass
            if (time <= 0 || this.m_oData.finishTime){
                this.updateType(CELL_GET)
            }else{
                this.updateType(CELL_PLAY)
            }
    	}else{
    		this.updateType(CELL_WAIT)
    	}
    },
    updateType:function(destType){
    	if (this.m_iType != destType){
    		this.m_iType = destType
    		if (this.m_iType == CELL_PLAY){
                this.m_oJobTeamNod.active = false
                this.m_oTimeBar.node.active = true
                this.m_oBtnWait.active = false
                this.m_oBtnGet.active = false
                this.m_oBtnPlay.active = true
                this.m_oLostTime.node.active = false
                this.usedNode.active = true
            }else if(this.m_iType == CELL_GET){
                this.m_oJobTeamNod.active = false
                this.m_oTimeBar.node.active = true
                this.m_oBtnWait.active = false
                this.m_oBtnGet.active = true
                this.m_oBtnPlay.active = false
                this.m_oLostTime.node.active = true
                this.m_oTimeBar.progress = 1
                this.m_oTimeLab.string = Ls.get(40006)
                this.usedNode.active = false
    		}else{
                this.usedNode.active = false
                this.m_oJobTeamNod.active = true
                this.m_oTimeBar.node.active = false
                this.m_oBtnWait.active = true
                this.m_oBtnGet.active = false
                this.m_oBtnPlay.active = false
                if (this.m_oData.config.type == 2){//团队游历
                    this.m_oLostTime.node.active = true
                }else{
                    this.m_oLostTime.node.active = false
                }
    		}
            this.updateTime()
    	}
    },
    updateTime:function(){
        if (this.m_iType == CELL_PLAY){
            if (this.m_oData.startTime){
                var pass = Math.floor((Gm.userData.getTime_m() - this.m_oData.startTime)/1000 )
                var time = this.m_oData.config.time - pass
                if (time > 0){
                    this.m_oTimeBar.progress = pass/this.m_oData.config.time
                    this.m_oTimeLab.string = Ls.get(600106) + Func.timeEachDay(time)
                    var tmpStar = Gm.config.getConst("travel_quick_completion_"+this.m_oData.config.star)
                    var tmpLost = Math.floor((this.m_oData.startTime - Gm.userData.getTime_m())/1000) + this.m_oData.config.time
                    var tmpGold = Math.ceil((tmpLost/this.m_oData.config.time) * tmpStar)
                    this.lostLab.string = "x" + tmpGold
                }else{
                    this.updateType(CELL_GET)
                    // if (this.m_oData.startTime != -9999){
                    //     this.m_oData.startTime = -9999
                        // Gm.travelNet.sendTravelOpen([this.m_oData.index])
                    // }
                }
            }
        }else if(this.m_iType == CELL_GET){
            var tmpTime = Gm.userData.getTime_m()
            var lostTime = Gm.config.getConst("travel_finish_save_time")
            if (this.m_oData.finishTime){
                tmpTime = checkint(lostTime) - Math.floor((tmpTime - this.m_oData.finishTime)/1000)
            }else{
                tmpTime = Math.floor((tmpTime - this.m_oData.startTime)/1000)
                tmpTime = checkint(lostTime) - (tmpTime - this.m_oData.config.time)
            }
            if (tmpTime > 0){
                this.m_oLostTime.string = cc.js.formatStr(Ls.get(600105),Func.timeEachDay(tmpTime))
            }else{
                this.node.active = false
            }
        }else{
            if (this.m_oData.config.type == 2){//团队游历
                var lostTime = checkint(Gm.config.getConst("travel_team_expire_time"))*86400
                var pass = Math.floor((Gm.userData.getTime_m() - this.m_oData.refreshTime || 0)/1000)
                var time = lostTime - pass
                if (time > 0){
                    this.m_oLostTime.string = cc.js.formatStr(Ls.get(600105),Func.timeEachDay(time))
                }else{
                    this.node.active = false
                }
            }
        }
    },
    onPlay:function(){
        Gm.ui.create("TravelAward",{data:this.m_oData,from:true})
    },
    onWait:function(){
        // if (this.m_oOwner.getTravelCount() >= this.m_oOwner.getTotalCount() && !this.m_oData.plus){
        //     Gm.floating(Ls.get(600007))
        //     return
        // }
        if (this.m_oOwner.selectType == 2){
            Gm.travelNet.sendTravelAidList(this.m_oData)
        }else{
            Gm.ui.create("TravelListView",this.m_oData)
        }
    },
    onGet:function(){
        Gm.travelNet.sendTravelReceive([this.m_oData.index])
    },
    onItemClick:function(sender,value){
        Gm.ui.create("ItemTipsView",{data:{type:sender.target.qulity},itemType:-1,pos:sender.touch._point})
    },
});

