<p align="center">
  <a href="https://www.dnshe.com/"><img src="./assets/dnshe-logo.png" alt="DNSHE" width="280"></a>
</p>

<h1 align="center">DNSHE 免費網域服務</h1>

<p align="center">簡單、快速、免費的網域註冊與 DNS 解析服務。讓每一個創意都有自己的網路入口。</p>

<p align="center">
  <a href="https://my.dnshe.com/register.php"><img src="https://img.shields.io/badge/免費註冊-建立帳號-0ea5e9?style=for-the-badge" alt="免費建立帳號"></a>
  <a href="https://my.dnshe.com/index.php?m=domain_hub"><img src="https://img.shields.io/badge/%E7%AE%A1%E7%90%86%E7%B6%B2%E5%9F%9F-DNSHE-16a34a?style=for-the-badge" alt="開啟網域控制台"></a>
  <a href="https://www.dnshe.com/"><img src="https://img.shields.io/badge/Website-dnshe.com-1e293b?style=for-the-badge" alt="前往官網"></a>
</p>

<p align="center" dir="ltr"><a href="./README.md">English</a> · <a href="./README_ZH.md">简体中文</a> · <strong>繁體中文</strong> · <a href="./README_JA.md">日本語</a> · <a href="./README_RU.md">Русский</a> · <a href="./README_ID.md">Bahasa Indonesia</a> · <a href="./README_DE.md">Deutsch</a> · <a href="./README_FR.md">Français</a> · <a href="./README_KO.md">한국어</a> · <a href="./README_AR.md">العربية</a></p>

## 關於 DNSHE

DNSHE 是由新加坡青年團隊推動的非營利網域分發平台，致力於降低網際網路內容的創作門檻，為全球開發者、學生和開源愛好者提供免費、易用的網域基礎設施。

基礎網域服務永久免費，無需信用卡或付款資訊，也不會在你的網域或網站上強制投放廣告。你可以用它架設個人部落格、展示作品、部署開源專案，或為 API 與自動化服務設定存取入口。

