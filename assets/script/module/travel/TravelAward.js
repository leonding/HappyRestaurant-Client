var BaseView = require("BaseView")
// TravelAward
const fenduan = [0,20,40,60,80,100,9999]
const jiangli = ["reward1","reward2","reward3","reward4","reward5","reward"]
cc.Class({
    extends: BaseView,
    properties: {
        content:cc.Node,
        m_oTipsLab:cc.Label,

        m_oNoneLab:cc.Node,
    },
    enableUpdateView:function(data){
        if (data){
            // Gm.audio.playEffect("music/02_popup_open")
            this.m_oData = data.data
            this.m_bFrom = data.from
            var tmpAward = null
            if (this.m_bFrom){
                var tmpStar = Gm.config.getConst("travel_quick_completion_"+this.m_oData.config.star)
                var tmpLost = Math.floor((this.m_oData.startTime - Gm.userData.getTime_m())/1000 ) + this.m_oData.config.time
                var tmpGold = Math.ceil((tmpLost/this.m_oData.config.time) * tmpStar)
                this.m_oTipsLab.string = cc.js.formatStr(Ls.get(600116),tmpGold)
                tmpAward = this.m_oData.config.reward
            }else{
                this.m_oTipsLab.string = Ls.get(600094)
                var tmpFen = Math.floor((((Gm.userData.getTime_m() - this.m_oData.startTime)/1000)/this.m_oData.config.time)*100)
                var tmpLen = fenduan.length
                for(var i = 1;i < tmpLen;i++){
                    var xiao = i - 1
                    // console.log("tmpFen==:",fenduan[xiao],tmpFen,fenduan[i],jiangli[xiao])
                    if (tmpFen >= fenduan[xiao] && tmpFen < fenduan[i]){
                        tmpAward = this.m_oData.config[jiangli[xiao]]
                        break
                    }
                }
                
            }
            Func.destroyChildren(this.content)
            if (tmpAward && tmpAward.length > 0){
                this.m_oNoneLab.active = false
                for(const i in tmpAward){//this.m_oData.config.reward
                    var tmpData = tmpAward[i]
                    var itemSp = Gm.ui.getNewItem(this.content)
                    itemSp.setData(tmpData)
                }
            }else{
                this.m_oNoneLab.active = true
                // this.m_oTipsLab.string = " "
            }
        }
    },
    onNoClick:function(){
        this.onBack()
    },
    onOkClick:function(){
        if (this.m_bFrom){
            var tmpStar = Gm.config.getConst("travel_quick_completion_"+this.m_oData.config.star)
            var tmpLost = Math.floor((Gm.userData.getTime_m() - this.m_oData.startTime)/1000 )
            var tmpGold = Math.ceil((tmpLost/this.m_oData.config.time) * tmpStar)

            if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:tmpGold})){
                Gm.travelNet.sendTravelTaskDone(this.m_oData.index,true)
                this.onBack()
            }
        }else{
            Gm.travelNet.sendTravelTaskDone(this.m_oData.index,false)
            this.onBack()
        }
    },
});

