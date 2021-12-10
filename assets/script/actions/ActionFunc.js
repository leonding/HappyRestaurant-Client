exports.rootNode = null

exports.setRootNode = function(node){
    exports.rootNode = node
    exports.rootNode.zIndex = 1000
}

//道具移动
exports.moveItems = function(args,fab){ //{nodes:[],endNode:node,time:1}\
    if (args.endNode == null){
        if (Gm.ui.getMain() == null){
            return
        }
    }
    args.time = args.time || 0.9
    args.endNode = args.endNode || Gm.ui.getMain().getBagBtn()

    var endPos = exports.rootNode.convertToNodeSpaceAR(args.endNode.convertToWorldSpaceAR(cc.v2(0,0)))

    for (var i = args.nodes.length-1; i >=0 ; i--) {
        var node = args.nodes[i]
        exports.moveAction(node,args.time,endPos)
    }
    if (fab){
        Gm.load.retainFab(fab)
        setTimeout(()=>{
            Gm.load.releaseFab(fab)
        },(args.time + 0.1) * 1000)
    }
    setTimeout(()=>{
        var acList = new Array()
        var ac1 = cc.scaleTo(0.1,1.3)
        var ac2 = cc.scaleTo(0.1,1)
        acList.push(ac1)
        acList.push(ac2)
        
        var acs = cc.sequence(acList)
        args.endNode.runAction(acs)
    },args.time * 1000)
}

exports.moveAction = function(node,time,endPos){ 
    node.removeFromParent(false)
    exports.rootNode.addChild(node)
    node.setPosition(exports.rootNode.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v2(0,0))))

    var acList = new Array()
    acList.push(cc.moveTo(time,cc.v2(endPos.x,endPos.y)))
    acList.push(cc.scaleTo(time,0.5))
    acList.push(cc.sequence(new Array(cc.delayTime(time),cc.callFunc( ()=>{
        node.removeFromParent(true)
        node.destroy()
    }))))
    node.runAction(cc.spawn(acList))
}


