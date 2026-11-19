import { Tabs } from "expo-router/tabs";
import { Icone } from "@/components/Icones";
import { usePreferences } from "@/context/preferences";

// Deux onglets de base : Accueil et Profil. Ajoute tes écrans avec un nouveau
// fichier dans ce dossier et un <Tabs.Screen> ci-dessous.
export default function MiseEnPageOnglets() {
  const { t, couleurs } = usePreferences();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: couleurs.carte },
        headerTintColor: couleurs.texte,
        tabBarActiveTintColor: couleurs.primaire,
        tabBarInactiveTintColor: couleurs.texteDoux,
        tabBarStyle: {
          backgroundColor: couleurs.carte,
          borderTopColor: couleurs.bordure,
        },
        sceneStyle: { backgroundColor: couleurs.fond },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("onglets.accueil"),
          headerTitle: t("accueil.titre"),
          tabBarIcon: ({ color, size }) => (
            <Icone nom="accueil" taille={size} couleur={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t("onglets.profil"),
          tabBarIcon: ({ color, size }) => (
            <Icone nom="profil" taille={size} couleur={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
