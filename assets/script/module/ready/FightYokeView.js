var BaseView = require("BaseView")
// FightYokeView
cc.Class({
    extends: BaseView,

    properties: {
        scrollViewContent:cc.Node,
        nodeItem1:cc.Node,
        nodeItem2:cc.Node,
        havetNode:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(1800)}
        this._super()
        this.m_tYokeAll   =  YokeFunc.calculationYokeAll()
    },
    getYokeById(id){
        return this.m_tYokeAll[id]
    },
    deleteRepeatId(data){
        var tdata = []
        for(var i in data){
            // console.log("data[i]===:",i,data[i])
            var idx = Number(i)
            var t = this.getYokeById(idx - 1)
            var key = false
            for(var j=0;j<tdata.length;j++){
                var t1 = this.getYokeById(Math.abs(tdata[j]) - 1)
                if(t1.group == t.group){
                    key = true
                    break
                }
            }
            if (!data[i]){
                idx = -Number(i)
            }
            if(!key){
                tdata.push(idx)
            }
        }
        tdata.sort((a,b)=>{
            let ta = this.getYokeById(Math.abs(a) - 1)
            let tb = this.getYokeById(Math.abs(b) - 1)
            if (a * b > 0){
                if (ta.type == tb.type){
                    return tb.id - ta.id
                }else{
                    return tb.type - ta.type
                }
            }
            if (a < 0){
                return 1
            }
            if (b < 0){
                return -1
            }
        })
        return tdata
    },
    enableUpdateView:function(tdata){
        var data = this.deleteRepeatId(tdata.data)
        if(data.length == 0){
            this.havetNode.active = true
            return 
        }
        var heroData = tdata.heroData
        if(data){
            this.heroData = heroData
            this.team = tdata.team
            for(var i in data){
               var config = this.getYokeById(Math.abs(data[i]) - 1)
               if(config.type==1 || config.type == 2){
                    this.createNodeItem2(config,data[i] > 0)
               }
               else if(config.type == 3){
                    this.createNodeItem1(config,data[i] > 0)
               }
            }
        }
    },
    createNodeItem1(config,isDone){
        var item =cc.instantiate(this.nodeItem1)
        this.setTitle(item,isDone)
        item.active = true
        item.x = 0
        item.y = 0
        this.setNodeItem1Content(item,config)
        this.scrollViewContent.addChild(item)
    },
    setNodeItem1Content(item,config){
        var items = item.getChildByName("contentNode").getChildren()
        for(var i=0;i<items.length;i++){
            if(config.condition[i]){
                items[i].active = true
                this.setNodeItem1(items[i],config,i)
            }
            else{
                 items[i].active = false
            }
        }
    },
    setNodeItem1(item,config,i){
        var heroNode = item.getChildByName("heroNode")
        var titleLabel = item.getChildByName("title").getComponent(cc.Label)
        var contentLabel = item.getChildByName("content").getComponent(cc.RichText)
        var itemSp = Gm.ui.getNewItem(heroNode,true)
        itemSp.node.zIndex = -1
        var quality = this.getHeroQualityIdById(config.condition[i])
        var heroconfig = Gm.config.getHero(config.condition[i])
        if (quality){
            heroconfig.baseId   = config.condition[i]
            heroconfig.qualityId = quality
            // console.log("heroconfig==:",heroconfig)
            itemSp.updateHero(heroconfig)
        }else{
            var none = heroNode.getChildByName("none").getComponent(cc.Label)
            var hero = Gm.heroData.getHeroMaxBaseId(config.condition[i])
            if (hero){
                quality = hero.qualityId
                none.string = Ls.get(5331)
            }else{
                quality = heroconfig.qualityProcess[0]
                none.string = Ls.get(5794)
            }
            itemSp.updateHero({baseId:config.condition[i],qualityId:quality})
            itemSp.setGray(true)
        }
        var heroQualityConfig = Gm.config.getQulityHero(quality)
        var skillconfig = null

        var zhenFaSkill = Gm.config.getFaZhenYokeByWid(config.condition[i])
        if(heroQualityConfig && zhenFaSkill){
            if(zhenFaSkill.attackSkills == 1){
                skillconfig= Gm.config.getSkill(heroQualityConfig.zhenfa_attack_skill)
            }
            else{
                skillconfig= Gm.config.getSkill(heroQualityConfig.zhenfa_passive_skill)
            }
        }
        if(skillconfig){
            titleLabel.string = skillconfig.name
            contentLabel.string = skillconfig.detailed
        }
        else{
             titleLabel.string =""
             contentLabel.string = ""
            cc.log("skillconfig null: baseId  qualityId=",heroconfig.baseId,heroconfig.qualityId)
        }
    },
    getHeroQualityIdById(id){
        for(var i=0;i<this.heroData.length;i++){
            var baseId = null
            var qualityId = null
            if(this.heroData[i].qualityId && this.heroData[i].qualityId>1000000){
                baseId = Math.floor(this.heroData[i].qualityId/1000)
                qualityId = this.heroData[i].qualityId
            }
            else if(this.heroData[i].heroQualityID && this.heroData[i].heroQualityID>1000000){
                    baseId = Math.floor(this.heroData[i].heroQualityID/1000)
                    qualityId = this.heroData[i].heroQualityID
            }
            else if(this.heroData[i].quality && this.heroData[i].quality>1000000){
                    baseId = Math.floor(this.heroData[i].quality/1000)
                    qualityId = this.heroData[i].quality
            }
            if(baseId == id){
                return qualityId
            }
        }
    },
    createNodeItem2(config,isDone){
        var item =cc.instantiate(this.nodeItem2)
        this.setTitle(item,isDone)
        item.active = true
        item.x = 0
        item.y = 0
        this.setNodeItem2Content(item,config,isDone)
        this.scrollViewContent.addChild(item)
    },
    setNodeItem2Content(item,config,isDone){
        var items = item.getChildByName("contentNode1").getChildren()
        var tmpAy = {}
        var list = {camps:{},jobs:{}}
        if (isDone){
            list = null
        }
        for(var i=0;i<items.length;i++){
            var name0 = null
            if (config.type == 1){//阵营
                name0 = Gm.config.getTeamType(config.condition[i])
            }else{//职业
                name0 = Gm.config.getJobType(config.condition[i])
            }
            this.setNodeItem2(items[i],config,i,name0,list)
            if (!tmpAy[name0.childTypeName]){
                tmpAy[name0.childTypeName] = 0
            }
            tmpAy[name0.childTypeName]++
        }

        var content2 = item.getChildByName("contentNode2")
        var percentLabel = []
        percentLabel[0] = content2.getChildByName("share_img_zz1").getChildByName("percentLabel").getComponent(cc.RichText)
        percentLabel[0].node.active = false
        percentLabel[1] = content2.getChildByName("share_img_zz2").getChildByName("percentLabel").getComponent(cc.RichText)
        percentLabel[1].node.active = false

        var ary = config.attribute.split("|")
        for(var i=0;i<ary.length;i++){
            percentLabel[i].string = ary[i]
            percentLabel[i].node.active = true
        }
        var title = content2.getChildByName("title")
        var titleStr = ""
        for(const i in tmpAy){
            titleStr+="【"+i+"】"+"x"+tmpAy[i]
        }
        title.getComponent(cc.Label).string = titleStr
    },
    setNodeItem2(item,config,i,name0,list){
        var floor = item.getChildByName("node").getComponent(cc.Sprite)
        var spr = floor.node.getChildByName("spr").getComponent(cc.Sprite)
        var isDone = false
        if (list){
            var need = config.condition[i]
            if (config.type == 1){//阵营
                if (!list.camps[need]){
                    list.camps[need] = 0
                }
                list.camps[need]++
                if (this.team.camps[need] >= list.camps[need]){
                    isDone = true
                }
            }else{//职业
                if (!list.jobs[need]){
                    list.jobs[need] = 0
                }
                list.jobs[need]++
                if (this.team.jobs[need] >= list.jobs[need]){
                    isDone = true
                }
            }
        }else{
            isDone = true
        }
        if (i == 0){
            spr.spriteFrame = null
            var sp = Gm.ui.getNewItem(spr.node)
            sp.setMaxHeight()
            var selfHero = null
            for(const i in this.heroData){
                if (this.heroData[i].baseId == config.hero){
                    selfHero = Gm.heroData.getHeroById(this.heroData[i].heroId || this.heroData[i].id)
                    if (!selfHero){
                        selfHero = {baseId:config.hero,qualityId:this.heroData[i].qualityId || this.heroData[i].quality}
                    }
                    break
                }
            }
            sp.updateHero(selfHero)
            spr.node.scale = 1.4
        }else{
            var none = floor.node.getChildByName("none")
            none.active = !isDone
            YokeFunc.yokeHeroFloor(config.type,name0.childType-1,floor)
            YokeFunc.yokeHeroFrame(config.type,name0.childType-1,spr)
        }
        Gm.load.loadSpriteFrame("img/jobicon/"+name0.currencyIcon,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },item.getChildByName("spr").getComponent(cc.Sprite))
    },
    setTitle:function(node,isDone){
        var lab = node.getChildByName("titleSprite").getChildByName("titleLabel")
        var str = Ls.get(1802)
        if (!isDone){
            str = str + " (" + Ls.get(1008) + ")"
        }
        lab.getComponent(cc.Label).string = str
    },
});

