export interface MenuItem {
  id: string;
  name: string;
  price: number;
  tags?: string[];
  description?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    name: "Small Plates",
    items: [
      { id: "kao-geab", name: "Kao Geab", price: 3.95, tags: ["GF"], description: "Prawn crackers & sriracha" },
      { id: "vegan-crackers", name: "Vegan Crackers", price: 3.75, tags: ["VE", "GF"], description: "Sweet chilli sauce" },
      { id: "roti-satay", name: "Roti Satay", price: 4.95, tags: ["VE"], description: "Soft flat bread & satay dip" },
      { id: "tom-yum-fries", name: "Tom Yum Fries", price: 4.95, description: "Spicy fries, shallots, herbs & chillies" },
      { id: "mee-pad", name: "Mee Pad", price: 6.95, tags: ["V"], description: "Stir-fried egg noodles, vegs, soya, sesame oil & crispy garlic" },
      { id: "kang-pong-hom", name: "Kang Pong Hom", price: 6.75, tags: ["VE", "GF"], description: "Thai onion fritters, kaffir lime with sweet chilli, peanut & cucumber dip" },
      { id: "bang-bang-cauliflower", name: "Bang Bang Cauliflower", price: 6.95, tags: ["VE"], description: "Panko-coated fried cauliflower, tossed in spicy gochujang sauce, sesame & shichimi chili" },
      { id: "gyoza-panang", name: "Gyoza Panang", price: 7.50, tags: ["VE"], description: "Fried gyoza, crispy shallots & panang" },
      { id: "greens-garlic", name: "Greens & Garlic", price: 7.50, description: "Stir-fried vegs, oyster sauce & garlic" },
      { id: "hed-jau", name: "Hed Jau", price: 7.75, tags: ["VE"], description: "Crispy tofu rolls, rice noodles, taro, carrots, shitake with chili & apricot dip" },
      { id: "pak-sam-yang", name: "Pak Sam Yang", price: 7.95, tags: ["VE"], description: "Mixed fritters: sweet corn, taro, sweet potato & sweet chilli sauce" },
      { id: "kanom-jeeb-goong", name: "Kanom Jeeb Goong", price: 7.95, description: "Prawn dumplings with vegs, fried garlic & soya vinaigrette dip" },
      { id: "samchun-jimjaew", name: "Samchun Jimjaew", price: 8.75, description: "Crispy pork belly, sesame & namjim jaew" },
      { id: "satay-gai", name: "Satay Gai", price: 8.75, tags: ["GF"], description: "Chicken thighs marinated in mild curry & peanut sauce" },
      { id: "gai-narok", name: "Gai Narok", price: 8.75, description: "Thai-style hot wings & sweet chilli sauce" },
      { id: "muek-kua-prik", name: "Muek Kua Prik", price: 8.95, description: "Crispy squid, chillies, garlic & sriracha" },
    ],
  },
  {
    name: "Salads",
    items: [
      { id: "yum-mamuang", name: "Yum Mamuang", price: 12.95, tags: ["GF"], description: "Spicy mango salad, prawns, onion, tomatoes, mint, coconut flakes, cashew nuts & crispy shallots" },
    ],
  },
  {
    name: "Stir Fried",
    items: [
      { id: "keemao-tofu", name: "Keemao Tofu", price: 12.50, tags: ["VE"], description: "Spicy tofu, vegs, basil & rice" },
      { id: "krapao-bolan", name: "Krapao Bolan", price: 12.95, description: "Spicy stir-fried minced pork, basil, fried egg & rice" },
      { id: "gai-kratiem-prik-thai", name: "Gai Kratiem Prik Thai", price: 13.50, description: "Stir-fried chicken, garlic, pepper, rice, sriracha & mini Asian salad" },
    ],
  },
  {
    name: "Noodles",
    items: [
      { id: "padmee-taohoo", name: "Padmee Taohoo", price: 12.50, tags: ["V"], description: "Stir-fried egg noodles, tofu, vegs, soya, sesame oil & crispy garlic" },
      { id: "laksa-jay", name: "Laksa Jay", price: 13.75, tags: ["VE", "GF"], description: "Coconut veg curry soup & rice noodles" },
      { id: "senmee-sie-ew", name: "Senmee Sie Ew", price: 13.95, description: "Stir-fried rice noodles, chicken, egg, vegs & soy sauce" },
      { id: "kao-soi", name: "Kao Soi", price: 13.95, description: "Egg noodle curry, chicken thighs, lime, pickled cabbage, shallots & chilli oil" },
      { id: "udon-goong", name: "Udon Goong", price: 14.50, description: "Stir-fried udon noodles, prawns, vegs, sesame, soya, garlic & chili" },
      { id: "padthai-ruammit", name: "Padthai Ruammit", price: 14.95, tags: ["GF"], description: "Stir-fried rice noodles, chicken, prawns, egg, tofu, beansprouts, spring onion, carrots, peanuts & lime" },
      { id: "singapore-talay", name: "Singapore Talay", price: 14.95, description: "Vermicelli noodles, prawns, squid, egg, curry powder, ginger, chillies, vegs, sesame, shallots & lime" },
    ],
  },
  {
    name: "Curries (served without rice)",
    items: [
      { id: "gang-masaman", name: "Gang Masaman", price: 12.95, tags: ["VE", "GF"], description: "Chickpeas, potatoes, onion, herbs, peanuts & crispy shallots" },
      { id: "gangphed-jay", name: "Gangphed Jay", price: 12.95, tags: ["VE", "GF"], description: "Red curry, tofu, vegs & herbs" },
      { id: "wan-gluay", name: "Wan Gluay", price: 13.95, tags: ["GF"], description: "Green curry, chicken, plantain, bamboo shoots, aubergine & herbs" },
      { id: "panang-mootord", name: "Panang Mootord", price: 13.95, tags: ["Incl. Rice"], description: "Crispy pork belly, panang sauce, rice & spicy Thai carrot slaw" },
      { id: "gaitord-satay", name: "Gaitord Satay Sauce", price: 13.95, tags: ["Incl. Rice"], description: "Fried chicken, rice & satay sauce" },
      { id: "gang-garee-goong", name: "Gang Garee Goong", price: 15.50, tags: ["GF"], description: "Yellow curry, prawns, potatoes, tomatoes, cucumber relish & roti" },
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
