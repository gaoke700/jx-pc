<template>
  <div class="tree-item ">
    <div class="dot pr pr10 " v-if="String(info.is_leaf) === 'true'">
      <span class="iconfont icon-tree-minus " @click="doExpand(3.1415926)"></span>
      <div class="text fb" :class="{ 'active': info.id == activeId }" @click="refreshList(info.id)">{{info.text}}</div>
    </div>
    <div class="pr10" v-else>
      <div class="h30 dot pr">
        <span class="iconfont " @click="doExpand(3.1415926)"
              :class="(String(info.expand) === 'false') ? ' icon-tree-plus' : ' icon-tree-minus' "></span>
        <div class="text fb" :class="{ 'active': info.id == activeId }" @click="refreshList(info.id)">{{info.text}}
        </div>
      </div>
      <div :class="(String(info.expand) === 'false') ? 'none' : '' ">
        <div class="border-top pl20 " v-for="(second,item) in info.child" v-if="String(second.is_leaf)=='false'">
          <div class="dot pr">
            <span class="iconfont " @click="doExpand(item)"
                  :class="(String(second.expand) === 'false')? ' icon-tree-plus':' icon-tree-minus' ">
            </span>
            <div style="display: none;" v-if="(second.id == activeId) ? defaultExpand(1) : false"></div>
            <div class="text" :class="{ 'active': second.id == activeId }" @click="refreshList(second.id)">{{second.text}}</div>
          </div>
          <div class="pl10" :class="{'none': String(second.expand) === 'false' }">
            <div class="text" v-for="secondChildren in second.child"
                 :class="{ 'active': secondChildren.id == activeId }" @click="refreshList(secondChildren.id)">
              {{secondChildren.text}}
              <div style="display: none;" v-if="(secondChildren.id == activeId) ? defaultExpand(item) : false"></div>
            </div>
          </div>
        </div>
        <div class="dot border-top pl20 pr" v-else>
          <span class="iconfont icon-tree-minus"></span>
          <div style="display: none;" v-if="(second.id == activeId) ? defaultExpand(1) : false"></div>
          <div class="text" :class="{ 'active': second.id == activeId }" @click="refreshList(second.id)">
            {{second.text}}
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    props: {
      info: {
        type: Object,
        default() {
          return {
            text: '大裙子1',
            id: '112',
            expand: false,
            is_leaf: false,
            child: [
              {
                text: '大麻花裙子',
                id: '112',
                is_leaf: false,
                expand: false,
                child: [
                  {
                    text: '大裙子1',
                    id: '112',
                    expand: false,
                    is_leaf: true,
                  },
                  {
                    text: '大裙子1',
                    id: '112',
                    expand: false,
                    is_leaf: true,
                  },
                ],
              },
              {
                text: '大裙子1',
                id: '112',
                expand: false,
                is_leaf: true,
              },
            ],
          };
        },
      },
      isJump: {
        type: Boolean,
        default: false,
      },
      activeId: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      defaultExpand(item) {
        if (item === 1) {
          this.info.expand = 'true';
        } else {
          this.info.child[item].expand = 'true';
        }
      },
      doExpand(item) {
        if (item === 3.1415926) {
          this.info.expand = (String(this.info.expand) === 'false') ? 'true' : 'false';
        } else {
          this.info.child[item].expand = (String(this.info.child[item].expand) === 'false') ? 'true' : 'false';
        }
      },
      refreshList(v) {
        if (this.isJump) {
          location.href = `list.html?cat_id=${v}`;
        } else {
          this.$emit('goCatList', v);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/theme";
  @import "../../styles/variables";

  .tree-item {
    border-top: 1px solid #e8e8e8;

    .dot {
      @include ellipsis2(1, 30px);
    }

    .active {
      color: $g-highlight;
    }

    .iconfont {
      cursor: pointer;
      position: absolute;
      font-size: 12px;
      padding: 0 10px;
    }

    .text {
      padding-left: 32px;
      cursor: pointer;
      @include ellipsis2(1, 30px);

      &:hover {
        color: $g-highlight;
      }
    }
  }
</style>
