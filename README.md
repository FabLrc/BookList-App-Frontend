# BookListApp - Frontend

![BookList Logo](./assets/images/booklist_logo.png)

<!-- Badges -->

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Axios](https://img.shields.io/badge/Axios-5C9DD8?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

Une application mobile React Native pour gérer votre collection de livres avec style et facilité.

## 🎯 Fonctionnalités

### Gestion de la Bibliothèque

- **Consulter les livres** : Affichage de tous les livres de votre collection avec détails complets
- **Ajouter un livre** : Formulaire intuitif pour ajouter rapidement un nouveau livre
- **Modifier un livre** : Mettre à jour les informations d'un livre existant
- **Supprimer un livre** : Retirer un livre de votre collection
- **Afficher les détails** : Consulter toutes les informations d'un livre (titre, auteur, année, thème, évaluation, etc.)
- **Favoris et Lu/Non lu** : Ajouter ou retirer un livre des favoris. Noter un livre comme lu ou non lu.

### Recherche et Filtrage

- **Recherche textuelle** : Trouver rapidement un livre par titre ou auteur
- **Filtres** : Filtrer par statut (lu/non lu), favoris, ou thème
- **Tri** : Trier par titre, auteur, thème, année ou évaluation
- **Combinaisons** : Combinez recherche, filtres et tri pour une navigation optimale

### Gestion des Notes

- **Ajouter des notes** : Associer des notes personnelles à chaque livre
- **Consulter les notes** : Voir toutes les notes liées à un livre
- **Supprimer les notes** : Retirer les notes dont vous n'avez plus besoin

### Statistiques

- **Vue statistiques** : Découvrez des statistiques sur votre collection
  - Nombre total de livres
  - Nombre de livres lus/non lus
  - Nombre de livres favoris
  - Note moyenne de votre collection

### Thématisation

- **Thème clair/sombre** : Basculez entre les deux thèmes pour un confort visuel optimal
- **Design cohérent** : Palettes de couleurs harmonieuses (#EEE6D8, #DAAB3A, #B67332, #93441A)

### Mode Hors Ligne

- **Synchronisation** : Les données sont synchronisées avec le backend quand la connexion revient
- **Travail hors ligne** : Continuez à consulter vos livres même sans connexion internet
- **Indicateur de statut** : Voyez clairement le statut de synchronisation et la connexion réseau

## 🛠️ Stack Technologique

### Framework & Langage

- **React Native** (Expo) : Framework pour créer des applications mobiles natives
  - ✅ Cross-platform (iOS/Android)
  - ✅ Développement rapide
  - ✅ Composants performants
- **TypeScript** : Typage statique pour une meilleure maintenabilité et moins de bugs
  - ✅ Autocomplétion améliorée
  - ✅ Détection d'erreurs compile-time

### Routage

- **Expo Router** : Solution de routage native pour Expo
  - ✅ Basé sur le file-system (structure claire et intuitive)
  - ✅ Navigation par onglets avec Tabs layout
  - ✅ Support des paramètres et états dynamiques

### Gestion d'État & Contexte

- **React Context API** : Gestion d'état centralisée sans dépendances externes
  - ✅ Thème (light/dark)
  - ✅ Statut réseau (online/offline)
  - ✅ Léger et performant pour ce cas d'usage

### HTTP Client

- **Axios** : Client HTTP robust avec intercepteurs et gestion d'erreurs
  - ✅ Configuration base URL centralisée
  - ✅ Support des intercepteurs pour la gestion d'erreurs
  - ✅ Timeout et retry facilement configurables

### Stockage Local

- **AsyncStorage** : Persistance des données en mode hors ligne
  - ✅ API simple et performante
  - ✅ Parfait pour le cache de données
  - ✅ Synchronisation transparent

### Icônes

- **@expo/vector-icons** (FontAwesome) : Icônes vectorielles
  - ✅ Polices d'icônes robustes et complètes
  - ✅ Scales bien sur tous les appareils
  - ✅ Performance optimale

### Linting & Qualité

- **ESLint** : Respect des standards de code
  - ✅ Configuration stricte pour la cohérence
  - ✅ Détection des bugs potentiels
  - ✅ Conventions de nommage appliquées

## 📐 Architecture & Bonnes Pratiques

### Structure des Dossiers

```
app/                    # Écrans et navigation (Expo Router)
├── (tabs)/             # Layout avec onglets
│   ├── _layout.tsx     # Configuration du layout
│   ├── index.tsx       # Accueil - Liste des livres
│   ├── add.tsx         # Ajouter un livre
│   ├── edit.tsx        # Modifier un livre
│   ├── details.tsx     # Détails du livre
│   ├── stats.tsx       # Statistiques
│   └── settings.tsx    # Paramètres
components/            # Composants réutilisables
├── BookCard.tsx       # Affichage d'un livre
├── BookForm.tsx       # Formulaire (add/edit)
├── SearchBar.tsx      # Barre de recherche
├── FiltersAndSort.tsx # Filtres et tri
├── StarRating.tsx     # Évaluation
├── Logo.tsx           # Logo de l'application
└── ...
constants/            # Constantes et thèmes
├── designSystem.ts   # Design system centralisé
└── theme.ts          # Thèmes light/dark
context/              # React Context
├── ThemeContext.tsx  # Gestion du thème
└── NetworkContext.tsx # Gestion de la connexion
services/             # Services métier
├── api.ts            # Configuration Axios
├── hybridApi.ts      # API hybrid (online/offline)
├── storage.ts        # AsyncStorage
└── openLibraryApi.ts # API externe (OpenLibrary)
types/                # Types TypeScript
└── book.ts           # Type Book
utils/                # Utilitaires
└── tabBarUtils.tsx   # Helpers pour la barre d'onglets
```

### Design System Centralisé

Un fichier `constants/designSystem.ts` contient tous les styles constants :

- **Spacing** : xs (4px) → huge (40px)
- **Border radius** : sm (6px) → full (999px)
- **Font sizes** : xs (11px) → huge (48px)
- **Font weights** : light (300) → extraBold (800)
- **Icon sizes** : xs (12px) → xxl (48px)
- **Elevation** : Ombres cohérentes (sm/md/lg)

✅ **Avantage** : Modification centralisée, consistency garantie

### Composants Réutilisables

- Tous les composants sont stateless ou utilisant des hooks
- Props bien typées avec TypeScript
- Styles encapsulés dans StyleSheet.create()
- Responsive par défaut

### Services Métier

- **hybridApi.ts** : Abstraction pour online/offline
  - Requêtes en mode connecté
  - Cache en mode offline
  - Sync automatique au retour de connexion
- **openLibraryApi.ts** : Intégration avec OpenLibrary
  - Enrichissement des métadonnées
  - Recherche de livres

### Gestion d'Erreurs

- Try-catch dans les opérations async
- Messages d'erreur utilisateur-friendly
- Logging des erreurs critiques

### Performance

- Listes optimisées avec FlatList
- Rendering optimisé avec React.memo si nécessaire
- Minimalisation des re-renders

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 16+
- npm ou yarn
- Backend BookListApp en fonctionnement (http://localhost:3000)

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd BookListApp/frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Démarrer l'application
npx expo start
```

### Configuration

Le fichier `.env` contient :

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/
```

Modifiez l'URL si votre backend est sur un autre port ou serveur.

## 📋 Bonnes Pratiques Appliquées

### 1. Typage TypeScript Strict

```tsx
// ✅ Toutes les données sont typées
interface Book {
  id: string;
  title: string;
  author: string;
  // ...
}
```

### 2. Séparation des Responsabilités

- **Composants** : UI uniquement
- **Services** : Logique métier (API, storage)
- **Context** : État global
- **Utils** : Fonctions helper

### 3. Gestion d'État Appropriée

- Context API pour l'état global (thème, réseau)
- State local pour l'état composant (formulaires, UI)
- AsyncStorage pour la persistance

### 4. Naming Explicite

```tsx
// ✅ Noms clairs et auto-explicatifs
const handleFetchBooks = () => {};
const isBookFavorite = true;
const onSyncComplete = () => {};
```

### 5. Styles Centralisés

- Pas de magic numbers
- Design system unique et maintenable
- Cohérence garantie

### 6. Composants Simples et Testables

- Composants petits et focalisés
- Une responsabilité par composant
- Props bien documentées

## 🔮 Évolutions Possibles

### Court Terme

- [ ] **Animations** : Transitions smooth entre écrans
- [ ] **Validation de formulaires** : Librairie de validation (ex: Formik, React Hook Form)
- [ ] **Tests unitaires** : Jest + React Native Testing Library
- [ ] **Splash screen** : Écran de démarrage avec logo

### Moyen Terme

- [ ] **Catégories personnalisées** : Créer et gérer des thèmes custom
- [ ] **Recommandations** : Suggestions de livres basées sur vos lectures
- [ ] **Listes de lecture** : Créer des collections thématiques
- [ ] **Social** : Partager ses coups de cœur avec d'autres utilisateurs
- [ ] **Intégration Goodreads** : Sync avec Goodreads (import/export)

### Long Terme

- [ ] **Authentification** : Comptes utilisateurs multi-appareils
- [ ] **Synchronisation Cloud** : Sync cross-device
- [ ] **API Backend robuste** : Base de données, authentification, gestion d'erreurs avancée
- [ ] **Progressive Web App** : Version web responsive
- [ ] **Machine Learning** : Recommandations intelligentes basées sur les préférences
- [ ] **Notifications push** : Rappels de lecture, nouvelles versions de livres favoris
- [ ] **Code partage** : QR codes ou liens pour partager sa collection

## 📚 Ressources & Documentation

### API Backend

- `GET /books` : Récupère tous les livres
- `GET /books/:id` : Détails d'un livre
- `POST /books` : Ajoute un livre
- `PUT /books/:id` : Modifie un livre
- `DELETE /books/:id` : Supprime un livre
- `GET /books/:id/notes` : Notes du livre
- `POST /books/:id/notes` : Ajoute une note
- `DELETE /books/:id/notes/:noteId` : Supprime une note
- `GET /stats` : Statistiques globales

## 📝 License

MIT

## 👨‍💻 Auteur

Fabien - Développement React Native et Design System
