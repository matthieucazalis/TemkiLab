import type { DeepStrings } from "./types";

const fr = {
  footerPrivacy: "Confidentialité",
  footerNotice: "Mentions légales",
  back: "Retour",
  privacyTitle: "Politique de confidentialité",
  updated: "Dernière mise à jour : novembre 2026",
  s1Title: "Responsable du traitement",
  s1Text:
    "TemkiLab est édité par [nom de l'éditeur]. Responsable du traitement : [nom et prénom ou raison sociale], contact : [adresse e-mail].",
  s2Title: "Données collectées",
  s2Text:
    "Nom, adresse e-mail et mot de passe (stocké uniquement sous forme d'empreinte bcrypt) ; photo de profil facultative ; préférences d'affichage (langue, thème, retour haptique) ; compteurs techniques de tentatives de connexion.",
  s3Title: "Finalités et bases légales",
  s3Text:
    "Fournir le service que tu as demandé (exécution du contrat), sécuriser les comptes (intérêt légitime), conserver tes préférences. Aucune donnée n'est vendue, ni utilisée à des fins publicitaires, ni transmise à un tiers à des fins commerciales.",
  s4Title: "Durée de conservation",
  s4Text:
    "Les données du compte sont conservées tant que le compte existe. À la suppression du compte, ton nom, ton e-mail, ta photo et tes préférences sont effacés. Les compteurs de connexion expirent après 15 minutes et les liens de réinitialisation après 1 heure.",
  s5Title: "Tes droits",
  s5Text:
    "Tu peux à tout moment accéder à tes données, les rectifier, les exporter (format JSON) ou supprimer ton compte depuis la page Profil. Tu peux aussi t'adresser au responsable du traitement, et introduire une réclamation auprès de la CNIL (cnil.fr).",
  s6Title: "Cookies",
  s6Text:
    "TemkiLab n'utilise que des cookies strictement nécessaires, qui ne demandent pas de consentement : le cookie de session (connexion) et les cookies de préférence (langue, thème, retour haptique). Aucun cookie de mesure d'audience ou de publicité.",
  s7Title: "Sécurité",
  s7Text:
    "Mots de passe hachés, connexion protégée contre les tentatives répétées, contrôle d'accès vérifié côté serveur, en-têtes de sécurité et transmission chiffrée (HTTPS) en production.",
  noticeTitle: "Mentions légales",
  n1Title: "Éditeur",
  n1Text:
    "[Nom et prénom ou raison sociale de l'éditeur]. Contact : [adresse e-mail].",
  n2Title: "Hébergement",
  n2Text: "[Nom et adresse de l'hébergeur].",
  n3Title: "Nature du site",
  n3Text:
    "Application web fournie sans garantie de disponibilité. [À adapter selon l'usage réel du site.]",
  n4Title: "Propriété intellectuelle",
  n4Text:
    "Le code et les contenus propres à l'application sont la propriété de leur auteur. Les contenus saisis par les utilisateurs restent leur propriété.",
};

const en: DeepStrings<typeof fr> = {
  footerPrivacy: "Privacy",
  footerNotice: "Legal notice",
  back: "Back",
  privacyTitle: "Privacy policy",
  updated: "Last updated: November 2026",
  s1Title: "Data controller",
  s1Text:
    "TemkiLab is published by [publisher name]. Data controller: [name or company name], contact: [e-mail address].",
  s2Title: "Data collected",
  s2Text:
    "Name, e-mail address and password (stored only as a bcrypt hash); optional profile picture; display preferences (language, theme, haptic feedback); technical counters of login attempts.",
  s3Title: "Purposes and legal bases",
  s3Text:
    "To provide the service you requested (performance of a contract), to secure accounts (legitimate interest) and to keep your preferences. No data is sold, used for advertising or passed on to third parties for commercial purposes.",
  s4Title: "Retention",
  s4Text:
    "Account data is kept as long as the account exists. When the account is deleted, your name, e-mail, photo and preferences are erased. Login counters expire after 15 minutes and password reset links after 1 hour.",
  s5Title: "Your rights",
  s5Text:
    "You can at any time access your data, correct it, export it (JSON format) or delete your account from the Profile page. You can also contact the data controller and lodge a complaint with your data protection authority (in France, the CNIL: cnil.fr).",
  s6Title: "Cookies",
  s6Text:
    "TemkiLab only uses strictly necessary cookies, which do not require consent: the session cookie (sign-in) and preference cookies (language, theme, haptic feedback). No analytics or advertising cookies.",
  s7Title: "Security",
  s7Text:
    "Hashed passwords, sign-in protected against repeated attempts, access control enforced on the server, security headers and encrypted transport (HTTPS) in production.",
  noticeTitle: "Legal notice",
  n1Title: "Publisher",
  n1Text: "[Publisher's name or company name]. Contact: [e-mail address].",
  n2Title: "Hosting",
  n2Text: "[Name and address of the host].",
  n3Title: "Nature of the site",
  n3Text:
    "Web application provided without any guarantee of availability. [Adapt to the actual use of the site.]",
  n4Title: "Intellectual property",
  n4Text:
    "The code and content specific to the application belong to their author. Content entered by users remains their property.",
};

