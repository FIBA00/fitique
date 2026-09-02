const image = (id, options = "auto=format&fit=crop&w=900&q=84") =>
  ["https://images.unsplash.com/", id, "?", options].join("");

export const mockOrders = [
  {
    id: "FTQ-20841",
    date: "Aug 18, 2026",
    status: "Out for Delivery",
    total: 174,
    items: [
      {
        productId: "eloise-ribbed-midi",
        name: "Eloise Ribbed Midi",
        image: "/manus-storage/fitique-new-arrival_4e1c8edb.jpg",
        size: "M",
        color: "Lilac",
        quantity: 1,
        price: 128,
      },
      {
        productId: "maris-silk-scarf",
        name: "Maris Silk Scarf",
        image: image("photo-1601924994987-69e26d50dc26"),
        size: "One size",
        color: "Blackberry",
        quantity: 1,
        price: 42,
      },
    ],
    delivery: {
      method: "Boutique delivery",
      window: "Today, 1:00–4:00 PM",
      address: "29 Grove Street, Brooklyn, NY 11211",
    },
  },
  {
    id: "FTQ-20497",
    date: "Jul 30, 2026",
    status: "Delivered",
    total: 112,
    items: [
      {
        productId: "madeleine-slingback",
        name: "Madeleine Slingback",
        image: image("photo-1543163521-1bf539c55dd2"),
        size: "39",
        color: "Soft Brown",
        quantity: 1,
        price: 112,
      },
    ],
    delivery: {
      method: "Boutique delivery",
      window: "Delivered Jul 31",
      address: "29 Grove Street, Brooklyn, NY 11211",
    },
  },
];
