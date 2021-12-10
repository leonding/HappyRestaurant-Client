//静态方法

function random(upper,lower) {
    return Math.floor(Math.random()* (upper-lower+1)+lower)
}

function getHeadWithParent(headStr,headNode){
    var addToNode = function(headImg){
        if (headNode != null && headImg != null){
            if (headNode.getChildByName("head")){
                var tmpNode = headNode.getChildByName("head")
                tmpNode.destroy()
            }
            var node = new cc.Node()
            var sprite = node.addComponent(cc.Sprite)
            sprite.spriteFrame = headImg
            
            var tmpSize1 = headNode.getContentSize()
            var tmpSize2 = node.getContentSize()

            node.setScale(tmpSize1.width/tmpSize2.width)
            node.setPosition(0,0)
            node.zIndex = -1
            headNode.addChild(node,-1,"head")
        }
    }
    // cc.log("headStr===:"+headStr.substring(0,4))
    if (headStr == null){
        headStr = "tx_1"
    }
    Gm.load.loadSpriteFrame("personal/head/"+headStr,addToNode)
    // Gm.ui.getHero(headStr,addToNode)
}
function dateFtt(fmt,date)   
{ //author: meizz   
    if (typeof(date) == "number"){
        date = new Date(date)
    }
    if(!date){
        return ""
    }
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
exports.random = random
exports.getHeadWithParent = getHeadWithParent
exports.dateFtt = dateFtt
exports.randomAbc = function () {
    var list = [0,"q","w","e","r","t","y","u","i","o","p","a","s","d","f","g"
                   ,"h","j","k","l","z","x","c","v","b","n","m"]
    return list[Func.random(1,list.length-1)]
}
exports.addZero = function(destValue){
    if (destValue < 10 ){
        return "0" + destValue
    }else{
        return destValue
    }
}

exports.timeToTSFM = function(destTime,noMiao){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    if (noMiao){
        return exports.addZero(tmpShi)+ ":"+ exports.addZero(tmpFen)
    }else{
        if (tmpTian > 0){
            tmpShi = tmpShi + tmpTian * 24
        //     return tmpTian + "-" + exports.addZero(tmpShi)+ ":"+ exports.addZero(tmpFen)+ ":"+ exports.addZero(tmpMiao)
        }
        return exports.addZero(tmpShi)+ ":"+ exports.addZero(tmpFen)+ ":"+ exports.addZero(tmpMiao)
    }
}

exports.timeToFM = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)

    // if (tmpFen > 0){
    //     return tmpFen + Ls.get(5310)
    // }else{
    //     return Func.addZero(tmpMiao) +Ls.get(5814)
    // }
    return tmpFen + Ls.get(5310) + Func.addZero(tmpMiao) +Ls.get(5814)
}
exports.timeToJSBX = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    if (tmpTian != 0){
        return tmpTian + Ls.get(30014)
    }
    if (tmpShi != 0){
        return tmpShi + Ls.get(30015)
    }
    if (tmpFen != 0){
        return tmpFen + Ls.get(30016)
    }
    if (tmpMiao != 0){
        return tmpMiao + Ls.get(30017)
    }
    return ""
}
exports.translateTime = function(destValue,isFloor){
    if (destValue){
        var tmpTimes =  (destValue - Gm.userData.getTime_m())/1000
        if( isFloor ){
            tmpTimes = Math.floor(tmpTimes)
        }
        if( tmpTimes < 0 ){
            return 0
        }else{
            return tmpTimes
        }
    }
    return 0
}
exports.translateTime1 = function(destValue,isCeil){
    var time = (Gm.userData.getTime_m() - destValue)/1000
    if (isCeil){
        return Math.ceil(time)
    }
    return Math.floor(time)
}
exports.URLencode = function(sStr){
    return sStr.replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F')
}
exports.subName = function(str,n){
    if (str == null){
        return ""
    }
    var r=/[^\x00-\xff]/g;
    if(str.replace(r,"mm").length<=n){return str;}
    var m=Math.floor(n/2);
    for(var i=m;i<str.length;i++){
        if(str.substr(0,i).replace(r,"mm").length>=n){
            return str.substr(0,i)+"..";
        }
    }
    return str;
}
exports.transNumStr = function(destNum,isSpecial=false){//战力特殊处理
    var tmpNum = parseInt(destNum)
    if (!isSpecial){
        if (destNum == Gm.userInfo.getGolden()){//钻石处理成和战力一样
            isSpecial = true
        }
    }

    if (!isSpecial){
        if (tmpNum < 10000){
            return tmpNum+""
        }else if(tmpNum < 1000000 && tmpNum >= 10000){
            return Math.floor(tmpNum/1000)+"K"
        }else if(tmpNum < 100000000000 && tmpNum >= 1000000){
            return Math.floor(tmpNum/1000000)+"M"
        }else{
            return Math.floor(tmpNum/100000000000)+"B"
        }
    }
    
    if (tmpNum < 1000000){
        return tmpNum+""
    }else if(tmpNum < 100000000 && tmpNum >= 1000000){
        return Math.floor(tmpNum/1000)+"K"
    }else if(tmpNum < 10000000000000 && tmpNum >= 100000000){
        return Math.floor(tmpNum/100000000)+"M"
    }else{
        return Math.floor(tmpNum/10000000000000)+"B"
    }
    
}
exports.cheackGold = function(){
    if (Gm.wxspData.cheackWealth()){
        Gm.wxspNet.wealthGet(true)
    }else{
        Gm.send(Events.POPUP_VIEW, { viewName: "PassView" });
    }
}
exports.splotStr = function(destStr,destDefColor){
    var tmpReturn = ""
    var tmpContent = destStr.split("#")
    var tmpLens = tmpContent.length
    for(var i = 0;i < tmpLens;i++){
        var strLen = tmpContent[i].length
        // cc.log("strLen===:"+strLen +" "+tmpContent[i])
        var tmpC = Func.getColor(tmpContent[i].substring(1,-1),destDefColor)
        var tmpS = tmpContent[i].substring(1,strLen)
        if (i == 0 && strLen > 0){
            var tmpS = tmpContent[i].substring(0,strLen)
        }
        tmpReturn = tmpReturn + "<color=#"+tmpC+">"+tmpS+"</color>"
    }
    // cc.log(tmpReturn)
    return tmpReturn
}
exports.getColor = function(destChar,destDefColor){
    if (destChar == "a"){
        return "E325CE"
    }else if(destChar == "b"){
        return "FF0033"
    }else if(destChar == "c"){
        return "FF2D00"
    }else if(destChar == "d"){
        return "FF7D00"
    }else if(destChar == "e"){
        return "E3981C"
    }else if(destChar == "f"){
        return "FFE300"
    }else if(destChar == "g"){
        return "8ECD1A"
    }else if(destChar == "h"){
        return "188C58"
    }else if(destChar == "i"){
        return "1850BC"
    }else if(destChar == "j"){
        return "000000"
    }else{
        return destDefColor[0]+destDefColor[1]+destDefColor[2]
    }
}
exports.getDay = function(time){
    var a = new Date(time || Gm.userData.getTime_m())
    a.setHours(0)
    a.setMinutes(0)
    a.setSeconds(0)
    a.setMilliseconds(0)
    return a.getTime()/1000
}
exports.msecToSecond = function(msec){
    return Math.floor(msec/1000)
}
exports.getRes = function(destID,callback){
    if (parseInt(destID) == 2000001){
        return Gm.ui.getFrameByName("menu_icon_3","icon")
    }else if(parseInt(destID) == 6000038){
        return Gm.ui.getFrameByName("menu_icon_2","icon")
    }else if(parseInt(destID) == 3000001){
        return Gm.ui.getFrameByName("menu_icon_1","icon")
    }else if(parseInt(destID) == 2000004){
        return Gm.ui.getFrameByName("icon_duihuanjuan","icon")
    }else{
        var tmpConfig = Gm.config.itemById(destID)
        if (tmpConfig){
            return Gm.ui.getFrameByName(tmpConfig.icon,"icon")
        }else{
            return null
        }
    }
}
exports.getScale = function(destID,baseScale){
    if (parseInt(destID) == 2000001){
        return baseScale
    }else if(parseInt(destID) == 6000038){
        return 0.8*baseScale
    }else if(parseInt(destID) == 3000001){
        return 0.6*baseScale
    }else if(parseInt(destID) == 2000004){
        return 0.8*baseScale
    }else{
        return 0.4*baseScale
    }
}
exports.getName = function(destID){
    if (parseInt(destID) == 2000001){
        return "金币"
    }else if(parseInt(destID) == 6000038){
        return "复活卡"
    }else if(parseInt(destID) == 3000001){
        return "红包"
    }else if(parseInt(destID) == 2000004){
        return "奖券"
    }else{
        var tmpConfig = Gm.config.itemById(destID)
        // cc.log("destID===:"+destID)
        return tmpConfig.name
    }
}
exports.getNums = function(destID,destNum){
    if(parseInt(destID) == 3000001){
        return destNum/100+"元"
    }else{
        return destNum
    }
}
exports.copyArr = function(arr) {
    let res = []
    for(var i in arr){
        res[i] = arr[i]
    }
    return res
}

