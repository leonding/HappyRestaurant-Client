// BuffBase
cc.Class({
    extends: cc.Component,

    properties: {
        // m_oNumLab:cc.Label,
    },
    updateData:function(data){
        this.m_oData = data
        if (data){
            Gm.load.loadSpriteFrame("personal/bufficon/"+data.icon,function(sp,icon){
                if (icon && icon.node){
                    icon.spriteFrame = sp
                }
            },this.getComponent(cc.Sprite))
        }
    },
    updatePoint:function(destNum){
        this.m_iTimes = destNum
    //     var tmpAtyOp = Gm.config.getConst("buff_time_show")
    //     console.log("destNum===:",destNum,tmpAtyOp)
    //     if (destNum >= tmpAtyOp){
    //         this.m_oNumLab.string = ""
    //     }else{
    //         this.m_oNumLab.string = destNum
    //     }
    },
    deletBuff:function(){
        if (this.m_oSkData && this.m_oSkData.clubs){
            for(const i in this.m_oSkData.clubs){
                if (this.m_oSkData.clubs[i] == this.m_oData.id){
                    this.m_oSkData.clubs.splice(i,1)
                    return true
                }
            }
        }
        return false
    },
    insertBuff:function(skeleton){
        this.m_oSkData = skeleton
        if (!skeleton.clubs){
            skeleton.clubs = []
        }
        skeleton.clubs.push(this.m_oData.id)
    },
});

