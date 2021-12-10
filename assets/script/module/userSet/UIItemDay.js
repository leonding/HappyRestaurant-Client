cc.Class({
    extends: cc.Component,

    properties: {
        lbDay: cc.Label,
        spSel: cc.Sprite,
    },

    setDay(index, day, sel, cb) {
        this.index = index;
        this.day = day;
        this.cb = cb;

        this.lbDay.string = day;
        this.spSel.enabled = sel;
        this.lbDay.node.color = sel ? {r: 255, g: 255, b: 255, a: 255} : {r: 0, g: 4, b: 0, a: 255} 
    },

    onClickItem() {
        if (this.cb) {
            this.cb(this.index, this.day);
        }
    },
});
