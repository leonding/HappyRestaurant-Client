// UsedCell
cc.Class({
    extends: cc.Component,

    properties: {

        tjNode:cc.Node,
        m_oNameLab:cc.Label,
        m_oNeedLab:cc.Label,

        m_oBtn:cc.Node,
    },
    setOwner:function(data,owner){
        this.m_oData = Func.itemConfig({type:ConstPb.itemType.TOOL,id:data})

        var itemSp = Gm.ui.getNewItem(this.tjNode)
        itemSp.updateItem({baseId:this.m_oData.con.id,count:this.m_oData.num})

        this.m_oNameLab.string = this.m_oData.con.name
        this.m_oNeedLab.string = this.m_oData.con.description
        var lab = this.m_oBtn.getChildByName("lab")
        if (this.m_oData.num > 0){
            this.m_oBtn.getComponent(cc.Sprite).spriteFrame = owner.getCellSprite(true)
            lab.getComponent(cc.Label).string = Ls.get(3009)
            lab.getComponent(cc.LabelOutline).color = cc.color(36,87,117)
        }else{
            this.m_oBtn.getComponent(cc.Sprite).spriteFrame = owner.getCellSprite(false)
            lab.getComponent(cc.Label).string = Ls.get(600103)
            lab.getComponent(cc.LabelOutline).color = cc.color(50,128,50)
        }
    },
    onExchange:function(){
        if (this.m_oData.num > 0){
            Gm.bagNet.useBag(Gm.bagData.getItemByBaseId(this.m_oData.con.id).id,1)
        }else{
            Gm.box({msg:Ls.get(600104)},(btnType)=>{
                if (btnType == 1){
                    Gm.ui.jump(this.m_oData.con.viewId[0].id)
                    Gm.ui.removeByName("TravelView")
                    Gm.ui.removeByName("TravelUsed")
                }
            })
        }
    },
});

