<template>
  <div class="my-menu-wrap">
    <dl v-for="menu in menuList">
      <dl>
        <dt>{{ menu.title }}</dt>
        <dd v-for="item in menu.children" :class="{ active: currentUrl === item.url }">
          <a :href="item.url">{{ item.title }}</a>
        </dd>
      </dl>
    </dl>
  </div>
</template>

<script>
  export default {
    props: {
      // 当前激活的菜单项
      currentUrl: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        menuList: [
          {
            title: '订单中心',
            children: [
              {
                title: '我的订单',
                url: 'my-order.html',
              },
              {
                title: '退款/退货',
                url: 'my-refund.html',
              },
            ],
          },
          {
            title: '关注中心',
            children: [
              {
                title: '收藏的商品',
                url: 'my-collect.html',
              },
            ],
          },
          {
            title: '资产中心',
            children: [
              {
                title: '会员卡',
                url: 'my-member-card.html',
              },
              {
                title: '优惠券',
                url: 'my-coupons.html',
              },
              /* {
                title: '积分',
                url: 'my-point.html',
              }, */
            ],
          },
          {
            title: '设置',
            children: [
              {
                title: '个人信息',
                url: 'my-user-info.html',
              },
              {
                title: '收货地址',
                url: 'my-address.html',
              },
            ],
          },
        ],
      };
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";
  .my-menu-wrap {
    float: left;
    width: 112px;
    font-size: 14px;
    line-height: 28px;

    dt {
      color: #333333;
      font-weight: bold;
    }

    dd {
      a {
        color: #888888;
      }

      &.active a {
        font-weight: bold;
        color: $g-highlight;
      }
    }

    dl {
      margin-bottom: 40px;
    }
  }
</style>
