/// <reference path='./helpers.ts' />

import type { MultiplexCardConfig } from './config.ts';

import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';

import type { HomeAssistant } from 'home-assistant/types.ts';
import type { LovelaceCardConfig } from 'home-assistant/data/lovelace/config/card.ts';
import type { HASSDomEvent } from 'home-assistant/common/dom/fire_event.ts';
import type { ConfigChangedEvent } from 'home-assistant/panels/lovelace/editor/hui-element-editor.ts'

export class MultiplexEditor extends LitElement {
  @property()
  public accessor hass!: HomeAssistant;

  @property()
  public accessor lovelace: unknown;

  @state()
  private accessor entityId: string = '';

  @state()
  private accessor tabNames: string[] = [];

  @state()
  private accessor childIndex: number = 0;

  @state()
  private accessor childConfigs: Map<string, LovelaceCardConfig> = new Map();

  public setConfig(config: MultiplexCardConfig) {
    this.entityId = config.entity ?? "";
    this.tabNames = this.getOptions(this.entityId);
    this.childConfigs = new Map(Object.entries(config.cards ?? {}));
  }

  public override render(): HTMLTemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .schema=${FORM_SCHEMA}
        .data=${{ "Entity": this.entityId }}
        @value-changed=${this.onFormUpdated}
      ></ha-form>
      <mwc-tab-bar
        .activeIndex=${this.childIndex}
        scrollable
        @MDCTabBar:activated=${this.onTabSelected}
      >
        ${this.tabNames.map((name: string) => html`
          <mwc-tab .label=${name}></mwc-tab>
        `)}
      </mwc-tab-bar>
      ${this.renderChildEditor()}
    `;
  }

  private renderChildEditor(): HTMLTemplateResult {
    if (this.tabNames.length === 0) {
      return html``;
    }

    const childName = this.tabNames[this.childIndex];

    if (this.childConfigs.has(childName)) {
      return html`
        <hui-card-element-editor
          .hass=${this.hass}
          .value=${this.childConfigs.get(childName)}
          .lovelace=${this.lovelace}
          @config-changed=${this.onChildChanged}
        ></hui-card-element-editor>
      `;
    } else {
      return html`
        <hui-card-picker
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          @config-changed=${this.onChildPicked}
        ></hui-card-picker>
      `;
    }
  }

  private getOptions(entityId: string): string[] {
    if (!entityId) return [];
    if (!this.hass) return [];
    if (!this.hass.states[entityId]) return [];
    return this.hass.states[entityId].attributes.options;
  };

  private onFormUpdated(event: CustomEvent): void {
    this.entityId = event.detail.value['Entity'];
    // TODO: figure out what happens when the tab names don't match existing elements
    this.tabNames = this.getOptions(this.entityId ?? "");
    this.fireConfigChanged();
  }

  private onTabSelected(event: CustomEvent): void {
    this.childIndex = event.detail.index;
  }

  private fireConfigChanged(): void {
    const config = {
      type: 'custom:multiplex-card',
      entity: this.entityId,
      cards: Object.fromEntries(this.childConfigs.entries()),
    };
    const options = { bubbles: true, composed: true, detail: { config } };
    this.dispatchEvent(new CustomEvent('config-changed', options));
  }

  private onChildPicked(event: CustomEvent): void {
    event.stopPropagation();
    const key = this.tabNames[this.childIndex];
    this.childConfigs.set(key, event.detail.config);
    this.fireConfigChanged();
  }

  private onChildChanged(event: HASSDomEvent<ConfigChangedEvent>): void {
    event.stopPropagation();
  }
}

const FORM_SCHEMA = [
  { name: 'Entity', selector: { entity: { domain: ['input_select', 'select'] } } },
];
