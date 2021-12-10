var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_btns:{
            type:cc.Node,
            default:[]
        }
    },
    onLoad () {
        this._super()

    },
    enableUpdateView:function(data){
        if (data){
            this.initMenu(data)
        }
    },
    initMenu(data){
        if(this.m_btns){
            var nums = this.m_btns.length
            for(var i=0; i<nums; i++){
                var btn = this.m_btns[data.data[i].id-1]
                btn.getChildByName("New Label").getComponent(cc.Label).string = data.data[i].title
                var mask = btn.getChildByName("mask")
                mask.active = data.data[i].lock == 1
                if(mask.active){
                    btn.getComponent(cc.Button).interactable = false
                }
                mask.getChildByName("New Label").getComponent(cc.Label).string = data.data[i].lock_text
            }
        }
    },
    onTrunkCilck(event, data){
        this.logic.enterStoryList(data)
    },
    onBranchClick(event, data){
        this.logic.enterStoryList(data)
    },
    onRoleClick(event, data){
        this.logic.enterStoryList(data)
    },
    onPromotionClick(event, data){
        this.logic.enterStoryList(data)
    },
    onBack(){
        this._super()
    },

});

