<template>
  <div class="ui-input-number">
    <span class="reduce" v-repeat-click="decrease" :class="{'is-disabled': minDisabled}">-</span>
    <el-input
      :value="currentValue"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @input="debounceHandleInput"
      :disabled="disabled"
      :size="size"
      :max="max"
      :min="min"
      ref="input"
    ></el-input>
    <span class="add" v-repeat-click="increase" :class="{'is-disabled': maxDisabled}">+</span>
  </div>
</template>
<script>
  import ElInput from 'element-ui/packages/input';
  import { once, on } from 'element-ui/src/utils/dom';
  import debounce from 'throttle-debounce/debounce';

  export default {
    name: 'UIInputNumber',
    directives: {
      repeatClick: {
        bind(el, binding, vnode) {
          let interval = null;
          let startTime;
          const handler = () => vnode.context[binding.expression].apply();
          const clear = () => {
            if (new Date() - startTime < 100) {
              handler();
            }
            clearInterval(interval);
            interval = null;
          };

          on(el, 'mousedown', () => {
            startTime = new Date();
            once(document, 'mouseup', clear);
            clearInterval(interval);
            interval = setInterval(handler, 100);
          });
        },
      },
    },
    components: {
      ElInput,
    },
    props: {
      step: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: Infinity,
      },
      min: {
        type: Number,
        default: -Infinity,
      },
      value: {
        default: 0,
      },
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true,
      },
      debounce: {
        type: Number,
        default: 300,
      },
    },
    data() {
      return {
        currentValue: 0,
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(value) {
          let newVal = Number(value);
          if (isNaN(newVal)) return;
          if (newVal >= this.max) newVal = this.max;
          if (newVal <= this.min) newVal = this.min;
          this.currentValue = newVal;
          this.$emit('input', newVal);
        },
      },
    },
    computed: {
      minDisabled() {
        return this.decreaseInner(this.value, this.step) < this.min;
      },
      maxDisabled() {
        return this.increaseInner(this.value, this.step) > this.max;
      },
      precision() {
        const { value, step, getPrecision } = this;
        return Math.max(getPrecision(value), getPrecision(step));
      },
    },
    methods: {
      toPrecision(num, precision) {
        if (precision === undefined) precision = this.precision; // eslint-disable-line
        return parseFloat(parseFloat(Number(num).toFixed(precision)));
      },
      getPrecision(value) {
        const valueString = value.toString();
        const dotPosition = valueString.indexOf('.');
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      },
      increaseInner(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = 10 ** this.precision;

        return this.toPrecision((
          (precisionFactor * val) + (precisionFactor * step)) / precisionFactor);
      },
      decreaseInner(val, step) {
        if (typeof val !== 'number') return this.currentValue;

        const precisionFactor = 10 ** this.precision;

        return this.toPrecision((
          (precisionFactor * val) - (precisionFactor * step)) / precisionFactor);
      },
      increase() {
        if (this.disabled || this.maxDisabled) return;
        const value = this.value || 0;
        const newVal = this.increaseInner(value, this.step);
        if (newVal > this.max) return;
        this.setCurrentValue(newVal);
      },
      decrease() {
        if (this.disabled || this.minDisabled) return;
        const value = this.value || 0;
        const newVal = this.decreaseInner(value, this.step);
        if (newVal < this.min) return;
        this.setCurrentValue(newVal);
      },
      handleBlur() {
        this.$refs.input.setCurrentValue(this.currentValue);
      },
      setCurrentValue(newVal) {
        const oldVal = this.currentValue;
        if (newVal >= this.max) newVal = this.max; // eslint-disable-line
        if (newVal <= this.min) newVal = this.min; // eslint-disable-line
        if (oldVal === newVal) {
          this.$refs.input.setCurrentValue(this.currentValue);
          return;
        }
        this.$emit('change', newVal, oldVal);
        this.$emit('input', newVal);
        this.currentValue = newVal;
      },
      handleInput(value) {
        if (value === '') {
          return;
        }
        const newVal = Number(value);
        if (!isNaN(newVal)) {
          this.setCurrentValue(newVal);
        } else {
          this.$refs.input.setCurrentValue(this.currentValue);
        }
      },
    },
    created() {
      this.debounceHandleInput = debounce(this.debounce, (value) => {
        this.handleInput(value);
      });
    },
  };
</script>

<style lang="scss">
  $input-height: 28px;

  .ui-input-number {
    height: 28px;
    margin-top: 5px;
    font-size: 0;
    line-height: $input-height;
    border: 1px solid #e3e3e3;

    .el-input {
      width: 65px;
      height: $input-height;

      .el-input__inner {
        height: 28px;
        text-align: center;
        border-color: #e3e3e3;
        border-top: 0;
        border-bottom: 0;
      }
    }

    span {
      display: inline-block;
      width: $input-height;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      user-select: none;
      background: #eeeeee;
    }
  }
</style>
