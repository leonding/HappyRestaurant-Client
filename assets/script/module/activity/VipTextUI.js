cc.Class({
    extends: cc.Component,
    properties: {
        itemFab:cc.Node,
        scrollView:cc.ScrollView,
        isAllBack:false
    },
    setVipLv(vipLevel){

        var lvConf = Gm.config.getVip(vipLevel)

        Func.destroyChildren(this.scrollView.content)
        var list = lvConf.info.split("\n")
        for (let index = 0; index < list.length; index++) {
            const v = list[index];

            var item = cc.instantiate(this.itemFab)
            item.active = true
            this.addNode(item)
            var lab = item.getChildByName("name").getComponent(cc.RichText)
            lab.string = v
            if (v.indexOf("camp_img_fk") >=0 ){
                lab.node.x = lab.node.x + 29
            }
            if(index % 2 != 0 && !this.isAllBack) {
                item.getChildByName("back").active = false
            }
        }
    },
    addNode(node){
        this.scrollView.content.addChild(node)
    },
    
});


