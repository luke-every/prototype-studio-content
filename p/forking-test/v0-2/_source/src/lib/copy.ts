import { tagged } from "@/lib/studio-copy";

// Every line of words on the page, each written once, so a line is changed in one place and the studio can save an edit to it.
// TODO(lift): sample copy — replace with the copy from the CMS
export const COPY = tagged({
  boxes: [
    {
      label: "Starter"
    },
    {
      label: "Complete",
      badge: "Most popular"
    },
    {
      label: "Max"
    }
  ],
  proteinBundle: {
    name: "The Protein Bundle",
    headline: "The Protein Bundle",
    mealsKicker: "THE PROTEIN BUNDLE",
    mealsHeadline: {
      lead: "Our most protein-packed ",
      italic: "meals."
    },
    subheadline: "Eating high-protein doesn't mean cooking the same three dishes every week. The Protein Bundle packs our most protein-rich meals: satisfying, full of flavour and with an average of 26 g plant-based protein per dish.",
    rating: {
      label: "Excellent"
    },
    bullets: [
      "Delivered frozen to your door",
      "Ready in under 10 minutes",
      "Flexible plan: Skip or cancel anytime"
    ],
    ctaFootnote: "5,89 € / meal · Skip or cancel anytime",
    switchItems: [
      {
        label: "The Immunity Bundle"
      },
      {
        label: "The Postpartum Bundle"
      },
      {
        label: "The Perfect Portions Plan"
      }
    ]
  },
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
  ingredients: {
    eyebrow: "INGREDIENTS",
    headline: "26g of protein without another shake.",
    items: [
      {
        title: "Protein",
        body: "ø 26g of plant-based protein per meal, from legumes and added plant proteins."
      },
      {
        title: "Fibre",
        body: "Providing ø 11g of fibre from vegetables and fibre-rich plants."
      },
      {
        title: "Grains",
        body: "Like rice, quinoa and oats providing complex carbs to get you through the day."
      }
    ]
  },
  experts: {
    title: "Approved and recommended by experts",
    experts: [
      {
        name: "Felicitas Döring",
        credentials: "Mom & Certified Pilates",
        quote: "The meals from Every taste incredibly delicious—and for me, as a Pilates trainer and mom, they’re perfect because I can prepare a super healthy, nutrient-rich, high-protein meal in just a few minutes without having to think about it. Truly the best thing that could have happened for my everyday life."
      },
      {
        name: "Lisa & Sebastian Vavra",
        credentials: "MSc Psychologists",
        quote: "As nutrition psychologists who stand for stress-free, mindful self-care, we value Every Foods as a genuine everyday aid. Warm, nutrient-rich, uncomplicated and fully aligned with our body peace philosophy."
      },
      {
        name: "Christin Price-Gewiehs",
        credentials: "Health Coach, Sports Scientist & Nutritionist",
        quote: "As a health coach, sports scientist, and nutritionist, I have been working with people who want to optimally support their bodies which includes practical, high-quality, and honest nutrition. As every is made from the best ingredients and provide wholesome satiety, it is the ideal solution for anyone who wants to eat quickly, healthily, and mindfully – without compromises."
      }
    ]
  },
  imageText: {
    headline: "Protein is only half the story.",
    body: "Ask what makes a meal truly filling and the answer is often the same: protein. But that’s only half the story. Fibre is the partner that deserves more attention. It slows digestion, keeps energy levels steady and gives your gut bacteria what they need to thrive. Every meal in this bundle combines 26g of protein with around 11g of fibre – more than a third of your daily fibre needs."
  },
  afterAFewWeeks: {
    eyebrow: "After a few weeks",
    headline: "When protein is sorted, training is all that’s left.",
    items: [
      {
        title: "Protein without the maths.",
        body: "Ø 26g per meal, no tracking, no mental arithmetic."
      },
      {
        title: "A routine that runs itself.",
        body: "No deciding. No planning. Just food that's already there."
      },
      {
        title: "Built for training days and rest days.",
        body: "Consistency was the hard part. Was."
      }
    ]
  },
  featuredBy: {
    headline: "Curious to try? You can also find us here!"
  },
  routine: {
    eyebrow: "Your Routine",
    headline: "For everyone who trains, moves and wants to stay active.",
    pillars: [
      {
        title: "Real ingredients only.",
        body: "Fresh, whole foods with no unnecessary additives or preservatives."
      },
      {
        title: "Meals that keep you going.",
        body: "Balanced meals combining plant protein, fibre, slow-release carbs and healthy fats."
      },
      {
        title: "Packed with plants. At least 6 vegetables in every meal for more variety and nutrients.",
        body: "Seasonal vegetables and a variety of plant-based ingredients for more nutrients and flavour in every meal."
      },
      {
        title: "Created by chefs. Approved by nutritionists.",
        body: "Because reaching your goals shouldn’t mean compromising on taste."
      }
    ]
  },
  faq: {
    eyebrow: "COMMON QUESTIONS",
    headline: "Everything you want to know",
    items: [
      {
        question: "Is the protein content enough to support my goals?",
        answer: "Each meal contains 26g of protein from whole-food sources. Whether that covers your full daily needs depends on factors like body weight, activity level and how many meals you eat throughout the day."
      },
      {
        question: "Do I still need protein shakes or supplements?",
        answer: "That depends on your body weight, activity level and individual protein target. A useful starting point: most guidelines recommend around 0.8–1.6 g of protein per kg of body weight per day. Each meal in this bundle provides 26 g – a meaningful contribution, but whether it covers your full daily needs depends on how many meals you have and what else you eat throughout the day."
      },
      {
        question: "Can I swap meals?",
        answer: "Yes. From your second order onwards, you can adjust your selection directly in your account. For your first box, we've curated a selection of our best meals, based on protein and fibre content."
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
        question: "How does delivery work?",
        answer: "The day before your delivery date, we pack your order and hand it to our shipping partner. Meals are shipped frozen using sustainable insulation and cooling elements, and you'll get a tracking link with your delivery window."
      }
    ]
  },
  subscribe: {
    strapline: "Don't miss a bite",
    title: "Good food. Every day.",
    subtitle: "Be the first to hear about new dishes, seasonal recipes and limited bundles. Straight to your inbox. No spam. Unsubscribe anytime.",
    footnote: "No spam, ever. Unsubscribe with one click at any time.",
    placeholder: "Your email address...",
    submitLabel: "Subscribe"
  },
  // Every image address on the page. A picture replaced in the studio is saved here, as a file in public/img/uploads/.
  images: {
    proteinBundle: {
      heroImage: "https://a.storyblok.com/f/291086118523370/2944x1344/808791ae9a/protein-hero-desktop.png",
      heroImageMobile: "https://a.storyblok.com/f/291086118523370/1572x1664/9eaa290502/protein-hero-mobile.png"
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
          icon: "https://a.storyblok.com/f/291086118523370/192x192/057a2b7baa/no-artificial-flavour.png"
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
          image: "https://a.storyblok.com/f/291086118523370/1500x1200/932879810f/felicitas-doring.png"
        },
        {
          image: "https://a.storyblok.com/f/291086118523370/1375x1100/8955383ec8/protein-19-1.png"
        },
        {
          image: "https://a.storyblok.com/f/291086118523370/1500x1200/a5010a2777/christin-price-gewiehs.png"
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
      image: "https://a.storyblok.com/f/291086118523370/1280x853/0fa22b7b29/daniel-faro-photos.jpg"
    }
  }
});
