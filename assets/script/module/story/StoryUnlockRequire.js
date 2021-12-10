var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oRead:cc.Label,
        m_oUnlockMap:cc.Label,
        m_oReadNode:cc.Node,
        m_oUnlockMapNode:cc.Node,
        m_title:cc.Label,
    },
    onDisable(){
       
    },
    onLoad:function(){
        this.popupUIData = {title:8009}
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.m_title.string = args.data.episodes 
            if(args.data.read){
                // var conf = null
                // for(let i=0;i<args.config.length;i++){
                //     if(args.config[i].id == args.data.read){
                //         conf = args.config[i]
                //         break
                //     }
                // }
                this.m_oRead.string = args.data.readInfo //Ls.get(5334)+conf.episodes+Ls.get(5335)
            }else{
                this.m_oReadNode.active = false
            }
            if(args.data.unlockMap){
                if(Gm.userInfo.maxMapId >= args.data.unlockMap) {
                    this.m_oUnlockMapNode.active = false
                } else {
                    // var mapid = args.data.unlockMap%1000
                    // var lastMap = mapid%12==0
                    this.m_oUnlockMap.string = args.data.unlockInfo//Ls.get(5336)+(lastMap?parseInt(mapid/12):(parseInt(mapid/12)+1))+"-"+(lastMap?12:(mapid%12))
                }
            }else{
                this.m_oUnlockMapNode.active = false
            }
        }
    },
    onOkClick(){
        this.onBack()
    }

});
