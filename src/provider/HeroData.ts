export interface Hero {
  id: number;
  key: string;
  name: string;
  roles?: string[];
  complexity: number;
  primary_attribute: string;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  base_health: number;
  base_mana: number;
  base_health_regen: number;
  base_mana_regen: number;
  attack_type: string;
  attack_range: number;
  attack_rate: number;
  base_attack_min: number;
  base_attack_max: number;
  base_armor: number;
  base_magical_resistance: number;
  movement_speed: number;
  movement_turn_rate: number;
  abilities?: string[];
  talents?: string[];
}