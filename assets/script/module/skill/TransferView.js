var BaseView = require("SecondView")
const fight_value = [
    [1,11],
    [2,12],
    [3,13],
    [4,14],
    [100,500],//HP上限
    [101,501],//MP上限
    [102,2001],//Min攻击力
    [103,2001],//Max攻击力
    [104,504],//格挡值
    [105,505],//格穿值
    [106,506],//护甲值
    [107,507],//魔抗值
    [108,508],//护穿值
    [109,509],//法穿值
    [110,510],//命中值
    [111,511],//闪避值
    [112,512],//暴击值
    [113,513],//
    [114,514],//
    [515],
    [516],
    [517],
    [518],
    [519],
    [522],
    [523],
]
const IdAy = [
    [1,4,5,10,11,12,13,],
    [2,6,7,14,15,16,17,],
    [3,8,9,18,19,20,21,],
]
const tmpPageJian = [0,0,3,9]
const tmpPageChu = [1,1,2,4]
// TransferView
cc.Class({
    extends: BaseView,

    properties: {
        m_oBtnInfo:cc.Node,
        m_oBtnClose:cc.Node,

        m_oNameLab:cc.Label,

        m_oInfoItem:cc.Node,
        m_oInfoScroll:cc.ScrollView,

        m_oSkillPerfab:cc.Prefab,
        m_oSkillScroll:cc.ScrollView,

        m_oJobPerfab:cc.Prefab,
        m_oJobScroll:cc.PageView,
        m_tJobIconPage: {
            default: [],
            type: cc.Node,
        },

        m_oJobPointLab:cc.Label,
        m_oHeroIcon:cc.Node,
        m_oHeroName:cc.Label,

        m_oBtnSkill:cc.Node,
        m_oBtnUpgrade:cc.Node,
    },
    enableUpdateView:function(args){
    	if (args){
            this.m_oData = args
            Gm.red.add(this.m_oBtnSkill,"heroSkill",this.m_oData.baseId)//技能点
            //args.job
            for(const i in this.m_tJobIconPage){
                for(var j = 1;j < 8;j++){
                    var tmpPart = this.m_tJobIconPage[i].getChildByName("btn"+j)
                    Func.destroyChildren(tmpPart)
                    var tmpPage = cc.instantiate(this.m_oJobPerfab)
                    tmpPart.addChild(tmpPage,1,"job")
                    var tmpSpt = tmpPage.getComponent("JobBase")
                    tmpSpt.setOwner(this,Gm.config.getJobWithId(IdAy[i][j-1]),i,j)
                }
            }
            this.updateJob(args.job,args.jobPoint)
    	}
    },
    register:function(){
        this.events[Events.JOB_CHANGE] = this.onJobChange.bind(this)
    },
    onJobChange:function(args){
        if (args && args.hero){
            this.m_oData = args.hero
            this.updateJob(args.hero.job,args.hero.jobPoint)
        }
    },
    updateJob:function(destJob,destPoint){
        if (this.m_iSelet2){
            this.getJobCell(this.m_iSelet1,this.m_iSelet2).getComponent("JobBase").callSelet(false)
        }
        var tmpHeroData = Gm.config.getHero(this.m_oData.baseId)
        this.m_iSelet1 = 0
        this.m_iSelet2 = 0
        this.m_iJobNum = destJob
        this.m_iJobPoint = destPoint
        if (destJob == 0 && destPoint == 0){
            this.m_iJobNum = tmpHeroData.job
        }
        var self = this
        this.m_iLostJp = Gm.config.getPlayerLevel(Gm.userInfo.level,"point")
        var tmpJobInfo = Gm.config.getJobInfo(destJob,destPoint)
        if (tmpJobInfo && tmpJobInfo.needPoint){
            this.m_iLostJp = this.m_iLostJp - tmpJobInfo.needPoint
        }
        // console.log("tmpLostJp==:",tmpLostJp,tmpJobInfo)
        this.m_tBaseJob = Gm.config.getAllJobById(destJob)
        // console.log("this.m_tBaseJob===:",this.m_tBaseJob)

        for(const i in this.m_tJobIconPage){
            for(var j = 1;j < 8;j++){
                this.unlockOne(i,j,false,0)
            }
        }
        Func.getHeadWithParent(tmpHeroData.picture,this.m_oHeroIcon)
        this.m_oHeroName.string = tmpHeroData.name
        var tmpIdx = this.m_tBaseJob.length-1
        var tmpPageNum = Math.ceil((this.m_tBaseJob[tmpIdx] - tmpPageJian[tmpIdx])/tmpPageChu[tmpIdx])-1
        if (destJob == 0 && destPoint == 0){
            tmpPageNum = tmpHeroData.job - 1
        }
        this.m_bHasNext = false
        for(const i in this.m_tBaseJob){
            // console.log("tmpPageNum==L",tmpPageNum,i,tmpIdx)
            var tmpMax = Gm.config.getMaxJob(this.m_tBaseJob[i])
            if (i == 1){
                if (tmpIdx == i){
                    this.unlockOne(tmpPageNum,1,true,destPoint)
                    if (destPoint == tmpMax){
                        this.m_iJobPoint = 0
                        this.m_bHasNext = true
                        this.unlockOne(tmpPageNum,2,true,0)
                        this.unlockOne(tmpPageNum,3,true,0)
                        this.onChooseJob(tmpPageNum,2)
                    }else{
                        this.onChooseJob(tmpPageNum,1)
                    }
                }else{
                    this.unlockOne(tmpPageNum,1,true,tmpMax)
                }
            }else if(i == 2){
                var tmpJobNum = this.m_tBaseJob[i]%2
                // console.log("tmpJobNum===:",tmpJobNum,destPoint,tmpIdx,i)
                if (tmpIdx == i){
                    this.unlockOne(tmpPageNum,tmpJobNum + 2,true,destPoint)
                    if (destPoint == tmpMax){
                        this.m_bHasNext = true
                        this.m_iJobPoint = 0
                        if (tmpJobNum == 0){
                            this.unlockOne(tmpPageNum,4,true,0)
                            this.unlockOne(tmpPageNum,5,true,0)
                            this.onChooseJob(tmpPageNum,4)
                        }else{
                            this.unlockOne(tmpPageNum,6,true,0)
                            this.unlockOne(tmpPageNum,7,true,0)
                            this.onChooseJob(tmpPageNum,6)
                        }
                    }else{
                        this.onChooseJob(tmpPageNum,tmpJobNum + 2)
                    }
                }else{
                    this.unlockOne(tmpPageNum,tmpJobNum + 2,true,tmpMax)
                }
            }else if(i == 3){
                var tmpJobNum = (this.m_tBaseJob[i] - tmpPageJian[i])%4
                tmpJobNum = (tmpJobNum?tmpJobNum:4)+3
                // console.log("tmpJobNum===:",tmpJobNum)
                this.unlockOne(tmpPageNum,tmpJobNum,true,destPoint)
                this.onChooseJob(tmpPageNum,tmpJobNum)
            }else{
                if (tmpIdx == i){
                    for(const j in this.m_tJobIconPage){
                        this.unlockOne(j,1,true,0)
                    }
                    this.onChooseJob(tmpPageNum,1)
                }
            }
        }
        this.m_oJobScroll.scrollToPage(tmpPageNum)

        this.m_oJobPointLab.string = Ls.get(300009)+this.m_iLostJp
    },
    updateJobInfo:function(destJob,showMax){
        var tmpPoint = this.m_iJobPoint
        var tmpInfoData = null
        var getAllAttr = function(jobId,jobNum){
            var retArr = {}
            var tmpJobs = Gm.config.getAllJobById(jobId)
            var tmpLens = tmpJobs.length
            for(var i = 1;i < tmpLens;i++){
                var infoD = null
                var tmpMax = Gm.config.getMaxJob(tmpJobs[i])
                if (i == tmpLens - 1){
                    if (jobNum > tmpMax){
                        jobNum = tmpMax
                    }
                    infoD = Gm.config.getNextJobAdds(tmpJobs[i],jobNum)
                }else{
                    infoD = Gm.config.getNextJobAdds(tmpJobs[i],tmpMax)
                }
                if (infoD){
                    for(const j in infoD){
                        var tmpJia = j.indexOf("+")
                        if (infoD[j] && tmpJia > 0){
                            var tmpId = j.substring(0,tmpJia)
                            retArr[tmpId] = infoD[j]
                        }
                    }
                }
            }
            return retArr
        }
        if (showMax){
            tmpPoint = Gm.config.getMaxJob(destJob.id)
            tmpInfoData = getAllAttr(destJob.id,tmpPoint)
        }else{
            if (destJob.id == this.m_iJobNum){
                tmpInfoData = getAllAttr(destJob.id,this.m_iJobPoint+1)
            }else{
                tmpInfoData = getAllAttr(destJob.id,1)
            }
            if (this.m_iJobPoint == tmpMax){
                tmpPoint = 0
            }
        }
        
        this.updateLockSkill(destJob)
        // console.log("tmpHeroData=2==:",tmpHeroData)
        // console.log("tmpInfoData=2==:",tmpInfoData)

        Func.destroyChildren(this.m_oInfoScroll.content)
        if (tmpInfoData){
            var tmpPersent = function(attrId){
                var tmpValue = tmpInfoData[attrId[1]] || 0
                if (attrId[2]){
                    var tmpName1 = Gm.config.getBaseAttr(attrId[2])
                    var tmpValue1 = tmpInfoData[attrId[2]] || 0
                    return "<color=#EBE9AA>(</c><color=#4CBD20>+"+(tmpValue/100)+"%</c>"+"<color=#EBE9AA>"+tmpName1.childTypeName+"</c><color=#4CBD20>:"+(tmpValue1/100)+"%</c>"+"<color=#EBE9AA>)</c>"
                }else{
                    return "<color=#EBE9AA>(</c><color=#4CBD20>+"+(tmpValue/100)+"%</c><color=#EBE9AA>)</c>"
                }
            }
            for(const i in fight_value){
                if (tmpInfoData[fight_value[i][0]] || tmpInfoData[fight_value[i][1]]){
                    var tmpName0 = Gm.config.getBaseAttr(fight_value[i][0])
                    var item = cc.instantiate(this.m_oInfoItem)
                    item.active = true
                    var tmpValue = tmpInfoData[fight_value[i][0]] || 0
                    var tmpsoint = ""
                    if (fight_value[i][0] > 500){
                        tmpValue = tmpValue/100
                        tmpsoint = "%"
                    }
                    this.m_oInfoScroll.content.addChild(item)
                    var lab = item.getChildByName("lab").getComponent(cc.RichText)
                    var str = "<color=#EBE9AA>"+tmpName0.childTypeName+"</c><color=#4CBD20>  +"+tmpValue + tmpsoint +"</color>"
                    if (fight_value[i][1]){
                        str = str + tmpPersent(fight_value[i])
                    }
                    lab.string = str
                }
            }
        }
        var tmpMax = Gm.config.getMaxJob(destJob.id)
        this.m_oNameLab.string = destJob.name+tmpPoint+"/"+tmpMax
    },
    onChooseJob:function(destPage,destIdx){
        // console.log("onChooseJob===:",destIdx,this.m_iSelet2)
        let tmpCell = this.getJobCell(destPage,destIdx).getComponent("JobBase")
        if (this.m_iSelet1 != destPage || this.m_iSelet2 != destIdx){
            if (this.m_iSelet2 > 1 && this.m_iSelet2 < 4 && destIdx == 1){
                this.updateLockSkill(tmpCell.m_oData)
                this.updateJobInfo(tmpCell.m_oData,true)
                return
            }
            if (this.m_iSelet2 > 3 && (destIdx > 0 && destIdx  < 4)){
                this.updateLockSkill(tmpCell.m_oData)
                this.updateJobInfo(tmpCell.m_oData,true)
                return
            }

            if (tmpCell && !tmpCell.m_oSeletSpr.active){
                tmpCell.callSelet(!tmpCell.m_oSeletSpr.active)
                this.m_bMaxSelf = false
                this.updateJobInfo(tmpCell.m_oData)
            }
            if (this.m_iSelet2){
                this.getJobCell(this.m_iSelet1,this.m_iSelet2).getComponent("JobBase").callSelet(false)
            }
            this.m_iSelet1 = destPage
            this.m_iSelet2 = destIdx
        }else{
            this.m_bMaxSelf = !this.m_bMaxSelf
            this.updateJobInfo(tmpCell.m_oData,this.m_bMaxSelf)
            this.updateLockSkill(tmpCell.m_oData)
        }
    },
    onShowLock:function(destPage,destIdx){
        // console.log("onShowLock===:",destIdx,this.m_iSelet2)
        var tmpCell = this.getJobCell(destPage,destIdx).getComponent("JobBase")
        this.updateJobInfo(tmpCell.m_oData,true)
        this.updateLockSkill(tmpCell.m_oData)
    },
    updateLockSkill:function(destJob){
        Func.destroyChildren(this.m_oSkillScroll.content)
        if (destJob){
            var tmpHeroData = null
            var tmpLevelNow = 0
            var tmpBaseJob = Gm.config.getAllJobById(this.m_iJobNum)
            if (destJob.id == this.m_iJobNum){
                tmpLevelNow = this.m_iJobPoint
                if (this.m_bHasNext){
                    tmpLevelNow = Gm.config.getMaxJob(destJob.id)
                }
                tmpHeroData = Gm.config.getAllLearnSkill(this.m_iJobNum)
            }else{
                tmpLevelNow = 1
                for(const i in tmpBaseJob){
                    if (tmpBaseJob[i] == destJob.id){
                        tmpLevelNow = tmpLevelNow + Gm.config.getMaxJob(destJob.id)
                    }
                }
                tmpHeroData = Gm.config.getAllLearnSkill(destJob.id)
            }
            for(const i in tmpHeroData){
                var tmpPage = cc.instantiate(this.m_oSkillPerfab)
                tmpPage.setScale(0.9)
                tmpPage.parent = this.m_oSkillScroll.content
                var tmpSpt = tmpPage.getComponent("SkillBase")
                tmpSpt.setOwner(this,Gm.config.getSkill(tmpHeroData[i].baseId),tmpHeroData[i].condition > tmpLevelNow)
            }
        }
    },
    onUpgradeClick:function(sender){
        if (this.m_iLostJp > 0){
            var tmpJob = IdAy[this.m_iSelet1][this.m_iSelet2-1]
            var tmpPoint = this.m_iJobPoint
            var tmpHasNew = false
            var tmpMax = Gm.config.getMaxJob(tmpJob)
            if (this.m_iJobPoint == 0){
                tmpHasNew = true
            }
            var tmpLost = tmpMax - this.m_iJobPoint
            if (this.m_iLostJp < tmpLost){
                tmpPoint = tmpPoint + this.m_iLostJp
            }else{
                tmpPoint = tmpPoint + tmpLost
            }
            var self = this
            if (tmpHasNew){
                var tmpConfig = Gm.config.getJobWithId(tmpJob)
                if (sender){
                    Gm.box({msg:cc.js.formatStr(Ls.get(300010),tmpConfig.name),btnNum:2,title:Ls.get(300011)},function(btnType){
                        if (btnType== 1){
                            Gm.heroNet.addJobPoint(self.m_oData.heroId,tmpJob,tmpPoint)
                        }
                    })
                }else{
                    Gm.heroNet.addJobPoint(self.m_oData.heroId,tmpJob,tmpPoint)
                }
            }else{
                Gm.heroNet.addJobPoint(self.m_oData.heroId,tmpJob,tmpPoint)
            }
        }else{
            Gm.floating(Ls.get(300012))
        }
    },
    onSkillClick:function(destData){
        Gm.ui.create("TipsInfoView",{str:destData,x:0,y:200})
    },
    onReFreshClick:function(){
        Gm.heroNet.removeJobPoint(this.m_oData.heroId)
    },
    onMySkillClick:function(){
        Gm.ui.create("SkillSetView",this.m_oData)
    },
    onHelpClick:function(){

    },
    onCloseClick:function(){
        Gm.red.remove(this.m_oBtnSkill,"heroSkill",this.m_oData.baseId)//技能点
    	this.onBack()
    },
    getJobCell:function(destIdx,destNm){
        return this.m_tJobIconPage[destIdx].getChildByName("btn"+destNm).getChildByName("job")
    },
    unlockOne:function(destIdx,destNm,destValue,destPoint){
        var tmpJobBase = this.getJobCell(destIdx,destNm)
        tmpJobBase.getComponent("JobBase").updateLock(!destValue)
        tmpJobBase.getComponent("JobBase").updatePoint(destPoint)
    },
    translateJobToIndex:function(destJob){

    },
});

