cc.Class({
    extends: cc.Component,
    properties: {
        btn:cc.Node,
        content:cc.Node,
    },
    onLoad(){
        this.selectType = -1
    },
    setData(list,owner,btnWidth){
        this.owner = owner
        this.listBtns = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var item = cc.instantiate(this.btn)
            item.active = true
            item.clickType = v.type
            item.clickIndex = index
            this.content.addChild(item)
            this.listBtns.push(item)

            item.getChildByName("lab").getComponent(cc.Label).string = Ls.get(v.str)
            item.getChildByName("selectSpr").active = false
            if (btnWidth){
                item.width = btnWidth
                item.getChildByName("defSpr").width = btnWidth
                item.getChildByName("selectSpr").width = btnWidth
            }
        }
    },
    select(type){
        if (this.selectType != type){
            if(this.selectType != -1){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = v.clickType == type
                v.getChildByName("selectSpr").active = isSelect
                v.getChildByName("lab").color = Func.getPageColor(isSelect)
            }
            cc.log("select",this.selectType)
            this.owner.selectType = this.selectType
            this.owner.select()
        }
    },
    onBtnClick(sender){
        this.select(sender.target.clickType)
    },
});