本儲存庫用於介紹 DNSHE 免費網域服務，並提供註冊指引、後綴資訊與 API 文件入口。網域註冊和 DNS 管理在 [DNSHE 控制台](https://my.dnshe.com/index.php?m=domain_hub) 完成。

## 功能特色

- **免費註冊與續期**：基礎服務無隱藏費用，支援免費續期，也可透過好友助力免費升級為永久有效。
- **多種 DNS 記錄**：支援 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA 等記錄，涵蓋網站、郵件與網域驗證情境。
- **支援修改 NS**：可使用 DNSHE 解析，也可將網域委派至第三方 DNS 服務商。
- **控制台管理**：集中管理網域、解析記錄與續期。
- **API 自動化**：透過 API 管理網域與 DNS 記錄，整合至指令碼、CI/CD 和部署流程。

## 開放註冊後綴

官網目前展示以下四個推薦後綴：

- **`.de5.net` — 技術與開發**：適合個人部落格、作品集和開源專案展示，例如 `myproject.de5.net`。
- **`.us.ci` — 持續整合與服務**：適合 CI/CD、SaaS、API 端點和測試環境，例如 `myapi.us.ci`。
- **`.cc.cd` — 創意與展示**：適合個人品牌、設計工作室和創意專案，例如 `portfolio.cc.cd`。
- **`.bot.cd` — 機器人與自動化**：適合 AI Bot、聊天助理、Webhook 和自動化服務，例如 `assistant.bot.cd`。

以上網域僅為命名範例，不代表可註冊狀態。更多後綴、即時可用性、註冊配額和審核要求，請以控制台為準。

## 快速開始

1. [免費建立帳號](https://my.dnshe.com/register.php)，已有帳號可直接 [登入](https://my.dnshe.com/clientarea.php)。
2. 進入 [管理網域](https://my.dnshe.com/index.php?m=domain_hub)，搜尋喜歡的網域前綴並選擇後綴。
3. 完成註冊，依專案需求新增 A、AAAA、CNAME 等 DNS 記錄，或修改 NS 使用第三方 DNS。
4. 將網域綁定至你的網站或應用程式，並依託管平台的指引完成驗證與 HTTPS 設定。
5. 保持聯絡信箱有效，留意到期提醒並及時免費續期。

## 有效期限與續期

**服務永久免費，不代表每個新註冊網域預設免續期。** 根據官網 FAQ：

- 免費網域的預設註冊有效期限為 **1 年**。
- 可在到期前 **180 天內免費續期**。
- 前往 **功能中心 → 網域永久升級**，可透過好友助力免費升級為 **永久有效（免續期）**。
- 系統會在到期前寄送電子郵件提醒；綁定 Telegram 並開啟通知後，也可收到 Telegram 提醒。
- 到期超過贖回期仍未續期，或違反使用規則時，網域可能被暫停或刪除。

實際狀態、續期操作及升級條件，請查看控制台和 [服務條款](https://www.dnshe.com/tos.html)。

## API 與開發者資源

透過 API 以程式方式管理網域和解析記錄，將 DNSHE 整合至你的指令碼、測試環境或部署流程：

- [官網完整 API 文件](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html)
- [繁體中文 API 文件](./docs/api_zh_tw.md)
- [控制台與 API 金鑰管理入口](https://my.dnshe.com/index.php?m=domain_hub)
- [說明中心](https://my.dnshe.com/knowledgebase)

API 位址、驗證方式和呼叫限制請以最新線上文件及控制台為準。請妥善保管 API Key、API Secret 與帳號憑證，不要將金鑰提交到公開儲存庫。

## 使用規則與濫用檢舉

DNSHE 是共用基礎設施。請勿用於網路釣魚、詐欺、惡意軟體、垃圾郵件、DDoS、未經授權的掃描、暴力破解、代理服務濫用、規避封鎖、侵權或其他違法活動；禁止繞過配額、轉售、出租或未經授權共用帳號資源。

使用者應對透過網域發布、連結或傳播的內容及業務活動負責。為保障安全與服務運作，DNSHE 可依服務條款刪除解析、暫停網域、限制帳號或拒絕續期，並在必要時保留證據、向上游服務商或相關機關通報。免費服務可能因安全、法規遵循、營運或防止濫用的需要而受到限制或終止。

- [服務條款](https://www.dnshe.com/tos.html) · [隱私權政策](https://www.dnshe.com/privacy.html)
- [濫用檢舉中心](https://www.dnshe.com/domainabuse/) · [abuse@dnshe.com](mailto:abuse@dnshe.com)

檢舉時請提供涉事網域、濫用類型、相關 URL、證據與聯絡信箱，以利查證處理。

## 聯絡與支援

- **帳號、網域、DNS 與 API 問題**：[support@dnshe.com](mailto:support@dnshe.com)
- **社群討論**：[在 GitHub 社群討論 DNSHE，交流使用經驗](https://github.com/dnshe/DNSHE-FreeDomains/discussions)
- **官方動態**：[X / @dnshecom](https://x.com/dnshecom)
- **支持專案**：[贊助 DNSHE](https://www.dnshe.com/sponsor.html)

如果 DNSHE 對你的專案有幫助，歡迎給本儲存庫一個 Star。也歡迎透過電子郵件提供伺服器、頻寬、網域等資源，或洽談長期合作。

## 合作夥伴與贊助商

感謝以下合作夥伴支持 DNSHE 免費網域與 DNS 基礎設施，排名不分先後。

<p align="center">
  <a href="https://www.digitalocean.com/"><img src="./assets/sponsors/digitalocean.svg" alt="DigitalOcean" width="240"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://alphavps.com/"><img src="https://alphavps.com/assets/img/logo-purple-dark.svg" alt="AlphaVPS" width="200"></a>
</p>

<p align="center">
  <a href="https://www.digitalocean.com/">DigitalOcean</a> · <a href="https://alphavps.com/">AlphaVPS</a>
</p>

<p align="center"><a href="https://www.dnshe.com/sponsor.html">成為合作夥伴 / 贊助 DNSHE</a> · <a href="mailto:support@dnshe.com">聯絡合作</a></p>
