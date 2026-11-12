/**
 * ALL medical content the games teach lives in this one file.
 *
 * STATUS: DRAFT. Taken from the game plan (v1, 11 Nov 2026), written by Amina
 * and Claude as a starting point. Dr. Zainab has NOT yet confirmed it.
 * When she answers the questions on page 7 of the plan, correct the lists and
 * messages here and set REVIEWED_BY_DOCTOR to true.
 */

export type L = { ar: string; en: string };
export type Item = { id: string; icon: string; label: L };

/** false = the "for parents" note also says the content is still a draft. */
export const REVIEWED_BY_DOCTOR = false;

/** Plan question 10: short note for parents. */
export const PARENTS_NOTE_ENABLED = true;
export const parentsNote: L = {
  ar: 'هذه اللعبة للتعليم والمرح فقط، ولا تغني عن نصيحة الطبيب. إذا كان لديك أي سؤال عن صحة طفلك، راجع الطبيب.',
  en: "This game is for learning and fun only. It does not replace medical advice. If you have any question about your child's health, see your doctor.",
};
export const draftNote: L = {
  ar: 'نسخة تجريبية: المحتوى الطبي بانتظار مراجعة د. زينب ناصر.',
  en: 'Test version: the medical content is awaiting review by Dr. Zainab Nasser.',
};

/* TODO: awaiting Dr. Zainab (question 6): are dates or sweets acceptable
   answers for low sugar? Until she answers they are not shown at all. */
export const LOW_SHOW_DATES_AND_SWEETS = false;

/* ------------------------------------------------------------------ */
/* Game 1 · Pop the Signs                                              */
/* ------------------------------------------------------------------ */
export const pop = {
  name: { ar: 'فرقع الأعراض', en: 'Pop the Signs' },
  instruction: {
    ar: 'فرقع فقاعات علامات السكري فقط، واترك الألعاب!',
    en: 'Pop only the diabetes signs. Leave the toys!',
  },
  signs: [
    { id: 'thirsty', icon: 'thirsty', label: { ar: 'عطش شديد', en: 'Very thirsty' } },
    { id: 'toilet', icon: 'toilet', label: { ar: 'الذهاب إلى الحمّام كثيرًا', en: 'Going to the toilet a lot' } },
    { id: 'tired', icon: 'tired', label: { ar: 'تعب دائم', en: 'Always tired' } },
    { id: 'weight', icon: 'weight', label: { ar: 'نقص الوزن', en: 'Losing weight' } },
  ] as Item[],
  decoys: [
    { id: 'ball', icon: 'ball', label: { ar: 'كرة', en: 'Ball' } },
    { id: 'book', icon: 'book', label: { ar: 'كتاب', en: 'Book' } },
    { id: 'teddy', icon: 'teddy', label: { ar: 'دبدوب', en: 'Teddy' } },
    { id: 'kite', icon: 'kite', label: { ar: 'طائرة ورقية', en: 'Kite' } },
    { id: 'car', icon: 'car', label: { ar: 'سيارة', en: 'Toy car' } },
  ] as Item[],
  decoyMessage: { ar: 'هذه لعبة، ليست علامة. جرّب مرة ثانية!', en: 'That is a toy, not a sign. Try again!' },
  endMessage: {
    ar: 'إذا رأيت هذه العلامات، أخبر ماما أو بابا وزوروا الطبيب.',
    en: 'If you see these signs, tell your mum or dad and visit the doctor.',
  },
};

