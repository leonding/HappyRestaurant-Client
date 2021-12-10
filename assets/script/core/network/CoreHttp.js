
var CoreHttp = cc.Class({
    properties: {
    },
    ctor:function(){
        this.queue = []
        this.isIng = false
        this.errorIndex = 0
    },
    send:function(args){
        this.queue.push(args)
        if (this.isIng){
            return
        }
        this.nextSend()
    },
    nextSend:function(){
        var data = this.queue[0]
        if (data == undefined){
            // console.log("没有下一个")
            return
        }
        console.log("发送HTTP",data)
        let self = this
        this.isIng = true
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        if(data.responseType){
            xhr.responseType = data.responseType
        }
        xhr.open(data.type, data.url);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }else{
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
            xhr.setRequestHeader('Access-Control-Allow-Origin','*')
        }

        var timer = setTimeout(function() {
            xhr.hasRetried = true;
            xhr.abort();
            self.onSuc(null)
        }, data.timeout || 4500);

        xhr.onreadystatechange = function () {
            clearTimeout(timer);
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respText = xhr.response;
                var ret = null;
                try {
                    console.log(respText);
                    ret = respText;
                } catch (e) {
                    console.log("err:" + e);
                }
                self.onSuc(ret)
            }
            else if (xhr.readyState === 4) {
                if(xhr.hasRetried){
                    return
                }
                console.log("HTTP连接失败")
                self.onSuc(null)
            }
            else {
                // console.log('other readystate:' + xhr.readyState + ', status:' + xhr.status);
            }
        };
        console.log("http",data.url, data.sendData)
        try {
            xhr.send(data.sendData);
        }
        catch (e) {
            console.log("err:" + e);
        }
    },
    onSuc:function(result){
        console.log("HTTP返回",result)
        var data = this.queue[0]
        if (data){
            if (data.handler){
                data.handler(result)
            }
            this.queue.splice(0,1)
        }
        this.isIng = false
        this.nextSend()
    },
    onFail:function(code,err){

    },
    downloadFile(url,callback,isBuff){
        callback = callback || function(){}
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (isBuff){
                    callback(xhr.response)
                }else{
                    callback(JSON.parse(xhr.responseText))
                }
            }else if (xhr.readyState === 4) {
                callback()
            }
        }
        if (isBuff){
            xhr.responseType = "arraybuffer";
        }
        xhr.open("GET", url, true);
        xhr.send();
    },
    sendBi(id){
        // Globalval.biUrl = "http://bi.gold.aamajiang.com/operationlog.lc"
        if (id == null || Globalval.biUrl == null || Gm.userInfo.id== 0 || Gm.userInfo.id== null){
            return
        }
        cc.log("埋点",id)
        var sign = CryptoJS.MD5(Gm.userInfo.id + "" + id+ "@syhd2018@").toString()
        var sendData = {}
        sendData.playerID = Gm.userInfo.id
        sendData.systemId = id
        sendData.secret = sign

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("POST", Globalval.biUrl);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }else{
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        }
        xhr.onreadystatechange = function () {};
        var str = "";
        for (const key in sendData) {
            if (str != ""){
                str = str + "&"
            }
            str = str + key + "=" + sendData[key]
        }
        xhr.send(str);
    },
    sendFormBUG(dd,handler){
        if(!cc.sys.isNative){
            Globalval.playerFeedUrl = "http://down.gold.bianfenghd.com/update/gm/PlayerFeedback.lc"
        }
    
       // Globalval.playerFeedUrl = "http://d3pcokmk72k3af.cloudfront.net/update/gm/PlayerFeedback.lc"
        if (Globalval.playerFeedUrl == null || Gm.userInfo.id== 0 || Gm.userInfo.id== null){
            return
        }
        // cc.log("埋点",id)
        var time = Gm.userData.getTime_m()
        var sign = CryptoJS.MD5(Gm.userInfo.id + "" + time+ "@syhd2018@").toString()
        var sendData = {}
        sendData.pId = Gm.userInfo.id
        sendData.time = time
        sendData.secret = sign

        sendData.data = JSON.stringify(dd)
        var self = this
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 8000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var respText = xhr.responseText;
                var ret = null;
                try {
                    console.log(respText);
                    ret = JSON.parse(respText);
                } catch (e) {
                    console.log("err:" + e);
                }
                if(handler){
                    handler(ret)
                }
            }
            else if (xhr.readyState === 4) {
                if(xhr.hasRetried){
                    return
                }
                console.log("HTTP连接失败")
                if(handler){
                    handler(null)
                }
            }
            else {
                // console.log('other readystate:' + xhr.readyState + ', status:' + xhr.status);
            }
        };

        xhr.open("POST", Globalval.playerFeedUrl,true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }else{
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        }
        var str = "";
        for (const key in sendData) {
            if (str != ""){
                str = str + "&"
            }
            str = str + key + "=" + sendData[key]
        }
        console.log("发送数据====>",str,Globalval.playerFeedUrl)
        xhr.send(str);
    },
    downloadFile2(url, path, completeCallback, processCallback){
        var lastLoaded = 0
        var lastTime = new Date().getTime()
        var downUrl = url
        var filepath = path
        function change(limit){
            var size = "";
            if(limit < 1024){                         //小于0.1KB，则转化成B
                size = limit.toFixed(2) + "B"
            }else if(limit < 1024 * 1024){            //小于0.1MB，则转化成KB
                size = (limit/1024).toFixed(2) + "KB"
            }else if(limit < 1024 * 1024 * 1024){     //小于0.1GB，则转化成MB
                size = (limit/(1024 * 1024)).toFixed(2) + "MB"
            }
            var sizeStr = size + "";                        //转成字符串
            var index = sizeStr.indexOf(".");               //获取小数点处的索引
            var dou = sizeStr.substr(index + 1 ,2)          //获取小数点后两位的值
            if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
                return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
            }
            return size;
        }        
        var downloader = new jsb.Downloader()
        downloader.createDownloadFileTask(downUrl, filepath, "down")
        downloader.setOnTaskError(function(sender, errorCode, errorCodeInternal, errorStr){
            console.log("errorCode = ", errorCode)
        });
        downloader.setOnTaskProgress(function(sender, bytesReceived, totalBytesReceived, totalBytesExpected){
            // console.log("已下载完成的大小 = ", bytesReceived)
            // console.log("总大小 = ", totalBytesReceived)
            // console.log("预期的总大小", totalBytesExpected)
            var nowtime = new Date().getTime()
            var percent = totalBytesReceived/totalBytesExpected
            var speedbyte = (totalBytesReceived-lastLoaded) * (1000 / (nowtime - lastTime))
            var lefttime = totalBytesExpected/speedbyte
            console.log(nowtime - lastTime+" "+change(speedbyte) +" " +(totalBytesReceived-lastLoaded) + " " + totalBytesReceived + " " + Func.timeToTSFM(parseInt(lefttime)))
            lastLoaded = totalBytesReceived
            lastTime = nowtime
            if(processCallback){
                processCallback(percent,change(speedbyte),lefttime)
            }
        });
        downloader.setOnFileTaskSuccess(function(sender){
            // console.log("down success!!!!!!")
            if(completeCallback){
                completeCallback(sender)
            }            
        });
    }
});

