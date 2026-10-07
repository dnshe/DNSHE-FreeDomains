<p align="center">
  <a href="https://www.dnshe.com/"><img src="./assets/dnshe-logo.png" alt="DNSHE" width="280"></a>
</p>

<h1 align="center">DNSHE 無料ドメインサービス</h1>

<p align="center">シンプルで、すばやく、無料。ドメイン登録と DNS で、あなたのアイデアをインターネットへ。</p>

<p align="center">
  <a href="https://my.dnshe.com/register.php"><img src="https://img.shields.io/badge/Sign_Up-Free-0ea5e9?style=for-the-badge" alt="無料アカウントを作成"></a>
  <a href="https://my.dnshe.com/index.php?m=domain_hub"><img src="https://img.shields.io/badge/Domain_Hub-Manage_Domains-16a34a?style=for-the-badge" alt="ドメイン管理画面を開く"></a>
  <a href="https://www.dnshe.com/"><img src="https://img.shields.io/badge/Website-dnshe.com-1e293b?style=for-the-badge" alt="公式サイトへ"></a>
</p>

<p align="center" dir="ltr"><a href="./README.md">English</a> · <a href="./README_ZH.md">简体中文</a> · <a href="./README_ZH_TW.md">繁體中文</a> · <strong>日本語</strong> · <a href="./README_RU.md">Русский</a> · <a href="./README_ID.md">Bahasa Indonesia</a> · <a href="./README_DE.md">Deutsch</a> · <a href="./README_FR.md">Français</a> · <a href="./README_KO.md">한국어</a> · <a href="./README_AR.md">العربية</a></p>

## DNSHE について

DNSHE は、シンガポールの若者チームが運営する非営利のドメイン配布プラットフォームです。インターネットでコンテンツを発信するハードルを下げるため、世界中の開発者、学生、オープンソース愛好家に、無料で使いやすいドメイン基盤を提供しています。

基本のドメインサービスは永久無料です。クレジットカードや支払い情報は不要で、ドメインや Web サイトに広告を強制表示することもありません。個人ブログ、ポートフォリオ、オープンソースプロジェクト、API エンドポイント、自動化サービスなどに利用できます。

