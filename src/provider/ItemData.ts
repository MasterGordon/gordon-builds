export interface Item {
  id: number;
  key: string;
  name?: string | null;
  description?: DescriptionEntityOrEntity[] | null | string;
  notes?: (string | null)[] | null;
  lore?: string | null;
  recipe: boolean;
  cost?: number | string;
  home_shop: boolean;
  side_shop: boolean;
  secret_shop: boolean;
  cooldown?: number | null;
  mana_cost?: number | null;
  custom_attributes?: (CustomAttributesEntity | null)[] | null;
  requirements?: (string | null)[] | null;
  upgrades?: (string | null)[] | null;
}
export interface DescriptionEntityOrEntity {
  type: string;
  header?: string | null;
  body?: string[] | null;
}
export interface CustomAttributesEntity {
  key: string;
  value?: number | number[] | null;
  scepter: boolean;
  header: string;
  prefix?: string | null;
  suffix?: string | null;
}
