export const POPULAR_FOOD_NAMES = [
  // Makanan Tradisional Indonesia
  'Nasi Goreng',
  'Soto Ayam',
  'Rendang',
  'Gado-Gado',
  'Sate Ayam',
  'Bakso',
  'Mie Ayam',
  'Nasi Uduk',
  'Nasi Padang',
  'Ayam Bakar',
  'Ikan Bakar',
  'Pecel Lele',
  'Soto Mie',
  'Rawon',
  'Gulai Kambing',
  'Karedok',
  'Lontong Sayur',
  'Nasi Liwet',
  'Tongseng',
  'Gudeg',

  // Makanan Modern/International
  'Pizza Margherita',
  'Spaghetti Carbonara',
  'Hamburger',
  'Chicken Teriyaki',
  'Sushi Roll',
  'Salmon Teriyaki',
  'Pasta Bolognese',
  'Fish and Chips',
  'Fried Chicken',
  'Beef Steak',
  'Caesar Salad',
  'Tom Yum Soup',
  'Pad Thai',
  'Kimchi Fried Rice',
  'Tacos',
  'Burrito Bowl',

  // Dessert
  'Es Krim',
  'Pancake',
  'Waffle',
  'Cheesecake',
  'Tiramisu',
  'Creme Brulee',
  'Brownies',
  'Chocolate Lava Cake',
  'Fruit Tart',
  'Mochi',
  'Dango',
  'Red Velvet Cake',

  // Minuman
  'Es Teh Manis',
  'Kopi Hitam',
  'Jus Alpukat',
  'Smoothie Bowl',
  'Bubble Tea',
  'Lemon Tea',
  'Cendol',
  'Es Campur'
];

export const FOOD_CATEGORIES = [
  {
    name: 'Makanan Tradisional',
    items: [
      'Nasi Goreng', 'Soto Ayam', 'Rendang', 'Gado-Gado', 'Sate Ayam',
      'Bakso', 'Mie Ayam', 'Nasi Uduk', 'Ayam Bakar', 'Ikan Bakar'
    ]
  },
  {
    name: 'Makanan Modern',
    items: [
      'Pizza Margherita', 'Spaghetti Carbonara', 'Hamburger', 'Chicken Teriyaki',
      'Sushi Roll', 'Pasta Bolognese', 'Fish and Chips', 'Beef Steak'
    ]
  },
  {
    name: 'Dessert',
    items: [
      'Es Krim', 'Pancake', 'Waffle', 'Cheesecake', 'Tiramisu',
      'Chocolate Lava Cake', 'Red Velvet Cake', 'Fruit Tart'
    ]
  },
  {
    name: 'Minuman',
    items: [
      'Es Teh Manis', 'Kopi Hitam', 'Jus Alpukat', 'Smoothie Bowl',
      'Bubble Tea', 'Lemon Tea', 'Cendol'
    ]
  }
];

export const getFoodSuggestions = (query: string): string[] => {
  const lowerQuery = query.toLowerCase();
  return POPULAR_FOOD_NAMES.filter(food =>
    food.toLowerCase().includes(lowerQuery)
  ).slice(0, 8); // Limit to 8 suggestions
};