var defaultStr = "<color=#27FF19>%s</c>\n<color=#ffffff>%s</color>"

var TYPE_COPY = -2
cc.Class({
    extends: require("BaseView"),
    properties: {
        rich:cc.RichText,
        richBg:cc.Node,
        btn:cc.Node,
    },
    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START,  (event)=> {
            if (this.itemType == TYPE_COPY){
                this.onBack()
                return
            }
            this.node._touchListener.swallowTouches = false
        },this)
        this.node.on(cc.Node.EventType.TOUCH_END,  (event)=> {
            this.onBack()
        },this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,  (event)=> {
            this.onBack()
        },this)
    },
    enableUpdateView:function(args){
        if (args){
            this.data = args.data
            this.itemType = args.itemType
            this.pos = args.pos
            if(this.itemType == ConstPb.itemType.TOOL){
                this.setItem()
            }else if (this.itemType == ConstPb.itemType.EQUIP){
                this.setEquip()
            }else if (this.itemType == ConstPb.itemType.ROLE){ //武将
                this.setHero()
            }else if (this.itemType == -1){ //客户端自定义，-1为文字直接显示
                if (typeof(this.data) == "string"){
                    this.rich.string = this.data
                }else{
                    this.setOther()
                }
            }else if (this.itemType == TYPE_COPY){//复制
                this.updateButtonPos()
                return
            }
            this.updateRichPos()
        }
    },
    setOther:function(){
        if (this.data.type){
            var tmpType = Math.floor(this.data.type/1000)
            var conf = null
            if (tmpType == 7){// 阵营图标
                conf = Gm.config.getTeamType(this.data.type%10)
                this.setRichString(Ls.get(50059),conf.childTypeName)
            }else if(tmpType == 0){ //品质
                conf = Gm.config.getHeroType(this.data.type)
                this.setRichString(Ls.get(50117),conf.childTypeName)
            }else if(tmpType == 5){// 职业
                conf = Gm.config.getJobType(this.data.type%10)
                this.setRichString(Ls.get(600030)+conf.childTypeName,this.data.location)
            }
        }else{

        }
    },
    setItem:function(){
        var conf = Gm.config.getItem(this.data.baseId)
        this.isHeroChip = conf.type == 999
        this.setRichString(conf.name,conf.description)
    },
    setEquip:function(){
        var conf = Gm.config.getEquip(this.data.baseId)
        this.setRichString(conf.name,conf.description)
    },
    setHero:function(){
        var conf
        if (this.data.isMonster){
            if (this.data.qualityId && this.data.qualityId > 10000){
                var conf = Gm.config.getHero(0,this.data.qualityId)
            }else{
                var monsterConf = Gm.config.getMonster(this.data.baseId)
                conf = Gm.config.getHero(0,monsterConf.heroQualityID)
            }
        }else{
            if (this.data.qualityId < 10000){
                conf = Gm.config.getHero(this.data.baseId)
            }else{
                conf = Gm.config.getHero(0,this.data.qualityId)
            }
        }
        this.isHeroChip = conf.type == 999
        this.setRichString(conf.name,conf.info)
    },
    setRichString:function(nameStr,descStr){
        this.rich.string = cc.js.formatStr(defaultStr,nameStr,descStr)
    },
    updateButtonPos(){
        this.richBg.active = false
        this.btn.active = true
        this.btn.x = this.pos.x - cc.winSize.width/2
        this.btn.y = this.pos.y - cc.winSize.height/2-this.data.height-30

        this.btn.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = Ls.get(1000033)
    },
    updateRichPos:function(){
        var maxWidth = 0 
        for (let index = 0; index < this.rich._linesWidth.length; index++) {
            const v = this.rich._linesWidth[index];
            if (v > maxWidth){
                maxWidth = v
            }
        }
        var richx = this.pos.x - cc.winSize.width/2
        if (richx+ maxWidth > cc.winSize.width/2){
            richx = cc.winSize.width/2 - maxWidth - 20
        }
        this.rich.node.x = richx
        this.rich.node.y = this.pos.y - cc.winSize.height/2
        this.richBg.x = this.rich.node.x-10
        this.richBg.y = this.rich.node.y+2
       
        this.richBg.width = maxWidth + 30
        this.richBg.height = this.rich.node.height + 20

        if (this.isHeroChip){
            // this.btn.active = true
            // this.btn.x = this.richBg.x +  this.richBg.width/2
            // this.btn.y = this.richBg.y - this.richBg.height-20
            // this.richBg.height = this.richBg.height + 50
        }
    },
    btnClick(){
        if (this.itemType == TYPE_COPY){//复制
            Bridge.copyStr(this.data.str)
            this.onBack()
            return
        }
        this.onBack()
        Gm.ui.create("TjHeroView",this.data.baseId)
    },
});

