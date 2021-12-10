cc.Class({
    extends: require("BaseView"),

    properties: {
        FeelAddtionItem:cc.Prefab,
        items:{
            default: [],
            type: cc.Node,
        },
        dwarfSpine:sp.Skeleton,
    },
    onLoad(){
        this._super()
        // for (var i = 0; i < this.items.length; i++) {
        //     var v = this.items[i]
        //     var content = v.getChildByName("content")
        //     this.sizeChange(content)
        // }
    },
    sizeChange(content){
        content.on("size-changed", (sender)=>{
            content.parent.height = Math.abs(content.y) + content.height+10
        })
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },

    insertData(allList,insertList){
        for (var i = 0; i < insertList.length; i++) {
            var addData = insertList[i]
            var dd = Func.forBy(allList,"id",addData.id)
            if (dd){
                dd.num = dd.num + addData.num
            }else{
                allList.push({id:addData.id,num:addData.num})
            }
        }
    },
    updateView(){
        var vHeros = Gm.villaData.vHeros
        var feels = []
        var qualitys = []

        for(var i in vHeros){
            var vHeroData = vHeros[i]

            var heroConf = Gm.config.getHero(vHeroData.baseId)
            if (this.openData.m_iFilterValue == 0 || this.openData.m_iFilterValue == heroConf.camp){
                 this.insertData(feels,Gm.config.getHeroFeelByLv(vHeroData.baseId,vHeroData.lv).Property)

                var qualityId=0
                for (var j = 0; j < vHeroData.units.length; j++) {
                    if (vHeroData.units[j].activation && vHeroData.units[j].qualityId > qualityId){
                        qualityId = vHeroData.units[j].qualityId
                    }
                }
                if (qualityId > 0){
                    this.insertData(qualitys,Gm.config.getHero(vHeroData.baseId,qualityId).activationProperty)
                }
            }
        }

        var list = [feels,qualitys]
        for (var i = 0; i < list.length; i++) {
            var itemData = list[i]
            var item = this.items[i]
            item.active = true
            var content = item.getChildByName("content")
            for (var j = 0; j < itemData.length; j++) {
                var item = cc.instantiate(this.FeelAddtionItem)
                content.addChild(item)

                var sp = item.getComponent("FeelAddtionItem")
                sp.setData([itemData[j],itemData[j+1]],this)
                j++
            }
            content.parent.getChildByName("tipsNode").active = itemData.length == 0
        }
        
    },
    // onInfoClick:function(){
    //     this.dwarfSpine.setCompleteListener((trackEntry) => {
    //                 cc.log("播放完成",trackEntry.animation.name)
    //             })

    //     this.dwarfSpine.setEventListener((trackEntry, event) => {
    //         cc.log("aaa",trackEntry.animation.name,event.data.name)
    //     })

    //     this.spIndex = 0
    //     this.list = ["attack1","attack2","skill1","block","damage","death","dodge",
    //                 "idle","start","victory","victory3"]
                    
    //     this.spIndex = this.spIndex + 1
    //     if (this.spIndex > this.list.length-1){
    //         this.spIndex = 0
    //     }
    //     cc.log(this.list[this.spIndex])
    //     this.dwarfSpine.addAnimation(0,this.list[this.spIndex],false)
    // },
});
