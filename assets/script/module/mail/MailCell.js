// MailCell
const mail_color = [
    [223,47,0],
    [89,62,33],
]
cc.Class({
    extends: cc.Component,

    properties: {

        m_oNameLab:cc.Label,
        m_oItemNode:cc.Node,
        m_oGetLab:cc.Label,
        m_oTimeLab:cc.Label,
        m_oIconSpr:cc.Sprite,

        m_oBackFrame: {
            default: [],
            type: cc.SpriteFrame
        },
        m_oIconFrame: {
            default: [],
            type: cc.SpriteFrame
        },
    },
    setOwner:function(destOwner,data){
        this.m_oData = data
        var tmpTitleStr = ""
        if (this.m_oData.emailTitle){
            tmpTitleStr = this.m_oData.emailTitle
        }else{
            var tmpStr = this.m_oData.emailTitleAlias || this.m_oData.emailContentAlias
            var tmpAlias = tmpStr.split("|")
            var tmpConfig = Gm.config.getMailConfig(tmpAlias[0])
            tmpTitleStr = tmpConfig.mailTitle
        }
        this.m_oNameLab.string = Func.subName(tmpTitleStr,15)
        this.m_oTimeLab.string = Func.timeToJSBX(Math.floor((Gm.userData.getTime_m() - this.m_oData.emailDate)/1000))

        if (data.attachment){
            this.m_oItemNode.active = true
            Func.destroyChildren(this.m_oItemNode)
            var tmpAry = data.attachment.split("|")

            for (var i = 0; i < tmpAry.length; i++) {
                if (i == 5){
                    break
                }
                var infos = tmpAry[i].split("_")

                var tmpSpt = Gm.ui.getNewItem(this.m_oItemNode)
                tmpSpt.setTips(false)
                // if(infos[0] == ConstPb.itemType.EQUIP){
                //     tmpSpt.updateEquip({baseId:infos[1],count:infos[2]})
                // }else if (this.currData.item.itemType == ConstPb.itemType.HERO_SKIN){
                //     tmpSpt.updateSkin()
                // }else{
                //     tmpSpt.updateItem({baseId:infos[1],count:infos[2]})
                // }
                tmpSpt.setData({itemType:Number(infos[0]),baseId:Number(infos[1]),count:Number(infos[2])})
                tmpSpt.updateLock(this.m_oData.emailState != 0)
            }
        }else{
            this.m_oItemNode.active = false
        }
        if (this.m_oData.emailState == 0){
            this.m_oIconSpr.spriteFrame = this.m_oIconFrame[0]
            this.node.getComponent(cc.Sprite).spriteFrame = this.m_oBackFrame[0]
            this.m_oGetLab.node.color = cc.color(mail_color[0][0],mail_color[0][1],mail_color[0][2])
            this.m_oGetLab.string = Ls.get(30012)
        }else{
            this.m_oGetLab.node.color = cc.color(mail_color[1][0],mail_color[1][1],mail_color[1][2])
            this.m_oIconSpr.spriteFrame = this.m_oIconFrame[1]
            this.node.getComponent(cc.Sprite).spriteFrame = this.m_oBackFrame[1]
            this.m_oGetLab.string = Ls.get(30013)
        }
    },
    onCellClick:function(){
        Gm.ui.create("MailInfoView",this.m_oData)
    },
});

