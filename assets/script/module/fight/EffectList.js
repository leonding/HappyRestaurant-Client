// EffectList
cc.Class({
    properties: {
        list:[],
    },
    clear:function(){
        this.list = []
    },
    ctor:function(){
        this.clear()
    },
    putLab:function(lab,idx){
        if (lab){
            lab.active = false
            lab._tIdx = idx
            this.list.push(lab)
            var len = this.list.length
            if (len == 1){
                lab.active = true
            }else{
                setTimeout(()=>{
                    lab.active = true
                },len * 100)
            }
            var self = this
            lab.getComponent(cc.Animation).on('finished',function(sender,owner){
                owner._target.node.removeFromParent(true)
                owner._target.node.destroy()
                for(const i in self.list){
                    if (self.list[i]._tIdx == owner._target.node._tIdx){
                        self.list.splice(i,1)
                        break
                    }
                }
            }.bind(lab))
        }
    },
});

