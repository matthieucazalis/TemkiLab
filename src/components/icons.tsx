import {
  Butterfly,
  Globe,
  GlobeCross,
  Lock,
  Phone,
} from "@getpapillon/papicons";

// Point unique pour les icônes du site (jeu Papicons, licence MIT).
// Pour changer une icône, on ne modifie que cette table.
const ICONS = {
  logo: Butterfly,
  security: Lock,
  mobile: Phone,
  language: Globe,
  offline: GlobeCross,
} as const;

export type AppIconName = keyof typeof ICONS;

// La couleur « currentColor » suit le texte : thème clair/sombre automatique.
export function AppIcon({
  name,
  size = 20,
}: {
  name: AppIconName;
  size?: number;
}) {
  const Icon = ICONS[name];
  return <Icon size={size} color="currentColor" />;
}
