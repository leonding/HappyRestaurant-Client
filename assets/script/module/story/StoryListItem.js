var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oCover:cc.Sprite,
        m_oNew:cc.Node,
        m_oLock:cc.Node,
        m_oTitle:cc.Label,
        m_oChapterName:cc.Label,
        m_oAwardIcon:cc.Sprite,
        m_oAwardAttr:cc.Label,
    },
    onLoad () {
        this._super()
        
    },

    setData (data,config){
        this.data = data
        this.config = config
        if(data.new){
            this.m_oNew.active = true
            this.m_oLock.active = false
        }else if(data.lock){
            this.m_oLock.active = true
            // if(data.lock == 1){
            //     this.m_oLock.getChildByName("panel").getComponent(cc.Sprite).node.active = false
            // }
        }else{
            this.m_oAwardIcon.node.active = false
            this.m_oAwardAttr.node.active = false
            this.m_oNew.active = false
        }
        if(data.forbidden){
            this.node.getComponent(cc.Button).interactable = false
            this.node.getChildByName("enter").getComponent(cc.Button).interactable = false
        }
        if(!data.lock){
            Gm.load.loadSpriteFrame("img/juqing/"+data.cover,function(spr,icon){
                icon.spriteFrame = spr  
            },this.m_oCover)
        }
        this.m_oTitle.string = Ls.get(5332)+data.episodes+Ls.get(5333)
        this.m_oChapterName.string = data.title
        if(!data.forbidden){
            var item = Func.itemConfig({type:data.reward[0].type,id:data.reward[0].id})
            Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oAwardIcon)
            this.m_oAwardAttr.string = data.reward[0].num
        }
    },
    onChapterClick(){
        if(this.data.lock){
            Gm.ui.create("StoryUnlockRequire",{data:this.data, config:this.config})
        }else{
            Gm.getLogic("StoryLogic").setBaseChapterInfo(this.data)
            Gm.ui.create("StoryDownload",{episodes:this.data.episodes,size:this.data.size})
        }
    },
    onBack(){
        this._super()
    },
});

