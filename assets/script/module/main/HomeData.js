cc.Class({
    properties: {

    },

    ctor: function(){
        this.seat_state = [0,0,0,0,
                           0,0,0,0,
                           0,0,0,0,
                           0,0,0,0] //座位状态 0:空闲 1:使用
        
        this.queue_guest = [] //排队的客人
    },

    //获得闲置的座位索引
    getSeatFirstIdleIndex: function(){
        var length = this.seat_state.length
        for(var i = 0; i < length; i++) {
            if(this.seat_state[i] == 0) {
                return i;
            }
        }
        return -1;
    },

    setSeatUse: function(index) {
        this.seat_state[index] = 1;
    },

    setSeatIdle: function(index) {
        this.seat_state[index] = 0;
    },

    /**
     * 删除排队第一个客人
     */
    removeGuestLineupFirst: function(){
        this.queue_guest.shift()
    }

});