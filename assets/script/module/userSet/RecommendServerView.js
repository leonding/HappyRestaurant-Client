
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView:{
            default:null,
            type:cc.ScrollView
        },
        m_oServerItemPrefab:cc.Prefab
    },
    onDisable(){
        this.data = null
        this.itemDatas = null
        this.owner.removeAllPoolItem(this.scrollView.content)
    },

    updateList:function(data,owner,dataType){
        var self = this
        this.owner = owner
        this.data = data
        this.itemDatas = []
        this.createHistoryData(data,dataType)
        if(dataType == 1 ){
            this.sortList(this.itemDatas)
        }
        this.owner.removeAllPoolItem(this.scrollView.content)

        this.scrollView.stopAutoScroll()

        Gm.ui.simpleScroll(this.scrollView,this.itemDatas,function(itemData,tmpIdx){
            var item = this.owner.getPoolItem()
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("RecommendServerItem")
            itemSp.setData(itemData,dataType)
            return item
        }.bind(this))
        this.scrollView.scrollToTop()
    },

    createHistoryData(data,dataType){
        if(dataType == 1 ){
            this.createDeviceData(data)
        }else{
            this.createAccountHistoryData(data)
        }
    },

    createDeviceData(data){
        var username = Gm.loginData.getDeviceId()
        for(var key in data.history){
            if(data.history[key] && data.history[key][username]){
                this.itemDatas.push(data.history[key][username])
            }
        }
    },

    createAccountHistoryData(itemData){
        for(let i in itemData.history){
            var newConf = Gm.config.serverById(itemData.history[i].serverid)
            itemData.history[i].serverName = newConf.name
            this.itemDatas.push(itemData.history[i])
        }
    },

    getBasePoolItem(){
        var node = cc.instantiate(this.m_oServerItemPrefab)
        node.active = true
        return node
    },
    getItems(){
        return this.itemDatas
    },
    sortList(data){
        var lastserver = null
        for(var j = 0,len = data.length; j < len; j++){
            if(data[j].sId == this.data.lastserverid){
                if(j != 0){
                    lastserver = data.splice(j,1)[0]
                }
                break
            }
        }
        if(lastserver){
            data.unshift(lastserver)
        }
        var newConf = Gm.config.getAllServers().slice(-1)[0]
        var newServer = null
        var found = false
        for(var j = 0, len = data.length; j < len; j++){
            if(data[j].sId == newConf.id){
                if(j != len-1){
                    newServer = {}
                    newServer = data.splice(j,1)[0]
                    newServer.new = true
                }else{
                    data[j].new = true
                }
                found = true
                break
            }
        }
        if(!newServer && !found){
            newServer = {}
            newServer.sId = newConf.id
            newServer.servername = newConf.name
            newServer.url = newConf.value
            newServer.new = true
        }
        if(newServer){
            data.push(newServer)
        }
    }
});