exports.deepCopyArr = function(arr){
    let res = []
    for(var i in arr){
        if(typeof arr[i] == "number" || typeof arr[i] == "string"){
            res[i] = arr[i]
        }
        else{
            res[i] =  this.copyObj(arr[i])
        }
    }
    return res
}

exports.copyData = function(arr) {
    let res = {}
    for(var i in arr){
        res[i] = arr[i]
    }
    return res
}

exports.copyObj = function(obj) {
    if(obj == null){
        return;
    }
    var newObj = obj.constructor === Array ? [] :{};
    if(typeof obj !== 'object'){
        return;
    }
    for(var i in obj){
        newObj[i] = typeof obj[i] === 'object' ? Func.copyObj(obj[i]) : obj[i];
    }
    return newObj
}

exports.currencyCompare = function(cost){
    var tmpCk = {
        2000001:"gold",
        6000038:"wxspFuHuoCard",
        3000001:"wxspMoney",
    }
    for(var i in cost){
        var v = cost[i]
        // cc.log(v.num+" "+Gm.userInfo[tmpCk[v.id]])
        if (v.num > Gm.userInfo[tmpCk[v.id]]){
            return {result:1,tips:exports.getName(v.id),num:Gm.userInfo[tmpCk[v.id]]-v.num}
        }
    }
    return {result:0}
}
exports.newBaseInfo = function(info){
    var data = {}
    data.playerID = info.playerID
    data.nickname = info.nickname
    data.level = info.level
    data.head = info.head
    data.headFrame = info.headFrame
    data.vipLv = info.vipLv
    return data
}
exports.numsCn = ["零","一","二","三","四","五","六","七","八","九","十"]
exports.numberToCn = function(value){
    return exports.numsCn[value] || ""
}
exports.isChestBox = function(destValue){
    return parseInt(destValue) == 3 && ConfigDefine.serverVersion != 0
}

