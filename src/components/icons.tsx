import {
  Bookmark,
  Camera,
  Gallery,
  Gears,
  Globe,
  GlobeCross,
  Grid,
  Info,
  Lock,
  Login,
  Logout,
  Moon,
  Phone,
  Plus,
  Sun,
  User,
} from "@getpapillon/papicons";

// Point unique pour les icônes du site (jeu Papicons, licence MIT).
// Pour changer une icône, on ne modifie que cette table.
const ICONS = {
  logo: Camera,
  security: Lock,
  mobile: Phone,
  language: Globe,
  offline: GlobeCross,
  simulator: Gallery,
  setups: Bookmark,
  settings: Gears,
  profile: User,
  login: Login,
  logout: Logout,
  add: Plus,
  grid: Grid,
  info: Info,
  sun: Sun,
  moon: Moon,
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
