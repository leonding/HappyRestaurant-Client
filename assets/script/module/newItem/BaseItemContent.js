// BaseItem
cc.Class({
    extends: cc.Component,
    properties: {
        spSsrIconSpr:cc.Sprite,
        jobSpr:cc.Sprite,
        gemLvLab:cc.Label,
        timeNode:cc.Node,
        teamSpr:cc.Sprite,
    },
    setData(data,owner){
        this.node.active = true
        this.owner = owner
        this.data = data
        this.conf = Gm.config.getItem(this.data.baseId)
        
        if (this.conf){
            this.updateCount()
            this.updateSsrIcon()
            this.updateGemLv()
            this.updateItemTime()
            this.updateTeam()
        }
        return  this.conf
    },
    updateCount(){
        var str = ""
        var tmpCount = this.data.count || this.data.itemCount
        if(tmpCount){
            if (typeof(tmpCount) == "string"){
                str = tmpCount
            }else{
                str = "x"+Func.transNumStr(tmpCount)
            }
        }else{
            str = ""
        }
        this.owner.setLabStr(str)
    },
    updateSsrIcon(){
        if (this.conf.type != ConstPb.propsType.FEEL_UP){
            this.updateTopRightSsrIcon()
        }
        if(this.conf && this.conf.equip && this.conf.equip > 0){
            var equipConf = Gm.config.getEquip(this.conf.equip)
            if(equipConf && equipConf.equipClass >0){
                // this.owner.loadSsrIcon("ssr_equip_" + equipConf.equipClass)
                var spStr = "ssr_equip_sp_1"
                this.loadSpSsrIcon(spStr)
                this.owner.updateJob(equipConf)
                return
            }
        }else if (this.conf && this.conf.type == 999){
            // this.loadSpSsrIcon("ssr_equip_sp_1")
            // return
        }else if (this.conf.type == ConstPb.propsType.FEEL_UP){
            this.updateTopRightSsrIcon("ssr_quality_" + this.conf.quality)
        }
        // this.owner.loadSsrIcon(null)
        this.loadSpSsrIcon(null)
        this.owner.updateJob()
    },
    loadSpSsrIcon(str){
        if (str){
            this.spSsrIconSpr.node.active = true
            if(this.lastSsrIcon == str){
                return
            }
            Gm.load.loadSpriteFrame("img/equipLogo/"+str,(sp,owner)=>{
                owner.spriteFrame = sp
            },this.spSsrIconSpr)
        }else{
            this.spSsrIconSpr.node.active = false
        }
    },
    updateTopRightSsrIcon:function(str){
        if (str == null){
            this.jobSpr.spriteFrame = null
            return
        }
        if (this.topRightStr == str){
            return
        }
        this.topRightStr = str
        this.jobSpr.node.scale = 0.4
        Gm.load.loadSpriteFrame("img/equipLogo/"+str,function(sp,icon){
            icon.spriteFrame = sp
        },this.jobSpr)
    },
    updateGemLv(){
        if (this.conf && this.conf.type == ConstPb.propsType.GEM){
            var gemConf = Gm.config.getGem(this.conf.id)
            this.gemLvLab.string = Ls.lv() + gemConf.level
        }else{
            this.gemLvLab.string = ""
        }
    },
    updateItemTime(){
        this.timeNode.active = false
        //金币券、魂石券、粉尘券
        if (this.conf && (this.conf.type ==  ConstPb.propsType.FIGHT_GOLD_TICKET || this.conf.type == ConstPb.propsType.FIGHT_HERO_EXP_TICKET || this.conf.type ==  ConstPb.propsType.FIGHT_FENCHEN_TICKET)){
            this.timeNode.active = true
            var lab = this.timeNode.getChildByName("lab").getComponent(cc.Label)
            lab.string = this.conf.train_exp/60/60 + Ls.get(50022)
        }
    },
    updateTeam:function(){
        if(this.conf && this.conf.type && this.conf.type == 125 && (this.conf.childType == 3 || this.conf.childType == 4 || this.conf.childType == 5 )){
            var res = Gm.config.getTeamType(this.conf.childType-2)
            Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                if (icon && icon.node){
                    icon.spriteFrame = sp
                    icon.node.active = true
                }
            },this.teamSpr)
        }else if (this.conf && this.conf.type == 131){
            
        }
        else{
            this.teamSpr.node.active = false
        }
    },
    updateIntimacy(){
        if (this.conf && this.conf.type == ConstPb.propsType.FEEL_UP){
            this.owner.setCountLabRightAlign()
        }
    }
    
});

