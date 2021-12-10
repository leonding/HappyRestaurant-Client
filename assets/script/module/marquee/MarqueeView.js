var BaseView = require("BaseView")

const SHOWNONE = 0
const SHOWMARQ = 1

const SPEED = 100
cc.Class({
    extends: BaseView,

    properties: {
        m_oScrollBg:cc.Node,
        m_oBgSpr:cc.Sprite,
        m_oRichLab:cc.RichText,
    },
    onLoad () {
        var xx = this.node.x
        var yy = this.node.y
        this._super()
        this.node.x = xx
        this.node.y = yy
    },
    enableUpdateView:function(destData){

    },
    changeType:function(destType){
        if (this.m_iRunType != destType){
            this.m_iRunType = destType
            if (this.m_iRunType == SHOWMARQ){
                this.node.active = true
            }else{
                this.node.active = false
            }
        }
    },
    updateMarquee:function(destData){
        if (this.m_tStrList == null && destData){
            this.m_tStrList = destData
            this.playLabel()
        }
    },
    deleteLabel:function(){
        this.changeType(SHOWNONE)
        this.m_oRichLab.node.stopAllActions()
        this.m_tStrList = null
    },
    playLabel:function(){
        var self = this
        this.changeType(SHOWMARQ)
        var tmpWid = this.m_oScrollBg.width
        var defulatColor  = ["ff","ff","ff"]
        if (this.m_tStrList.color){
            defulatColor[0] = this.m_tStrList.color.substring(0,2)
            defulatColor[1] = this.m_tStrList.color.substring(2,4)
            defulatColor[2] = this.m_tStrList.color.substring(4,6)
        }
        this.node.active = true
        var tmpStr = Func.splotStr(this.m_tStrList.content,defulatColor)
        this.m_oRichLab.string = tmpStr
        var playDone = function(){
            self.m_tStrList.rollTimes = self.m_tStrList.rollTimes - 1
            self.node.active = false
            self.scheduleOnce(function(){
                if (self.m_tStrList.rollTimes <= 0){
                    Gm.marqueeData.removePlayed()
                    self.m_tStrList = Gm.marqueeData.getFirstItem()
                }
                if (self.m_tStrList){
                    self.playLabel()
                }else{
                    self.deleteLabel()
                }
            },self.m_tStrList.interval)
        }
        var tmpX = - this.m_oRichLab.node.width
        var tmpTime = Math.floor((tmpWid + this.m_oRichLab.node.width)/SPEED)
        this.m_oRichLab.node.stopAllActions()
        this.m_oRichLab.node.x = tmpWid
        var tmpAction = cc.sequence(cc.moveTo(tmpTime,cc.v2(tmpX,0)),cc.callFunc(playDone))
        this.m_oRichLab.node.runAction(tmpAction)
    },
});
