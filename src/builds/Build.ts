interface Item {
  key: string;
  description?: string;
}

export interface Build {
  name: string;
  slug: string;
  description: string;
  version: string;
  heroKey: string;
  skills: [string, string, string, string, string, string];
  talents: [string, string];
  items: { [category: string]: Item[] };
}
