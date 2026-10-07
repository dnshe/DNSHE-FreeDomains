<p align="center">
  <a href="https://www.dnshe.com/"><img src="./assets/dnshe-logo.png" alt="DNSHE" width="280"></a>
</p>

<h1 align="center">DNSHE 免费域名服务</h1>

<p align="center">简单、快速、免费的域名注册与 DNS 解析服务。让每一个创意都有自己的网络入口。</p>

<p align="center">
  <a href="https://my.dnshe.com/register.php"><img src="https://img.shields.io/badge/免费注册-创建账户-0ea5e9?style=for-the-badge" alt="免费创建账户"></a>
  <a href="https://my.dnshe.com/index.php?m=domain_hub"><img src="https://img.shields.io/badge/Domain_Hub-管理域名-16a34a?style=for-the-badge" alt="打开域名控制台"></a>
  <a href="https://www.dnshe.com/"><img src="https://img.shields.io/badge/Website-dnshe.com-1e293b?style=for-the-badge" alt="访问官网"></a>
</p>

<p align="center"><a href="./README.md">English</a> · <strong>简体中文</strong> · <a href="./README_ZH_TW.md">繁體中文</a> · <a href="./README_JA.md">日本語</a> · <a href="./README_RU.md">Русский</a></p>

## 关于 DNSHE

DNSHE 是由新加坡青年团队驱动的非营利性域名分发平台，致力于降低互联网内容的创作门槛，为全球开发者、学生和开源爱好者提供免费、易用的域名基础设施。

基础域名服务永久免费，无需信用卡或付款信息，也不会在你的域名或网站上强制投放广告。你可以用它搭建个人博客、展示作品、部署开源项目，或为 API 与自动化服务配置访问入口。

本仓库用于介绍 DNSHE 免费域名服务，并提供注册指引、后缀信息与 API 文档入口。域名注册和 DNS 管理在 [DNSHE 控制台](https://my.dnshe.com/index.php?m=domain_hub) 完成。

## 功能优势

- **免费注册与续期**：基础服务无隐藏费用，支持免费续期，也可通过好友助力免费升级为永久有效。
- **多种 DNS 记录**：支持 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA 等记录，覆盖网站、邮件与域名验证场景。
- **支持修改 NS**：可使用 DNSHE 解析，也可将域名托管至第三方 DNS 服务商。
- **控制台管理**：集中管理域名、解析记录与续期。
- **API 自动化**：通过 API 管理域名与 DNS 记录，接入脚本、CI/CD 和部署流程。

## 开放注册后缀

官网目前展示以下四个推荐后缀：

- **`.de5.net` — 技术与开发**：适合个人博客、作品集和开源项目演示，例如 `myproject.de5.net`。
- **`.us.ci` — 持续集成与服务**：适合 CI/CD、SaaS、API 端点和测试环境，例如 `myapi.us.ci`。
- **`.cc.cd` — 创意与展示**：适合个人品牌、设计工作室和创意项目，例如 `portfolio.cc.cd`。
- **`.bot.cd` — 机器人与自动化**：适合 AI Bot、聊天助手、Webhook 和自动化服务，例如 `assistant.bot.cd`。

以上域名仅为命名示例，不代表可注册状态。更多后缀、实时可用性、注册配额和审核要求，请以控制台为准。

## 快速开始

1. [免费创建账户](https://my.dnshe.com/register.php)，已有账户可直接 [登录](https://my.dnshe.com/clientarea.php)。
2. 进入 [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)，搜索心仪的域名前缀并选择后缀。
3. 完成注册，按项目需要添加 A、AAAA、CNAME 等 DNS 记录，或修改 NS 使用第三方 DNS。
4. 将域名绑定至你的站点或应用，并按托管平台的指引完成验证与 HTTPS 配置。
5. 保持联系邮箱有效，留意到期提醒并及时免费续期。

## 有效期与续期

**服务永久免费，不等于每个新注册域名默认免续期。** 根据官网 FAQ：

- 免费域名的默认注册有效期为 **1 年**。
- 可在到期前 **180 天内免费续期**。
- 前往 **功能中心 → 域名永久升级**，可通过好友助力免费升级为 **永久有效（免续期）**。
- 系统会在到期前发送邮件提醒；绑定 Telegram 并开启通知后，也可收到 Telegram 提醒。
- 到期超过赎回期仍未续期，或违反使用规则时，域名可能被暂停或删除。

具体状态、续期操作及升级条件，请查看控制台和 [服务条款](https://www.dnshe.com/tos.html)。

## API 与开发者资源

通过 API 以编程方式管理域名和解析记录，将 DNSHE 接入你的脚本、测试环境或部署流水线：

- [在线 API 使用手册](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- [仓库内中文 API 文档](./docs/api_zh.md) · [English API documentation](./docs/api.md)
- [控制台与 API 密钥管理入口](https://my.dnshe.com/index.php?m=domain_hub)
- [帮助中心](https://my.dnshe.com/knowledgebase)

接口地址、认证方式和调用限制请以最新在线文档及控制台为准。请妥善保管 API Key、API Secret 与账户凭据，不要将密钥提交到公开仓库。

## 使用规则与滥用举报

DNSHE 是共享基础设施。请勿用于钓鱼、欺诈、恶意软件、垃圾邮件、DDoS、未授权扫描、爆破、代理滥用、规避封禁、侵权或其他违法活动；禁止绕过配额、转售、出租或未经授权共享账户资源。

用户应对通过域名发布、链接或传播的内容及业务活动负责。为保障安全与服务运行，DNSHE 可依据服务条款删除解析、暂停域名、限制账户或拒绝续期，并在必要时保留证据、向上游服务商或有关机构报告。免费服务可能因安全、合规、运营或反滥用需要受到限制或终止。

- [服务条款](https://www.dnshe.com/tos.html) · [隐私政策](https://www.dnshe.com/privacy.html)
- [滥用举报中心](https://www.dnshe.com/domainabuse/) · [abuse@dnshe.com](mailto:abuse@dnshe.com)

举报时请提供涉事域名、滥用类型、相关 URL、证据与联系邮箱，便于核查处理。

## 联系与支持

- **账户、域名、DNS 与 API 问题**：[support@dnshe.com](mailto:support@dnshe.com)
- **官方动态**：[X / @dnshecom](https://x.com/dnshecom)
- **支持项目**：[赞助 DNSHE](https://www.dnshe.com/sponsor.html)

如果 DNSHE 对你的项目有帮助，欢迎给本仓库一个 Star。也欢迎通过邮件提供服务器、带宽、域名等资源，或探讨长期合作。

## 合作伙伴与赞助商

感谢以下合作伙伴支持 DNSHE 免费域名与 DNS 基础设施，排名不分先后。

<p align="center">
  <a href="https://www.digitalocean.com/"><img src="./assets/sponsors/digitalocean.svg" alt="DigitalOcean" width="240"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://alphavps.com/"><img src="https://alphavps.com/assets/img/logo-purple-dark.svg" alt="AlphaVPS" width="200"></a>
</p>

<p align="center">
  <a href="https://www.digitalocean.com/">DigitalOcean</a> · <a href="https://alphavps.com/">AlphaVPS</a>
</p>

<p align="center"><a href="https://www.dnshe.com/sponsor.html">成为合作伙伴 / 赞助 DNSHE</a> · <a href="mailto:support@dnshe.com">联系合作</a></p>
