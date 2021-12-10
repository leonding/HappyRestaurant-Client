var BaseView = require("BaseView")
// ReadyTeamView
cc.Class({
    extends: BaseView,

    properties: {
        m_oFightLab:cc.Label,

        m_oHeroScroll:cc.ScrollView,
        m_oCellPerfab:cc.Prefab,

        m_oListScroll:cc.ScrollView,
        m_oHeroPerfab:cc.Prefab,
        m_oFilterNode:cc.Node,
        
        needLab:cc.RichText,
    },
    enableUpdateView:function(data){
        if (data){
            Gm.red.m_bHasLineUp = false
            Gm.red.refreshEventState("fight")
            Func.destroyChildren(this.m_oHeroScroll.content)
            Func.destroyChildren(this.m_oListScroll.content)
            var tmpUnLockNum = Gm.config.getLineUp(Gm.userInfo.level)
            var tmpMaxNums = 12
            this.m_tReadyData = []
            if (tmpUnLockNum.level){
                var c1 = "#AF523A"
                var c2 = "#78645B"
                this.needLab.string = cc.js.formatStr(Ls.get(90008),c2,c1,tmpUnLockNum.level,c2,tmpUnLockNum.field+1)
            }else{
                this.needLab.string = ""
            }
            for(var i = 0;i < tmpMaxNums;i++){
                var tmpPage = cc.instantiate(this.m_oCellPerfab)
                var tmpSpt = tmpPage.getComponent("ReadyHeroCell")
                tmpSpt.setOwner(this)
                tmpPage.parent = this.m_oHeroScroll.content
                this.m_tReadyData.push(tmpSpt)
                if (i < tmpUnLockNum.field){
                    tmpSpt.setData({lock:false})
                }else{
                    tmpSpt.setData({lock:true})
                }
            }

            var tmpLine = Gm.heroData.getLineByType(ConstPb.lineHero.LINE_GUAJI)
            // console.log("tmpLine===:",tmpLine)
            if (tmpLine){
                for(const i in tmpLine.hero){
                    var tmpId = tmpLine.hero[i]
                    // console.log("tmpHero===:",tmpHero)
                    if (tmpId){
                        for(var j in this.m_tReadyData){
                            if ((!this.m_tReadyData[j].isLocked()) && (!this.m_tReadyData[j].m_oData)){
                                this.m_tReadyData[j].setData({lock:false,hero:Gm.heroData.getHeroById(tmpId)})
                                break
                            }
                        }
                    }
                }
            }
            this.updateFilter(false,0)
            this.updateReady()
        }
    },
    updateHeroList:function(){
        Func.destroyChildren(this.m_oListScroll.content)
        var tmpData = Gm.heroData.getAll()
        tmpData.sort(function(a,b){
            return b.getAttrValue(203) - a.getAttrValue(203)
        })
        this.m_tListData = []
        for(const i in tmpData){
            var tmpConfig = null
            if (tmpData[i].job){
                tmpConfig = Gm.config.getJobWithId(tmpData[i].job)
            }else{
                tmpConfig = Gm.config.getJobWithId(Gm.config.getHero(tmpData[i].baseId).job)
            }
            if (this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.attribute){
                var tmpPage = cc.instantiate(this.m_oHeroPerfab)
                tmpPage.parent = this.m_oListScroll.content
                var tmpSpt = tmpPage.getComponent("HeroBase")
                tmpSpt.setOwner(this)
                tmpSpt.updateHero(tmpData[i])
                this.m_tListData.push(tmpSpt)
                for(var j in this.m_tReadyData){
                    if (this.m_tReadyData[j].m_oData){
                        if (this.m_tReadyData[j].m_oData.heroId == tmpData[i].heroId){
                            tmpSpt.setHeroReady(true,0)
                            break
                        }
                    }
                }
            }
        }
    },
    updateFilter:function(destValue,destType){
        this.m_oFilterNode.active = destValue
        if (destType != -1 && !destValue){
            if (destType != this.m_iFilterValue){
                this.m_iFilterValue = destType
            }else{
                this.m_iFilterValue = 0
            }
            this.updateHeroList()
        }
    },
    onFilterClick:function(){
        this.updateFilter(!this.m_oFilterNode.active,-1)
    },
    onFilterType:function(sender,value){
        if (value){
            this.updateFilter(false,parseInt(value))
        }
    },
    onOkClick:function(){
        var list = []
        for (let index = 0; index < this.m_tReadyData.length; index++) {
            const v = this.m_tReadyData[index];
            if (v.m_oData){
                list.push(v.m_oData.heroId)
            }
        }
        if (list.length==0){
            Gm.floating(Ls.get(90012))
            return
        }
        Gm.heroNet.setGjHero(list,ConstPb.lineHero.LINE_GUAJI)
        this.onBack()
    },
    onNoClick:function(){
        this.onBack()
    },
    cheackReady:function(destData){
        var tmpIdx = -1
        return tmpIdx
    },
    insertReady:function(destData){
        var tmpIdx = -1
        var tmpCounts = 0
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData){
                    tmpCounts = tmpCounts + 1
                }else{
                    tmpIdx = i
                    break
                }
            }
        }
        if (tmpIdx != -1){
            this.m_tReadyData[tmpIdx].setData({lock:false,hero:destData})
        }
        this.updateReady()
        return tmpIdx != -1
    },
    removeReady:function(destData){
        var tmpIdx = -1
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData && this.m_tReadyData[i].m_oData.heroId == destData.heroId){
                    tmpIdx = i
                    break
                }
            }
        }
        if (tmpIdx != -1){
            this.m_tReadyData[tmpIdx].setData({lock:false})
        }
        this.updateReady()
        return tmpIdx != -1
    },
    updateReady:function(){
        var tmpTotalFight = 0
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData){
                    tmpTotalFight = tmpTotalFight + this.m_tReadyData[i].m_oData.getAttrValue(203)
                }
            }
        }
        this.m_oFightLab.string = tmpTotalFight
    },
    onHeroListClick:function(destData,destValue){
        var tmpDone = false
        var tmpIdx = -1
        for(const i in this.m_tListData){
            if (this.m_tListData[i].m_oData && destData && this.m_tListData[i].m_oData.heroId == destData.heroId){
                tmpIdx = i
                break
            }
        }
        if (tmpIdx != -1){
            if (destValue){
                tmpDone = this.insertReady(destData)
            }else{
                tmpDone = this.removeReady(destData)
            }
            // console.log("tmpDone===:",tmpDone,destValue,tmpIdx)
            if (tmpDone){
                this.m_tListData[tmpIdx].setHeroReady(destValue,0)
            }
        }
    },
});

