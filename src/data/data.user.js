const image = (id, options = "auto=format&fit=crop&w=900&q=84") =>
  ["https://images.unsplash.com/", id, "?", options].join("");

export const mockUser = {
  name: "Ananya Rao",
  firstName: "Ananya",
  email: "ananya@example.com",
  phone: "+1 (555) 019-2248",
  fitProfile: {
    height: "165 cm",
    preferredSize: "M",
    bodyShape: "Hourglass",
    style: "Soft tailoring",
  },
  addresses: [
    {
      id: "home",
      label: "Home",
      recipient: "Ananya Rao",
      line1: "29 Grove Street",
      city: "Brooklyn",
      region: "NY 11211",
      country: "United States",
    },
  ],
};
