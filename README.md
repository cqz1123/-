# inventory-management

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
1.问题：json-server使用时3000端口被占用
解决方法：在运行时通过--port参数指定其他端口
json-server --watch db.json --port 3001



2.问题:当我在侧边栏切换组件时，多次切换后对应组件的内容会消失，只剩下空白和侧边栏
解决办法：使用完整的 <el-loading> 标签会在 DOM 中创建一个覆盖整个页面的元素，当 v-if 为 false 时，该元素会被移除，但可能会导致后续的组件渲染出现问题。使用 v-loading 指令则是在目标元素上添加加载状态，不会影响组件的正常渲染。

3.问题：我的出入库页面一直处于加载状态，记录没有渲染出来
原因:查询参数的设置问题让我无法获取到对应数据
解决办法：在 fetchTransactions 方法中，直接传递筛选参数，而不是分页和排序参数
```js
async fetchTransactions(params = {}) {
  try {
    this.loading = true
    
    // 直接获取所有交易记录，传递筛选参数
    const response = await transactionApi.getTransactions(params)
    
    // 更新状态
    this.transactions = response.data
    
    // 更新总记录数
    this.pagination.total = response.data.length
    
    return response.data
  } catch (error) {
    this.loading = false
    throw error
  }
}
```
4.问题：商品名称筛选功能失效。

解决思路：获取全量交易记录，通过前端 重构computed 实时筛选
```sh
总结：项目的创建
1.我们需要知道项目的核心功能，对页面分布有大体规划
2.其次，完成对项目的初始化，包括安装依赖、配置环境变量、设置路由，准备对应组件等
3.一个页面一个功能进行开发，每个页面都有对应的功能实现，确保对应的组件和接口正常工作
4.最后，进行项目的测试，确保项目的功能正常，没有错误



