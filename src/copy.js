// One source of truth for the film's copy — used by the live film and the still fallback.

export const CAPTIONS = [
  {
    stamp: "ROASTED: UNKNOWN",
    text: "Most grocery coffee was roasted months ago. Some of it, a year.",
    hero: true,
  },
  {
    stamp: "MONTHS ON A SHELF",
    text: "By the time it reaches the shelf, the flavor is already gone. It just tastes like… coffee.",
  },
  {
    stamp: "TUESDAY, 6 AM",
    text: "Ours never sits. Roasted here, in small batches, this week.",
  },
  {
    stamp: "ROASTED JUL 28",
    text: "The roast date isn't fine print. It's the whole point.",
  },
  {
    stamp: "DAY 3 · PEAK FLAVOR",
    text: "Fresh coffee blooms. Stale coffee just sits there.",
  },
  {
    stamp: "FIRST SIP",
    text: "The blueberry shone through. The notes on the bag, finally in your cup.",
    sub: "You're not a snob. You just hadn't had fresh coffee yet.",
  },
];

// Shot 7 lives after the film as the landing beat.
export const LANDING = {
  stamp: "YOUR TUESDAY",
  text: "This is what mornings taste like when the bag was roasted seven days ago, three streets over.",
};

export const CLIPS = [
  "clip1-aisle-to-bag",
  "clip2-bag-to-roaster",
  "clip3-roaster-to-crack",
  "clip4-crack-to-bloom",
  "clip5-bloom-to-notes",
  "clip6-notes-to-morning",
];
