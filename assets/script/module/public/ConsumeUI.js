cc.Class({
    extends: cc.Component,
    properties: {
        icon:cc.Sprite,
        rich:cc.RichText,
    },
    setData(data){
        if (data){
            this.loadIcon(data.id)
            this.rich.string = Func.doubleLab(Gm.userInfo.getCurrencyNum(data.id),data.need,"ffffff","ffffff")
            if (data.id == ConstPb.playerAttr.PAY_GOLD){ 
                var color = "ffffff"
                if (Gm.userInfo.getCurrencyNum(data.id) < data.need){
                    color = "E3012F"
                }
                this.rich.string = cc.js.formatStr("<color=#%s>%s%s</c>",color,data.need,"("+ Ls.get(20050)+ ")")
            }
        }
    },
    loadIcon(id){
        if (this.lastId == id){
            return
        }
        this.lastId = id
        Gm.ui.getConstIcon(id,(sp,icon)=>{
            icon.spriteFrame = sp
            // icon.node.width = 35
            // icon.node.height = 35
        },this.icon)
    },
});

