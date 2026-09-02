const image = (id, options = "auto=format&fit=crop&w=900&q=84") =>
  ["https://images.unsplash.com/", id, "?", options].join("");

export const categories = [
  {
    id: "women",
    name: "Women",
    description: "Tailored softness, made for every day.",
    image: image("photo-1483985988355-763728e1935b"),
    tone: "lavender",
  },
  {
    id: "men",
    name: "Men",
    description: "Considered essentials with an easy edge.",
    image: image("photo-1492562080023-ab3db95bfbce"),
    tone: "sand",
  },
  {
    id: "kids",
    name: "Kids",
    description: "Small pieces with room to play.",
    image: image("photo-1519238359922-989348752efb"),
    tone: "peach",
  },
  {
    id: "shoes",
    name: "Shoes",
    description: "Finishing touches that go everywhere.",
    image: image("photo-1543163521-1bf539c55dd2"),
    tone: "rose",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "The details that make a look yours.",
    image: image("photo-1584917865442-de89df76afd3"),
    tone: "moss",
  },
];
