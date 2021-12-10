//OreRoomListView
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        topMenus:{
            default:[],
            type:cc.Node,
        },
        OreRoomListItem:cc.Node,
        scrollView:cc.ScrollView,
        contentNode:cc.Node,
        toggleBtn:cc.Toggle
    },
    onLoad(){
        this._super()
        this.selectIndex = 0
        Gm.getLogic("OreLogic").oreBtnClick()
    },
    register:function(){
        this.events[Events.ORE_ROOM_INFO] = this.updateUI.bind(this)
    },
    enableUpdateView:function(args){
        if(args){
            this.toggleBtn.isChecked = Gm.userData.isShowOreFullRoom()
        }
    },
    updateUI:function(){
        this.data =  Gm.oreData.getAllOreRoom()
        this.dealData()
        this.setUI()
    },
    dealData(){
        for(var i=0;i<this.data.length;i++){
            this.data[i].isFull = Gm.oreData.roomisFull(this.data[i])
        }
    },
    setUI(){
        this.createRoomList(this.data)
        this.filterItems(0)
    },
    createRoomList(data){
        this.contentNode.removeAllChildren()
        Gm.ui.simpleScroll(this.scrollView,data,function(tmpData,tmpIdx){
            var item = cc.instantiate(this.OreRoomListItem)
            item.active = true
            this.contentNode.addChild(item)
            var itemJs = item.getComponent("OreRoomListItem")
            itemJs.setUI(tmpData,this.onItemClick.bind(this))
            return item
        }.bind(this))
    },
    onMenuClick(sender,index){
        for(var i=0;i<this.topMenus.length;i++){
            if(i+1 == index){
                this.setMenuItem(this.topMenus[i],true)
            }
            else{
                 this.setMenuItem(this.topMenus[i],false)
            }
        }
        this.filterItems(index-1)
    },
    setMenuItem(item,key){
        item.getChildByName("bgSprite").active = !key
        item.getChildByName("selectSprite").active = key
    },
    onToggleClick(){
        this.filterItems(this.selectIndex)
    },
    filterItems(index){
        var key = this.toggleBtn.isChecked
        this.selectIndex = index
        var data = []
        if(index == 0){//0不过滤
            for(var i=0;i<this.data.length;i++){
                if(!key){
                    if(!this.data[i].isFull){
                        data.push(this.data[i])
                    }
                }
                else{
                    data.push(this.data[i])
                }
            }
        }
        else{
            for(var i=0;i<this.data.length;i++){
                if(this.data[i].type == index){
                    if(!key){
                        if(!this.data[i].isFull){
                            data.push(this.data[i])
                        }
                    }
                    else{
                        data.push(this.data[i])
                    }
                }
            }
        }
        this.createRoomList(data)
    },
    onBack(){
         Gm.userData.setOreFullRoomShow(this.toggleBtn.isChecked)
         this._super()
    },
    onItemClick(data){
        Gm.send(Events.ORE_ENTER_ROOM,data)
        this.onBack()
    }
});