exports.getNodeRect = function(node) {
    let btnSize = cc.size(node.width+10,node.height+10);
    let frameSize = cc.view.getFrameSize();
    let winSize = cc.director.getWinSize();
    let left = (winSize.width*0.5+node.x-btnSize.width*0.5)/winSize.width*frameSize.width;
    let top = (winSize.height*0.5-node.y-btnSize.height*0.5)/winSize.height*frameSize.height;
    let width = btnSize.width/winSize.width*frameSize.width;
    let height = btnSize.height/winSize.height*frameSize.height;
    return {left:left,top:top,width:width,height:height}
}

exports.getChannel = function(){
    if (cc.sys.os == "iOS"){
        return 1
    }else if (cc.sys.os == "Android"){
        return 2
    }else{
        return 0
    }
}

exports.isMobile = function(){
    if (cc.sys.os == "iOS" || cc.sys.os == "Android"){
        return true
    }
    return false
}

exports.forBy = function(list,key,value){
    if (list && list.length > 0){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v[key] == value){
                return v
            }
        }
    }
    return null
}

exports.indexOf = function(list,value){
    if (list && list.length > 0){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v == value){
                return index
            }
        }
    }
    return -1
},
exports.forBy2 = function(list,key,value,key1,value1){
    if (list && list.length > 0){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v[key] == value && v[key1] == value1){
                return v
            }
        }
    }
    return null
}

exports.forRemove = function(list,key,value,isAll){
    if (list && list.length > 0){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v[key] == value){
                list.splice(index,1)
                if (isAll){
                    Func.forRemove(list,key,value,isAll)
                }
                break
            }
        }
    }
}

exports.getEquipBaseStr = function(equip){
    var str = ""
    var values = []
    var id = []
    for (let index = 0; index < equip.attrInfos.length; index++) {
        const v = equip.attrInfos[index];
        if (v.attrGrade == 1){
            id.push(v.attrData.attrId)
            values.push(v.attrData.attrValue)
        }
    }
    var rId = Func.getAtk(equip)
    if (id.length==1 || (id.length > 1 && id[0] == id[1])  ){
        str = Func.baseStr(rId,values[0])
    }else{
        str = Func.baseStr(rId,values[0])+ "-" +values[1]
    }
    return str
}
exports.getAtk = function(equip){
    var id = []
    for (let index = 0; index < equip.attrInfos.length; index++) {
        const v = equip.attrInfos[index];
        if (v.attrGrade == 1){
            id.push(v.attrData.attrId)
        }
    }
    return Func.idToAtk(id[0],id[1])
}
exports.idToAtk = function(id,id1){
    if (id == 102 && id1== 103){
        return 1000
    }
    return id
}

exports.isAtkEffect = function(type){
    if (type == ConstPb.effectType.EFFECT_DAMAGE ||
        type == ConstPb.effectType.EFFECT_CRITS ||
        type == ConstPb.effectType.EFFECT_MISS || 
        type == ConstPb.effectType.EFFECT_PARRY || 
        type == ConstPb.effectType.EFFECT_SHIELD || 
        type == ConstPb.effectType.BE_HELP_DEFENSE){
        return true
    }
}

