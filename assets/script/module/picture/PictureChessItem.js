cc.Class({
    extends: cc.Component,

    properties: {
        noneNode:cc.Node,
        chessNode:cc.Node,

        selectNode:cc.Node,
        headNode:cc.Sprite,
        kuangSpr:cc.Sprite,
        numKuangSpr:cc.Sprite,
        numLab:cc.Label,
        addLab:cc.Label,
    },
    setData:function(data,owner,treasure){
        this.owner = owner
        this.data = data
        
        if (data){
            this.setShow(true)
            this.select(false)

            var hero = Gm.pictureData.getHero(data.heroId,treasure)
            this.heroConf = Gm.config.getHero(0,hero.qualityId)

            var skinConf = Gm.config.getSkin(hero.skin || this.heroConf.skin_id)

            Gm.load.loadSpriteFrame("personal/head/"+skinConf.picture,(sp,owner)=>{
                owner.spriteFrame = sp
                owner.node.scale = 1
            },this.headNode)

            this.skillConf = Gm.config.getSkill(data.skillId)

            this.numLab.string = this.skillConf.level
            this.addLab.string = this.skillConf.detailed

            Gm.load.loadSpriteFrame("img/jigsaw/jigsaw_img_"+this.skillConf.level,(sp,owner)=>{
                owner.spriteFrame = sp
            },this.kuangSpr)
            Gm.load.loadSpriteFrame("img/jigsaw/jigsaw_img_0"+this.skillConf.level,(sp,owner)=>{
                owner.spriteFrame = sp
            },this.numKuangSpr)
        }else{
            this.setShow(false)
        }
    },
    setShow(show){
        this.chessNode.active = show
        this.noneNode.active = !show
    },
    select(show){
        this.selectNode.active = show
    },

});

