var MSGCode = require("MSGCode")

cc.Class({
    properties: {
        
    },
    sendChangeAccountToken(cToken,platform){
        //将切换帐号的token发送给服务器
        //拉取玩家的对应服务器的角色信息
        var data = {}
        data.type = "POST"
        // data.url  = "http://192.168.3.132:18080/LoginServer/login/Server_accountLogin.do"
        data.url = Globalval.getAccountServer()
        data.sendData = {} 
        data.sendData.platform = platform
        data.sendData.token = cToken
        data.timeout = 10000
        data.handler = function(args){
            Gm.removeLoading()
            if (args){
                if (args.result == 0){
                    Gm.loginData.setAccountCode(args.account_code)
                   let layer = Gm.ui.getLayer("LoginView")
                   layer.getComponent("LoginView").createServerItemByData(args)
                }else{
                    Gm.floating(Gm.config.getErr(args.result))
                }
            }else{
                Gm.floating(Ls.get(10001))
            }
        }
        setTimeout(function() {
            Gm.loading()
            Gm.sendHttp(data);
        }, 1000);

    //     var args = {}
    //     args.result = 0
    //     args.count = 2
    //     args.account_code = ""//?
    //     args.serverInfo = {
    //        0:{
    //             accountId: "1234",
    //             serverid  :"1",
    //             playerId :"3567",
    //             name     : "li1",
    //             level    : "15",
    //             lastTime : "2020-09-18",
    //         },

    //         1:{
    //             accountId : "4567",
    //             serverid  : "2",
    //             playerId : "6877",
    //             name     : "li2",
    //             level    : "25",
    //             lastTime : "2020-09-18",
    //         },
    //     }

    //    var layer = Gm.ui.getLayer("LoginView")
    //    layer.getComponent("LoginView").setServerItemByData(args)
    }
});
