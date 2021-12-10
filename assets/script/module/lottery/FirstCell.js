// FirstCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oMainSpr:cc.Sprite,
        m_oBtnShow:cc.Node,
        m_oNameLab:cc.Label,
        m_oBtnOne:cc.Node,
        m_oBtnTen:cc.Node,
        m_oTimeLab:cc.Label,
    },
    setOwner:function(data,activityID,startTime){
        this.m_oData = data
        this.activityID = activityID
        this.startTime = startTime
        Gm.load.loadSpriteFrame("texture/ck/"+this.m_oData.res,function(spr,icon){
            icon.spriteFrame = spr
        },this.m_oMainSpr)
    },
    updateInfo:function(args){
        this.m_oInfo = args
        if (this.m_oData.duration){
            this.m_iLostTime = this.startTime + this.m_oData.duration * 86400
        }
        var tmpDrawNum = this.m_oInfo.hasDrawOne || 0
        var self = this
        var tmpBtn = function(destNode,destData){
            var tmpRet = Gm.lotteryData.getUsed(destData)
            var lab1 = destNode.getChildByName("node").getChildByName("lab1")
            for(const i in destData){
                if (destData[i].type == ConstPb.itemType.TOOL){
                    lab1.getComponent(cc.Label).string = destData[i].num + Ls.get(20008)
                    break
                }
            }
            
            var lab2 = destNode.getChildByName("node").getChildByName("lab2")
            lab2.active = true
            lab2.getComponent(cc.Label).string = destData[tmpRet.idx].num
            var spr = destNode.getChildByName("node").getChildByName("spr")
            spr.active = true
            if (tmpRet.done){
                Gm.ui.getConstIcon(tmpRet.done,function(sp){
                    spr.getComponent(cc.Sprite).spriteFrame = sp
                    spr.width =  sp._originalSize.width * 0.45
                    spr.height =  sp._originalSize.height * 0.45
                })
            }
            var time = destNode.getChildByName("time")
            if (time){
                time.active = false
            }
        }
        tmpBtn(this.m_oBtnTen,this.m_oData.tenCost)

        this.m_iFreeTime = 0
        if (this.m_oInfo.nextFreeTime == 0){
            var lab1 = this.m_oBtnOne.getChildByName("node").getChildByName("lab1")
            lab1.getComponent(cc.Label).string = Ls.get(20009)
            var lab2 = this.m_oBtnOne.getChildByName("node").getChildByName("lab2")
            lab2.active = false
            var spr = this.m_oBtnOne.getChildByName("node").getChildByName("spr")
            spr.active = false
            var time = this.m_oBtnOne.getChildByName("time")
            time.active = false
        }else{
            tmpBtn(this.m_oBtnOne,this.m_oData.oneCost)
            var time = this.m_oBtnOne.getChildByName("time")
            time.active = true
            if (this.m_oInfo.nextFreeTime > 0){
                this.m_iFreeTime = this.m_oInfo.nextFreeTime
            }else{
                this.m_iFreeTime = Gm.userData.getDayEnd()
            }
            time.getComponent(cc.Label).string = Func.timeEachDay(this.m_iFreeTime/1000)+Ls.get(20010)
        }
        var max = Gm.config.getConst("prize_draw_num")
        this.m_oNameLab.string = max - (tmpDrawNum%max)
    },
    onRewardClick:function(){
        Gm.award({award:this.m_oData.dropShow})
    },
    onOneClick:function(){
        if (this.m_bLock){
            return
        }
        var tmpRet = Gm.lotteryData.getUsed(this.m_oData.oneCost)
        if (tmpRet.done || this.m_oInfo.nextFreeTime == 0){
            Gm.cardNet.sendDrawCard(this.activityID,this.m_oInfo.fieldId,0)
        }else{
            Gm.floating(Ls.get(20011))
        }
    },
    onTenClick:function(){
        if (this.m_bLock){
            return
        }
        var tmpRet = Gm.lotteryData.getUsed(this.m_oData.tenCost)
        if (tmpRet.done){
            Gm.cardNet.sendDrawCard(this.activityID,this.m_oInfo.fieldId,1)
        }else{
            Gm.floating(Ls.get(20011))
        }
    },
    updateRefreshTime:function(){
        if (this.m_iFreeTime){
            this.m_iFreeTime = this.m_iFreeTime - 1000
            var time = this.m_oBtnOne.getChildByName("time")
            time.active = true
            if (this.m_iFreeTime < 0){
                this.m_iFreeTime = 0
                Gm.cardNet.sendDrawCardInfo(this.activityID)
            }else{
                time.getComponent(cc.Label).string = Func.timeEachDay(this.m_iFreeTime/1000)+Ls.get(20013)
            }
        }
        if (this.m_iLostTime){
            var time = this.m_iLostTime - Gm.userData.getTime_s()
            if (time < 0){
                this.m_iLostTime = 0
                Gm.cardNet.sendDrawCardInfo(this.activityID)
            }else{
                this.m_oTimeLab.string = Ls.get(20013)+Func.timeEachDay(time)
            }
        }
    },
});

