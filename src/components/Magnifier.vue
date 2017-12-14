<template>
  <div class="magnifier-wrapper" ref="wrapper" v-if="items.length">
    <div class="magnifier-thumb-wrapper" ref="thumbWrapper" @mousemove="mouseMove" @mouseout="mouseOut">
      <img ref="magnifierImg" :src="items[activeIndex][imageKeys[1]]">
      <div class="magnifier-lens" ref="lens" v-show="showLens" :style="lensStyle" @click="bigViewerClick($event)"></div>
      <div class="big-viewer" @click="bigViewerClick" ref="bigViewer">
        <i class="iconfont icon-search"></i>
      </div>
      <el-dialog customClass="big-viewer-dialog" :visible.sync="showBigViewer">
        <img :src="items[activeIndex][imageKeys[2]]">
      </el-dialog>
    </div>
    <div class="img-slider">
      <div class="prev" @click="prevSlider" :class="{active: switchType === 'top'}">
        <i class="iconfont icon-angle-up"></i>
      </div>
      <div class="next" @click="nextSlider" :class="{active: switchType === 'bottom'}">
        <i class="iconfont icon-angle-down"></i>
      </div>
      <div class="spec-items">
        <ul class="slider-wrapper" :style="sliderStyle">
          <li v-for="(item, index) in items"
              :class="{active: activeIndex === index}">
            <img :src="item[imageKeys[0]]" @mouseover="sliderHover(index)">
          </li>
        </ul>
      </div>
    </div>
    <div class="magnifier-preview" :style="previewStyle" v-show="showLens">
      <img ref="bigImg" :src="items[activeIndex][imageKeys[2]]">
    </div>
  </div>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';

  // TODO：THUMB_EDGE，BUNCH_COUNT 参数改为通过prop传入
  const THUMB_EDGE = 5;
  const BUNCH_COUNT = 4;
  const SLIDER_STEP = 90;

  export default {
    props: {
      lensWidth: {
        type: Number,
        default: 300,
      },
      lensHeight: {
        type: Number,
        default: 300,
      },
      items: {
        type: Array,
        default: [],
      },
      imageKeys: {
        type: Array,
        default() {
          return ['small', 'thumbnail', 'big'];
        },
      },
    },
    data() {
      return {
        showLens: false,
        previewStyle: {},
        sliderTop: 0,
        switchType: '',
        activeIndex: 0,
        showBigViewer: false,
      };
    },

    computed: {
      lensStyle() {
        return {
          width: `${this.lensWidth}px`,
          height: `${this.lensHeight}px`,
        };
      },
      sliderStyle() {
        return {
          top: `${-this.sliderTop}px`,
        };
      },
    },

    methods: {
      mouseMove(event) {
        if (this.showBigViewer) return;

        this.showLens = true;
        const { clientX, clientY } = event;

        // 放大镜中心点坐标（相对于缩略图）
        let lensLeft = clientX - this.thumbLeft - (this.$lens.clientWidth / 2);
        let lensTop = clientY - this.thumbTop - (this.$lens.clientHeight / 2);

        // 左右是否出界
        if (lensLeft < 0) {
          lensLeft = 0;
        } else if (lensLeft > this.$thumbWrapper.offsetWidth - this.lensWidth - THUMB_EDGE) {
          lensLeft = this.$thumbWrapper.offsetWidth - this.lensWidth;
        }

        // 上下是否出界
        if (lensTop < 0) {
          lensTop = 0;
        } else if (lensTop > this.$thumbWrapper.offsetHeight - this.lensHeight - THUMB_EDGE) {
          lensTop = this.$thumbWrapper.offsetHeight - this.lensHeight;
        }

        this.$lens.style.left = `${lensLeft}px`;
        this.$lens.style.top = `${lensTop}px`;

        // 大图移动距离 / lens移动的距离 = 大图的宽度 / 小图的宽度（纵向距离同理）
        this.$bigImg.style.left = `${-(lensLeft / this.$thumbWrapper.offsetWidth) * this.$bigImg.offsetWidth}px`;
        this.$bigImg.style.top = `${-(lensTop / this.$thumbWrapper.offsetHeight) * this.$bigImg.offsetHeight}px`;
      },
      mouseOut() {
        if (this.showBigViewer) return;

        this.showLens = false;
      },
      getThumbTop() {
        this.$nextTick(() => {
          if (this.$refs.thumbWrapper) {
            this.thumbTop = this.$refs.thumbWrapper.getBoundingClientRect().top;
          }
        });
      },
      prevSlider() {
        if (this.activeIndex <= 0 || this.items.length <= BUNCH_COUNT) {
          return;
        }

        // 当图片条到达顶部时，修复鼠标移上非第一张图引起的错位问题
        if (this.sliderTop === 0) {
          return;
        }

        this.activeIndex -= 1;
        if (this.activeIndex < BUNCH_COUNT) {
          this.sliderTop -= SLIDER_STEP;
        }

        this.switchType = 'top';
      },
      nextSlider() {
        if (this.activeIndex >= this.items.length - 1 || this.items.length <= BUNCH_COUNT) {
          return;
        }

        // 当图片条到达底部时，修复鼠标移上非最后一张图引起的错位问题
        if (this.items.length - (this.sliderTop / SLIDER_STEP) === BUNCH_COUNT) {
          return;
        }

        this.activeIndex += 1;
        if (this.activeIndex >= BUNCH_COUNT) {
          this.sliderTop += SLIDER_STEP;
        }

        this.switchType = 'bottom';
      },
      sliderHover(index) {
        this.switchType = '';
        this.activeIndex = index;
      },
      bigViewerClick({ clientX, clientY }) {
        if (!this.$refs.bigViewer) return;
        const { left, top } = this.$refs.bigViewer.getBoundingClientRect();
        if (clientX - left > 0 && clientY - top > 0) {
          this.showBigViewer = true;
          this.showLens = false;
        }
      },
    },

    mounted() {
      const { lens, thumbWrapper, bigImg } = this.$refs;
      const { left, top } = thumbWrapper.getBoundingClientRect();

      this.$lens = lens;
      this.$thumbWrapper = thumbWrapper;
      this.$bigImg = bigImg;

      this.thumbLeft = left;
      this.thumbTop = top;

      window.addEventListener('scroll', throttle(500, this.getThumbTop), false);
    },

    destroyed() {
      window.removeEventListener('scroll', this.getThumbTop);
    },
  };
