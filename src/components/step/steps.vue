<template>
  <div
    class="ui-steps"
    :class="['is-' + direction, center ? 'is-center' : '']">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'UISteps',

    props: {
      space: [Number, String],
      active: Number,
      direction: {
        type: String,
        default: 'horizontal',
      },
      alignCenter: Boolean,
      center: Boolean,
      finishStatus: {
        type: String,
        default: 'finish',
      },
      processStatus: {
        type: String,
        default: 'process',
      },
    },

    data() {
      return {
        steps: [],
        stepOffset: 0,
      };
    },

    watch: {
      active(newVal, oldVal) {
        this.$emit('change', newVal, oldVal);
      },

      steps(steps) {
        steps.forEach((child, index) => {
          /* eslint-disable no-param-reassign */
          child.index = index;
        });
        if (this.center) {
          const len = steps.length;
          this.$nextTick(() => {
            this.stepOffset = steps[len - 1].$el.getBoundingClientRect().width / (len - 1);
          });
        }
      },
    },
  };
</script>

<style lang="scss">
  .ui-steps {
    font-size: 0;
  }

  .ui-steps > :last-child .ui-step__line {
    display: none;
  }

  .ui-steps.is-horizontal {
    white-space: nowrap;
  }

  .ui-steps.is-horizontal.is-center {
    text-align: center;
  }
</style>
