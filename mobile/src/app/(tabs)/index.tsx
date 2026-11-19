import { ScrollView, StyleSheet } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Carte } from "@/components/Carte";
import { Texte } from "@/components/Texte";
import { useAuth } from "@/context/auth";
import { usePreferences } from "@/context/preferences";

// Écran d'accueil : point de départ à remplacer par les écrans de ton projet.
export default function EcranAccueil() {
  const { t } = usePreferences();
  const { utilisateur, serveur } = useAuth();
  const nom = utilisateur?.name ?? "";

  return (
    <ScrollView contentContainerStyle={styles.contenu}>
      <Carte>
        <Avatar nom={nom} source={utilisateur?.avatar} taille={56} />
        <Texte variante="sousTitre">{t("accueil.bienvenue", { nom })}</Texte>
        <Texte variante="doux">{t("accueil.texte")}</Texte>
        <Texte variante="petit">
          {t("accueil.serveur", { adresse: serveur })}
        </Texte>
      </Carte>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: 16, gap: 12 },
});
