var State = {
    IDLE: 0, //静止
    WALK: 1, //行走
    ORDER: 2, //点餐
    REPASE: 3, //就餐
}

var Action = {
    LINE_UP: 0, //排队
    SELECT_SEAT: 1, //选座
    HAVA_A_SEAT: 2, //入座
    ORDER: 3,//点餐
    REPASE: 4, //就餐
    BILL: 5,//结账
    LEAVE: 6, //离开
}

var Direction = {
    INVALID_DIR: -1,
    UP_DIR: 0,
    DOWN_DIR: 1,
    LEFT_DIR: 2,
    RIGHT_DIR: 3,
}


var walk_anim_params = cc.Class({
    name: "walk_anim_params",
    properties: {
        anim_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        anim_duration: 0.1,

        scale_x: 1,
    }
});

var order_anim_params = cc.Class({
    name: "order_anim_params",
    properties: {
        anim_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        anim_duration: 0.1,
        scale_x: 1,
    }
});

var repase_anim_params = cc.Class({
    name: "repase_anim_params",
    properties: {
        anim_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        anim_duration: 0.1,
        scale_x: 1,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        //0 上 1 下 2 左 3 右
        walk_anim_set: {
            type: walk_anim_params,
            default: [],
        },
        
        order_anim_set: {// 0 左 1 右
            type: order_anim_params,
            default: [],
        },

        repase_anim_set: {// 0 左 1 右
            type: repase_anim_params,
            default: [],
        },


        bubble: cc.Button,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 100;
        this.state = State.IDLE;
        this.action = Action.LINE_UP;
        this.road_name = "road_lineup"

        this.seat = 0;//座位号

        this.anim = this.node.getChildByName("anim");
        this.frame_anim = this.anim.addComponent("frame_anim");

    },

    setSeat: function(seat) {
        this.seat = seat
    },

    run_at_road:function(road_name, road_data){
        if(road_data.length < 2){
            return;
        }
        this.road_name = road_name;
        this.road_data = road_data;
        this.state = State.WALK;

        this.node.setPosition(road_data[0]);

        this.next_step = 1;
        this.walk_to_next();
    },

    
    play_walk_anim: function(dir) {

        var r = Math.atan2(dir.y, dir.x);
        
        var now_dir = Direction.INVALID_DIR

        if(r >= -Math.PI && r < -0.75 * Math.PI) { //左
            now_dir = Direction.LEFT_DIR
        }
        else if(r >= -0.75 * Math.PI && r < -0.25 * Math.PI) { //下
           now_dir = Direction.DOWN_DIR
        }
        else if(r >= -0.25 * Math.PI && r < 0.25 * Math.PI) { //右边
            now_dir = Direction.RIGHT_DIR
        }
        else if(r >= 0.25 * Math.PI && r < 0.75 * Math.PI) { //上
            now_dir = Direction.UP_DIR
        }
        else {
            now_dir = Direction.LEFT_DIR
        }
        this.anim_dir = now_dir;
        this.frame_anim.stop_anim();
        this.frame_anim.sprite_frames = this.walk_anim_set[this.anim_dir].anim_frames;
        this.frame_anim.duration = this.walk_anim_set[this.anim_dir].anim_duration;
        this.anim.scaleX = this.walk_anim_set[this.anim_dir].scale_x;
 
        this.frame_anim.play_loop();
    },

    walk_to_next:function(){
        this.state = State.WALK;

        var start_pos = this.node.getPosition();
        var end_pos = this.road_data[this.next_step];
        var dir = end_pos.sub(start_pos);
        var len = dir.mag();
        this.walk_time_total = len / this.speed;
        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        this.walk_time = 0;


        this.play_walk_anim(dir);
    },

    start () {

    },

    walk_update: function(dt) {
        this.walk_time += dt;
        if(this.walk_time >= this.walk_time_total){
            dt -= (this.walk_time - this.walk_time_total);
        }
        var sx = this.vx * dt;
        var sy = this.vy * dt;

        this.node.x += sx;
        this.node.y += sy;
        // console.log("--------------------", this.node.y)
        this.node.zIndex = ~this.node.y + ~this.node.x

        var guest = Gm.ui.getScript("MainView").getFrontGuest(this)
  
        if(guest) {
            var dir = guest.node.getPosition().sub(this.node.getPosition())
            var len = dir.mag();
           if (guest.state == State.IDLE && len < 25) {
               this.state = State.IDLE;
           }
        }

        if(this.state == State.WALK && this.walk_time > this.walk_time_total){
            this.next_step ++;
            if(this.next_step >= this.road_data.length) {
                if(this.action == Action.LINE_UP) {
                    this.state = State.IDLE
                    this.action = Action.SELECT_SEAT
                } else if(this.action == Action.SELECT_SEAT) {
                    this.do_order()
                } else if(this.action == Action.LEAVE) {
                    this.node.removeFromParent()
                }
                

            }else{
                this.walk_to_next();
            }
        }
    },

    idle_update: function() {
        var guest = Gm.ui.getScript("MainView").getFrontGuest(this)
        if(guest) {
            var dir = guest.node.getPosition().sub(this.node.getPosition())
            var len = dir.mag();
           if (len > 25 && this.next_step < this.road_data.length) {
               this.state = State.WALK;
           }
        }else{
            if(this.next_step < this.road_data.length) {
                this.state = State.WALK;
            } 
        }
    },

    play_order_anim: function(){
        this.frame_anim.stop_anim();
        var dir = this.anim_dir == 3 ? 1 : 0
        this.frame_anim.sprite_frames = this.order_anim_set[dir].anim_frames;
        this.frame_anim.duration = this.order_anim_set[dir].anim_duration;
        this.anim.scaleX = this.order_anim_set[dir].scale_x;
 
        this.frame_anim.play_loop();
    },

    do_order: function(){
        this.state = State.ORDER
        this.action = Action.ORDER
        this.play_order_anim();
        this.set_order_bubble_visible(true);
    },

    set_order_bubble_visible: function(visible){
        this.bubble.node.active = visible;
    },

    order_bubble_onclick: function(){

        this.do_repase()
    },

    order_update: function(){
        
    },

    startRepaseCountdown: function(){
        this.scheduleOnce(()=>{
            this.do_leave()
        }, 5);
    },

    do_repase: function(){
        this.state = State.REPASE
        this.action = Action.REPASE
        this.play_repase_anim();
        this.startRepaseCountdown()
        this.set_order_bubble_visible(false)
    },

    play_repase_anim: function(){
        var dir = this.anim_dir == 3 ? 1 : 0
        this.frame_anim.stop_anim();
        this.frame_anim.sprite_frames = this.repase_anim_set[dir].anim_frames;
        this.frame_anim.duration = this.repase_anim_set[dir].anim_duration;
        this.anim.scaleX = this.repase_anim_set[dir].scale_x;
 
        this.frame_anim.play_loop();
    },

    repase_update: function(){

    },

    /**
     * 结账离开
     */
    do_leave: function(){
        this.state = State.WALK
        this.action = Action.LEAVE
        this.frame_anim.stop_anim();
        this.frame_anim.sprite_frames = this.walk_anim_set[this.anim_dir].anim_frames;
        this.frame_anim.duration = this.walk_anim_set[this.anim_dir].anim_duration;
        this.anim.scaleX = this.walk_anim_set[this.anim_dir].scale_x;
 
        this.frame_anim.play_loop();
        var road_name = "road_out_seat_" + this.seat
        var mainview = Gm.ui.getScript("MainView")
        var data = mainview.get_road_path()
        this.run_at_road(road_name, data[road_name])

        Gm.homeData.setSeatIdle(this.seat-1)
    },

    setState: function(state){
        this.state = State[state];
    },

    setAction: function(action){
        this.action = Action[action];
    },


    isSelectSeatAction: function(){
        return this.action == Action.SELECT_SEAT;
    },

    update (dt) {
        if(this.state == State.WALK) {
            this.walk_update(dt)
        }else if(this.state == State.IDLE) {
            this.idle_update(dt)
        }else if(this.state == State.ORDER) {
            this.order_update(dt)            
        }else if(this.state == State.REPASE) {
            this.repase_update(dt)
        }

    },
});
