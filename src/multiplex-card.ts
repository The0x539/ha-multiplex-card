/// <reference path='./helpers.ts' />

import type { MultiplexCardConfig } from './config.ts';
import type { MultiplexEditor } from './multiplex-editor.ts';

import type { HomeAssistant } from 'home-assistant/types.ts';
import type { LovelaceCard } from 'home-assistant/panels/lovelace/types.ts';
import type { HuiStackCard } from 'home-assistant/panels/lovelace/cards/hui-stack-card.ts';

export class MultiplexCard extends HTMLElement {
  private _hass!: HomeAssistant;
  private childCards: Map<string, LovelaceCard> = new Map();
  private entityId?: string;

  public static async getConfigElement(): Promise<MultiplexEditor> {
    if (!customElements.get('hui-card-picker')) {
      // force home assistant's code to `await import(picker)`
      const ctor = customElements.get('hui-vertical-stack-card') as unknown as typeof HuiStackCard;
      await ctor.getConfigElement();
    }

    return document.createElement('multiplex-card-editor');
  }

  public set hass(hass: HomeAssistant) {
    for (const child of this.childCards.values()) {
      child.hass = hass;
    }

    const oldKey = this.currentKey();
    this._hass = hass;
    // when this is a top-level editor preview,
    // let the editor tabs control which child is selected
    if (this.currentKey() !== oldKey && !this.isPreview()) {
      this.selectChild();
    }
  }

  public setConfig(config: MultiplexCardConfig): void {
    this.entityId = config.entity;
    this.rebuildCards(config);
  }

  private currentKey(): string {
    if (!this.entityId) return "";
    if (!this._hass?.states[this.entityId]) return "";
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

  public selectChild(key?: string): void {
    this.replaceChildren();

    const child = this.childCards.get(key ?? this.currentKey());
    if (child) {
      this.appendChild(child);
    }
  }

  private isPreview(): boolean {
    return this.parentElement?.hasAttribute('preview') ?? false;
  }
}