exports.baseStr = function(id,value,noMao){
    var conf = Gm.config.getBaseAttr(id)
    var str = conf.childTypeName + "："
    if (noMao){
        str = conf.childTypeName
    }
    value = checkint(value)
    if(conf.percentage == 1){
        str = str + (value/100) + "%"
    }else{
        str = str + value
    }
    return str
    
}

exports.isHasGem = function(equip,flag=0){
    for (let index = 0; index < equip.gemInfos.length; index++) {
        const v = equip.gemInfos[index];
        if (v.gemItemId > flag ){
            return true
        }
    }
    return false
}

exports.dataMerge = function(data,data1){
    for (const key in data1) {
        if (typeof(data1[key]) != "function"){
            data[key] = data1[key];
        }
    }
    return data
}

exports.dealCode = function(destStr){
    var tmpAry = destStr.split("|")
    return cc.js.formatStr(Gm.config.getMailConfig(tmpAry[0]).description
    ,tmpAry[1] || ""
    ,tmpAry[2] || ""
    ,tmpAry[3] || ""
    ,tmpAry[4] || ""
    ,tmpAry[5] || ""
    ,tmpAry[6] || "")
}

exports.rewardString = function(destArray){
    var tmpStr = ""
    for(const i in destArray){
        var con = null
        if (destArray[i].type == ConstPb.itemType.EQUIP){
            con = Gm.config.getEquip(destArray[i].id)
        }else if(destArray[i].type == ConstPb.itemType.TOOL){
            con = Gm.config.getItem(destArray[i].id)
        }else if(destArray[i].type == ConstPb.itemType.PLAYER_ATTR){
            var tmpName0 = Gm.config.getPlayerAttr(destArray[i].id)
            if (tmpName0){
                con = {name:tmpName0.childTypeName}
            }else{
                con = {name:"属性"+destArray[i].id}
            }
        }
        if (con){
            tmpStr = tmpStr+con.name +"x"+ destArray[i].num
        }else{
            tmpStr = tmpStr + destArray[i].id
        }
        if (i != destArray.length - 1){
            tmpStr = tmpStr + ","
        }
    }
    return tmpStr
}

exports.timeToLottery = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    if (tmpTian){
        return tmpTian+"天"+exports.addZero(tmpShi)+ ":"+ exports.addZero(tmpFen) + ":" + exports.addZero(tmpMiao)
    }else{
        if (tmpShi){
            return exports.addZero(tmpShi)+ ":"+ exports.addZero(tmpFen) + ":" + exports.addZero(tmpMiao)
        }else{
            return exports.addZero(tmpFen) + ":" + exports.addZero(tmpMiao)
        }
    }
}

exports.dealConfigTime = function(destTime,isMonth){
    var tmpPush = []
    var i = 0
    var tmpLens = destTime.length
    while(i < tmpLens){
        var tmpLeft = destTime.indexOf("[",i) + 1
        var tmpRight = destTime.indexOf("]",i)
        var tmpSub = destTime.substr(tmpLeft,tmpRight-tmpLeft)
        var tmpHas = tmpSub.indexOf(":",0)
        if (tmpHas != -1){
            var tmpSplit = tmpSub.split(":")
            for(const j in tmpSplit){
                tmpPush.push(tmpSplit[j])
            }
        }else{
            tmpPush.push(tmpSub)
        }
        i = tmpRight + 1
    }
    var b = new Date(Gm.userData.getTime_m())
    if (checkint(tmpPush[0])){
        b.setYear(parseInt(tmpPush[0]))
    }
    if (checkint(tmpPush[1])){
        b.setMonth(parseInt(tmpPush[1])-1,1)
    }
    if (destTime.indexOf("w") > -1 && isMonth){
        var month = b.getDay()
        if (month == 0){
            month = 7
        }
        var nowMonth = checkint(tmpPush[2])
        if (month != nowMonth){//周
            if (b.getDay() == 0){
                b.setDate(b.getDate() + (nowMonth))
            }else{
                b.setDate(b.getDate() + (nowMonth - month))    
            }
        }
    }else{
        if (checkint(tmpPush[2])){
            b.setDate(parseInt(tmpPush[2]))
        }
    }
    
    b.setHours(parseInt(tmpPush[3]))
    b.setMinutes(parseInt(tmpPush[4]))
    b.setSeconds(parseInt(tmpPush[5]))
    // cc.log(tmpPush,Func.dateFtt("yyyy-MM-dd hh:mm:ss",b.getTime()),b.getFullYear(),b.getMonth()+1)
    return b.getTime()
}
exports.dealNumFunc = function(first,nums,typeName){
    var tmpBuyConfig = Gm.config.getConfig("BuyCostConfig")
    var tmpNums = 0
    var tmpFirst = first || 0
    var tmpMax = nums || 0
    for(var i = tmpFirst + 1;i <= tmpFirst + tmpMax;i++){
        if (i < tmpBuyConfig.length){
            for(const j in tmpBuyConfig){
                if (tmpBuyConfig[j].id == i){
                    tmpNums = tmpNums + tmpBuyConfig[j][typeName]
                    break
                }
            }
        }else{
            tmpNums = tmpNums + tmpBuyConfig[tmpBuyConfig.length - 1][typeName]
        }
    }
    return tmpNums
}

