cc.Class({
    extends: cc.Component,

    properties: {
    },
    setData:function(data){
        this.data = data
    },
    getData:function(){
        return this.data || {}
    },
});