// MissionCell
const ACTIVE_ID = 3001
const CELL_DOING = 0
const CELL_DONE = 1
const CELL_FINISH = 2

const TYPE_ACTIVE = 0
const TYPE_LIST = 1
cc.Class({
    extends: cc.Component,

    properties: {
        m_iCellType:-1,
        m_oGiftNode:cc.Node,
        m_oNameLab:cc.Label,
        m_oMakeBtn:cc.Button,
        m_oBtnLab:cc.Label,
        m_oNumslab:cc.Label,
        m_oCellBar:cc.ProgressBar,
        m_oLockLab:cc.Label,
        m_oClearNode:cc.Node,
        m_oGetNode:cc.Node,
        m_oMaskNode:cc.Node,
    },
    setOwner:function(destOwner,data){
        this.m_iType = -1
        this.m_oData = data
        this.m_oOwner = destOwner
        this.m_oNameLab.string = data.name
        this.m_oNumslab.string = "-/-"

        Func.destroyChildren(this.m_oGiftNode)
        if (this.m_iCellType == TYPE_ACTIVE){
            this.m_oLockLab.node.active = false
            var itemSp = Gm.ui.getNewItem(this.m_oGiftNode)
            itemSp.updateItem({baseId:ACTIVE_ID,count:data.active})
            if (this.m_oData.openLevel > Gm.userInfo.maxMapId){
                this.m_oMakeBtn.node.active = false
                this.node.opacity = 120
                this.m_oLockLab.node.active = true
                this.m_oLockLab.string = Ls.get(7014) + Func.transMap(this.m_oData.openLevel) + Ls.get(50016)
                this.m_oCellBar.node.active = false
            }else{
                this.m_oMakeBtn.node.active = true
                this.node.opacity = 255
            }
        }else{
            if (data.rewardStr && data.rewardStr.length > 0){
                for(const i in data.rewardStr){
                    var itemSp = Gm.ui.getNewItem(this.m_oGiftNode)
                    itemSp.updateItem({baseId:data.rewardStr[i].id,count:data.rewardStr[i].num})
                }
            }
            if (this.m_oData.openLevel > Gm.userInfo.maxMapId){
                this.m_oMakeBtn.node.active = false
                this.node.opacity = 120
                this.m_oLockLab.node.active = true
                this.m_oLockLab.string = Ls.get(7014) + Func.transMap(this.m_oData.openLevel) + Ls.get(50016)
            }else{
                this.m_oMakeBtn.node.active = true
                this.node.opacity = 255
                this.m_oLockLab.node.active = false
            }
        }
    },
    updateMission:function(destRate){
        var destType = CELL_FINISH
        if (destRate != -1){
            // console.log("destRate==:",this.m_oData.id,destRate,this.m_oData.rate)
            if (this.m_oData.rate == destRate){
                destType = CELL_DONE
            }else{
                destType = CELL_DOING
            }
        }
        if (this.m_iType != destType){
            this.m_iType = destType
            this.m_oMakeBtn.getComponent(cc.Sprite).spriteFrame = this.m_oOwner.getCellFrame(destType)
            var tmpOut = this.m_oBtnLab.node.getComponent(cc.LabelOutline)
            if (destType == CELL_DOING){
                tmpOut.color = cc.color(114,57,25)
                this.m_oBtnLab.string = Ls.get(40004)
                this.m_oNumslab.string = destRate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = destRate/this.m_oData.rate
                this.m_oClearNode.active = false
            }else if(destType == CELL_DONE){
                tmpOut.color = cc.color(22,62,82)
                this.m_oBtnLab.string = Ls.get(40005)
                this.m_oNumslab.string = this.m_oData.rate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = this.m_oData.rate/this.m_oData.rate
                this.m_oClearNode.active = true
            }else if(destType == CELL_FINISH){
                tmpOut.color = cc.color(54,44,43)
                this.m_oBtnLab.string = Ls.get(40006)
                this.m_oNumslab.string = this.m_oData.rate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = this.m_oData.rate/this.m_oData.rate
                this.m_oClearNode.active = false
                if (this.m_oGetNode){
                    this.m_oGetNode.active = true
                    this.m_oMaskNode.active = true
                }
            }
        }
    },
    onCellClick:function(){
        if(this.m_oData.type == ConstPb.EventOpenType.EVENTOP_SHENJI_TASK && !EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_SHENJI_TASK)){
            Gm.floating(Ls.get(7000007))
            return
        }
        if (this.m_iType == CELL_DONE){
            Gm.audio.playEffect("music/09_achieve")
            Gm.taskNet.sendTaskReceive(this.m_oData.id)
        }else if(this.m_iType == CELL_DOING){
            cc.log(this.m_oData.intoUi)
            Gm.ui.jump(this.m_oData.intoUi)
             var config = Gm.config.getViewById(this.m_oData.intoUi)
            if(config.clientDes != "DungeonActivityView" && config.clientDes != "DungeonMissionView"){
                Gm.ui.removeByName("DungeonActivityView")
                Gm.ui.removeByName("DungeonMissionView")
            }
            this.m_oOwner.onBack()
        }
    },
});

