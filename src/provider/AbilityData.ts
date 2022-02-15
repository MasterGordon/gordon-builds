export interface Ability {
  id: number;
  key: string;
  name: string;
  type: string;
  description?: string[] | string;
  notes?: string[];
  has_scepter_upgrade?: boolean;
  is_granted_by_scepter?: boolean;
  damage_type?: string;
  custom_attributes?: CustomAttribute[];
  team_target?: string;
  unit_targets?: string[];
  pierces_spell_immunity?: boolean;
  cast_range?: number[];
  cast_point?: number[];
  cooldown?: number[];
  mana_cost?: number[];
  lore?: string;
  channel_time?: number[];
  damage?: number[];
  duration?: number[];
}

export interface CustomAttribute {
  key: string;
  value?: number[];
  scepter: boolean;
  header: string;
  suffix?: string;
  prefix?: string;
}