/* ------------------------------------------------------------------ */
/* Game 2 · Help Yousif Grow                                           */
/* ------------------------------------------------------------------ */
export const grow = {
  name: { ar: 'كبّر يوسف', en: 'Help Yousif Grow' },
  instruction: {
    ar: 'أعطِ يوسف ما يساعده على أن يكبر!',
    en: 'Give Yousif the things that help him grow!',
  },
  healthy: [
    { id: 'milk', icon: 'milk', label: { ar: 'حليب', en: 'Milk' } },
    { id: 'eggs', icon: 'egg', label: { ar: 'بيض', en: 'Eggs' } },
    { id: 'fish', icon: 'fish', label: { ar: 'سمك', en: 'Fish' } },
    { id: 'chicken', icon: 'chicken', label: { ar: 'دجاج', en: 'Chicken' } },
    { id: 'vegetables', icon: 'broccoli', label: { ar: 'خضار', en: 'Vegetables' } },
    { id: 'fruit', icon: 'apple', label: { ar: 'فواكه', en: 'Fruit' } },
    { id: 'water', icon: 'water', label: { ar: 'ماء', en: 'Water' } },
    { id: 'sleep', icon: 'sleep', label: { ar: 'نوم مبكر', en: 'Early sleep' } },
    { id: 'sport', icon: 'sport', label: { ar: 'لعب الرياضة', en: 'Playing sport' } },
  ] as Item[],
  sometimes: [
    { id: 'sweets', icon: 'candy', label: { ar: 'حلويات', en: 'Sweets' } },
    { id: 'chips', icon: 'chips', label: { ar: 'بطاطس مقرمشة', en: 'Chips' } },
    { id: 'fizzy', icon: 'fizzy', label: { ar: 'مشروب غازي', en: 'Fizzy drink' } },
    { id: 'screens', icon: 'screen', label: { ar: 'شاشات في الليل', en: 'Late-night screens' } },
  ] as Item[],
  healthyMessage: { ar: 'يساعد يوسف على أن يكبر!', en: 'helps Yousif grow!' },
  sometimesMessage: {
    ar: 'هذا لبعض الأحيان فقط، ولا يساعد على النمو.',
    en: 'This is only for sometimes. It does not help him grow.',
  },
  endMessage: {
    ar: 'الأكل الصحي والنوم الكافي والحركة تساعد جسمك على أن يكبر.',
    en: 'Good food, enough sleep and movement help your body grow.',
  },
};

/* ------------------------------------------------------------------ */
/* Game 3 · Injection Hero                                             */
/* TODO: awaiting Dr. Zainab (question 5): injections only, or pumps   */
/* too? For now the wording is for injections only.                    */
/* ------------------------------------------------------------------ */
export const insulin = {
  name: { ar: 'بطل الإبرة', en: 'Injection Hero' },
  instruction: {
    ar: 'رتّب خطوات الإبرة: اضغط على الخطوة الأولى، ثم التي بعدها.',
    en: 'Put the injection steps in order: tap the first step, then the next.',
  },
  /** In the correct order. */
  steps: [
    { id: 'wash', icon: 'hands', label: { ar: 'نغسل اليدين', en: 'Wash hands' } },
    { id: 'prepare', icon: 'pen', label: { ar: 'شخص كبير يجهّز القلم', en: 'An adult prepares the pen' } },
    { id: 'place', icon: 'pin', label: { ar: 'نختار مكانًا جديدًا', en: 'Choose a new place' } },
    { id: 'inject', icon: 'ten', label: { ar: 'نأخذ الإبرة ونعدّ إلى ١٠', en: 'Inject and count to 10' } },
    { id: 'box', icon: 'box', label: { ar: 'نضع الإبرة في الصندوق الآمن', en: 'Put the needle in the safe box' } },
  ] as Item[],
  teddyInstruction: {
    ar: 'كل يوم نختار مكانًا جديدًا لإبرة الدبدوب. اضغط على مكان!',
    en: "Every day we choose a new place for teddy's injection. Tap a place!",
  },
  /** x / y are positions on the teddy drawing, in percent. */
  sites: [
    { id: 'armL', x: 17, y: 50, label: { ar: 'أعلى الذراع', en: 'Upper arm' } },
    { id: 'armR', x: 83, y: 50, label: { ar: 'أعلى الذراع', en: 'Upper arm' } },
    { id: 'tummyL', x: 39, y: 60, label: { ar: 'البطن', en: 'Tummy' } },
    { id: 'tummyR', x: 61, y: 60, label: { ar: 'البطن', en: 'Tummy' } },
    { id: 'thighL', x: 31, y: 86, label: { ar: 'الفخذ', en: 'Thigh' } },
    { id: 'thighR', x: 69, y: 86, label: { ar: 'الفخذ', en: 'Thigh' } },
    { id: 'bottom', x: 79, y: 71, label: { ar: 'الأرداف', en: 'Bottom' } },
  ],
  days: [
    { ar: 'السبت', en: 'Saturday' },
    { ar: 'الأحد', en: 'Sunday' },
    { ar: 'الاثنين', en: 'Monday' },
    { ar: 'الثلاثاء', en: 'Tuesday' },
    { ar: 'الأربعاء', en: 'Wednesday' },
    { ar: 'الخميس', en: 'Thursday' },
    { ar: 'الجمعة', en: 'Friday' },
  ] as L[],
  usedMessage: { ar: 'هذا المكان استخدمناه. اختر مكانًا جديدًا!', en: 'We used this place. Pick a new one!' },
  wrongStepMessage: { ar: 'ليست هذه الخطوة الآن. جرّب مرة ثانية!', en: 'Not this step yet. Try again!' },
  endMessage: {
    ar: 'الإبرة عادة يومية للأبطال، ونغيّر مكانها كل مرة.',
    en: 'The injection is a normal routine for heroes, and we change the place every time.',
  },
};

