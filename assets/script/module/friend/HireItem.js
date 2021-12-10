cc.Class({
    extends: cc.Component,
    properties: {
        spineNode:cc.Node,
        spine:sp.Skeleton,
        lvLab:cc.Label,
        nameLab:cc.Label,
        jobSp:cc.Sprite,
        btn:cc.Button,
        btnLab:cc.Label,
        fireLab:cc.Label,
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        if (this.data == null){
            this.lastDwarf = null

            this.setShow(false)
            return
        }
        this.setShow(true)
        
        this.lvLab.string = Ls.lv() + Gm.heroData.getMaxHeroLv()
        this.nameLab.string = data.ownerName

        this.showSpine()
    },
    showSpine(){
        var conf = Gm.config.getHero(0,this.data.qualityId)
        var skinConf = Gm.config.getSkin(conf.skin_id )
        if (this.lastDwarf == skinConf.dwarf){
            return
        }
        Gm.load.loadFight(skinConf.dwarf,(sp)=>{
            if (this.data){
                this.spineNode.active = true
                this.spine.skeletonData = sp
                this.spine.setAnimation(0, "idle", 1)
                this.lastDwarf = skinConf.dwarf
            }
        },this.spine)
    },
    onClick(){
        cc.log("获取详情信息")
        if (this.data){
            Gm.heroNet.dynInfo(this.data.heroId)
        }
    },
    onBtnClick(){
        // Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
        Gm.box({msg:Ls.get(7079)},(btnType)=>{
            if (btnType == 1){
                Gm.friendNet.hireReturn(this.data.heroId)
            }
        })
    },
    setShow(show){
        this.btn.interactable = show
        this.btn.node.active = show
        this.spineNode.active = show
        this.nameLab.node.parent.active = show
        this.lvLab.node.parent.active = show
        this.fireLab.node.active = !show
    },
});
