<template>
  <img :ref="icon.sequence" :src="icon.src" :style="{'position': 'absolute', 'padding': '3px',left: icon._left + 'px',top: icon._top + 'px','z-index': 999}" @mouseup="mouseup" @mousedown="mousedown" @click="click" @keydown="renderKeydown" v-drag  tabindex="0"/>
</template>

<script>
  export default {
    name: 'img-drag',
    data() {
      return {
        //-- TODO
      }
    },
    /**
     * 通道
     */
    props: {
      /** 图标 */
      icon: {
        type: Object,
        default: function() {
          return {
            src: require('@/assets/images/mapIcon/icon-n-light-control.png'),
            _left: 0,
            _top: 0
          }
        }
      },
      //-- TODO
    },
    /**
     * 监控
     */
    watch: {
      //-- TODO
    },
    created() {
      //-- TODO
    },
    /**
     * 方法
     */
    methods: {
      /**
       * move end
       */
      mouseup(e) {
        this.$emit('mouseup', e);
      },
      mousedown(e) {
        this.$el.focus()
        this.$emit('mousedown', e);
      },
      click(e) {
        this.$el.focus()
        this.$emit('click', e);
      },
      renderKeydown(e) {
        this.$emit('renderKeydown', e);
      }
    },
    /**
     * 自定义方法 
     */
    directives: {
      drag: {
        // 指令的定义
        inserted: function(el, binding) {
          el.onmousedown = function(e) {
            // 鼠标左键
            if(event.button === 0) {
              // 阻止默认事件
              e.preventDefault();
              // 取消事件冒泡
              e.stopPropagation()
              var disx = e.pageX - el.offsetLeft;
              var disy = e.pageY - el.offsetTop;
              document.onmousemove = function(e) {
                el.style.left = e.pageX - disx + 'px';
                el.style.top = e.pageY - disy + 'px';
              };
              document.onmouseup = function(e) {
                document.onmousemove = document.onmouseup = null;
              };
            }
          };
        },
      },
    },
    /**
     * 注销 
     */
    beforeDestroy() {}

  }
</script>

<style>


</style>