exports.newHead = function(headId,headParent,quality,lv){
    if(headParent == null){
        return
    }
    if (headParent.itembase == null){
        var itemBase = Gm.ui.getNewItem(headParent)
        itemBase.node.scale = headParent.width/itemBase.node.width
        itemBase.node.zIndex = -1
        itemBase.setTips(false)
        headParent.itemBase = itemBase
    }
    headParent.itemBase.updateHero({baseId:headId,qualityId:quality,level:lv})
    headParent.itemBase.getBaseClass().teamSpr.node.active = false
}

exports.newHead2 = function(headId,headParent,lv){
    if(headParent == null){
        return
    }
    if (headParent.itembase == null){
        var itemBase = Gm.ui.getProfilePictureItem(headParent)
        itemBase.node.scale = headParent.width/itemBase.node.width
        itemBase.node.zIndex = -1
        headParent.itemBase = itemBase
    }
    headParent.itemBase.setData({baseId:headId})
}

exports.monsterHead = function(monsterId,headParent){
    if(headParent == null){
        return
    }
    if(headParent.getChildByName("headBg") == null){
        var bgNode = new cc.Node()
        bgNode.addComponent(cc.Sprite)
        headParent.addChild(bgNode,-2,"headBg")

        var headNode = new cc.Node()
        headNode.addComponent(cc.Sprite)
        headParent.addChild(headNode,-1,"head")
    }
    
    if (monsterId == null || monsterId == 0){
        monsterId = 210001
    }

    var conf = Gm.config.getMonster(monsterId)
    if (headParent.bottom_frame != "share_img_k1"){
        headParent.bottom_frame = "share_img_k1"
        Gm.ui.getItemFrame(headParent.bottom_frame,(spr)=>{
            var bgNode = headParent.getChildByName("headBg")
            var sp = bgNode.getComponent(cc.Sprite)
            sp.spriteFrame = spr
            bgNode.width = headParent.getContentSize().width
            bgNode.height = headParent.getContentSize().height
        })
    }
    if (headParent.picture != conf.picture){
        headParent.picture = conf.picture
        Gm.load.loadSpriteFrame("personal/head/"+conf.picture,(spr)=>{
            var headNode = headParent.getChildByName("head")
            var sp = headNode.getComponent(cc.Sprite)
            sp.spriteFrame = spr
            headNode.width = headParent.getContentSize().width-10
            headNode.height = headParent.getContentSize().height-10
        })
    }
}

exports.itemName = function(str,subNum){
    subNum = subNum || 6
    var ss = str
    if (str.length > subNum){
        ss = str.slice(0,subNum) + "."
    }
    return ss
}

exports.colorByquality = function(q){
    var color
    switch (q) {
        case 1:
            color = cc.color(250,234,211)
            break;
        case 2:
            color = cc.color(111,184,14)
            break;
        case 3:
            color = cc.color(197,73,208)
            break;
        case 4:
            color = cc.color(255,213,0)
            break;
        case 5:
            color = cc.color(255,213,0)
            break;
        case 6:
            color = cc.color(255,213,0)
            break;
        default:
            color = cc.color(255,213,0)
            break;
    }
    return color
}

exports.itemSplit = function(str){
    var list = []
    var strs = str.split("|")
    for (let index = 0; index < strs.length; index++) {
        const v = strs[index];
        var dd = v.split("_")
        list.push({type:checkint(dd[0]),id:checkint(dd[1]),num:checkint(dd[2])})
    }

    return list
}
exports.timeToBossTime = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    var tmpMiao= Math.floor(destTime%_fen)
    return {h:exports.addZero(tmpShi),m:exports.addZero(tmpFen)}
}
exports.timeToHmsAgo = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    if (tmpTian > 0){
        return tmpTian + "d"
    }
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    if(tmpShi > 0 ){
        return tmpShi + "h"
    }
    var tmpFen = Math.floor((destTime%_shi)/_fen)
    if (tmpFen > 0){
        return tmpFen + "m"
    }
    return 1 +"m"
}

