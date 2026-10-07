<p align="center">
  <a href="https://www.dnshe.com/"><img src="./assets/dnshe-logo.png" alt="DNSHE" width="280"></a>
</p>

<h1 align="center">Domaines gratuits DNSHE</h1>

<p align="center">Un enregistrement de domaines et une gestion DNS simples, rapides et gratuits. Donnez à chaque idée une adresse sur Internet.</p>

<p align="center">
  <a href="https://my.dnshe.com/register.php"><img src="https://img.shields.io/badge/Sign_Up-Free-0ea5e9?style=for-the-badge" alt="Créer un compte gratuit"></a>
  <a href="https://my.dnshe.com/index.php?m=domain_hub"><img src="https://img.shields.io/badge/Domain_Hub-Manage_Domains-16a34a?style=for-the-badge" alt="Gérer les domaines"></a>
  <a href="https://www.dnshe.com/"><img src="https://img.shields.io/badge/Website-dnshe.com-1e293b?style=for-the-badge" alt="Visiter le site officiel"></a>
</p>

<p align="center" dir="ltr"><a href="./README.md">English</a> · <a href="./README_ZH.md">简体中文</a> · <a href="./README_ZH_TW.md">繁體中文</a> · <a href="./README_JA.md">日本語</a> · <a href="./README_RU.md">Русский</a> · <a href="./README_ID.md">Bahasa Indonesia</a> · <a href="./README_DE.md">Deutsch</a> · <strong>Français</strong> · <a href="./README_KO.md">한국어</a> · <a href="./README_AR.md">العربية</a></p>

## À propos de DNSHE

DNSHE est une plateforme à but non lucratif de distribution de domaines, portée par une équipe de jeunes de Singapour. Nous souhaitons faciliter la création de contenu sur Internet en proposant une infrastructure de domaines gratuite et accessible aux développeurs, aux étudiants et aux passionnés de logiciels libres du monde entier.

Le service de base reste gratuit pour toujours. Aucune carte bancaire ni information de paiement n'est nécessaire, et aucune publicité n'est imposée sur votre domaine ou votre site. Utilisez-le pour un blog personnel, un portfolio, un projet open source, un point d'accès API ou un service d'automatisation.

Ce dépôt présente DNSHE et rassemble des instructions d'inscription, des informations sur les suffixes et des liens vers la documentation API. L'enregistrement des domaines et la gestion DNS s'effectuent dans la [console DNSHE](https://my.dnshe.com/index.php?m=domain_hub).

## Fonctionnalités

- **Enregistrement et renouvellement gratuits** : Aucun frais caché pour le service de base. Renouvelez gratuitement ou obtenez une validité permanente gratuitement avec l'aide de vos amis.
- **Plusieurs types d'enregistrements DNS** : A, AAAA, CNAME, MX, TXT, NS, SRV, CAA et d'autres types sont pris en charge pour les sites, les e-mails et la vérification des domaines.
- **Serveurs de noms personnalisés** : Utilisez DNSHE DNS ou modifiez les NS pour déléguer votre domaine à un fournisseur DNS tiers.
- **Gestion centralisée** : Gérez domaines, enregistrements DNS et renouvellements depuis un même tableau de bord.
- **Automatisation par API** : Gérez les domaines et les enregistrements DNS depuis vos scripts, vos chaînes CI/CD et vos processus de déploiement.

## Suffixes disponibles

Le site officiel met actuellement en avant quatre suffixes :

- **`.de5.net` — Technologie et développement** : Blogs personnels, portfolios et démonstrations de projets open source, par exemple `myproject.de5.net`.
- **`.us.ci` — CI/CD et services** : Intégration continue, SaaS, points d'accès API et environnements de test, par exemple `myapi.us.ci`.
- **`.cc.cd` — Projets créatifs** : Marques personnelles, studios de design et présentation de créations, par exemple `portfolio.cc.cd`.
- **`.bot.cd` — Bots et automatisation** : Bots IA, assistants de discussion, webhooks et services d'automatisation, par exemple `assistant.bot.cd`.

Ces noms sont des exemples, sans garantie de disponibilité. Consultez la console pour les autres suffixes, la disponibilité actuelle, les quotas d'enregistrement et les exigences de vérification.

## Premiers pas

