```js
// 1. 在Vue实例上通过$message使用 
this.$message('提示消息');

this.$message({
  message: '提示消息',
  showClose: true,
});

// 2. 直接引入使用
import Message from 'components/message';
Message('提示消息');
Message({
  message: '提示消息',
  showClose: true,
});

// 3. 关闭
// 调用 Message 或 this.$message 会返回当前 Message 的实例。
// 如果需要手动关闭实例，可以调用它的 close 方法
const msg = this.$message('提示消息');
msg.close();

const msg2 = Message('提示消息');
msg2.close();

// 4. 关闭所有
Message.closeAll();

// 5. 关闭事件
this.$message({
  message: '提示消息',
  onClose() {
      console.log('closed');
    }
});

// 6. 计时器
// 消息提示框默认会自动关闭，等待时间为3s；
// 若传入0，表示不会自动关闭
this.$message({
  message: '提示消息',
  duration: 0,
  showClose: false,
});
```
