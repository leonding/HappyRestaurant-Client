
cc.Class({
    extends: cc.Component,
    properties: {
        itemParent:cc.Node,
        bgSpr:cc.Sprite,
        nameLab:cc.Label,
        descNode:cc.Node,
        openLab:cc.Label,
        starNumLab:cc.Label,
        numRich:cc.RichText,

        lockNode:cc.Node,
        lockLab:cc.Label,
    },
    onLoad(){
        this.nameLab.node.on("size-changed", ()=>{
            this.descNode.x = this.nameLab.node.width+30
        })
    },
    setData:function(data,owner){//道具
        this.data = data
        this.owner = owner

        this.nameLab.string = data.name

        var dayStr = ""
        for (let index = 0; index < data.clientOpenTime.length; index++) {
            const v = data.clientOpenTime[index];
            if (dayStr != ""){
                dayStr = dayStr + "、"
            }
            if(v.arg > 0){
                dayStr = dayStr + v.arg
            }
        }
        if (dayStr != ""){
            dayStr = dayStr + " "
        }

        var timeStr = ""
        for (let index = 0; index < data.openTime.length; index++) {
            const v = data.openTime[index];
            if (timeStr != ""){
                timeStr = timeStr + "、"
            }
            if(v.time){
                timeStr = timeStr + Func.timeToTSFM(v.time,true) 
            }
        }


        var str = cc.js.formatStr(data.des,dayStr,timeStr)
            
        this.openLab.string = str 

        var info = Gm.config.getDungeonInfo(data.id,1)
        Gm.load.loadSpriteFrame("img/dungeon/"+data.bg,function(sp,icon){
            icon.spriteFrame = sp
        },this.bgSpr)

        for (let index = 0; index < info.oneReward.length; index++) {
            const v = info.oneReward[index];
            var itemBase = Gm.ui.getNewItem(this.itemParent)
            itemBase.node.scale = 100/itemBase.node.width
            itemBase.setData(v)
            itemBase.setLabStr("")
        }
        this.updateStar()

        if (data.openconditions > Gm.userInfo.maxMapId){
            this.lockNode.active = true
            var mapConf = Gm.config.getMapById(data.openconditions)
            this.lockLab.string =  cc.js.formatStr( Ls.get(5280),mapConf.mapName)
        }

        Gm.red.add(this.node,"dungeon",this.data.id)
    },
    updateStar(){
        this.starNumLab.string = Gm.dungeonData.getDungeonAllStar(this.data.id)
        var colorStr = "<color=#FFF4DE>%s<color=#%s><outline color=#000000 width=1>%s</outline></c></c>"
        var count = Gm.dungeonData.getData(this.data.id).fightCount
        var color = count==0?"FF0000":"BBFD7A"
        this.numRich.string = cc.js.formatStr(colorStr,Ls.get(800163),color,count)
    },
    onClick1(){
        cc.log("onClick1")
        if (this.lockNode.active){
            return
        }
        if (this.isTimeOpen()){
            Gm.dungeonData.redClick(this.data.id)
            Gm.ui.create("DungeonListView",{id:this.data.id,type:1})
        }else{
            Gm.floating(Ls.get(5321))
        }
        //1单人， 2组队
        // Gm.ui.create("DungeonListView",{dungeonConf:this.data,choiceType:2})
    },
    isTimeOpen(){
        for (let index = 0; index < this.data.openTime.length; index++) {
            const openTime = this.data.openTime[index];
            if (Gm.userData.getDayPassTime() >= openTime.time && Gm.userData.getDayPassTime() < openTime.time + this.data.duration  ){
                return true
            }
        }
        return
    },
});


