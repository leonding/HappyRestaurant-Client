var BaseView = require("BaseView")

const SIZE_SMALL = 110
const SIZE_BIG = 230

cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
        showBack:cc.Node,
        scrollView: cc.ScrollView,
        itemScroll:cc.Node,
        itemNodes:cc.Node,
        itemSimple:cc.Node,
        // btn:cc.Node,
    },
    onLoad:function(){
        this._super()
        Gm.send(Events.GUIDE_PAUSE)
        this.m_unlockherolist = []
    },
    register:function(){
        this.events[Events.UNLOCKHERO_CLOSE] = this.onUnlockHeroClose.bind(this)
    },
    enableUpdateView(args){
        if (args){
            Gm.audio.playEffect("music/08_reward")
            Func.destroyChildren(this.itemNodes)
            this.titleLab.string = args.title || Gm.config.getRewardShowConfig(null).titleName

            var list = args.list
            if (list.length > 5){
                this.itemScroll.height = SIZE_BIG
            }else{
                this.itemScroll.height = SIZE_SMALL

                this.itemScroll.width = 128 * list.length
                this.itemNodes.width = this.itemScroll.width
            }
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                var itemSp = Gm.ui.getNewItem(this.itemNodes)
                itemSp.node.scale = 1
                itemSp.setData(v)
                this.checkUnlockHero(v)
            }
            if(this.m_unlockherolist.length > 0){
                var tmpItem = this.m_unlockherolist.pop()
                Gm.ui.create("UnLockHero",{qualityId:tmpItem.qualityId})
            }
            // var tmpNode = null
            // Func.destroyChildren(this.itemNodes)
            // Func.destroyChildren(this.itemSimple)
            // if (args.length > 5){
            //     tmpNode = this.itemNodes
            //     this.itemScroll.height = SIZE_BIG
            // }else{
            //     tmpNode = this.itemSimple
            //     this.itemScroll.height = SIZE_SMALL
            // }
            // this.itemParent = tmpNode
            // var row = Math.ceil(args.length/4)
            // var yy = -50
            // for (let i = 0; i < row; i++) {
            //     var k = 4
            //     if (i== row-1){
            //         k = args.length%4
            //         if (k == 0){
            //             k = 4
            //         }
            //     }
            //     var xx = -(k-1)/2*138
            //     for (let j = 0; j < k; j++) {
            //         var currIndex = (i*4)+j
            //         const tmpData = args[currIndex];
            //         var itemSp = Gm.ui.getNewItem(tmpNode)
            //         itemSp.node.y = yy 
            //         itemSp.node.x = xx+ (j *138)
            //         itemSp.node.scale = 0.85
            //         itemSp.setData(tmpData)
                    
            //     }
            //     yy = yy -130
            // }
            // this.btn.y = this.itemNodes.y - 60- Math.ceil(args.length/4)*(30+107)
        }
    },
    checkUnlockHero(item){
        if (item == null){
            return
        }
        if((item.actionType != 1021 && item.actionType != 1085) || item.itemType != ConstPb.itemType.HERO_CARD){
            return         
        }
        for(let i = 0; i < this.m_unlockherolist.length; i++){
            if(this.m_unlockherolist[i].qualityId / 1000 == item.qualityId / 1000){
                return
            }
        }
        
        var list = []
        var heros = Gm.heroData.m_backupHeros
        var baseId = parseInt(item.qualityId/1000)
        for (let index = 0; index < heros.length; index++) {
            const v = heros[index];
            if (v.baseId == baseId){
                list.push(v)
            }
        }
        var ret = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.qualityId >= item.qualityId){
                ret.push(v)
            }
        }
        if(item.qualityId % 10 >= 5 && ret.length == 0){
            this.m_unlockherolist.push(item) 
        }
    },
    onUnlockHeroClose(){
        if(this.m_unlockherolist.length > 0){
            var item = this.m_unlockherolist.pop()
            Gm.ui.create("UnLockHero",{qualityId:item.qualityId})
        }
    },
    onBack(){
        if (this.itemNodes){
            ActionFunc.moveItems({nodes:this.itemNodes.children})
        }
        Gm.send(Events.GUIDE_RESUME)
        Gm.send(Events.CLOSE_AWARDSHOWVIEW)
        Gm.showLevelUp()
        this._super()
    }
});

