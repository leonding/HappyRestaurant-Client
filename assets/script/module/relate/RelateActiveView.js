var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        RelateActiveItem:cc.Node,
        scrollView:cc.ScrollView,
        m_oBlankTipNode:cc.Node,//空白页提示              
    },
    onLoad(){
		this.popupUIData = {title:7027}
        this._super()
    },
    onDestroy(){
        this._super()
    },
    // onEnable(){
    //     this.updateView()
    // },
    enableUpdateView(args){
        if (args){
            this.data = args
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = this.data.heroRelate

        list.sort(function(a,b){
            var confA = Gm.config.getHero(0,a.qualityId)
            var confB = Gm.config.getHero(0,b.qualityId)
            return confB.quality - confA.quality
        })

        for (let index = 0; index < list.length; index++) {
            var itemData = list[index]
            var item = cc.instantiate(this.RelateActiveItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("RelateActiveItem")
            itemData.heroGroupId = this.data.heroGroupId
            itemSp.setData(itemData,this)
        }
        this.checkBlank(list)
    },
    onOkBtn(){
        if (this.selectItem && this.selectItem.isCheck()){
            if (this.selectItem.data.playerId != Gm.userInfo.id){
                var lastData = Func.forBy(Gm.heroData.getRelateByGroupId(this.data.idGroup).heroRelate,"heroGroupId",this.selectItem.data.heroGroupId)
                
                if (lastData && lastData.playerId == this.selectItem.data.playerId){
                    this.onBack()
                    return
                }
                if (Gm.heroData.getRelateAidNum(this.selectItem.data.playerId) >= 3){
                    if (!(lastData == null || (lastData && lastData.playerId == Gm.userInfo.id))){
                        Gm.floating(600108)
                        return
                    }
                }
                // if ( (lastData == null || (lastData && lastData.playerId == Gm.userInfo.id)) && Gm.heroData.getRelateAidNum(this.selectItem.data.playerId) >= 3){
                //     Gm.floating(600108)
                //     return
                // }
            }
            Gm.heroNet.useRelateAid(this.data.idGroup,this.selectItem.data.heroGroupId,this.selectItem.data.playerId)
            this.onBack()
        }
    },
    onItemClick(item){
        if(this.selectItem){
            this.selectItem.setCheck(false)
        }
        this.selectItem = item
        this.selectItem.setCheck(true)
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },        
});

