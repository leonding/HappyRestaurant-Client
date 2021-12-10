var BaseView = require("BaseView")

const TYPE_TRAIN = 0
const TYPE_DRILL = 1

const TRAIN_LIST = ["hp","mp","minDmg","maxDmg","armor","magic_resistance","hit"]
const TRAIN_HERO = [100,101,102,103,106,107,110]
const TRAIN_NAME = ["生命值","魔法值","最小攻击","最大攻击","护甲值","魔抗值","命中值"]

const DRILL_LIST = ["hp_percent","mp_percent","dmg_percent","armor_percent","magic_resistance_percent","hit_percent"]
const DRILL_HERO = [500,501,2001,508,507,510]
const DRILL_NAME = ["生命加成","魔法加成","攻击加成","护甲加成","魔抗加成","命中加成"]

const TRAIN_BOOK = ["training_book_a","training_book_b","training_book_c","training_book_d"]

// DrillView
cc.Class({
    extends: BaseView,
    properties: {
        m_oTitleLab:cc.Label,
        m_oBackFloor:cc.Node,
        m_oBtnDrill:cc.Node,

        m_oHeadNode:cc.Node,
        m_oNameLab:cc.Label,
        jiantou:cc.Node,
        m_oLevelLab:cc.Label,
        m_oFightLab:cc.Label,
        qIcon:cc.Sprite,
        m_oMaxLab:cc.Label,
        m_oExpLab:cc.Label,

        m_oQualityLab:{
            default: [],
            type: cc.Label,
        },
        m_oValueLab:{
            default: [],
            type: cc.Label,
        },
        m_oSkillPerfab:cc.Prefab,
        m_oItemPerfab:cc.Prefab,

        m_oWakeNode:cc.Node,
        m_oAwakeTips:cc.Label,
        m_oSkillNode:cc.Node,
        m_oSkillInfo:cc.Label,
        m_oNeedLab1:cc.RichText,
        m_oNeedLab2:cc.RichText,
        m_oAwakeNone:cc.Node,
        m_oAwakeNode:cc.Node,
        m_oBtnAll:cc.Node,
        m_oUsedNode:cc.Node,

        m_oTrainNode:cc.Node,
        m_oStarList:cc.Node,
        m_oExpBar:cc.ProgressBar,
        m_oTrainScroll:cc.ScrollView,

        m_oitemSpr1:cc.Sprite,
        m_oitemSpr2:cc.Sprite,
    },
    register:function(){

    },

    enableUpdateView:function(args){
        if (args){
            this.m_oData = args
            // console.log("this.m_oData===:",this.m_oData)
            var tmpConfig = Gm.config.getHero(this.m_oData.baseId)
            Func.getHeadWithParent(tmpConfig.picture,this.m_oHeadNode)
            Gm.load.loadSpriteFrame("texture/ssr/ssr_hero_"+HeroFunc.ssrQuality(tmpConfig.quality),function(sp,icon){
                icon.spriteFrame = sp
            },this.qIcon)
            this.m_oMaxLab.string = Gm.config.getDrillMax(tmpConfig.quality).awakenStage

            Func.destroyChildren(this.m_oTrainScroll.content)
            this.m_tTrainItems = []
            for(const i in TRAIN_BOOK){
                // var tmpPage = cc.instantiate(this.m_oItemPerfab)
                // tmpPage.parent = this.m_oTrainScroll.content
                var itemSp = Gm.ui.getNewItem(this.m_oTrainScroll.content)
                // itemSp.setStrengthLv()
                itemSp.setFb(this.onItemClick.bind(this))
                // itemSp.setAlsob(this.onItemClick.bind(this))
                var tmpId = Gm.config.getConst(TRAIN_BOOK[i])
                var tmpItem = Gm.bagData.getItemByBaseId(tmpId)
                // console.log("tmpId==:",tmpId,tmpItem)
                if (tmpItem){
                    // console.log("tmpItem==:",tmpItem)
                    itemSp.updateItem(tmpItem,this)
                }else{
                    itemSp.updateItem({baseId:tmpId,count:0},this)
                }
                this.m_tTrainItems.push(itemSp)
            }
            this.updateNow()
            this.m_oNameLab.node.on("size-changed", function(){
                var tmpX = this.m_oNameLab.node.width + this.m_oNameLab.node.x
                this.jiantou.x = tmpX + this.jiantou.width/2 + 5
                this.m_oLevelLab.node.x = tmpX + this.jiantou.width + 10
            }, this)
        }
    },
    updateNow:function() {
        var hero = Gm.heroData.getHeroById(this.m_oData.heroId)
        var tmpConfig = Gm.config.getHero(hero.baseId)
        var tmpLevel = Gm.config.getTrainByLevel(hero.trainLevel,tmpConfig.quality)
        var tmpLevelNow = Gm.heroData.getHeroById(this.m_oData.heroId).trainLevel
        var tmpLevel2 = Gm.config.getTrainByLevel(tmpLevelNow+1,tmpConfig.quality)
        if ((tmpLevel && tmpLevel.awaken && hero.awakenStage < tmpLevel.awaken) || !tmpLevel2){
            this.changeType(TYPE_DRILL)
        }else{
            this.changeType(TYPE_TRAIN)
        }
    },
    updateLevel:function(){
        var hero = Gm.heroData.getHeroById(this.m_oData.heroId)
        var tmpConfig = Gm.config.getHero(hero.baseId)
        // console.log("hero===:",hero,tmpConfig)

        this.m_oLevelLab.node.active = false
        this.jiantou.active = false
        this.m_oFightLab.string = hero.getAttrValue(203)
        this.m_oNameLab.string = tmpConfig.name+" +"+hero.awakenStage

        for(const i in this.m_oQualityLab){
            this.m_oQualityLab[i].node.active = false
            this.m_oValueLab[i].node.active = false
        }
        if (this.m_iType == TYPE_TRAIN){
            var tmpLevelNow = hero.trainLevel
            var tmpLevel1 = Gm.config.getTrainByLevel(tmpLevelNow,tmpConfig.quality)
            var tmpLevel2 = Gm.config.getTrainByLevel(tmpLevelNow+1,tmpConfig.quality)
            // console.log("tmpLevel==:",tmpLevel1,tmpLevel2)
            for(const i in TRAIN_LIST){
                this.m_oQualityLab[i].node.active = true
                this.m_oValueLab[i].node.active = true
                this.m_oQualityLab[i].string = TRAIN_NAME[i]+":"
                var tmpBaseValue = 0
                if (tmpLevel1){
                    tmpBaseValue = tmpLevel1[TRAIN_LIST[i]]
                }
                if (tmpLevel2){
                    this.m_oValueLab[i].string = tmpBaseValue+"(+"+(tmpLevel2[TRAIN_LIST[i]] - tmpBaseValue)+")"
                }else{
                    this.m_oValueLab[i].string = tmpBaseValue
                }
            }
            if (tmpLevel2){
                this.m_oExpLab.string = hero.trainExp+"/"+tmpLevel2.trainExp
                this.m_oExpBar.progress = hero.trainExp/tmpLevel2.trainExp
            }else{
                this.m_oExpLab.string = hero.trainExp+"/"+hero.trainExp
                this.m_oExpBar.progress = 0
            }
            
            for(var i = 0;i<10;i++){
                var tmpNode = this.m_oStarList.getChildByName(i+"").getChildByName("star")
                if (i < tmpLevelNow%10){
                    tmpNode.active = true
                }else{
                    tmpNode.active = false
                }
            }
            for(const i in this.m_tTrainItems){
                var tmpId = Gm.config.getConst(TRAIN_BOOK[i])
                var tmpItem = Gm.bagData.getItemByBaseId(tmpId)
                // console.log("tmpId==:",tmpId,tmpItem)
                var tmpItemNums = 0
                if (tmpItem){
                    tmpItemNums = tmpItem.count
                }
                this.m_tTrainItems[i].updateItem({baseId:tmpId,count:tmpItemNums},this)
            }
        }else{
            var tmpLevelNow = hero.awakenStage
            var tmpLevel1 = Gm.config.getDrillByLevel(tmpLevelNow,tmpConfig.quality)
            var tmpLevel2 = Gm.config.getDrillByLevel(tmpLevelNow+1,tmpConfig.quality)
            var self = this
            var tmpSkill = function(_skillId,destValue){
                var tmpSk = Gm.config.getSkill(_skillId)
                // console.log("tmpSk===:",_skillId,tmpSk)
                var tmpPage = cc.instantiate(self.m_oSkillPerfab)
                tmpPage.parent = self.m_oSkillNode
                self.m_oSkillInfo.string = tmpSk.detailed
                var tmpSpt = tmpPage.getComponent("SkillBase")
                tmpSpt.setOwner(self,tmpSk,destValue)
            }
            Func.destroyChildren(this.m_oSkillNode)
            this.m_oAwakeNone.active = false
            this.m_oAwakeNode.active = true
            var tmpHas = true
            if (tmpLevel2 && tmpLevel2.awaken_skill){
                tmpHas = false
                this.m_oAwakeTips.string = Ls.get(500001)
                tmpSkill(tmpConfig["skillId"+tmpLevel2.awaken_skill],false)
            }else{
                for(var i = tmpLevelNow+2;i < 11;i++){
                    var tmpLv = Gm.config.getDrillByLevel(i,tmpConfig.quality)
                    if (tmpLv && tmpLv.awaken_skill){
                        this.m_oAwakeTips.string = Ls.get(500002)+i+Ls.get(500003)
                        tmpSkill(tmpConfig["skillId"+tmpLv.awaken_skill],true)
                        tmpHas = false
                        break
                    }
                }
                if (tmpHas){
                    this.m_oAwakeTips.string = Ls.get(500004)
                    this.m_oAwakeNone.active = true
                    this.m_oAwakeNode.active = false
                }
            }
            this.m_iWakeNums = 0
            this.m_oBtnAll.active = false
            this.m_oUsedNode.active = true
            var tmpBack = this.m_oBackFloor.getComponent(cc.Widget)
            if (tmpLevel2){
                this.m_oLevelLab.node.active = true
                this.jiantou.active = true
                this.m_oLevelLab.string = "+"+(tmpLevelNow+1)
                this.m_oNeedLab1.string = Func.doubleLab(Gm.userInfo.silver,tmpLevel2.consume_silver)// Gm.userInfo.silver+"/"+tmpLevel2.consume_silver
                var tmpId = Gm.config.getConst("hero_awaken_item_id")
                var tmpItem = Gm.bagData.getItemByBaseId(tmpId)
                // console.log("tmpItem===:",tmpItem)
                if (tmpItem && tmpItem.count > 0){
                    this.m_iWakeNums = tmpItem.count
                }
                this.m_oNeedLab2.string = Func.doubleLab(this.m_iWakeNums,tmpLevel2.consume_20031) //this.m_iWakeNums+"/"+tmpLevel2.consume_20031
                // if (this.m_iWakeNums < tmpLevel2.consume_20031){
                //     this.m_oNeedLab2.node.color = cc.color(255,0,0,255)
                // }else{
                //     this.m_oNeedLab2.node.color = cc.color(255,255,255,255)
                // }
                this.m_oBtnDrill.active = true
                tmpBack.bottom = 0
            }else{
                this.m_oUsedNode.active = false
                this.m_oBtnAll.active = true
                this.m_oLevelLab.string = ""
                this.m_oBtnDrill.active = false
                tmpBack.bottom = 110
                this.m_oNeedLab1.string = "-"
                this.m_oNeedLab2.string = "-"
                this.m_oNeedLab2.node.color = cc.color(255,255,255,255)
            }
            // console.log("tmpLevel==:",tmpLevel)
            for(const i in DRILL_LIST){
                this.m_oQualityLab[i].node.active = true
                this.m_oValueLab[i].node.active = true
                this.m_oQualityLab[i].string = DRILL_NAME[i]+":"
                var tmpBaseValue = 0
                if (tmpLevel1){
                    tmpBaseValue = tmpLevel1[DRILL_LIST[i]]
                }
                if (tmpLevel2){
                    this.m_oValueLab[i].string = tmpBaseValue/100+"%(+"+(tmpLevel2[DRILL_LIST[i]] - tmpBaseValue)/100+"%)"
                }else{
                    this.m_oValueLab[i].string = tmpBaseValue/100+"%"
                }
            }
        }

    },
    changeType:function(destType){
        if (this.m_iType != destType){
            for(const i in this.m_tTrainItems){
                this.m_tTrainItems[i].updateTime(0)
            }
            this.m_iType = destType
            var tmpBack = this.m_oBackFloor.getComponent(cc.Widget)
            if (this.m_iType == TYPE_TRAIN){
                this.m_oTitleLab.string = Ls.get(500005)
                this.m_oTrainNode.active = true
                this.m_oWakeNode.active = false
                this.m_oBtnDrill.active = false
                tmpBack.bottom = 110
            }else{
                this.m_oTitleLab.string = Ls.get(500006)
                this.m_oTrainNode.active = false
                this.m_oWakeNode.active = true
                this.m_oBtnDrill.active = true
                tmpBack.bottom = 0
            }
        }
        this.updateLevel()
    },
    onDrill:function(sender,value){
        if (this.m_iWakeNums){
            Gm.heroNet.sendAwaken(this.m_oData.heroId)
        }
    },
    onItemClick:function(data,itemType){
        if (itemType == ConstPb.itemType.TOOL){
            var tmpLevelNow = Gm.heroData.getHeroById(this.m_oData.heroId).trainLevel
            var tmpConfig = Gm.config.getHero(this.m_oData.baseId)
            var tmpLevel2 = Gm.config.getTrainByLevel(tmpLevelNow+1,tmpConfig.quality)
            // console.log("data==:",data)
            if (tmpLevel2){
                var tmpItem = Gm.bagData.getItemByBaseId(data.baseId)
                if (tmpItem && tmpItem.count > 0){
                    Gm.heroNet.sendTrain(this.m_oData.heroId,data.baseId)
                }else{
                    Gm.floating(Ls.get(500007))
                    for(const i in this.m_tTrainItems){
                        this.m_tTrainItems[i].updateTime(0)
                    }
                }
            }else{
                Gm.floating(Ls.get(500008))
            }
        }
    },
});

