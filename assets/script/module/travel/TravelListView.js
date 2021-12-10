var BaseView = require("BaseView")

const SEL_NONE = 0
const SEL_SELF = 1
const SEL_TEAM = 2

// TravelListView
cc.Class({
    extends: BaseView,
    properties: {
        m_oInfoLab:cc.Label,
        m_oAwardNode:cc.Node,

        m_oBtnList:cc.Node,
        m_oListFab:cc.Node,

        m_oTeamNode:cc.Node,
        m_oTeamFab:cc.Node,
        m_oCondiLab:cc.Label,

        m_oBtnOne:cc.Node,
        m_oBtnOk:cc.Node,

        m_oBotNode:cc.Node,
        m_oTeamLab:cc.Node,
        m_oListScroll:cc.ScrollView,
        m_oFilterPerfab:cc.Prefab,
        m_oFilterNode:cc.Node,
    },
    onLoad:function(){
        this._super()

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)
    },
    enableUpdateView:function(args){
        if (args){
            Gm.audio.playEffect("music/02_popup_open")
            this.m_oData = args
            this.m_oInfoLab.string = this.m_oData.config.deciption
            Func.destroyChildren(this.m_oAwardNode)
            for(const i in this.m_oData.config.reward){
                var tmpData = this.m_oData.config.reward[i]
               
                var tmpSpt = Gm.ui.getNewItem(this.m_oAwardNode)
                tmpSpt.setData(tmpData)
            }

            this.m_iQuality = this.m_oData.config.conditionStr[0].type
            // this.m_iTotal = this.m_oData.config.conditionStr[0].condition
            this.m_iTotal = 0
            for(var i = 1;i < this.m_oData.config.conditionStr.length;i++){
                this.m_iTotal = this.m_iTotal + this.m_oData.config.conditionStr[i].condition
            }
            // console.log("this.m_iTotal===:",this.m_iTotal,this.m_oData.config.oneselfHeroSize)

            this.m_tList = []
            this.isTeamType = false
            for(var i = 0;i < this.m_iTotal;i++){
                var tmpPage = cc.instantiate(this.m_oListFab)
                tmpPage.active = true
                tmpPage.parent = this.m_oBtnList
                this.m_tList.push(tmpPage)
                if (i >= this.m_oData.config.oneselfHeroSize){
                    tmpPage.getChildByName("from").active = true
                    this.isTeamType = true
                }else{
                    tmpPage.getChildByName("from").active = false
                }
            }

            this.m_tNeed = []
            var tmpCounts = 0
            var self = this
            var inInsertOne = function(type,condition){
                var tmpPage = cc.instantiate(self.m_oTeamFab)
                tmpPage.active = true
                tmpPage._idxValue = tmpCounts
                if (type < 7000){
                    var tmpHeroRes = Gm.config.getHeroType(type)
                    Gm.load.loadSpriteFrame("img/travel/" +tmpHeroRes.currencyIcon,function(sp,icon){
                        icon.node.width = 64
                        icon.node.height = 74
                        icon.spriteFrame = sp
                    },tmpPage.getComponent(cc.Sprite))
                }else{
                    var res = Gm.config.getTeamType(type%10)
                    Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                        icon.node.width = 74
                        icon.node.height = 74
                        icon.spriteFrame = sp
                    },tmpPage.getComponent(cc.Sprite))
                }
                if (condition > 1 || type < 7000){
                    tmpPage.getChildByName("lab").active = true
                    tmpPage.getChildByName("lab").getComponent(cc.Label).string = "0/"+condition
                }else{
                    tmpPage.getChildByName("lab").active = false
                }
                self.m_tNeed.push({type:type,num:condition,node:tmpPage})
                tmpPage.getChildByName("dui").active = false
                self.m_oTeamNode.addChild(tmpPage)
                tmpCounts = tmpCounts + 1
            }
            for(const i in this.m_oData.config.conditionStr){
                var tmpData = this.m_oData.config.conditionStr[i]
                if (tmpData.type < 7000){
                    inInsertOne(tmpData.type,tmpData.condition)
                }else{
                    for(var j = 0;j < tmpData.condition;j++){
                        inInsertOne(tmpData.type,1)
                    }
                }
            }
            this.onCellClick(null,0)
            this.updateReady()

            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job
                }
                this.updateHeroList()
            }.bind(this))

            this.m_oBtnOne.active = Gm.config.getVip().travelBattleArray > 0
        }
    },
    onOkClick:function(){
        var tmpList = []
        for(const i in this.m_tList){
            if (this.m_tList[i].data){
                tmpList.push(this.m_tList[i].data.heroId)
            }
        }
        if (tmpList.length > 0){
            Gm.travelNet.sendTravelTaskStart([{index:this.m_oData.index,heroIds:tmpList}])
            this.onBack()
        }else{
            Gm.floating(Ls.get(600018))
        }
    },
    updateReady:function(){
        var tmpQuality = {}
        var tmpTeams = {}
        var usedTeam = {}
        for(const i in this.m_tList){
            var node = this.m_tList[i].getChildByName("node")
            Func.destroyChildren(node)
            if (this.m_tList[i].data){
                var tmpSpt = Gm.ui.getNewItem(node)
                tmpSpt.updateHero(this.m_tList[i].data)
                tmpSpt.setFb(this.onHeroListClick.bind(this))
                var tmpConfig = Gm.config.getHero(tmpSpt.data.baseId || 0,tmpSpt.data.qualityId)
                if (!tmpQuality[tmpConfig.quality]){
                    tmpQuality[tmpConfig.quality] = 1
                }else{
                    tmpQuality[tmpConfig.quality] = tmpQuality[tmpConfig.quality] + 1
                }
                if (!tmpTeams[tmpConfig.camp]){
                    tmpTeams[tmpConfig.camp] = 1
                }else{
                    tmpTeams[tmpConfig.camp] = tmpTeams[tmpConfig.camp] + 1
                }
            }
        }
        var qualityDone = true
        var teamDone = true
        for(const i in this.m_tNeed){
            var tmpCounts = 0
            if (this.m_tNeed[i].type >= 7000){
                var need = this.m_tNeed[i].type%10
                tmpCounts = tmpTeams[need] || 0
                var tmpUsed = usedTeam[need] || 0
                if (tmpCounts - tmpUsed < this.m_tNeed[i].num){
                    teamDone = false
                    this.m_tNeed[i].node.getChildByName("dui").active = false
                }else{
                    usedTeam[need] = tmpUsed + 1
                    this.m_tNeed[i].node.getChildByName("dui").active = true
                }
                // console.log("tmpCounts===:",tmpCounts,this.m_tNeed[i].num,this.m_tNeed[i].type,tmpTeams)
            }else{
                for(const j in tmpQuality){
                    if (checkint(j) >= this.m_tNeed[i].type){
                        tmpCounts = tmpCounts + tmpQuality[j]
                    }
                }
                if (tmpCounts < this.m_tNeed[i].num){
                    qualityDone = false
                    this.m_tNeed[i].node.getChildByName("dui").active = false
                }else{
                    this.m_tNeed[i].node.getChildByName("dui").active = true
                }
                // console.log("tmpCounts===:",tmpCounts,this.m_tNeed[i].num,this.m_tNeed[i].type,tmpQuality)
            }
            this.m_tNeed[i].node.getChildByName("lab").getComponent(cc.Label).string = tmpCounts+"/"+this.m_tNeed[i].num
        }
        if (qualityDone && teamDone){
            this.m_oBtnOk.getComponent(cc.Button).interactable = true
        }else{
            this.m_oBtnOk.getComponent(cc.Button).interactable = false
        }
    },
    insertReady:function(destData){
        var tmpIdx = -1
        var tmpCounts = 0
        for(const i in this.m_tList){
            if (this.m_tList[i].data){
                tmpCounts = tmpCounts + 1
            }else{
                if (this.m_bIsFrom){
                    if (this.m_tList[i].getChildByName("from").active){
                        if (tmpIdx == -1){
                            tmpIdx = i
                        }
                    }
                }else{
                    if (!this.m_tList[i].getChildByName("from").active){
                        if (tmpIdx == -1){
                            tmpIdx = i
                        }
                    }
                }
            }
        }
        if (tmpCounts < this.m_iTotal){
            if (tmpIdx != -1){
                this.m_tList[tmpIdx].data = destData
            }
            this.updateReady()
            return tmpIdx != -1
        }else{
            Gm.floating(Ls.get(90026))
            return false
        }
    },
    removeReady:function(destData){
        var tmpIdx = -1
        for(const i in this.m_tList){
            if (this.m_tList[i].data && this.m_tList[i].data.heroId == destData.heroId){
                tmpIdx = i
                break
            }
        }
        if (tmpIdx != -1){
            this.m_tList[tmpIdx].data = null
        }
        this.updateReady()
        return tmpIdx != -1
    },
    onHeroListClick:function(destData){
        if (destData){
            var conf = Gm.config.getHero(0,destData.qualityId)
            var isNeed = false
            for(const i in this.m_tNeed){
                if (this.m_tNeed[i].type > 7000 && this.m_tNeed[i].type%10 == conf.camp){
                    isNeed = true
                    break
                }
            }
            if (isNeed){
                var tmpDone = false
                var isSame = false
                var destValue = true
                for(const i in this.m_tList){
                    if (this.m_tList[i].data && this.m_tList[i].data.baseId == destData.baseId){
                        isSame = true
                    }
                    if (this.m_tList[i].data && this.m_tList[i].data.heroId == destData.heroId){
                        destValue = false
                    }
                }
                if (destValue){
                    if (isSame){
                        Gm.floating(Ls.get(5247))
                    }else{
                        tmpDone = this.insertReady(destData)
                    }
                }else{
                    tmpDone = this.removeReady(destData)
                }
                if (tmpDone){
                    // var isAll = 0
                    // for(const i in this.m_tList){
                    //     if (this.m_tList[i].data){
                    //         isAll = isAll + 1
                    //     }
                    // }
                    // if (isAll == this.m_iTotal){
                    //     for(const i in this.m_tListData){
                    //         if (this.m_tListData[i]){
                    //             this.m_tListData[i].getBaseClass().setHeroReady(true)
                    //         }
                    //     }
                    // }else{
                    for(const i in this.m_tListData){
                        const v = this.m_tListData[i];
                        var tmpHas = false
                        var tmpSame = false
                        for(const j in this.m_tList){
                            if (this.m_tList[j].data && v.data.heroId == this.m_tList[j].data.heroId){
                                tmpHas = true
                            }else{
                                if (this.m_tList[j].data && this.m_tList[j].data.baseId == v.data.baseId){
                                    tmpSame = true
                                }
                            }
                        }
                        v.getBaseClass().lockSame(tmpSame)
                        v.getBaseClass().setHeroReady(tmpHas)
                        if (destData.isHire){
                            if (destValue){
                                if (v.data.isHire && destData.heroId != v.data.heroId){ //选中的佣兵下来
                                    v.getBaseClass().lockHire(true)
                                }
                            }else{
                                if (v.data.isHire){ //选中的佣兵下来
                                    v.getBaseClass().lockHire(false)
                                }
                            }
                        }
                    }
                    // }
                }
            }else{
                Gm.floating(Ls.get(90010))
            }
        }
    },
    updateHeroList:function(){
        var tmpData = null
        if (this.m_bIsFrom){
            this.m_oTeamLab.active = true
            tmpData = Gm.travelData.m_tAidList
        }else{
            this.m_oTeamLab.active = false
            tmpData = Gm.heroData.getAllLimit(this.m_oData.config.type)
            tmpData.sort(function(a,b){
                if (a.isHire == b.isHire){
                    if (b.level == a.level){
                        var confA = Gm.config.getHero(a.baseId,a.qualityId)
                        var confB = Gm.config.getHero(b.baseId,b.qualityId)
                        if (confA.quality == confB.quality){
                            return confB.camp - confA.camp
                        }else{
                            return confB.quality - confA.quality
                        }
                        return -1
                    }else{
                        return b.level - a.level
                    }
                }else{
                    if (a.isHire){
                        return -1
                    }else{
                        return 1
                    }
                }
            })
        }
        this.m_tListData = []
        // var isAll = 0
        // for(const i in this.m_tList){
        //     if (this.m_tList[i].data){
        //         isAll = isAll + 1
        //     }
        // }
        var tmpGiao = []
        for(const i in tmpData){
            var tmpConfig = Gm.config.getHero(tmpData[i].baseId || 0,tmpData[i].qualityId)
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.camp)&&
                (this.m_iJobValue == 0 || this.m_iJobValue == tmpConfig.job)){
                tmpGiao.push(tmpData[i])
            }
        }

        this.m_tListData = []
        this.m_oListScroll.stopAutoScroll()
        Func.destroyChildren(this.m_oListScroll.content)

        Gm.ui.simpleScroll(this.m_oListScroll,tmpGiao,function(itemData,tmpIdx){
            var tmpSpt = Gm.ui.getNewItem(this.m_oListScroll.content)
            tmpSpt.setMaxHeight()
            tmpSpt.updateHero(itemData)
            tmpSpt.setFb(this.onHeroListClick.bind(this))
            this.m_tListData.push(tmpSpt)
            for(var j in this.m_tList){
                if (this.m_tList[j].data){
                    if (this.m_tList[j].data.heroId == itemData.heroId){
                        tmpSpt.getBaseClass().setHeroReady(true)
                        break
                    }else{
                        if (this.m_tList[j].data.baseId == itemData.baseId){
                            tmpSpt.getBaseClass().lockSame(true)
                            break
                        }
                    }
                }
            }
            return tmpSpt.node
        }.bind(this))
        this.m_oListScroll.scrollToTop()
    },
    onCellClick:function(sender,value){
        if (checkint(value)){
            this.updateBotNode(true)
            var from = false
            if (sender.target.getChildByName("from")){
                from = sender.target.getChildByName("from").active
            }
            if (this.m_bIsFrom != from){
                this.m_bIsFrom = from
                this.m_oTeamFilter.updateSelet(0,0)
            }
        }
    },
    updateBotNode:function(destValue){
        if (destValue != this.m_oBotNode.active){
            Gm.audio.playEffect("music/02_popup_open")
        }
    },
    onItemClick:function(sender){
        Gm.ui.create("ItemTipsView",{data:this.m_oData.config.conditionStr[sender.target._idxValue],itemType:-1,pos:sender.touch._point})
    },
    onOneClick:function(){
        // console.log("this.m_tNeed===:",this.m_tNeed)
        this.m_oTeamFilter.updateSelet(0,0)
        var self = this
        var tmpList = []
        var tmpHas = []
        var deadOne = function(index){
            if (self.m_tList[index].data){
                self.onHeroListClick(self.m_tList[index].data)
            }
            var tmpData = null
            if (self.m_tList[index].getChildByName("from").active){
                tmpData = Gm.travelData.m_tAidList
            }else{
                tmpData = Gm.heroData.getAllLimit(self.m_oData.config.type)
                tmpData.sort(function(a,b){
                    if (a.isHire == b.isHire){
                        if (b.level == a.level){
                            var confA = Gm.config.getHero(a.baseId,a.qualityId)
                            var confB = Gm.config.getHero(b.baseId,b.qualityId)
                            if (confA.quality == confB.quality){
                                return confB.camp - confA.camp
                            }else{
                                return confB.quality - confA.quality
                            }
                            return -1
                        }else{
                            return b.level - a.level
                        }
                    }else{
                        if (a.isHire){
                            return -1
                        }else{
                            return 1
                        }
                    }
                })
            }
            var needTotal = 999
            for(const j in tmpData){
                var tmpConfig = Gm.config.getHero(tmpData[j].baseId || 0,tmpData[j].qualityId)
                var isTeamOk = false
                var isQulityOk = false
                var tmpNeedIdx = -1
                for(const k in self.m_tNeed){
                    var tmpCan = true
                    for(const o in tmpHas){
                        if (tmpHas[o] == checkint(k)){
                            tmpCan = false
                            break
                        }
                    }
                    if (tmpCan){
                        if (self.m_tNeed[k].type >= 7000){
                            var need = self.m_tNeed[k].type%10
                            if (need == tmpConfig.camp){
                                tmpNeedIdx = checkint(k)
                                isTeamOk = true
                            }
                        }else{
                            if (tmpConfig.quality >= self.m_tNeed[k].type){
                                isQulityOk = true
                                needTotal = self.m_tNeed[k].num
                            }
                        }
                    }
                }
                if (tmpHas.length >= needTotal){
                    isQulityOk = true
                }
                // console.log("j====:",tmpHas.length,needTotal,tmpConfig.name,tmpConfig.quality,tmpNeedIdx,isTeamOk,isQulityOk)
                if (isTeamOk && isQulityOk){
                    var tmpCan = true
                    for(const k in tmpList){
                        if (tmpList[k].baseId == tmpData[j].baseId){
                            tmpCan = false
                            break
                        }
                    }
                    if (tmpCan){
                        tmpHas.push(tmpNeedIdx)
                        tmpList.push(tmpData[j])
                        break
                    }
                }
            }
        }
        var upSideDown = function(isBack){
            tmpList = []
            tmpHas = []
            if (isBack){
                for(let i = self.m_tList.length - 1;i >= 0;i--){
                    deadOne(i)
                }
            }else{
                for(const i in self.m_tList){
                    deadOne(i)
                }
            }
        }
        upSideDown(false)
        if (this.m_tList.length != tmpList.length){
            upSideDown(true)
        }
        var tmpFrom = this.m_bIsFrom
        for(const i in tmpList){
            if (tmpList[i].ownerName){
                if (!this.m_bIsFrom){
                    this.m_bIsFrom = true
                }
            }else{
                if (this.m_bIsFrom){
                    this.m_bIsFrom = false
                }
            }
            this.onHeroListClick(tmpList[i])
        }
        console.log("tmpList==:",tmpList)
        this.m_bIsFrom = tmpFrom
        // this.updateHeroList()
        if (this.m_tList.length != tmpList.length){
            Gm.floating(Ls.get(600018))
        }
    },
});

