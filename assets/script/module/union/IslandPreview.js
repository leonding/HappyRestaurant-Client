var BaseView = require("BaseView")
// IslandPreview
cc.Class({
    extends: BaseView,

    properties: {
        m_oMassBtnNode:cc.Node,
        m_oItemsNode:cc.Node,
    },
    onLoad () {
        this._super()
        this.popupUI.setHeight(550)
    },
    onMassBtnClick(){
        Gm.ui.removeByName("AwardBox")
    },
    enableUpdateView:function(data){
        if(data){
            this.data = data
            this.setUI()
        }
    },
    setUI(){
        //标题
        var title = cc.js.formatStr(Ls.get(5456),"")
        this.popupUI.setData({title:title})
        //产出
        for(var i=0;i<this.data.earnings.length;i++){
            this.setItem(this.data.earnings[i])
        }
    },
    setItem(data){
        data.id = parseInt(data.id)
        var sp = Gm.ui.getNewItem(this.m_oItemsNode)
         sp.setData(data)
    }
});

