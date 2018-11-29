# baishan cwn-x dashboard

白山存储 Web 管理平台，基于 **Vue**，**iView** 进行开发

## 功能介绍
关于[云存储](http://zh.baishancloud.com/tech/cwn/)的详细介绍.

- **文件管理**：基于 **aws-sdk** 进行开发，可以对海量文件进行上传、下载、权限管理等多种操作
- **权限管理**：多级账号体系，可以实现各种账号权限控制需求
- **图片配置、视频处理**：图片处理海量选项可视化配置
- **数据可视化**：多种维度的使用和状态数据全方位处理和展示

## 开发环境搭建

- 获取代码并运行
    ```bash
    $ git@github.com:bsc-s2/storage-dashboard-vue.git
    $ cd storage-dashboard-vue
    $ npm install
    $ npm run dev
    ```
- 修改 **host** 文件(目前登录统一采用白山SSO账户系统登录并自动跳转，故需要做一层 hosts 配置)， 以 Mac 为例
    ```bash
    $ sudo vim /etc/hosts
    ```
    新增一条记录，以 3copy 为例， ```127.0.0.1     cwn-ss.portal.baishancloud.com```
    注意因白山存储为多集群部署，每个集群的前端地址不同，具体地址以登录之后显示的地址为准
- 在地址栏中输入 ```http://localhost:8080``` 并在跳转后登录系统
- 登陆后由于我们修改了 hosts 文件，不能正常跳转到线上系统，我们将 URL ```.baishancloud.com``` 后添加 ```:8080```, 将```https```修改为```http``` 其他字符保持不变，并点击 ```enter/return```，完成环境搭建

## 参与贡献

我们非常欢迎你的建议和贡献，你可以通过以下方式和我们一起共建 :smiley:：

- 通过 [Issue](http://github.com/bsc-s2/storage-dashboard-vue/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](http://github.com/bsc-s2/storage-dashboard-vue/pulls) 改进代码。
