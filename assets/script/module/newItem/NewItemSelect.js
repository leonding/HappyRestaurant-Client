
cc.Class({
    extends: cc.Component,
    properties: {
        selectSpr:cc.Sprite,
    },
    onLoad(){

        this.m_isSelect = false
    },

    setSelect(){
        this.m_isSelect = !this.m_isSelect
        this.selectSpr.node.active =  this.m_isSelect
    },
    isSelect(){
        return this.m_isSelect
    },

    setIndex(idx){
        this.m_idx = idx
    },
    getIndex(){
        return this.m_idx 
    },

    setHeroId(heroId){
        this.m_heroId = heroId
    },
    getHeroId(){
        return this.m_heroId
    },
    setFb:function(_fb){
        this.fb = _fb
    },

    onClick(){
        if(this.fb){
            this.fb(this)
        }
    }
});