const de: DeepStrings<typeof fr> = {
  footerPrivacy: "Datenschutz",
  footerNotice: "Impressum",
  back: "Zurück",
  privacyTitle: "Datenschutzerklärung",
  updated: "Zuletzt aktualisiert: November 2026",
  s1Title: "Verantwortlicher",
  s1Text:
    "TemkiLab wird herausgegeben von [Name des Herausgebers]. Verantwortlicher: [Name oder Firma], Kontakt: [E-Mail-Adresse].",
  s2Title: "Erhobene Daten",
  s2Text:
    "Name, E-Mail-Adresse und Passwort (nur als bcrypt-Hash gespeichert); optionales Profilbild; Anzeigeeinstellungen (Sprache, Design, haptisches Feedback); technische Zähler für Anmeldeversuche.",
  s3Title: "Zwecke und Rechtsgrundlagen",
  s3Text:
    "Bereitstellung des gewünschten Dienstes (Vertragserfüllung), Absicherung der Konten (berechtigtes Interesse) und Speicherung deiner Einstellungen. Keine Daten werden verkauft, für Werbung genutzt oder zu kommerziellen Zwecken an Dritte weitergegeben.",
  s4Title: "Speicherdauer",
  s4Text:
    "Die Kontodaten werden aufbewahrt, solange das Konto besteht. Bei Löschung des Kontos werden Name, E-Mail, Foto und Einstellungen gelöscht. Anmeldezähler laufen nach 15 Minuten ab, Links zum Zurücksetzen des Passworts nach 1 Stunde.",
  s5Title: "Deine Rechte",
  s5Text:
    "Du kannst jederzeit auf deine Daten zugreifen, sie berichtigen, exportieren (JSON-Format) oder dein Konto auf der Profilseite löschen. Du kannst dich außerdem an den Verantwortlichen wenden und dich bei deiner Datenschutzbehörde beschweren (in Frankreich: CNIL, cnil.fr).",
  s6Title: "Cookies",
  s6Text:
    "TemkiLab verwendet nur unbedingt erforderliche Cookies, die keine Einwilligung erfordern: das Sitzungscookie (Anmeldung) und Einstellungscookies (Sprache, Design, haptisches Feedback). Keine Analyse- oder Werbe-Cookies.",
  s7Title: "Sicherheit",
  s7Text:
    "Gehashte Passwörter, Anmeldung mit Schutz vor wiederholten Versuchen, serverseitig erzwungene Zugriffskontrolle, Sicherheits-Header und verschlüsselte Übertragung (HTTPS) im Produktivbetrieb.",
  noticeTitle: "Impressum",
  n1Title: "Herausgeber",
  n1Text: "[Name oder Firma des Herausgebers]. Kontakt: [E-Mail-Adresse].",
  n2Title: "Hosting",
  n2Text: "[Name und Anschrift des Hosters].",
  n3Title: "Art der Website",
  n3Text:
    "Webanwendung ohne Verfügbarkeitsgarantie. [An die tatsächliche Nutzung der Seite anpassen.]",
  n4Title: "Geistiges Eigentum",
  n4Text:
    "Der Code und die anwendungsspezifischen Inhalte gehören ihrem Autor. Von Nutzern eingegebene Inhalte bleiben deren Eigentum.",
};

export const legal = { fr, en, de };
