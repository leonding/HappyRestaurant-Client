// BattleLoadCell
cc.Class({
    extends: cc.Component,
    properties: {
        bgBottom:cc.Sprite,
        roleSpr:cc.Sprite,
        bgSpr:cc.Sprite,
        ssrSpr:cc.Sprite,
        starNode:cc.Node,
        bgNone:cc.Node,
        // bgLock:cc.Node,
        // lockLab:cc.RichText,

        // heroBg:cc.Node,
        // heroSk:sp.Skeleton,
    },
    setLimit:function(limit){
        this.bgNone.active = true
        // if (limit){
        //     this.bgLock.active = true
        //     var map = Gm.config.getMapById(limit.id)
        //     var tmpTable = Gm.config.getMapsByChap(map.chapter)
        //     tmpTable.sort(function(a,b){
        //         return a.id - b.id
        //     })
        //     var tmpIdx = 0
        //     for(const j in tmpTable){
        //         tmpIdx = tmpIdx + 1
        //         if (tmpTable[j].id == limit.id){
        //             this.lockLab.string = "<outline color='#000000' width=2>"+cc.js.formatStr(Ls.get(90027),map.chapter+"-"+tmpIdx)
        //             break
        //         }
        //     }
        // }
    },
    setOwner:function(idx,owner){
        this.m_iIdx = idx
        this.m_oOwner = owner
    },
    setData:function(data){
        this.m_iTotal = 5
        if (data){
            this.bgNone.active = false
            // this.bgLock.active = false
            // this.lockLab.node.active = false
            var hero = Gm.config.getHero(data.baseId,data.quality)
            // this.heroBg.active = true
            var self = this
            this.m_iCount = 2
            Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(hero.quality),function(sp,icon){
                icon.spriteFrame = sp
                self.m_iCount++
                self.loadDone()
            },this.ssrSpr)

            Gm.load.loadSpriteFrame("img/chouka/nvshen_kuang_"+hero.bottom_floor,function(sp,icon){
                icon.spriteFrame = sp
                self.m_iCount++
                self.loadDone()
            },this.bgSpr)
            // Gm.load.loadSpriteFrame("img/chouka/nvshen_di_"+hero.bottom_floor,function(sp,icon){
            //     icon.spriteFrame = sp
            //     self.m_iCount++
            //     self.loadDone()
            // },this.bgBottom)

            HeroFunc.heroStar(this.starNode,hero.quality)

            var skinConf = Gm.config.getSkin(data.skin || hero.skin_id)
            // Gm.load.loadFight(skinConf.dwarf,function(sp,owner){
            //     owner.skeletonData = sp
            //     owner.setAnimation(0, "idle", true)
            //     self.m_iCount++
            //     self.loadDone()
            // },this.heroSk)
            Gm.load.loadSpriteFrame("personal/banshnew/" +skinConf.role,function(sp,icon){
                icon.spriteFrame = sp
                self.m_iCount++
                self.loadDone()
            },this.roleSpr)
        }else{
            this.m_iCount = 5
            this.loadDone()
        }
    },
    loadDone:function(){
        if (this.m_iCount == this.m_iTotal){
            this.m_oOwner.loadDone(this.m_iIdx)
        }
    },
});