exports.doubleLab = function(curr,need,defaultColor,leftColor,rightColor){
    defaultColor = defaultColor || "524036"
    leftColor = leftColor || "499800"
    rightColor = rightColor || "F74000"
    var color = "<color=#%s>%s</c><color=#" + defaultColor +  ">/%s</color>"
    var str = cc.js.formatStr(color, curr>=need?leftColor:rightColor,Func.transNumStr(curr),Func.transNumStr(need))
    return str
}

exports.isUnlock = function(viewName,isPrint){
    var config
    if (typeof(viewName) == "string"){
        config = Gm.config.getViewByName(viewName)
    }else{
        config = Gm.config.getViewById(viewName)
    }
    if (config && config.openMapId && Gm.userInfo.maxMapId < config.openMapId){
        if (isPrint){
            Gm.floating(config.tips)
        }
        return false
    }
    if(config && config.level && Gm.userInfo.level < config.level){//用户等级
       if (isPrint){
            Gm.floating(config.tips)
        }
        return false
    }
    return true
}

exports.getEquipBaseAttr = function(conf){
    var str = ""
    for (let index = 0; index < conf.mainAttr.length; index++) {
        const v = conf.mainAttr[index];
        if (str != ""){
            str = str + " "
        }
        var baseAttrConf = Gm.config.getBaseAttr(v.AttriID)
        str = str + baseAttrConf.childTypeName + ":"
        if (baseAttrConf.percentage == 1){
            str = str + (v.value/100) + "%"
        }else{
            str = str + v.value
        }
    }
    return str
}

exports.getEquipPrimarys = function(equip){ //装备主属性
    var list = []
    for (let index = 0; index < equip.attrInfos.length; index++) {
        const v = equip.attrInfos[index];
        if (v.attrGrade == ConstPb.equipAttrGrade.PRIMARY_ATTR){
            list.push(v)
        }
    }
    return list
}

exports.itemConfig = function(data){
    var con = null
    var tmpType = data.itemType || data.type || 0
    var tmpId = data.id || data.attrId || data.baseId || 0
    var num = 0
    switch(tmpType){
        case ConstPb.itemType.PLAYER_ATTR:
            con = Gm.config.getItem(tmpId)
            num = Gm.userInfo.getCurrencyNum(tmpId)
            break
        case ConstPb.itemType.ROLE:
        case ConstPb.itemType.HERO_CARD:
            if (tmpId < 10000){
                con = Gm.config.getHero(tmpId)
            }else{
                con = Gm.config.getHero(0,tmpId)
            }
            break
        case ConstPb.itemType.TOOL:
            con = Gm.config.getItem(tmpId)
            num = Gm.bagData.getNum(tmpId)
            break
        case ConstPb.itemType.EQUIP:
            con = Gm.config.getEquip(tmpId)
            var item = Gm.bagData.getEquitByBaseId(tmpId)
            if (item){
                num = 1
            }
            break
        case ConstPb.itemType.HERO_CHIP:
            con = Gm.config.getItem(tmpId)
            num = Gm.heroData.getChipNum(tmpId)
            break
        case ConstPb.itemType.ALLIANCE_ATTR:
        case ConstPb.itemType.SKILL:
    }
    return {con:con || {},num:num}
}

exports.getTimeName = function(destType){
    switch(destType){
        case 0://天
            return Ls.get(5308)
        case 1://时
            return Ls.get(5309)
        case 2://分
            return Ls.get(5310)
        case 3://秒
            return Ls.get(5814)
    }
}

exports.timeEachDay = function(destTime){
    var _fen = 60
    var _shi = 3600
    var _tian = 86400
    var tmpTian = Math.floor(destTime/_tian)
    var tmpShi = Math.floor((destTime%_tian)/_shi)
    if (tmpTian > 0){
        return tmpTian + this.getTimeName(0) + tmpShi + this.getTimeName(1)
    }else{
        var tmpFen = Math.floor((destTime%_shi)/_fen)
        if (tmpShi > 1){
            return tmpShi + this.getTimeName(1) + tmpFen + this.getTimeName(2)
        }else{
            var tmpMiao = Math.floor(destTime%_fen)
            return tmpFen + this.getTimeName(2) + tmpMiao + this.getTimeName(3)
        }
    }
}

exports.getPageColor = function(isSelect){
    return isSelect?cc.color(255,255,255):cc.color(255,255,255)
}