/* Game 3, second way to play: Yousif walks around his home and does the same
   five steps (insulin.steps), one place at a time. */
export const insulinRoom = {
  name: insulin.name,
  instruction: {
    ar: 'ساعد يوسف في خطوات الإبرة: اضغط على المكان الذي يذهب إليه.',
    en: 'Help Yousif with his injection steps: tap the place he should go to.',
  },
  firstPrompt: { ar: 'ما الخطوة الأولى؟ اضغط على المكان!', en: 'What comes first? Tap the place!' },
  nextPrompt: { ar: 'وما الخطوة التالية؟', en: 'What comes next?' },
  placePrompt: {
    ar: 'الأماكن التي عليها لاصق استخدمناها هذا الأسبوع. اختر مكانًا جديدًا!',
    en: 'The places with a plaster were used this week. Choose a new place!',
  },
  /** Shown as already used. The free places match the video, which shows the upper arm. */
  usedSites: ['tummyL', 'tummyR', 'thighL', 'thighR', 'bottom'],
  endMessage: insulin.endMessage,
};

/* ------------------------------------------------------------------ */
/* Game 4 · Low Sugar Rescue                                           */
/* ------------------------------------------------------------------ */
export const low = {
  name: { ar: 'السكر منخفض', en: 'Low Sugar Rescue' },
  instruction: {
    ar: 'بماذا يشعر يوسف؟ هل هي علامة أن السكر منخفض؟',
    en: 'How does Yousif feel? Is it a sign of low sugar?',
  },
  question: { ar: 'هل هذه علامة انخفاض السكر؟', en: 'Is this a low-sugar sign?' },
  signs: [
    { id: 'shaky', icon: 'shaky', label: { ar: 'يرتجف', en: 'Shaking' } },
    { id: 'sweaty', icon: 'sweaty', label: { ar: 'يتعرّق', en: 'Sweating' } },
    { id: 'hungry', icon: 'hungry', label: { ar: 'جوع شديد', en: 'Very hungry' } },
    { id: 'dizzy', icon: 'dizzy', label: { ar: 'دوخة', en: 'Dizzy' } },
    { id: 'pale', icon: 'pale', label: { ar: 'وجه شاحب', en: 'Pale face' } },
    { id: 'headache', icon: 'headache', label: { ar: 'صداع', en: 'Headache' } },
  ] as Item[],
  /** Feelings that are clearly NOT signs. */
  notSigns: [
    { id: 'laugh', icon: 'laugh', label: { ar: 'يضحك', en: 'Laughing' } },
    { id: 'sing', icon: 'sing', label: { ar: 'يغنّي', en: 'Singing' } },
  ] as Item[],
  isSignMessage: { ar: 'نعم، قد تكون هذه علامة انخفاض السكر.', en: 'Yes, this can be a sign of low sugar.' },
  notSignMessage: { ar: 'لا، هذه ليست علامة. يوسف بخير!', en: 'No, this is not a sign. Yousif is fine!' },
  helpQuestion: { ar: 'ما الذي يساعد يوسف بسرعة؟', en: 'What helps Yousif fast?' },
  helps: [
    { id: 'juice', icon: 'juice', label: { ar: 'عصير', en: 'Juice' } },
    { id: 'tablets', icon: 'tablets', label: { ar: 'حبوب الجلوكوز', en: 'Glucose tablets' } },
  ] as Item[],
  doesNotHelp: [
    { id: 'salad', icon: 'salad', label: { ar: 'سلطة', en: 'Salad' } },
    { id: 'cheese', icon: 'cheese', label: { ar: 'جبن', en: 'Cheese' } },
    { id: 'water', icon: 'water', label: { ar: 'ماء فقط', en: 'Water only' } },
  ] as Item[],
  /* Hidden until Dr. Zainab answers (LOW_SHOW_DATES_AND_SWEETS). */
  unconfirmed: [
    { id: 'dates', icon: 'candy', label: { ar: 'تمر', en: 'Dates' } },
    { id: 'sweets', icon: 'candy', label: { ar: 'حلويات', en: 'Sweets' } },
  ] as Item[],
  helpWrongMessage: { ar: 'هذا لا يرفع السكر بسرعة. جرّب مرة ثانية!', en: 'This does not raise sugar fast. Try again!' },
  tellAdult: { ar: 'أخبر شخصًا كبيرًا', en: 'Tell an adult' },
  tellAdultPrompt: { ar: 'أحسنت! والآن...', en: 'Well done! And now...' },
  endMessage: {
    ar: 'إذا شعرت بانخفاض السكر: خذ سكرًا سريعًا، أخبر شخصًا كبيرًا فورًا، وافحصوا السكر مرة ثانية بعد ١٥ دقيقة.',
    en: 'If you feel low: take fast sugar, tell an adult straight away, and check your sugar again after 15 minutes.',
  },
};

