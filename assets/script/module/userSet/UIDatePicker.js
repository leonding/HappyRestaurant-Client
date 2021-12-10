/** 
 * 日期组件
 */
const YEAR_MAX_VAL = 10
cc.Class({
    extends: cc.Component,

    properties: {
        lbMonth: cc.Label,
        lbYear:cc.Label,
        ndDays: cc.Node,
        pfbDay: cc.Prefab,
        pfbYear:cc.Prefab,
        selectYear:cc.ScrollView,
    },

    onLoad () {
        this.initData();
        this.updateDate();
        this.selectYear.node.on('scroll-to-bottom', ()=>{
            this.createYearItem()
        }, this);
    },

    initData() {
        this.date = this.date ? this.date : new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.day = this.date.getDate();
        this.m_scrollViewYear = this.year
        this.pfgListDay = [];
        for (let i = 0; i < 31; ++i) {
            let node = cc.instantiate(this.pfbDay);
            node.parent = this.ndDays;
            this.pfgListDay.push(node);
        }
    },

    // 设置显示的日志，默认为当前日期
    setDate(year, month, day) {
        this.date = new Date(year, month, day);
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.day = this.date.getDate();

        this.updateDate();
    },

    updateDate () {
        this.lbMonth.string = cc.js.formatStr("%s月", this.month + 1);
        this.lbYear.string = cc.js.formatStr("%s年",this.year)
        let date = new Date(this.year, this.month+1, 0);
        let totalDays = date.getDate();

        let date2 = new Date(this.year,this.month,1)
        let fromWeek = date2.getDay();
        for (let i = 0; i < this.pfgListDay.length; ++i) {
            let node = this.pfgListDay[i];
            if (i < totalDays) {
                node.active = true;
                let index = fromWeek + i;
                let row = Math.floor(index / 7);
                let col = index % 7;
                let x = -(this.ndDays.width - node.width) * 0.6 + col * node.width ;
                let y = (this.ndDays.height - node.height) * 0.65 - row * node.height;
                node.setPosition(x, y);
                let script = node.getComponent("UIItemDay");
                script.setDay(i, i + 1, this.day === i + 1, (selIndex, selDay)=>{
                    this.day = selDay;
                    this.updateDate();
                });
            } else {
                node.active = false;
            }
        }
    },

    onClickLeft () {
        if (this.month > 0) {
            this.month -= 1;
        } else {
            this.month = 11;
            this.year -= 1;
        }
        this.date.setFullYear(this.year);
        this.date.setMonth(this.month);
        this.day = 1
        this.updateDate();
    },

    onClickRight () {
        if (this.month < 11) {
            this.month += 1;
        } else {
            this.month = 0;
            this.year += 1;
        }
        this.day = 1
        this.year = Math.min(new Date().getFullYear(),this.year)
        this.date.setFullYear(this.year);
        this.date.setMonth(this.month);
        this.updateDate();
    },

    // 设置选中日期之后的回调
    setPickDateCallback(cb) {
        this.cb = cb;
    },

    onClickClose () {
        if (this.cb) {
            this.cb(this.year, this.month, this.day);
        }
        this.node.destroy()
    },

    onSelectYearClick(){
        this.selectYear.node.active = !this.selectYear.node.active
        if(!this.m_isCreatedYear){
            this.m_isCreatedYear = true 
            this.createYearItem()
        }
    },

    createYearItem(){
        for(let i =0; i< YEAR_MAX_VAL; ++i){
            var yearItem = cc.instantiate(this.pfbYear)
            this.selectYear.content.addChild(yearItem)
            yearItem.getComponent("UIItemYear").setYear(i,this.m_scrollViewYear,(index,year)=>{
                this.selectYear.node.active = false
                this.year = year
                this.date.setFullYear(this.year);
                this.date.setMonth(this.month);
                this.updateDate();
            })
            this.m_scrollViewYear -= 1
        }
      
    },

});
