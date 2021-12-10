var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        buttons:{
            default: [],
            type: cc.Label,
        },
    },
    onLoad:function(){
        this._super()
        this.configs = Gm.config.getEquipPart()
        var con = Gm.config.getQuality()
        for (let index = 0; index < con.length; index++) {
            const v = con[index];
            this.configs.push(v)
        }
        this.configs.push({childTypeName:Ls.get(3013),type:2,childType:6})
        this.configs.push({childTypeName:Ls.get(3014),type:10})
        // this.configs.push({text:"武器",part:1})
        // this.configs.push({text:"胸甲",part:2})
        // this.configs.push({text:"鞋子",part:3})
        // this.configs.push({text:"头盔",part:4})
        // this.configs.push({text:"手套",part:5})
        // this.configs.push({text:"护腿",part:6})

        // this.configs.push({text:"D级",quality:1})
        // this.configs.push({text:"C级",quality:2})
        // this.configs.push({text:"B级",quality:3})
        // this.configs.push({text:"A级",quality:4})
        // this.configs.push({text:"S级",quality:5})
        // this.configs.push({text:"神器",quality:6})

        // this.configs.push({text:"全装备",all:1})
    },
    onEnable:function(){
        this._super()
        for (let index = 0; index < this.buttons.length; index++) {
            const v = this.buttons[index];
            var con = this.configs[index]
            var str = ""
            if (con.type == 3){
                str = Gm.bagData.getEquipsByPart(con.childType).length
            }else if(con.type == 2){
                str = Gm.bagData.getEquipsByQuality(con.childType).length
            }else{
                str  = Gm.bagData.getAllEquips().length
            }
            v.string = con.childTypeName + "x" + str
        }
    },
    onClick:function(sender,value){
        var con = this.configs[checkint(value)-1]
        Gm.send(Events.EQUIP_CHOICE,con)
        this.onBack()
    },
    
});

