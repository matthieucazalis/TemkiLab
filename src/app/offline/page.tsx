import { AppIcon } from "@/components/icons";
import { getT } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("common.offlineTitle") };
}

const STYLE = `
.off-wrap{
  --off-bg:#f5f3fb;--off-fg:#2a2940;--off-muted:#66647f;
  --off-border:#dedaee;--off-primary:#afbdf1;--off-primary-fg:#252440;
  min-height:100vh;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:16px;padding:24px;text-align:center;
  background:var(--off-bg);color:var(--off-fg);
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
}
@media (prefers-color-scheme:dark){
  html:not(.light) .off-wrap{
    --off-bg:#1e1d2d;--off-fg:#eceaf7;--off-muted:#a9a7c3;
    --off-border:#3d3c55;--off-primary:#eceaf7;--off-primary-fg:#1e1d2d;
  }
}
html.dark .off-wrap{
  --off-bg:#1e1d2d;--off-fg:#eceaf7;--off-muted:#a9a7c3;
  --off-border:#3d3c55;--off-primary:#eceaf7;--off-primary-fg:#1e1d2d;
}
.off-card{
  max-width:360px;width:100%;display:flex;flex-direction:column;
  align-items:center;gap:12px;padding:32px 24px;
  border:1px solid var(--off-border);border-radius:16px;
}
.off-icon{display:inline-flex;color:var(--off-muted)}
.off-title{margin:0;font-size:22px;font-weight:700}
.off-text{margin:0;font-size:14px;line-height:1.5;color:var(--off-muted)}
.off-btn{
  margin-top:8px;display:inline-block;padding:9px 18px;border-radius:10px;
  background:var(--off-primary);color:var(--off-primary-fg);
  font-size:14px;font-weight:600;text-decoration:none;
}
.off-btn:focus-visible{outline:2px solid var(--off-primary);outline-offset:2px}
`;

export default async function OfflinePage() {
  const t = await getT();
  return (
    <main id="main-content" className="off-wrap">
      <style>{STYLE}</style>
      <div className="off-card">
        <span className="off-icon" aria-hidden="true">
          <AppIcon name="offline" size={44} />
        </span>
        <h1 className="off-title">{t("common.offlineTitle")}</h1>
        <p className="off-text">{t("common.offlineText")}</p>
        {/* Lien classique voulu : on veut une vraie navigation, pas une
            transition côté client, qui échouerait sans réseau. */}
        <a href="/dashboard" className="off-btn">
          {t("common.retry")}
        </a>
      </div>
    </main>
  );
}
