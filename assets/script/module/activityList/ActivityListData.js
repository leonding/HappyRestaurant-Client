
cc.Class({
    properties:{

    },
    
    ctor(){
        this.m_openPage = []
        this.clearData()
    },
    pushOpenPageId(id){
        if(this.m_openPage.indexOf(id) == -1){
            this.m_openPage.push(id)
        }
    },
    spliceOpenPageId(id){
        var index = this.m_openPage.indexOf(id) 
        if(index != -1){
            this.m_openPage.splice(index,1)
        }
    },

    getOpenPageList(){
        return this.m_openPage
    },

    clearData(){
        this.m_openPage = []
    }
})