</script>

<style lang="scss">
  @import "../styles/variables";

  .magnifier-thumb-wrapper {
    position: relative;
    top: 0;
    left: 0;
    display: inline-block;
    width: 420px;
    height: 420px;

    > img {
      width: 100%;
      height: 100%;
    }

    .big-viewer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 40px;
      height: 40px;
      // z-index: 1001;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.2);
      cursor: pointer;

      .icon-search {
        width: 100%;
        height: 100%;
        font-size: 26px;
        color: white;
      }
    }

    .big-viewer-dialog {
      width: 960px;
      text-align: center;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }

  .magnifier-lens {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    overflow: hidden;
    cursor: move;
    background: url('~assets/images/common/lens-bg.png');
  }

  .magnifier-loader-text {
    margin-top: 10px;
    font: 13px Arial;
  }

  .magnifier-large {
    position: absolute;
    z-index: 100;
  }

  .magnifier-preview {
    position: absolute;
    top: 0;
    left: 510px;
    z-index: 1000;
    display: block;
    width: 540px;
    height: 540px;
    padding: 0;
    overflow: hidden;
    background-color: transparent;

    img {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .img-slider {
    position: absolute;
    display: inline-block;
    width: 90px;
    height: 420px;
    background-color: white;

    .spec-items {
      position: relative;
      width: 100%;
      height: 370px;
      overflow: hidden;
    }

    .slider-wrapper {
      position: absolute;
      padding-left: 10px;

      li {
        width: 80px;
        height: 80px;
        padding-top: 10px;
        cursor: pointer;

        &.active {
          img {
            box-sizing: border-box;
            border: 3px solid $g-highlight;
          }
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .prev,
    .next {
      z-index: 5;
      width: 100%;
      height: 25px;
      color: #e5e5e5;
      text-align: center;
      cursor: pointer;

      &.active i {
        color: $g-highlight;
      }

      i {
        font-size: 38px;
        line-height: 25px;
      }
    }

    .next {
      position: absolute;
      bottom: 0;
    }
  }
</style>
