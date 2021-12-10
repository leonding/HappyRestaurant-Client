var to = {}
to[1001] = "golden"
to[1002] = "silver"


cc.Class({
    properties: {
        id:0,
    },
    ctor:function(){
  
    },
    isLogin(){
        return this.id != 0
    },
    getId:function(){
        return this.id
    },
    getGameCoin(attrId){
        var dd = Func.forBy(this.gameCoin,"attrId",attrId)
        if (dd == null){
            dd = {attrId:attrId,count:0}
            this.gameCoin.push(dd)
        }
        return dd
    },
    getGameCoinNum(attrId){
        return this.getGameCoin(attrId).count
    },
    setGameCoin(attrId,num){
        var gameCoin = this.getGameCoin(attrId)
        gameCoin.count = num
    },
    getCurrencyNum(attrId){
        var num = this.getDataBy(attrId)
        if (num == 0){
            num = this.getGameCoinNum(attrId)//新货币
        }
        return num
    },
    
    getDataBy:function(attrId){
        var key = to[attrId]
        if (key == "golden"){
            return this.getGolden()
        }
        return this[key] || 0
    },
    clearData:function(){
        this.level = 0
        this.mapId = 0
        this.m_iOldLv = 0
        this.m_iDestLv = 0
    },
    setData:function(data){
        this.id = data.playerId
        for (const key in data) {
            if (typeof(data[key]) != "function"){
                if (this.level && this.level != data.level){
                    this.levelUp(data.level)
                }
                if (data[key] != null){
                    this[key] =  data[key]
                }else{
                     this[key] = this[key]
                }
            }
        }
    },
    levelUp:function(destLevel){
        this.m_iOldLv = this.level
        this.m_iDestLv = destLevel
    },
    newModifyData(data,isAdd){
        var result = {}
        result.attr = data.attr

        var dd = this.getGameCoin(data.attr)
        if (data.type == 1){
            result.count = data.count - dd.count
            dd.count = data.count
        }else if (data.type == 2) {
            if (isAdd){
                dd.count = dd.count + data.count
            }else{
                dd.count = dd.count - data.count
            }
            result.count = data.count
        }
        return result
    },
    modifyData:function(data,isAdd){
        var key = to[data.attr]
        var result = {}
        result.attr = data.attr

        if (key == null){
            return this.newModifyData(data,isAdd)
        }
        if (key && this.hasOwnProperty(key)){
            if (data.type == 1){//总值
                if (key == "level"){
                    this.levelUp(data.count)
                }
                var lastNum = this[key]
                this[key] = data.count
                result.count = data.count - lastNum
                result.current = data.count
            }else if (data.type == 2){//变化值
                if (isAdd){
                    this[key] = this[key] + data.count
                }else{
                    this[key] = this[key] - data.count
                }
                result.count = data.count
                result.current = this[key]
            }
            if (key == "vipLevel"){
                Gm.ui.create("VipLevelUP",{oldLv:result.current-result.count,nowLv:result.current})
            }
        }
        return result
    },
    valueChanges:function(data){
        var list = ["golden","coin"]
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (data[v]){
                this[v] = Math.max(this[v] - data[v],0)
            }
        }
    },

    setOnlineTime(dt){
        if (this.id == 0){
            return
        }
        this.totalOnline = this.totalOnline + dt
        this.todayOnline = this.todayOnline + dt
    },


});


