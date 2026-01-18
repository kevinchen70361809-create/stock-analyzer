---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3046022100a0413d92dfdfefd19407b4fd9ee684119685b8eeb8c529152dabd44952fc9de9022100c5ba3f80542205f0aa1154b5f7137581bb466e8b0a5b8f7b6de72efa28436fef
    ReservedCode2: 304402206f4ba7f52d5418c932dc4406d8a429b943ba082744ec3b90d3fdddb9b220fdac0220668edb9b01805db40bcd234d5cb63462d8254b4922c843dd73c66040609f95b4
---

# 股市罗盘 - 云端部署版

## 项目简介

「股市罗盘」是一款专业的股票分析Web应用，支持A股、港股、美股的实时行情查询。本项目采用Node.js后端配合纯前端页面，支持免费云服务器部署，让您随时随地查看股票分析数据。

## 核心功能

本应用提供以下核心功能：实时行情展示功能支持获取股票的当前价格、涨跌幅、成交量等基础数据；技术指标分析功能提供MA5、MA20、ATR、RSI、MACD等常用技术指标；波幅预测功能基于历史波动率和ATR指标，预测未来1天、1周、1个月的股价波动范围；买卖建议功能结合技术指标和波幅预测，给出买入价格、卖出价格、止损位、止盈位建议；K线图表功能展示股票的日K、周K走势图；新闻情绪分析功能汇总相关新闻并进行情绪分类（利好、利空、中性）。

## 技术架构

后端采用Express.js框架构建RESTful API，负责数据抓取和前端请求代理；数据源方面，A股和港股数据使用腾讯财经API，美股数据使用Yahoo Finance API；前端采用原生HTML5、CSS3、JavaScript，使用Chart.js绘制K线图表；部署支持Render.com、Vercel、Railway等多个免费云平台。

## 目录结构

```
cloud_version/
├── server.js          # Node.js后端服务器
├── package.json       # 项目依赖配置
├── Procfile           # 进程配置（Heroku用）
├── render.yaml        # Render.com部署配置
├── vercel.json        # Vercel部署配置
├── app.json           # 备用配置
└── frontend/
    └── index.html     # 前端页面（包含完整前端代码）
```

## 快速部署

### 方式一：Render.com部署（推荐）

Render.com是一个提供免费Web服务的云平台，非常适合本项目的部署需求。

第一步，注册并登录Render.com账号。您可以使用GitHub账号直接登录，这样后续部署会更加便捷。

第二步，创建新的Web Service。在Render控制台点击「New」按钮，选择「Web Service」。

第三步，连接GitHub仓库。将本项目（cloud_version目录）上传到GitHub，然后在Render中选择对应的仓库URL。如果尚未上传，可以先将cloud_version目录的内容上传到GitHub。

第四步，配置构建选项。在「Build Command」处填写`npm install`，在「Start Command」处填写`npm start`。

第五步，选择免费计划。在「Plan」部分选择「Free」选项，Render会提供每月750小时的免费运行时间。

第六步，点击「Create Web Service」按钮开始部署。部署完成后，Render会自动生成一个访问URL，格式类似于`https://stock-analyzer.onrender.com`。

### 方式二：Vercel部署

Vercel是另一个优秀的免费云平台，特别适合前端项目，但也可以通过配置支持Node.js后端。

第一步，注册并登录Vercel账号。推荐使用GitHub账号登录。

第二步，点击「Add New」按钮，选择「Project」。

第三步，导入GitHub仓库。选择本项目的GitHub仓库。

第四步，配置项目设置。将「Root Directory」设置为`cloud_version`，或者将cloud_version目录的内容直接放在仓库根目录。

第五步，点击「Deploy」按钮开始部署。Vercel会自动识别`vercel.json`配置文件并完成部署。

第六步，部署完成后，Vercel会生成访问URL，您可以在项目页面查看。

### 方式三：Railway部署

Railway是一个现代化的云平台，提供简洁的部署体验。

