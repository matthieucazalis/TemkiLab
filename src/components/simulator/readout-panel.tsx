"use client";

import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { formatShutter, type Readout } from "@/lib/simulator/readout";

export function ReadoutPanel({
  readout,
  warnings,
}: {
  readout: Readout;
  warnings: string[];
}) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];
  const number = (value: number) =>
    value.toLocaleString(tag, { maximumFractionDigits: 1 });

  const items = [
    {
      label: t("simulator.readout.focalEq"),
      value: `${number(readout.focalEq)} mm`,
    },
    {
      label: t("simulator.readout.apertureEq"),
      value: `f/${number(readout.apertureEq)}`,
    },
    {
      label: t("simulator.readout.minShutter"),
      value: formatShutter(readout.minShutterSeconds, tag),
    },
  ];

  return (
    <section
      aria-label={t("simulator.readout.title")}
      className="space-y-3 rounded-lg border p-5"
    >
      <h2 className="font-semibold">{t("simulator.readout.title")}</h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="text-xl font-semibold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        {t("simulator.readout.minShutterHelp")}
      </p>

      {warnings.length > 0 && (
        <ul role="status" className="space-y-1 text-sm text-destructive">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