exports.transMap = function(mapId){
    return Gm.config.getMapById(mapId || Gm.userInfo.getMaxMapId()).mapName
}
exports.isRetain = function(item){
    return item instanceof cc.SpriteFrame || item instanceof cc.SpriteAtlas ||
           item instanceof cc.BitmapFont || item instanceof cc.ParticleAsset
}
exports.skinById = function(heroHomeId){
    var heroData = Gm.heroData.getHeroByQualityId(heroHomeId)
    if (!heroData){
        heroData = Gm.heroData.getHeroByBaseId(heroHomeId)
    }
    var skinId
    if (heroData){
        skinId = heroData.skin
    }else{
        var conf
        if(heroHomeId > 1000){
            conf = Gm.config.getHero(0,heroHomeId)
        }else{
            conf = Gm.config.getHero(heroHomeId,0)
        }
        skinId = conf.skin_id
    }
    return Gm.config.getSkin(skinId)
}
//////battle////
exports.getYoke = function(tmpCamp){
    var tmpYoke = Gm.config.getConfig("BattleAuraConfig")
    var tmpList = {}
    var tmpHua = [3,3,3,7,7,7,4,4,4,5,5,5,6,6,6]
    for(const i in tmpYoke){
        if (!tmpList[tmpYoke[i].pattyMembers]){
            tmpList[tmpYoke[i].pattyMembers] = {idx:i,camp:false}
        }

        var tmp1Aty = {}
        var tmp2Aty = {}
        var tmpBute = tmpYoke[i].camps.split("|")
        var tmpLens = tmpBute.length
        // if (tmpBute.length == tmpCamp.length){
            for(const k in tmpBute){
                if (!tmp2Aty[tmpBute[k]]){
                    tmp2Aty[tmpBute[k]] = 0
                }
                tmp2Aty[tmpBute[k]] = tmp2Aty[tmpBute[k]] + 1
            }
            for(const j in tmpCamp){
                if (!tmp1Aty[tmpCamp[j]]){
                    tmp1Aty[tmpCamp[j]] = 0
                }
                tmp1Aty[tmpCamp[j]] = tmp1Aty[tmpCamp[j]] + 1
                for(const k in tmpBute){
                    if (tmpCamp[j] == tmpBute[k]){
                        tmpBute.splice(k,1)
                        break
                    }
                }
            }
        // }
        // console.log("tmpYoke===:",tmpBute)
        if (tmpBute.length == 0){
            tmpList[tmpYoke[i].pattyMembers] = {idx:i,camp:true,hua:tmpHua[i]}
        }
    }
    return tmpList
}

exports.isHurt = function(effect){
    if (effect.type == ConstPb.effectType.EFFECT_DAMAGE || 
        effect.type == ConstPb.effectType.EFFECT_CRITS ||
        effect.type == ConstPb.effectType.EFFECT_MISS ||
        effect.type == ConstPb.effectType.EFFECT_PARRY ||
        effect.type == ConstPb.effectType.BE_HELP_DEFENSE||
        effect.type == ConstPb.effectType.EFFECT_SHIELD){
        return true
    }
    return false
}

exports.gethasNum = function(data){
    var hasNum = 0
    if (data.type == ConstPb.itemType.PLAYER_ATTR){
        hasNum = Gm.userInfo.getDataBy(data.id)
    }else if (data.type == ConstPb.itemType.TOOL){
        hasNum = 0
        var pro = Gm.bagData.getItemByBaseId(data.id)
        if (pro != null){
            hasNum = pro.count
        }
    }
    return hasNum
}

exports.configHeroLv = function(data,conf){
    if (data.heroId && Gm.heroData.isInPool(data.heroId)){
        var tmpMax = Gm.config.getHero(conf.id,conf.qualityProcess[conf.qualityProcess.length-1])
        var min = Gm.heroData.m_iPoolLevel
        if (tmpMax.quality < Gm.config.getConst("crystal_max_quality")){
            Math.min(Gm.heroData.m_iPoolLevel,tmpMax.max_level)
        }else{
            if (Gm.heroData.m_iPoolLevel == Gm.heroData.crystalLevel){
                return Gm.heroData.crystalLevel
            }else{
                return Gm.heroData.m_iPoolLevel
            }
        }
    }else{
        return data.level
    }
}

exports.newConfigTime = function(destTime){
    var tmpPush = []
    var i = 0
    var tmpLens = destTime.length
    while(i < tmpLens){
        var tmpLeft = destTime.indexOf("[",i) + 1
        var tmpRight = destTime.indexOf("]",i)
        var tmpSub = destTime.substr(tmpLeft,tmpRight-tmpLeft)
        var tmpHas = tmpSub.indexOf(":",0)
        if (tmpHas != -1){
            var tmpSplit = tmpSub.split(":")
            for(const j in tmpSplit){
                tmpPush.push(tmpSplit[j])
            }
        }else{
            tmpPush.push(tmpSub)
        }
        i = tmpRight + 1
    }
    var b = new Date(Gm.userData.getTime_m())
    if (tmpPush[0] != "*"){
        b.setFullYear(parseInt(tmpPush[0]))
    }
    if (tmpPush[1] != "*"){
        b.setMonth(parseInt(tmpPush[1])-1,1)
    }
    if (tmpPush[2] != "*"){
        b.setDate(checkint(tmpPush[2]))
    }
    b.setHours(parseInt(tmpPush[3]))
    b.setMinutes(parseInt(tmpPush[4]))
    b.setSeconds(parseInt(tmpPush[5]))
    return b.getTime()
}

