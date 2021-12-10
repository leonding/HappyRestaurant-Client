var BaseView = require("BaseView")
// HelpInfoBox
const BIND = 1
const SWITCH = 2

const PLATFORMTYPE_GOOGLE = 2
const PLATFORMTYPE_IOS = 1000
const PLATFORMTYPE_GAME_CENTER = 1001

const APPLE_BTN = 1 
const GOOGLE_BTN = 1 << 1
const TWITTER_BTN = 1<< 2

const GAME_CENTER = 1 << 3
cc.Class({
    extends: BaseView,
    properties: {
        m_googleBtn:cc.Node,
        m_twiterBtn:cc.Node,
        m_appleBtn:cc.Node, 
        m_gameCenterBtn:cc.Node,
    },

    onLoad(){
        this._super()
    },
    updateUI(){
        var isBind = cc.sys.localStorage.getItem("isBindAccount") || "0" 
        if( this.m_operType ==  BIND){//已经绑定
            if((this.m_btnType & APPLE_BTN) == APPLE_BTN ){
                this.m_appleBtn.getComponent(cc.Button).interactable = parseInt(isBind) == 0
            }
            
            if((this.m_btnType & GOOGLE_BTN) == GOOGLE_BTN ){
                this.m_googleBtn.getComponent(cc.Button).interactable = parseInt(isBind) == 0
            }

            if((this.m_btnType & TWITTER_BTN) == TWITTER_BTN ){
                this.m_twiterBtn.getComponent(cc.Button).interactable = parseInt(isBind) == 0
            }
            
            if((this.m_btnType & GAME_CENTER) == GAME_CENTER ){
                this.m_gameCenterBtn.getComponent(cc.Button).interactable = parseInt(isBind) == 0
            }
        }
        //cc.sys.localStorage.setItem("isBindAccount",0) 
    },

    enableUpdateView:function(args){
        if(args){
            this.m_operType = args.operType
            this.m_btnType = args.btnType
            this.m_title  = args.title
        }
        this.hideButton()
        this.popupUI.setTitle(Ls.get(this.m_title))
        this.updateUI()
    },

    hideButton(){
       this.m_appleBtn.active = (this.m_btnType & APPLE_BTN) == APPLE_BTN 
       this.m_googleBtn.active = (this.m_btnType & GOOGLE_BTN) == GOOGLE_BTN 
       this.m_twiterBtn.active =  (this.m_btnType & TWITTER_BTN) == TWITTER_BTN 
       this.m_gameCenterBtn.active =  (this.m_btnType & GAME_CENTER) == GAME_CENTER 
    },

    onGoogleClick(){
        Bridge.changeGoogleAccount(this.googleTokenCallback.bind(this))
        // var t = "googleChangeAccount_eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwOTJiNjEyZTliNjQ0N2RlYjEwNjg1YmI4ZmZhOGFlNjJmNmFhOTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NjEyNTkxMzQxNjMtNXRzMjlrZjJwaTllOXA4M3FyMGVsc3B1Z2I0aTJjMDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NjEyNTkxMzQxNjMtbnQ1MmwzcGE1aW9xcGFwcnI3MjJsajd0OG9wMTVuMGIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5OTIyMTkzNTAzNTc0MTU0NjYiLCJlbWFpbCI6Im1hbGNvbG0uMTM3MjhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJ6aGVuanVuIGxpIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tX3V6RnZ2bU1rUU0vQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbXl1ckc0NkliOXBlWDV3dkpFaUJ0NFdTOExvdy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiemhlbmp1biIsImZhbWlseV9uYW1lIjoibGkiLCJsb2NhbGUiOiJ6aC1DTiIsImlhdCI6MTYwNDkwMTg2MSwiZXhwIjoxNjA0OTA1NDYxfQ.pLSY9FRWwL-mEKI7xwQkzszgsF-gKI20MIUiijUFAriybA2Z90CsXLLXBOyQr0qb-KhN3g2AicCiRf4SHFPi9LyEACtQ-dvla7U-g3a5rOtyjktIoDUE16cxpPz3ttHYYR2M1Pebtf7skDcBegU-b-RwWKSEAoTmcBUwoegcSMS5_pEyIH4Lj-Nrfe2GFQcMtlVUjAvXlXBfE23ppFwmeQQQSu8gQ1PFvOZ4Y6LmKY-4pMKIUUYclKhjKo-v9Y2yHLi_JfP7QiaXhuL885uGpgJPvH8MQhpc63de0BDQVU4jVZslXKFW_p7EmWFNB8FE5-zsGidjFsuqbjIX73Gspg"
        // Bridge.toJs(t)
    },

    googleTokenCallback(token){
        if(this.m_operType == BIND){
            Gm.accountNet.sendBindToken( Gm.userInfo.id,token,PLATFORMTYPE_GOOGLE)
        }

        if(this.m_operType == SWITCH){
            Gm.accountNet.sendSwitchToken(Gm.userInfo.id,token,PLATFORMTYPE_GOOGLE)
        }
    },

    onTwitterClick(){

    },

    onAppleClick(){
        console.log("onAppleClick ====>")
       // var t =  "googlePlayLogin_eyJraWQiOiI4NkQ4OEtmIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmp5aGQuZ3VhamlDbGllbnRKcCIsImV4cCI6MTYwNDk5MjIzNCwiaWF0IjoxNjA0OTA1ODM0LCJzdWIiOiIwMDA4NjEuOWQ0YzU2NjA1MjRkNGE3ZDliMTRlNzJjOGNjNDU0NmYuMDcxMCIsImNfaGFzaCI6ImxaUmJZdDhBRWltMkZPcExIQWZqZGciLCJlbWFpbCI6IjY5MjlhaWdjZ21AcHJpdmF0ZXJlbGF5LmFwcGxlaWQuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiaXNfcHJpdmF0ZV9lbWFpbCI6InRydWUiLCJhdXRoX3RpbWUiOjE2MDQ5MDU4MzQsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZSwicmVhbF91c2VyX3N0YXR1cyI6Mn0.W8942TbzsrFhStYlN12or8VVhMu86regcOExnnlLJ_EFdzJ1DGHoVom33TO-C9mk6yhbosx3OFF9KyQANiSjDwHGDe94YA9bTHzfVojlMpUa--jwNUZsmg_yWqt-5UjL6MjXamW_dd9drldnRZ11n4mRU7k_Vm9YiQFu856r4ozBPU2iGu8C8zGlbRKdgoLsazgxxViKchOrgGv1o0TR9OePSXK5Fwx2ZnB2QM5UetANJ9E9R0FFtil6-dgwy7SRWYDb-1wc-SG8fTjnhpPVfGNLOUCmFPoCwx21yHI2A4Or56G_NN5ByFX-93-FsZISFYGzervBFCazBOP5ZnhdBQ"
       if(parseFloat(__getOSVersion()) < 13){
          Gm.floating(Ls.get(5820))
       }else{
            Bridge.checkAppleLogin(this.appleTokenCallBack.bind(this))
       }
     //   Bridge.toJs(t)
      
    },

    onGameCenterClick(){
        console.log("onGameCenterClick ====>")
        Bridge.checkGameCenter(this.appleGameCenterCallBack.bind(this))
        // var t = "gameCenter_U:5274fb73843b92a0077e9144d8fc4233"
        // Bridge.toJs(t)
    },

    appleGameCenterCallBack(playerId){
        console.log("gameCenterId",playerId)
        if(this.m_operType == SWITCH){
            Gm.accountNet.sendSwitchToken(Gm.userInfo.id,playerId,PLATFORMTYPE_GAME_CENTER)
        }

        if(this.m_operType == BIND){
            Gm.accountNet.sendBindToken(Gm.userInfo.id,playerId,PLATFORMTYPE_GAME_CENTER)
        }
    },

    setBindStatus(status){
        cc.sys.localStorage.setItem("isBindAccount",status.toString()) 
        this.updateUI()
    },

    appleTokenCallBack(token){
        console.log("appleToken",token)
        if(this.m_operType == SWITCH){
            Gm.accountNet.sendSwitchToken(Gm.userInfo.id,token,PLATFORMTYPE_IOS)
        }

        if(this.m_operType == BIND){
            Gm.accountNet.sendBindToken(Gm.userInfo.id,token,PLATFORMTYPE_IOS)
        }
    },

});

