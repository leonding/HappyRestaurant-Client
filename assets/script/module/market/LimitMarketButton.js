
cc.Class({
    extends: cc.Component,

    properties: {
        m_odateLabel:cc.Label,
        m_ozheNode:cc.Node,
        m_oSprite:cc.Sprite,
        m_oBtn:cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },


    setUI(date,index,currentIndex,data){

        this.m_odateLabel.string = date
        this.m_ozheNode.active = index > currentIndex
        this.m_oSprite.node.active = index < currentIndex
        this.m_index = index
        this.m_oBtn.interactable = this.m_index != currentIndex
        this.m_data = data
    },

    setCallBck(cb){
        this.m_cb = cb
    },

    onButtonClick(){
        if(this.m_cb){
            this.m_cb(this.m_index,this.m_oSprite.node.active)
        }
    },

    setSelect(isSelect){
        if(!this.m_ozheNode.active){
            this.m_oBtn.interactable = isSelect
        }
    },

    getData(){
        return this.m_data
    }

    // update (dt) {},
});
