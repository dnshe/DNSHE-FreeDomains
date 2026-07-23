# DNSHE 無料ドメインサービス

<p align="left">
  <a href="https://www.dnshe.com"><img src="https://img.shields.io/badge/Website-dnshe.com-0ea5e9?style=for-the-badge" alt="Website"></a>
  <img src="https://img.shields.io/badge/Status-Active-16a34a?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Service-Free%20Domains-0284c7?style=for-the-badge" alt="Free Domains">
  <img src="https://img.shields.io/badge/DNS-Full%20Record%20Support-1e293b?style=for-the-badge" alt="DNS">
</p>

[English](./README.md) | [简体中文](./README_ZH.md) | **日本語**

DNSHE は、シンガポールの若者による公益チームが構築した、無料のドメイン登録および DNS 名前解決サービスです。開発者、学生、オープンソースプロジェクト、立ち上げ初期のインターネットクリエイターに、無料で安定した使いやすいドメインインフラを提供します。

このリポジトリは、DNSHE Free Domains の公開情報ハブです。プロジェクトの紹介、クイックスタートガイド、サフィックス情報、サービスへのリンク、コミュニティ向けの最新情報を掲載します。

## DNSHE が提供するもの

- DNSHE が運営するパブリックサフィックス配下での無料ドメイン登録。
- A、AAAA、CNAME、MX、TXT、NS、SRV、CAA レコードを含む、完全な DNS レコード管理。
- ダッシュボードによるドメインと DNS の管理。
- 自動化、CI/CD、テスト環境、プロジェクトのデプロイに対応する API ベースのワークフロー。
- 共有ルートドメインを保護するための不正利用対応とコンプライアンス手続き。
- 開発者、学生、オープンソースプロジェクト向けの公益インフラ。

## 登録を受け付けているサフィックス

現在、次のサフィックスを一般登録向けに案内しています。

| サフィックス | 推奨用途 | 備考 |
| --- | --- | --- |
| `.de5.net` | 技術ブログ、ポートフォリオ、デモ、オープンソースプロジェクト | 短く、開発者に適しています。 |
| `.us.ci` | CI/CD、SaaS、API エンドポイント、テスト環境 | 自動化ワークフローに推奨します。 |
| `.cc.cd` | 個人ブランド、デザインスタジオ、クリエイティブプロジェクト | 覚えやすく、一般公開する作品に適しています。 |
| `.bot.cd` | AI ボット、チャットアシスタント、Webhook、自動化プロジェクト | ボットや自動化の用途向けです。 |

DNSHE Console にサインインすると、ほかのサフィックスを利用できる場合があります。利用可否、上限、更新規則、登録要件は、ダッシュボードの表示とサービス規約に従います。

## クイックスタート

1. [DNSHE](https://www.dnshe.com) または [DNSHE Client Area](https://my.dnshe.com/register.php) でアカウントを作成します。
2. [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub) を開きます。
3. 利用可能なドメインのプレフィックスを検索し、対応するサフィックスを選びます。
4. ドメインを登録し、ダッシュボードで DNS レコードを設定します。
5. 連絡先情報を最新の状態に保ち、ダッシュボードの規則に従ってドメインの更新や管理を行います。

基本の無料ドメインサービスにクレジットカードは必要ありません。

## API と自動化

DNSHE は自動化ワークフローに対応するよう設計されています。API を使用すると、スクリプト、CI/CD、デプロイパイプライン、テスト環境、証明書ワークフローから、ドメインと DNS レコードをプログラムで管理できます。

- API ドキュメント：[Free Domain Name Service API User Manual](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- アクセストークンの管理：[Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)

API キー、トークン、SSH キー、アカウント認証情報は非公開にしてください。公開リポジトリへ機密情報をコミットしないでください。

## 利用上の禁止事項

DNSHE は共有インフラです。利用者とルートドメインを保護するため、次の行為は禁止されています。

- フィッシング、詐欺、なりすまし、偽のログインページ、認証情報の窃取。
- マルウェア、ボットネット、コマンド＆コントロールノード、スパム、不正トラフィック。
- DDoS、許可のないスキャン、ブルートフォース攻撃、プロキシの不正利用、アクセス禁止の回避。
- 著作権、商標権、その他の知的財産権の侵害。
- 違法なコンテンツ、またはレジストリ、上流プロバイダー、適用される法的要件に違反するコンテンツ。
- 大量の不正利用、自動化による割り当て上限の回避、再販売、貸し出し、アカウントリソースの無断共有。

必要に応じて、DNSHE は DNS レコードの削除、ドメインの停止、アカウントの制限、更新の拒否、証拠の保全、上流プロバイダーまたは関係当局への不正利用の報告を行う場合があります。

## 法務および安全に関する注意事項

DNSHE サービスを通じてアップロード、ホスティング、公開、名前解決、リンク、転送、表示、配信されるユーザー生成コンテンツについては、利用者が責任を負います。DNSHE はインフラサービスプロバイダーとして、ユーザー生成コンテンツや利用者の事業活動を推奨せず、それらに対する責任を負いません。

無料サービスに金銭的価値はなく、セキュリティ、コンプライアンス、運用、不正利用防止上の理由により、制限、審査、停止、終了の対象となる場合があります。サービスを利用する前に、規約全文をお読みください。

## 不正利用の報告

DNSHE ドメインに関するフィッシング、マルウェア、スパム、権利侵害、違法行為、その他の不正利用を報告する場合は、公式の窓口をご利用ください。

- 不正利用報告センター：[https://www.dnshe.com/domainabuse/](https://www.dnshe.com/domainabuse/)
- 緊急の不正利用報告メール：[abuse@dnshe.com](mailto:abuse@dnshe.com)

報告時には、ドメイン名、不正利用の種類、証拠、スクリーンショット、URL、ログ、連絡先メールアドレスを記載してください。

## 関連リンク

- ウェブサイト：[https://www.dnshe.com](https://www.dnshe.com)
- Client Area：[https://my.dnshe.com](https://my.dnshe.com)
- ドメイン登録：[Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)
- API ドキュメント：[API User Manual](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- 利用規約：[https://www.dnshe.com/tos.html](https://www.dnshe.com/tos.html)
- プライバシーポリシー：[https://www.dnshe.com/privacy.html](https://www.dnshe.com/privacy.html)
- 不正利用の報告：[https://www.dnshe.com/domainabuse/](https://www.dnshe.com/domainabuse/)
- DNSHE への支援：[https://www.dnshe.com/sponsor.html](https://www.dnshe.com/sponsor.html)

## サポート

アカウント、ドメイン、DNS、API、提携に関するお問い合わせ先：

- サポートメール：[support@dnshe.com](mailto:support@dnshe.com)

DNSHE がプロジェクトのお役に立った場合は、このリポジトリに Star を付け、公益的な無料ドメインインフラを応援していただけると幸いです。
