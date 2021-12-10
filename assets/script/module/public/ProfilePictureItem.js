cc.Class({
    extends: cc.Component,
    properties: {
        iconSpr:cc.Sprite,      
        lockLayer:cc.Node,  
    },
    onLoad(){
        this.init()
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.onClick()
        })
    },

    init(){
        if (this.isInit){
            return
        }
    },
    setData(data){
        this.data = data
        if(data){
            data.itemType = ConstPb.itemType.ROLE
        }
        var conf
        if (data.baseId < 1000000){
            conf = Gm.config.getSkin(Gm.config.getHero(data.baseId).skin_id)
        }else{
            conf = Gm.config.getSkin(Gm.config.getHero(0,data.baseId).skin_id)
        }
        if (conf){
            Gm.load.loadSpriteFrame("personal/head/"+conf.picture,function(spr,icon){
                icon.spriteFrame = spr
            },this.iconSpr)
        } 
    },

    setHead(data){
        this.data = data
        var conf = Gm.config.getSkin(this.data.skin || this.data.skin_id || this.data[0].skin_id)
        if(conf.type == 1){ //运营活动可以购买的皮肤
            conf = Gm.config.getGroupHeroBySkin(conf.id)
            conf = Gm.config.getSkin(conf[0].id)
        }
        if (conf){
            Gm.load.loadSpriteFrame("personal/head/"+conf.picture,function(spr,icon){
                icon.spriteFrame = spr
            },this.iconSpr)
        } 
    },


    setFb(fb){
        this.fb = fb
    },

    onClick(){
        if(this.fb){
            this.fb(this.m_indx)
        }
    },

    setIndex(indx){
        this.m_indx = indx
    },

    getIndex(){
        return this.m_indx
    },

    itemIsLock(active){
        this.lockLayer.active = active
    }
});

