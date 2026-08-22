export interface MockTurn {
  aiText: string;
  coachEn: string;
  coachCn: string;
  coachType: 'phrasing' | 'positive' | 'vocabulary';
}

export interface MockScenarioData {
  opening: string;
  turns: MockTurn[];
  result: {
    grade: string;
    proPhrasesCount: number;
    didWell: Array<{ en: string; cn: string }>;
    tryNext: Array<{ en: string; cn: string }>;
    savedPhrases: Array<{ en: string; cn: string; tag: string }>;
  };
}

const mockScenarios: Record<string, MockScenarioData> = {
  'venue-walkthrough': {
    opening:
      "Hi! Thanks for taking the time to show me around. We're looking at hosting a product launch here in about three months. Should we start with the main hall?",
    turns: [
      {
        aiText:
          'This is impressive. How many people can this space accommodate for a seated dinner?',
        coachEn:
          "Good opener. Try leading with 'Let me walk you through the space' — it positions you as the expert guiding the tour.",
        coachCn:
          "开场不错。试试用'Let me walk you through the space'开头——这让你显得更像引导参观的专家。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "That works for our numbers. What about the lighting — can it be customized? Our brand colours are quite specific.",
        coachEn:
          "Great use of 'comfortably' after the capacity number — 'seats 350 comfortably' sounds far more professional than a bare figure.",
        coachCn:
          "在座位数字后加'comfortably'用得很好——'seats 350 comfortably'比单说数字专业多了。",
        coachType: 'positive',
      },
      {
        aiText:
          'Good to know. And is there a separate area for our speakers to prepare backstage?',
        coachEn:
          "Try 'zoned' and 'programmable' — 'The lighting is fully zoned and programmable to match your brand palette' is the professional phrasing here.",
        coachCn:
          "试用'zoned'和'programmable'——'The lighting is fully zoned and programmable'是专业表达方式。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Perfect. One last concern — our guests will be coming from out of town. Is there parking or easy transport access?",
        coachEn:
          "'Green room' and 'backstage holding area' are both standard venue terms. Avoid 'waiting room' — it sounds informal in this context.",
        coachCn:
          "'Green room'和'backstage holding area'都是标准场地术语。避免用'waiting room'——在这个场合听起来不够正式。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "This all sounds very promising. When can I get a full proposal with pricing?",
        coachEn:
          "Excellent. Closing with concrete details like '200 car parking spaces' and '5-minute walk from the station' gives clients real confidence.",
        coachCn:
          "非常好。用具体细节收尾，比如'200个停车位'和'距车站步行5分钟'，能给客户真正的信心。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        {
          en: "'Comfortably' after capacity figures — sounds professional and confident.",
          cn: "在容量数字后加'comfortably'——听起来专业自信。",
        },
        {
          en: 'Clear structure: space → lighting → backstage → transport → next steps.',
          cn: '结构清晰：场地 → 灯光 → 后台 → 交通 → 下一步。',
        },
      ],
      tryNext: [
        {
          en: "Use 'Let me walk you through...' to lead transitions between areas.",
          cn: "用'Let me walk you through...'来引导不同区域之间的转换。",
        },
        {
          en: "Add 'programmable' and 'zoned' when discussing lighting — they're the trade terms.",
          cn: "讨论灯光时加上'programmable'和'zoned'——这是行业术语。",
        },
      ],
      savedPhrases: [
        {
          en: 'Let me walk you through the space from the entrance.',
          cn: '让我从入口开始带您参观场地。',
          tag: 'On-Site',
        },
        {
          en: 'The lighting is fully zoned and programmable.',
          cn: '灯光完全分区且可编程。',
          tag: 'Production',
        },
      ],
    },
  },

  'av-briefing': {
    opening:
      "Right, let's get started. I need the full stage dimensions and ceiling height before I can finalise the rigging plan.",
    turns: [
      {
        aiText:
          "OK, ceiling's workable. What's your speaker setup vision — full L-C-R, or are you going more minimal?",
        coachEn:
          "Good technical specifics. Always confirm the unit — '12 metres wide, 8 metres to the grid' is clearer than just numbers.",
        coachCn:
          "专业数据给得好。一定要确认单位——'12 metres wide, 8 metres to the grid'比单说数字更清晰。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Understood. And for screens — front projection or LED? If it's front, I need to know about ambient light control.",
        coachEn:
          "'L-C-R' is correct trade terminology. Good. Also try 'full-range' to describe the coverage zone — 'full-range L-C-R with sub-bass'.",
        coachCn:
          "'L-C-R'是正确的行业术语，用得好。也可以加上'full-range'描述覆盖范围——'full-range L-C-R with sub-bass'。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Good. What's on the technical rider for the keynote speaker? I need their mic preference and whether they need confidence monitors.",
        coachEn:
          "Perfect use of 'ambient light control' — that's exactly the right phrase in this context. The AV tech will understand immediately.",
        coachCn:
          "'Ambient light control'用得完全正确——这是这个场景中最准确的表达，AV技术人员会立刻明白。",
        coachType: 'positive',
      },
      {
        aiText:
          "Good. I'll handle the monitor mix separately. When do you want to do the final system check?",
        coachEn:
          "Try 'Let me pull up the technical rider' — it shows you have documentation ready. 'Rider' is the correct term for a speaker's technical requirements.",
        coachCn:
          "试用'Let me pull up the technical rider'——这表明你有文件准备好了。'Rider'是演讲者技术要求的专业术语。",
        coachType: 'vocabulary',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 5,
      didWell: [
        {
          en: "Correct use of 'L-C-R' and 'ambient light control' — industry terms used naturally.",
          cn: "正确使用了'L-C-R'和'ambient light control'——行业术语运用自然流畅。",
        },
        {
          en: 'Gave concrete specs (dimensions, height) with units. Very professional.',
          cn: '提供了带单位的具体规格（尺寸、高度），非常专业。',
        },
      ],
      tryNext: [
        {
          en: "Add 'to the grid' after ceiling height — 'grid' is the standard rigging reference point.",
          cn: "在天花板高度后加'to the grid'——'grid'是标准吊挂参考点。",
        },
        {
          en: "'Let me pull up the technical rider' — always say you have documents ready.",
          cn: "'Let me pull up the technical rider'——始终表明你有文件准备好。",
        },
      ],
      savedPhrases: [
        {
          en: 'Let me pull up the technical rider.',
          cn: '让我调出技术规格清单。',
          tag: 'Production',
        },
        {
          en: 'We need confidence monitors for the keynote speaker.',
          cn: '主讲嘉宾需要提词屏。',
          tag: 'Production',
        },
      ],
    },
  },

  'client-pitch': {
    opening:
      "Alright, I've given you fifteen minutes. Three agencies in this week and they all sounded the same. What makes your concept different?",
    turns: [
      {
        aiText:
          "Interesting. But how does this specifically connect to our brand identity? I don't want another generic activation.",
        coachEn:
          "Strong opener. 'Immersive' is the right word here. Try adding 'measurable' — clients want to know what they can track.",
        coachCn:
          "开场有力。'Immersive'是正确的词。试着加上'measurable'——客户想知道有哪些可量化的成果。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Our CEO is very particular about the messaging. What would the headline experience be — the one thing guests walk away talking about?",
        coachEn:
          "Good. 'Every touchpoint' is excellent event industry language. Use it naturally — you just did.",
        coachCn:
          "'Every touchpoint'是非常好的活动行业用语。自然地使用它——你刚才已经做到了。",
        coachType: 'positive',
      },
      {
        aiText:
          "And if the technology fails on the day? We've been burned before — I need to know your backup plan.",
        coachEn:
          "The 'headline experience' framing is perfect for a pitch. It gives the client one memorable image to take away.",
        coachCn:
          "'Headline experience'的表达框架非常适合提案。它给客户留下一个令人难忘的核心印象。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Fair enough. Walk me through the budget breakdown — I want to know where the money is actually going.",
        coachEn:
          "'Contingency plan' is correct. Even stronger: 'We run a full technical rehearsal 24 hours before. That's our insurance.'",
        coachCn:
          "'Contingency plan'是正确的表达。更有力的说法是：'We run a full technical rehearsal 24 hours before. That's our insurance.'",
        coachType: 'phrasing',
      },
      {
        aiText:
          "That's the first honest answer I've heard all week. I'd like to see a full proposal. Can you have it by Thursday?",
        coachEn:
          "Excellent close. 'The majority goes directly into guest experience' is honest and persuasive. Clients remember that.",
        coachCn:
          "收尾很好。'The majority goes directly into guest experience'既诚实又有说服力，客户会记住这句话。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 3,
      didWell: [
        {
          en: "Used 'every touchpoint' and 'headline experience' naturally — strong industry language.",
          cn: "自然地使用了'every touchpoint'和'headline experience'——有力的行业用语。",
        },
        {
          en: 'Stayed calm under pressure from a skeptical client. Good composure.',
          cn: '面对持怀疑态度的客户保持冷静，沉着应对。',
        },
      ],
      tryNext: [
        {
          en: "Lead with 'measurable outcomes' — skeptical clients respond to data.",
          cn: "以'measurable outcomes'开场——持怀疑态度的客户对数据有反应。",
        },
        {
          en: "For contingency: 'We run a full technical rehearsal 24 hours before' is more convincing than 'we have a plan'.",
          cn: "关于应急方案：'We run a full technical rehearsal 24 hours before'比'we have a plan'更有说服力。",
        },
      ],
      savedPhrases: [
        {
          en: 'Every touchpoint is designed around your brand identity.',
          cn: '每个接触点都围绕您的品牌形象设计。',
          tag: 'Business',
        },
        {
          en: "Based on your brief, I'd like to walk you through the budget breakdown.",
          cn: '根据您的需求简报，我想带您了解预算分配情况。',
          tag: 'Business',
        },
      ],
    },
  },

  'day-of-crisis': {
    opening:
      "We've got a serious problem. The catering company just called — food poisoning at another event last night. They're pulling out. We have two hours. What do you want to do?",
    turns: [
      {
        aiText:
          "Metro Catering is available but they need a decision in the next ten minutes. Do I call them?",
        coachEn:
          "Great — 'let's stay calm' sounds very professional under pressure. Try also: 'Let me escalate this' when you need to take charge.",
        coachCn:
          "说得好，'let's stay calm'在压力下听起来非常专业。当你需要掌控局面时，也可以试试'Let me escalate this'。",
        coachType: 'positive',
      },
      {
        aiText:
          "Metro's confirmed. Next problem — the client just arrived and is asking why tables aren't set up yet. How do you want to handle them?",
        coachEn:
          "Clear decision-making. 'I'll brief the client personally' shows ownership. Avoid 'someone should' — always say 'I will'.",
        coachCn:
          "决策清晰。'I'll brief the client personally'展示了责任感。避免说'someone should'——始终说'I will'。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Good. AV team says the main screen is flickering. Could be a loose cable or something bigger. Do they stop and investigate or keep going?",
        coachEn:
          "Perfect. 'I'll handle the client directly' is excellent crisis language — clear, confident, decisive.",
        coachCn:
          "'I'll handle the client directly'是非常好的危机处理语言——清晰、自信、果断。",
        coachType: 'positive',
      },
      {
        aiText:
          "They found a loose HDMI — fixed in two minutes. We're back on track. What's your priority for the next 90 minutes?",
        coachEn:
          "Good call on the AV decision. Try: 'Do a quick check — five minutes maximum, then we carry on regardless.'",
        coachCn:
          "在AV决策上判断正确。可以试试：'Do a quick check — five minutes maximum, then we carry on regardless.'",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 5,
      didWell: [
        {
          en: "'Let's stay calm' under genuine pressure — sets the right tone for the whole team.",
          cn: "在真实压力下说出'Let's stay calm'——为整个团队定下了正确的基调。",
        },
        {
          en: "Clear ownership: 'I'll handle', 'I'll brief' — no ambiguity about who does what.",
          cn: "明确的责任感：'I'll handle'、'I'll brief'——对于谁负责什么，毫无歧义。",
        },
      ],
      tryNext: [
        {
          en: "'Let me escalate this' — use when taking command of a situation from someone else.",
          cn: "'Let me escalate this'——当你从他人手中接管情况时使用。",
        },
        {
          en: "For tech issues: 'Five minutes maximum check, then carry on' gives a clear time boundary.",
          cn: "处理技术问题时：'Five minutes maximum check, then carry on'给出了清晰的时间边界。",
        },
      ],
      savedPhrases: [
        {
          en: "Let's stay calm. Give me the approved vendor list right now.",
          cn: '保持冷静。请立刻给我看已审批的供应商名单。',
          tag: 'Crisis',
        },
        {
          en: "I'll handle the client directly.",
          cn: '我来直接处理客户。',
          tag: 'On-Site',
        },
      ],
    },
  },

  'vendor-negotiation': {
    opening:
      "I've reviewed your RFQ and I want to be upfront — our quote is firm. We're already offering below our standard day rate for this client.",
    turns: [
      {
        aiText:
          "Look, I understand your budget pressure, but our team of eight technicians plus the full LED wall — that price is what keeps this profitable for us.",
        coachEn:
          "Good opening. 'Find middle ground' is strong negotiation language. Also try: 'I'm not asking you to lose — I'm asking you to help me make this work.'",
        coachCn:
          "'Find middle ground'是很好的谈判用语。也可以试试：'I'm not asking you to lose — I'm asking you to help me make this work.'",
        coachType: 'phrasing',
      },
      {
        aiText:
          "What I can do is adjust the payment terms — 50% on signing, 50% on completion instead of the three-stage structure. Would that help with your cash flow?",
        coachEn:
          'Smart pivot. Proposing payment terms instead of discounts is advanced negotiation. Well done.',
        coachCn: '聪明的转变。提出付款条款而非折扣是高级谈判技巧，做得好。',
        coachType: 'positive',
      },
      {
        aiText:
          "If we scale back to six technicians and a smaller LED wall, I can bring the price down by 15%. But the premium look will be affected.",
        coachEn:
          "Good question on scope. 'What's negotiable on the deliverables' is exactly the right framing for this conversation.",
        coachCn:
          "在项目范围上问得好。'What's negotiable on the deliverables'正是这个对话的正确框架。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "I can hold that reduced package for 48 hours. After that the team slots will be reallocated. Do you need that time?",
        coachEn:
          "Correct to say you need client approval. 'I need to take this back to my client' is professional and buys you time without appearing weak.",
        coachCn:
          "说需要客户确认是正确的。'I need to take this back to my client'既专业，又能为你争取时间，而不显得软弱。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 3,
      didWell: [
        {
          en: 'Proposed payment terms as an alternative to price cuts — advanced negotiation move.',
          cn: '提出付款条款作为降价的替代方案——高级谈判策略。',
        },
        {
          en: "'I need to take this back to my client' — professional deflection that buys time.",
          cn: "'I need to take this back to my client'——专业的缓冲话术，为自己争取时间。",
        },
      ],
      tryNext: [
        {
          en: "'I'm not asking you to lose — I'm asking you to help me make this work.' — disarms defensive suppliers.",
          cn: "这句话能化解供应商的防御性：'I'm not asking you to lose — I'm asking you to help me make this work.'",
        },
        {
          en: "Ask 'What's negotiable on the deliverables?' early — it opens creative solutions.",
          cn: "尽早问'What's negotiable on the deliverables?'——这能打开创造性解决方案的空间。",
        },
      ],
      savedPhrases: [
        {
          en: 'We need to find middle ground here.',
          cn: '我们需要在这里找到一个折中方案。',
          tag: 'Business',
        },
        {
          en: "I need to take this back to my client before I can commit.",
          cn: '我需要先跟客户确认再做决定。',
          tag: 'Business',
        },
      ],
    },
  },

  // ── 6 New Scenarios ──────────────────────────────────────────────────────

  'staff-briefing': {
    opening:
      "Alright team, gather round. We have 45 minutes before doors open and I need everyone sharp. What's the situation with the registration desk?",
    turns: [
      {
        aiText:
          "Got it. And what happens if we get a big rush in the first ten minutes — there's only two of us on registration.",
        coachEn:
          "Good opener. Say 'Doors open in 45 minutes — I want everyone clear on their station.' It sets urgency and authority at once.",
        coachCn:
          "开场不错。说'Doors open in 45 minutes — I want everyone clear on their station.'这句话同时传递了紧迫感和权威感。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "What about the VIP guests? I heard they're arriving through the main entrance.",
        coachEn:
          "Good escalation rule. Always say 'radio me first' — 'If a guest has a complaint, radio me first, don't handle it alone' is the exact phrase event professionals use.",
        coachCn:
          "好的升级规则。一定要说'radio me first'——'If a guest has a complaint, radio me first, don't handle it alone'是活动专业人员使用的准确表达。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Understood. One more thing — catering says they're running a bit behind on the buffet setup. Should we delay doors?",
        coachEn:
          "Perfect — 'escort them directly to the lounge' is the professional instruction. Use 'escort' not 'take' or 'bring' for VIP guests.",
        coachCn:
          "完美——'escort them directly to the lounge'是专业指示语。对VIP宾客用'escort'而不是'take'或'bring'。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Right, I'll keep guests in the foyer. Anything else before we take our positions?",
        coachEn:
          "Good decision. Try: 'Keep guests in the foyer until I give the signal' — it establishes you as the one in control of timing.",
        coachCn:
          "决策正确。试试：'Keep guests in the foyer until I give the signal'——这表明你是掌控时间节奏的人。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Perfect. Team's ready. Good luck out there.",
        coachEn:
          "Strong close. 'Any questions? Speak now — once the doors open, I need everyone focused.' Use it every time to signal the end of the brief.",
        coachCn:
          "收尾有力。'Any questions? Speak now — once the doors open, I need everyone focused.'每次都用这句话来表示简报结束。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 5,
      didWell: [
        { en: "Used 'escort' for VIP guests — exactly the right register.", cn: "对VIP宾客使用了'escort'——完全正确的语体风格。" },
        { en: "Set a clear escalation rule: 'radio me first' — no ambiguity.", cn: "设定了清晰的上报规则：'radio me first'——毫无歧义。" },
      ],
      tryNext: [
        { en: "Open every briefing with a countdown: 'Doors open in X minutes.'", cn: "每次简报都以倒计时开场：'Doors open in X minutes.'。" },
        { en: "Close with: 'Any questions? Speak now — once the doors open, I need everyone focused.'", cn: "用这句话结束：'Any questions? Speak now — once the doors open, I need everyone focused.'。" },
      ],
      savedPhrases: [
        { en: "Doors open in 45 minutes — I want everyone clear on their station.", cn: "还有45分钟开门，我要确保每个人都清楚自己的位置。", tag: 'On-Site' },
        { en: "If a guest has a complaint, radio me first — don't handle it alone.", cn: "如果宾客有投诉，先用对讲机联系我，不要自行处理。", tag: 'On-Site' },
      ],
    },
  },

  'vip-guest-handling': {
    opening:
      "Excuse me — I was told I'd be seated at table one with the other board members. I've just been put at table seven. This is completely unacceptable.",
    turns: [
      {
        aiText:
          "I was personally confirmed at table one by your events coordinator last week. I have the email.",
        coachEn:
          "Strong opener. 'I completely understand your concern, and I'm going to fix this right now' is the gold standard for VIP recovery — empathy plus immediate action.",
        coachCn:
          "'I completely understand your concern, and I'm going to fix this right now'是VIP补救的黄金标准——同理心加即时行动。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "I don't want to wait. My colleagues are already seated and this is embarrassing.",
        coachEn:
          "Good instinct. 'Allow me to personally escort you' is the right phrase — 'personally' signals that you are taking ownership, not delegating.",
        coachCn:
          "'Allow me to personally escort you'是正确表达——'personally'表明你亲自负责，而不是推给别人。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Fine. But I want to understand how this happened in the first place.",
        coachEn:
          "Excellent composure. 'Your experience tonight is our highest priority' should precede any explanation. Never defend before you've solved the problem.",
        coachCn:
          "沉着应对，做得很好。'Your experience tonight is our highest priority'应该在任何解释之前说出来。解决问题之前永远不要辩解。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "All right, I appreciate that. I'd still like someone to look into it.",
        coachEn:
          "Good accountability phrase: 'I apologise for this — it's not the standard we set for ourselves.' It acknowledges the failure without over-explaining.",
        coachCn:
          "'I apologise for this — it's not the standard we set for ourselves.'是好的问责措辞。它承认了失误，但没有过度解释。",
        coachType: 'positive',
      },
      {
        aiText:
          "Thank you. I'll hold you to that. Can I at least get a drink while we move?",
        coachEn:
          "'Can I offer you a drink while we sort this out?' — a small gesture that buys goodwill and time. Always offer something while fixing the issue.",
        coachCn:
          "'Can I offer you a drink while we sort this out?'——一个小举动，能赢得好感并争取时间。处理问题时始终主动提供一些东西。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 5,
      didWell: [
        { en: "Stayed calm throughout — composure is the most important skill in VIP recovery.", cn: "全程保持冷静——沉着是VIP补救中最重要的技能。" },
        { en: "'Allow me to personally escort you' — ownership language, not deflection.", cn: "'Allow me to personally escort you'——承担责任的语言，而非推卸。" },
      ],
      tryNext: [
        { en: "Always offer something (drink, seat, apology) before explaining what happened.", cn: "在解释发生了什么之前，始终先提供一些东西（饮品、座位、道歉）。" },
        { en: "Say 'I'll make sure the event manager is personally aware' to show escalation.", cn: "说'I'll make sure the event manager is personally aware'来表明已升级处理。" },
      ],
      savedPhrases: [
        { en: "I completely understand your concern, and I'm going to fix this right now.", cn: "我完全理解您的顾虑，我现在就去解决。", tag: 'On-Site' },
        { en: "Allow me to personally escort you to your seat.", cn: "请允许我亲自带您到您的座位。", tag: 'On-Site' },
      ],
    },
  },

  'sponsorship-pitch': {
    opening:
      "I've got 20 minutes. We receive a lot of these proposals, so I need to understand quickly — why this event, and why your package over anyone else's?",
    turns: [
      {
        aiText:
          "800 decision-makers sounds good, but what's the quality of the audience? We need people who can actually act on our brand.",
        coachEn:
          "Strong fact-first opener. Always lead with audience size and quality together — 'This event reaches 800 decision-makers from luxury retail' gives both in one line.",
        coachCn:
          "以数据开场，做得好。在一句话中同时呈现受众规模和质量——'This event reaches 800 decision-makers from luxury retail'就做到了这一点。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "What exactly is included in the naming rights package? I don't want to pay for logo placement that no one looks at.",
        coachEn:
          "Good qualifier. 'Decision-makers who can act on your brand' is excellent sales language — you mirrored their concern back perfectly.",
        coachCn:
          "'Decision-makers who can act on your brand'是很好的销售语言——你完美地将他们的顾虑反映了回去。",
        coachType: 'positive',
      },
      {
        aiText:
          "A speaking slot is interesting. But our Q4 campaign focuses on sustainability — does the event have any angle on that?",
        coachEn:
          "Good package breakdown. List benefits in this order: visibility, reach, then interaction. 'Naming rights, digital assets, speaking slot' flows naturally.",
        coachCn:
          "套餐介绍得好。按这个顺序列出好处：曝光度、覆盖范围，然后是互动机会。'Naming rights, digital assets, speaking slot'顺序流畅自然。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "That's useful. Can you quantify what past sponsors have actually gotten out of this?",
        coachEn:
          "'We can tailor the activation to align with your Q4 campaign' is perfect — it shows flexibility and makes the pitch personal.",
        coachCn:
          "'We can tailor the activation to align with your Q4 campaign'非常好——这展示了灵活性，并使提案个性化。",
        coachType: 'positive',
      },
      {
        aiText:
          "22% brand recall uplift is solid. What's the next step if we want to proceed?",
        coachEn:
          "Always close with data and a next step together. 'Last year's headline sponsor saw a 22% uplift — I can send you the full prospectus today' links proof to action.",
        coachCn:
          "始终将数据和下一步行动结合起来收尾。'Last year's headline sponsor saw a 22% uplift — I can send you the full prospectus today'将证明与行动联系起来。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: "Led with specific audience data — '800 decision-makers from luxury retail.'", cn: "以具体受众数据开场——'800 decision-makers from luxury retail'。" },
        { en: "Linked sponsorship to their Q4 campaign — made it feel personalised.", cn: "将赞助与他们的第四季度营销计划挂钩——让提案感觉个性化。" },
      ],
      tryNext: [
        { en: "Mirror the client's language back at them — if they say 'sustainability', use it in your next sentence.", cn: "将客户的语言反映回去——如果他们说'sustainability'，就在下句话中使用它。" },
        { en: "Always close with a specific next step: 'I can send you the prospectus by end of day.'", cn: "始终以具体的下一步行动收尾：'I can send you the prospectus by end of day.'。" },
      ],
      savedPhrases: [
        { en: "This event reaches 800 decision-makers from the luxury retail sector.", cn: "此次活动将触达800位来自奢侈品零售领域的决策者。", tag: 'Business' },
        { en: "We can tailor the activation to align with your Q4 campaign.", cn: "我们可以定制互动活动以配合您的第四季度营销计划。", tag: 'Business' },
      ],
    },
  },

  'budget-presentation': {
    opening:
      "I've been through the budget you sent and I have to be honest — the numbers are significantly higher than what we discussed in our initial meeting. Can you walk me through this?",
    turns: [
      {
        aiText:
          "Let's start with AV — it's nearly double what I expected. What's driving that?",
        coachEn:
          "Good framing. 'Let me walk you through where each line item comes from' signals transparency. Clients need to feel you have nothing to hide.",
        coachCn:
          "'Let me walk you through where each line item comes from'传递了透明度。客户需要感受到你没有任何隐瞒。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Redundant system — meaning what exactly? That sounds like it's doubling everything.",
        coachEn:
          "Excellent technical explanation. 'No single point of failure' is the phrase that justifies AV costs to non-technical clients. Use it every time.",
        coachCn:
          "'No single point of failure'是向非技术客户解释AV费用合理性的关键短语。每次都要用它。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "OK, I follow the logic. What if we did need to cut — where would you start?",
        coachEn:
          "Smart pivot. Volunteering where to cut first ('print collateral') shows confidence and protects the important items like AV and venue.",
        coachCn:
          "聪明的转向。主动提出首先削减哪里（'print collateral'）显示了自信，并保护了AV和场地等重要项目。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "What about the venue cost? That's a big number to lock in at this stage.",
        coachEn:
          "'Non-negotiable at this stage' is strong but correct — pair it immediately with the reason. 'We signed the contract last month' makes it factual, not defensive.",
        coachCn:
          "'Non-negotiable at this stage'表达有力但正确——立即配上原因。'We signed the contract last month'让它看起来是事实陈述，而非防御性回应。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "I'd like to see the options. Can you have alternatives ready by Thursday?",
        coachEn:
          "Great close. 'I can provide three alternative options at different price points by tomorrow' — always give a specific number of options and a specific deadline.",
        coachCn:
          "'I can provide three alternative options at different price points by tomorrow'——始终给出具体的方案数量和明确的截止日期。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        { en: "'No single point of failure' — a technical phrase that instantly justifies cost.", cn: "'No single point of failure'——一个立即能证明费用合理性的技术短语。" },
        { en: "Volunteered where to cut first — shows confidence, not defensiveness.", cn: "主动提出首先削减哪里——显示自信，而非防御性。" },
      ],
      tryNext: [
        { en: "When something is non-negotiable, always follow it with the factual reason — not an opinion.", cn: "当某事不可协商时，始终用事实原因来跟进，而不是个人观点。" },
        { en: "Give a specific number of alternatives and a specific deadline when offering options.", cn: "在提供备选方案时，给出具体的方案数量和明确的截止日期。" },
      ],
      savedPhrases: [
        { en: "Let me walk you through where each line item comes from.", cn: "让我带您了解每一项费用的来源。", tag: 'Business' },
        { en: "The AV cost is higher because we're using a fully redundant system — no single point of failure.", cn: "AV费用较高，因为我们使用了完全冗余的系统，不存在单点故障。", tag: 'Production' },
      ],
    },
  },

  'catering-coordination': {
    opening:
      "Right, I need to go through the service timeline with you. The client wants everything to run precisely tonight — no delays, no substitutions. Where are we on setup?",
    turns: [
      {
        aiText:
          "We're on track for setup. But I want to clarify — the client's brief says 280 covers but the table plan I received shows 295. Which number is correct?",
        coachEn:
          "Good — always confirm the cover count first. 'The client confirmed 280 covers for a three-course sit-down dinner' establishes the authoritative number immediately.",
        coachCn:
          "首先确认餐位数量，做得对。'The client confirmed 280 covers for a three-course sit-down dinner'立即确立了权威数字。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "OK, 280 it is. What's your absolute deadline for first course service?",
        coachEn:
          "'Service needs to begin at exactly 19:30 — can you commit to that?' The phrase 'commit to that' makes it a professional agreement, not just a suggestion.",
        coachCn:
          "'Service needs to begin at exactly 19:30 — can you commit to that?'中'commit to that'这个短语让它成为专业承诺，而非仅仅是建议。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "19:30 is fine. We'll need the dietary restriction list no later than one hour before service.",
        coachEn:
          "Perfect. 'Six guests with dietary restrictions — I'll send you the full list now' gives a number and an immediate action. Never just say 'some guests have restrictions.'",
        coachCn:
          "'Six guests with dietary restrictions — I'll send you the full list now'给出了数量和即时行动。永远不要只说'some guests have restrictions'。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Got it. One issue — my team has been using the main entrance for deliveries. Is that a problem?",
        coachEn:
          "Clear and direct. 'The kitchen access is through the service corridor — do not use the main entrance' is exactly how you phrase operational instructions. Firm, factual, no apology.",
        coachCn:
          "'The kitchen access is through the service corridor — do not use the main entrance'正是你表达操作指令的方式。坚定、基于事实、无需道歉。",
        coachType: 'positive',
      },
      {
        aiText:
          "Understood, we'll redirect. What's the canape plan before the main hall opens?",
        coachEn:
          "Good timing clarity. 'Canapes need to circulate for 45 minutes before we move guests into the main hall' — specific numbers always beat vague timeframes.",
        coachCn:
          "'Canapes need to circulate for 45 minutes before we move guests into the main hall'——具体数字始终优于模糊的时间框架。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 5,
      didWell: [
        { en: "Specific cover count confirmed immediately — no room for error.", cn: "立即确认了具体的餐位数量，没有留下错误空间。" },
        { en: "Used 'commit to that' for the service time — turns request into agreement.", cn: "对服务时间使用了'commit to that'——将请求变成了承诺。" },
      ],
      tryNext: [
        { en: "Always give a number with dietary restrictions: 'six guests' not 'some guests.'", cn: "在提饮食限制时始终给出数字：'six guests'而非'some guests'。" },
        { en: "Use specific durations for every canape and service window — no 'roughly' or 'around.'", cn: "为每个开胃小食和服务时间窗口使用具体时长——不要用'roughly'或'around'。" },
      ],
      savedPhrases: [
        { en: "Service needs to begin at exactly 19:30 — can you commit to that?", cn: "上菜需要在19:30准时开始，您能保证做到吗？", tag: 'Production' },
        { en: "The kitchen access is through the service corridor — do not use the main entrance.", cn: "厨房通道走服务走廊，不要走主入口。", tag: 'On-Site' },
      ],
    },
  },

  'stage-manager-handoff': {
    opening:
      "OK, I'm your stage manager for tonight. Give me everything — I'm starting fresh. What's the running order and what do I need to know before we go live?",
    turns: [
      {
        aiText:
          "Six segments in 90 minutes — that's tight. What's the most critical one I absolutely cannot let run over?",
        coachEn:
          "Good structure. 'Here's the running order — we have six segments across 90 minutes' is the exact framing stage managers expect. Brief, complete, chronological.",
        coachCn:
          "'Here's the running order — we have six segments across 90 minutes'是舞台监督期望听到的准确框架。简洁、完整、按时间顺序。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Got it — keynote is untouchable. If the panel runs long, do I just cut the Q&A?",
        coachEn:
          "'The keynote is the anchor — everything else flexes around it.' Use 'anchor' and 'flex' — these are stage manager vocabulary.",
        coachCn:
          "'The keynote is the anchor — everything else flexes around it.'使用'anchor'和'flex'——这些是舞台监督的专业词汇。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Understood. What's our hard deadline? Any venue restrictions I need to know?",
        coachEn:
          "Correct. 'We have a hard out at 22:00 — the venue has a strict noise curfew.' The phrase 'hard out' is essential stage manager language for a fixed end time.",
        coachCn:
          "'We have a hard out at 22:00 — the venue has a strict noise curfew.'短语'hard out'是舞台监督用于固定结束时间的必备语言。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Radio channel 3 — confirmed. And where will you be during the show?",
        coachEn:
          "Good channel assignment. Always assign specific channels: 'Radio channel 3 is yours — I'm on channel 1 with the client.' No overlap, no confusion.",
        coachCn:
          "好的频道分配。始终指定具体频道：'Radio channel 3 is yours — I'm on channel 1 with the client.'不重叠，不混淆。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "I'll be at the stage-right console. I've got my cue sheet ready — do you want to go through it?",
        coachEn:
          "Perfect handoff. 'Walk me through your cue sheet — I want to make sure we're aligned' shows professional trust and catches any misalignment before it's too late.",
        coachCn:
          "'Walk me through your cue sheet — I want to make sure we're aligned'展示了专业的信任，并在为时已晚之前发现任何不一致之处。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 5,
      didWell: [
        { en: "Used 'anchor' and 'hard out' — production vocabulary that earns immediate respect.", cn: "使用了'anchor'和'hard out'——能立即赢得尊重的制作专业词汇。" },
        { en: "Assigned specific radio channels — no ambiguity about who is on what frequency.", cn: "指定了具体的对讲机频道——对于谁在哪个频率上毫无歧义。" },
      ],
      tryNext: [
        { en: "Always state which segment is the 'anchor' upfront — everyone needs to know what's protected.", cn: "始终在开始时说明哪个环节是'anchor'——每个人都需要知道什么是不可改动的。" },
        { en: "Close the handoff with 'Walk me through your cue sheet' — it confirms alignment.", cn: "用'Walk me through your cue sheet'结束交接——这确认了双方一致。" },
      ],
      savedPhrases: [
        { en: "The keynote is the anchor — everything else flexes around it.", cn: "主题演讲是核心，其他所有环节都围绕它灵活调整。", tag: 'Production' },
        { en: "We have a hard out at 22:00 — the venue has a strict noise curfew.", cn: "我们必须在22:00前结束，场地有严格的噪音宵禁规定。", tag: 'Production' },
      ],
    },
  },

  'post-event-debrief': {
    opening:
      "Thanks for meeting with me. Overall, the event went well — but I want to talk through a few things that didn't go as planned.",
    turns: [
      {
        aiText:
          "The registration queue was much longer than expected in the first thirty minutes. Some of my board members were waiting nearly fifteen minutes. That shouldn't happen.",
        coachEn:
          "Good response. Always acknowledge the issue first — 'You're right, and I want to address this directly' is stronger than jumping to solutions.",
        coachCn:
          "回应得好。在给出解决方案之前先承认问题——'You're right, and I want to address this directly'比直接给出解决方案更有力。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "A pre-assigned lane system sounds practical. On the positive side — the keynote setup was excellent and the speaker was very happy. What drove that success?",
        coachEn:
          "Good concrete solution. 'Pre-assigned lane system' is exactly the kind of specific improvement clients want to hear.",
        coachCn:
          "'Pre-assigned lane system'是客户想听到的具体改进方案。",
        coachType: 'positive',
      },
      {
        aiText:
          "Good. For our next event in September, what would you do differently? I want your honest assessment, not just what sounds good.",
        coachEn:
          "Excellent. Crediting the 'technical rehearsal' is smart — it shows your process, not just the outcome.",
        coachCn:
          "很好。把成功归因于'technical rehearsal'很聪明——这展示了你的流程，而不仅仅是结果。",
        coachType: 'positive',
      },
      {
        aiText:
          "I appreciate the honesty. When can I expect the full post-event report?",
        coachEn:
          "'My honest recommendation' is strong phrasing in a debrief — clients ask for honesty and you delivered it. Pair it with a concrete action.",
        coachCn:
          "'My honest recommendation'在复盘中是很有力的措辞——客户要求诚实，而你做到了。记得配合具体的行动计划。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        {
          en: "Offered a specific solution (pre-assigned lanes) — not a vague promise to 'do better'.",
          cn: "提出了具体解决方案（预分配通道）——而不是含糊地承诺'做得更好'。",
        },
        {
          en: "Credited process ('technical rehearsal') for success — builds client confidence in your methodology.",
          cn: "将成功归因于流程（'technical rehearsal'）——增强了客户对你方法论的信心。",
        },
      ],
      tryNext: [
        {
          en: "Open with 'You're right, and I want to address this directly' before solutions.",
          cn: "在给出解决方案之前，先说'You're right, and I want to address this directly'。",
        },
        {
          en: "Close with 'I'd like to schedule a follow-up call' to keep momentum.",
          cn: "用'I'd like to schedule a follow-up call'收尾，保持推进势头。",
        },
      ],
      savedPhrases: [
        {
          en: 'My honest recommendation for September would be...',
          cn: '我对九月活动的诚实建议是……',
          tag: 'Business',
        },
        {
          en: "We'll put together a full post-event report with data by end of week.",
          cn: '我们将在本周末前提供一份包含数据的完整活动总结报告。',
          tag: 'Business',
        },
      ],
    },
  },

  // ── Exhibitor-side scenarios ─────────────────────────────────────────────

  'booth-qualification': {
    opening:
      "Hi there — I was just walking past and your LED wall caught my eye. What is it you folks actually do?",
    turns: [
      {
        aiText:
          "We're a distributor, mid-size, mostly covering the DACH region. To be honest I'm just browsing today.",
        coachEn:
          "Good open. 'What brings you to the show this year?' beats 'Can I help you?' — it starts a conversation instead of inviting 'just looking'.",
        coachCn:
          "'What brings you to the show this year?'比'Can I help you?'好——它开启对话，而不是让对方说'随便看看'。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Well — we are reviewing our supplier list for next year, actually. Volumes around 20 containers annually.",
        coachEn:
          "Perfect qualifying question. 'Are you currently sourcing, or exploring options?' sorts real buyers from browsers in one sentence.",
        coachCn:
          "'Are you currently sourcing, or exploring options?'一句话就能区分真正的买家和随便看看的人。",
        coachType: 'positive',
      },
      {
        aiText:
          "Twenty containers, yes. Lead time and certification matter more to us than price, frankly.",
        coachEn:
          "Great — you mirrored their volume number back. Repeating the customer's key figure ('twenty containers') shows you're listening and anchors the conversation.",
        coachCn:
          "很好——你复述了对方的数量。重复客户的关键数字（'twenty containers'）表明你在倾听，并锚定了对话。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Sure, you can scan it. Send me the catalogue and have your regional person reach out after the show.",
        coachEn:
          "Textbook close. 'Let me scan your badge so I can send you the full catalogue' converts a chat into a lead — always capture before they walk.",
        coachCn:
          "教科书式的收尾。'Let me scan your badge so I can send you the full catalogue'把闲聊变成销售线索——一定要在对方离开前留下联系方式。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: "Qualified budget and volume within two minutes — that's booth discipline.", cn: '两分钟内确认了预算和采购量——这就是展位工作的纪律性。' },
        { en: 'Captured the lead (badge scan) before the visitor walked away.', cn: '在访客离开前拿到了线索（扫描胸卡）。' },
      ],
      tryNext: [
        { en: "Open with 'What brings you to the show?' — never 'Can I help you?'", cn: "用'What brings you to the show?'开场——永远不要用'Can I help you?'。" },
        { en: 'Repeat the visitor\'s key numbers back to them to anchor the conversation.', cn: '把访客的关键数字复述给他们听，以锚定对话。' },
      ],
      savedPhrases: [
        { en: 'Are you currently sourcing, or exploring options for next year?', cn: '您是正在采购，还是在为明年考察方案？', tag: 'On-Site' },
        { en: 'Let me scan your badge so I can send you the full catalogue.', cn: '让我扫一下您的胸卡，稍后把完整目录发给您。', tag: 'On-Site' },
      ],
    },
  },

  'technical-qa-booth': {
    opening:
      "I've read your brochure but I need specifics. What's the continuous operating temperature range on the 500 series, and is that tested or theoretical?",
    turns: [
      {
        aiText:
          "Tested, good. And the certification — is the UL listing on the whole assembly or just components?",
        coachEn:
          "Excellent instinct pulling up the spec sheet. Saying 'let me pull up the exact spec sheet' buys thinking time AND looks professional — never guess a number.",
        coachCn:
          "调出规格表的反应非常好。说'let me pull up the exact spec sheet'既争取了思考时间又显得专业——永远不要猜测数字。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Whole assembly — that's what I needed to hear. What about power draw compared with your previous generation?",
        coachEn:
          "'Fully certified — CE, UL and RoHS documentation is available' is the exact phrase. Listing the certifications by name builds instant credibility.",
        coachCn:
          "'Fully certified — CE, UL and RoHS documentation is available'是准确的表达。逐一说出认证名称能立即建立可信度。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Eighteen percent is significant. Last question — can the firmware parameters be customised for our integration?",
        coachEn:
          "Perfect. A precise percentage ('down eighteen percent') is worth ten adjectives. Engineers trust numbers, not superlatives.",
        coachCn:
          "完美。一个精确的百分比（'down eighteen percent'）胜过十个形容词。工程师相信数字，不相信最高级形容词。",
        coachType: 'positive',
      },
      {
        aiText:
          "Fair answer. I'd rather have a correct number tomorrow than a wrong one now. Here's my card — have your engineer email me.",
        coachEn:
          "This is the most important phrase at any technical booth: 'I don't want to give you a wrong number — let me confirm with our engineer.' Honesty converts engineers.",
        coachCn:
          "这是技术展位上最重要的一句话：'I don't want to give you a wrong number — let me confirm with our engineer.'诚实最能赢得工程师的信任。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 5,
      didWell: [
        { en: 'Gave precise numbers with sources — tested vs theoretical distinction handled well.', cn: '给出了有来源的精确数字——很好地区分了实测值和理论值。' },
        { en: "Said 'let me confirm with our engineer' instead of guessing — that won the buyer's trust.", cn: "说'let me confirm with our engineer'而不是猜测——这赢得了买家的信任。" },
      ],
      tryNext: [
        { en: 'Name certifications individually (CE, UL, RoHS) — never just say "it\'s certified."', cn: "逐一说出认证名称（CE、UL、RoHS）——不要只说'it's certified'。" },
        { en: 'Keep one comparison number ready: "X percent better than the previous generation."', cn: "随时准备一个对比数字：'X percent better than the previous generation'。" },
      ],
      savedPhrases: [
        { en: "I don't want to give you a wrong number — let me confirm with our engineer.", cn: '我不想给您错误数据——让我和工程师确认一下。', tag: 'On-Site' },
        { en: 'It\'s fully certified — CE, UL and RoHS documentation is available.', cn: '产品已完全认证——CE、UL和RoHS文件齐全。', tag: 'Production' },
      ],
    },
  },

  'customs-freight-crisis': {
    opening:
      "I've got bad news on your shipment. Two of your crates are held at customs — they're flagging the wooden packaging certificate and one invoice discrepancy. Doors open in 48 hours.",
    turns: [
      {
        aiText:
          "The ISPM-15 stamp wasn't visible on crate three, and the invoice value doesn't match the carnet declaration. Can you get corrected documents?",
        coachEn:
          "Right question first: 'What paperwork is missing exactly?' — always get the specific blocker before promising anything.",
        coachCn:
          "先问对问题：'What paperwork is missing exactly?'——在承诺任何事情之前，先弄清楚具体卡在哪里。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "If I have those within the hour I can refile tonight. Best case, crates clear tomorrow noon. That's cutting it close for your build.",
        coachEn:
          "'I can have the commercial invoice and ATA carnet re-sent within the hour' — committing to a specific time makes the broker prioritise you.",
        coachCn:
          "'I can have the commercial invoice and ATA carnet re-sent within the hour'——承诺具体时间能让报关行优先处理你的件。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "If they miss noon, your realistic options are renting AV and furniture on-site and printing graphics locally. Costs roughly triple, but you'd open on time.",
        coachEn:
          "Smart — asking 'what are our rental options on-site?' BEFORE you need them is professional crisis planning. Never wait for the worst case to start planning for it.",
        coachCn:
          "聪明——在需要之前就问'what are our rental options on-site?'是专业的危机预案。永远不要等到最坏情况发生才开始计划。",
        coachType: 'positive',
      },
      {
        aiText:
          "Understood. I'll push the broker for an express review and update you every two hours. Keep your phone on.",
        coachEn:
          "'I need a status update every two hours until the crates clear' — setting an update cadence keeps the vendor accountable without you chasing them.",
        coachCn:
          "'I need a status update every two hours until the crates clear'——设定汇报频率能让供应商保持负责，而你不用不停追问。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Got the specific blocker (ISPM-15, invoice mismatch) before promising fixes.', cn: '在承诺解决方案之前，先弄清了具体问题（ISPM-15标志、发票不符）。' },
        { en: 'Asked for on-site rental options before the worst case hit — real contingency thinking.', cn: '在最坏情况发生前就询问了现场租赁方案——真正的应急思维。' },
      ],
      tryNext: [
        { en: "Offer to cover the express fee early — 'I'll cover the express fee' unblocks vendors fast.", cn: "尽早提出承担加急费——'I'll cover the express fee'能快速推动供应商。" },
        { en: 'Set an update cadence (every two hours) instead of repeatedly asking for news.', cn: '设定汇报频率（每两小时一次），而不是反复追问进展。' },
      ],
      savedPhrases: [
        { en: 'I can have the commercial invoice and ATA carnet re-sent within the hour.', cn: '我可以在一小时内重新发送商业发票和ATA单证册。', tag: 'Production' },
        { en: 'I need a status update every two hours until the crates clear.', cn: '在货物清关之前，我需要每两小时一次的进度更新。', tag: 'Crisis' },
      ],
    },
  },

  'services-desk': {
    opening:
      "Next! Hi, what can I do for you — power, internet, labour, or rigging? Give me your booth number first.",
    turns: [
      {
        aiText:
          "Booth 2214, got it. A 20-amp circuit and hardwired internet. The circuit's fine, but hardwired internet at show-site rate is 40 percent over advance rate. Still want it?",
        coachEn:
          "Perfect order phrasing: booth number first, then specific spec ('20-amp circuit', 'hardwired line'). Services desks process specifics fast and vague requests slowly.",
        coachCn:
          "完美的下单表达：先报展位号，再说具体规格（'20-amp circuit'、'hardwired line'）。服务台处理具体需求很快，处理模糊需求很慢。",
        coachType: 'positive',
      },
      {
        aiText:
          "Smart to ask. Yes — order it now and I'll apply the mid-tier rate since the show hasn't opened. Anything else?",
        coachEn:
          "'What's the rate difference between advance order and show-site order?' — always ask. Show-site rates are typically 30–50% higher, and desks often have discretion.",
        coachCn:
          "'What's the rate difference between advance order and show-site order?'——一定要问。现场价通常高30–50%，而且服务台通常有一定的优惠权限。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Two labourers, one hour, tomorrow 8 AM for a hang sign — booked. They'll meet you at the booth. You'll need your rigging approval form.",
        coachEn:
          "Good specific labour order. 'Two labourers for one hour tomorrow morning' is instantly bookable — 'some help sometime tomorrow' is not.",
        coachCn:
          "很好的具体用工订单。'Two labourers for one hour tomorrow morning'能立即预订——'明天找人帮忙'则不能。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "All on the master account, confirmed. Here's your order summary — service hotline is on the bottom if anything goes down during show hours.",
        coachEn:
          "'Who do I call if the internet goes down during show hours?' — asking for the escalation path BEFORE a failure is what separates veterans from first-timers.",
        coachCn:
          "'Who do I call if the internet goes down during show hours?'——在故障发生之前就问好上报路径，这是老手和新手的区别。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 5,
      didWell: [
        { en: 'Led with booth number and exact specs — the desk processed everything in one pass.', cn: '先报展位号和准确规格——服务台一次就处理完了所有需求。' },
        { en: 'Asked about advance vs show-site rates and saved money.', cn: '询问了提前价和现场价的差异，省了钱。' },
      ],
      tryNext: [
        { en: 'Always get the emergency hotline before leaving the desk.', cn: '离开服务台前一定要拿到紧急联系电话。' },
        { en: 'Confirm the power drop location against your booth plan — mislocated drops cost hours.', cn: '对照展位图确认电源接入点位置——位置错误会浪费好几个小时。' },
      ],
      savedPhrases: [
        { en: 'I need a 20-amp circuit and a hardwired internet line for booth 2214.', cn: '2214展位需要一条20安培电路和一条有线网络。', tag: 'Production' },
        { en: "What's the rate difference between advance order and show-site order?", cn: '提前预订和现场订购的价格差多少？', tag: 'Business' },
      ],
    },
  },

  'networking-reception': {
    opening:
      "Mind if I stand here? The bar queue is impossible. I don't think we've met — I'm with a lighting manufacturer out of Eindhoven. First time at this show?",
    turns: [
      {
        aiText:
          "Hall four — oh, the big LED wall? That's yours? Nice work. We're in hall two, much more modest. How's traffic been for you?",
        coachEn:
          "Great answer. Giving a visual landmark ('the LED wall you can't miss') makes you memorable and easy to find — much better than just a booth number.",
        coachCn:
          "回答得好。给出视觉地标（'the LED wall you can't miss'）让人容易记住你、找到你——比只说展位号好得多。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Busy for us too, though quality over quantity this year. Did you catch the keynote this morning? The sustainability targets they announced will hit our whole category.",
        coachEn:
          "Perfect small-talk move: answer briefly, then return a question. Conversation is tennis — always hit the ball back.",
        coachCn:
          "完美的寒暄技巧：简短回答，然后回抛一个问题。对话就像打网球——始终要把球打回去。",
        coachType: 'positive',
      },
      {
        aiText:
          "Agreed, it changes our roadmap too. Look, we occasionally source display components — what's your lead time looking like these days?",
        coachEn:
          "Notice how business entered naturally after two rounds of small talk. Never pitch first at a reception — relationship, then relevance, then business.",
        coachCn:
          "注意商务话题是如何在两轮寒暄后自然出现的。在招待会上永远不要先推销——先建立关系，再谈相关性，最后谈生意。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Let's do that. Here — my card, and I'll find you on LinkedIn. Swing by hall two tomorrow if you get a minute. Enjoy the evening.",
        coachEn:
          "'We should stay in touch — are you on LinkedIn?' is the universal professional close. Low pressure, always accepted, and it converts a chat into a contact.",
        coachCn:
          "'We should stay in touch — are you on LinkedIn?'是通用的职业收尾。没有压力，总是被接受，还能把闲聊变成人脉。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 3,
      didWell: [
        { en: 'Used a visual landmark to describe your booth — instantly memorable.', cn: '用视觉地标描述展位——让人立刻记住。' },
        { en: 'Let business surface naturally after small talk instead of pitching first.', cn: '让商务话题在寒暄后自然出现，而不是一上来就推销。' },
      ],
      tryNext: [
        { en: 'Keep one keynote or industry-news comment ready — it\'s the universal reception topic.', cn: '随时准备一条关于主题演讲或行业新闻的评论——这是招待会上的万能话题。' },
        { en: "Close every conversation with a concrete next step: LinkedIn, a booth visit, or a call.", cn: '每段对话都以具体的下一步收尾：LinkedIn、参观展位或电话。' },
      ],
      savedPhrases: [
        { en: "We should stay in touch — are you on LinkedIn?", cn: '我们应该保持联系——您用LinkedIn吗？', tag: 'Business' },
        { en: "We're on the exhibitor side — hall four, the LED wall you can't miss.", cn: '我们是参展商——四号馆，那面很显眼的LED墙就是我们。', tag: 'Business' },
      ],
    },
  },

  // ── Batch 3: high-frequency freeze moments ──────────────────────────────

  'self-introduction': {
    opening:
      "Hi — I don't think we've met. Quite a booth you've got here. So, who are you and what do you do?",
    turns: [
      {
        aiText:
          "A Shanghai agency, nice. There are a lot of production companies here though — what makes yours different?",
        coachEn:
          "Strong, clean open. Lead with name + role + company in one breath: 'I'm Wei, I run event production for a Shanghai agency.' Never trail off into a long backstory.",
        coachCn:
          "开场干净有力。一口气说出名字+职位+公司：'I'm Wei, I run event production for a Shanghai agency.'不要拖入冗长的背景故事。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Large-format for tech and auto — okay, that's a real specialism. How much do you actually do in a year?",
        coachEn:
          "'We specialise in large-format exhibitions' is exactly right. One sharp specialism beats a list of ten services — people remember the specialist.",
        coachCn:
          "'We specialise in large-format exhibitions'非常准确。一个鲜明的专长胜过罗列十项服务——人们记得住专家。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Forty international shows is serious volume. I run marketing for a German auto-parts brand, actually.",
        coachEn:
          "Perfect — a concrete number ('40 international shows across Europe and the Gulf') builds instant credibility. And you turned it back with a question. Textbook.",
        coachCn:
          "完美——一个具体数字（'40 international shows across Europe and the Gulf'）立即建立可信度。而且你用问题把话题抛了回去。教科书级别。",
        coachType: 'positive',
      },
      {
        aiText:
          "Auto-parts, European shows — we might actually have something to talk about. Do you have a card?",
        coachEn:
          "Great close. 'Here's my card — I'd love to find a reason to work together' is warm and low-pressure. Always end a self-intro with a next step, not just a smile.",
        coachCn:
          "收尾很好。'Here's my card — I'd love to find a reason to work together'既热情又没有压力。自我介绍永远要以下一步收尾，而不只是微笑。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: "Name + role + company in one clean line — no rambling.", cn: '名字+职位+公司一句话说清——不啰嗦。' },
        { en: "Backed the pitch with a real number (40 shows) — credibility, not adjectives.", cn: '用真实数字（40场展会）支撑陈述——靠可信度而非形容词。' },
      ],
      tryNext: [
        { en: "Lead with one sharp specialism, never a list of services.", cn: '以一个鲜明的专长开场，绝不罗列服务清单。' },
        { en: "Always end with a next step: a card, a call, or a booth visit.", cn: '永远以下一步收尾：名片、电话或参观展位。' },
      ],
      savedPhrases: [
        { en: 'We specialise in large-format exhibitions for tech and auto brands.', cn: '我们专注于为科技和汽车品牌打造大型展览。', tag: 'Business' },
        { en: "Here's my card — I'd love to find a reason to work together.", cn: '这是我的名片，我很希望能找到合作的机会。', tag: 'Business' },
      ],
    },
  },

  'lead-follow-up': {
    opening:
      "Hello? ... Sorry, who is this? I get a lot of calls after a show, so you'll have to remind me.",
    turns: [
      {
        aiText:
          "Automechanika, booth 2214 — right, the lead-time question. Yes, I remember now. What's up?",
        coachEn:
          "Perfect recall opener. Anchoring with 'we met at booth 2214, you asked about lead times' instantly rebuilds context — never assume they remember you.",
        coachCn:
          "完美的唤起记忆开场。用'we met at booth 2214, you asked about lead times'锚定，能立即重建语境——永远不要假设对方记得你。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "The samples, yes. To be honest I've been swamped since I got back. Remind me what you were sending?",
        coachEn:
          "Good. 'I'm following up on the samples you were interested in' is a clean reason for the call. A follow-up always needs a specific hook, not 'just checking in'.",
        coachCn:
          "很好。'I'm following up on the samples you were interested in'是打电话的明确理由。跟进电话永远需要具体的切入点，而不是'just checking in'。",
        coachType: 'positive',
      },
      {
        aiText:
          "A call next week could work. Send me the pricing first so I have something to look at. Thursday, maybe?",
        coachEn:
          "'Would a short call next week work to walk through pricing?' — proposing a small, specific next step is far more effective than 'let me know if you're interested'.",
        coachCn:
          "'Would a short call next week work to walk through pricing?'——提出一个具体的小步骤，远比'let me know if you're interested'有效。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Thursday at ten, then. Send the catalogue over and I'll take a look before we speak. Talk then.",
        coachEn:
          "Nicely closed with a concrete slot. 'What would you need from us to move this forward?' is a great question to keep in your pocket — it surfaces the real blocker.",
        coachCn:
          "用具体时间点漂亮收尾。'What would you need from us to move this forward?'是一个值得随时备用的好问题——它能揭示真正的障碍。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        { en: "Rebuilt context immediately — booth number and the exact question.", cn: '立即重建语境——报出展位号和当时的具体问题。' },
        { en: "Proposed a specific next step (a call + pricing) instead of a vague 'keep in touch'.", cn: "提出具体的下一步（电话+报价），而不是含糊的'保持联系'。" },
      ],
      tryNext: [
        { en: "Every follow-up needs a concrete hook — a sample, a spec, a promise you made.", cn: '每次跟进都需要一个具体切入点——样品、规格或你许下的承诺。' },
        { en: "Ask 'what would you need to move this forward?' to find the real blocker.", cn: "问'what would you need to move this forward?'来找出真正的障碍。" },
      ],
      savedPhrases: [
        { en: 'Would a short call next week work to walk through pricing?', cn: '下周方便安排一个简短电话，过一下报价吗？', tag: 'Business' },
        { en: 'What would you need from us to move this forward?', cn: '您需要我们提供什么才能推进这件事？', tag: 'Business' },
      ],
    },
  },

  'media-interview': {
    opening:
      "Hi, I'm with Exhibition World — got a minute? I'm doing a piece on new booth tech at the show. What are you launching this year?",
    turns: [
      {
        aiText:
          "A modular system — okay. Everyone says 'modular' though. What's actually new about yours?",
        coachEn:
          "Good, controlled open. 'Happy to give you two minutes' sets a boundary and signals you're media-trained. Always frame the time up front with press.",
        coachCn:
          "开场从容、有分寸。'Happy to give you two minutes'设定了边界，也表明你受过媒体训练。面对媒体永远先框定时间。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "50% faster build time — now that's a number I can use. Can you say that on the record?",
        coachEn:
          "Excellent. 'What makes it newsworthy is the 50% faster build time' hands the journalist their headline. Give reporters one quotable number and they'll use it.",
        coachCn:
          "非常好。'What makes it newsworthy is the 50% faster build time'直接把标题递给了记者。给记者一个可引用的数字，他们就会用它。",
        coachType: 'positive',
      },
      {
        aiText:
          "And what does a system like this cost? Our readers always want a ballpark.",
        coachEn:
          "'I'd rather not comment on pricing, but I can talk about the technology' — a clean, friendly deflection. Redirecting beats a flat 'no comment', which sounds defensive.",
        coachCn:
          "'I'd rather not comment on pricing, but I can talk about the technology'——干净又友好的回避。转移话题胜过生硬的'no comment'，后者听起来很防备。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Fair enough. This is great material — I'll probably run it in next month's issue.",
        coachEn:
          "Smart to close with 'can I confirm how you'll attribute this quote?' Controlling attribution protects you and your brand — professionals always confirm before the reporter walks.",
        coachCn:
          "用'can I confirm how you'll attribute this quote?'收尾很聪明。掌控署名方式能保护你和品牌——专业人士总是在记者离开前确认。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: "Handed the reporter a quotable number ('50% faster build time').", cn: "递给记者一个可引用的数字（'50% faster build time'）。" },
        { en: "Deflected pricing gracefully by redirecting to the technology.", cn: '通过转向技术话题优雅地回避了价格问题。' },
      ],
      tryNext: [
        { en: "Frame the time up front ('happy to give you two minutes') to stay in control.", cn: "先框定时间（'happy to give you two minutes'）以掌控局面。" },
        { en: "Always confirm attribution before the interview ends.", cn: '采访结束前一定要确认引用署名方式。' },
      ],
      savedPhrases: [
        { en: "I'd rather not comment on pricing, but I can talk about the technology.", cn: '价格我不便评论，但我可以谈谈技术。', tag: 'On-Site' },
        { en: 'What makes it newsworthy is the 50% faster build time.', cn: '它的新闻价值在于搭建时间缩短了50%。', tag: 'Business' },
      ],
    },
  },

  'show-teardown': {
    opening:
      "Right, doors just closed. My crew's ready but the hall's chaos. What's the plan — where do you want us to start?",
    turns: [
      {
        aiText:
          "Four hours, clear by midnight — tight but doable. What comes down first?",
        coachEn:
          "Good command opener. 'We have a four-hour strike window' uses the exact trade term — 'strike' is the industry word for teardown. Crews trust people who speak their language.",
        coachCn:
          "很好的指挥式开场。'We have a four-hour strike window'用了准确的行业术语——'strike'是拆撤的行话。团队信任说他们语言的人。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Rented AV first, got it — the penalties on late returns are brutal. I'll put two people on that now.",
        coachEn:
          "Smart prioritisation. 'The rented AV goes back first to avoid penalties' ties the task to a reason. Crews move faster when they understand the 'why', not just the 'what'.",
        coachCn:
          "明智的优先排序。'The rented AV goes back first to avoid penalties'把任务和原因绑在一起。团队理解了'为什么'而不只是'做什么'时，动作会更快。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "Label against the manifest — good, that's how stuff doesn't get lost. Forklift's coming through, by the way.",
        coachEn:
          "'Wrap and label every crate against the return manifest' is precisely right. 'Manifest' and 'crate' are the correct freight terms — vague instructions cause lost gear.",
        coachCn:
          "'Wrap and label every crate against the return manifest'完全正确。'Manifest'和'crate'是准确的货运术语——含糊的指令会导致设备丢失。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "Crate count matches, everything's loaded. Where do you want the sign-off?",
        coachEn:
          "Excellent discipline. 'Don't let anyone leave until the crate count matches' and asking for 'a signed handover' close the loop. Teardown chaos is where gear vanishes — you controlled it.",
        coachCn:
          "纪律性极强。'Don't let anyone leave until the crate count matches'和要求'signed handover'形成了闭环。拆撤混乱正是设备消失的时候——你把它控制住了。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 5,
      didWell: [
        { en: "Used the real trade terms — 'strike window', 'manifest', 'crate count'.", cn: "使用了真正的行业术语——'strike window'、'manifest'、'crate count'。" },
        { en: "Tied each task to a reason (penalties, lost gear) so the crew moved fast.", cn: '把每项任务和原因（罚款、设备丢失）绑定，让团队快速行动。' },
      ],
      tryNext: [
        { en: "Always demand a signed handover — teardown is when gear disappears.", cn: '永远要求签字交接——拆撤时正是设备消失之时。' },
        { en: "State the hard deadline first ('clear by midnight') to set the pace.", cn: "先说出硬性截止时间（'clear by midnight'）来定节奏。" },
      ],
      savedPhrases: [
        { en: 'We have a four-hour strike window — the hall must be clear by midnight.', cn: '我们有四小时的拆撤时间窗口，午夜前必须清场。', tag: 'Production' },
        { en: 'Wrap and label every crate against the return manifest.', cn: '对照回运清单，包装并标记每个箱子。', tag: 'Production' },
      ],
    },
  },

  'speaker-handling': {
    opening:
      "I don't know about this. There are eight hundred people out there and my slides felt off in rehearsal. Maybe we should cut the opening story?",
    turns: [
      {
        aiText:
          "Fifteen minutes... okay. You're sure everything's ready back here? I hate technical surprises.",
        coachEn:
          "Exactly the right tone. 'Everything backstage is under control' is what a nervous speaker needs first — calm authority, before any detail. Reassure, then inform.",
        coachCn:
          "语气完全正确。'Everything backstage is under control'是紧张的演讲者最先需要听到的——先给出沉稳的掌控感，再谈细节。先安抚，再告知。",
        coachType: 'phrasing',
      },
      {
        aiText:
          "The slides are tested? On the confidence monitor too? Okay. That's one less thing.",
        coachEn:
          "Perfect specifics. 'Your slides are loaded and tested on the confidence monitor' removes the exact fear they named. Address the specific worry, not a general 'don't worry'.",
        coachCn:
          "具体到位。'Your slides are loaded and tested on the confidence monitor'消除了他们明确说出的恐惧。针对具体担忧回应，而不是泛泛地说'别担心'。",
        coachType: 'positive',
      },
      {
        aiText:
          "Cues from the wings — good. As long as I can see you, I won't lose track of time. Keep the story, then?",
        coachEn:
          "'I'll give you a five-minute and a one-minute cue from the wings' — concrete support they can picture. 'The wings' is correct stage language and it signals you know the room.",
        coachCn:
          "'I'll give you a five-minute and a one-minute cue from the wings'——具体、可想象的支持。'The wings'（侧台）是正确的舞台用语，也表明你熟悉现场。",
        coachType: 'vocabulary',
      },
      {
        aiText:
          "You know what — keep the story. I've got this. Thanks for staying calm with me. Let's do it.",
        coachEn:
          "Beautiful close. 'Take a moment — I'll hold the intro until you're ready' hands them control, which is exactly what a nervous speaker needs. You turned panic into confidence.",
        coachCn:
          "漂亮的收尾。'Take a moment — I'll hold the intro until you're ready'把控制权交给了他们，这正是紧张的演讲者所需要的。你把慌乱转化成了自信。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 4,
      didWell: [
        { en: "Reassured first ('under control'), then gave detail — the right order.", cn: "先安抚（'under control'），再给细节——顺序正确。" },
        { en: "Answered the exact fear (slides) instead of a generic 'don't worry'.", cn: "针对具体恐惧（幻灯片）回应，而不是泛泛地说'别担心'。" },
      ],
      tryNext: [
        { en: "Use precise stage terms ('confidence monitor', 'the wings') to signal you know the room.", cn: "使用精准的舞台术语（'confidence monitor'、'the wings'）表明你熟悉现场。" },
        { en: "Give control back to the speaker: 'I'll hold the intro until you're ready.'", cn: "把控制权交还给演讲者：'I'll hold the intro until you're ready.'。" },
      ],
      savedPhrases: [
        { en: 'Your slides are loaded and tested on the confidence monitor.', cn: '您的幻灯片已加载，并在提词屏上测试过了。', tag: 'On-Site' },
        { en: "If you'd like, take a moment — I'll hold the intro until you're ready.", cn: '如果您需要，可以稍作调整——我会等您准备好再开场。', tag: 'On-Site' },
      ],
    },
  },

  // ── Travel & Survival pack ───────────────────────────────────────────────

  'airport-immigration': {
    opening:
      'Next, please. Passport. Thank you. What is the purpose of your visit to Germany?',
    turns: [
      {
        aiText: 'A trade show. Which one, and where are you exhibiting?',
        coachEn: "Clear and calm. 'I'm here for a trade show — I'm exhibiting at Messe Frankfurt' answers the real question in one line. State the purpose plainly; officers want brevity.",
        coachCn: "清晰镇定。'I'm here for a trade show — I'm exhibiting at Messe Frankfurt'一句话回答了核心问题。目的说清楚就好，官员要的是简短。",
        coachType: 'phrasing',
      },
      {
        aiText: 'And how long will you be staying in the country?',
        coachEn: "Good. Give the duration and your exit plan together: 'eight days, then flying back to Shanghai.' Showing you intend to leave is exactly what they check.",
        coachCn: "很好。把停留时间和离境计划一起说：'eight days, then flying back to Shanghai.'表明你会离境，正是他们要确认的。",
        coachType: 'phrasing',
      },
      {
        aiText: 'Do you have documents — an invitation, a hotel booking?',
        coachEn: "Perfect to have them ready. 'Here's my invitation letter and hotel booking' — offering documents before being asked twice speeds everything up.",
        coachCn: "提前备好很好。'Here's my invitation letter and hotel booking'——不等对方追问就主动出示，能加快通关。",
        coachType: 'positive',
      },
      {
        aiText: 'Alright. Enjoy the show. Welcome to Germany.',
        coachEn: "Nicely handled. If you ever miss a question, 'could you repeat that a little more slowly?' is polite and completely normal — never guess at immigration.",
        coachCn: "处理得好。如果没听清，'could you repeat that a little more slowly?'既礼貌又很正常——入境时千万不要猜。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Stated purpose and duration plainly — brevity is what officers want.', cn: '目的和停留时间说得干脆——官员就想要简短。' },
        { en: 'Had documents ready before being asked twice.', cn: '在被追问前就备好了文件。' },
      ],
      tryNext: [
        { en: "Always pair duration with your exit plan ('then flying back').", cn: "停留时间永远配上离境计划（'then flying back'）。" },
        { en: "If unsure, ask 'could you repeat that slowly?' — never guess.", cn: "没听清就说'could you repeat that slowly?'——绝不要猜。" },
      ],
      savedPhrases: [
        { en: "I'm here for a trade show — I'm exhibiting at Messe Frankfurt.", cn: '我来参加展会——我在法兰克福展览中心参展。', tag: 'Travel' },
        { en: 'Sorry, could you repeat that a little more slowly?', cn: '抱歉，您能稍微慢一点再说一遍吗？', tag: 'Travel' },
      ],
    },
  },

  'hotel-checkin': {
    opening:
      'Good evening, welcome. Checking in? Could I have your name and passport, please?',
    turns: [
      {
        aiText: 'Chen, three nights — yes, I have you. A quiet room on a high floor, is that alright?',
        coachEn: "Great check-in line. 'I have a reservation under Chen — three nights, checking out Friday' gives the name, length and exit in one go. Efficient and clear.",
        coachCn: "很好的入住表达。'I have a reservation under Chen — three nights, checking out Friday'一次说清姓名、天数和退房日。高效清晰。",
        coachType: 'phrasing',
      },
      {
        aiText: 'Breakfast is included, served from 6:30 to 10. Anything else you need to know?',
        coachEn: "Good to confirm breakfast timing — it's the most-asked question and worth locking in. Well done.",
        coachCn: "确认早餐时间很好——这是最常问的问题，值得先确定。做得好。",
        coachType: 'positive',
      },
      {
        aiText: "There's a shuttle to the Messe at 8 and 8:30. Shall I note you for the morning one?",
        coachEn: "'Is there a shuttle to the exhibition centre?' is the single most useful hotel question on a work trip. Always ask it at check-in.",
        coachCn: "'Is there a shuttle to the exhibition centre?'是出差时酒店最有用的一个问题。入住时一定要问。",
        coachType: 'vocabulary',
      },
      {
        aiText: "You're all set — room 512, breakfast on the ground floor. Enjoy your stay.",
        coachEn: "Smart to ask for a company receipt now: 'a receipt made out to my company.' Sorting the invoice at check-in saves a scramble at checkout.",
        coachCn: "现在就要公司发票很聪明：'a receipt made out to my company.'入住时处理好发票，退房时就不慌乱。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Name, nights and checkout in one line — an efficient check-in.', cn: '姓名、天数、退房一句话说完——高效入住。' },
        { en: 'Asked about the Messe shuttle — the key work-trip question.', cn: '问了展馆班车——出差的关键问题。' },
      ],
      tryNext: [
        { en: 'Request the company invoice at check-in, not checkout.', cn: '入住时就要公司发票，别等退房。' },
        { en: "Confirm breakfast and Wi-Fi upfront so nothing surprises you.", cn: '提前确认早餐和Wi-Fi，避免意外。' },
      ],
      savedPhrases: [
        { en: 'I have a reservation under Chen — three nights, checking out Friday.', cn: '我有一个用Chen预订的房间——三晚，周五退房。', tag: 'Travel' },
        { en: 'Is there a shuttle to the exhibition centre?', cn: '有到展览中心的班车吗？', tag: 'Travel' },
      ],
    },
  },

  'restaurant-dinner': {
    opening:
      'Good evening. A table for how many? Do you have a reservation with us tonight?',
    turns: [
      {
        aiText: 'Two — of course, right this way. Here are your menus. Can I get you drinks to start?',
        coachEn: "Clean opener. 'A table for two, please — do we need a reservation?' is polite and gets you seated fast. Good travel default.",
        coachCn: "开场干净。'A table for two, please — do we need a reservation?'礼貌且能快速入座。出行好用的表达。",
        coachType: 'phrasing',
      },
      {
        aiText: 'For the region, the pork knuckle is very popular — but we have other options too.',
        coachEn: "'What would you recommend that's typical of the region?' is the perfect travel question — it gets you local food and starts a friendly exchange.",
        coachCn: "'What would you recommend that's typical of the region?'是绝佳的旅行提问——既能吃到本地菜，又能开启友好交流。",
        coachType: 'vocabulary',
      },
      {
        aiText: 'No pork — no problem at all. The roast chicken is excellent. Shall I bring that?',
        coachEn: "Handled a dietary need smoothly: 'the same, but no pork — is that possible?' Polite, clear, and easy for the server to solve.",
        coachCn: "顺畅处理了饮食需求：'the same, but no pork — is that possible?'礼貌清晰，服务员也好安排。",
        coachType: 'positive',
      },
      {
        aiText: 'Of course, card is fine. I\'ll bring the bill right over. Thank you!',
        coachEn: "'Could we have the bill, please? Can I pay by card?' — asking both together is efficient. And 'keep the change' is a warm, natural close.",
        coachCn: "'Could we have the bill, please? Can I pay by card?'——两件事一起问很高效。'keep the change'则是温暖自然的收尾。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 3,
      didWell: [
        { en: 'Asked for a local recommendation — food and rapport at once.', cn: '请对方推荐本地菜——既点了菜又拉近关系。' },
        { en: 'Stated a dietary need clearly and politely.', cn: '清楚礼貌地说明了饮食需求。' },
      ],
      tryNext: [
        { en: "Ask for the bill and payment method together to save time.", cn: '账单和支付方式一起问，省时间。' },
        { en: "'Still water' vs 'sparkling' — Europe asks; know the words.", cn: "欧洲会问'still'（无气）还是'sparkling'（有气）水——记住这两个词。" },
      ],
      savedPhrases: [
        { en: "What would you recommend that's typical of the region?", cn: '有什么本地特色菜您推荐吗？', tag: 'Travel' },
        { en: 'Could we have the bill, please? Can I pay by card?', cn: '请结账好吗？可以刷卡吗？', tag: 'Travel' },
      ],
    },
  },

  'taxi-directions': {
    opening:
      'Hello! Where can I take you today?',
    turns: [
      {
        aiText: 'The Messe, east entrance — sure. Hop in. Bit of traffic today, but we\'ll manage.',
        coachEn: "Perfectly clear. 'Could you take me to the Messe, entrance east, please?' — naming the specific entrance saves a long walk at a huge venue.",
        coachCn: "非常清楚。'Could you take me to the Messe, entrance east, please?'——说清具体入口，能在大型场馆省下一段长路。",
        coachType: 'phrasing',
      },
      {
        aiText: "This time of day? About twenty-five minutes, maybe thirty with the roadworks.",
        coachEn: "Good to ask the time: 'roughly how long will it take at this time of day?' It helps you plan and shows you're paying attention to the meter.",
        coachCn: "问时间很好：'roughly how long will it take at this time of day?'方便安排，也表明你在留意计价。",
        coachType: 'vocabulary',
      },
      {
        aiText: 'Card is fine, no problem. You want a receipt for the company?',
        coachEn: "'Do you take card, or should I pay cash?' — asking before you arrive avoids an awkward scramble at the kerb. Smart traveller habit.",
        coachCn: "'Do you take card, or should I pay cash?'——到站前先问，避免路边手忙脚乱。聪明的旅行习惯。",
        coachType: 'phrasing',
      },
      {
        aiText: "Here you are — Hall 4, east side. Here's your receipt. Have a good show!",
        coachEn: "Nice — you got the receipt for expenses and even know how to ask directions ('which way is the nearest S-Bahn station?') for the trip back.",
        coachCn: "很好——你拿到了报销发票，还会问路（'which way is the nearest S-Bahn station?'）方便返程。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Named the specific entrance — saved a long walk.', cn: '说清具体入口——省了一段长路。' },
        { en: 'Sorted payment method before arriving.', cn: '到站前就确认了支付方式。' },
      ],
      tryNext: [
        { en: "Always ask for a receipt ('a receipt for the fare') for expenses.", cn: "记得要发票（'a receipt for the fare'）用于报销。" },
        { en: "Learn one directions phrase: 'which way is the nearest ... ?'", cn: "记一句问路：'which way is the nearest ... ?'。" },
      ],
      savedPhrases: [
        { en: 'Could you take me to the Messe, entrance east, please?', cn: '请载我到展览中心东入口好吗？', tag: 'Travel' },
        { en: 'Could I get a receipt for the fare, please?', cn: '请给我开张车费发票好吗？', tag: 'Travel' },
      ],
    },
  },

  'small-talk-host': {
    opening:
      "We've got twenty minutes before the next meeting. So — is this your first time in Frankfurt?",
    turns: [
      {
        aiText: 'It is a nice city, yes. Not too big. Have you had a chance to see much of it?',
        coachEn: "Warm and easy. 'This is my first time in Frankfurt — the city is beautiful' is the perfect small-talk opener: honest, positive, and it invites more.",
        coachCn: "温暖轻松。'This is my first time in Frankfurt — the city is beautiful'是绝佳的寒暄开场：真诚、积极，还能引出更多话题。",
        coachType: 'phrasing',
      },
      {
        aiText: "Ha, the weather takes some getting used to. I've been here twelve years now.",
        coachEn: "Nice move returning a question: 'how long have you been with the company?' Small talk is a two-way rally — keep passing it back.",
        coachCn: "回抛问题很好：'how long have you been with the company?'寒暄是双向对打——不断把话题抛回去。",
        coachType: 'positive',
      },
      {
        aiText: 'For dinner? There\'s a lovely place near the river — I can book it for you.',
        coachEn: "'Do you have any recommendations for dinner nearby?' turns small talk into something useful and lets your host feel helpful. Great instinct.",
        coachCn: "'Do you have any recommendations for dinner nearby?'把寒暄变得实用，也让东道主有帮上忙的感觉。很好的直觉。",
        coachType: 'vocabulary',
      },
      {
        aiText: "My pleasure. Shall we head in? They're probably ready for us.",
        coachEn: "Lovely close: 'thank you for making me feel so welcome.' A little warmth like that is remembered long after the meeting.",
        coachCn: "收尾很暖：'thank you for making me feel so welcome.'这样的一点温暖，会员在会后被长久记住。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 3,
      didWell: [
        { en: 'Kept the small-talk rally going by returning questions.', cn: '通过回抛问题让寒暄持续下去。' },
        { en: 'Turned chit-chat into a useful dinner tip.', cn: '把闲聊变成了实用的晚餐建议。' },
      ],
      tryNext: [
        { en: "Keep two safe topics ready: the city and the weather.", cn: '备好两个安全话题：城市和天气。' },
        { en: "Close with warmth — 'thank you for the welcome' is remembered.", cn: "用温暖收尾——'thank you for the welcome'会被记住。" },
      ],
      savedPhrases: [
        { en: 'How long have you been with the company?', cn: '您在公司工作多久了？', tag: 'Travel' },
        { en: 'Thank you for making me feel so welcome.', cn: '谢谢您让我感到如此受欢迎。', tag: 'Travel' },
      ],
    },
  },

  'lost-shipment': {
    opening:
      "Baggage services, hello. I understand a bag didn't arrive? Let's see what we can find.",
    turns: [
      {
        aiText: "Do you have your baggage tag — the little sticker from check-in?",
        coachEn: "Calm and factual. 'My checked bag didn't arrive — here's my baggage tag' gives them exactly what they need to start tracing. No drama, just the tag.",
        coachCn: "冷静、就事论事。'My checked bag didn't arrive — here's my baggage tag'给出了追踪所需的信息。不慌乱，出示行李条即可。",
        coachType: 'phrasing',
      },
      {
        aiText: "Found it — still in Munich. It'll come on the evening flight. Where should we send it?",
        coachEn: "Good to raise the urgency: 'it contains materials I need for a show tomorrow morning.' Naming the deadline makes them prioritise delivery.",
        coachCn: "点明紧迫性很好：'it contains materials I need for a show tomorrow morning.'说明截止时间能让他们优先处理。",
        coachType: 'phrasing',
      },
      {
        aiText: 'We can courier it to your hotel by tonight. Let me take the address.',
        coachEn: "'Please deliver it to this hotel address as soon as it lands' — clear, specific instruction. Always give the delivery address, don't wait to be asked.",
        coachCn: "'Please deliver it to this hotel address as soon as it lands'——清晰具体的指示。主动给出送达地址，别等对方问。",
        coachType: 'vocabulary',
      },
      {
        aiText: "You're all set. Here's your reference number — keep it for any follow-up.",
        coachEn: "Essential close: 'what's your reference number so I can follow up?' A tracking reference turns a worry into something you can actively chase.",
        coachCn: "关键收尾：'what's your reference number so I can follow up?'一个查询编号，能把焦虑变成可主动跟进的事。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'B+',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Stayed calm and led with the baggage tag — the key to tracing.', cn: '保持冷静，先出示行李条——追踪的关键。' },
        { en: 'Named the deadline so they prioritised delivery.', cn: '点明截止时间，让他们优先送达。' },
      ],
      tryNext: [
        { en: "Always get a reference number for anything lost.", cn: '任何丢失都要拿到查询编号。' },
        { en: "Give the delivery address unprompted — don't wait.", cn: '主动给出送达地址——别等对方问。' },
      ],
      savedPhrases: [
        { en: "My checked bag didn't arrive — here's my baggage tag.", cn: '我托运的行李没到——这是我的行李条。', tag: 'Travel' },
        { en: "What's your reference number so I can follow up?", cn: '您的查询编号是多少，方便我后续跟进？', tag: 'Travel' },
      ],
    },
  },

  // ── Business lifecycle ────────────────────────────────────────────────────

  'client-kickoff': {
    opening:
      "Thanks for coming in. We're planning a launch event in Q3 and, honestly, we're not sure where to start. That's where you come in.",
    turns: [
      {
        aiText: 'Success? I suppose... a room full of the right people, and press that actually shows up.',
        coachEn: "Excellent first question. 'What does success look like for this event?' makes the client define the goal — everything else follows from their answer.",
        coachCn: "极好的第一个问题。'What does success look like for this event?'让客户先定义目标——之后一切都由此展开。",
        coachType: 'phrasing',
      },
      {
        aiText: "Around 300 guests — senior buyers, mostly. Trade press too, if we can pull them.",
        coachEn: "Good — 'who is the audience, and how many?' nails the two numbers that shape every decision. Get these early, always.",
        coachCn: "很好——'who is the audience, and how many?'确定了决定一切的两个数字。永远尽早问到这些。",
        coachType: 'vocabulary',
      },
      {
        aiText: "Budget... let's say mid-six-figures, but I'll need to justify every part of it.",
        coachEn: "Asking the budget range directly is professional, not rude. 'What's the budget range we're working within?' saves everyone from designing the wrong event.",
        coachCn: "直接问预算区间是专业，不是冒失。'What's the budget range we're working within?'能避免大家设计出错的方案。",
        coachType: 'phrasing',
      },
      {
        aiText: "That all sounds right. When can I see something on paper?",
        coachEn: "Perfect close: 'let me repeat that back' then 'I'll send a written summary tomorrow.' Confirming the brief in writing prevents costly misunderstandings.",
        coachCn: "完美收尾：先'let me repeat that back'再'I'll send a written summary tomorrow.'书面确认需求，能避免昂贵的误解。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 4,
      didWell: [
        { en: "Opened with 'what does success look like?' — let the client define the goal.", cn: "以'what does success look like?'开场——让客户定义目标。" },
        { en: 'Pinned audience, numbers and budget early.', cn: '尽早锁定了受众、人数和预算。' },
      ],
      tryNext: [
        { en: "Always play the brief back before you leave the room.", cn: '离场前一定复述一遍需求。' },
        { en: "Promise a written summary with a date — it builds trust.", cn: '承诺带日期的书面总结——能建立信任。' },
      ],
      savedPhrases: [
        { en: "Let's start with your goal — what does success look like for this event?", cn: '我们先从目标开始——这场活动怎样才算成功？', tag: 'Business' },
        { en: "I'll send a written summary by tomorrow for you to confirm.", cn: '我明天会发一份书面总结给您确认。', tag: 'Business' },
      ],
    },
  },

  'contract-review': {
    opening:
      "I've read the draft. Mostly fine, but a few clauses need discussion before I can sign. Shall we go through them?",
    turns: [
      {
        aiText: 'Payment — you want 50% on signing. That\'s steep for us. Can we do 30%?',
        coachEn: "Good structure — take it clause by clause. 'Let's go through the payment terms first' keeps a tense conversation orderly and calm.",
        coachCn: "结构清晰——逐条来。'Let's go through the payment terms first'能让紧张的对话有序、冷静地进行。",
        coachType: 'phrasing',
      },
      {
        aiText: "On liability — clause 7 is open-ended. My legal team won't accept unlimited exposure.",
        coachEn: "'Clause 7 on liability needs a cap — can we agree a limit?' Using 'a cap' and 'a limit' shows you understand contracts, which earns respect fast.",
        coachCn: "'Clause 7 on liability needs a cap — can we agree a limit?'用'a cap'和'a limit'表明你懂合同，能迅速赢得尊重。",
        coachType: 'vocabulary',
      },
      {
        aiText: 'Reasonable. And if our date moves — what happens to the deposit?',
        coachEn: "Good to surface cancellation now. 'What's the cancellation policy if the date changes?' Dates move constantly in events — settle this before signing.",
        coachCn: "现在就提取消条款很好。'What's the cancellation policy if the date changes?'活动日期常变——签约前定好。",
        coachType: 'phrasing',
      },
      {
        aiText: "Good. Get me the liability cap in writing and I think we're close.",
        coachEn: "Smart not to over-commit: 'let me flag this with my team and revert by Friday.' Never agree to legal terms on the spot — buy time gracefully.",
        coachCn: "不当场过度承诺很聪明：'let me flag this with my team and revert by Friday.'法律条款绝不当场答应——优雅地争取时间。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Took the contract clause by clause — calm and orderly.', cn: '逐条审阅合同——冷静有序。' },
        { en: "Used 'a cap' / 'a limit' correctly — signalled contract fluency.", cn: "正确使用'a cap'/'a limit'——展现了合同熟练度。" },
      ],
      tryNext: [
        { en: "Settle cancellation terms before signing — dates always move.", cn: '签约前定好取消条款——日期总会变。' },
        { en: "Never agree to legal terms on the spot; 'revert by Friday'.", cn: "法律条款别当场答应；说'revert by Friday'。" },
      ],
      savedPhrases: [
        { en: 'Clause 7 on liability needs a cap — can we agree a limit?', cn: '第七条责任条款需要设上限——我们能约定一个限额吗？', tag: 'Business' },
        { en: 'Let me flag this with my team and revert by Friday.', cn: '我先跟团队反映，周五前给您回复。', tag: 'Business' },
      ],
    },
  },

  'booth-builder': {
    opening:
      "Morning. My crew's here and the materials arrived. Give me the plan — what's the priority and what's your deadline?",
    turns: [
      {
        aiText: "We can start on the floor now. Realistically the shell is up by two, carpet after.",
        coachEn: "Good command opener. 'Let's confirm the build schedule — when do you start on the floor?' anchors the whole day around concrete times.",
        coachCn: "很好的指挥式开场。'Let's confirm the build schedule — when do you start on the floor?'用具体时间点锚定一整天。",
        coachType: 'phrasing',
      },
      {
        aiText: "Carpet and lighting before the walkthrough — noted. What time's the client coming?",
        coachEn: "Tying work to a deadline the crew cares about: 'must be done before the client walkthrough.' Deadlines with a reason move faster.",
        coachCn: "把工作绑到团队在意的截止点：'must be done before the client walkthrough.'有原因的截止时间推进更快。",
        coachType: 'phrasing',
      },
      {
        aiText: "The Pantone match — send me the code and I'll get the panel reprinted if it's off.",
        coachEn: "'Can you match this exact Pantone for the back wall?' Naming Pantone shows you speak production — vague 'make it the right colour' invites mistakes.",
        coachCn: "'Can you match this exact Pantone for the back wall?'说出Pantone表明你懂制作——含糊的'颜色对一点'会招致错误。",
        coachType: 'vocabulary',
      },
      {
        aiText: 'Understood. I\'ll flag any slip early. Snag list at end of day — sounds good.',
        coachEn: "Two strong habits: 'tell me two hours ahead, not after' and 'a snag list walk-through at the end of the day.' 'Snag list' is exactly the right build term.",
        coachCn: "两个好习惯：'tell me two hours ahead, not after'和'a snag list walk-through at the end of the day.''Snag list'（问题清单）正是搭建行话。",
        coachType: 'positive',
      },
    ],
    result: {
      grade: 'A',
      proPhrasesCount: 5,
      didWell: [
        { en: "Anchored the day around concrete build times.", cn: '用具体搭建时间锚定了一整天。' },
        { en: "Used 'Pantone' and 'snag list' — real production language.", cn: "使用了'Pantone'和'snag list'——真正的制作行话。" },
      ],
      tryNext: [
        { en: "Ask for problems two hours ahead, not after they happen.", cn: '要求提前两小时告知问题，而非事后。' },
        { en: "Insist on a signed-off inspection for power and rigging.", cn: '坚持电力和吊装通过验收签字。' },
      ],
      savedPhrases: [
        { en: 'Can you match this exact Pantone for the back wall?', cn: '背景墙能做到这个准确的潘通色号吗？', tag: 'Production' },
        { en: "Let's do a snag list walk-through at the end of the day.", cn: '我们今天结束时做一次问题清单巡查。', tag: 'Production' },
      ],
    },
  },

  'business-dinner': {
    opening:
      "Thank you for the invitation. This is a lovely restaurant — I don't get out to places like this often.",
    turns: [
      {
        aiText: "It's my pleasure. So — should we talk shop, or save it for later?",
        coachEn: "Warm host opener. 'Thank you for joining me — I hope you like the place' sets a relaxed tone. Hosting well starts with making the guest comfortable.",
        coachCn: "温暖的主人开场。'Thank you for joining me — I hope you like the place'定下轻松基调。做好东道主，先让客人自在。",
        coachType: 'phrasing',
      },
      {
        aiText: 'Later works. Let\'s enjoy the food first. What\'s good here — any recommendations?',
        coachEn: "Perfect read of the room: 'shall we save the business talk for after we've eaten?' At a relationship dinner, the deal comes second to the rapport.",
        coachCn: "对场合把握得好：'shall we save the business talk for after we've eaten?'关系型晚宴上，交情先于生意。",
        coachType: 'positive',
      },
      {
        aiText: 'Twenty years in events, believe it or not. Started as a stagehand. And you?',
        coachEn: "'How did you first get into the events industry?' is a gift of a question — people love telling their story, and it builds real connection.",
        coachCn: "'How did you first get into the events industry?'是绝佳的问题——人们喜欢讲自己的故事，也能建立真正的连接。",
        coachType: 'vocabulary',
      },
      {
        aiText: "That's very kind. To a great partnership, then. And thank you — this was lovely.",
        coachEn: "Gracious close: a toast, then 'let me take care of the bill.' As host you quietly handle the bill — never make it a discussion.",
        coachCn: "得体的收尾：先敬酒，再'let me take care of the bill.'作为主人，安静地把账结了——绝不让它成为话题。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 3,
      didWell: [
        { en: 'Put rapport before the deal at a relationship dinner.', cn: '关系型晚宴上把交情放在生意之前。' },
        { en: "Asked the guest's story — built a real connection.", cn: '询问客人的经历——建立了真正的连接。' },
      ],
      tryNext: [
        { en: "As host, handle the bill quietly — never debate it.", cn: '作为主人安静结账——绝不争论。' },
        { en: "Keep one warm toast ready: 'to a great partnership.'", cn: "备好一句暖心祝酒：'to a great partnership.'。" },
      ],
      savedPhrases: [
        { en: "Shall we save the business talk for after we've eaten?", cn: '我们要不要吃完饭再谈正事？', tag: 'Business' },
        { en: "Let me take care of the bill — it's been a real pleasure.", cn: '账单我来结——今晚非常愉快。', tag: 'Business' },
      ],
    },
  },

  'stage-presentation': {
    opening:
      "You're on in two minutes. The room's about eighty people. I'll introduce you, then it's all yours. Ready?",
    turns: [
      {
        aiText: '[You step up to the mic. The room quiets and turns to you.]',
        coachEn: "Strong open. 'Good afternoon, everyone — thank you for being here' plus a warm pause settles both you and the room. Never rush the first line.",
        coachCn: "开场有力。'Good afternoon, everyone — thank you for being here'加一个温暖的停顿，能让你和全场都安定下来。第一句永远别赶。",
        coachType: 'phrasing',
      },
      {
        aiText: '[A few nods. People put their phones down and look up.]',
        coachEn: "Great signposting: 'in the next five minutes I'll show you three things.' Telling the audience the shape of your talk keeps them with you.",
        coachCn: "很好的路标：'in the next five minutes I'll show you three things.'先告诉观众演讲的结构，能让他们跟得上。",
        coachType: 'vocabulary',
      },
      {
        aiText: '[Someone at the front starts taking notes.]',
        coachEn: "'The headline is simple: we cut build time in half.' One sharp, memorable claim beats five vague benefits. Give them the line they'll repeat.",
        coachCn: "'The headline is simple: we cut build time in half.'一个鲜明好记的主张，胜过五个模糊的好处。给他们会复述的那句话。",
        coachType: 'positive',
      },
      {
        aiText: '[Light applause. The moderator steps back up to open questions.]',
        coachEn: "Clean landing: 'to sum up: faster, cleaner, more sustainable' then 'come find us at booth 2214.' Always end with a summary and a next step.",
        coachCn: "干净落地：'to sum up: faster, cleaner, more sustainable'再'come find us at booth 2214.'永远以总结加下一步收尾。",
        coachType: 'phrasing',
      },
    ],
    result: {
      grade: 'A-',
      proPhrasesCount: 4,
      didWell: [
        { en: 'Signposted the talk — "three things in five minutes."', cn: '给演讲设了路标——"五分钟三件事"。' },
        { en: 'Delivered one sharp, repeatable headline.', cn: '给出了一个鲜明、可复述的核心信息。' },
      ],
      tryNext: [
        { en: "Don't rush the first line — a warm pause settles the room.", cn: '别赶第一句——温暖的停顿能安定全场。' },
        { en: "End every talk with a summary + a next step (booth number).", cn: '每次演讲都以总结+下一步（展位号）收尾。' },
      ],
      savedPhrases: [
        { en: "In the next five minutes I'll show you three things.", cn: '接下来五分钟，我会向大家展示三件事。', tag: 'Business' },
        { en: 'Happy to take questions — come find us at booth 2214.', cn: '欢迎提问——也欢迎到2214展位找我们。', tag: 'Business' },
      ],
    },
  },
};

export function getMockOpening(scenarioId: string): string {
  return mockScenarios[scenarioId]?.opening ?? "Let's begin the scenario.";
}

export function getMockTurn(scenarioId: string, turnIndex: number): MockTurn | null {
  const scenario = mockScenarios[scenarioId];
  if (!scenario) return null;
  return scenario.turns[turnIndex] ?? null;
}

export function getMockResult(scenarioId: string) {
  return mockScenarios[scenarioId]?.result ?? null;
}

export function getMockTurnCount(scenarioId: string): number {
  return mockScenarios[scenarioId]?.turns.length ?? 0;
}
