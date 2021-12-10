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
    },
    setOwner:function(destOwner,data){
        this.m_iType = -1
        this.m_oData = data
        this.m_oOwner = destOwner
        this.m_oNameLab.string = data.name
        this.m_oNumslab.string = "-/-"

        Func.destroyChildren(this.m_oGiftNode)
        
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
                tmpOut.color = cc.color(128,79,54)
                this.m_oBtnLab.string = Ls.get(40004)
                this.m_oNumslab.string = destRate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = destRate/this.m_oData.rate
            }else if(destType == CELL_DONE){
                tmpOut.color = cc.color(86,86,86)
                this.m_oBtnLab.string = Ls.get(40005)
                this.m_oNumslab.string = this.m_oData.rate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = this.m_oData.rate/this.m_oData.rate
            }else if(destType == CELL_FINISH){
                tmpOut.color = cc.color(36,86,117)
                this.m_oBtnLab.string = Ls.get(40006)
                this.m_oNumslab.string = this.m_oData.rate+"/"+this.m_oData.rate
                this.m_oCellBar.progress = this.m_oData.rate/this.m_oData.rate
            }
        }
    },
    onCellClick:function(){
        if (this.m_iType == CELL_DONE){
            Gm.audio.playEffect("music/09_achieve")
            Gm.taskNet.sendTaskReceive(this.m_oData.id)
        }else if(this.m_iType == CELL_DOING){
            cc.log(this.m_oData.intoUi)
            Gm.ui.jump(this.m_oData.intoUi)
            this.m_oOwner.onBack()
        }
    },
});

