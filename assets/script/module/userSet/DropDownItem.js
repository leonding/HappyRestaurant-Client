cc.Class({
    extends: cc.Toggle,
    properties: {
        lab:cc.Label,
        fgtIcon:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        
        this.lab.string = data.problem
    },
    onBtn(){
        
    },
});


