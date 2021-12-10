cc.Class({
    extends: cc.Component,
    properties: {
        heroNode:cc.Node,
        noHeroNode:cc.Node,

        headNode:cc.Node,
        ssrSp:cc.Sprite,
        nameLab:cc.Label,
        timeLab:cc.Label,
        helpLab:cc.RichText,
        btn:cc.Button,
        
        descLab:cc.Label,
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        var show = false
        if (this.data){
            show = true
            var hero = Gm.heroData.getHeroById(this.data.heroId)
            // Func.newHead(hero.baseId,this.headNode,hero.qualityId)
            if (this.headNode.itembase == null){
                var itemBase = Gm.ui.getNewItem(this.headNode)
                itemBase.node.scale = this.headNode.width/itemBase.node.width
                itemBase.node.zIndex = -1
                itemBase.setTips(false)
                this.headNode.itemBase = itemBase
            }
            this.headNode.itemBase.updateHero({baseId:hero.baseId,qualityId:hero.qualityId,level:hero.level})
            var conf = Gm.config.getHero(hero.baseId,hero.qualityId)
            this.nameLab.string = conf.name

            if (this.data.aidFriName){
                this.btn.interactable = false
                this.helpLab.string = cc.js.formatStr(Ls.get(7030),this.data.aidFriName)
                this.updateTime()
                this.schedule(()=>{
                    this.updateTime()
                },1)
            }else{
                this.btn.interactable = true
                this.timeLab.string = ""
                this.helpLab.string = Ls.get(7031)
            }
            
            Gm.load.loadSpriteFrame("img/equipLogo/ssr_hero_"+HeroFunc.ssrQuality(conf.quality),function(sp,icon){
                icon.spriteFrame = sp
            },this.ssrSp)

        }else{
            // this.descLab.string = "a"
        }
        this.heroNode.active = show
        this.noHeroNode.active = !show
    },
    updateTime(){
        if (this.data && this.data.aidFriName){
            this.timeLab.string = cc.js.formatStr(Ls.get(7029),1)
        }
    },
    onRemoveBtn(){
        var list = []
        for (let index = 0; index < Gm.friendData.aidList.length; index++) {
            const v = Gm.friendData.aidList[index];
            if (v.heroId != this.data.heroId){
                list.push(v.heroId)
            }
        }
        Gm.friendNet.changeAid(list)
    },
    onAddBtn(){
        Gm.ui.create("FriendAidHerosView")
    },
});
