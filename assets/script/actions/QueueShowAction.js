cc.Class({
    extends: cc.Component,
    properties: {
        baseTime:0.1,
        row:1,
    },
    onLoad(){
        this.node.showIndex = 0
        this.node.on(cc.Node.EventType.CHILD_ADDED,(event)=>{
            this.itemAction(event,this.node.showIndex)
        })

        this.node.on(cc.Node.EventType.CHILD_REMOVED,(event)=>{
            this.unscheduleAllCallbacks()
        })

        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.stopQueueAction()
        })
    },
    runQueueAction(){
        this.stopQueueAction()
        for (var i = 0; i < this.node.children.length; i++) {
            var node = this.node.children[i]
            this.itemAction(node,this.node.children.length-i)
        }
    },
    itemAction(node,index){
        var showIndex = this.node.children.length-index
        var time = Math.ceil(showIndex/this.row)*this.baseTime
        
        node.opacity = 0
        this.scheduleOnce(()=>{
            node.scale = 0.7
            node.opacity = 255
            node.runAction(cc.scaleTo(0.1,1).easing(cc.easeBackOut()))
        },time)
    },
    stopQueueAction(){
        this.unscheduleAllCallbacks()
        for (let index = 0; index < this.node.children.length; index++) {
            const v = this.node.children[index];
            v.opacity = 255
            v.scale = 1
        }
    }
});