/* ------------------------------------------------------------------ */
/* Game 5 · Yousif's Plate                                             */
/* Plate model (to confirm, question 7): half vegetables and fruit,    */
/* a quarter protein, a quarter starch, with water or milk.            */
/* ------------------------------------------------------------------ */
export type PlateZone = 'veg' | 'protein' | 'starch';
export const plate = {
  name: { ar: 'صحن يوسف', en: "Yousif's Plate" },
  instruction: {
    ar: 'املأ صحن يوسف: اسحب كل طعام إلى مكانه الصحيح.',
    en: "Fill Yousif's plate: drag each food to its right place.",
  },
  zones: {
    veg: { label: { ar: 'خضار وفواكه', en: 'Vegetables & fruit' }, capacity: 2 },
    protein: { label: { ar: 'بروتين', en: 'Protein' }, capacity: 1 },
    starch: { label: { ar: 'نشويات', en: 'Starch' }, capacity: 1 },
  } as Record<PlateZone, { label: L; capacity: number }>,
  foods: [
    { id: 'broccoli', icon: 'broccoli', zone: 'veg', label: { ar: 'بروكلي', en: 'Broccoli' } },
    { id: 'carrot', icon: 'carrot', zone: 'veg', label: { ar: 'جزر', en: 'Carrot' } },
    { id: 'tomato', icon: 'tomato', zone: 'veg', label: { ar: 'طماطم', en: 'Tomato' } },
    { id: 'apple', icon: 'apple', zone: 'veg', label: { ar: 'تفاح', en: 'Apple' } },
    { id: 'chicken', icon: 'chicken', zone: 'protein', label: { ar: 'دجاج', en: 'Chicken' } },
    { id: 'fish', icon: 'fish', zone: 'protein', label: { ar: 'سمك', en: 'Fish' } },
    { id: 'egg', icon: 'egg', zone: 'protein', label: { ar: 'بيض', en: 'Egg' } },
    { id: 'rice', icon: 'rice', zone: 'starch', label: { ar: 'أرز', en: 'Rice' } },
    { id: 'bread', icon: 'bread', zone: 'starch', label: { ar: 'خبز', en: 'Bread' } },
    { id: 'donut', icon: 'donut', zone: null, label: { ar: 'دونات', en: 'Donut' } },
  ] as (Item & { zone: PlateZone | null })[],
  drinks: [
    { id: 'water', icon: 'water', ok: true, label: { ar: 'ماء', en: 'Water' } },
    { id: 'milk', icon: 'milk', ok: true, label: { ar: 'حليب', en: 'Milk' } },
    { id: 'fizzy', icon: 'fizzy', ok: false, label: { ar: 'مشروب غازي', en: 'Fizzy drink' } },
  ] as (Item & { ok: boolean })[],
  wrongZoneMessage: { ar: 'مكانه في قسم آخر. جرّب مرة ثانية!', en: 'It belongs in another part. Try again!' },
  fullZoneMessage: { ar: 'هذا القسم امتلأ. املأ قسمًا آخر!', en: 'This part is full. Fill another part!' },
  treatMessage: { ar: 'هذا لبعض الأحيان فقط، ليس لصحن اليوم.', en: "This is only for sometimes, not for today's plate." },
  drinkQuestion: { ar: 'والآن اختر شرابًا ليوسف!', en: 'Now choose a drink for Yousif!' },
  drinkWrongMessage: { ar: 'هذا لبعض الأحيان فقط. اختر شرابًا آخر!', en: 'This is only for sometimes. Choose another drink!' },
  endMessage: {
    ar: 'الصحن المتوازن: نصفه خضار وفواكه، ربعه بروتين، ربعه نشويات، ومعه ماء أو حليب.',
    en: 'A balanced plate: half vegetables and fruit, a quarter protein, a quarter starch, with water or milk.',
  },
};

