// TODO(lift): sample data — replace with the Storyblok copy once a direction is chosen. Citation numbers are the design's own; sources not wired.

export const DEFICIT = {
  question: "What is a calorie deficit?",
  definition: "A calorie deficit simply means your body uses more energy than you get from food and drinks over time.",
  moderate: "To lose weight, you need a moderate deficit that still gives your body the energy it needs.",
  depends: "How much energy you need depends on things like your age, height and activity level [1].",
  variables: ["Age", "Height", "Activity level"],
  payoff: "With every meal under 500 kcal, it's easier to manage your calorie intake without having to calculate every meal yourself.",
};

export const SATISFYING = {
  lead: "Under 500 kcal.",
  italic: "Deliciously satisfying.",
  human:
    "Good food should make you feel good, too. That’s why our meals combine plant-based protein and fibre from wholesome ingredients to nourish your body and keep you satisfied.",
  science: "There’s science behind that balance, too.",
  protein: {
    label: "Protein",
    value: "0.8",
    unit: "g per kg",
    benefit: "Helps you feel fuller for longer and maintain muscle mass while losing weight.",
    note: "Recommended daily for most adults [1, 2]",
  },
  fibre: {
    label: "Fibre",
    value: "25–30",
    unit: "g a day",
    benefit: "Supports fullness and healthy digestion.",
    note: "Recommended daily [3, 4]",
  },
  // Single-string version for the shared image-text section
  body:
    "Good food should make you feel good, too. That’s why our meals combine plant-based protein and fibre from wholesome ingredients to nourish your body and keep you satisfied. There’s science behind that balance, too: Protein helps you feel fuller for longer and maintain muscle mass while losing weight, with around 0.8 g per kg of body weight recommended daily for most adults [1, 2]. Fibre supports fullness and healthy digestion, with 25–30 g a day recommended [3, 4].",
};
