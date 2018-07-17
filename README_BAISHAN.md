# storage dashboard - vue version
###依赖
项目开发、构建需要安装[`node`](https://nodejs.org/zh-cn/)  > v6.0
考虑到国内网络环境，可使用[`cnpm`](https://npm.taobao.org/),可提高安装速度

    $ npm install -g cnpm --registry=https://registry.npm.taobao.org

推荐使用[`yarn`](https://yarnpkg.com) 替代`npm`，速度更快

    $ brew update
    $ brew install yarn

### 开发环境配置

- 获取代码并运行
    ```bash
    $ git@github.com:bsc-s2/storage-dashboard-vue.git
    $ cd storage-dashboard-vue
    $ npm install
    $ npm run dev
    ```
- 修改 **host** 文件(目前登录统一采用白山 SSO 账户系统登录并自动跳转，故需要做一层 hosts 配置)， 以 Mac 为例
    ```bash
    $ sudo vim /etc/hosts
    ```
    新增一条记录，以 3copy 为例， ```127.0.0.1     cwn-ss.portal.baishancloud.com```
    注意因白山存储为多集群部署，每个集群的前端地址不同，具体地址以登录之后显示的地址为准
- 在地址栏中输入 ```http://localhost:8080``` 并在跳转后登录系统
- 登陆后由于我们修改了 hosts 文件，不能正常跳转到线上系统，我们将 URL ```.baishancloud.com``` 后添加 ```:8080``` 其他字符保持不变，并点击 ```enter/return```，完成环境搭建

### 本地构建并推送到release分支

	$ sh build_release.sh
	$ git checkout release
	$ git push

#### 部署代码

    $ sh init.sh -i /root/install/inventory.py -b playbooks/dashboard.yaml

关于S2部署以及配置，请查看s2-init

### 上线生产环境
本地构建后,使用跳板机(ps: 申请跳板机联系林飞)，使用ip登录线上标注为[`ansible-server`](https://github.com/bsc-s2/s2-init/blob/master/inventories/all-node.md)的机器。以3copy为例

    $ ssh 跳板机
    $ sudo -s
    $ cd /root/baishan/s2-init/source-code/storage-dashboard-vue
    $ git fetch
    $ git merge --ff-only origin release
    $ cd /root/baishan/s2-init
    $ sh init.sh -i inventories/baishan-3copy/inventory.py -b playbooks/dashboard.yaml

### 项目结构
#### 主要框架
- [`vue 2.3.0`](https://vuejs.org/)
- vue-router
- vuex
- [`axios`](https://github.com/mzabriskie/axios)
- [`iview`](https://www.iviewui.com/components/grid)
- [`aws-sdk`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)

使用`npm`管理项目依赖以及`webpack`构建工作流
#### 目录结构
- `src` 主要代码
- `dist` 打包输出目录，可直接运行
- `static` 样式文件及其他静态资源
- `build_release.sh` 线上构建脚本
