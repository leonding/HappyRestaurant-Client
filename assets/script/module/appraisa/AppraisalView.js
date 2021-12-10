/**
 *引导玩家评论页面
*/
var BaseView = require("BaseView")
const ANDROID_PACKAGENAME_JP ="com.jyhd.gjJpRelease"
const IOS_APPID_JP = "1525352889"

const success_time = 15
// HelpInfoBox
cc.Class({
    extends: BaseView,
    properties: {
        m_oAppraisaLabel:cc.Label,
        m_oRewardNode:cc.Node,
    },
    enableUpdateView:function(destData){
        if(destData){
            this.initUI()
            Gm.appraisalData.setOpenAppraisaView()
            Gm.red.refreshEventState("appraisal")
        }
    },
 
    initUI(){
      var reward =  Func.itemSplit(Gm.config.getConst("app_comment_reward"))
      var item = Gm.ui.getNewItem(this.m_oRewardNode)
      item.setData(reward[0])
      if(reward[0].type == ConstPb.itemType.HERO_CARD){
        item.setFb(this.showHero.bind(this))
      }
      this.m_oAppraisaLabel.string = this.m_isAppraisaSuccess ? Ls.get(30003) : this.m_oAppraisaLabel.string
    },

    showHero(data,type,owner){
        Gm.ui.create("UnLockHero",{qualityId:data.id})
    },

    register:function(){
        this.events[Events.ENTER_SHOW]           = this.appShow.bind(this)
    },

    onLoad(){
        this._super()
        this.m_isAppraisaSuccess = Gm.appraisalData.isReceive()
    },

    onOKClick(){
        if(cc.sys.isNative && !this.m_isAppraisaSuccess ){
            var url = ""
            if(Bridge.isIos()){
                url = "itms-apps://itunes.apple.com/app/id%s?action=write-review"
                url =  cc.js.formatStr(url,IOS_APPID_JP)
            }else if(Bridge.isAndroid()){
                url = "https://play.google.com/store/apps/details?id=%s"
                url =  cc.js.formatStr(url,ANDROID_PACKAGENAME_JP)
            }
            jsb.openURL(url)
            this.m_currentMinutes = new Date().getTime()
            Gm.appraisalNet.senAppraisa(1)
        }else if((!cc.sys.isNative) && (!this.m_isAppraisaSuccess)){
            Gm.appraisalNet.senAppraisa(1)
            this.appraisalSuccess()
        }else if(this.m_isAppraisaSuccess){
            this.receiveReward()
        }
    },

    appShow(){
        this.m_currentMinutes -= new Date().getTime()
        if(parseInt((Math.abs(this.m_currentMinutes) / 1000))  > success_time){
            this.appraisalSuccess()
        }else{
            this.appraisalFail()
        }
    },

    appraisalSuccess(){
        this.m_isAppraisaSuccess = true
        Gm.appraisalData.setReceive(this.m_isAppraisaSuccess)
        this.m_oAppraisaLabel.string = Ls.get(30003)
    },

    appraisalFail(){

    },

    receiveReward(){
        Gm.appraisalNet.senAppraisa(2)
    },

    onCancelClick(){
       this.onBack()
    }

});

