// 手机端和pc端地址切换
import Utils from './utils';

export function switchMobileUrl() { // eslint-disable-line
  const host = Utils.getHost();
  let pathName = window.location.pathname;
  const urlObj = Utils.getUrlObj();
  let isFind = false;
  const distributor = window.location.href.match(/\/d\d+/ig);
  [
    // 评价列表(未评价)
    {
      key: ['/my-comment.html'],
      val: `?ctl=member&act=order_info&ajax=1&order_id=${urlObj.order_id}`,
    },
    // 评价列表(已评价)
    {
      key: ['/my-comment-detail.html'],
      val: `?ctl=member&act=order_info&status=show&order_id=${urlObj.order_id}`,
    },
    // 详情页
    {
      key: ['/detail.html'],
      val: `/product-${urlObj.goods_id}.html`,
    },
    // 购物车
    {
      key: ['/cart.html', '/order.html'],
      val: '/?carts.html',
    },
    // 商品分类页
    {
      key: ['/list.html'],
      val: '/?default-gallery.html',
    },
    // 支付和支付完成页面
    {
      key: ['/pay.html', '/pay-over.html'],
      val: '/?member-myOrders.html',
    },
    // 我的订单
    {
      key: ['/my-order.html'],
      val: '/?member-myOrders.html',
    },
    // 订单详情
    {
      key: ['/my-order-detail.html', '/my-order-canceled.html'],
      val: `/?member-${urlObj.order_id || ''}-orderdetail.html`,
    },
    // 退款退货
    {
      key: ['/my-refund.html'],
      val: '/?refund-refunds.html',
    },
    // 退款详情
    {
      key: ['/my-refund-detail.html'],
      val: `/?refund-${urlObj.aftersales_id || ''}-refundInfo.html`,
    },
    // 收藏的商品
    {
      key: ['/my-collect.html'],
      val: '/?member-myFavorites.html',
    },
    // 会员卡
    {
      key: ['/my-member-card.html'],
      val: '/?level.html',
    },
    // 优惠券
    {
      key: ['/my-coupons.html'],
      val: '/?coupon-coupon.html',
    },
    // 个人信息
    {
      key: ['/my-user-info.html'],
      val: '/?member-editMember.html',
    },
    // 收货地址
    {
      key: ['/my-address.html'],
      val: '/?ctl=member&act=index',
    },
  ].forEach((v) => {
    v.key.forEach((v2) => {
      if (pathName.indexOf(v2) > -1) {
        pathName = v.val;
        if (distributor) {
          pathName = distributor[0] + v.val;
        }
        isFind = true;
      }
    });
  });
  if (!isFind) {
    pathName = '/index.html';
  }
  return (host + pathName);
}
