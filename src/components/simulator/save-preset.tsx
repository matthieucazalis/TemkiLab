"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { savePresetAction } from "@/app/(app)/setups/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n/client";
import type { SimulatorState } from "@/lib/validators/simulator";

// « Enregistrer ce setup » : envoie l'état courant, le boîtier et l'objectif
// au serveur, qui revalide tout avant de l'écrire en base.
export function SavePreset({
  sim,
  lensId,
  profileId,
}: {
  sim: SimulatorState;
  lensId: string | null;
  profileId: string | null;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ error?: string; success?: string }>();
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const outcome = await savePresetAction({
        name,
        state: sim,
        lensId,
        cameraProfileId: profileId,
      });
      setResult(outcome);
      if (outcome.success) setName("");
    });
  }

  return (
    <section aria-labelledby="save-preset-title" className="space-y-2">
      <h2 id="save-preset-title" className="text-sm font-semibold">
        {t("setups.save.title")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Label htmlFor="preset-name" className="sr-only">
          {t("setups.save.label")}
        </Label>
        <div className="flex gap-2">
          <Input
            id="preset-name"
            value={name}
            maxLength={60}
            placeholder={t("setups.save.placeholder")}
            onChange={(event) => setName(event.target.value)}
          />
          <Button type="submit" disabled={pending}>
            {pending ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
      {result?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p role="status" className="text-sm text-green-600 dark:text-green-400">
          {result.success}{" "}
          <Link href="/setups" className="underline underline-offset-4">
            {t("setups.save.viewAll")}
          </Link>
        </p>
      )}
    </section>
  );
}