第一步，注册并登录Railway账号，使用GitHub账号登录。

第二步，点击「New Project」按钮。

第三步，选择「Deploy from GitHub repo」，选择本项目的仓库。

第四步，Railway会自动检测Node.js项目并完成部署。

第五步，部署完成后，点击「Settings」查看访问URL。

### 方式四：本地运行测试

如果您希望在本地运行测试项目，请按照以下步骤操作。

首先，确保已安装Node.js（版本16.0.0以上）。您可以通过在终端运行`node --version`来检查版本。

然后，进入项目目录并安装依赖。在终端中执行以下命令：

```
cd cloud_version
npm install
```

接着，启动本地服务器：

```
npm start
```

最后，打开浏览器访问`http://localhost:3000`即可使用应用。

## 支持的股票代码格式

本应用支持三种市场的股票代码查询。

A股股票需要在代码前加前缀`sh`或`sz`。例如：`sh600519`代表贵州茅台，`sz002594`代表比亚迪，`sh000001`代表上证指数。

港股股票需要在代码前加前缀`hk`。例如：`hk00700`代表腾讯控股，`hk09988`代表阿里巴巴。

美股股票直接使用股票代码。例如：`AAPL`代表苹果公司，`TSLA`代表特斯拉公司。

## 常见问题

### 问：为什么有些股票数据获取失败？

答：可能的原因包括：股票代码格式不正确，请确保使用正确的前缀；腾讯财经API有时会暂时不可用，系统会自动使用模拟数据；网络连接问题导致无法访问外部API。建议检查股票代码格式后重试。

### 问：数据更新频率是多少？

答：当前版本的数据在每次页面刷新时获取最新数据。由于免费云平台的限制，无法实现真正的实时推送。如需更高频率的更新，可以考虑升级到付费计划或自行部署服务器。

### 问：波幅预测的准确性如何？

答：波幅预测基于ATR指标和历史波动率计算，属于技术分析方法。预测结果仅供参考，不构成投资建议。股市有风险，投资需谨慎。

### 问：如何修改股票数据库？

答：本项目内置了一个常用股票代码数据库，位于`server.js`文件中的`stockDatabase`对象。您可以根据需要添加更多股票代码。格式为：股票代码为键，包含`name`（名称）、`market`（市场类型）、`type`（市场代码）三个属性的对象为值。

### 问：能否部署后访问很慢？

答：免费云平台的服务器通常位于海外，国内访问可能会有一定延迟。这是正常现象。如需更快速度，建议考虑使用国内云平台或配置CDN加速。

## API接口说明

本应用提供以下API接口供前端调用。

获取股票实时数据的接口路径为`GET /api/stock?symbol=股票代码`，返回股票的当前价格、涨跌幅、成交量等信息。

获取K线数据的接口路径为`GET /api/kline?symbol=股票代码&period=周期`，支持日K、周K、月K三种周期，返回指定周期内的K线数据。

股票搜索接口路径为`GET /api/search?q=关键词`，返回匹配的股票列表。

健康检查接口路径为`GET /api/health`，返回服务器状态，用于监控服务是否正常运行。

## 二次开发

如果您希望对本项目进行二次开发，可以参考以下建议。

如需添加新的数据源，可以在`server.js`中新增数据获取函数，如`fetchXxxData`，并在`/api/stock`接口中调用。

如需修改前端样式，可以编辑`frontend/index.html`中的CSS样式部分，或者将样式提取到单独的CSS文件中。

如需添加新功能，可以在`frontend/index.html`中增加新的功能模块，并通过API接口获取所需数据。

## 免责声明

本应用提供的波幅预测和买卖建议仅供参考，不构成任何投资建议。股票投资具有高风险，投资者应根据自身情况谨慎决策。开发者不对任何投资损失承担责任。

## 许可证

本项目采用MIT许可证，您可以自由使用、修改和分发本项目的代码，但需要保留原始版权声明。

## 联系方式

如有问题或建议，欢迎通过GitHub Issues提交反馈。
