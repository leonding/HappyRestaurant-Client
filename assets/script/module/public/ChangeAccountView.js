var BaseView = require("BaseView")
// HelpInfoBox
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
    },
    enableUpdateView:function(destData){
 
    },
    onNoClick:function(){
        this.onBack()
    },

    //切换google帐号
    onBtGooglePlayAccount(){
       Bridge.changeGoogleAccount()
      // var t = "googleChangeAccount_eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiODNmMTgwMjNhODU1NTg3Zjk0MmU3NTEwMjI1MTEyMDg4N2Y3MjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NjEyNTkxMzQxNjMtZWRrbGtrOGFhaGs1bTRtaGtoN3Vic2xxczMxNjBzbHUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NjEyNTkxMzQxNjMtazNnN2dpNzZnaWlmMDhybWF0aG5uMG5qcmZydHUzbmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3NjcwMTg1ODUyOTk3NzkxMjEiLCJlbWFpbCI6InBhbmduYW53dWRpMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Im5hbiBwYW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGg2Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVzI5eVVGZTNpXzQvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbk9YTnh0M1VCdi1fb2NFTFJTVGRXcFZRNVE4US9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoibmFuIiwiZmFtaWx5X25hbWUiOiJwYW5nIiwibG9jYWxlIjoiamEiLCJpYXQiOjE2MDA2NzAxNTQsImV4cCI6MTYwMDY3Mzc1NH0.kz3a6I29jzoIF5tGa9U_KFle-RrCE-97Ix9OW7zNmqIlW15FEtYx7IWHebIBDZjUtEb2-jt71HnM_nAFs7ifSwXctq2iggKdrJBsy5LNzCKMTJ-HmO-3whGLueCgIEOTANS6q9NlkRJkbcQJ2MyC6s2lcfAWOT7aChzzl_1VUnVZrkgCOzF8cWQE18WBmXC"
      // Bridge.toJs(t)
    },

    //引继码
    onBtInheritCode(){
        Gm.ui.create("UserInheritView",2)
    }

});

