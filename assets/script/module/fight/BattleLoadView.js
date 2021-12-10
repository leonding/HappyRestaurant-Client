// BattleLoadView
cc.Class({
    extends: require("BaseView"),
    properties: {
        byteProgress:cc.ProgressBar,
        byteLabel:cc.Label,
        percentLabel:cc.Label,
        m_tCellList:{
            default: [],
            type:cc.Node,
        },
        m_oCellFab:cc.Node,
    },
    onLoad:function(){
        Gm.ui.hideNowPage()
        Gm.ui.removeByName("FightTeamView")
        this._super()
        this.totalTime = Gm.config.getConst("loading_time")/1000
        this.nowTime = 0.001
        this.m_bLoadDone = false
        this.m_tCells = []
        for(const i in this.m_tCellList){
            var cell = cc.instantiate(this.m_oCellFab)
            cell.active = true
            this.m_tCellList[i].addChild(cell)
            var spt = cell.getComponent("BattleLoadCell")
            spt.setOwner(checkint(i),this)
            this.m_tCells.push(spt)
        }
        this.m_tUnlock = Gm.config.getConfig("UnlockFightLineConfig")
        this.m_tUnlock.sort(function(a,b){
            return a.lineMax - b.lineMax
        })
        var tmpMaxId = Gm.userInfo.getMaxMapId()
        this.m_iMaxLine = 1
        for(const i in this.m_tUnlock){
            if (this.m_tUnlock[i].id >= tmpMaxId){

            }else{
                this.m_iMaxLine = this.m_tUnlock[i].lineMax
            }
        }
        var str = "300|301|302|303|304|305|306|307|308|309"
        this.usefulArray = str.split("|")
    },
    enableUpdateView:function(data){
        if (data){
            Gm.removeLoading()
            this.data = data
            Gm.ui.create("BattleView",null,(event)=>{
                this.battle = Gm.ui.getScript("BattleView")
                this.initLine()
            })
            this.percentLabel.string = Ls.get(100) + "0%"
            this.byteLabel.string = Ls.get(this.usefulArray[Func.random(0,this.usefulArray.length)])
        }
    },
    initLine:function(){
        this.m_iLoadNum = 0
        var list = []
        var hasNum = 0
        for(const i in this.data.battleInfo[0].battleData.roleInfo){
            const dt = this.data.battleInfo[0].battleData.roleInfo[i]
            if (dt.pos > 0){
                hasNum++
                list[dt.pos - 1] = dt
            }
        }
        var tmpCount = 0
        var tmpNone = 0
        for(const i in this.m_tCells){
            this.m_tCells[i].setData(list[i])
            if (!list[i]){
                if (this.m_iMaxLine > hasNum + tmpCount){//有没上去的
                    tmpNone++
                    this.m_tCells[i].setLimit()
                }else{
                    this.m_tCells[i].setLimit(this.m_tUnlock[this.m_iMaxLine + tmpCount - tmpNone])
                }
                tmpCount++
            }
        }
    },
    loadDone:function(){
        this.m_iLoadNum++
        if (this.m_iLoadNum == this.m_tCellList.length){
            var loadMax = 0
            var loadNum = 0
            this.m_tSkillFab = {}
            this.m_tBuffFab = {}
            var self = this
            var tmpInsert = function(destStr,type){
                var tmpAry = null
                if (type == 0){
                    tmpAry = self.m_tSkillFab
                }else if(type == 1){
                    tmpAry = self.m_tBuffFab
                }
                if (destStr && destStr.length > 0){
                    if (!tmpAry[destStr]){
                        loadMax = loadMax + 1
                    }
                    tmpAry[destStr] = destStr
                } 
            }
            tmpInsert("skill_bg",0)
            tmpInsert("powermax",1)
            tmpInsert("fazhen",1)
            tmpInsert("jiaxueziran",1)
            tmpInsert("huilan",1)
            for(const i in this.data.battleInfo){
                const data = this.data.battleInfo[i]
                for(const j in data.battleData.roleInfo){
                    var tmpData = data.battleData.roleInfo[j]
                    var tmpConfig = null
                    if (tmpData.type == ConstPb.roleType.MONSTER){
                        tmpConfig = Gm.config.getHero(0,Gm.config.getMonster(tmpData.baseId).heroQualityID)
                    }else{
                        tmpConfig = Gm.config.getHero(tmpData.baseId,tmpData.quality)
                    }
                    var skinConf = Gm.config.getSkin(tmpData.skin || tmpConfig.skin_id)
                    if (skinConf.enlarge > 0){
                        tmpInsert(skinConf.dwarf+"_boss",0)
                    }else{
                        tmpInsert(skinConf.dwarf,0)
                    }
                }
                for(const j in data.battleData.actions){
                    var skillId = data.battleData.actions[j].skillId
                    if (skillId){
                        var skillConfig = Gm.config.getSkill(skillId)
                        if (skillConfig && skillConfig.buffEffect.length > 0){
                            tmpInsert(skillConfig.buffEffect,1)
                        }
                    }
                    var buffInfo = data.battleData.actions[j].active.buffInfo
                    if (buffInfo){
                        for(const o in buffInfo){
                            var tmpBuf = Gm.config.getBuffWithId(buffInfo[o].buffId)
                            // console.log("buffInfo[j].buffId==:",buffInfo[o].buffId)
                            if (tmpBuf && tmpBuf.file.length > 0){
                                tmpInsert(tmpBuf.file,1)
                            }
                        }
                    }
                    for(const o in data.battleData.actions[j].passive){
                        for(const k in data.battleData.actions[j].passive[o].buffInfo){
                            var tmpBufId = data.battleData.actions[j].passive[o].buffInfo[k].buffId
                            var tmpBuf = Gm.config.getBuffWithId(tmpBufId)
                            // console.log("buffInfo[j].buffId==:",tmpBufId)
                            if (tmpBuf && tmpBuf.file.length > 0){
                                tmpInsert(tmpBuf.file,1)
                            }
                        }
                    }
                }
            }
            var dealFab = function(table,destFrom){
                for(const i in table){
                    // console.log("table[i]==:",i)
                    Gm.load.loadFightEffect(i,destFrom,function(sp){
                        if (sp){
                            loadNum = loadNum + 1
                            // console.log("loadNum===:",loadNum,loadMax)
                            self.byteProgress.progress = loadNum/loadMax
                            var percent = Math.ceil(loadNum/loadMax * 100)
                            self.percentLabel.string = Ls.get(100) + percent + "%"
                            if (loadNum == loadMax){
                                self.m_bLoadDone = true
                                self.enterBattle()
                            }
                        }else{
                            console.log(Ls.get(6008))
                        }
                    },self.battle.node)
                }
            }
            dealFab(this.m_tSkillFab,0)
            dealFab(this.m_tBuffFab,1)
            if (loadMax == 0){
                this.enterBattle()
            }
        }
    },
    enterBattle:function(){
        if (this.nowTime > this.totalTime && this.m_bLoadDone){
            this.nowTime = 0
            this.battle.enableUpdateView(this.data)
            this.onBack()
        }
    },
    update(dt){
        if (this.nowTime){
            this.nowTime+=dt
            if (this.nowTime > this.totalTime){
                this.enterBattle()
            }
        }
    },
});
