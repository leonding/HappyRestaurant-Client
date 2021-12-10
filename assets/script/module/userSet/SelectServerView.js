var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        m_pRecommendServer:cc.Prefab,
        m_pAllServer:cc.Prefab,
       
        pageNodes:{
            default:[],
            type:cc.Node,
        },
        bottomListNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:1000062}
        this._super()
        this.selectType = -1
        this.dataType = 1 //设备数据
        this.listBtns = []
        for (let index = this.bottomListNode.children.length-1; index >=0 ; index--) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }

        var recommendNode = cc.instantiate(this.m_pRecommendServer)
        this.recommendInfoUI = recommendNode.getComponent(recommendNode.name)
        this.pageNodes[0].addChild(recommendNode,-1)

        var allNode = cc.instantiate(this.m_pAllServer)
        this.allUI = allNode.getComponent(allNode.name)
        this.pageNodes[1].addChild(allNode,-1)
        this.serverConf = Gm.config.getAllServers()
    },
    onEnable(){
       this._super()
    },
    register:function(){
        
    },
    select:function(type){
        if (this.selectType != type){
            if(this.selectType != -1){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                if (this.pageNodes[key]){
                    this.pageNodes[key].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                v.getChildByName("lab").color = Func.getPageColor(isSelect)
                if(isSelect){
                    var str_title = v.getChildByName("lab").getComponent(cc.Label).string
                    var n = Number(str_title)
                    if(isNaN(n)){
                        this.popupUI.setTitle(str_title)
                    }
                }
            }
            this.updateView()
        }
    },

    enableUpdateView:function(args){
    	if (args){
            if(args.history){
                this.serverHistory = args
                this.dataType = 2
            }else{
                this.dataType = 1
                this.serverHistory = Gm.loginData.getServerHistory()
            }
        }
        this.select(0)
    },

    updateView(){
        this["updateNode" + (this.selectType)]()
    },
    updateNode0(){
        this.recommendInfoUI.node.active = true
        this.allUI.node.active = false
        if(!this.recommendInfoUI.getItems()){
            this.recommendInfoUI.updateList(this.serverHistory,this,this.dataType)//只需要更新一次
        }
    },
    updateNode1(){
        this.recommendInfoUI.node.active = false
        this.allUI.node.active = true
        if(!this.allUI.getItems()){
            this.allUI.updateTabList(this.serverHistory,this.serverConf,this,this.dataType)//只需要更新一次
        }
    },

    onBack(){

        this._super()
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    //子类继承
    getBasePoolItem(){
        var node = null
        if(this.selectType == 0){
            node = this.recommendInfoUI.getBasePoolItem()
        }else{
            node = this.allUI.getBasePoolItem()
        }
        return node
    },

});

