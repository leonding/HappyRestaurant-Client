var BaseView = require("BaseView")

// SkillSetView
cc.Class({
    extends: BaseView,

    properties: {
        m_oSkillPerfab:cc.Prefab,
        m_oSkillCell:cc.Prefab,
        m_oSkillTop:cc.Prefab,

        m_tTopList:{
            default: [],
            type: cc.Node,
        },

        m_tListSkill:{
            default: [],
            type: cc.Node,
        },

        seletSpr:cc.Node,
    },
   
    enableUpdateView:function(args){
    	if (args){
            this.m_oData = args
            var self = this
            // console.log("heroData==:",heroData)
            // Func.destroyChildren(this.m_oHeroScroll.content)

            var insertSkill = function(destData,node,list){
                var tmpCell = null
                if (destData){
                    tmpCell = cc.instantiate(self.m_oSkillTop)
                }else{
                    tmpCell = cc.instantiate(self.m_oSkillCell)
                }
                tmpCell.parent = node
                var tmpSpt = tmpCell.getComponent("SkillSetCell")
                if (destData){
                    tmpSpt.setIdx(0)
                    tmpSpt.setOwner(self,Gm.config.getSkill(destData))
                }else{
                    tmpSpt.setIdx(1)
                    tmpSpt.setOwner(self)
                }
                if (list){
                    list.push(tmpSpt)
                }
            }
            insertSkill(this.m_oData.attack_skill,this.m_tTopList[0])
            insertSkill(this.m_oData.passive_skill,this.m_tTopList[1])
            

            var updateIcon = function(node,data){
                Gm.load.loadSpriteFrame("personal/skillicon/" +data.picture,function(sp,icon){
                    icon.spriteFrame = sp
                },node.getComponent(cc.Sprite))
            }
            var unlockLevel = Gm.config.getConst("unlock_level").split("|")
            for(const i in unlockLevel){
                const v = Gm.config.getSkill(this.m_oData.passive_skills[i])
                updateIcon(this.m_tListSkill[i].getChildByName("spr"),v)
                this.m_tListSkill[i].baseId = this.m_oData.passive_skills[i]
            }
            this.updateList()
        }
    },
    updateList:function(){
        var unlockLevel = Gm.config.getConst("unlock_level").split("|")
        for(const i in unlockLevel){
            var ned = this.m_tListSkill[i].getChildByName("level")
            var has = this.m_tListSkill[i].getChildByName("has")
            var btn = this.m_tListSkill[i].getComponent(cc.Button)
            var suo = this.m_tListSkill[i].getChildByName("suo")
            var spr = this.m_tListSkill[i].getChildByName("spr")
            ned.active = false
            has.active = false
            suo.active = false
            spr.color = cc.color(255,255,255)
            // if (this.m_oData.level < unlockLevel[i]){//没到等级
            //     ned.getComponent(cc.Label).string = Ls.lv()+unlockLevel[i]+Ls.get(1205)
            //     ned.active = true
            //     has.active = false
            //     // btn.interactable = false
            //     suo.active = false
            // }else{//已到等级
            //     ned.active = false
            //     // btn.interactable = true
            //     has.active = false
            //     suo.active = true
            //     for(const j in this.m_oData.unlockSkillList){
            //         if (this.m_oData.unlockSkillList[j] == tmpHeroData.passive_skills[i]){//已解锁
            //             spr.color = cc.color(255,255,255)
            //             suo.active = false
            //             break
            //         }
            //     }
            //     for(const j in this.m_oData.skillList){
            //         if (this.m_oData.skillList[j] == tmpHeroData.passive_skills[i]){//已装备
            //             has.active = true
            //             spr.color = cc.color(80,80,80)
            //             break
            //         }
            //     }
            // }
            
        }
        var tmpIdx = this.m_iSelIdx || 0
        this.m_iSelIdx = -1
        this.updateInfo(tmpIdx)
    },
    updateInfo:function(destIdx){
        if (this.m_iSelIdx != destIdx){
            this.m_iSelIdx = destIdx
            const nod = this.m_tListSkill[this.m_iSelIdx]
            this.seletSpr.x = nod.x
            this.seletSpr.y = nod.y
            // this.m_oSelItem.active = false
        }
    },
    onListCell:function(sender,value){
        var y = sender.target.parent.y + sender.target.y + sender.target.height
        Gm.ui.create("TipsInfoView",{id:this.m_tListSkill[value].baseId,x:sender.target.x,y:y})
        this.updateInfo(value)
    },
    onCloseClick:function(){
    	this.onBack()
    },
});

