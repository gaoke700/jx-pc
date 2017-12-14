import memberOrder from 'api/member-order';

// my-order & my-order-detail 共用
export default {
  methods: {
    getOrderStatus(item) {
      // 订单状态
      // pay_status 支付状态
      // 是否支付(0 未支付 1 已支付(或拼团成功) 2 处理中 3 部分付款 4 部分退款 5 全额退款, 6付款成功，拼团没完成, 7.拼团退款中, 8 拼团.等待退款
      // ship_status 物流状态 发货状态：0 未发货，1 已发货，2 部分发货，3 部分退货，4 已退货
      // refund_status 退款状态 0 正常, 1 待审核, 2 退款中, 3 退款完成
      // status 订单状态 active:活动, dead:死单, finish:完成, pending:暂停
      return {
        text: item.order_status,
        isPayWait: item.status === 'active' && (item.pay_status === '0' || item.pay_status === '3'), // 待付款
        isShipWait: (item.status === 'active' || item.status === 'pending') && (item.pay_status === '1' || item.pay_status === '6'), // 待发货
        isDelivery: (item.status === 'active' || item.status === 'pending') && (item.ship_status === '1' || item.ship_status === '3'), // 已发货
        isReceipt: (item.status === 'finished' || item.status === 'finish') && item.is_comment === '0', // 已收货
        isFinished: (item.status === 'finished' || item.status === 'finish') && item.is_comment === '1', // 已完成
        isCanceled: item.status === 'dead' || item.pay_status === '7' || item.pay_status === '8', // 已取消
        isClosed: item.is_close, // 已关闭
      };
    },
    // 订单确认收货/取消
    stateModify(params) {
      memberOrder.stateModify(params).then(() => {
        const isConfirm = params.action === 'confirm';
        this.$message(isConfirm ? '订单确认收货完成' : '订单取消完成');
        if (isConfirm) {
          // TODO 用回调重新请求数据代替
          window.location.reload();
        } else {
          window.location.href = 'my-order.html';
        }
      }).catch(res => this.$message(res.errMsg));
    },
    orderConfirm({ orderId, siteId, goods, memberId }) {
      console.log(goods);
      let msg = '您确定收到货了么？';

      // 1 待审核, 2 退款中
      if (goods && Array.isArray(goods) && goods.filter(i => (i.refund_status === '1' || i.refund_status === '2')).length) {
        msg = '当前订单存在退款商品，确认收货后，该退款申请将被撤销且无法再次申请。是否继续收货？';
      }

      this.$confirm(msg, '确认收货').then(() => {
        this.stateModify({
          order_id: orderId,
          site_id: siteId,
          member_id: memberId,
          action: 'confirm',
        });
      }).catch(() => {});
    },
    orderCancel(orderId, siteId, memberId) {
      this.$confirm('确认取消此订单?', '取消订单').then(() => {
        this.stateModify({
          order_id: orderId,
          site_id: siteId,
          member_id: memberId,
          action: 'cancel',
        });
      }).catch(() => {});
    },
  },
};
