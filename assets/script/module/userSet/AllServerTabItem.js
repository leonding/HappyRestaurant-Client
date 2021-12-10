
cc.Class({
    extends: cc.Component,

    properties: {
        m_oRange:cc.Label,
        m_oSelectSpr:cc.Sprite
    },
    setData(index, data, owner){
        this.owner = owner
        this.data = data
        this.index = index
        this.checkRange(index)
    },
    checkRange(index){
        var min = (index-1)*5+1
        var max = index*5
        var str = min+""+Ls.get(1000067)+"-"+max+""+Ls.get(1000067)
        this.setRange(str)
    },
    setRange(str){
        this.m_oRange.string = str
    },
    setSelected(enabled){
        this.m_oSelectSpr.node.active = enabled
    },
    onClick(){
        // this.setSelected(true)
        this.owner.select(this.index)
    }
});
