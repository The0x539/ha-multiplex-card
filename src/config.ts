import { LovelaceCardConfig } from "home-assistant/data/lovelace/config/card";

export interface MultiplexCardConfig {
  type: string;
  entity?: string;
  cards?: { [key: string]: LovelaceCardConfig };
}
