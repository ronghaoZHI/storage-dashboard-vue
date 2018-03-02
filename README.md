# storage dashboard - vue version
###依赖
项目开发、构建需要安装[`node`](https://nodejs.org/zh-cn/)  > v6.0
考虑到国内网络环境，可使用[`cnpm`](https://npm.taobao.org/),可提高安装速度

    $ npm install -g cnpm --registry=https://registry.npm.taobao.org

推荐使用[`yarn`](https://yarnpkg.com) 替代`npm`，速度更快

    $ brew update
    $ brew install yarn

### 开发环境配置

    $ git@git.coding.net:baishancloud/storage-dashboard-vue.git
    $ cd storage-dashboard-vue
    $ cnpm install

### 开发

    $ npm run dev

### 本地构建并推送到release分支

	$ sh build_release.sh
	$ git checkout release
	$ git push

### 上线测试

#### 测试地址：http://139.224.208.26:8080/

本地构建后,登录测试机，并获取需要上线代码，代码需 merge 到 master 分支

    $ ssh root@139.224.208.26
	$ cd s2-init/source-code/storage-dashboard-vue/
	$ git checkout release & git pull
	$ cd /root/s2-init

#### 部署代码

    $ sh init.sh -i /root/install/inventory.py -b playbooks/dashboard.yaml

关于S2部署以及配置，请查看s2-init

### 上线生产环境
本地构建后,使用跳板机(ps: 申请跳板机联系林飞)，使用ip登录线上标注为[`ansible-server`](https://github.com/bsc-s2/s2-init/blob/master/inventories/all-node.md)的机器。以3copy为例

    $ ssh root@222.222.12.247
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
