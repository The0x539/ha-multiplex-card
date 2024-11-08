/// <reference lib="dom" />

import type { LovelaceCardConfig } from 'home-assistant/data/lovelace/config/card';
import type { LovelaceCard } from "home-assistant/panels/lovelace/types";
import type { CustomCardEntry } from "home-assistant/data/lovelace_custom_cards";
import type { MultiplexCard } from "./multiplex-card.ts";
import type { MultiplexEditor } from "./multiplex-editor.ts";

declare global {
  interface Window {
    loadCardHelpers(): Promise<CardHelpers>;
  }

  export function loadCardHelpers(): Promise<CardHelpers>;

  export let customCards: CustomCardEntry[] | undefined;

  interface HTMLElementTagNameMap {
    "multiplex-card": MultiplexCard;
    "multiplex-card-editor": MultiplexEditor;
  }
}

interface CardHelpers {
  createCardElement(cardConfig: LovelaceCardConfig): LovelaceCard;
}

