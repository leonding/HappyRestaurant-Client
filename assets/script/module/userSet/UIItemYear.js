cc.Class({
    extends: cc.Component,

    properties: {
       lbYear:cc.Label,
    },

    setYear(index, year, cb) {
        this.year = year
        this.index = index
        this.cb = cb
        this.lbYear.string = year+"年"
    },

    onClickItem() {
        if (this.cb) {
            this.cb(this.index, this.year);
        }
    },
});
