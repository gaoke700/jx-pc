<template>
  <div class="my-header">
    <ul class="my-top-menu g-clearfix">
      <li class="fl">
        <a href="index.html"><i class="iconfont icon-jingxuan"></i></a>
      </li>
      <li class="fl">
        <a href="my-index.html">首页</a>
      </li>
      <li class="fl">
        <a href="my-user-info.html">账户设置<i class="iconfont icon-triangle"></i></a>
      </li>
      <!--<li class="fl">-->
        <!--<a href="login.html?login=true">消息</a>-->
      <!--</li>-->
      <li class="fr">
        <div class="my-top-search fr">
          <div class="search-box">
            <input type="text" placeholder="连衣裙 / 小白裙 / 长T恤 / 韩版背包 / 风衣 / 紧身裤">
            <i class="iconfont icon-search-thin"></i>
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  @import "../../styles/variables";
  .my-header {
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    padding: 0 calc(50% - 600px);
    background-color: $g-highlight;
    .my-top-menu {
      width: 100%;
      height: 80px;
      overflow: hidden;
      li {
        margin-right: 50px;
        font-size: 16px;
        &:last-child {
          margin: 20px 0;
        }
        a {
          color: #ffffff;
        }
        .icon-jingxuan {
          font-size: 84px;
        }
        .icon-triangle {
          margin-left: 5px;
          font-size: 10px;
        }
        .my-top-search {
          width: 398px;
          height: 38px;
          font-size: 12px;
          .search-box {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            height: 100%;
            padding: 11px 14px;
            border: 1px solid #d0ced1;
            border-radius: 3px;
            background-color: #ffffff;
            input {
              position: absolute;
              top: 11px;
              width: 338px;
              height: 16px;
              border: 0;
            }
            i {
              display: block;
              width: 30px;
              height: 30px;
              position: absolute;
              font-size: 24px;
              right: 10px;
              top: -22px;
              color: #888888;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
