// Pro-phrase scoring: counts event/exhibition trade vocabulary the user
// actually said during a session, and derives a grade from it.
// This replaces the fixed mock proPhrasesCount with a real measurement.

const GENERAL_VOCAB = [
  'walk you through', 'follow up', 'touch base', 'action item', 'lead time',
  'deliverable', 'timeline', 'escalate', 'contingency', 'stakeholder',
  'on track', 'next step', 'priority', 'confirm', 'commit',
  'ballpark', 'turnaround', 'sign-off', 'circle back', 'move this forward',
  'run me through', 'here\'s my card', 'let me connect you',
];

const SCENARIO_VOCAB: Record<string, string[]> = {
  'venue-walkthrough': [
    'capacity', 'seated', 'comfortably', 'green room', 'backstage', 'programmable',
    'zoned', 'load-in', 'load in', 'floor plan', 'cocktail reception', 'foyer',
  ],
  'av-briefing': [
    'rigging', 'l-c-r', 'lcr', 'front projection', 'ambient light', 'lavalier',
    'confidence monitor', 'signal flow', 'technical rider', 'rider', 'grid',
    'sub-bass', 'full-range', 'sound check', 'soundcheck',
  ],
  'client-pitch': [
    'immersive', 'touchpoint', 'activation', 'brand identity', 'headline experience',
    'contingency plan', 'budget breakdown', 'measurable', 'brand recall', 'brief',
  ],
  'day-of-crisis': [
    'escalate', 'vendor list', 'brief the client', 'worst-case', 'status update',
    'stay calm', 'department head', "i'll handle", 'i will handle',
  ],
  'vendor-negotiation': [
    'middle ground', 'payment terms', 'deliverables', 'negotiable', 'scope',
    'day rate', 'package', 'commit', 'premium', 'cash flow',
  ],
  'post-event-debrief': [
    'debrief', 'post-event report', 'recommendation', 'follow-up call', 'rehearsal',
    'lane system', 'registration', 'assessment', 'address this',
  ],
  'staff-briefing': [
    'station', 'radio me', 'escort', 'foyer', 'vip', 'doors open', 'escalate',
    'give the signal', 'focused', 'briefing',
  ],
  'vip-guest-handling': [
    'personally escort', 'highest priority', 'apologise', 'apologize', 'standard we set',
    'sort this out', 'understand your concern', 'fix this right now',
  ],
  'sponsorship-pitch': [
    'decision-makers', 'naming rights', 'activation', 'speaking slot', 'brand recall',
    'prospectus', 'uplift', 'digital assets', 'tailor', 'audience',
  ],
  'budget-presentation': [
    'line item', 'redundant', 'single point of failure', 'collateral', 'price point',
    'non-negotiable', 'venue hire', 'alternative options', 'breakdown',
  ],
  'catering-coordination': [
    'covers', 'sit-down dinner', 'dietary restriction', 'service corridor', 'canape',
    'canapes', 'circulate', 'commit to that', 'staffing plan', 'service',
  ],
  'stage-manager-handoff': [
    'running order', 'anchor', 'hard out', 'curfew', 'cue sheet', 'channel',
    'segment', 'keynote', 'aligned', 'flex',
  ],
  'booth-qualification': [
    'sourcing', 'volume', 'badge', 'catalogue', 'catalog', 'regional manager',
    'set up a call', 'new line', 'exploring options', 'what brings you',
  ],
  'technical-qa-booth': [
    'spec sheet', 'rated', 'continuous operation', 'certified', 'ce', 'ul', 'rohs',
    'power draw', 'customise', 'customize', 'minimum quantity', 'confirm with our engineer',
  ],
  'customs-freight-crisis': [
    'customs', 'paperwork', 'commercial invoice', 'carnet', 'delivery slot',
    'rental options', 'customs broker', 'express fee', 'status update', 'clear',
  ],
  'services-desk': [
    'circuit', 'amp', 'hardwired', 'advance order', 'show-site', 'labourers',
    'laborers', 'hang sign', 'power drop', 'master account', 'booth plan',
  ],
  'networking-reception': [
    'exhibitor', 'keynote', 'stay in touch', 'linkedin', 'sourcing', 'the range',
    'great meeting you', 'busy booth', 'hall',
  ],
  'self-introduction': [
    'specialise', 'specialize', 'large-format', 'run event production', 'agency',
    'show floor', 'international shows', 'what brings you', 'here\'s my card',
    'work together', 'brand',
  ],
  'lead-follow-up': [
    'following up', 'follow up', 'lead time', 'samples', 'catalogue', 'catalog',
    'spec sheet', 'walk through pricing', 'move this forward', 'short call',
    'go cold', 'attached', 'no pressure',
  ],
  'media-interview': [
    'headline', 'newsworthy', 'modular', 'build time', 'comment on pricing',
    'press kit', 'marketing lead', 'attribute', 'quote', 'on the record',
    'off the record', 'two minutes',
  ],
  'show-teardown': [
    'strike window', 'strike', 'teardown', 'crate', 'manifest', 'return manifest',
    'forklift', 'aisles', 'crate count', 'handover', 'penalties', 'wrap and label',
    'sign-off', 'loaded',
  ],
  'speaker-handling': [
    'confidence monitor', 'slides', 'lectern', 'clicker', 'cue', 'the wings',
    'from the wings', 'green room', 'backstage', 'hold the intro', 'five-minute',
    'under control',
  ],
  'airport-immigration': [
    'trade show', 'exhibiting', 'staying', 'flying back', 'invitation letter',
    'hotel booking', 'business trip', 'return ticket', 'repeat that', 'purpose',
  ],
  'hotel-checkin': [
    'reservation', 'checking out', 'breakfast', 'late check-out', 'shuttle',
    'exhibition centre', 'receipt', 'company', 'wi-fi', 'high floor',
  ],
  'restaurant-dinner': [
    'table for two', 'reservation', 'recommend', 'typical of the region',
    'no pork', 'still water', 'the bill', 'pay by card', 'keep the change', 'bread',
  ],
  'taxi-directions': [
    'take me to', 'east entrance', 'how long', 'drop me', 'take card', 'pay cash',
    'receipt for the fare', 'which way', 's-bahn', 'nearest',
  ],
  'small-talk-host': [
    'first time', 'beautiful', 'weather', 'how long have you', 'recommendations',
    'see a bit of the city', 'so welcome', 'thank you for',
  ],
  'lost-shipment': [
    'checked bag', 'baggage tag', 'materials', 'deliver it', 'hotel address',
    'as soon as it lands', 'reference number', 'follow up', 'courier', 'reference',
  ],
  'client-kickoff': [
    'success look like', 'the audience', 'how many', 'budget range', 'hard date',
    'repeat that back', 'written summary', 'confirm', 'goal', 'flexibility',
  ],
  'contract-review': [
    'payment terms', 'on signing', 'a cap', 'a limit', 'liability', 'clause',
    'cancellation policy', 'in writing', 'the scope', 'revert', 'flag this',
  ],
  'booth-builder': [
    'build schedule', 'on the floor', 'walkthrough', 'pantone', 'power and rigging',
    'signed off', 'snag list', 'two hours ahead', 'carpet', 'lighting',
  ],
  'business-dinner': [
    'joining me', 'on us', 'business talk', 'save it for later', 'get into the',
    'propose a toast', 'partnership', 'take care of the bill', 'a pleasure', 'order whatever',
  ],
  'stage-presentation': [
    'thank you for being here', 'three things', 'the headline', 'quick example',
    'to sum up', 'take questions', 'booth', 'in the next five minutes', 'sustainable',
  ],
};

