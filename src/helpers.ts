/// <reference lib="dom" />

import type { LovelaceCardConfig } from 'home-assistant/data/lovelace/config/card';
import type { LovelaceCard } from "home-assistant/panels/lovelace/types";

declare global {
  interface Window {
    loadCardHelpers(): Promise<CardHelpers>;
  }

  export function loadCardHelpers(): Promise<CardHelpers>;
}

interface CardHelpers {
  createCardElement(cardConfig: LovelaceCardConfig): LovelaceCard;
}

