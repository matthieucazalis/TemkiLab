import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { Chargement } from "@/components/Etats";
import { AuthProvider, useAuth } from "@/context/auth";
import { PreferencesProvider, usePreferences } from "@/context/preferences";

// Les « providers » partagent les préférences et la session avec tous les
// écrans. Ajoute ici tes propres providers (ex. un contexte de données).
export default function RootLayout() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PreferencesProvider>
  );
}

function Navigation() {
  const { schema, couleurs, t, pretes } = usePreferences();
  const { pret, jeton } = useAuth();

  if (!pret || !pretes) return <Chargement />;

  const base = schema === "sombre" ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: couleurs.fond,
      card: couleurs.carte,
      text: couleurs.texte,
      border: couleurs.bordure,
      primary: couleurs.primaire,
    },
  };
  const options = {
    headerStyle: { backgroundColor: couleurs.carte },
    headerTintColor: couleurs.texte,
    contentStyle: { backgroundColor: couleurs.fond },
  };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={schema === "sombre" ? "light" : "dark"} />
      <Stack screenOptions={options}>
        {/* Écrans protégés : sans jeton, ils sont retirés de la pile et
            l'utilisateur est renvoyé vers l'écran de connexion (et inversement). */}
        <Stack.Protected guard={!!jeton}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!jeton}>
          <Stack.Screen
            name="connexion"
            options={{ title: t("connexion.titre"), headerShown: false }}
          />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
