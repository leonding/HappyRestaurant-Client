cc.Class({
    properties: {
       list:null
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.list = []
    },
    addItem:function(item){
        if (this.getIndex(item.marqueeId) == -1 ){
            item.rollTimes = item.rollTimes || 1
            item.interval  = item.interval || 1
            if (item.contentAlias){
                this.formatString(item)
            }
            this.list.push(item)
        }
    },
    formatString:function(marquee){
        var getString = function(str){
            return str || ""
        }
        var srcList = marquee.contentAlias.split("|")
        var conf = Gm.config.getMarquee(checkint(srcList[0]))
        marquee.rollTimes = conf.cycle
        marquee.interval = conf.timeInterval
        marquee.content = cc.js.formatStr(conf.content,
                                        getString(srcList[1])
                                        ,getString(srcList[2])
                                        ,getString(srcList[3])
                                        ,getString(srcList[4])
                                        ,getString(srcList[6])
                                        ,getString(srcList[7])
                                    )
        
    },
    getFirstItem:function(){
        if (this.list.length > 0){
            return this.list[0]
        }
    },
    removePlayed:function(){
        if (this.list.length > 0){
            this.list.splice(0,1)
        }
    },
    delById:function(id){
        var index = this.getIndex(id)
        if (index > -1){
            this.list.splice(index,1)
            if (index == 0 ){
                return true
            }
        }
        return false
    },
    getIndex:function(maequeId){
        for (let index = 0; index < this.list.length; index++) {
            var v = this.list[index];
            if (v.marqueeId == maequeId){
                return index
            }
        }
        return -1
    },
});
