export interface MenuItem {
  id: string;
  name: string;
  price: number;
  tags?: string[];
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    name: "Small Plates",
    items: [
      { id: "kao-geab", name: "Kao Geab", price: 3.95, tags: ["GF"] },
      { id: "vegan-crackers", name: "Vegan Crackers", price: 3.75, tags: ["VE", "GF"] },
      { id: "roti-satay", name: "Roti Satay", price: 4.95, tags: ["VE"] },
      { id: "tom-yum-fries", name: "Tom Yum Fries", price: 4.95 },
      { id: "mee-pad", name: "Mee Pad", price: 6.95, tags: ["V"] },
      { id: "kang-pong-hom", name: "Kang Pong Hom", price: 6.75, tags: ["VE", "GF"] },
      { id: "bang-bang-cauliflower", name: "Bang Bang Cauliflower", price: 6.95, tags: ["VE"] },
      { id: "gyoza-panang", name: "Gyoza Panang", price: 7.50, tags: ["VE"] },
      { id: "greens-garlic", name: "Greens & Garlic", price: 7.50 },
      { id: "hed-jau", name: "Hed Jau", price: 7.75, tags: ["VE"] },
      { id: "pak-sam-yang", name: "Pak Sam Yang", price: 7.95, tags: ["VE"] },
      { id: "kanom-jeeb-goong", name: "Kanom Jeeb Goong", price: 7.95 },
      { id: "samchun-jimjaew", name: "Samchun Jimjaew", price: 8.75 },
      { id: "satay-gai", name: "Satay Gai", price: 8.75, tags: ["GF"] },
      { id: "gai-narok", name: "Gai Narok", price: 8.75 },
      { id: "muek-kua-prik", name: "Muek Kua Prik", price: 8.95 },
    ],
  },
  {
    name: "Salads",
    items: [
      { id: "yum-mamuang", name: "Yum Mamuang", price: 12.95, tags: ["GF"] },
    ],
  },
  {
    name: "Stir Fried",
    items: [
      { id: "keemao-tofu", name: "Keemao Tofu", price: 12.50, tags: ["VE"] },
      { id: "krapao-bolan", name: "Krapao Bolan", price: 12.95 },
      { id: "gai-kratiem-prik-thai", name: "Gai Kratiem Prik Thai", price: 13.50 },
    ],
  },
  {
    name: "Noodles",
    items: [
      { id: "padmee-taohoo", name: "Padmee Taohoo", price: 12.50, tags: ["V"] },
      { id: "laksa-jay", name: "Laksa Jay", price: 13.75, tags: ["VE", "GF"] },
      { id: "senmee-sie-ew", name: "Senmee Sie Ew", price: 13.95 },
      { id: "kao-soi", name: "Kao Soi", price: 13.95 },
      { id: "udon-goong", name: "Udon Goong", price: 14.50 },
      { id: "padthai-ruammit", name: "Padthai Ruammit", price: 14.95, tags: ["GF"] },
      { id: "singapore-talay", name: "Singapore Talay", price: 14.95 },
    ],
  },
  {
    name: "Curries (served without rice)",
    items: [
      { id: "gang-masaman", name: "Gang Masaman", price: 12.95, tags: ["VE", "GF"] },
      { id: "gangphed-jay", name: "Gangphed Jay", price: 12.95, tags: ["VE", "GF"] },
      { id: "wan-gluay", name: "Wan Gluay", price: 13.95, tags: ["GF"] },
      { id: "panang-mootord", name: "Panang Mootord", price: 13.95, tags: ["Incl. Rice"] },
      { id: "gaitord-satay", name: "Gaitord Satay Sauce", price: 13.95, tags: ["Incl. Rice"] },
      { id: "gang-garee-goong", name: "Gang Garee Goong", price: 15.50, tags: ["GF"] },
    ],
  },
  {
    name: "Extras",
    items: [
      { id: "roti", name: "Roti", price: 2.95 },
      { id: "jasmine-rice", name: "Jasmine Rice", price: 3.50, tags: ["GF"] },
      { id: "fried-egg", name: "Fried Egg", price: 2.50 },
      { id: "coconut-rice", name: "Coconut Rice", price: 4.50, tags: ["GF"] },
      { id: "egg-fried-rice", name: "Egg Fried Rice & Vegs", price: 6.50, tags: ["V"] },
      { id: "extra-dip", name: "Extra Dip", price: 1.00 },
    ],
  },
];

export const allItems: MenuItem[] = menu.flatMap((cat) => cat.items);

export function getItemById(id: string): MenuItem | undefined {
  return allItems.find((item) => item.id === id);
}
