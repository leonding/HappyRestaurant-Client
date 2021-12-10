cc.Class({
    properties: {
    },
    ctor:function(){
        this.allEvents = {}
    },
    add:function(name,handler){
        if (this.allEvents[name] == undefined) {
            let arr = []
            this.allEvents[name] = arr
        }
        // console.log("添加事件",name,handler)
        this.allEvents[name].push(handler)
    },
    remove:function(name,handler){
        if (this.allEvents[name]){
            for(var i = 0 ;i < this.allEvents[name].length;i++){
                if (this.allEvents[name][i] == handler){
                    this.allEvents[name].splice(i,1)
                    break
                }
            }
        }
    },
    dispatchGlobalEvent:function(action){
        // console.log("派发事件",action)
        if (action.name && this.allEvents[action.name]){
            for(var i = 0 ;i < this.allEvents[action.name].length;i++){
                this.allEvents[action.name][i](action.args)
            }
        }else if (action.name == undefined || action.name ==null){
            console.log("null event",action.name)
            var w  = action.name + www
        }
    }
});
