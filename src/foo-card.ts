import { LitElement } from 'lit';

@customElement('foo-card')
export class FooCard extends LitElement {
  render() {
    return html`<p>foo</p>`;
  }

  static get styles() {
    return css`
      p {
        color: blue;
      }
    `;
  }
}
