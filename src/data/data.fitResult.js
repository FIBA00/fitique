const image = (id, options = "auto=format&fit=crop&w=900&q=84") =>
  ["https://images.unsplash.com/", id, "?", options].join("");

export const fitResult = {
  recommendedSize: "M",
  confidence: "High",
  note: "Based on the details you shared, we would begin with a medium for a comfortable, refined silhouette.",
  measurements: [
    "Bust: 90 cm",
    "Waist: 70 cm",
    "Hips: 98 cm",
    "Shoulders: 38 cm",
  ],
  outfit: ["Eloise Ribbed Midi", "Madeleine Slingback", "Maris Silk Scarf"],
  image: "/manus-storage/fitique-fit-check_48d7e22a.jpg",
};
