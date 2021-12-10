cc.Class({
    extends: cc.Component,

    properties: {
        titleLab:cc.Label,
        rich1:cc.RichText,
        rich2:cc.RichText,
        imgSpr:cc.Sprite,
    },
    setData:function(data){
        this.data = data
        if (data == null){
            this.node.active = false
            return
        }
        this.node.active = true

        this.titleLab.string = data.titleText
        
        var co = "<color=#532F18>%s</c>"

        var text1 = data.text1
        if (data.id == 1){
            // var picId = Gm.pictureData.getPictureId()
            
            // var picList = Gm.config.getPicturePuzzleGroup(picId)
            // var startTime = Func.dateFtt("MM-dd",Func.newConfigTime(picList[0].openTime))
            // var endTime = Func.dateFtt("MM-dd",Func.newConfigTime(Gm.config.getConst("picture_puzzle_end_time_event")))
            // var shopEndTime = Func.dateFtt("MM-dd",Func.newConfigTime(Gm.config.getConst("picture_puzzle_end_time_all")))

            // text1 = cc.js.formatStr(data.text1,startTime,endTime,shopEndTime)
        }

        this.rich1.string = cc.js.formatStr(co,text1)
        this.rich2.string = cc.js.formatStr(co,data.text2)

        Gm.load.loadSpriteFrame("img/jigsaw/"+data.picture,(sp,owner)=>{
            owner.spriteFrame = sp
        },this.imgSpr)
    },
});

