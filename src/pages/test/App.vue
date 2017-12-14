<template>
  <div class="page-test">
    <layout-all>
      <div slot="page-content">
        <div class="test-content">
          <h2>消息组件（notification）<span class="cred">(此组件废除，请用$message)</span></h2>
          <a class="btn" @click="notice(options)">闪2S</a>

          <h2>消息组件（$message 或 Message）</h2>

          <a class="btn" @click="sendMsg()">发消息提示</a>
          <a class="btn" @click="sendMsg1()">发消息提示（有close）</a>
          <a class="btn" @click="sendMsg2()">发消息提示2</a>
          <a class="btn" @click="changeMsg2()">改变消息提示2内容</a>
          <a class="btn" @click="closeMsg2()">关闭消息提示2</a>

          <h2>图片上传组件（upload）</h2>

          <upload :fileList="files" :params="{site_id: 84664}" @on-change="onChange"></upload>

          <h2>新增/编辑地址组件（AddressDialog）</h2>
          <a class="btn" href="javascript:;" @click="showAddress">添加地址</a>
        </div>
        <address-dialog :options="addressOptions" :visible="isShowAddress" @close="closeAddress"></address-dialog>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import Message from 'components/message';
  import LayoutAll from '../layout/LayoutAll';
  import AddressDialog from '../common/AddressDialog';

  export default {
    components: {
      LayoutAll,
      AddressDialog,
    },

    data() {
      return {
        addressOptions: {
          ship_name: '编辑的数据',
        },
        isShowAddress: false,
        options: {
          // backgroundColor: 'red',
          content: 'There is an optional countdown bar for the auto close mode.',
        },
        msg2: '',
        files: [{
          image_id: '8042',
          img_source: 'http://qmfx-s39210.s3.fy.shopex.cn/gpic/20170915/7df5c8c9720dc148b8697d5b41338fbb.png',
        }, {
          image_id: '8046',
          img_source: 'http://qmfx-s39210.s3.fy.shopex.cn/gpic/20170915/ec2510183b2d354b3e44b66b366eb2cb.png',
        }, {
          image_id: '8047',
          img_source: 'http://qmfx-s39210.s3.fy.shopex.cn/gpic/20170915/80ec097871aa8150da110b2426e1cc2e.png',
        }],
      };
    },

    computed: {},

    methods: {
      notice() {
        this.showNotification = true;
      },
      closeNotification() {
        this.showNotification = false;
      },
      sendMsg() {
        this.$message('3秒后自动关闭');
      },
      sendMsg1() {
        this.$message({
          message: '3秒后自动关闭',
          showClose: true,
        });
      },
      sendMsg2() {
        this.msg2 = Message({
          message: '不会自动关闭',
          duration: 0,
          showClose: false,
        });
      },
      closeMsg2() {
        if (this.msg2) {
          this.msg2.close();
        }
      },
      changeMsg2() {
        if (this.msg2) {
          this.msg2.message = '消息内容已更新';
        }
      },
      onChange(fileList) {
        console.log('文件列表已更新：', JSON.stringify(fileList), this.files);
      },
      showAddress() {
        this.isShowAddress = true;
      },
      closeAddress() {
        console.log('关闭');
        this.isShowAddress = false;
      },
    },
  };
</script>
<style scoped lang="scss">
  h2 {
    font-size: 1.5em;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: antiquewhite;
  }

  .test-content {
    padding: 50px 0;
    width: 1200px;
    margin: 0 auto;
  }

  .btn {
    vertical-align: top;
    display: inline-block;
    padding: 0 10px;
    line-height: 30px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 5px;
    background: #1f98ec;
    color: white;
  }

</style>
