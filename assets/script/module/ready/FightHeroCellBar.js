// FightHeroCellBar
cc.Class({
    extends: cc.Component,

    properties: {
        hpSpr:cc.Sprite,
        mpSpr:cc.Sprite,
    },
    setData(data){
        this.hpSpr.node.width = 115*(data.hp/data.maxHp)
        this.mpSpr.node.width = 113*(data.mp/data.maxMp)
    }
});

