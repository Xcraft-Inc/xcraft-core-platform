# 📘 Documentation du module xcraft-core-platform

## Aperçu

Le module `xcraft-core-platform` est une librairie utilitaire du framework Xcraft qui fournit des fonctions d'aide pour la gestion multi-plateforme. Il permet de détecter et d'adapter le comportement de l'application selon le système d'exploitation et l'architecture matérielle, en normalisant les différences entre Windows, Linux, macOS et autres plateformes Unix.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est composé d'un seul fichier principal `index.js` qui expose huit fonctions utilitaires :

- **Détection de plateforme** : `getOs()`
- **Extensions d'exécutables** : `getExecExt()`, `getShellExt()`, `getCmdExt()`
- **Gestion des architectures** : `getArch()`, `getArchVariant()`, `getToolchainArch()`
- **Utilitaires spécialisés** : `getShellExtArray()`

## Fonctionnement global

Le module utilise les propriétés natives de Node.js (`process.platform` et `process.arch`) pour détecter l'environnement d'exécution et fournir des informations normalisées. Il se base principalement sur la détection de Windows via l'expression régulière `/^win/` pour différencier les comportements entre Windows et les systèmes Unix-like.

Les fonctions normalisent les noms d'architectures selon les conventions utilisées dans différents contextes (par exemple, `x64` devient `amd64` pour certains outils, ou `x86_64` pour d'autres).

## Exemples d'utilisation

```javascript
const xPlatform = require('xcraft-core-platform');

// Détection du système d'exploitation
const os = xPlatform.getOs();
console.log(`Système détecté: ${os}`); // 'win', 'linux', 'darwin', etc.

// Construction de chemins d'exécutables
const executableName = `myapp${xPlatform.getExecExt()}`;
// Windows: 'myapp.exe', Unix: 'myapp'

// Scripts de démarrage selon la plateforme
const scriptName = `startup${xPlatform.getShellExt()}`;
// Windows: 'startup.bat', Unix: 'startup'

// Détection d'architecture normalisée
const arch = xPlatform.getArch();
console.log(`Architecture: ${arch}`); // 'amd64', 'aarch64', etc.

// Identification de toolchain complète
const toolchain = xPlatform.getToolchainArch();
console.log(`Toolchain: ${toolchain}`); // 'linux-amd64', 'mswindows-amd64', etc.

// Recherche de scripts avec extensions multiples
const extensions = xPlatform.getShellExtArray();
// ['.bat', ''] - permet de chercher 'script.bat' puis 'script'

// Conversion d'architecture pour des outils spécifiques
const variant = xPlatform.getArchVariant('x64');
console.log(`Variant: ${variant}`); // 'x86_64'
```

## Interactions avec d'autres modules

Ce module est une dépendance fondamentale utilisée par de nombreux autres modules Xcraft pour :

- **Modules de build** : Sélection des outils de compilation appropriés selon l'architecture
- **Gestionnaires de paquets** : Téléchargement des binaires compatibles avec la plateforme
- **Modules d'exécution** : Construction de chemins d'exécutables et de scripts
- **Outils de déploiement** : Identification des environnements cibles

## Détails des sources

### `index.js`

Le fichier principal expose toutes les fonctions utilitaires du module pour la détection et la normalisation des informations de plateforme.

#### Méthodes publiques

- **`getOs()`** — Retourne le nom normalisé du système d'exploitation. Convertit tous les variants Windows (win32, win64, etc.) en 'win', et conserve les noms natifs pour les autres plateformes (linux, darwin, etc.).

- **`getExecExt()`** — Retourne l'extension appropriée pour les fichiers exécutables. Retourne '.exe' sur Windows, chaîne vide sur les autres plateformes.

- **`getShellExt()`** — Retourne l'extension pour les scripts shell. Retourne '.bat' sur Windows, chaîne vide sur Unix.

- **`getShellExtArray()`** — Retourne un tableau contenant toutes les extensions de script possibles ['.bat', ''], utile pour la recherche de scripts dans différents formats.

- **`getCmdExt()`** — Retourne l'extension pour les fichiers de commande Windows. Retourne '.cmd' sur Windows, chaîne vide ailleurs.

- **`getArch()`** — Retourne l'architecture normalisée du processeur. Convertit 'x64' en 'amd64' et 'arm64' en 'aarch64' pour une compatibilité étendue avec les outils de build.

- **`getToolchainArch()`** — Retourne une chaîne identifiant la combinaison OS-architecture au format 'os-arch'. Utilise 'mswindows' au lieu de 'win' pour Windows, facilitant l'identification des toolchains de compilation.

- **`getArchVariant(arch)`** — Convertit les noms d'architecture vers des variants spécifiques. Transforme 'x32' en 'x86_32' et 'x64' en 'x86_64', conserve les autres architectures inchangées.

---

_Ce document a été mis à jour pour refléter l'état actuel du module._