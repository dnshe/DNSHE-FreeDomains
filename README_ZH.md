# DNSHE 免费域名服务

<p align="left">
  <a href="https://www.dnshe.com"><img src="https://img.shields.io/badge/Website-dnshe.com-0ea5e9?style=for-the-badge" alt="Website"></a>
  <img src="https://img.shields.io/badge/Status-Active-16a34a?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Service-Free%20Domains-0284c7?style=for-the-badge" alt="Free Domains">
  <img src="https://img.shields.io/badge/DNS-Full%20Record%20Support-1e293b?style=for-the-badge" alt="DNS">
</p>

[English](./README.md) | **简体中文**

DNSHE 是由一支新加坡青年公益团队打造的免费域名注册与 DNS 解析服务。我们为开发者、学生、开源项目和早期互联网创作者提供免费、稳定、易用的域名基础设施，让可靠的网络入口触手可及。

本仓库是 DNSHE Free Domains 的公开说明入口，用于展示项目介绍、快速开始、开放后缀、服务链接和面向社区的更新信息。

## DNSHE 提供什么

- DNSHE 运营后缀下的免费域名注册服务。
- 完整 DNS 记录管理，支持 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA 等记录类型。
- 基于控制台的域名和 DNS 管理能力。
- 面向自动化、CI/CD、测试环境和项目部署的 API 工作流。
- 滥用处理与合规机制，用于保护共享根域名和平台用户。
- 面向开发者、学生和开源项目的公益性互联网基础设施。

## 开放注册后缀

目前官网重点开放和推荐的后缀包括：

| 后缀 | 推荐用途 | 说明 |
| --- | --- | --- |
| `.de5.net` | 技术博客、作品集、演示站、开源项目 | 简短、清晰，适合开发者场景。 |
| `.us.ci` | CI/CD、SaaS、API 端点、测试环境 | 推荐用于自动化和持续集成工作流。 |
| `.cc.cd` | 个人品牌、设计工作室、创意项目 | 易记，适合公开展示类项目。 |
| `.bot.cd` | AI Bot、聊天助手、Webhook、自动化项目 | 面向机器人和自动化服务场景。 |

登录 DNSHE 控制台后可能会看到更多可用后缀。具体可用性、注册限制、续期规则和审核要求，以控制台展示和服务政策为准。

## 快速开始

1. 在 [DNSHE 官网](https://www.dnshe.com) 或 [DNSHE 客户中心](https://my.dnshe.com/register.php) 创建账户。
2. 打开 [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)。
3. 搜索可用的域名前缀，并选择支持的后缀。
4. 完成注册后，在控制台配置 DNS 解析记录。
5. 保持联系信息准确，并按照控制台规则续期和管理域名。

基础免费域名服务无需信用卡。

## API 与自动化

DNSHE 面向自动化工作流设计。你可以通过 API 以编程方式管理域名和 DNS 记录，并将其接入脚本、CI/CD、部署流水线、测试环境和证书自动化流程。

- API 文档：[Free Domain Name Service API User Manual](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- Access Token 管理：[Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)

请妥善保管 API Key、Access Token、SSH 密钥和账户凭据，不要把任何密钥提交到公开仓库。

## 合规使用

DNSHE 是共享基础设施。为保护用户和根域名，以下行为不被允许：

- 钓鱼、欺诈、仿冒、伪造登录页或盗取凭据。
- 恶意软件、僵尸网络、控制节点、垃圾邮件或滥用流量。
- DDoS、未授权扫描、爆破、代理滥用或规避封禁。
- 侵犯版权、商标权或其他知识产权。
- 违法内容，或违反注册局、上游服务商、适用法律要求的内容。
- 批量滥用、自动化绕过配额、转售、出租或未经授权共享账户资源。

必要时，DNSHE 可采取删除解析、暂停域名、限制账户、拒绝续期、保留证据，或向上游服务商和监管机构报告等措施。

## 法律与安全说明

用户通过 DNSHE 服务上传、托管、发布、解析、链接、转发、展示或传播的内容，由用户自行负责。DNSHE 作为基础设施服务提供方，不背书、不主动承担用户生成内容或用户业务活动引发的法律责任。

免费服务不产生现金价值，并可能因安全、合规、运营或反滥用原因受到限制、审核、暂停或终止。使用服务前，请阅读完整服务条款。

## 滥用举报

如果你需要举报涉及 DNSHE 域名的钓鱼、恶意软件、垃圾邮件、侵权、违法活动或其他滥用行为，请使用官方举报渠道：

- 滥用举报中心：[https://www.dnshe.com/domainabuse/](https://www.dnshe.com/domainabuse/)
- 紧急滥用邮箱：[abuse@dnshe.com](mailto:abuse@dnshe.com)

提交举报时，请尽量提供域名、滥用类型、证据、截图、URL、日志和联系邮箱，以便我们更快核查。

## 常用链接

- 官网：[https://www.dnshe.com](https://www.dnshe.com)
- 客户中心：[https://my.dnshe.com](https://my.dnshe.com)
- 域名注册：[Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)
- API 文档：[API User Manual](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- 服务条款：[https://www.dnshe.com/tos.html](https://www.dnshe.com/tos.html)
- 隐私政策：[https://www.dnshe.com/privacy.html](https://www.dnshe.com/privacy.html)
- 滥用举报：[https://www.dnshe.com/domainabuse/](https://www.dnshe.com/domainabuse/)
- 赞助 DNSHE：[https://www.dnshe.com/sponsor.html](https://www.dnshe.com/sponsor.html)

## 支持

如有账户、域名、DNS、API 或资源合作问题，请联系：

- 支持邮箱：[support@dnshe.com](mailto:support@dnshe.com)

如果 DNSHE 对你的项目有帮助，欢迎在 GitHub 给本仓库点一个 Star，支持这项免费域名基础设施继续运行。
