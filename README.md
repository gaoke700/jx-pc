# jx-pc

> 京选PC端

## 构建

``` bash
# 安装依赖
npm install

# 本地开发（带热加载）
npm run dev

# 用于生产环境的压缩打包到dist目录
# 打包 [京选]
npm run build
# 打包 [微商城]
npm run buildshop

# 用于将dist目录的文件提交到master分支以供部署
# 同时提交 [京选] 及 [微商城] 打包文件
npm run deploy
# 提交 [京选] 打包文件
npm run deploy:360buy
# 提交 [微商] 城打包文件
npm run deploy:shop
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 基本目录结构

```
├── dist
│   ├── 360buy
│   └── shop
├── docs
├── src
│   ├── api
│   ├── assets
│   ├── common
│   ├── components
│   ├── filters
│   ├── pages
│   │   ├── common
│   │   ├── error
│   │   ├── index-dev.ejs
│   │   ├── index.ejs
│   │   ├── layout
│   │   ├── my-layout
│   │   └── test
│   ├── store
│   ├── styles
│   └── utils
└── static
```

- dist：通过构建打包源码并压缩生成的文件。分为两个项目（京选:360buy，微商城:shop），分别打包在各自对应的目录中
- docs：项目文档相关
- src：
  - api：接口，相关的接口请求放进一个文件中，文件名建议以接口模块为名
  - assets：资源（包括图片、字体等）
  - common：公共配置项
  - components：公共组件（业务逻辑无关）
  - filters：公共过滤器
  - pages
    - common：业务逻辑相关的组件
    - error：错误页面（404、500）
    - index-dev.ejs：作为各个单页面的模板页（开发时）
    - index.ejs：作为各个单页面的模板页（生产环境）
    - layout：页面布局
    - my-layout："我的"相关页面布局
    - test：组件demo展示（临时的，后期应迁移到独立目录）
  - store：vuex相关
  - styles：公共样式
  - utils：工具类
  - static: 静态资源（不会被Webpack处理）


> `assets` 目录与 `static` 目录作用的差别：assets 中的资源可能在构建过程中被内联/复制/重命名，所以它们基本上是源代码的一部分；static 目录下的文件并不会被 Webpack 处理：它们会直接被复制到最终目录（默认是dist/static）下。必须使用绝对路径引用这些文件。[更多][0]

**多页面实现**

`pages` 目录用于放置页面，会通过 webpack 打包成多个独立的页面，每个页面会引入共同的js部分（dist/assets/js/vendor），页面具体实现部分会各自引入对应的css及js（dist/static/{css|js}）。

规则是：每个单页面都是pages下的一个子目录，其中必须有app.js文件。

`pages/index.ejs` 作为作为个自单页面共用的模板页，webpack打包内容会被注入到body中。

例如上的结构build后的dist目录结构如下：

```
── dist
│   ├── 360buy
│   │   ├── index.html
│       ├── ... ...
│   │   ├── static
│   │   │   ├── css
│   │   │   ├── fonts
│   │   │   ├── img
│   │   │   └── js
│   └── shop
│       ├── index.html
│       ├── ... ...
│       ├── static
│       │   ├── css
│       │   ├── fonts
│       │   ├── img
│       │   └── js
```

index.html 与其它html文件都是可以独立运行的页面。

> 注：layout 目录不是一个单页面（没有app.js文件），它用于放置拆分的公共布局部分，可以方便地被引用。

## Vue 编码规范

推荐官方的[风格指南](https://cn.vuejs.org/v2/style-guide/)


[0]: http://vuejs-templates.github.io/webpack/static.html "Handing Static Assets"

## 页面路径

- index.html // 首页
- detail.html?goods_id=17666 // 详情页
- cart.html // 购物车
- list.html?cat_id=222&search_keywords=关键字 // 分类列表
- login.html // 登录
- order.html?source=cart // 订单支付
- pay.html // 支付
- pay-over.html?order_id=1708281431277839 // 支付完成
- my-comment.html?order_id=1605030950101133&site_id=84664 // 订单评论
- my/refund.html // 退款列表
- my-coupons.html // 优惠券列表页面
