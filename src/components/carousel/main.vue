<template>
  <div
    class="ui-carousel"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave">
    <div
      class="ui-carousel__container"
      :style="{ height: height }">
      <transition name="carousel-arrow-left">
        <button
          v-if="arrow !== 'never'"
          v-show="arrow === 'always' || hover"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
          class="ui-carousel__arrow ui-carousel__arrow--left">
          <slot name="icon-left"></slot>
        </button>
      </transition>
      <transition name="carousel-arrow-right">
        <button
          v-if="arrow !== 'never'"
          v-show="arrow === 'always' || hover"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
          class="ui-carousel__arrow ui-carousel__arrow--right">
          <slot name="icon-right"></slot>
        </button>
      </transition>
    </div>
    <slot></slot>
    <ul
      class="ui-carousel__indicators"
      v-if="indicatorPosition !== 'none'"
      :class="{ 'ui-carousel__indicators--labels': hasLabel, 'ui-carousel__indicators--outside': indicatorPosition === 'outside' }">
      <li
        v-for="(item, index) in items"
        class="ui-carousel__indicator"
        :class="{ 'is-active': index === activeIndex }"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)">
        <button class="ui-carousel__button"><span v-if="hasLabel">{{ item.label }}</span></button>
      </li>
    </ul>
  </div>
</template>

<script>
  import throttle from 'throttle-debounce/throttle';
  import { addResizeListener, removeResizeListener } from '@/utils/resizeEvent';

  export default {
    name: 'Carousel',

    props: {
      initialIndex: {
        type: Number,
        default: 0,
      },
      height: String,
      trigger: {
        type: String,
        default: 'hover',
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      interval: {
        type: Number,
        default: 5000,
      },
      indicatorPosition: String,
      indicator: {
        type: Boolean,
        default: true,
      },
      arrow: {
        type: String,
        default: 'hover',
      },
    },

    data() {
      return {
        items: [],
        activeIndex: -1,
        containerWidth: 0,
        timer: null,
        hover: false,
      };
    },

    computed: {
      hasLabel() {
        return this.items.some(item => item.label.toString().length > 0);
      },
    },

    watch: {
      items(val) {
        if (val.length > 0) this.setActiveItem(this.initialIndex);
      },

      activeIndex(val, oldVal) {
        this.resetItemPosition();
        this.$emit('change', val, oldVal);
      },

      autoplay(val) {
        val ? this.startTimer() : this.pauseTimer();
      },
    },

    methods: {
      handleMouseEnter() {
        this.hover = true;
        this.pauseTimer();
      },

      handleMouseLeave() {
        this.hover = false;
        this.startTimer();
      },

      itemInStage(item, index) {
        const length = this.items.length;
        if (index === length - 1 && item.inStage && this.items[0].active ||
          (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
          return 'left';
        } else if (index === 0 && item.inStage && this.items[length - 1].active ||
          (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
          return 'right';
        }
        return false;
      },

      handleButtonEnter(arrow) {
        this.items.forEach((item, index) => {
          if (arrow === this.itemInStage(item, index)) {
            item.hover = true;
          }
        });
      },

      handleButtonLeave() {
        this.items.forEach((item) => {
          item.hover = false;
        });
      },

      updateItems() {
        this.items = this.$children.filter(child => child.$options.name === 'CarouselItem');
      },

      resetItemPosition() {
        this.items.forEach((item, index) => {
          item.translateItem(index, this.activeIndex);
        });
      },

      playSlides() {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        } else {
          this.activeIndex = 0;
        }
      },

      pauseTimer() {
        clearInterval(this.timer);
      },

      startTimer() {
        if (this.interval <= 0 || !this.autoplay) return;
        this.timer = setInterval(this.playSlides, this.interval);
      },

      setActiveItem(index) {
        if (typeof index === 'string') {
          const filteredItems = this.items.filter(item => item.name === index);
          if (filteredItems.length > 0) {
            index = this.items.indexOf(filteredItems[0]);
          }
        }
        index = Number(index);
        if (isNaN(index) || index !== Math.floor(index)) {
          process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Carousel]index must be an integer.');
          return;
        }
        const length = this.items.length;
        if (index < 0) {
          this.activeIndex = length - 1;
        } else if (index >= length) {
          this.activeIndex = 0;
        } else {
          this.activeIndex = index;
        }
      },

      prev() {
        this.setActiveItem(this.activeIndex - 1);
      },

      next() {
        this.setActiveItem(this.activeIndex + 1);
      },

      handleIndicatorClick(index) {
        this.activeIndex = index;
      },

      handleIndicatorHover(index) {
        if (this.trigger === 'hover' && index !== this.activeIndex) {
          this.activeIndex = index;
        }
      },
    },

    created() {
      this.throttledArrowClick = throttle(300, true, (index) => {
        this.setActiveItem(index);
      });
      this.throttledIndicatorHover = throttle(300, (index) => {
        this.handleIndicatorHover(index);
      });
    },

    mounted() {
      this.updateItems();
      this.$nextTick(() => {
        addResizeListener(this.$el, this.resetItemPosition);
        if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
          this.activeIndex = this.initialIndex;
        }
        this.startTimer();
      });
    },

    beforeDestroy() {
      if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    },
  };
</script>

<style lang="scss">
  .ui-carousel {
    position: relative;
    overflow-x: hidden;
  }

  .ui-carousel__container {
    position: relative;
    height: 300px;
  }

  .ui-carousel__arrow {
    position: absolute;
    top: 50%;
    z-index: 10;
    width: 36px;
    height: 36px;
    padding: 0;
    margin: 0;
    font-size: 12px;
    color: white;
    text-align: center;
    cursor: pointer;
    background-color: rgba(31, 45, 61, 0.11);
    border: none;
    border-radius: 50%;
    outline: none;
    transition: 0.3s;
    transform: translateY(-50%);
  }

  .ui-carousel__arrow--left,
  .ui-carousel__arrow--right {
    left: 16px;
  }

  .ui-carousel__indicators {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    padding: 0;
    margin: 0;
    list-style: none;
    transform: translateX(-50%);
  }

  .ui-carousel__indicator {
    display: inline-block;
    padding: 12px 4px;
    cursor: pointer;
    background-color: transparent;

    &.is-active .ui-carousel__button {
      background-color: white;
      opacity: 1;
    }
  }

  .ui-carousel__button {
    display: block;
    width: 30px;
    height: 10px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid white;
    outline: none;
    opacity: 0.48;
    transition: 0.3s;
  }

  .carousel-arrow-left-enter,
  .carousel-arrow-left-leave-active {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }

  .carousel-arrow-right-enter,
  .carousel-arrow-right-leave-active {
    opacity: 0;
    transform: translateY(-50%) translateX(10px);
  }
</style>
