export interface Item {
  id: number;
  key: string;
  name: string;
  description?: Description[];
  notes?: string[];
  lore?: string;
  recipe: boolean;
  cost?: number | string;
  home_shop: boolean;
  side_shop: boolean;
  secret_shop: boolean;
  cooldown?: number;
  mana_cost?: number;
  custom_attributes?: CustomAttributesEntity[];
  requirements?: string[];
  upgrades?: string[];
}
export interface Description {
  type: string;
  header?: string;
  body?: string[];
}
export interface CustomAttributesEntity {
  key: string;
  value?: number | number[];
  scepter: boolean;
  header: string;
  prefix?: string;
  suffix?: string;
}