このリポジトリでは、DNSHE の無料ドメインサービスを紹介し、登録手順、利用できるサフィックス、API ドキュメントへのリンクを掲載しています。ドメイン登録と DNS 管理は [DNSHE 管理画面](https://my.dnshe.com/index.php?m=domain_hub) で行えます。

## 主な機能

- **無料の登録・更新**：基本サービスに隠れた料金はありません。無料で更新できるほか、友人の協力によって有効期限のないドメインへ無料でアップグレードできます。
- **多様な DNS レコード**：A、AAAA、CNAME、MX、TXT、NS、SRV、CAA などに対応し、Web サイト、メール、ドメイン認証に利用できます。
- **ネームサーバーの変更**：DNSHE の DNS を利用するか、NS を変更して外部の DNS プロバイダーに委任できます。
- **管理画面で一元管理**：ドメイン、DNS レコード、更新をまとめて管理できます。
- **API による自動化**：スクリプト、CI/CD、デプロイフローからドメインと DNS レコードを管理できます。

## 登録できるサフィックス

公式サイトでは、次の 4 つのサフィックスを紹介しています。

- **`.de5.net` — 技術・開発**：個人ブログ、ポートフォリオ、オープンソースのデモ向け。例：`myproject.de5.net`。
- **`.us.ci` — CI/CD・サービス**：継続的インテグレーション、SaaS、API エンドポイント、テスト環境向け。例：`myapi.us.ci`。
- **`.cc.cd` — クリエイティブ・作品紹介**：個人ブランド、デザインスタジオ、作品公開向け。例：`portfolio.cc.cd`。
- **`.bot.cd` — ボット・自動化**：AI ボット、チャットアシスタント、Webhook、自動化サービス向け。例：`assistant.bot.cd`。

上記のドメイン名は命名例であり、登録可能であることを保証するものではありません。その他のサフィックス、最新の空き状況、登録上限、審査要件は管理画面で確認してください。

## はじめ方

1. [無料アカウントを作成](https://my.dnshe.com/register.php)します。登録済みの場合は [ログイン](https://my.dnshe.com/clientarea.php)してください。
2. [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub) を開き、希望する名前を検索してサフィックスを選びます。
3. ドメインを登録し、プロジェクトに必要な A、AAAA、CNAME などの DNS レコードを追加します。NS を変更して外部の DNS を利用することもできます。
4. ドメインを Web サイトやアプリに紐づけ、ホスティングサービスの案内に従って認証と HTTPS の設定を行います。
5. 連絡先メールアドレスを最新の状態に保ち、有効期限の通知を確認して無料更新を行います。

## 有効期限と更新

**サービスが永久無料でも、新規登録したすべてのドメインが最初から更新不要になるわけではありません。** 公式サイトの FAQ では、次のように案内しています。

- 無料ドメインの標準の登録期間は **1 年**です。
- **有効期限まで 180 日以内**になると、無料で更新できます。
- **機能センター → ドメインの永久アップグレード**（Feature Center → Permanent Domain Upgrade）で、友人の協力によって **有効期限なし（更新不要）**へ無料でアップグレードできます。
- 有効期限前にメールで通知します。Telegram を連携して通知を有効にすると、Telegram でも通知を受け取れます。
- 更新せずに有効期限後の復旧猶予期間を過ぎた場合、または利用規則に違反した場合、ドメインが停止・削除されることがあります。

ドメインの状態、更新操作、アップグレード条件は、管理画面と [利用規約](https://www.dnshe.com/tos.html) で確認してください。

## API と開発者向けリソース

API を使ってドメインと DNS レコードを管理し、スクリプト、テスト環境、デプロイパイプラインに組み込めます。

- [オンライン API マニュアル](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- [日本語 API ドキュメント](./docs/api_ja.md) · [英語版](./docs/api.md)
- [管理画面・API 認証情報の管理](https://my.dnshe.com/index.php?m=domain_hub)
- [ヘルプセンター](https://my.dnshe.com/knowledgebase)

エンドポイント、認証方法、呼び出し制限は、最新のオンラインドキュメントと管理画面を参照してください。API Key、API Secret、アカウント認証情報は厳重に管理し、公開リポジトリにコミットしないでください。

## 利用ルールと不正利用の報告

DNSHE は共有のインフラです。フィッシング、詐欺、マルウェア、スパム、DDoS、無許可のスキャン、総当たり攻撃、プロキシの悪用、利用停止の回避、権利侵害、その他の違法行為には利用できません。利用上限の回避、アカウント資源の転売・貸与・無断共有も禁止しています。

ドメインを通じて公開、リンク、配信するコンテンツや事業活動は、利用者自身の責任となります。安全性とサービス運営を守るため、DNSHE は利用規約に基づき、DNS レコードの削除、ドメインの停止、アカウントの制限、更新の拒否を行う場合があります。また、必要に応じて証拠を保全し、上流プロバイダーや関係機関に報告することがあります。無料サービスは、安全性、法令遵守、運用、不正利用防止のために制限・終了される場合があります。

- [利用規約](https://www.dnshe.com/tos.html) · [プライバシーポリシー](https://www.dnshe.com/privacy.html)
- [不正利用の報告窓口](https://www.dnshe.com/domainabuse/) · [abuse@dnshe.com](mailto:abuse@dnshe.com)

報告には、対象ドメイン、不正利用の種類、関連 URL、証拠、連絡先メールアドレスを添えてください。

## お問い合わせ・サポート

- **アカウント、ドメイン、DNS、API に関するお問い合わせ**：[support@dnshe.com](mailto:support@dnshe.com)
- **公式情報**：[X / @dnshecom](https://x.com/dnshecom)
- **プロジェクトへの支援**：[DNSHE を支援する](https://www.dnshe.com/sponsor.html)

DNSHE がプロジェクトの役に立ったら、このリポジトリに Star をいただけるとうれしいです。サーバー、帯域、ドメインなどの資源提供や、長期的な協力についても、メールでお気軽にご相談ください。

## パートナー・スポンサー

DNSHE の無料ドメイン・DNS 基盤を支えてくださるパートナーの皆さまに感謝します。掲載順は順位を示すものではありません。

<p align="center">
  <a href="https://www.digitalocean.com/"><img src="./assets/sponsors/digitalocean.svg" alt="DigitalOcean" width="240"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://alphavps.com/"><img src="https://alphavps.com/assets/img/logo-purple-dark.svg" alt="AlphaVPS" width="200"></a>
</p>

<p align="center">
  <a href="https://www.digitalocean.com/">DigitalOcean</a> · <a href="https://alphavps.com/">AlphaVPS</a>
</p>

<p align="center"><a href="https://www.dnshe.com/sponsor.html">パートナーになる / DNSHE を支援する</a> · <a href="mailto:support@dnshe.com">協力について相談する</a></p>
