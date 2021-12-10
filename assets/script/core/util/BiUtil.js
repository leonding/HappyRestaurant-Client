//模块
var types = {
    ui:113000, //界面
    pass:113010,//闯关
    battle:113020,//牌局
}
var uiId = { //界面对应埋点
    HallView:1,
    RuleView:2,
    RedRecordView:3,
    GzView2:5,
    TaskView:6,
    ExchangeView:8,
    InviteView:9,
    GzView:13,
    PassRedView:17,    
    HallListView:20,
    WealthView:21,
}
cc.Class({
    properties: {

    },
    ctor:function(){
        for (const key in types) {
            var v = types[key];
            this[key] = function(_type,arg_type){
                if (key == "ui" && typeof(_type) == "string"){
                    if(uiId[_type]){
                        this.send(types[key],uiId[_type],arg_type)
                    }
                }else{
                    this.send(types[key],_type,arg_type)
                }
            }
        }
    },
    send:function(id,_type,_arg_type){
        console.log("埋点",id,_type,_arg_type)
        if (Globalval.biURL == null){
            // console.log("没有埋点地址")
            return
        }
        var sign = CryptoJS.MD5(Gm.userInfo.id + "" + id+ "syhd2018").toString()
        var sendData = {}
        sendData.playerID = Gm.userInfo.id
        sendData.systemId = id
        sendData.secret = sign
        sendData.type = _type
        if (_arg_type){
            sendData.arg = _arg_type
        }
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("POST", Globalval.biURL);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                // console.log("BI成功")
            }
            else if (xhr.readyState === 4) {
                // console.log("BI失败")
            }
            else {
                // console.log('other readystate:' + xhr.readyState + ', status:' + xhr.status);
            }
        };
        var str = "";
        for (const key in sendData) {
            if (str != ""){
                str = str + "&"
            }
            str = str + key + "=" + sendData[key]
        }
        xhr.send(str);
    }
});
