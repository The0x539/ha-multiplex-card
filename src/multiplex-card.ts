/// <reference path="./helpers.ts" />

import type { MultiplexCardConfig } from "./config.ts";
import type { HomeAssistant } from "home-assistant/types";
import type { LovelaceCard } from "home-assistant/panels/lovelace/types";

export class MultiplexCard extends HTMLElement {
  private _hass!: HomeAssistant;
  private childCards: Map<string, LovelaceCard> = new Map();
  private entityId?: string;

  public set hass(hass: HomeAssistant) {
    for (const child of this.childCards.values()) {
      child.hass = hass;
    }

    const oldKey = this.currentKey();
    this._hass = hass;
    if (this.currentKey() !== oldKey) {
      this.selectChild();
    }
  }

  public setConfig(config: MultiplexCardConfig): void {
    this.entityId = config.entity;
    this.rebuildCards(config);
  }

  private currentKey(): string {
    if (!this.entityId) return "";
    if (!this._hass.states[this.entityId]) return "";
    return this._hass.states[this.entityId].state;
  }

  private async rebuildCards(config: MultiplexCardConfig): Promise<void> {
    const cardHelpers = await loadCardHelpers();

    const childCards = new Map();

    config.cards ??= {};
    for (const [key, childConfig] of Object.entries(config.cards)) {
      const element = cardHelpers.createCardElement(childConfig);
      element.hass = this.hass;
      childCards.set(key, element);
    }

    this.childCards = childCards;
    this.selectChild();
  }

  private selectChild(): void {
    this.replaceChildren();

    const child = this.childCards.get(this.currentKey());
    if (child) {
      this.appendChild(child);
    }
  }
}
