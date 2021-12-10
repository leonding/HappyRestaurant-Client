var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        scrollView:{
            default:null,
            type:cc.ScrollView
        },
        m_oItemPrefab:cc.Prefab
    },
    onLoad () {
        this._super()

    },
    onDisable(){
        this.data = null
        this.itemDatas = null
        this.removeAllPoolItem(this.scrollView.content)
    },
    enableUpdateView:function(args){
        if (args.data){
            this.updateList(args.data, args.config)
        }
        Gm.audio.stopDub()
    },
    updateList:function(data,conf){
        this.data = data
        var itemHeight = 0
        this.itemDatas = []
        
        this.removeAllPoolItem(this.scrollView.content)
        this.scrollView.stopAutoScroll()
        
        var length = this.data.length
        var newIndex = 0
        for(var i = 0; i < length; i++) {
            var item = this.getPoolItem()
            item.active = true
            itemHeight = item.height
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("StoryListItem")
            itemSp.setData(this.data[i],conf)
            if (this.data[i].new) {
                newIndex = i
            }
        }
        // this.scrollView.scrollToBottom()
        // Gm.ui.scrollOffset(this.scrollView, newIndex)
        this.scrollView.scheduleOnce(()=>{
            var cellHeight = this.scrollView.content.height/Math.ceil(this.scrollView.content.children.length)
            var cell = newIndex
            var nowPos = this.scrollView.getContentPosition()
            nowPos.y = cell*cellHeight - this.scrollView.node.height / 2 + cellHeight / 2
            this.scrollView.scrollToOffset(nowPos,0)
        },0.1)

        // Gm.ui.simpleScroll(this.scrollView,this.data,function(tmpData,tmpIdx){
        //     var item = this.getPoolItem()
        //     item.active = true
        //     itemHeight = item.height
        //     this.scrollView.content.addChild(item)
        //     var itemSp = item.getComponent("StoryListItem")
        //     itemSp.setData(tmpData,conf)
        //     if (tmpData.new) {
        //         newIndex = tmpIdx
        //     }
        //     return item
        // }.bind(this))

    },
    getBasePoolItem(){
        var node = cc.instantiate(this.m_oItemPrefab)
        node.active = true
        return node
    },
    getItems(){
        return this.itemDatas
    },
    onBack(){
        this._super()
    },
});

