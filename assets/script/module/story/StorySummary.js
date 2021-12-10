var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oChapter:cc.Label,
        m_oContent:cc.Label,
    },
    onDisable(){
   
    },
    onLoad:function(){
        this.popupUIData = {title:7300011}
        
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.owner = args.owner
            var info = Gm.getLogic("StoryLogic").getBaseChapterInfo()
            this.m_oChapter.string = info.episodes
            this.m_oContent.string = info.plot

            this.step = args.step
        }
    },
    onOkClick(){
        Gm.ui.create("StoryUpdateView",{type:3})

        var storyLogic = Gm.getLogic("StoryLogic")
        
        //统计通过跳过剧情领取剧情奖励的人数
        var  actionType = 4
        var chapterInfo = storyLogic.getBaseChapterInfo()
        if(chapterInfo.new){
            actionType = 1
        }
        storyLogic.sendBi(-10000, actionType, chapterInfo.id, this.step)

        storyLogic.setHaveRead()
        
        this.owner.onBack()
        this.onBack()
    }
});
