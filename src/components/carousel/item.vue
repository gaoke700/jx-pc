<template>
  <div
    v-show="ready"
    class="ui-carousel__item"
    :class="{
      'is-active': active,
      'is-in-stage': inStage,
      'is-hover': hover
    }"
    @click="handleItemClick"
    :style="{
      msTransform: `translateX(${ translate }px) scale(${ scale })`,
      webkitTransform: `translateX(${ translate }px) scale(${ scale })`,
      transform: `translateX(${ translate }px) scale(${ scale })`
    }">
    <slot></slot>
  </div>
</template>

<script>
  const CARD_SCALE = 0.83;

  export default {
    name: 'CarouselItem',

    props: {
      name: String,
      label: {
        type: [String, Number],
        default: '',
      },
    },

    data() {
      return {
        hover: false,
        translate: 0,
        scale: 1,
        active: false,
        ready: false,
        inStage: false,
      };
    },

    methods: {
      processIndex(index, activeIndex, length) {
        if (activeIndex === 0 && index === length - 1) {
          return -1;
        } else if (activeIndex === length - 1 && index === 0) {
          return length;
        } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
          return length + 1;
        } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
          return -2;
        }
        return index;
      },

      calculateTranslate(index, activeIndex, parentWidth) {
        if (this.inStage) {
          return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
        } else if (index < activeIndex) {
          return -(1 + CARD_SCALE) * parentWidth / 4;
        }
        return (3 + CARD_SCALE) * parentWidth / 4;
      },

      translateItem(index, activeIndex) {
        const parentWidth = this.$parent.$el.offsetWidth;
        const length = this.$parent.items.length;
        if (index !== activeIndex && length > 2) {
          index = this.processIndex(index, activeIndex, length);
        }
        this.active = index === activeIndex;
        this.translate = parentWidth * (index - activeIndex);
        this.ready = true;
      },

      handleItemClick() {
      },
    },

    created() {
      this.$parent && this.$parent.updateItems();
    },

    destroyed() {
      this.$parent && this.$parent.updateItems();
    },
  };
</script>

<style lang="scss">
  .ui-carousel__item {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.4s ease-in-out;

    &.is-active {
      z-index: 2;
    }
  }
</style>
