// BaseItem
cc.Class({
    extends: cc.Component,
    properties: {
        strengthLab:cc.Label,
        equipGems:require("EquipGems"),
        flashNode:cc.Node,
    },
    setData(data,owner){
        this.node.active = true
        this.owner = owner
        this.data = data
        this.conf = Gm.config.getEquip(this.data.baseId)
        this.updateStrength()
        this.updateCount()
        this.updateSsrIcon()
        this.updateGem()
        this.loadFlashNode()
        this.owner.updateJob(this.conf)
        return this.conf
    },
    updateCount(){
        this.owner.setLabStr(Ls.lv() + this.conf.level)
    },
    updateStrength(){
        var str = ""
        if (checkint(this.data.strength) > 0){
            str = "+" + this.data.strength
        }
        this.strengthLab.string = str
    },
    updateSsrIcon(){
        if (this.conf.equipClass > 0){
            this.owner.loadSsrIcon("ssr_equip_"+ Math.min(this.conf.equipClass,3))
        }else{
            this.owner.loadSsrIcon(null)
        }
    },
    updateGem(){
        this.equipGems.setData(this.data)
    },
    loadFlashNode(){
        var tmpKuang = EquipFunc.getGodlyEffect(this.data)
        if (tmpKuang.length > 0){
            if(this.lastFlash == tmpKuang){
                return
            }
            Func.destroyChildren(this.flashNode)
            // this.flashNode.scale = this.owner.defaultHeightScale
            this.lastFlash = tmpKuang
            Gm.load.loadPerfab("perfab/ui/"+tmpKuang,(sp)=>{
                if(this.data && this.flashNode.isValid){
                    var nowKuang = EquipFunc.getGodlyEffect(this.data)
                    if (nowKuang == tmpKuang){
                        this.flashNode.addChild(cc.instantiate(sp))
                    }else{
                        this.lastFlash = null
                    }
                }
            })
        }else{
            this.lastFlash = null
            Func.destroyChildren(this.flashNode)
        }
    },
    
});