/*根据出生日期算出年龄*/
exports.getAge=function(birthday){       
    var returnAge;

    var birthYear = birthday.year
    var birthMonth = birthday.month + 1
    var birthDay =  birthday.day
    
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    
    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    
    return returnAge;//返回周岁年龄
    
}


//给定两个时间戳算出相差天数和小时
exports.intervalTime=function(startTime,endTime){  
    var dayMillisecond = 86400000 //一天的毫秒数
    var hourMillisecond = 3600000 //1小时的毫秒数
    var minuteMillisecond = 60000 //1分钟毫秒数
    var diffDay =Math.abs( startTime - endTime) 
    var day  = Math.floor(diffDay / dayMillisecond) 
    var hour = Math.floor(diffDay % dayMillisecond / hourMillisecond) 
    var m    = Math.floor(diffDay % dayMillisecond % hourMillisecond / minuteMillisecond) 
    return day + '-' + hour + '-' + m
}

exports.destroyChildren = function(node){
    for (var i = 0; i < node.children.length; i++) {
        node.children[i].destroy()
    }
    node.removeAllChildren()
}

//当前登录的时间是不是新的一天
exports.isEnterNewDay = function(){
   var loginTime = Gm.userInfo.loginTime
   var currDate = new Date(loginTime)
   var key = "loginTimeDate_"+Gm.loginData.getServerNowId()
   var localTime = cc.sys.localStorage.getItem(key) || 0
   if(localTime != 0){
        localTime = new Date(parseInt(localTime) )
   }
   if(  localTime             == 0                       || 
        currDate.getFullYear() > localTime.getFullYear() || 
        currDate.getMonth()    > localTime.getMonth()    ||
        currDate.getDate()     > localTime.getDate())
    {
        cc.sys.localStorage.setItem(key,currDate.getTime())
        Gm.send(Events.LOGIN_NEW_DAY,{isEnterNewDay:true})
    }else{
        Gm.send(Events.LOGIN_NEW_DAY,{isEnterNewDay:false})

    }

}

exports.longPressUpdateClick = function(node,call,endCall){
    var intervalTime = 0.3
    var onClick = ()=>{
        var ac = cc.sequence(new Array(cc.delayTime(0.05),cc.callFunc( ()=>{
            if (node.isClick){
                node.nowTime = node.nowTime + 0.05
                if (node.nowTime > node.delayTime){
                    node.nowTime = 0
                    node.longNum = node.longNum + 1
                    node.delayTime = Math.max(0.05,intervalTime-((node.longNum/5)/15))
                    var isStop = node.call(node.longNum)
                    if (isStop){
                        node.isClick = false
                    }
                }
            }
        })))
        var acRf = cc.repeatForever(ac)
        node.runAction(acRf)
        node.longPressAction = acRf
        node.longNum = 0
        node.delayTime = intervalTime
        node.nowTime = intervalTime
        node.call = call
        node.endCall = endCall || function(){}
    }

    var onStopAction = ()=>{
        node.endCall(node.longNum,true)
        exports.longPressStop(node)
    }

    node.isClick = false
    if (node.onTouchStart == null){
        node.onTouchStart = (event)=>{
            node.isClick = true
            onClick()
        }
        node.onTouchEnd = (event)=>{
            onStopAction()
        }
    }else{
        node.off(cc.Node.EventType.TOUCH_START,node.onTouchStart)
        node.off(cc.Node.EventType.TOUCH_END,node.onTouchEnd)
        node.off(cc.Node.EventType.TOUCH_CANCEL,node.onTouchEnd)
    }

    node.on(cc.Node.EventType.TOUCH_START,node.onTouchStart)
    node.on(cc.Node.EventType.TOUCH_END,node.onTouchEnd)
    node.on(cc.Node.EventType.TOUCH_CANCEL,node.onTouchEnd)
}
exports.longPressStop = function(node){
    node.isClick = false
    if (node.longPressAction){
        node.stopAction(node.longPressAction)
        node.longPressAction = null
    }
}

exports.checkBag = function(items,func){
    var equipCount = 0
    var teamCount = 0
    for(let key in items){
        if(items[key].type == ConstPb.itemType.HERO_CARD){
            teamCount++
        }else if( items[key].type == ConstPb.itemType.EQUIP){
            equipCount++
        }
    }
    var isTeamMax = Gm.checkBagAddTeam(teamCount,func)
    var isItemMax = false
    if(!isTeamMax){
        return isTeamMax
    }else{
        isItemMax = Gm.checkBagAddItem(equipCount,true)
    }
  return  isItemMax
}