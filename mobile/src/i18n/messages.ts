// Les trois langues côte à côte : `en` et `de` sont typées sur la forme du
// français, donc une traduction oubliée est une erreur de compilation.
type ChainesProfondes<T> = {
  [K in keyof T]: T[K] extends string ? string : ChainesProfondes<T[K]>;
};

const fr = {
  commun: {
    chargement: "Chargement…",
    reessayer: "Réessayer",
    annuler: "Annuler",
    ok: "OK",
    rechercher: "Rechercher",
    effacer: "Effacer",
  },
  erreurs: {
    reseau:
      "Impossible de joindre le serveur. Vérifie son adresse et que le téléphone est sur le même Wi-Fi.",
    delai: "Le serveur met trop de temps à répondre.",
    non_authentifie: "Ta session a expiré. Reconnecte-toi.",
    identifiants: "Email ou mot de passe incorrect.",
    trop_de_tentatives: "Trop de tentatives. Réessaie dans quelques minutes.",
    introuvable: "Élément introuvable.",
    conflit: "Ce changement n'est pas autorisé dans l'état actuel.",
    validation: "Certains champs sont invalides.",
    image: "Image refusée (format ou taille).",
    serveur: "Erreur du serveur. Réessaie plus tard.",
    inconnue: "Une erreur est survenue.",
  },
  connexion: {
    titre: "Connexion",
    sousTitre: "Connecte-toi à ton serveur TemkiLab.",
    serveur: "Adresse du serveur",
    serveurAide: "Ex. : 192.168.1.42:3000 (ton ordinateur, sur le même Wi-Fi).",
    email: "Email",
    motDePasse: "Mot de passe",
    seConnecter: "Se connecter",
    enCours: "Connexion…",
    adresseInvalide: "Adresse du serveur invalide.",
    champsRequis: "Saisis ton email et ton mot de passe.",
  },
  onglets: {
    accueil: "Accueil",
    profil: "Profil",
  },
  accueil: {
    titre: "Accueil",
    bienvenue: "Bienvenue, {nom} !",
    texte:
      "Ton application est connectée au serveur. Remplace cet écran par ceux de ton projet.",
    serveur: "Serveur : {adresse}",
  },
  profil: {
    photo: "Photo de profil",
    appareilPhoto: "Appareil photo",
    galerie: "Galerie",
    supprimerPhoto: "Supprimer la photo",
    reglages: "Réglages",
    permissionRefusee: "Appareil photo refusé",
    permissionRefuseeTexte:
      "Autorise l'appareil photo dans les réglages du téléphone pour prendre une photo.",
    photoEnregistree: "Photo enregistrée.",
    photoSupprimee: "Photo supprimée.",
    serveur: "Serveur",
    langue: "Langue",
    apparence: "Apparence",
    clair: "Clair",
    sombre: "Sombre",
    systeme: "Système",
    vibrations: "Vibrations",
    vibrationsAide: "Fait vibrer le téléphone quand une action est confirmée.",
    activees: "Activées",
    desactivees: "Désactivées",
    deconnexion: "Se déconnecter",
    deconnexionConfirmation:
      "Tu devras te reconnecter pour retrouver ton compte.",
  },
};

