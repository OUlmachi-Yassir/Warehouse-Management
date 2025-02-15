# Welcome to your Expo app 👋

# Gestion de Stock - Application Mobile

## Contexte du projet

Un magasin souhaite moderniser et simplifier la gestion de son stock en mettant à disposition des magasiniers une application intuitive. Cette application devra permettre :

Une application mobile intuitive pour simplifier la gestion des stocks en magasin. Elle permet aux magasiniers d'ajouter, retirer et suivre les produits en temps réel via un scanner de code-barres ou une saisie manuelle.

- **Une gestion rapide des stocks** grâce à un scanner de code-barres et une saisie manuelle.
- **Un suivi en temps réel des produits**, avec la possibilité d'ajouter ou de retirer des quantités en stock.
- **L’ajout simplifié de nouveaux produits** via un formulaire interactif.
- L’objectif est d’optimiser la gestion du stock tout en réduisant les erreurs humaines.

## Fonctionnalités Principales

### 1. Authentification
Chaque utilisateur disposera d’un code secret personnel lui permettant d'accéder à l'application.

### 2. Gestion des produits
- **Identification des produits** :
  - Scanner de code-barres intégré pour une identification rapide en utilisant `expo-barcode-scanner`.
  - Saisie manuelle du code-barres en cas de dysfonctionnement du scanner.
  - Vérification automatique dans la base de données.
  
- **Produit existant** :
  - Possibilité d'ajouter ou de retirer des quantités dans un entrepôt.
  - Affichage des informations du produit (nom, type, prix, quantité disponible par entrepôt).

- **Produit non existant** :
  - Proposition d’un formulaire de création avec les champs suivants :
    - Nom, type, prix, fournisseur, quantité initiale (si supérieure à 0, préciser l’entrepôt concerné), image du produit (facultatif).

### 3. Liste des produits
- Affichage détaillé des produits stockés :
  - Nom, type, prix (ex: “Solde”, “Prix régulier”), quantité disponible, état du stock (ex : "En stock", "Stock épuisé").
  - Produit édité par ?.
  - **Indicateurs visuels** :
    - Couleur rouge pour les produits en rupture de stock.
    - Couleur jaune pour les produits en faible quantité (ex : <10 unités).

- **Actions disponibles** :
  - Bouton "Réapprovisionner" pour augmenter la quantité.
  - Bouton "Décharger" pour retirer des unités.

### 4. Fonctionnalités avancées
- **Filtrage et recherche** :
  - Recherche par nom, type, prix ou fournisseur.
  
- **Tri dynamique** :
  - Tri des produits par prix croissant/décroissant, nom alphabétique ou quantité.

### 5. Statistiques et résumé des stocks
Tableau de bord affichant les indicateurs suivants :
  - Nombre total de produits.
  - Nombre total de villes.
  - Produits en rupture de stock.
  - La valeur totale des stocks.
  - Les produits les plus ajoutés/retirés récemment.

### 6. Sauvegarde et export des données
Exporter un rapport de produit sous format PDF en utilisant `expo-print`.

## Configuration de la partie Backend

Un fichier `db.json` est à votre disposition dans les ressources. Suivez ces étapes pour démarrer :

1. Se déplacer vers le répertoire où se trouve le fichier `db.json`.
2. Installer `json-server` globalement :
   ```bash
   npm i -g json-server
3. Démarrer le serveur avec la commande :
   ```bash
   npx json-server db.json



## Installation et démarrage de l'application

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