1. [Créez un compte gratuit](https://my.dnshe.com/register.php) ou [connectez-vous](https://my.dnshe.com/clientarea.php) si vous en avez déjà un.
2. Ouvrez le [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub), recherchez le nom souhaité et choisissez un suffixe.
3. Enregistrez le domaine et ajoutez les enregistrements A, AAAA, CNAME ou autres nécessaires. Vous pouvez aussi modifier les NS pour utiliser un fournisseur DNS tiers.
4. Associez le domaine à votre site ou application, puis suivez les instructions de votre hébergeur pour la vérification et la configuration HTTPS.
5. Gardez votre adresse e-mail de contact à jour, surveillez les rappels d'expiration et renouvelez gratuitement à temps.

## Validité et renouvellement

**Un service gratuit pour toujours ne signifie pas que chaque nouveau domaine est automatiquement dispensé de renouvellement.** Selon la FAQ du site :

- La durée d'enregistrement par défaut des domaines gratuits est de **1 an**.
- Le renouvellement gratuit est possible **dans les 180 jours précédant l'expiration**.
- Dans **Centre de fonctionnalités → Passage à un domaine permanent** (Feature Center → Permanent Domain Upgrade), vous pouvez obtenir gratuitement une **validité permanente sans renouvellement** avec l'aide de vos amis.
- Les rappels d'expiration sont envoyés par e-mail. Ils sont aussi disponibles sur Telegram si vous liez votre compte et activez les notifications.
- Les domaines peuvent être suspendus ou supprimés en cas d'infraction aux règles, ou supprimés s'ils ne sont pas renouvelés avant la fin de la période de récupération suivant l'expiration.

Consultez la console et les [Conditions d'utilisation](https://www.dnshe.com/tos.html) pour l'état du domaine, les modalités de renouvellement et les conditions de passage à une validité permanente.

## API et ressources pour les développeurs

Gérez les domaines et les enregistrements DNS par programmation depuis vos scripts, environnements de test et chaînes de déploiement :

- [Manuel API en ligne](https://my.dnshe.com/knowledgebase/1/Free-Domain-Name-Service-API-User-Manual)
- [Documentation API en français](./docs/api_fr.md) · [Version anglaise](./docs/api.md)
- [Console et gestion des identifiants API](https://my.dnshe.com/index.php?m=domain_hub)
- [Centre d'aide](https://my.dnshe.com/knowledgebase)

Consultez la documentation en ligne à jour et la console pour les adresses API, l'authentification et les limites de requêtes. Gardez vos API Key, API Secret et identifiants de compte confidentiels ; ne les ajoutez jamais à un dépôt public.

## Règles d'utilisation et signalement des abus

DNSHE est une infrastructure partagée. Son utilisation pour le phishing, la fraude, les logiciels malveillants, le spam, les DDoS, les scans non autorisés, les attaques par force brute, l'abus de proxys, le contournement de blocages, les atteintes aux droits ou toute autre activité illégale est interdite. Le contournement des quotas, la revente, la location et le partage non autorisé des ressources du compte sont également interdits.

Les utilisateurs sont responsables des contenus et activités commerciales publiés, liés ou diffusés par leurs domaines. Pour préserver la sécurité et le fonctionnement du service, DNSHE peut supprimer des enregistrements DNS, suspendre des domaines, restreindre des comptes ou refuser des renouvellements conformément à ses conditions. Si nécessaire, DNSHE peut conserver des preuves et signaler les abus aux fournisseurs en amont ou aux autorités compétentes. Les services gratuits peuvent être restreints ou arrêtés pour des raisons de sécurité, de conformité, d'exploitation ou de prévention des abus.

- [Conditions d'utilisation](https://www.dnshe.com/tos.html) · [Politique de confidentialité](https://www.dnshe.com/privacy.html)
- [Centre de signalement des abus](https://www.dnshe.com/domainabuse/) · [abuse@dnshe.com](mailto:abuse@dnshe.com)

Veuillez fournir le domaine, le type d'abus, les URL concernées, les preuves et votre adresse e-mail de contact pour faciliter la vérification.

## Contact et soutien

- **Questions sur les comptes, domaines, DNS et API** : [support@dnshe.com](mailto:support@dnshe.com)
- **Actualités officielles** : [X / @dnshecom](https://x.com/dnshecom)
- **Soutenir le projet** : [Sponsoriser DNSHE](https://www.dnshe.com/sponsor.html)

Si DNSHE aide votre projet, pensez à ajouter une étoile à ce dépôt. Les contributions en serveurs, bande passante et domaines sont également bienvenues. Contactez-nous par e-mail pour discuter d'un partenariat à long terme.

## Partenaires et sponsors

Merci aux partenaires qui soutiennent l'infrastructure gratuite de domaines et de DNS de DNSHE. L'ordre d'affichage ne constitue pas un classement.

<p align="center" dir="ltr">
  <a href="https://www.digitalocean.com/"><img src="./assets/sponsors/digitalocean.svg" alt="DigitalOcean" width="240"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://alphavps.com/"><img src="https://alphavps.com/assets/img/logo-purple-dark.svg" alt="AlphaVPS" width="200"></a>
</p>

<p align="center" dir="ltr">
  <a href="https://www.digitalocean.com/">DigitalOcean</a> · <a href="https://alphavps.com/">AlphaVPS</a>
</p>

<p align="center"><a href="https://www.dnshe.com/sponsor.html">Devenir partenaire / Soutenir DNSHE</a> · <a href="mailto:support@dnshe.com">Discuter d'un partenariat</a></p>