/** Count distinct pro phrases the user used across their messages. */
export function countProPhrases(userTexts: string[], scenarioId: string): number {
  const combined = userTexts.join(' ').toLowerCase();
  const vocab = [...(SCENARIO_VOCAB[scenarioId] ?? []), ...GENERAL_VOCAB];
  const seen = new Set<string>();
  for (const term of vocab) {
    if (combined.includes(term.toLowerCase())) seen.add(term);
  }
  return seen.size;
}

/**
 * Grade from measurable signals:
 *  - pro phrases used (weight: most)
 *  - average response length (very short replies suggest hesitation)
 */
export function computeGrade(proPhrases: number, userTexts: string[]): string {
  const avgWords =
    userTexts.length === 0
      ? 0
      : userTexts.reduce((sum, t) => sum + t.trim().split(/\s+/).length, 0) / userTexts.length;

  let score = 0;
  if (proPhrases >= 6) score += 3;
  else if (proPhrases >= 4) score += 2;
  else if (proPhrases >= 2) score += 1;

  if (avgWords >= 12) score += 2;
  else if (avgWords >= 7) score += 1;

  if (score >= 5) return 'A';
  if (score >= 4) return 'A-';
  if (score >= 3) return 'B+';
  if (score >= 2) return 'B';
  return 'B-';
}
