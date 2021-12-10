
var http = require("http")
var pb = require("pbkiller")

cc.Class({
    extends: cc.Component,

    properties: {
        appType:0,
        currName:"mx",
        retainList:{
            default:[],
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.i18n.load()
        // cc.log( window.i18n.languages)
        //初始化
        //全部挂在gm上面（由于game已被占用)
        if (window.Gm == undefined){
            var g = require("Gm")
            window.Gm = new g()
            Gm.startGm()
        }
        Gm.appType = this.appType
        Gm.scene.setRetain(this.retainList)
        // Gm.ui.setBasePopupUI(this.basePopupUI)
        // i18n.setGameIng()
        console.log("---------initApp-----------------",this.currName)
        Globalval.init(this.currName)
        Gm.ui.setNewBasePopupUI(function(){
            if (cc.sys.isNative){
                Gm.ui.create("LogoView",true)
            }else{
                Gm.ui.create("UpdateView",1)
            }
        })

        if(cc.sys.isNative){
            console.log("设置设备常亮")
            jsb.device.setKeepScreenOn(true) //设置屏幕常亮
        }
    },


    // onStartClick(){
    //     cc.log("----------------");

    //     let data = login.toBuffer()
    //     // console.log(pbList.GameMsgProtocol.decode(data))
    //     var body = new Uint8Array(data)

    //     var xhr = new XMLHttpRequest();
    //     xhr.open("POST", "http://127.0.0.1:12345");
    //     xhr.responseType = "arraybuffer";
    //     xhr.onreadystatechange = function(){
    //         if(xhr.status >= 200 && xhr.status < 400){
    //             console.log("请求成功", xhr.response)
    //             if(xhr.readyState == 4){
    //                 let data = new Uint8Array(xhr.response)
    //                 let msg = pbList.msg.UserLoginResult.decode(data)
               
    //                 console.log("-----====",  msg)
    //             }
                
    //         }else{
    //             console.log("请求失败")
    //         }
    //     }
    //     xhr.timeout = 10000;
    //     // xhr.setRequestHeader("content-type", "application/x-protobuf");
    //     xhr.setRequestHeader('Access-Control-Allow-Origin','*');
    //     xhr.send(body)
    //     xhr.onerror = function(e){
    //         console.log(xhr.status)
    //     }
    // }

    // update (dt) {},
});
