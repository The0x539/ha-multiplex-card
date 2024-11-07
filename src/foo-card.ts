import { LitElement, CSSResult, HTMLTemplateResult, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('foo-card')
export class FooCard extends LitElement {
  override render(): HTMLTemplateResult {
    return html`<p>foo</p>`;
  }

  static override get styles(): CSSResult {
    return css`
      p {
        color: blue;
      }
    `;
  }

  public setConfig(_config: unknown): void {}
}

console.log('hello');
