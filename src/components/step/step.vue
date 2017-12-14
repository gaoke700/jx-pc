<template>
  <div
    class="ui-step"
    :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]"
    :class="['is-' + $parent.direction]">
    <div
      class="ui-step__head"
      :class="['is-' + currentStatus, { 'is-text': !icon }]">
      <div
        class="ui-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction, { 'is-icon': icon }]">
        <i class="ui-step__line-inner" :style="lineStyle"></i>
      </div>

      <span class="ui-step__icon">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" :class="['icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          class="iconfont"
          :class="['icon-' + (currentStatus === 'success' ? 'success-thick' : 'failure')]">
        </i>
      </span>
    </div>
    <div
      class="ui-step__main"
      :style="{ marginLeft: mainOffset }">
      <div
        class="ui-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="ui-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UIStep',

    props: {
      title: String,
      icon: String,
      description: String,
      status: String,
    },

    data() {
      return {
        index: -1,
        lineStyle: {},
        mainOffset: 0,
        internalStatus: '',
      };
    },

    beforeCreate() {
      this.$parent.steps.push(this);
    },

    beforeDestroy() {
      const steps = this.$parent.steps;
      const index = steps.indexOf(this);
      if (index >= 0) {
        steps.splice(index, 1);
      }
    },

    computed: {
      currentStatus() {
        return this.status || this.internalStatus;
      },
      isLast() {
        const parent = this.$parent;
        return parent.steps[parent.steps.length - 1] === this;
      },
      style() {
        const parent = this.$parent;
        const isCenter = parent.center;
        const len = parent.steps.length;

        if (isCenter && this.isLast) {
          return {};
        }

        let space = '';
        if (typeof parent.space === 'number') {
          space = `${parent.space}px`;
        } else if (parent.space) {
          space = parent.space;
        } else {
          space = `${100 / (isCenter ? len - 1 : len)}%`;
        }

        if (parent.direction === 'horizontal') {
          return { width: space };
        } else if (!this.isLast) {
          return { height: space };
        }

        return {};
      },
    },

    methods: {
      updateStatus(val) {
        const prevChild = this.$parent.$children[this.index - 1];

        if (val > this.index) {
          this.internalStatus = this.$parent.finishStatus;
        } else if (val === this.index) {
          this.internalStatus = this.$parent.processStatus;
        } else {
          this.internalStatus = 'wait';
        }

        if (prevChild) prevChild.calcProgress(this.internalStatus);
      },

      calcProgress(status) {
        let step = 100;
        const style = {};

        style.transitionDelay = `${150 * this.index}ms`;
        if (status === this.$parent.processStatus) {
          step = 50;
        } else if (status === 'wait') {
          step = 0;
          style.transitionDelay = `${(-150 * this.index)}ms`;
        }

        style.borderWidth = step ? '1px' : 0;
        if (this.$parent.direction === 'vertical') {
          style.height = `${step}%`;
        } else {
          style.width = `${step}%`;
        }

        this.lineStyle = style;
      },
    },

    mounted() {
      const parent = this.$parent;

      if (parent.direction === 'horizontal') {
        if (parent.alignCenter) {
          this.mainOffset = `${-(this.$refs.title.getBoundingClientRect().width / 2) + 16}px`;
        }
      }

      const unwatch = this.$watch('index', () => {
        this.$watch('$parent.active', this.updateStatus, { immediate: true });
        unwatch();
      });
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .ui-step {
    position: relative;
    vertical-align: top;
  }

  .ui-step:last-child .ui-step__main {
    padding-right: 0;
  }

  .ui-step.is-vertical .ui-step__head,
  .ui-step.is-vertical .ui-step__main {
    display: inline-block;
  }

  .ui-step.is-vertical .ui-step__main {
    padding-left: 10px;
  }

  .ui-step.is-horizontal,
  .ui-step__line {
    display: inline-block;
  }

  .ui-step__line {
    position: absolute;
    background-color: #bbbbbb;
    border-color: inherit;
  }

  .ui-step__line.is-vertical {
    top: 32px;
    bottom: 0;
    left: 15px;
    box-sizing: border-box;
    width: 2px;
  }

  .ui-step__line.is-horizontal {
    top: 13px;
    right: 8px;
    left: 32px;
    height: 2px;
  }

  .ui-step__line.is-icon.is-horizontal {
    right: 4px;
  }

  .ui-step__line-inner {
    box-sizing: border-box;
    display: block;
    width: 0;
    height: 0;
    border-color: inherit;
    border-style: solid;
    border-width: 1px;
    transition: all 0.15s;
  }

  .ui-step__icon {
    display: block;
    line-height: 20px;
  }

  .ui-step__icon > * {
    line-height: inherit;
    vertical-align: middle;
  }

  .ui-step__head {
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    vertical-align: top;
    background-color: transparent;
    border-radius: 50%;
    transition: all 0.15s;
  }

  .ui-step__head.is-finish {
    color: #20a0ff;
    border-color: #20a0ff;
  }

  .ui-step__head.is-error {
    color: #ff4949;
    border-color: #ff4949;
  }

  .ui-step__head.is-success {
    color: $g-highlight;
    background-color: $g-highlight;
  }

  .ui-step__head.is-process,
  .ui-step__head.is-wait {
    color: #bbbbbb;
    border-color: #bbbbbb;
  }

  .ui-step__head.is-text {
    font-size: 14px;
    border-style: solid;
    border-width: 2px;
  }

  .ui-step__head.is-text.is-finish {
    color: white;
    background-color: $g-highlight;
    border-color: $g-highlight;
  }

  .ui-step__head.is-text.is-error {
    color: white;
    background-color: $g-highlight;
    border-color: $g-highlight;
  }

  .ui-step__head.is-text.is-success {
    color: white;
    background-color: $g-highlight;
    border-color: $g-highlight;
  }

  .ui-step__head.is-text.is-wait {
    color: white;
    background-color: #bbbbbb;
    border-color: #bbbbbb;
  }

  .ui-step__head.is-text.is-process {
    color: white;
    background-color: #bbbbbb;
    border-color: #bbbbbb;
  }

  .ui-step__main {
    padding-right: 10px;
    text-align: left;
    white-space: normal;
  }

  .ui-step__title {
    display: inline-block;
    font-size: 14px;
    line-height: 32px;
  }

  .ui-step__title.is-finish {
    color: $g-highlight;
  }

  .ui-step__title.is-error {
    color: $g-highlight;
  }

  .ui-step__title.is-success {
    color: $g-highlight;
  }

  .ui-step__title.is-wait {
    color: #bbbbbb;
  }

  .ui-step__title.is-process {
    color: #bbbbbb;
  }

  .ui-step__description {
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }

  .ui-step__description.is-finish {
    color: $g-highlight;
  }

  .ui-step__description.is-error {
    color: #ff4949;
  }

  .ui-step__description.is-success {
    color: $g-highlight;
  }

  .ui-step__description.is-wait {
    color: #bbbbbb;
  }

  .ui-step__description.is-process {
    color: #bbbbbb;
  }
</style>