const en: ChainesProfondes<typeof fr> = {
  commun: {
    chargement: "Loading…",
    reessayer: "Try again",
    annuler: "Cancel",
    ok: "OK",
    rechercher: "Search",
    effacer: "Clear",
  },
  erreurs: {
    reseau:
      "Cannot reach the server. Check its address and that the phone is on the same Wi-Fi.",
    delai: "The server is taking too long to respond.",
    non_authentifie: "Your session has expired. Sign in again.",
    identifiants: "Incorrect email or password.",
    trop_de_tentatives: "Too many attempts. Try again in a few minutes.",
    introuvable: "Item not found.",
    conflit: "This change is not allowed in the current state.",
    validation: "Some fields are invalid.",
    image: "Image rejected (format or size).",
    serveur: "Server error. Try again later.",
    inconnue: "Something went wrong.",
  },
  connexion: {
    titre: "Sign in",
    sousTitre: "Sign in to your TemkiLab server.",
    serveur: "Server address",
    serveurAide: "E.g. 192.168.1.42:3000 (your computer, on the same Wi-Fi).",
    email: "Email",
    motDePasse: "Password",
    seConnecter: "Sign in",
    enCours: "Signing in…",
    adresseInvalide: "Invalid server address.",
    champsRequis: "Enter your email and password.",
  },
  onglets: {
    accueil: "Home",
    profil: "Profile",
  },
  accueil: {
    titre: "Home",
    bienvenue: "Welcome, {nom}!",
    texte:
      "Your app is connected to the server. Replace this screen with your project's screens.",
    serveur: "Server: {adresse}",
  },
  profil: {
    photo: "Profile picture",
    appareilPhoto: "Camera",
    galerie: "Gallery",
    supprimerPhoto: "Remove photo",
    reglages: "Settings",
    permissionRefusee: "Camera access denied",
    permissionRefuseeTexte:
      "Allow camera access in the phone settings to take a photo.",
    photoEnregistree: "Photo saved.",
    photoSupprimee: "Photo removed.",
    serveur: "Server",
    langue: "Language",
    apparence: "Appearance",
    clair: "Light",
    sombre: "Dark",
    systeme: "System",
    vibrations: "Vibrations",
    vibrationsAide: "Vibrates the phone when an action is confirmed.",
    activees: "On",
    desactivees: "Off",
    deconnexion: "Sign out",
    deconnexionConfirmation:
      "You will need to sign in again to access your account.",
  },
};

const de: ChainesProfondes<typeof fr> = {
  commun: {
    chargement: "Wird geladen…",
    reessayer: "Erneut versuchen",
    annuler: "Abbrechen",
    ok: "OK",
    rechercher: "Suchen",
    effacer: "Löschen",
  },
  erreurs: {
    reseau:
      "Der Server ist nicht erreichbar. Prüfe die Adresse und ob das Telefon im selben WLAN ist.",
    delai: "Der Server antwortet zu langsam.",
    non_authentifie: "Deine Sitzung ist abgelaufen. Melde dich erneut an.",
    identifiants: "E-Mail oder Passwort falsch.",
    trop_de_tentatives:
      "Zu viele Versuche. Versuche es in einigen Minuten erneut.",
    introuvable: "Eintrag nicht gefunden.",
    conflit: "Diese Änderung ist im aktuellen Zustand nicht erlaubt.",
    validation: "Einige Felder sind ungültig.",
    image: "Bild abgelehnt (Format oder Größe).",
    serveur: "Serverfehler. Versuche es später erneut.",
    inconnue: "Etwas ist schiefgelaufen.",
  },
  connexion: {
    titre: "Anmeldung",
    sousTitre: "Melde dich bei deinem TemkiLab-Server an.",
    serveur: "Serveradresse",
    serveurAide: "Z. B. 192.168.1.42:3000 (dein Computer, im selben WLAN).",
    email: "E-Mail",
    motDePasse: "Passwort",
    seConnecter: "Anmelden",
    enCours: "Anmeldung…",
    adresseInvalide: "Ungültige Serveradresse.",
    champsRequis: "Gib deine E-Mail-Adresse und dein Passwort ein.",
  },
  onglets: {
    accueil: "Start",
    profil: "Profil",
  },
  accueil: {
    titre: "Start",
    bienvenue: "Willkommen, {nom}!",
    texte:
      "Deine App ist mit dem Server verbunden. Ersetze diesen Bildschirm durch die Bildschirme deines Projekts.",
    serveur: "Server: {adresse}",
  },
  profil: {
    photo: "Profilbild",
    appareilPhoto: "Kamera",
    galerie: "Galerie",
    supprimerPhoto: "Foto entfernen",
    reglages: "Einstellungen",
    permissionRefusee: "Kamerazugriff verweigert",
    permissionRefuseeTexte:
      "Erlaube den Kamerazugriff in den Telefoneinstellungen, um ein Foto aufzunehmen.",
    photoEnregistree: "Foto gespeichert.",
    photoSupprimee: "Foto entfernt.",
    serveur: "Server",
    langue: "Sprache",
    apparence: "Darstellung",
    clair: "Hell",
    sombre: "Dunkel",
    systeme: "System",
    vibrations: "Vibrationen",
    vibrationsAide:
      "Lässt das Telefon vibrieren, wenn eine Aktion bestätigt wird.",
    activees: "An",
    desactivees: "Aus",
    deconnexion: "Abmelden",
    deconnexionConfirmation:
      "Du musst dich erneut anmelden, um auf dein Konto zuzugreifen.",
  },
};

export const messages = { fr, en, de };
export type Messages = typeof fr;
