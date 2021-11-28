// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var http = require("http")
var pb = require("pbkiller")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ctor() {
        this.login;
    },

    start () {
        pb.preload(()=>{
            pbList = pb.loadAll()
            console.log(pbList.msg)
            login = new pbList.msg.UserLoginCmd()
            login.userName = 'leon1'
            login.password = '234324234'
            
            // let data = login.toBuffer()
            // console.log(data)
            // let newplayer = pbList.Player.decode(data)
            // console.log(newplayer) 
        })
    },


    onStartClick(){
        cc.log("----------------");

        let data = login.toBuffer()
        // console.log(pbList.GameMsgProtocol.decode(data))
        var body = new Uint8Array(data)

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:12345");
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(){
            if(xhr.status >= 200 && xhr.status < 400){
                console.log("请求成功", xhr.response)
                if(xhr.readyState == 4){
                    let data = new Uint8Array(xhr.response)
                    let msg = pbList.msg.UserLoginResult.decode(data)
               
                    console.log("-----====",  msg)
                }
                
            }else{
                console.log("请求失败")
            }
        }
        xhr.timeout = 10000;
        // xhr.setRequestHeader("content-type", "application/x-protobuf");
        xhr.setRequestHeader('Access-Control-Allow-Origin','*');
        xhr.send(body)
        xhr.onerror = function(e){
            console.log(xhr.status)
        }
    }

    // update (dt) {},
});
