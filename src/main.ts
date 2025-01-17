import { MultiplexCard } from './multiplex-card.ts';
import { MultiplexEditor } from './multiplex-editor.ts';

customElements.define('multiplex-card', MultiplexCard);
customElements.define('multiplex-card-editor', MultiplexEditor);

customCards ||= [];
customCards.push({
  type: 'multiplex-card',
  name: 'Multiplex',
  description: 'Choose between multiple cards based on an input_select value',
  preview: true,
});

