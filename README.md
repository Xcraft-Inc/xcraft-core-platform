# 📘 xcraft-core-platform

## Aperçu

Le module `xcraft-core-platform` est une librairie utilitaire de base du framework Xcraft. Elle fournit un ensemble de fonctions d'aide permettant de détecter et de normaliser les informations relatives à la plateforme d'exécution : système d'exploitation, extensions de fichiers exécutables/scripts, et architecture matérielle du processeur. Son objectif principal est de masquer les différences entre Windows, Linux, macOS et les autres systèmes Unix-like, afin que les autres modules Xcraft puissent construire des chemins, sélectionner des binaires ou des toolchains de manière cohérente, quelle que soit la plateforme cible.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)
- [Licence](#licence)

## Structure du module

Le module est extrêmement compact et se compose d'un unique fichier source, `index.js`, qui expose huit fonctions utilitaires sans état, purement dérivées des propriétés natives de Node.js (`process.platform` et `process.arch`) :

- **Détection du système d'exploitation** : `getOs()`
- **Extensions de fichiers dépendantes de la plateforme** : `getExecExt()`, `getShellExt()`, `getShellExtArray()`, `getCmdExt()`
- **Gestion et normalisation des architectures matérielles** : `getArch()`, `getArchVariant(arch)`, `getToolchainArch()`

Il n'y a ni acteur (Elf/Goblin), ni widget React, ni fichier de configuration (`config.js`) dans ce module : il s'agit d'une pure librairie utilitaire, sans dépendance externe déclarée dans son `package.json`.

## Fonctionnement global

Toutes les fonctions du module reposent sur deux propriétés natives fournies par Node.js :

- `process.platform`, pour identifier le système d'exploitation ;
- `process.arch`, pour identifier l'architecture du processeur.

La détection de Windows se fait systématiquement via l'expression régulière `/^win/`, ce qui permet de couvrir les différentes valeurs possibles retournées par Node.js sur les systèmes Windows (`win32` notamment). Sur toute autre plateforme, la valeur brute de `process.platform` est renvoyée telle quelle (par exemple `linux` ou `darwin`).

Pour les architectures, le module effectue une traduction des noms internes de Node.js vers des conventions plus répandues dans l'écosystème des outils de build et de packaging :

- `x64` → `amd64` (via `getArch()`)
- `arm64` → `aarch64` (via `getArch()`)
- `x32` → `x86_32` et `x64` → `x86_64` (via `getArchVariant()`, qui utilise une convention différente, orientée toolchains de compilation)

La fonction `getToolchainArch()` combine la détection d'OS et d'architecture pour produire un identifiant unique de toolchain, au format `os-arch` (par exemple `linux-amd64` ou `mswindows-aarch64`), en utilisant `mswindows` plutôt que `win` afin de rester cohérent avec les conventions de nommage des toolchains de compilation croisée.

## Exemples d'utilisation

```javascript
const xPlatform = require('xcraft-core-platform');

// Détection du système d'exploitation
const os = xPlatform.getOs();
console.log(`Système détecté : ${os}`); // 'win', 'linux', 'darwin', etc.

// Construction du nom d'un exécutable selon la plateforme
const executableName = `myapp${xPlatform.getExecExt()}`;
// Windows : 'myapp.exe' — Unix : 'myapp'

// Recherche d'un script en tenant compte des extensions possibles
for (const ext of xPlatform.getShellExtArray()) {
  const candidate = `startup${ext}`;
  // tester l'existence de 'startup.bat' puis 'startup'
}

// Identification de la toolchain complète pour le téléchargement d'un binaire
const toolchain = xPlatform.getToolchainArch();
console.log(`Toolchain : ${toolchain}`); // ex: 'linux-amd64'

// Conversion d'une architecture vers son variant spécifique
const variant = xPlatform.getArchVariant('x64');
console.log(`Variant : ${variant}`); // 'x86_64'
```

## Interactions avec d'autres modules

`xcraft-core-platform` est une dépendance transverse de bas niveau, utilisée par de nombreux modules de l'écosystème Xcraft dès qu'un comportement doit être adapté à la plateforme d'exécution, notamment pour :

- les modules de build et de compilation, pour sélectionner la toolchain ou les outils natifs adaptés à l'architecture ;
- les gestionnaires de paquets et de binaires, pour télécharger la version compatible avec l'OS et l'architecture courants ;
- les modules d'exécution de processus, pour construire des chemins vers des exécutables ou des scripts shell portables ;
- les outils de déploiement, pour identifier précisément l'environnement cible.

## Détails des sources

### `index.js`

Ce fichier unique expose l'ensemble des fonctions utilitaires du module. Toutes les fonctions sont synchrones, sans effet de bord, et ne font que lire les propriétés natives de Node.js pour en dériver une valeur normalisée.

#### Méthodes publiques

- **`getOs()`** — Retourne le nom normalisé du système d'exploitation courant. Renvoie `'win'` si `process.platform` correspond à l'expression `/^win/`, sinon renvoie la valeur brute de `process.platform` (par exemple `'linux'` ou `'darwin'`).
- **`getExecExt()`** — Retourne l'extension de fichier à utiliser pour un exécutable : `'.exe'` sur Windows, chaîne vide sur les autres plateformes.
- **`getShellExt()`** — Retourne l'extension à utiliser pour un script shell : `'.bat'` sur Windows, chaîne vide sur les autres plateformes.
- **`getShellExtArray()`** — Retourne le tableau `['.bat', '']`, représentant l'ensemble des extensions de script à essayer lors d'une recherche de fichier, indépendamment de la plateforme courante.
- **`getCmdExt()`** — Retourne l'extension à utiliser pour un fichier de commande Windows : `'.cmd'` sur Windows, chaîne vide ailleurs.
- **`getArch()`** — Retourne l'architecture matérielle normalisée du processeur, en traduisant `'x64'` en `'amd64'` et `'arm64'` en `'aarch64'` ; les autres valeurs de `process.arch` sont renvoyées inchangées.
- **`getToolchainArch()`** — Retourne une chaîne au format `os-arch` identifiant la toolchain de compilation correspondant à la plateforme courante. Utilise `'mswindows'` (plutôt que `'win'`) pour Windows, et s'appuie sur `getArch()` pour la partie architecture.
- **`getArchVariant(arch)`** — Convertit un nom d'architecture donné en paramètre vers un variant utilisé par certains outils : `'x32'` devient `'x86_32'`, `'x64'` devient `'x86_64'` ; toute autre valeur est retournée telle quelle.

## Licence

Ce module est distribué sous [licence MIT](./LICENSE).

_Ce contenu a été généré par IA_
