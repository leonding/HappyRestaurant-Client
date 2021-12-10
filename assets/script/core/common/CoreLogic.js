cc.Class({
    properties: {
      logicName:"",
      view:null
    },
    ctor:function(){
        this.events = {}
        this.register()
        this.addEvnet()
    },
    setLogicName(lName){
        this.logicName = lName
    },
    setView:function(v){
        this.view = v
    },
    isView:function(){
        if (this.view && this.view.node.active){
            return true
        }
    },
    updateView(){
        if (this.isView()){
            this.view.updateView()
        }
    },
    register:function(){
    },
    addEvnet:function(){
        for (const key in this.events) {
            Gm.events.add(key,this.events[key])
        }
    },
    removeEvent:function(){
        for (const key in this.events) {
            Gm.events.remove(key,this.events[key])
        }
    },
    onNewDay(){//进入新一天

    },
    test:function(){

    }
});
