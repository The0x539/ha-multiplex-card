import { LovelaceCardConfig } from 'home-assistant/data/lovelace/config/card.ts';

export interface MultiplexCardConfig {
  type: string;
  entity?: string;
  cards?: { [key: string]: LovelaceCardConfig };
}
