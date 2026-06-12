import FlagEC from './FlagEC.astro';
import FlagCO from './FlagCO.astro';
import FlagBR from './FlagBR.astro';
import FlagPA from './FlagPA.astro';
import FlagPE from './FlagPE.astro';

/** Destination slug (content collection id) → flag component. */
export const FLAGS = {
  ecuador: FlagEC,
  colombia: FlagCO,
  brasil: FlagBR,
  panama: FlagPA,
  peru: FlagPE,
} as const;

export type DestinationSlug = keyof typeof FLAGS;

/** Fail the build loudly if a guide is added without a flag. */
export function flagFor(slug: string) {
  const flag = FLAGS[slug as DestinationSlug];
  if (!flag) {
    throw new Error(
      `No flag component for destination slug "${slug}" — add it to src/components/flags/index.ts`
    );
  }
  return flag;
}