/* ------------------------------------------------------------------ */
/* Game 6 · Memory Match                                               */
/* ------------------------------------------------------------------ */
export const memory = {
  name: { ar: 'لعبة الذاكرة', en: 'Memory Match' },
  instruction: {
    ar: 'اقلب بطاقتين وابحث عن الصورتين المتشابهتين.',
    en: 'Flip two cards and find the matching pictures.',
  },
  cards: [
    { id: 'water', icon: 'drop', label: { ar: 'ماء', en: 'Water' } },
    { id: 'meter', icon: 'meter', label: { ar: 'جهاز فحص السكر', en: 'Glucose meter' } },
    { id: 'pen', icon: 'pen', label: { ar: 'قلم الإنسولين', en: 'Insulin pen' } },
    { id: 'stethoscope', icon: 'stethoscope', label: { ar: 'سمّاعة الطبيب', en: 'Stethoscope' } },
    { id: 'apple', icon: 'apple', label: { ar: 'تفاحة', en: 'Apple' } },
    { id: 'sleep', icon: 'sleep', label: { ar: 'نوم', en: 'Sleep' } },
    { id: 'ruler', icon: 'ruler', label: { ar: 'مسطرة الطول', en: 'Height ruler' } },
    { id: 'bluecircle', icon: 'bluecircle', label: { ar: 'الدائرة الزرقاء (رمز السكري)', en: 'Blue circle (diabetes symbol)' } },
  ] as Item[],
  endMessage: {
    ar: 'رائع! عرفت أسماء أشياء الصحة بالعربية والإنجليزية.',
    en: 'Great! You know the names of health things in Arabic and English.',
  },
};

export const gameContent = { pop, grow, insulin, insulinRoom, low, plate, memory };
export type GameId = keyof typeof gameContent;
