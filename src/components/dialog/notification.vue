<template>
  <div class="ui-notification" v-if="myShow" :style="setStyle">
      <div class="content" v-html="myOptions.content"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        timers: [],
        myOptions: {
          textColor: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          time: '3000',
          autoClose: true,
        },
        myShow: this.show,
      };
    },
    props: {
      options: {
        type: Object,
        default: {},
      },
      show: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      setStyle() {
        return {
          color: this.myOptions.textColor,
          background: this.myOptions.backgroundColor,
        };
      },
    },
    methods: {
      countdown() {
        if (this.myOptions.autoClose) {
          const t = setTimeout(() => {
            this.close();
          }, this.myOptions.time || 3000);
          this.timers.push(t);
        }
      },
      close() {
        this.$emit('close');
        // this.myOptions = {};
      },
    },
    watch: {
      show(val) {
        this.myShow = val;
        if (this.myShow) {
          this.myOptions = Object.assign(this.myOptions, this.options);
          this.timers.forEach((timer) => {
            window.clearTimeout(timer);
          });
          this.timers = [];
          this.countdown();
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .ui-notification {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 555;
    min-width: 100px;
    max-width: 500px;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    -webkit-transform: translateX(-50%) translateY(-50%);
  }
</style>
