import { tagged } from "@/lib/studio-copy";

// Every line of words on the page, each written once, so a line is changed in one place and the studio can save an edit to it.
// TODO(lift): sample copy — replace with the copy from the CMS
export const COPY = tagged({
  // The product page, the prototype's main page: its sections, top to bottom.
  productPage: {
    // The top of the page: the product's name and headline above the picture, the line under the price, the stars, and the three reassurances.
    hero: {
      // The small line above the headline.
      name: "Weight Balance Bundle",
      // The page's main heading.
      headline: "Weight Balance Bundle",
      // The small line above the meals heading.
      mealsKicker: "Weight Balance Bundle",
      // The big heading over the meals: the first part, then the part set in italics.
      mealsHeadline: {
        // First part of the meals heading.
        lead: "Manage your weight",
        // Second part of the meals heading, in italics.
        italic: "without counting calories."
      },
      // The paragraph under the meals heading.
      subheadline: "Make balanced, calorie-conscious eating easier with nutritious meals under 500 kcal, featuring protein and fibre to help keep you satisfied. Choose from 40+ dishes, from comforting pasta to flavourful curries.",
      rating: {
        // The word beside the stars.
        label: "Excellent"
      },
      // The three reassurances under the rating, in order.
      bullets: [
        // First reassurance.
        "Point 1",
        // Second reassurance.
        "Point 2",
        // Third reassurance.
        "Point 2"
      ],
      // The small line under the Add to cart button.
      ctaFootnote: "Only 7,47 € / meal · Skip or cancel anytime"
    },
    // The picker for another bundle, beside the hero: one label for each.
    bundleSwitcher: {
      items: [
        {
          // First bundle's name.
          label: "The Immunity Bundle"
        },
        {
          // Second bundle's name.
          label: "The Protein Bundle"
        },
        {
          // Third bundle's name.
          label: "The Postpartum Bundle"
        }
      ]
    },
    // The row of four short selling points under the product, each with an icon.
    uspGrid: {
      headline: "Every detail. Thought through.",
      items: [
        {
          label: "Flash-frozen meals"
        },
        {
          label: "Clean ingredients"
        },
        {
          label: "Non-GMO"
        },
        {
          label: "No artificial additives"
        }
      ]
    },
    // The three nutrition cards (protein, fibre, no added sugar).
    ingredients: {
      eyebrow: "INGREDIENTS",
      headline: "Balanced meals. Full nutrition.",
      items: [
        {
          title: "Protein",
          body: "An average of 21g per meal, from natural sources like legumes, plus added plant-based proteins."
        },
        {
          title: "Fibre",
          body: "An average of 12g per meal, from vegetables, legumes and fibre-rich plants. The part of the meal that keeps you satisfied."
        },
        {
          title: "No added sugar",
          body: "Raw Cake Bites made with whole ingredients like dates and nuts instead of refined sugar."
        }
      ]
    },
    // The carousel of quotes inside the nutrition section.
    experts: {
      title: "Approved and recommended by experts",
      experts: [
        {
          name: "Florence",
          credentials: "",
          quote: "I love every! It's changed my life. I work and have children, and I still wanted to eat healthily, which is how I came across every. I think there's nothing comparable in supermarkets that's so high-quality, healthy, and tastes so good. It's made my life so much easier, and I've even lost weight, feel much better, and have a flatter stomach."
        },
        {
          name: "Katharina",
          credentials: "",
          quote: "The meals are fresh, delicious, and healthy – ideal for my anti-inflammatory diet, which I've been able to consistently stick to for 10 weeks. I find the prices very fair for larger orders, especially when you factor in the time, shopping, and preparation."
        },
        {
          name: "Frank P.",
          credentials: "",
          quote: "A high proportion of vegetables and completely vegan options are exactly what takes a lot of time when cooking from scratch (shopping, washing, chopping, and cooking). The meals are healthy. You feel satisfied and energized, not stuffed and sluggish. That’s great."
        },
        {
          name: "Paul S.",
          credentials: "",
          quote: "I’ve noticed that these regular, balanced meals gave me more energy throughout my day and made me feel better overall. My digestion has noticeably improved, and I have fewer cravings between meals. My body image has also improved significantly over time."
        }
      ]
    },
    // The picture with a heading and a paragraph beside it, about fibre.
    imageText: {
      headline: "The secret to feeling full? Fibre.",
      body: "The first question about smaller portions is always the same: won't I be hungry? Not if the portion is built right. Fibre slows digestion and keeps you feeling satisfied for longer. What matters isn't the size of the portion, it's what's in it. With around 12 g of fibre and 21 g of protein per serving, each meal delivers a balanced nutritional profile at approximately 500 kcal."
    },
    // The three cards about what changes after a few weeks.
    afterAFewWeeks: {
      eyebrow: "After a few weeks",
      headline: "When eating is sorted, losing weight gets easier.",
      items: [
        {
          title: "No more counting.",
          body: "Portions are already done, so you can just eat."
        },
        {
          title: "Less stress around food.",
          body: "The \"did I eat too much\" question stops taking up room."
        },
        {
          title: "Consistency without strictness",
          body: "Your 80% covered, with room for real life."
        }
      ]
    },
    // The heading over the row of logos of where we are sold or featured.
    featuredBy: {
      headline: "Curious to try? You can also find us here!"
    },
    // The four reasons it fits a routine, as pillars.
    routine: {
      eyebrow: "Your Routine",
      headline: "For everyone with a weight goal but no time for tracking.",
      pillars: [
        {
          title: "Feel satisfied for longer.",
          body: "A balanced combination of plant protein, fibre, complex carbs and healthy fats."
        },
        {
          title: "Real ingredients only.",
          body: "Real ingredients only. Fresh, whole foods with no unnecessary additives or preservatives."
        },
        {
          title: "More plants, more variety.",
          body: "At least 6 vegetables in every meal for more nutrients in your day."
        },
        {
          title: "Chef-created. Nutritionist-approved.",
          body: "Delicious meals that support your goals without compromising taste. 100% natural – no additives or preservatives."
        }
      ]
    },
    // The questions and answers.
    faq: {
      eyebrow: "COMMON QUESTIONS",
      headline: "Everything you want to know",
      items: [
        {
          question: "How does portioning help me reach my goals?",
          answer: "Pre-portioned meals remove the guesswork. You eat the right amount without tracking, weighing or thinking about it which makes it easier to stay consistent over time."
        },
        {
          question: "How is this different from calorie counting?",
          answer: "With the Perfect Portions Plan you don't have to track anything. Meals are already balanced with the right amount of protein, fibre and vegetables, so you feel satisfied without having to track every bite."
        },
        {
          question: "Can I swap meals?",
          answer: "Yes. From your second order onwards, you can adjust your selection directly in your account. For your first box, we’ve curated a selection of our best meals, based on protein and fibre content."
        },
        {
          question: "How does the subscription work?",
          answer: "Simply choose your box size, select your meals and pick your preferred delivery date and frequency. Your box will arrive at your door, ready to enjoy. Our subscription is fully flexible, so you can update your box size, swap meals, adjust your delivery schedule, skip a box or cancel anytime – all to fit your routine."
        },
        {
          question: "How many meals can I store in my freezer?",
          answer: "Even a small freezer usually fits around 12 meals easily. The packaging is compact and stackable, so you can keep meals ready without needing extra space. You can also keep meals in the fridge for 1–2 days before eating."
        },
        {
          question: "How does the delivery work?",
          answer: "Your box arrives within 2 to 3 days. All meals are packed with dry ice, so they arrive frozen no matter the temperature outside."
        },
        {
          question: "What’s included in the Perfect Portions Plan?",
          answer: "Our Starter Kit includes 20 perfectly portioned meals for lunch or dinner – a simple way to get started with balanced eating. Our Complete Plan includes the same 20 meals, plus optional extras to support your routine: 1 Apple Cinnamon Porridge, 1 Vanilla Hazelnut Granola, 9 Raw Cake Bites and 2 Pitaya Mango Smoothies."
        }
      ]
    },
    // The email sign-up at the foot of the page.
    subscribe: {
      strapline: "Don't miss a bite",
      title: "Good food. Every day.",
      subtitle: "Be the first to hear about new dishes, seasonal recipes and limited bundles. Straight to your inbox. No spam. Unsubscribe anytime.",
      footnote: "No spam, ever. Unsubscribe with one click at any time.",
      placeholder: "Your email address...",
      submitLabel: "Subscribe"
    }
  },
  // The landing page, the other variant of this prototype (the page control switches to it): its own words, section by section, top to bottom.
  landingPage: {
    lpRating: {
      label: "Excellent"
    },
    hero: {
      headlineLine1: "Manage your weight",
      headlineTagline: "without counting calories",
      subheadline: "Chef-crafted, plant-richt meals for calorie-conscious eating. Each under 500 kcal, with ∅ XY g protein and ∅ XY g fibre in every portion. Nothing to weigh, measure or track.",
      bullets: [
        "Ready in under 10 minutes",
        "From 5,57 € per meal",
        "Flexible plan: pause or cancel anytime"
      ],
      ctaLabel: "Discover bundle"
    },
    foundation: {
      headline: "Good food. Less to figure out.\n",
      body: "Planning, shopping and deciding what to cook can make healthy eating feel like work. With balanced meals, each under 500 kcal and ready in minutes, there’s less to plan and more time to enjoy your food."
    },
    bundle: {
      kicker: "THE PERFECT PORTIONS PLAN",
      name: "Perfect Portions",
      headline: {
        lead: "Weight Balance Bundle",
        italic: ""
      },
      subheadline: "Make balanced eating easier with nutritious meals under 500 kcal, each containing ∅ XY g protein and ∅ XY g fibre to help keep you satisfied. Choose from 40+ dishes, from comforting pasta to flavourful curries.",
      boxHeadline: {
        lead: "Choose your ",
        italic: "box size"
      }
    },
    sticky: {
      label: "Add to cart",
      footnote: "from 7,47€ / meal · Skip or cancel anytime"
    },
    reviews: {
      headline: "Over 200,000 happy customers",
      reviews: [
        {
          name: "Katharina",
          title: "PERFECT PORTIONS PLAN",
          comments: "The meals are fresh, delicious, and healthy – ideal for my anti-inflammatory diet, which I've been able to consistently stick to for 10 weeks."
        },
        {
          name: "Frank P.",
          title: "PERFECT PORTIONS PLAN",
          comments: "You feel satisfied and energized, not stuffed and sluggish. That’s great."
        },
        {
          name: "Paul S.",
          title: "PERFECT PORTIONS PLAN",
          comments: "These regular, balanced meals gave me more energy throughout my day. My digestion has noticeably improved, and I have fewer cravings between meals."
        },
        {
          name: "Claudia",
          title: "PERFECT PORTIONS PLAN",
          comments: "Very tasty and varied dishes! Ingredients like vegetables taste incredibly fresh! Dishes are also perfect for diet phases or healthy meals after sport."
        }
      ]
    },
    routine: {
      eyebrow: "YOUR ROUTINE",
      headline: {
        lead: "For everyone with a weight goal ",
        italic: "but no time for tracking."
      },
      pillars: [
        {
          title: "Feel satisfied for longer.",
          body: "A balanced combination of plant protein, fibre, complex carbs and healthy fats."
        },
        {
          title: "Real ingredients only.",
          body: "Fresh, whole foods with no unnecessary additives or preservatives."
        },
        {
          title: "More plants, more variety.",
          body: "At least 6 vegetables in every meal for more nutrients in your day."
        },
        {
          title: "Chef-created. Nutritionist-approved.",
          body: "Delicious meals that support your goals without compromising taste. 100% natural – no additives or preservatives."
        }
      ]
    },
    ingredients: {
      eyebrow: "INGREDIENTS",
      headline: {
        lead: "Can frozen food ",
        italic: "really be fresh?"
      },
      body: "Vegetables can lose up to 90% of their vitamins within days of harvest. Ours are flash-frozen within hours – locking in the vitamins, minerals and macros your body actually needs. Nothing artificial, no preservatives.",
      note: "It's 30°C+ — your food still arrives frozen.",
      experts: {
        title: "Approved and recommended by experts",
        experts: [
          {
            name: "Florence",
            credentials: "",
            quote: "I love every! It's changed my life. I work and have children, and I still wanted to eat healthily, which is how I came across every. I think there's nothing comparable in supermarkets that's so high-quality, healthy, and tastes so good. It's made my life so much easier, and I've even lost weight, feel much better, and have a flatter stomach."
          },
          {
            name: "Katharina",
            credentials: "",
            quote: "The meals are fresh, delicious, and healthy – ideal for my anti-inflammatory diet, which I've been able to consistently stick to for 10 weeks. I find the prices very fair for larger orders, especially when you factor in the time, shopping, and preparation."
          },
          {
            name: "Frank P.",
            credentials: "",
            quote: "A high proportion of vegetables and completely vegan options are exactly what takes a lot of time when cooking from scratch (shopping, washing, chopping, and cooking). The meals are healthy. You feel satisfied and energized, not stuffed and sluggish. That’s great."
          },
          {
            name: "Paul S.",
            credentials: "",
            quote: "I’ve noticed that these regular, balanced meals gave me more energy throughout my day and made me feel better overall. My digestion has noticeably improved, and I have fewer cravings between meals. My body image has also improved significantly over time."
          }
        ]
      }
    },
    retailers: {
      headline: "Curious to try? You can also find us here!"
    },
    faq: {
      eyebrow: "COMMON QUESTIONS",
      headline: {
        lead: "Everything you ",
        italic: "want to know"
      },
      items: [
        {
          question: "How does portioning help me reach my goals?",
          answer: "Pre-portioned meals remove the guesswork. You eat the right amount without tracking, weighing or thinking about it which makes it easier to stay consistent over time."
        },
        {
          question: "How is this different from calorie counting?",
          answer: "With the Perfect Portions Plan you don't have to track anything. Meals are already balanced with the right amount of protein, fibre and vegetables, so you feel satisfied without having to track every bite."
        },
        {
          question: "Can I swap meals?",
          answer: "Yes. From your second order onwards, you can adjust your selection directly in your account. For your first box, we’ve curated a selection of our best meals, based on protein and fibre content."
        },
        {
          question: "How does the subscription work?",
          answer: "Simply choose your box size, select your meals and pick your preferred delivery date and frequency. Your box will arrive at your door, ready to enjoy. Our subscription is fully flexible, so you can update your box size, swap meals, adjust your delivery schedule, skip a box or cancel anytime – all to fit your routine."
        },
        {
          question: "How many meals can I store in my freezer?",
          answer: "Even a small freezer usually fits around 12 meals easily. The packaging is compact and stackable, so you can keep meals ready without needing extra space. You can also keep meals in the fridge for 1–2 days before eating."
        },
        {
          question: "How does the delivery work?",
          answer: "Your box arrives within 2 to 3 days. All meals are packed with dry ice, so they arrive frozen no matter the temperature outside."
        },
        {
          question: "What’s included in the Perfect Portions Plan?",
          answer: "Our Starter Kit includes 20 perfectly portioned meals for lunch or dinner – a simple way to get started with balanced eating. Our Complete Plan includes the same 20 meals, plus optional extras to support your routine: 1 Apple Cinnamon Porridge, 1 Vanilla Hazelnut Granola, 9 Raw Cake Bites and 2 Pitaya Mango Smoothies."
        }
      ]
    },
    newsletter: {
      strapline: "DON’T MISS A BITE",
      headline: {
        lead: "Good food. ",
        italic: "Every day."
      },
      body: "Be the first to hear about new dishes, seasonal recipes and limited bundles. Straight to your inbox. No spam. Unsubscribe anytime.",
      placeholder: "Your email address...",
      submitLabel: "Subscribe",
      footnote: "No spam, ever. Unsubscribe with one click at any time."
    }
  },
  // Every image address on the page. A picture replaced in the studio is saved here, as a file in public/img/uploads/.
  images: {
    bodyBalance: {
      heroImage: "https://a.storyblok.com/f/291086118523370/1472x672/55b8c921fc/perfect-portion-hero-desktop-2.png",
      heroImageMobile: "https://a.storyblok.com/f/291086118523370/1965x2080/2c474bb1ee/perfect-portions-hero-mobile-3.png"
    },
    uspGrid: {
      items: [
        {
          icon: "https://a.storyblok.com/f/291086118523370/48x48/3412d60d06/flash-frozen-icon.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/48x48/8d637131f9/natural-ingredients-icon.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/48x48/dd6fc366b1/non-gmo-icon.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/39x39/3222de1504/no-artificial-additives-icon.svg"
        }
      ]
    },
    ingredients: {
      items: [
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/3dd03aeb1c/protein-icon.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/16d0ed921a/fibre-icon.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/d036142415/whole-foods-icon.svg"
        }
      ]
    },
    experts: {
      experts: [
        {
          image: "https://a.storyblok.com/f/291086118523370/1750x1750/9ce402fe6e/florence.png"
        },
        {
          image: "https://a.storyblok.com/f/291086118523370/810x810/f4264911a2/katharina.jpg"
        },
        {
          image: "https://a.storyblok.com/f/291086118523370/1750x1750/b7fa46b7fa/frank.png"
        },
        {
          image: "https://a.storyblok.com/f/291086118523370/1750x1750/98f406775a/paul-s.png"
        }
      ]
    },
    imageText: {
      image: "https://a.storyblok.com/f/291086118523370/704x704/733c84e738/woman-eating.jpg"
    },
    afterAFewWeeks: {
      items: [
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/a5314c2c1e/every-character-1.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/2b3a5efd8b/every-character-2.svg"
        },
        {
          icon: "https://a.storyblok.com/f/291086118523370/64x64/6ad43da325/every-character-3.svg"
        }
      ]
    },
    featuredBy: {
      logos: [
        {
          src: "https://a.storyblok.com/f/291086118523370/578498478a/rewe.png"
        },
        {
          src: "https://a.storyblok.com/f/291086118523370/2c2de1325d/wolt.png"
        },
        {
          src: "https://a.storyblok.com/f/291086118523370/6dab5b5b1f/picnic.png"
        },
        {
          src: "https://a.storyblok.com/f/291086118523370/5b0780ec7b/knuspr.png"
        },
        {
          src: "https://a.storyblok.com/f/291086118523370/0bcc9d88dc/crisp.png"
        }
      ]
    },
    routine: {
      image: "https://a.storyblok.com/f/291086118523370/1280x1707/fedba1b46f/dts_home_atelier_dts_studio_photos_id7862.jpg"
    },
    lp: {
      hero: {
        image: "https://a.storyblok.com/f/291086118523370/1965x2080/2c474bb1ee/perfect-portions-hero-mobile-3.png",
        desktopImage: "https://a.storyblok.com/f/291086118523370/1472x672/55b8c921fc/perfect-portion-hero-desktop-2.png"
      },
      foundation: {
        image: "https://a.storyblok.com/f/291086118523370/704x704/733c84e738/woman-eating.jpg"
      },
      routine: {
        slides: [
          "https://a.storyblok.com/f/291086118523370/1280x1707/fedba1b46f/dts_home_atelier_dts_studio_photos_id7862.jpg"
        ],
        pillars: [
          {
            icon: "/img/lp/pillar-1.svg"
          },
          {
            icon: "/img/lp/pillar-2.svg"
          },
          {
            icon: "/img/lp/pillar-3.svg"
          },
          {
            icon: "/img/lp/pillar-4.svg"
          }
        ]
      },
      ingredients: {
        image: "/img/lp/ingredients.png",
        experts: {
          experts: [
            {
              image: "https://a.storyblok.com/f/291086118523370/1750x1750/9ce402fe6e/florence.png"
            },
            {
              image: "https://a.storyblok.com/f/291086118523370/810x810/f4264911a2/katharina.jpg"
            },
            {
              image: "https://a.storyblok.com/f/291086118523370/1750x1750/b7fa46b7fa/frank.png"
            },
            {
              image: "https://a.storyblok.com/f/291086118523370/1750x1750/98f406775a/paul-s.png"
            }
          ]
        }
      },
      retailers: {
        logos: [
          {
            src: "/img/lp/rewe.png"
          },
          {
            src: "/img/lp/wolt.png"
          },
          {
            src: "/img/lp/picnic.png"
          },
          {
            src: "/img/lp/knuspr.png"
          },
          {
            src: "/img/lp/crisp.png"
          }
        ]
      }
    }
  }
});
