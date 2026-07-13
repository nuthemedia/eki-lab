import type { IChingText } from "./types";

export type EnglishHexagramEntry = {
  name: string;
  chineseName: string;
  pinyin: string;
  keywords: string[];
  essence: string;
  trigramSymbolism: string;
  classical: string;
  modern: string;
  guidance: { work: string; relationships: string; decision: string };
  judgment: IChingText;
  lines: IChingText[];
};

/**
 * Modern English editorial translations for the coin reading.
 * Official English hexagram names follow the Unicode Yijing Hexagram names.
 * The translations are original wording checked against the Zhouyi source text and
 * the public-domain James Legge translation; they are not copied from Wilhelm–Baynes.
 */
export const HEXAGRAM_ENGLISH: Record<number, EnglishHexagramEntry> = {
  "1": {
    "name": "The Creative Heaven",
    "chineseName": "乾",
    "pinyin": "Qián",
    "keywords": [
      "creation",
      "beginning",
      "strength",
      "initiative"
    ],
    "essence": "The creative power of Heaven. The way opens through sustained movement.",
    "trigramSymbolism": "Heaven above Heaven: pure yang energy revolving without rest.",
    "classical": "All six lines are yang, expressing power and creation. The judgment, “great success through what is right,” shows that power bears fruit only when guided by integrity. The lines portray stages of power, from the hidden Dragon to the Dragon at its height.",
    "modern": "Energy and initiative are abundant. Yet having power is not the same as using it all at once; success depends on recognizing each stage. When ambition rises too far, power that cannot withdraw may turn into regret.",
    "guidance": {
      "work": "You have strong momentum. Pace it by stages: remain in preparation when needed, then act decisively when conditions are ready.",
      "relationships": "Taking the lead can help, but check that you are not simply forcing your way through. Strength builds trust when guided by integrity.",
      "decision": "You have the power to move forward. First decide whether this is a time to remain hidden or to rise and act, so your energy does not go to waste."
    },
    "judgment": {
      "original": "乾：元亨。利貞。",
      "modern": "Great success. It is beneficial to remain true and upright."
    },
    "lines": [
      {
        "original": "初九：潛龍勿用。",
        "modern": "A hidden Dragon. Do not use its power yet."
      },
      {
        "original": "九二：見龍在田，利見大人。",
        "modern": "The Dragon appears in the field. It is beneficial to meet a great person."
      },
      {
        "original": "九三：君子終日乾乾，夕惕若；厲，无咎。",
        "modern": "The exemplary person works diligently all day and remains watchful in the evening. There is danger, but no blame."
      },
      {
        "original": "九四：或躍在淵，无咎。",
        "modern": "The Dragon may leap from the deep, or remain there. Either course brings no blame."
      },
      {
        "original": "九五：飛龍在天，利見大人。",
        "modern": "The Dragon flies in Heaven. It is beneficial to meet a great person."
      },
      {
        "original": "上九：亢龍，有悔。",
        "modern": "The Dragon has risen too high. Regret follows; know when to stop."
      }
    ]
  },
  "2": {
    "name": "The Receptive Earth",
    "chineseName": "坤",
    "pinyin": "Kūn",
    "keywords": [
      "receptivity",
      "support",
      "yielding strength",
      "earth"
    ],
    "essence": "The Earth’s capacity to receive, support, and nurture. What follows and sustains can bear lasting fruit.",
    "trigramSymbolism": "Earth doubled: a receptive power that carries everything and helps everything grow.",
    "classical": "All six lines are yielding, expressing receptivity and nurture. The judgment favors the steadfastness of a mare: taking the lead may bring confusion, while following a true guide brings direction. Earth receives creative force and gives it form and life.",
    "modern": "This is a time when supporting, receiving, and developing may achieve more than taking center stage. A second-in-command or behind-the-scenes role is not passive; it helps bring things to completion. Forcing control may lead you away from the path.",
    "guidance": {
      "work": "Supportive leadership is effective now. Careful work that receives ideas and turns them into practical form can earn quiet recognition.",
      "relationships": "Listening and making room for others can strengthen the relationship. Flexibility is not defeat; it can express generosity and breadth.",
      "decision": "Rather than forcing an initiative, observe the situation and respond to how others and events unfold. This is more likely to produce a sound outcome."
    },
    "judgment": {
      "original": "坤：元亨。利牝馬之貞。君子有攸往，先迷後得主。利西南得朋，東北喪朋。安貞，吉。",
      "modern": "The Receptive Earth: great success. Steadfastness like that of a mare is beneficial. If the exemplary person goes first, they lose the way; by following, they find a true guide. In the southwest, they gain companions; in the northeast, they lose companions. Quietly maintaining what is right brings good fortune."
    },
    "lines": [
      {
        "original": "初六：履霜，堅冰至。",
        "modern": "When frost is underfoot, hard ice will soon arrive. Small signs can precede major change."
      },
      {
        "original": "六二：直方大，不習无不利。",
        "modern": "Straight, square, and expansive: without special practice, nothing is unfavorable."
      },
      {
        "original": "六三：含章，可貞。或從王事，无成有終。",
        "modern": "Keep your inner excellence concealed and remain steadfast. If serving the ruler, claim no personal achievement but bring the work to completion."
      },
      {
        "original": "六四：括囊，无咎无譽。",
        "modern": "Keep the mouth of the bag tied. There is no blame, but neither is there praise."
      },
      {
        "original": "六五：黃裳，元吉。",
        "modern": "A yellow lower garment: modest virtue kept inward. Great good fortune."
      },
      {
        "original": "上六：龍戰于野，其血玄黃。",
        "modern": "Dragons fight in the wilderness, and their blood is dark and yellow. When yielding forces reach an extreme, they struggle with creative force."
      }
    ]
  },
  "3": {
    "name": "Difficulty at the Beginning",
    "chineseName": "屯",
    "pinyin": "Zhūn",
    "keywords": [
      "birth pains",
      "confusion at the beginning",
      "support",
      "emergence"
    ],
    "essence": "The difficulty of a sprout breaking through the earth: do not hurry; find support.",
    "trigramSymbolism": "Thunder moves beneath water-bearing clouds: an image of a storm and the struggle of new life breaking through the ground.",
    "classical": "Zhun means fullness and difficulty. It portrays the original confusion as Heaven and Earth come together and life begins. The judgment says that the situation can ultimately open and prosper, but advises against advancing alone. Establish capable supporters instead.",
    "modern": "A new undertaking may be too early to take clear shape. This confusion is part of beginning, not necessarily failure. Avoid carrying everything alone; finding reliable help is often the way forward.",
    "guidance": {
      "work": "Expect delays during a launch or early-stage project. Strengthen the foundations and secure dependable collaborators before expanding.",
      "relationships": "Early awkwardness is natural. Rather than forcing closeness, allow trust to take root over time.",
      "decision": "This is not a time for a major push. Start small, build support, and then consider the next step."
    },
    "judgment": {
      "original": "屯：元亨，利貞。勿用有攸往，利建侯。",
      "modern": "Great progress is possible, but remain steadfast. Do not press ahead; establish capable supporters."
    },
    "lines": [
      {
        "original": "初九：磐桓，利居貞，利建侯。",
        "modern": "Hesitation and delay. It is beneficial to stay where you are, remain steadfast, and establish capable supporters."
      },
      {
        "original": "六二：屯如邅如，乘馬班如，匪寇婚媾，女子貞不字，十年乃字。",
        "modern": "Progress is difficult, and the horses circle without advancing. What comes is not an enemy but a marriage proposal. The woman preserves her integrity; only after ten years does she marry."
      },
      {
        "original": "六三：即鹿无虞，惟入于林中，君子幾不如舍，往吝。",
        "modern": "Chasing a deer without a guide leads only into the forest. A wise person recognizes the moment to stop; pressing on brings frustration."
      },
      {
        "original": "六四：乘馬班如，求婚媾，往，吉无不利。",
        "modern": "The horses hesitate, but seeking the marriage alliance and going forward brings good fortune and no disadvantage."
      },
      {
        "original": "九五：屯其膏；小貞吉，大貞凶。",
        "modern": "Your benefits have not yet reached others. Correct matters on a small scale and it is favorable; attempting a sweeping correction brings trouble."
      },
      {
        "original": "上六：乘馬班如，泣血漣如。",
        "modern": "The horses remain unable to advance, and blood-like tears flow. This is difficulty at its extreme."
      }
    ]
  },
  "4": {
    "name": "Youthful Folly",
    "chineseName": "蒙",
    "pinyin": "Méng",
    "keywords": [
      "inexperience",
      "learning",
      "guidance",
      "awakening"
    ],
    "essence": "Like mist at the foot of a mountain, inexperience obscures the way. A willingness to learn gradually clears it.",
    "trigramSymbolism": "Water rises beneath the mountain: a spring hidden in mist, symbolizing young potential that has not yet taken shape.",
    "classical": "蒙 means being covered or kept in the dark: the hexagram concerns both immaturity and education. Its judgment says that the inexperienced should seek instruction rather than wait to be pursued, and that repeating the same question carelessly makes further answers inappropriate. Truthful discipline is beneficial.",
    "modern": "Lacking experience can limit your view, but it is not a disgrace. It marks room to grow. Asking sincerely and accepting instruction can steadily clear the uncertainty.",
    "guidance": {
      "work": "Ask about what you do not understand early. Pretending to know usually creates a longer detour.",
      "relationships": "If you are guiding someone, allow them to seek your help rather than forcing lessons on them.",
      "decision": "If you lack the necessary information, learn first and consult someone knowledgeable. Deciding afterward is not too late."
    },
    "judgment": {
      "original": "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。",
      "modern": "In guiding the inexperienced, progress is possible. The inexperienced should seek instruction rather than wait for it to be offered. A first sincere inquiry deserves an answer; repeating the same question carelessly is disrespectful, so no further answer is given. Hold to what is right."
    },
    "lines": [
      {
        "original": "初六：發蒙，利用刑人，用說桎梏，以往吝。",
        "modern": "Open the mind to learning by first establishing clear discipline. Removing restraints while leaving someone entirely to their own devices leads to difficulty."
      },
      {
        "original": "九二：包蒙吉，納婦吉，子克家。",
        "modern": "Welcoming and supporting the inexperienced brings good fortune. Bringing a wife into the household also brings good fortune; the son becomes capable of managing the family."
      },
      {
        "original": "六三：勿用取女，見金夫，不有躬，无攸利。",
        "modern": "Do not marry this woman: captivated by a wealthy man, she loses her self-respect. Nothing beneficial comes of it."
      },
      {
        "original": "六四：困蒙，吝。",
        "modern": "Inexperience that remains isolated becomes troubled and constrained. This leads nowhere."
      },
      {
        "original": "六五：童蒙，吉。",
        "modern": "The openness of a child who accepts instruction brings good fortune."
      },
      {
        "original": "上九：擊蒙，不利為寇，利禦寇。",
        "modern": "Confront ignorance, not to cause harm, but to prevent harm."
      }
    ]
  },
  "5": {
    "name": "Waiting",
    "chineseName": "需",
    "pinyin": "Xū",
    "keywords": [
      "waiting",
      "timing",
      "preparation",
      "composure"
    ],
    "essence": "Wait for the rain. Do not rush; sustain yourself and let the right time arrive.",
    "trigramSymbolism": "Water or clouds rise toward the sky, suggesting a calm wait for rain that will eventually fall.",
    "classical": "Waiting means both waiting and nourishing oneself. With trust and sincerity, the way opens broadly. Right conduct brings good fortune, and one can eventually cross great waters. The lines trace increasingly dangerous forms of waiting, from the outskirts to mud and a cave.",
    "modern": "You want to act, but the conditions are not ready. Waiting is not idleness; it is time to prepare, recover, and build strength. A composed pause is often faster in the end than rushing into danger.",
    "guidance": {
      "work": "When a project stalls, improve the quality of your preparation rather than forcing it forward. The best prepared person can move first when the time comes.",
      "relationships": "Do not press someone for an immediate reply or change. People need time to reach their own readiness.",
      "decision": "If you do not need to decide now, choosing to wait is itself a sound decision. Keep preparing while you wait."
    },
    "judgment": {
      "original": "需：有孚，光亨。貞吉，利涉大川。",
      "modern": "Waiting: with trust and sincerity, the way opens widely. Right conduct brings good fortune. It is favorable to cross great waters."
    },
    "lines": [
      {
        "original": "初九：需于郊，利用恆，无咎。",
        "modern": "Waiting in the outskirts. Maintaining steady composure brings no blame."
      },
      {
        "original": "九二：需于沙，小有言，終吉。",
        "modern": "Waiting on sand. There may be some criticism, but the outcome is good."
      },
      {
        "original": "九三：需于泥，致寇至。",
        "modern": "Waiting in mud. You bring trouble upon yourself."
      },
      {
        "original": "六四：需于血，出自穴。",
        "modern": "Waiting amid bloodshed. Though wounded, you can emerge from the cave."
      },
      {
        "original": "九五：需于酒食，貞吉。",
        "modern": "Waiting amid food and drink. Right conduct brings good fortune."
      },
      {
        "original": "上六：入于穴，有不速之客三人來，敬之終吉。",
        "modern": "You enter a cave, and three uninvited guests arrive. Receive them with respect; the outcome will be good."
      }
    ]
  },
  "6": {
    "name": "Conflict",
    "chineseName": "訟",
    "pinyin": "Sòng",
    "keywords": [
      "conflict",
      "opposition",
      "claim",
      "knowing when to withdraw"
    ],
    "essence": "This is the hexagram of conflict. Do not pursue a dispute to the bitter end; stop while a workable middle ground remains.",
    "trigramSymbolism": "Heaven rises while water flows downward: two forces moving apart, an image of tension arising from divergent directions.",
    "classical": "Conflict means contending or bringing a claim. The Judgment says that stopping midway is favorable, while carrying the dispute through to its end brings harm. It is beneficial to consult a wise and impartial person, but not to undertake a dangerous crossing.",
    "modern": "A clash of positions may be difficult to avoid. The real question is not how to prove yourself completely right, but when to stop. Even a legal or personal victory can leave lasting resentment and costs.",
    "guidance": {
      "work": "Bring in a neutral mediator early. The more you pursue total victory, the harder resolution becomes.",
      "relationships": "Look for a workable settlement rather than forcing your position through. If you want the relationship to continue, do not make winning the goal.",
      "decision": "Weigh carefully what the dispute may gain and what it may cost. Withdrawing or making peace can also be a form of strength."
    },
    "judgment": {
      "original": "訟：有孚，窒，惕，中吉，終凶。利見大人，不利涉大川。",
      "modern": "Conflict: You may have a sincere case, but progress is blocked; remain alert. Stopping midway is favorable; pursuing it to the end brings harm. It is beneficial to consult a wise person, but not to cross a great river."
    },
    "lines": [
      {
        "original": "初六：不永所事，小有言，終吉。",
        "modern": "Do not prolong the matter. There may be some criticism, but the outcome is favorable."
      },
      {
        "original": "九二：不克訟，歸而逋，其邑人三百戶无眚。",
        "modern": "You cannot win the dispute. Withdraw and keep out of the way; if you retreat to your small community of three hundred households, no harm will come."
      },
      {
        "original": "六三：食舊德，貞厲，終吉。或從王事，无成。",
        "modern": "Live quietly from the virtue and resources already established. The position is precarious, but holding firmly to what is right brings a favorable outcome. If you serve the ruler, seek no personal achievement."
      },
      {
        "original": "九四：不克訟，復即命渝，安貞吉。",
        "modern": "You cannot win the dispute. Return to your proper calling, change your attitude, and remain peacefully firm; this is favorable."
      },
      {
        "original": "九五：訟，元吉。",
        "modern": "The dispute is judged fairly. Great good fortune."
      },
      {
        "original": "上九：或錫之鞶帶，終朝三褫之。",
        "modern": "Even if you win the dispute and receive an official sash, it may be taken away three times in a single day. Gains won through conflict do not last."
      }
    ]
  },
  "7": {
    "name": "The Army",
    "chineseName": "師",
    "pinyin": "Shī",
    "keywords": [
      "organization",
      "leadership",
      "discipline",
      "conflict"
    ],
    "essence": "Lead collective effort through integrity, clear authority, and discipline.",
    "trigramSymbolism": "Water is held beneath the earth: strength hidden among ordinary people and brought together in organized form.",
    "classical": "The Army concerns warfare and an organized force. Its judgment says that a campaign requires integrity and an experienced leader. Without discipline, strength turns into harm.",
    "modern": "A major challenge must be met collectively rather than alone. What matters is not force by itself, but a legitimate purpose, a clear chain of command, and reliable discipline. If the leader or purpose is unclear, do not move forward yet.",
    "guidance": {
      "work": "Set the structure and responsibilities first. A project with no clear leader is likely to fail before it begins.",
      "relationships": "If you are guiding a group, demonstrate fairness and follow the rules you expect others to follow.",
      "decision": "Confirm that the cause is sound and that you are prepared to lead before committing yourself."
    },
    "judgment": {
      "original": "師：貞丈人吉，无咎。",
      "modern": "In directing an army, integrity is required. With an experienced leader, there is good fortune and no blame."
    },
    "lines": [
      {
        "original": "初六：師出以律，否臧，凶。",
        "modern": "The army sets out under discipline. If discipline breaks down, there is misfortune."
      },
      {
        "original": "九二：在師中吉，无咎；王三錫命。",
        "modern": "In command of the army, one remains balanced and succeeds without blame. The ruler grants repeated honors and commands."
      },
      {
        "original": "六三：師或輿尸，凶。",
        "modern": "The army may return carrying the dead in its carts. Misfortune."
      },
      {
        "original": "六四：師左次，无咎。",
        "modern": "The army withdraws and makes camp. A timely retreat brings no blame."
      },
      {
        "original": "六五：田有禽，利執言，无咎。長子帥師，弟子輿尸，貞凶。",
        "modern": "Game is found in the fields; it is beneficial to seize it and report it, with no blame. Let the senior leader command the army. If an inexperienced person does so, the army will carry the dead; even with proper intentions, the result is disastrous."
      },
      {
        "original": "上六：大君有命，開國承家，小人勿用。",
        "modern": "When the campaign is over, the great ruler issues commands, establishes new states, and grants houses their succession. Do not employ petty or unworthy people."
      }
    ]
  },
  "8": {
    "name": "Holding Together",
    "chineseName": "比",
    "pinyin": "Bǐ",
    "keywords": [
      "Closeness",
      "Solidarity",
      "Unity",
      "Common purpose"
    ],
    "essence": "People gather through trust and mutual support, forming a dependable bond.",
    "trigramSymbolism": "Water moves across the earth, settling into every opening. It symbolizes people drawing close and joining together.",
    "classical": "Bi means drawing close and standing alongside others. The judgment stresses examining the matter carefully and remaining principled, steadfast, and enduring; then there is no fault. Those who are unsettled may come seeking connection, but one who joins too late may find the opportunity lost.",
    "modern": "People are gathering and solidarity is taking shape. If the group seems sound, joining without excessive hesitation is more fruitful than remaining an observer. If you become its center, the question is whether trust, rather than force, is what draws people to you.",
    "guidance": {
      "work": "Join a good team or constructive movement early. Standing outside and criticizing brings few of its benefits.",
      "relationships": "Before widening your circle, deepen trust with people who provide a sound and reliable center.",
      "decision": "Choose partners by asking whether they can be trusted over time. Bonds formed from excitement alone rarely last."
    },
    "judgment": {
      "original": "比：吉。原筮元永貞，无咎。不寧方來，後夫凶。",
      "modern": "Holding together brings good results. Examine the matter carefully and commit to what is principled, lasting, and sound; then there is no fault. Those who are uneasy may come seeking connection, but one who joins too late may meet with difficulty."
    },
    "lines": [
      {
        "original": "初六：有孚，比之，无咎。有孚盈缶，終來有它，吉。",
        "modern": "With sincere trust, draw close and there is no fault. When trust is as full as an unglazed jar, unexpected good may come in the end."
      },
      {
        "original": "六二：比之自內，貞吉。",
        "modern": "Draw close from within, naturally and sincerely. Staying principled brings good results."
      },
      {
        "original": "六三：比之匪人。",
        "modern": "You are drawing close to the wrong people."
      },
      {
        "original": "六四：外比之，貞吉。",
        "modern": "Draw close to those of strength and integrity outside your immediate circle. Staying principled brings good results."
      },
      {
        "original": "九五：顯比。王用三驅，失前禽，邑人不誡，吉。",
        "modern": "Open and impartial solidarity. The ruler hunts by driving game from three sides, leaving an avenue of escape; the people are not put on guard. Good results."
      },
      {
        "original": "上六：比之无首，凶。",
        "modern": "Drawing close without a true beginning or a proper leader is harmful. There is no sound direction to follow."
      }
    ]
  },
  "9": {
    "name": "Small Taming",
    "chineseName": "小畜",
    "pinyin": "Xiǎo Chù",
    "keywords": [
      "small reserves",
      "temporary restraint",
      "preparation",
      "fine adjustment"
    ],
    "essence": "Clouds gather, but rain has not yet fallen. Make small improvements and wait.",
    "trigramSymbolism": "Wind moves across the sky. Clouds hang thickly, yet no rain falls: progress is almost ready, but one final condition is missing.",
    "classical": "Small Taming means holding back and building up in modest ways. The judgment describes conditions that are nearly complete but fail to come together at the last point. Even great force may temporarily be restrained by a small, yielding influence.",
    "modern": "You want to move forward, but minor circumstances are holding things up. The obstacle is not large enough to justify forcing a breakthrough, which makes the delay frustrating. Focus on small adjustments and preparation.",
    "guidance": {
      "work": "Do not rush toward a major result. Improve details and build a solid foundation; this preparation will matter when progress begins.",
      "relationships": "Continue with gentle encouragement even when others do not respond as you wish. Pressing too hard may damage what you are trying to build.",
      "decision": "A major move may be premature. Complete practical small steps one by one and wait for conditions to mature."
    },
    "judgment": {
      "original": "小畜：亨。密雲不雨，自我西郊。",
      "modern": "Small Taming: Success. Dense clouds gather, but no rain falls, from our western outskirts."
    },
    "lines": [
      {
        "original": "初九：復自道，何其咎，吉。",
        "modern": "Nine at the beginning: Return to your proper path. What fault could there be? Good fortune."
      },
      {
        "original": "九二：牽復，吉。",
        "modern": "Nine in the second place: Return together, holding one another. Good fortune."
      },
      {
        "original": "九三：輿說輻，夫妻反目。",
        "modern": "Nine in the third place: The wheel spokes come loose, and the married couple turns against each other."
      },
      {
        "original": "六四：有孚，血去惕出，无咎。",
        "modern": "Six in the fourth place: With trust, injury fades and fear departs. No blame."
      },
      {
        "original": "九五：有孚攣如，富以其鄰。",
        "modern": "Nine in the fifth place: Trust binds people closely together. Prosper with your neighbors."
      },
      {
        "original": "上九：既雨既處，尚德載，婦貞厲，月幾望，君子征凶。",
        "modern": "Nine at the top: The rain has fallen and stopped. Virtue has become full and substantial. A woman may remain correct yet still face danger. The moon is nearly full. If a person of integrity advances now, there is misfortune."
      }
    ]
  },
  "10": {
    "name": "Treading",
    "chineseName": "履",
    "pinyin": "Lǚ",
    "keywords": [
      "ritual propriety",
      "caution",
      "a risky step",
      "proper conduct"
    ],
    "essence": "Walk behind the tiger with respect and care; danger can be crossed by observing limits and proper form.",
    "trigramSymbolism": "A lake below heaven: something yielding moves directly behind something powerful, symbolizing a dangerous distance that must be handled carefully.",
    "classical": "Treading means stepping forward and, by extension, observing proper conduct. The judgment says: “Treading on the tiger’s tail, it does not bite. Success.” Even close to danger, respectful restraint and proper procedure can prevent harm.",
    "modern": "This concerns dealing with a stronger person or difficult situation where your position is plainly weaker. Do not pretend the danger is absent or push in casually. Follow the proper steps, keep an appropriate distance, and proceed at a measured pace. Caution need not become paralysis.",
    "guidance": {
      "work": "With a superior or major client, give attention to protocol and process before pressing the substance. Proper preparation can open the way.",
      "relationships": "With a difficult person, the manner of approach matters greatly. Do not confuse familiarity with genuine closeness.",
      "decision": "A risky step may be possible if the way you take it is disciplined. The key question is not only whether to proceed, but how."
    },
    "judgment": {
      "original": "履虎尾，不咥人，亨。",
      "modern": "You tread on the tiger’s tail, yet it does not bite. Success comes through respectful caution."
    },
    "lines": [
      {
        "original": "初九：素履，往无咎。",
        "modern": "Simple, unadorned treading. Go forward without blame."
      },
      {
        "original": "九二：履道坦坦，幽人貞吉。",
        "modern": "The path is level and open. For one who keeps to integrity in quiet seclusion, good fortune."
      },
      {
        "original": "六三：眇能視，跛能履，履虎尾，咥人，凶。武人為于大君。",
        "modern": "With limited sight and impaired steps, you overestimate your ability. You tread on the tiger’s tail and are bitten: misfortune. This is the recklessness of a warrior trying to become the great ruler."
      },
      {
        "original": "九四：履虎尾，愬愬終吉。",
        "modern": "You tread on the tiger’s tail, but remain fearful and watchful. In the end, good fortune."
      },
      {
        "original": "九五：夬履，貞厲。",
        "modern": "Tread decisively, but even when acting correctly, remember the danger."
      },
      {
        "original": "上九：視履考祥，其旋元吉。",
        "modern": "Look back over how you have walked and examine what your actions produced. If the journey has been completed in a sound and proper way, great good fortune."
      }
    ]
  },
  "11": {
    "name": "Peace",
    "chineseName": "泰",
    "pinyin": "Tài",
    "keywords": [
      "peace",
      "exchange",
      "harmony",
      "stability"
    ],
    "essence": "Heaven and earth meet. Stability grows from open exchange.",
    "trigramSymbolism": "Earth is above and heaven below. Their energies rise and descend, meeting in the middle.",
    "classical": "Peace means ease and free movement. The Judgment says that what is lesser departs and what is greater arrives: communication flows and purposes align. Yet the lines warn that no level ground stays level forever; stability can turn into decline.",
    "modern": "This is a period when things move openly and naturally. Stability depends on continuing exchange, so it can quietly weaken if neglected. Use good conditions to prepare for change and maintain important relationships.",
    "guidance": {
      "work": "Advance pending matters while cooperation is strong, and strengthen links between teams. Preparation during good times pays off.",
      "relationships": "Keep talking, especially when a relationship seems secure. Stability is sustained by exchange; it is not automatic.",
      "decision": "Decisions may move easily with favorable conditions, but do not build plans on the assumption that things will remain unchanged."
    },
    "judgment": {
      "original": "泰：小往大來，吉亨。",
      "modern": "The lesser departs and the greater arrives. This is favorable and brings free progress."
    },
    "lines": [
      {
        "original": "初九：拔茅茹以其彙，征吉。",
        "modern": "Pulling up the grass brings its connected roots with it. Move forward with your companions; this is favorable."
      },
      {
        "original": "九二：包荒。用馮河，不遐遺；朋亡。得尚于中行。",
        "modern": "Be generous toward what is rough or neglected. Have the courage to cross the river, do not abandon those far away, and do not favor only your friends. Follow the balanced path."
      },
      {
        "original": "九三：无平不陂，无往不復，艱貞无咎。勿恤其孚，于食有福。",
        "modern": "Nothing level stays without a slope, and nothing that goes fails to return. Hold firmly to what is right through difficulty and there will be no blame. Do not doubt your sincerity; there will be blessing in your sustenance."
      },
      {
        "original": "六四：翩翩，不富以其鄰；不戒以孚。",
        "modern": "They descend lightly together. They do not boast of wealth but stay with their neighbors; without being urged, they are joined by trust."
      },
      {
        "original": "六五：帝乙歸妹，以祉，元吉。",
        "modern": "Lord Yi gives his younger sister in marriage. Her humility brings blessing: great good fortune."
      },
      {
        "original": "上六：城復于隍，勿用師，自邑告命，貞吝。",
        "modern": "The city wall collapses back into the moat. Do not use force. Issue commands only within your own city; even correct action will meet obstruction."
      }
    ]
  },
  "12": {
    "name": "Standstill",
    "chineseName": "否",
    "pinyin": "Pǐ",
    "keywords": [
      "standstill",
      "blocked communication",
      "distance",
      "withdrawal and preservation"
    ],
    "essence": "Heaven and earth move apart. Do not force a passage through what is closed.",
    "trigramSymbolism": "Heaven rises above while earth remains below. Their energies do not meet, creating an image of obstruction.",
    "classical": "Standstill means being blocked. Unlike Flowing Harmony, it describes a time when those above and below cannot communicate. Yet as the lines develop, the blockage begins to tilt and end.",
    "modern": "Nothing seems to get through, and efforts fail to align. Pushing harder only drains energy. During a blocked period, protect your values, work quietly on what you can, and wait for conditions to change. No blockage lasts forever.",
    "guidance": {
      "work": "Rather than forcing a proposal that will not pass, step back and preserve your energy. Conditions and leadership can change.",
      "relationships": "When communication is failing, do not rush to settle everything. Distance can protect a relationship without ending it.",
      "decision": "This is not a time for a large gamble. Withdrawal, delay, or reducing scope may be the most constructive choices."
    },
    "judgment": {
      "original": "否之匪人，不利君子貞，大往小來。",
      "modern": "Standstill: people are estranged from the human way. It does not benefit a principled person to persist. What is great departs; what is small arrives."
    },
    "lines": [
      {
        "original": "初六，拔茅茹以其彙，貞吉。亨。",
        "modern": "Pulling up the grass brings its connected roots with it: withdraw together with your companions. Steadfastness brings good fortune and progress."
      },
      {
        "original": "六二，包承，小人吉，大人否。亨。",
        "modern": "Accepting flattering submission may benefit a small-minded person; a great person remains apart from the obstruction. In this way, progress remains possible."
      },
      {
        "original": "六三，包羞。",
        "modern": "Shame is wrapped up and concealed."
      },
      {
        "original": "九四，有命，无咎，疇離祉。",
        "modern": "When the proper mandate arrives, act without blame. Your companions will share in the benefit."
      },
      {
        "original": "九五，休否，大人吉。其亡其亡，繫于苞桑。",
        "modern": "Standstill is coming to an end. Good fortune comes to a great person. Keep warning yourself, “It may be lost; it may be lost,” and secure your position as firmly as a tree rooted in a mulberry stump."
      },
      {
        "original": "上九，傾否，先否後喜。",
        "modern": "The standstill is overturned. At first there is blockage; later, joy."
      }
    ]
  },
  "13": {
    "name": "Fellowship",
    "chineseName": "同人",
    "pinyin": "Tóng Rén",
    "keywords": [
      "shared purpose",
      "openness",
      "cooperation",
      "public-minded alliance"
    ],
    "essence": "Cooperation works best when it is open, principled, and not confined to insiders.",
    "trigramSymbolism": "Fire burns beneath the sky, its light reaching outward in the same direction: people gathering around a shared purpose.",
    "classical": "Fellowship means joining with others. The judgment places this fellowship in the open country, suggesting that cooperation succeeds when it is public rather than confined to a private circle. Joining only with one's own clan is narrow and regrettable.",
    "modern": "Progress comes through working with others. But an alliance loses strength when it becomes an inner circle that protects its own. State the purpose openly and include people with different perspectives; then even a difficult undertaking can be carried through.",
    "guidance": {
      "work": "Define the goal and share it widely. Agreement formed in the open is more durable than a private arrangement.",
      "relationships": "Widen the circle beyond familiar allies. Comfort among similar people can also narrow what you see.",
      "decision": "Do not decide alone. Confirm the direction with people who share the purpose before taking on a larger challenge."
    },
    "judgment": {
      "original": "同人于野，亨。利涉大川，利君子貞。",
      "modern": "Fellowship in the open country brings success. It is favorable to cross a great river and favorable for a principled person to remain true."
    },
    "lines": [
      {
        "original": "初九：同人于門，无咎。",
        "modern": "At the gate, joining with others. No blame."
      },
      {
        "original": "六二：同人于宗，吝。",
        "modern": "Joining only with one's own clan. This is narrow and brings difficulty."
      },
      {
        "original": "九三：伏戎于莽，升其高陵，三歲不興。",
        "modern": "Hiding soldiers in the brush and climbing a high ridge to watch. For three years, no action can be taken."
      },
      {
        "original": "九四：乘其墉，弗克，攻吉。",
        "modern": "Climbing the city wall but not attacking. Ending the conflict brings good fortune."
      },
      {
        "original": "九五：同人，先號咷而後笑。大師克相遇。",
        "modern": "Fellowship: first cries of grief, then laughter. Only after a great army prevails can the allies meet."
      },
      {
        "original": "上九：同人于郊，无悔。",
        "modern": "Fellowship in the open outskirts. There may be no great achievement, but there is no regret."
      }
    ]
  },
  "14": {
    "name": "Great Possession",
    "chineseName": "大有",
    "pinyin": "Dà Yǒu",
    "keywords": [
      "great possession",
      "abundance",
      "fairness",
      "sharing"
    ],
    "essence": "Great Possession means holding a great deal and moving things forward. Abundance is sustained not by hoarding but by fair, responsive stewardship.",
    "trigramSymbolism": "Fire shines above heaven like the sun at midday, illuminating everything. Much is gathered, yet its light reaches the margins.",
    "classical": "Great Possession means possessing greatly. The judgment simply says, “Great success.” Traditionally, the yielding fifth place responds to the firm lines above and below it, suggesting that abundance is maintained through mutual responsiveness rather than exclusive control. The Image says that restraining evil and promoting good accords with the mandate of Heaven.",
    "modern": "Resources, connections, and achievements are accumulating. The key question is not only how to gain more, but how to handle what you have: distribute it fairly, avoid arrogance, and remember that visible prosperity brings visible responsibility.",
    "guidance": {
      "work": "When results are strong, make allocation and recognition transparent. Hoarding success weakens future cooperation.",
      "relationships": "Move from simply receiving to giving. Opening what you have can change the quality of a relationship.",
      "decision": "When you have plenty of room to act, confidence can become overconfidence. Check once that pride is not steering you."
    },
    "judgment": {
      "original": "大有：元亨。",
      "modern": "Great Possession: great success."
    },
    "lines": [
      {
        "original": "初九：无交害，匪咎，艱則无咎。",
        "modern": "Nine at the beginning: Do not yet become entangled in harmful dealings. This is not blameworthy, but only continued care in difficulty prevents fault."
      },
      {
        "original": "九二：大車以載，有攸往，无咎。",
        "modern": "Nine in the second place: A great wagon carries its load. There is somewhere to go; no blame."
      },
      {
        "original": "九三：公用亨于天子，小人弗克。",
        "modern": "Nine in the third place: A noble person presents an offering to the Son of Heaven. A petty person cannot do this."
      },
      {
        "original": "九四：匪其彭，无咎。",
        "modern": "Nine in the fourth place: Do not display your abundance too fully. No blame."
      },
      {
        "original": "六五：厥孚交如，威如；吉。",
        "modern": "Six in the fifth place: Trust is shared openly, and dignity naturally appears. Good fortune."
      },
      {
        "original": "上九：自天佑之，吉无不利。",
        "modern": "Nine at the top: Heaven supports this person. Good fortune, with nothing that fails to prosper."
      }
    ]
  },
  "15": {
    "name": "Modesty",
    "chineseName": "謙",
    "pinyin": "Qiān",
    "keywords": [
      "humility",
      "staying grounded",
      "continuity",
      "strength"
    ],
    "essence": "Modesty lets real ability endure and remain useful. It is not self-erasure, but the wise use of strength without display.",
    "trigramSymbolism": "A mountain rests beneath the earth: something high choosing to remain grounded. This represents strength held with humility.",
    "classical": "Among the sixty-four hexagrams, Modesty is traditionally regarded as the only one whose six lines contain no misfortune. Its judgment says that modesty succeeds and that a noble person brings things to completion. The tradition teaches that what is full is reduced, while what is modest is supported; humility bears fruit when maintained to the end.",
    "modern": "This is a time when lasting influence comes from not advertising your achievements or power. Modesty is not belittling yourself. It means sharing what you have when it is abundant and leveling what has become too elevated. Quiet reliability earns trust over time.",
    "guidance": {
      "work": "Do not overstate your achievements; let the work speak. Contributions that attract little attention are still noticed by those who matter.",
      "relationships": "Making room for someone else does not diminish you. The capacity to yield can quietly strengthen a relationship.",
      "decision": "If you are choosing between an ambitious option and a plain, steady one, the grounded path has the advantage for now."
    },
    "judgment": {
      "original": "謙：亨，君子有終。",
      "modern": "Modesty brings success. A person of integrity brings matters to a sound completion."
    },
    "lines": [
      {
        "original": "初六：謙謙君子，用涉大川，吉。",
        "modern": "A truly modest person remains modest. Even when undertaking something as difficult as crossing a great river, this is fortunate."
      },
      {
        "original": "六二：鳴謙，貞吉。",
        "modern": "Modesty becomes visible and heard in one’s conduct. Staying true to it brings good results."
      },
      {
        "original": "九三：勞謙君子，有終吉。",
        "modern": "A person of integrity has earned much yet remains modest. Bringing matters to completion brings good results."
      },
      {
        "original": "六四：无不利，撝謙。",
        "modern": "There is no disadvantage in expressing and practicing modesty."
      },
      {
        "original": "六五：不富，以其鄰，利用侵伐，无不利。",
        "modern": "Without boasting of wealth, one can bring neighbors into cooperation. Firm action against those who refuse may also be appropriate; there is no inherent disadvantage."
      },
      {
        "original": "上六：鳴謙，利用行師，征邑國。",
        "modern": "A reputation for modesty is heard widely. If force must be mobilized, use it to put your own community in order."
      }
    ]
  },
  "16": {
    "name": "Enthusiasm",
    "chineseName": "豫",
    "pinyin": "Yù",
    "keywords": [
      "joy",
      "preparedness",
      "music",
      "momentum"
    ],
    "essence": "Thunder over Earth: a time of rising spirits and readiness.",
    "trigramSymbolism": "Spring thunder sounds over the ground, stirring everything to life. This image suggests music, delight, and the momentum to begin.",
    "classical": "Enthusiasm means both rejoicing and preparing in advance. When people are united and momentum is rising, it is a good time to establish structures and undertake action. Yet the lines repeatedly warn against being swept away by pleasure. Enjoyment is also a time to prepare.",
    "modern": "Morale is rising and others are ready to join in. This momentum can help begin something, but it becomes dangerous when pleasure itself becomes the goal. Enjoyment is strongest when matched with preparation.",
    "guidance": {
      "work": "High morale makes this a good time to launch a project. First, check that enthusiasm has not inflated the estimates.",
      "relationships": "Value enjoyable gatherings, but do not make promises merely to fit the mood.",
      "decision": "Good feelings can make decisions too easy. Use the momentum, but let major choices rest overnight."
    },
    "judgment": {
      "original": "豫：利建侯行師。",
      "modern": "Enthusiasm: favorable for establishing leadership and mobilizing people."
    },
    "lines": [
      {
        "original": "初六：鳴豫，凶。",
        "modern": "Giving loud expression to your excitement brings trouble."
      },
      {
        "original": "六二：介于石，不終日，貞吉。",
        "modern": "Firm as stone, act before the day is over. Integrity brings good fortune."
      },
      {
        "original": "六三：盱豫，悔。遲有悔。",
        "modern": "Looking upward for approval and enjoying flattery brings regret. Delay will bring further regret."
      },
      {
        "original": "九四：由豫，大有得。勿疑。朋盍簪。",
        "modern": "A source of enthusiasm gains greatly. Do not doubt; companions gather closely around you."
      },
      {
        "original": "六五：貞疾，恆不死。",
        "modern": "Maintain integrity while dealing with illness; it will not be fatal."
      },
      {
        "original": "上六：冥豫，成有渝，无咎。",
        "modern": "Lost in pleasure and unable to see ahead, you are blameless if you make a change."
      }
    ]
  },
  "17": {
    "name": "Following",
    "chineseName": "隨",
    "pinyin": "Suí",
    "keywords": [
      "follow",
      "adaptability",
      "moving with circumstances",
      "changing course"
    ],
    "essence": "Move with the moment. Let go of rigid preferences and follow what is sound.",
    "trigramSymbolism": "Thunder rests within the lake: move when it is time to move, and stop when it is time to stop. This is the image of following the moment.",
    "classical": "Following means going along with something. The judgment says that following can bring great success when integrity is maintained. The strong below the yielding suggests that a leader first responds to others, and then earns their willing support.",
    "modern": "A time to loosen your grip on your own plans and work with the current or with other people. This is not blind compliance: choose the right direction first, then adapt flexibly. Knowing when to stop and rest is also part of following.",
    "guidance": {
      "work": "Do not cling to your usual method. Try working with the team’s momentum or a new approach; learning as you adapt may be the fastest way forward.",
      "relationships": "It is fine to let someone else take the lead sometimes. A person who can follow can ultimately become trusted.",
      "decision": "Choose carefully what, and whom, you will follow. When the direction and the person are sound, entrusting yourself is not weakness."
    },
    "judgment": {
      "original": "隨：元亨。利貞。无咎。",
      "modern": "Following: great success. Integrity is beneficial. No blame."
    },
    "lines": [
      {
        "original": "初九：官有渝，貞吉。出門交有功。",
        "modern": "初九: A role or responsibility changes. Maintain integrity and good fortune follows. Go out through the door and engage with others; this brings results."
      },
      {
        "original": "六二：系小子，失丈夫。",
        "modern": "六二: Attach yourself to a lesser person, and you lose the worthy one."
      },
      {
        "original": "六三：系丈夫，失小子。隨，有求得利，居貞。",
        "modern": "六三: Attach yourself to the worthy person, and you leave the lesser one behind. By following, you gain what you seek; remain firm in what is right."
      },
      {
        "original": "九四：隨有獲，貞凶。有孚在道，以明，何咎。",
        "modern": "九四: Following brings gains, but even integrity may lead to trouble. If your trust is sincere, aligned with the right path, and made clear, what blame could there be?"
      },
      {
        "original": "九五：孚于嘉，吉。",
        "modern": "九五: Put your trust in what is good. Good fortune."
      },
      {
        "original": "上六：拘系之，乃從維之。王用亨于西山。",
        "modern": "上六: Bind it firmly, then tie it again so that it follows. The king makes an offering at the western mountain."
      }
    ]
  },
  "18": {
    "name": "Work on the Decayed",
    "chineseName": "蠱",
    "pinyin": "Gǔ",
    "keywords": [
      "correcting decay",
      "repair",
      "reform",
      "putting things right"
    ],
    "essence": "A vessel has been left to decay. This is a time to repair what has been neglected and restore what has broken down.",
    "trigramSymbolism": "Wind is trapped beneath a mountain. Air no longer circulates through the vessel, and its contents spoil: an image of disorder accumulated over time.",
    "classical": "The character suggests worms breeding in a dish, and so came to signify long-standing neglect and corruption. The judgment says that major renewal can succeed and that crossing a great river is worthwhile, but calls for careful preparation before and after the starting point. Most of the lines speak of correcting disorder inherited from a previous generation, emphasizing the work of repair rather than blame.",
    "modern": "This is a time to face neglected problems, inherited burdens, and accumulated damage. Looking away only allows them to worsen. The task is not to assign blame but to restore what can be restored: understand the causes, make a plan, and give the work time.",
    "guidance": {
      "work": "Before tackling technical debt or outdated practices, invest in investigation and planning. Once the work begins, keep moving steadily.",
      "relationships": "The roots of conflict are often old. Shift the conversation from who is at fault to how trust and cooperation can be repaired.",
      "decision": "A matter you have kept avoiding may be the real issue now. The key decision is whether to begin putting it right."
    },
    "judgment": {
      "original": "蠱：元亨。利涉大川。先甲三日，後甲三日。",
      "modern": "Work on what has decayed. Great success is possible. It is worthwhile to cross a great river. Prepare carefully for three days before beginning, and for three days afterward."
    },
    "lines": [
      {
        "original": "初六：幹父之蠱，有子考，无咎，厲終吉。",
        "modern": "Correcting the decay inherited from the father. A capable child honors the father and avoids blame. The task is risky, but it ends well."
      },
      {
        "original": "九二：幹母之蠱，不可貞。",
        "modern": "Correcting the decay inherited from the mother. Do not insist on carrying it through by rigid principle."
      },
      {
        "original": "九三：幹父之蠱，小有悔，无大咎。",
        "modern": "Correcting the decay inherited from the father. There may be some regret, but no serious blame."
      },
      {
        "original": "六四：裕父之蠱，往見吝。",
        "modern": "Indulging the decay inherited from the father and leaving it alone. Going on this way brings shame."
      },
      {
        "original": "六五：幹父之蠱，用譽。",
        "modern": "Correcting the decay inherited from the father, and earning recognition."
      },
      {
        "original": "上九：不事王侯，高尚其事。",
        "modern": "Do not serve rulers or powerful officials. Hold your own way of life in high regard."
      }
    ]
  },
  "19": {
    "name": "Approach",
    "chineseName": "臨",
    "pinyin": "Lín",
    "keywords": [
      "approach",
      "growth",
      "drawing near",
      "the beginning of momentum"
    ],
    "essence": "Something greater is drawing near. Work with the rising momentum while it is growing.",
    "trigramSymbolism": "Water gathers beneath the earth and rises toward the surface. The image is of a growing force approaching the shore.",
    "classical": "Approach means that something great arrives. Two yang lines begin to rise from below, forming a hexagram of growth. The judgment recognizes strong progress but warns that by the eighth month misfortune may come: momentum, like a season, does not last forever.",
    "modern": "Things are beginning to grow, and deeper involvement brings a stronger response. This is also a time to guide others. Influence works best through care and closeness, not pressure. Growth will not last indefinitely, so use the opening while it is present.",
    "guidance": {
      "work": "Give time now to a growing project or skill. A move made during expansion can accomplish what several ordinary moves would.",
      "relationships": "When guiding juniors or colleagues, come close rather than speaking from above. Supportive guidance reaches people most deeply.",
      "decision": "The opportunity is present but not unlimited. Set a time frame and act while the momentum is strong."
    },
    "judgment": {
      "original": "臨：元亨。利貞。至于八月有凶。",
      "modern": "Approach brings great success. It is beneficial to remain principled. By the eighth month, however, there may be misfortune."
    },
    "lines": [
      {
        "original": "初九：咸臨，貞吉。",
        "modern": "Approach with mutual openness; staying true brings good fortune."
      },
      {
        "original": "九二：咸臨，吉无不利。",
        "modern": "Approach with mutual openness. Good fortune, and nothing fails to benefit."
      },
      {
        "original": "六三：甘臨，无攸利。既憂之，无咎。",
        "modern": "Approach with pleasing words; nothing is gained. If this causes concern and leads to correction, there is no blame."
      },
      {
        "original": "六四：至臨，无咎。",
        "modern": "Approach with complete commitment; there is no blame."
      },
      {
        "original": "六五：知臨，大君之宜，吉。",
        "modern": "Approach with understanding. This is fitting for a great leader, and brings good fortune."
      },
      {
        "original": "上六：敦臨，吉无咎。",
        "modern": "Approach with sincere devotion. Good fortune and no blame."
      }
    ]
  },
  "20": {
    "name": "Contemplation",
    "chineseName": "觀",
    "pinyin": "Guān",
    "keywords": [
      "observe",
      "perspective",
      "self-reflection",
      "showing by example"
    ],
    "essence": "Survey the whole situation carefully before you act. Observation includes noticing your own motives and how your conduct appears to others.",
    "trigramSymbolism": "Wind moves across the earth, reaching everywhere. This suggests viewing the wider scene from a high vantage point.",
    "classical": "Contemplation means both seeing and displaying. Washing the hands before presenting the offerings evokes focused reverence at the threshold of a rite. To observe is also to be observed. The lines trace a movement from childish perception toward examining one’s conduct and its influence.",
    "modern": "This is a time to pause and take in the wider situation before acting. Gather information, but also examine your position and motives. Your conduct may itself be serving as an example to others.",
    "guidance": {
      "work": "Do not rush to begin. First study the market, organization, and evidence; the quality of your observation shapes the quality of your next move.",
      "relationships": "Before judging someone else, consider how you are appearing to them. What you demonstrate may persuade more strongly than what you say.",
      "decision": "Step back and review the choice from a wider perspective. A problem seen from farther away may take a different shape."
    },
    "judgment": {
      "original": "觀：盥而不薦，有孚顒若。",
      "modern": "Wash your hands, but do not yet present the offerings. With sincere trust, stand in reverent attention, drawing others’ regard."
    },
    "lines": [
      {
        "original": "初六：童觀，小人无咎，君子吝。",
        "modern": "A child’s way of seeing. For an ordinary person, no blame; for a principled person, it is limiting."
      },
      {
        "original": "六二：窺觀，利女貞。",
        "modern": "Peering through a gap. Suitable for a woman’s constancy, but narrow in scope."
      },
      {
        "original": "六三：觀我生，進退。",
        "modern": "Observe your own conduct and decide whether to advance or withdraw."
      },
      {
        "original": "六四：觀國之光，利用賓于王。",
        "modern": "Observe the country’s splendor. It is beneficial to serve as a guest at the ruler’s court."
      },
      {
        "original": "九五：觀我生，君子无咎。",
        "modern": "Observe your own conduct. For a principled person, there is no blame."
      },
      {
        "original": "上九：觀其生，君子无咎。",
        "modern": "Observe the conduct of others. For a principled person, there is no blame."
      }
    ]
  },
  "21": {
    "name": "Biting Through",
    "chineseName": "噬嗑",
    "pinyin": "Shì Kè",
    "keywords": [
      "break through",
      "remove obstacles",
      "settle matters",
      "clear judgment"
    ],
    "essence": "Bite through what blocks connection and bring the matter to a clear resolution.",
    "trigramSymbolism": "Thunder and lightning come together: only by biting through what obstructs the mouth can the upper and lower parts meet again.",
    "classical": "Biting Through means removing an obstacle lodged between things. The judgment says that progress is possible, and that using legal or disciplinary measures is beneficial. Obstacles should be addressed with clear judgment and firm, proportionate action.",
    "modern": "This is a time to resolve openly neglected obstacles, violations, or resentments. Vague kindness can allow problems to grow. Act by fair, visible standards rather than anger; once the obstruction is removed, things can work together again.",
    "guidance": {
      "work": "Handle rule violations and stalled matters clearly, stating the standards first. Delay may cost more.",
      "relationships": "Address misunderstandings or third-party interference directly instead of letting them remain between you.",
      "decision": "A clear decision is likely needed. Make the standard for judgment explicit before acting."
    },
    "judgment": {
      "original": "噬嗑：亨。利用獄。",
      "modern": "Biting Through: success. It is beneficial to use legal or disciplinary measures."
    },
    "lines": [
      {
        "original": "初九：屨校滅趾，无咎。",
        "modern": "Initial yang: Shackles injure the toes. There is no blame."
      },
      {
        "original": "六二：噬膚滅鼻，无咎。",
        "modern": "Second yin: Biting through soft flesh reaches the nose. There is no blame."
      },
      {
        "original": "六三：噬臘肉，遇毒；小吝，无咎。",
        "modern": "Third yin: Biting through dried meat, one encounters poison. There is a minor difficulty, but no blame."
      },
      {
        "original": "九四：噬乾胏，得金矢，利艱貞，吉。",
        "modern": "Fourth yang: Biting through meat dried on the bone, one finds a metal arrowhead. Steadfastness through difficulty brings good fortune."
      },
      {
        "original": "六五：噬乾肉，得黃金，貞厲，无咎。",
        "modern": "Fifth yin: Biting through dried meat, one finds gold. Correct conduct amid danger brings no blame."
      },
      {
        "original": "上九：何校滅耳，凶。",
        "modern": "Top yang: A neck cangue reaches the ears. Misfortune follows repeated wrongdoing."
      }
    ]
  },
  "22": {
    "name": "Grace",
    "chineseName": "賁",
    "pinyin": "Bì",
    "keywords": [
      "Adornment",
      "Beauty",
      "Appearance and substance",
      "Afterglow"
    ],
    "essence": "Fire at the foot of a mountain: adornment gives substance its visible form, but cannot replace it.",
    "trigramSymbolism": "Fire below the mountain evokes evening light illuminating its slopes: beauty that serves and reveals what is substantial.",
    "classical": "Grace means adornment. It brings things into order and makes them presentable, but its usefulness is limited to modest aims. The lines move from decorating the feet to the final image of plain whiteness, where freedom from display is itself the finest grace.",
    "modern": "Presentation, form, and design matter in some situations. Refinement is worthwhile, but appearance should serve substance rather than become the main point. The path of Grace returns ultimately to simplicity and honest expression.",
    "guidance": {
      "work": "Polish documents and presentation, but stop if decoration begins hiding weak substance.",
      "relationships": "Affection won through constant self-display is costly to maintain. Let simple sincerity take the lead.",
      "decision": "Ask whether you are protecting appearances or serving what matters. When uncertain, choose the simpler, more honest course."
    },
    "judgment": {
      "original": "賁：亨。小利有攸往。",
      "modern": "Grace brings progress. It is beneficial to undertake something small."
    },
    "lines": [
      {
        "original": "初九：賁其趾，舍車而徒。",
        "modern": "Grace the toes; leave the carriage and walk."
      },
      {
        "original": "六二：賁其須。",
        "modern": "Grace the beard."
      },
      {
        "original": "九三：賁如濡如，永貞吉。",
        "modern": "Graceful and moistening: lasting fidelity brings good fortune."
      },
      {
        "original": "六四：賁如皤如，白馬翰如，匪寇婚媾。",
        "modern": "Graceful yet plain; a white horse comes swiftly. It is not an attack but a marriage proposal."
      },
      {
        "original": "六五：賁於丘園，束帛戔戔，吝，終吉。",
        "modern": "Grace the hill garden. The bundle of silk is small. Though awkward, the outcome is good."
      },
      {
        "original": "上九：白賁，无咎。",
        "modern": "White grace. There is no blame."
      }
    ]
  },
  "23": {
    "name": "Splitting Apart",
    "chineseName": "剝",
    "pinyin": "Bō",
    "keywords": [
      "erosion",
      "decline",
      "protection",
      "foundation"
    ],
    "essence": "The mountain is being worn down. Do not advance now; protect the foundation.",
    "trigramSymbolism": "A mountain grows thinner above the earth, as erosion strips things away little by little from the base.",
    "classical": "Bo means “to peel away” or “to fall off”: yielding forces wear down the firm foundation until only one strong line remains. The judgment clearly advises against moving forward. Yet the top line says that a large fruit remains uneaten, preserving a seed for what comes next.",
    "modern": "A situation is gradually breaking down, and every effort seems to reduce what remains. Aggressive action may widen the damage. Choose one essential core—trust, health, skill, or money—and protect it. What survives can become the seed of a new season.",
    "guidance": {
      "work": "During contraction, do not expand the front. Identify and protect the core business or skill that must survive.",
      "relationships": "Do not chase everyone who is leaving. Carefully sustaining the relationships that remain can provide the basis for renewal.",
      "decision": "Decide less about what to do than about what to preserve. Leave aggressive moves for the next phase."
    },
    "judgment": {
      "original": "剝：不利有攸往。",
      "modern": "Splitting Apart: It is not favorable to undertake a journey or pursue an objective now."
    },
    "lines": [
      {
        "original": "初六：剝牀以足，蔑貞凶。",
        "modern": "Line 1: The bed is stripped away at its feet. Treating what is right with contempt brings misfortune."
      },
      {
        "original": "六二：剝牀以辨，蔑貞凶。",
        "modern": "Line 2: The bed is stripped away up to its frame. Treating what is right with contempt brings misfortune."
      },
      {
        "original": "六三：剝之，无咎。",
        "modern": "Line 3: Amid the stripping away, one aligns with what is right. There is no blame."
      },
      {
        "original": "六四：剝牀以膚，凶。",
        "modern": "Line 4: The bed is stripped away to the skin. Misfortune; danger is reaching the person."
      },
      {
        "original": "六五：貫魚，以宮人寵，无不利。",
        "modern": "Line 5: Like threading fish together, the palace people are led in a chain and receive favor. Nothing is unfavorable."
      },
      {
        "original": "上九：碩果不食，君子得輿，小人剝廬。",
        "modern": "Line 6: The large fruit remains uneaten. The exemplary person is carried in the people’s cart; the petty person strips away even their own hut."
      }
    ]
  },
  "24": {
    "name": "Return",
    "chineseName": "復",
    "pinyin": "Fù",
    "keywords": [
      "Recovery",
      "Return",
      "A fresh start",
      "Coming back"
    ],
    "essence": "After decline has run its course, a small positive force returns. Recovery begins quietly and should not be rushed.",
    "trigramSymbolism": "Thunder stirs beneath the earth: at the depth of winter, one small movement of life begins again. The image is a return from the bottom of a long period of darkness.",
    "classical": "Return means coming back. After everything has been stripped away, one yang line returns at the base. The Judgment says that return brings progress, movement in and out without harm, and the arrival of companions without blame. The path turns back on itself and returns in its proper cycle. The first step toward recovery is often an early return from a mistaken direction.",
    "modern": "A small sign of recovery is beginning after prolonged stagnation or failure. The new growth is still fragile, so trying to recover everything at once may break it. If the direction is sound, small steps are enough. When you recognize that you have gone wrong, returning early limits the damage.",
    "guidance": {
      "work": "Begin a return or restart on a small scale. Designing the first week well can shape the whole recovery.",
      "relationships": "Repair begins with small renewed exchanges rather than a dramatic apology. One message can be the first sign of return.",
      "decision": "When you see that you are wrong, turn back early. “I have come this far” can block the way back."
    },
    "judgment": {
      "original": "復：亨。出入无疾，朋來无咎。反復其道，七日來復，利有攸往。",
      "modern": "Return brings progress. Going out and coming back causes no illness or harm; companions arrive without blame. The path turns back and returns in its cycle, and after seven days it comes back again. It is beneficial to have a direction to pursue."
    },
    "lines": [
      {
        "original": "初九：不復遠，无袛悔，元吉。",
        "modern": "Nine at the beginning: Do not go far before returning. You will avoid regret; this is greatly fortunate."
      },
      {
        "original": "六二：休復，吉。",
        "modern": "Six in the second place: A calm, well-supported return is fortunate."
      },
      {
        "original": "六三：頻復，厲无咎。",
        "modern": "Six in the third place: Repeatedly returning and departing is dangerous, but brings no blame."
      },
      {
        "original": "六四：中行獨復。",
        "modern": "Six in the fourth place: Moving along the middle path, one returns alone."
      },
      {
        "original": "六五：敦復，无悔。",
        "modern": "Six in the fifth place: Returning with wholehearted sincerity brings no regret."
      },
      {
        "original": "上六：迷復，凶，有災眚。用行師，終有大敗，以其國君，凶；至于十年，不克征。",
        "modern": "Six at the top: Lost on the way back, one faces misfortune and disaster. If an army is sent out, it ends in great defeat, bringing misfortune even to its ruler. For ten years, it cannot undertake a campaign."
      }
    ]
  },
  "25": {
    "name": "Innocence",
    "chineseName": "无妄",
    "pinyin": "Wú Wàng",
    "keywords": [
      "Unselfconsciousness",
      "Naturalness",
      "Sincerity",
      "Without contrivance"
    ],
    "essence": "Act sincerely and naturally, without private schemes or forced design.",
    "trigramSymbolism": "Thunder moves beneath Heaven in its proper season: direct, uncalculated action in keeping with what is natural.",
    "classical": "Innocence means freedom from reckless or self-serving intent. When one is sincere and upright, things can open widely. If one is not upright, trouble follows, and pressing ahead is not beneficial. Do not expect harvests without cultivating the field or rewards without doing the work.",
    "modern": "This is a time when honesty and a natural manner are stronger than strategy or performance. It also recognizes undeserved trouble. When misfortune strikes despite having done no wrong, avoid frantic remedies and allow it to pass calmly.",
    "guidance": {
      "work": "Use a straightforward approach rather than tricks. Attempts to force quick results are often noticed.",
      "relationships": "Uncalculated kindness lasts longest. Once you design it for a return, it becomes something else.",
      "decision": "Examine your motive: does this choice come from sincerity? If you are caught in undeserved trouble, avoid unnecessary action and let it pass."
    },
    "judgment": {
      "original": "无妄：元亨。利貞。其匪正有眚，不利有攸往。",
      "modern": "Innocence: Great success. It is beneficial to remain upright. If one is not upright, trouble follows; pressing ahead is not beneficial."
    },
    "lines": [
      {
        "original": "初九：无妄，往吉。",
        "modern": "Innocence. Moving ahead brings good fortune."
      },
      {
        "original": "六二：不耕穫，不菑畬，則利有攸往。",
        "modern": "Do not plow expecting a harvest, or clear new ground expecting its yield. Then it is beneficial to proceed."
      },
      {
        "original": "六三：无妄之災，或系之牛，行人之得，邑人之災。",
        "modern": "Misfortune without wrongdoing: a tied-up ox is taken by a passerby, and the people of the village are blamed."
      },
      {
        "original": "九四：可貞，无咎。",
        "modern": "Remain upright. There is no blame."
      },
      {
        "original": "九五：无妄之疾，勿藥有喜。",
        "modern": "An illness without wrongdoing: do not rush to medication; recovery will bring happiness."
      },
      {
        "original": "上九：无妄，行有眚，无攸利。",
        "modern": "Even without wrongdoing, going farther brings trouble. Nothing is gained by proceeding."
      }
    ]
  },
  "26": {
    "name": "Great Taming",
    "chineseName": "大畜",
    "pinyin": "Dà Chù",
    "keywords": [
      "great reserves",
      "restrained cultivation",
      "practice",
      "accumulation"
    ],
    "essence": "Great Taming means holding power back so it can grow strong and serve a larger purpose.",
    "trigramSymbolism": "Heaven is held within the mountain: overflowing power is contained in a strong vessel and cultivated.",
    "classical": "Great Taming means strongly restraining and storing strength. Its judgment says that integrity is beneficial; not living only from one's household brings good fortune; and undertaking a major crossing is favorable. Stored strength is fortunate when it is used for the wider world rather than kept private. Renew your character each day and learn from the words and conduct of those who came before.",
    "modern": "You may have real power, yet this is a time to direct it into learning, training, and preparation. Building skill, trust, and resources can look like standing still, but it supplies the energy for the next major undertaking. Restraint is not mere endurance; it is the bend before the leap.",
    "guidance": {
      "work": "Prioritize building capability and trust over short-term display. Investment in learning may yield its greatest return now.",
      "relationships": "Strong impulses, in yourself or others, can become constructive when they are restrained and given clear direction.",
      "decision": "Waiting another six months to build reserves before a major challenge is not necessarily avoidance. Your preparation determines how wide a crossing you can make."
    },
    "judgment": {
      "original": "大畜：利貞，不家食吉，利涉大川。",
      "modern": "Great Taming: integrity is beneficial. Not relying only on one's household brings good fortune. Undertaking a major crossing is favorable."
    },
    "lines": [
      {
        "original": "初九：有厲利已。",
        "modern": "Nine at the beginning: There is danger; stopping is beneficial."
      },
      {
        "original": "九二：輿說輹。",
        "modern": "Nine in the second place: The carriage axle support is removed. Stop advancing for now."
      },
      {
        "original": "九三：良馬逐，利艱貞。曰閑輿衛，利有攸往。",
        "modern": "Nine in the third place: Fine horses pursue one another. In difficulty, maintaining integrity is beneficial. Practice managing the carriage and its defenses; then advancing is favorable."
      },
      {
        "original": "六四：童牛之牿，元吉。",
        "modern": "Six in the fourth place: Fit a young ox with a nose ring. This is greatly auspicious."
      },
      {
        "original": "六五：豶豕之牙，吉。",
        "modern": "Six in the fifth place: The tusks of a neutered boar. Good fortune comes from cutting off the source of aggression."
      },
      {
        "original": "上九：何天之衢，亨。",
        "modern": "Nine at the top: Carrying out Heaven's great thoroughfare, the way opens fully. Progress is successful."
      }
    ]
  },
  "27": {
    "name": "Mouth Corners",
    "chineseName": "頤",
    "pinyin": "Yí",
    "keywords": [
      "nourishment",
      "speech and food",
      "moderation",
      "self-nourishment"
    ],
    "essence": "Choose carefully what you take in and what sustains you.",
    "trigramSymbolism": "Thunder moves beneath the mountain. The image resembles the moving jaws, expressing nourishment.",
    "classical": "Mouth Corners means both the jaw and nourishment. The judgment says: “Steadfastness brings good fortune. Observe how nourishment is provided, and seek your own sustenance.” A wise person follows this by moderating food and drink and speaking with care. The mouth is both an entrance and an exit.",
    "modern": "What enters your body, occupies your mind, and leaves your mouth all contribute to your condition and affect those around you. Reconsidering what you consume and say can quietly change the course of things.",
    "guidance": {
      "work": "Choose the quality of the information and language you engage with. Regular, nourishing input is better than consuming everything indiscriminately.",
      "relationships": "Words can sustain a relationship or damage it. Make a habit of pausing before you speak.",
      "decision": "Ask: “Will this choice nourish me and others, or wear us down?” Use that measure to review it."
    },
    "judgment": {
      "original": "頤：貞吉。觀頤，自求口實。",
      "modern": "Mouth Corners: Steadfastness brings good fortune. Observe how nourishment is provided, and seek your own sustenance."
    },
    "lines": [
      {
        "original": "初九：舍爾靈龜，觀我朵頤，凶。",
        "modern": "You abandon your inner nourishment and stare at another person’s open mouth. Misfortune."
      },
      {
        "original": "六二：顛頤，拂經，于丘頤，征凶。",
        "modern": "You seek nourishment from below, turning against the proper way and looking upward to a hill for support. Advancing brings misfortune."
      },
      {
        "original": "六三：拂頤，貞凶，十年勿用，无攸利。",
        "modern": "You turn against the way of nourishment. Even with steadfastness, misfortune; for ten years nothing can be undertaken, and no benefit comes."
      },
      {
        "original": "六四：顛頤吉，虎視眈眈，其欲逐逐，无咎。",
        "modern": "Seeking nourishment from above, even in an inverted position, brings good fortune. Watch intently like a tiger and pursue the task steadily; there is no blame."
      },
      {
        "original": "六五：拂經，居貞吉，不可涉大川。",
        "modern": "You turn from the usual way, but remaining steadfast brings good fortune. Do not cross the great river."
      },
      {
        "original": "上九：由頤，厲吉，利涉大川。",
        "modern": "You become a source of nourishment for others. The responsibility is serious and dangerous, but good fortune follows; crossing the great river is favorable."
      }
    ]
  },
  "28": {
    "name": "Great Preponderance",
    "chineseName": "大過",
    "pinyin": "Dà Guò",
    "keywords": [
      "overload",
      "a bending beam",
      "emergency conditions",
      "standing independently without fear"
    ],
    "essence": "The beam is bending. Recognize the weight and take decisive action.",
    "trigramSymbolism": "Water in the lake rises high enough to submerge the trees. The beam bends at its center under excessive weight: an image of overload.",
    "classical": "Great Preponderance means that something has become excessive: the four central yang lines outweigh the two yin lines at the ends. It describes an exceptional situation. The judgment says that the beam bends, yet it is favorable to move forward, and progress is possible. A capable person stands independently without fear and withdraws from the world without inner distress.",
    "modern": "The load is nearing the limits of the structure. In work, responsibility, or relationships, when something is visibly bending, do not rely on minor adjustments. Add support, change the deadline, or stop what cannot continue. Exceptional pressure calls for a substantial response.",
    "guidance": {
      "work": "Solve overload structurally, not through endurance. Add people, move deadlines, or stop a task; choose a substantial measure.",
      "relationships": "Acknowledge excessive expectations or roles before they cause a breakdown. Honesty here is integrity, not weakness.",
      "decision": "Exceptional circumstances require decisive action. Even without others' approval, act independently when the course is right."
    },
    "judgment": {
      "original": "大過：棟橈，利有攸往，亨。",
      "modern": "Great Preponderance: The beam is bending. It is favorable to move forward. Success is possible."
    },
    "lines": [
      {
        "original": "初六：藉用白茅，无咎。",
        "modern": "Place an offering on white reeds spread beneath it. There is no blame."
      },
      {
        "original": "九二：枯楊生稊，老夫得其女妻，无不利。",
        "modern": "A withered poplar sends out new shoots. An old man takes a young wife. Nothing is unfavorable."
      },
      {
        "original": "九三：棟橈，凶。",
        "modern": "The beam bends. Misfortune."
      },
      {
        "original": "九四：棟隆，吉。有它吝。",
        "modern": "The beam is raised high. Good fortune. If attention turns elsewhere, there is regret."
      },
      {
        "original": "九五：枯楊生華，老婦得其士夫，无咎无譽。",
        "modern": "A withered poplar produces flowers. An old woman takes a young husband. There is neither blame nor praise."
      },
      {
        "original": "上六：過涉滅頂，凶，无咎。",
        "modern": "Wading in too deeply, one is submerged over the head. Misfortune. Yet there is no blame."
      }
    ]
  },
  "29": {
    "name": "The Abysmal Water",
    "chineseName": "坎",
    "pinyin": "Kǎn",
    "keywords": [
      "danger",
      "learning through hardship",
      "sincerity",
      "continuing to flow"
    ],
    "essence": "Repeated danger calls for steady movement through it, like water that keeps flowing.",
    "trigramSymbolism": "Water above water: steep ravines doubled. Yet water does not stop flowing.",
    "classical": "“Repeated danger” means danger upon danger. The judgment says that with sincerity, the heart can remain open and communication can succeed; one who proceeds may earn respect. Water passes through danger without losing its nature: when full, it must flow onward.",
    "modern": "A situation where one difficulty arrives before the previous one is resolved. The essential strength here is persistence rather than force: keep moving like water, choosing the lower path when necessary. Learning how to live with difficulty is also a skill gained in such times.",
    "guidance": {
      "work": "In a series of crises, prioritize keeping the process moving over finding a perfect solution. Repeated small advances can carry you through.",
      "relationships": "Sincerity during difficult periods is remembered most deeply later. Be honest rather than trying to appear unaffected.",
      "decision": "Do not let danger darken your judgment. Use the same standard as in calmer times: choose what is honest and the natural, lower-resistance path."
    },
    "judgment": {
      "original": "習坎：有孚，維心亨。行有尚。",
      "modern": "Repeated danger: with sincerity, the heart can remain open and communication can succeed. Proceeding may earn respect."
    },
    "lines": [
      {
        "original": "初六：習坎，入于坎窞，凶。",
        "modern": "Repeated danger: falling into the lowest part of the pit. Misfortune."
      },
      {
        "original": "九二：坎有險，求小得。",
        "modern": "Danger lies within the ravine. Seek small gains; they are attainable."
      },
      {
        "original": "六三：來之坎坎，險且枕，入于坎窞，勿用。",
        "modern": "Coming and going through danger upon danger, surrounded by it as if resting against a perilous ridge, one falls into the pit. Do not act."
      },
      {
        "original": "六四：樽酒簋貳，用缶，納約自牖，終无咎。",
        "modern": "Offer a jug of wine and two baskets of food in simple earthenware, passed in through the window. Sincerity gets through; in the end, there is no blame."
      },
      {
        "original": "九五：坎不盈，祗既平，无咎。",
        "modern": "The pit is not yet full, but its level is already becoming even. No blame."
      },
      {
        "original": "上六：係用徽纆，寘于叢棘，三歲不得，凶。",
        "modern": "Bound with ropes and placed among brambles, unable to get out for three years. Misfortune."
      }
    ]
  },
  "30": {
    "name": "The Clinging Fire",
    "chineseName": "離",
    "pinyin": "Lí",
    "keywords": [
      "attach",
      "brightness",
      "dependence and independence",
      "radiance"
    ],
    "essence": "Fire shines by clinging to something that can burn. First make sure what you are attached to is sound.",
    "trigramSymbolism": "Fire above fire: brightness renewed like the sun rising again and again. Fire shines only when it has fuel to cling to.",
    "classical": "Li carries both the senses of clinging and separating. It depicts fire attaching itself to fuel and shining. The judgment says that steadiness is beneficial, progress is possible, and raising a cow—an image of gentle receptivity—brings good fortune. Radiance is sustained by cultivating patience and responsiveness.",
    "modern": "Check what your own brightness is attached to: an organization, teacher, skill, or idea. Having support is not shameful; it is part of fire’s nature. What matters is the quality of what you join. Sound attachments illuminate both sides; harmful ones may consume both.",
    "guidance": {
      "work": "Assess the quality of the platform you are joining—a company, technology, or market. Choosing where you can shine is also a form of competence.",
      "relationships": "The difference between dependence and trust is whether you can stand apart. Stay connected while keeping your own center.",
      "decision": "If you commit yourself to something, ask whether it can keep burning over time. A spectacular flame may be short-lived."
    },
    "judgment": {
      "original": "離：利貞。亨。畜牝牛，吉。",
      "modern": "Clinging fire: steadiness is beneficial, and progress is possible. Nurturing gentle receptivity, like caring for a cow, brings good fortune."
    },
    "lines": [
      {
        "original": "初九：履錯然，敬之无咎。",
        "modern": "At first, your steps are confused. Act with respect and caution, and there will be no blame."
      },
      {
        "original": "六二：黃離，元吉。",
        "modern": "Yellow radiance: balanced brightness brings great good fortune."
      },
      {
        "original": "九三：日昃之離，不鼓缶而歌，則大耋之嗟，凶。",
        "modern": "The sun is declining. If you do not beat the vessel and sing, you will only lament old age. Misfortune."
      },
      {
        "original": "九四：突如其來如，焚如，死如，棄如。",
        "modern": "It comes suddenly, blazes up, dies, and is cast aside. What rises too abruptly does not last."
      },
      {
        "original": "六五：出涕沱若，戚嗟若，吉。",
        "modern": "Tears flow freely, with deep sorrow. Recognizing grief brings good fortune."
      },
      {
        "original": "上九：王用出征，有嘉折首，獲匪其醜，无咎。",
        "modern": "The ruler sends an army out. A worthy victory is won by striking down the chief alone and sparing those who followed. There is no blame."
      }
    ]
  },
  "31": {
    "name": "Influence",
    "chineseName": "咸",
    "pinyin": "Xián",
    "keywords": [
      "attunement",
      "resonance",
      "mutual attraction",
      "receptivity"
    ],
    "essence": "Influence arises when people or things respond to one another and connection becomes possible.",
    "trigramSymbolism": "A lake rests above a mountain. The mountain lowers itself to receive the lake, suggesting mutual responsiveness and attraction.",
    "classical": "Influence is feeling and response, the first hexagram of the lower sequence. Its judgment values steady integrity and presents marriage as favorable. The lines trace influence from a first stir in the body toward deeper response, while warning against restless action and empty talk.",
    "modern": "This is a situation in which the heart moves and understanding comes before argument. Empathy can advance matters more effectively than pressure. Make room to receive others; fewer assumptions allow deeper resonance.",
    "guidance": {
      "work": "Before pressing your logic, find the point that genuinely matters to the other person. Communication works better after mutual understanding begins.",
      "relationships": "Share what you sense, but lightly. Influence works both ways and gathers where there is room to listen.",
      "decision": "An emotional response is relevant evidence, but give it time to distinguish passing excitement from deeper resonance."
    },
    "judgment": {
      "original": "咸：亨。利貞。取女吉。",
      "modern": "Influence brings progress. Steadfastness is beneficial. Marrying a woman brings good fortune."
    },
    "lines": [
      {
        "original": "初六：咸其拇。",
        "modern": "Influence reaches the big toe."
      },
      {
        "original": "六二：咸其腓，凶，居吉。",
        "modern": "Influence reaches the calf; moving brings trouble, while staying still brings good fortune."
      },
      {
        "original": "九三：咸其股，執其隨，往吝。",
        "modern": "Influence reaches the thighs. Following others without independent purpose brings regret; going forward leads to difficulty."
      },
      {
        "original": "九四：貞吉悔亡，憧憧往來，朋從爾思。",
        "modern": "Steadfastness brings good fortune and removes regret. If you move restlessly back and forth, only those who think as you do will follow."
      },
      {
        "original": "九五：咸其脢，无悔。",
        "modern": "Influence reaches the flesh of the back. There is no regret."
      },
      {
        "original": "上六：咸其輔，頰，舌。",
        "modern": "Influence reaches the jaw, cheeks, and tongue: response expressed only in words."
      }
    ]
  },
  "32": {
    "name": "Duration",
    "chineseName": "恆",
    "pinyin": "Héng",
    "keywords": [
      "duration",
      "continuity",
      "steadfast direction",
      "endurance"
    ],
    "essence": "Duration means sustaining a sound course over time without becoming rigid. True continuity keeps its direction while adapting in motion.",
    "trigramSymbolism": "Thunder and wind move together, suggesting an order that endures through active movement rather than stillness.",
    "classical": "Heng means what is lasting or constant. The judgment says that duration brings progress without blame; it is beneficial to remain upright and to move onward. It warns that abandoning consistency brings shame and difficulty.",
    "modern": "This is a time when value comes from sustained effort rather than novelty. Habits, relationships, and enterprises gain trust through reliability. The danger is not change itself, but impulsive shifts or giving up from boredom.",
    "guidance": {
      "work": "Continue a sound routine even before results are visible; steady effort often compounds quietly.",
      "relationships": "Long relationships are strengthened by dependable contact, not only dramatic moments.",
      "decision": "Ask whether the path is truly wrong or whether you have simply grown tired of it. If it is only fatigue, continuing may be wiser."
    },
    "judgment": {
      "original": "恆：亨，无咎。利貞，利有攸往。",
      "modern": "Duration brings progress without blame. It is beneficial to remain upright and to have somewhere to go."
    },
    "lines": [
      {
        "original": "初六：浚恆，貞凶，无攸利。",
        "modern": "Seeking permanence too deeply from the outset. Even if correct, this brings trouble; nothing is beneficial."
      },
      {
        "original": "九二：悔亡。",
        "modern": "Regret disappears."
      },
      {
        "original": "九三：不恆其德，或承之羞，貞吝。",
        "modern": "You cannot sustain your character. Shame may come upon you; even persistence brings difficulty."
      },
      {
        "original": "九四：田无禽。",
        "modern": "The field holds no game. There is nothing to gain here."
      },
      {
        "original": "六五：恆其德，貞，婦人吉，夫子凶。",
        "modern": "Sustain your character and remain steadfast. This is favorable for a woman, but unfavorable for a man."
      },
      {
        "original": "上六：振恆，凶。",
        "modern": "Agitating what should endure brings trouble."
      }
    ]
  },
  "33": {
    "name": "Retreat",
    "chineseName": "遯",
    "pinyin": "Dùn",
    "keywords": [
      "withdraw",
      "create distance",
      "preservation",
      "strategic retreat"
    ],
    "essence": "Retreat can be a form of progress: step back to preserve your strength and make way for what comes next.",
    "trigramSymbolism": "Heaven withdraws high above the encroaching mountain. The image is of gaining distance from pressure in order to remain whole.",
    "classical": "Retreat means withdrawing or escaping. As hidden pressure rises from below, the wise person steps back. Withdrawal can open the way forward; modest adherence to what is right is beneficial. The aim is neither hatred nor conflict, but timely distance and self-preservation.",
    "modern": "When circumstances or relationships shift, continuing to press in may only cause exhaustion. A planned retreat is not defeat but an active way to preserve strength. Leaving without insults or final blows creates resources for the next stage.",
    "guidance": {
      "work": "Withdraw methodically from unpromising projects or draining environments. Set clear exit criteria in advance.",
      "relationships": "Do not fight with people who are a poor fit. Quietly create distance; you may choose how close a relationship becomes.",
      "decision": "If your reasons for continuing are only habit and pride, stepping back may be progress. Plan not only the retreat, but also how to leave well."
    },
    "judgment": {
      "original": "遯：亨。小利貞。",
      "modern": "Retreat brings progress. In a small matter, it is beneficial to remain true and correct."
    },
    "lines": [
      {
        "original": "初六：遯尾，厲，勿用有攸往。",
        "modern": "Retreating at the rear, you are in danger. Do not undertake a venture."
      },
      {
        "original": "六二：執之用黃牛之革，莫之勝說。",
        "modern": "Held fast by a yellow oxhide, no one can loosen it."
      },
      {
        "original": "九三：系遯，有疾厲，畜臣妾吉。",
        "modern": "Attached to retreat, there is illness and danger. Keeping servants and dependents is fortunate."
      },
      {
        "original": "九四：好遯君子吉，小人否。",
        "modern": "A willing retreat is fortunate for the wise person; the lesser person cannot manage it."
      },
      {
        "original": "九五：嘉遯，貞吉。",
        "modern": "A worthy retreat. Correctness brings good fortune."
      },
      {
        "original": "上九：肥遯，无不利。",
        "modern": "A spacious, high-minded retreat: nothing is unfavorable."
      }
    ]
  },
  "34": {
    "name": "Great Power",
    "chineseName": "大壯",
    "pinyin": "Dà Zhuàng",
    "keywords": [
      "surging momentum",
      "the danger of force",
      "self-restraint",
      "propriety"
    ],
    "essence": "Great strength calls for restraint and right conduct. The stronger the momentum, the more carefully it must be directed.",
    "trigramSymbolism": "Thunder resounds above heaven: power is abundant and expansive. Yet strength becomes truly great only when it is used rightly.",
    "classical": "Great Power means strength at its height. Its judgment is brief: what matters is steadfast right conduct. A noble person does not use power merely because it is available. The ram repeatedly charges a fence and gets its horns caught, warning against forceful breakthrough.",
    "modern": "This is a situation rich in ability and momentum. The main danger is using that power indiscriminately. Because pressing may succeed, choose carefully what is worth pressing. How strength is used now will shape relationships after it fades.",
    "guidance": {
      "work": "With results and momentum behind you, many proposals may pass. Select carefully; do not force everything through.",
      "relationships": "A correct argument can still be a form of force. Do not win by driving others into a corner.",
      "decision": "“I can do it” is not enough. Choose what is proper and what you can later respect."
    },
    "judgment": {
      "original": "大壯：利貞。",
      "modern": "Great Power: It is beneficial to remain steadfast in what is right."
    },
    "lines": [
      {
        "original": "初九：壯于趾，征凶，有孚。",
        "modern": "Nine at the beginning: Strength in the toes. Advancing on sheer momentum brings misfortune, even when one is sincere."
      },
      {
        "original": "九二：貞吉。",
        "modern": "Nine in the second place: Steadfastness brings good fortune."
      },
      {
        "original": "九三：小人用壯，君子用罔，貞厲。羝羊觸藩，羸其角。",
        "modern": "Nine in the third place: A lesser person relies on force; a noble person does not use force. Even with right intentions, danger remains. A ram charges the fence and gets its horns caught."
      },
      {
        "original": "九四：貞吉悔亡，藩決不羸，壯于大輿之輹。",
        "modern": "Nine in the fourth place: Steadfastness brings good fortune and removes regret. The fence opens, the horns are no longer caught, and the axle of the great wagon is strong."
      },
      {
        "original": "六五：喪羊于易，无悔。",
        "modern": "Six in the fifth place: Losing the ram in open country brings no regret. Letting go of force causes no shame."
      },
      {
        "original": "上六：羝羊觸藩，不能退，不能遂，无攸利，艱則吉。",
        "modern": "Six at the top: The ram charges the fence, unable to retreat or advance. Nothing is gained. Enduring the difficulty brings good fortune."
      }
    ]
  },
  "35": {
    "name": "Progress",
    "chineseName": "晉",
    "pinyin": "Jìn",
    "keywords": [
      "forward movement",
      "the rising sun",
      "recognition",
      "toward clarity"
    ],
    "essence": "The sun rises above the earth, bringing increasing light. Progress means moving toward what is clear and life-giving.",
    "trigramSymbolism": "The sun rises over the horizon and gradually brightens the world: a sign of confident, visible progress.",
    "classical": "Jin means advancing. The Judgment depicts a meritorious lord receiving many horses and being granted audiences three times in one day—a picture of substantial recognition and support. The yielding forces rise upward toward brightness, suggesting natural progress toward greater clarity.",
    "modern": "This is a time when your work may be recognized and new opportunities may open. Progress comes not through force, but through steady, honest work that others can see and trust. Let consistency, rather than self-promotion, carry you forward.",
    "guidance": {
      "work": "Accept promotion, recognition, or a new role and move forward openly. Excessive hesitation may obscure a real opportunity.",
      "relationships": "Value the trust of those who support and encourage you. Use your position not to possess influence, but to help others grow.",
      "decision": "Moving forward is appropriate, but do it openly and cleanly—not through anxious, secretive maneuvering."
    },
    "judgment": {
      "original": "晉：康侯用錫馬蕃庶，晝日三接。",
      "modern": "Progress: a lord of peace receives many horses and is granted audiences three times in one day."
    },
    "lines": [
      {
        "original": "初六：晉如，摧如，貞吉。罔孚，裕无咎。",
        "modern": "Advancing, then being hindered. Staying true brings good fortune. Even without others’ trust, remain patient and broad-minded; there is no blame."
      },
      {
        "original": "六二：晉如，愁如，貞吉。受茲介福，于其王母。",
        "modern": "Advancing with concern. Staying true brings good fortune. In time, receive this great blessing from the royal grandmother."
      },
      {
        "original": "六三：眾允，悔亡。",
        "modern": "The people acknowledge and support you. Regret disappears."
      },
      {
        "original": "九四：晉如鼫鼠，貞厲。",
        "modern": "Advancing like a greedy flying squirrel. Even proper conduct is dangerous."
      },
      {
        "original": "六五：悔亡，失得勿恤，往吉无不利。",
        "modern": "Regret disappears. Do not worry about gain or loss; going forward brings good fortune and no disadvantage."
      },
      {
        "original": "上九：晉其角，維用伐邑，厲吉无咎，貞吝。",
        "modern": "Advancing with the horns—forcefully and headfirst. Use this only to correct your own community. Though dangerous, it can succeed without blame; even proper conduct eventually reaches an impasse."
      }
    ]
  },
  "36": {
    "name": "Darkening of the Light",
    "chineseName": "明夷",
    "pinyin": "Míng Yí",
    "keywords": [
      "light damaged",
      "dark times",
      "protect within",
      "discretion"
    ],
    "essence": "The sun has gone beneath the earth. Protect your inner clarity by keeping it out of harm’s way.",
    "trigramSymbolism": "The sun sinks into the earth: an image of light being injured in a dark time, while its brightness is preserved within.",
    "classical": "Míng Yí means “light is wounded.” The judgment favors steadfastness through hardship. When displaying intelligence invites attack, preserve your inner clarity while appearing outwardly yielding. The reference to Jizi recalls someone who feigned madness to protect his insight.",
    "modern": "There are situations where integrity or ability is not welcomed and visibility brings disadvantage. Do not rush into open confrontation. Do not extinguish your light; shield it. Keep your judgment intact while expressing it carefully. Dark periods need not last forever.",
    "guidance": {
      "work": "When sound reasoning will not be heard, make fewer claims and quietly build your records and abilities.",
      "relationships": "When you are unlikely to be understood, do not disclose everything. Share your inner truth with only a few trusted people.",
      "decision": "For now, ask not “How do I win?” but “How do I avoid being damaged?” What you preserve can support the next phase."
    },
    "judgment": {
      "original": "明夷：利艱貞。",
      "modern": "Darkening of the Light: It is beneficial to remain steadfast through hardship."
    },
    "lines": [
      {
        "original": "初九：明夷于飛，垂其翼。君子于行，三日不食，有攸往，主人有言。",
        "modern": "Nine at the beginning: The wounded light flies with its wings lowered. The capable person leaves, going without food for three days; wherever they go, the host rebukes them."
      },
      {
        "original": "六二：明夷，夷于左股，用拯馬壯，吉。",
        "modern": "Six in the second place: The wounded light injures the left thigh. A strong horse comes to the rescue. Good fortune."
      },
      {
        "original": "九三：明夷于南狩，得其大首，不可疾貞。",
        "modern": "Nine in the third place: Hunting in the south, one captures the chief source of trouble. Do not try to impose correction hastily."
      },
      {
        "original": "六四：入于左腹，獲明夷之心，于出門庭。",
        "modern": "Six in the fourth place: Entering the left side, one understands the mind of the one who wounds the light, then leaves through the gate."
      },
      {
        "original": "六五：箕子之明夷，利貞。",
        "modern": "Six in the fifth place: Like Jizi, keep your clarity hidden amid the darkening. It is beneficial to remain steadfast."
      },
      {
        "original": "上六：不明晦，初登于天，後入于地。",
        "modern": "Six at the top: The light does not shine; darkness prevails. At first one rises to heaven, then falls into the earth."
      }
    ]
  },
  "37": {
    "name": "The Family",
    "chineseName": "家人",
    "pinyin": "Jiā Rén",
    "keywords": [
      "family",
      "putting the inner life in order",
      "roles",
      "substance in words"
    ],
    "essence": "What is nurtured within reaches outward. Put the inner life in order, and its influence can spread naturally beyond it.",
    "trigramSymbolism": "Wind rises from fire: what burns within moves outward and affects the world around it.",
    "classical": "The Family concerns household and close relations. “It is beneficial for the woman to be firm and true” points to the importance of faithfully maintaining the inner order of the household. When each person fulfills their role properly, the household is rightly established, and wider social order can follow. Words should have substance, and conduct should be consistent.",
    "modern": "This is a time to strengthen the foundations of home, daily life, or a team before pursuing outward results. Inner disorder will show itself externally, while inner stability can spread naturally. Clear roles and honest words matter especially among people who are close enough to take one another for granted.",
    "guidance": {
      "work": "Before pushing outward, clarify roles and rebuild trust within the team. Inner commitment becomes outward momentum.",
      "relationships": "Words often become careless with those closest to us. Give family and close companions the same honesty and substance you expect elsewhere.",
      "decision": "When larger external possibilities are confusing, first consider the choice that strengthens your foundations. A secure home base makes further action possible."
    },
    "judgment": {
      "original": "家人：利女貞。",
      "modern": "The Family: It is beneficial for the woman to be firm and true."
    },
    "lines": [
      {
        "original": "初九：閑有家，悔亡。",
        "modern": "Nine at the beginning: Set boundaries and establish household standards from the start. Regret disappears."
      },
      {
        "original": "六二：无攸遂，在中饋，貞吉。",
        "modern": "Six in the second place: Do not insist on having everything your own way. Attend to the household’s nourishment with steadiness; firmness brings good fortune."
      },
      {
        "original": "九三：家人嗃嗃，悔厲吉；婦子嘻嘻，終吝。",
        "modern": "Nine in the third place: If the family is disciplined too harshly, regret and danger may follow, but the outcome can still be good. If wife and children merely joke and laugh, the end will be difficult."
      },
      {
        "original": "六四：富家，大吉。",
        "modern": "Six in the fourth place: Enrich the household. Great good fortune."
      },
      {
        "original": "九五：王假有家，勿恤。吉。",
        "modern": "Nine in the fifth place: The king reaches and orders his household. Do not worry. Good fortune."
      },
      {
        "original": "上九：有孚威如，終吉。",
        "modern": "Nine at the top: With trustworthiness comes natural authority. In the end, good fortune."
      }
    ]
  },
  "38": {
    "name": "Opposition",
    "chineseName": "睽",
    "pinyin": "Kuí",
    "keywords": [
      "mutual estrangement",
      "divergence",
      "start with small matters",
      "the value of difference"
    ],
    "essence": "When people or positions diverge, look for a workable path through their differences. Begin with what can still be shared.",
    "trigramSymbolism": "Fire rises while the lake descends: they occupy one figure yet move in opposite directions. This represents estrangement and misalignment.",
    "classical": "Opposition means turning away or facing one another in conflict. Its judgment says that small matters can succeed: complete agreement is unlikely, but limited cooperation remains possible. The wisdom of Opposition is to recognize a common pattern within difference. As suspicion clears, those who seemed hostile may prove trustworthy.",
    "modern": "This is a situation in which positions or perceptions do not fit together. Trying to force total agreement may make matters worse. Build small agreements one at a time, and look for ways differences can complement each other. Beware of frightening images created by suspicion.",
    "guidance": {
      "work": "With opposing teams or partners, begin with a small practical cooperation rather than demanding agreement on the whole strategy. Results can dissolve mistrust.",
      "relationships": "Some of the discomfort may come from misunderstanding or assumption. Check the facts; what looked threatening may become ordinary and human.",
      "decision": "Favor steady progress on limited matters over major integration or a high-stakes gamble. Consider how to use differences rather than erase them."
    },
    "judgment": {
      "original": "睽：小事吉。",
      "modern": "Opposition: success in small matters."
    },
    "lines": [
      {
        "original": "初九：悔亡，喪馬勿逐，自復；見惡人无咎。",
        "modern": "Regret disappears. If the horse is lost, do not chase it; it will return on its own. Meeting difficult people brings no blame."
      },
      {
        "original": "九二：遇主于巷，无咎。",
        "modern": "Meet the leader in a side street. No blame."
      },
      {
        "original": "六三：見輿曳，其牛掣，其人天且劓，无初有終。",
        "modern": "The cart is dragged back, the ox struggles, and the traveler is disfigured. It begins badly but ends well."
      },
      {
        "original": "九四：睽孤，遇元夫，交孚，厲无咎。",
        "modern": "Alone amid opposition, he meets a worthy person. They exchange trust. The situation is dangerous, but there is no blame."
      },
      {
        "original": "六五：悔亡，厥宗噬膚，往何咎。",
        "modern": "Regret disappears. His own people welcome him as readily as biting tender meat. Going forward brings no blame."
      },
      {
        "original": "上九：睽孤，見豕負涂，載鬼一車，先張之弧，後說之弧，匪寇婚媾，往遇雨則吉。",
        "modern": "Alone amid opposition, he sees a mud-covered pig and a cart loaded with apparent ghosts. He first draws his bow, then lowers it: they are not enemies but potential partners. Going forward and meeting rain brings good fortune."
      }
    ]
  },
  "39": {
    "name": "Obstruction",
    "chineseName": "蹇",
    "pinyin": "Jiǎn",
    "keywords": [
      "stalled progress",
      "obstruction",
      "seeking help",
      "self-reflection"
    ],
    "essence": "When the way ahead is blocked, step back, prepare, and seek support.",
    "trigramSymbolism": "Dangerous water lies before the mountain: moving forward meets danger, while turning back finds steadiness.",
    "classical": "Obstruction describes difficulty in moving forward. Choose the easier direction, avoid the hazardous one, seek the help of a capable person, and remain principled. The lines repeatedly favor returning over forcing progress.",
    "modern": "This is a period when every step seems to meet resistance. Do not force a breakthrough. Choose a simpler route, ask for help, and use the delay to review your position and prepare.",
    "guidance": {
      "work": "Do not carry a difficult problem alone. Consult experienced people; considering a detour is sound planning, not failure.",
      "relationships": "Do not keep forcing a confrontation in a strained relationship. Step back and calmly examine your own part in the difficulty.",
      "decision": "This is not the time to choose the harder path for its own sake. Prefer the simpler, more reliable course."
    },
    "judgment": {
      "original": "蹇：利西南，不利東北；利見大人，貞吉。",
      "modern": "Obstruction. The southwest is favorable; the northeast is unfavorable. It is beneficial to meet a capable person. Keeping to what is right brings good results."
    },
    "lines": [
      {
        "original": "初六：往蹇，來譽。",
        "modern": "Going forward meets obstruction; returning brings respect."
      },
      {
        "original": "六二：王臣蹇蹇，匪躬之故。",
        "modern": "The king’s ministers face repeated obstruction, not for their own sake."
      },
      {
        "original": "九三：往蹇來反。",
        "modern": "Going forward meets obstruction; turn back."
      },
      {
        "original": "六四：往蹇來連。",
        "modern": "Going forward meets obstruction; return and join with others."
      },
      {
        "original": "九五：大蹇朋來。",
        "modern": "In great obstruction, companions come."
      },
      {
        "original": "上六：往蹇來碩，吉；利見大人。",
        "modern": "Going forward meets obstruction; returning brings substantial gains. Good fortune. It is beneficial to meet a capable person."
      }
    ]
  },
  "40": {
    "name": "Deliverance",
    "chineseName": "解",
    "pinyin": "Xiè",
    "keywords": [
      "release",
      "forgiveness",
      "liberation",
      "prompt action"
    ],
    "essence": "Tension is beginning to ease. Return to ordinary life promptly, forgive what can be forgiven, and act quickly where action is still needed.",
    "trigramSymbolism": "Thunder and rain break the oppressive tension in the air. Difficult conditions begin to loosen, creating an opening for release and movement.",
    "classical": "Deliverance means loosening or resolving what has been bound. When hardship has eased, return promptly to normal life; if important work remains, complete it without delay. The wise person follows this pattern by forgiving mistakes and reducing punishment.",
    "modern": "A prolonged strain or difficulty is beginning to unwind. Do not drag the aftermath on indefinitely. Return to ordinary routines, and choose forgiveness over repeated blame. What is ready to loosen can be released now.",
    "guidance": {
      "work": "When a crisis ends, quickly close out the remaining tasks and return to normal operations. Do not carry emergency methods into peaceful conditions.",
      "relationships": "When reconciliation becomes possible, offer forgiveness before reopening the entire record of past wrongs. Rehashing everything may tighten the knot again.",
      "decision": "List what you no longer need to hold: attachments, outdated roles, and finished matters. Release them promptly."
    },
    "judgment": {
      "original": "解：利西南，无所往，其來復吉。有攸往，夙吉。",
      "modern": "Deliverance. The southwest is favorable. If there is nowhere to go, return and it will be fortunate. If there is somewhere to go, set out early and it will be fortunate."
    },
    "lines": [
      {
        "original": "初六：无咎。",
        "modern": "No blame."
      },
      {
        "original": "九二：田獲三狐，得黃矢，貞吉。",
        "modern": "In the hunt, three foxes are caught and a yellow arrow is gained. Persistence in what is right brings good fortune."
      },
      {
        "original": "六三：負且乘，致寇至，貞吝。",
        "modern": "Carrying a burden while riding in a carriage invites robbers. Even persistence brings difficulty."
      },
      {
        "original": "九四：解而拇，朋至斯孚。",
        "modern": "Release what clings like a thumb. Then true companions will come, bound by trust."
      },
      {
        "original": "六五：君子維有解，吉；有孚于小人。",
        "modern": "When the noble person brings about deliverance, it is fortunate. Even lesser people respond to that trust."
      },
      {
        "original": "上六：公用射隼，于高墉之上，獲之，无不利。",
        "modern": "A lord shoots a hawk from the top of a high wall and captures it. Nothing is unfavorable."
      }
    ]
  },
  "41": {
    "name": "Decrease",
    "chineseName": "損",
    "pinyin": "Sǔn",
    "keywords": [
      "Gain through letting go",
      "Release",
      "Simplicity",
      "Sincerity"
    ],
    "essence": "Decrease can create increase. What is willingly given up may strengthen what matters most.",
    "trigramSymbolism": "The lake gives up its water to nourish and raise the mountain: lower strength is reduced so higher strength can grow.",
    "classical": "Decrease means reducing. With trust and sincerity, it brings great good fortune and no blame, and one may proceed rightly. Even a simple offering of two bowls is enough for a sincere ceremony. A wise person uses decrease to restrain anger and desire.",
    "modern": "A time may come when reducing, yielding, or giving something up serves the greater good. Money, time, or pride may be surrendered, but sincere restraint can build lasting trust. Simplicity may be the right form of abundance.",
    "guidance": {
      "work": "Accept a short-term cost when it protects quality and trust. Long-term benefit may first appear as a sacrifice.",
      "relationships": "Yield where you can without resentment. People who accept small costs for others often earn deeper trust.",
      "decision": "Instead of asking only what you will gain, ask what you are willing to release. That may clarify the choice."
    },
    "judgment": {
      "original": "損：有孚，元吉。无咎，可貞，利有攸往。曷之用？二簋可用享。",
      "modern": "With sincerity, decrease brings great good fortune and no blame. It is right to remain principled and to proceed. Even two simple bowls are enough as an offering."
    },
    "lines": [
      {
        "original": "初九：已事遄往，无咎，酌損之。",
        "modern": "After finishing the task, go promptly to help. There is no blame; reduce only what is appropriate."
      },
      {
        "original": "九二：利貞，征凶，弗損益之。",
        "modern": "It is favorable to remain principled. Advancing brings trouble. Do not diminish yourself; use your strength to benefit others."
      },
      {
        "original": "六三：三人行，則損一人；一人行，則得其友。",
        "modern": "When three people travel together, one is lost; when one travels alone, a companion is found."
      },
      {
        "original": "六四：損其疾，使遄有喜，无咎。",
        "modern": "Reduce the illness so it is quickly relieved and brings joy. There is no blame."
      },
      {
        "original": "六五：或益之，十朋之龜弗克違，元吉。",
        "modern": "Benefits may come so decisively that even ten sets of tortoise shells could not contradict them. Great good fortune."
      },
      {
        "original": "上九：弗損益之，无咎，貞吉，利有攸往，得臣无家。",
        "modern": "Do not diminish yourself; benefit others. There is no blame, and principled action brings good fortune. Proceed, and gain devoted support beyond narrow personal ties."
      }
    ]
  },
  "42": {
    "name": "Increase",
    "chineseName": "益",
    "pinyin": "Yì",
    "keywords": [
      "increase",
      "favorable momentum",
      "time to act",
      "sharing benefits"
    ],
    "essence": "When resources and support are increasing, move forward and let the gains circulate.",
    "trigramSymbolism": "Wind and thunder strengthen one another. Those above give up some of their own advantage to benefit those below, allowing goodwill to spread.",
    "classical": "Increase means making something greater. The Judgment favors having somewhere to go and crossing a great river. This is a time for purposeful action, generosity, recognizing good, and correcting mistakes.",
    "modern": "Conditions are supportive, and effort can produce growing returns. Act rather than miss the opportunity, but plan how the benefits will be shared. Generosity helps momentum spread.",
    "guidance": {
      "work": "A good time to invest, take on a challenge, or expand. If you cross an important threshold, include a fair plan for distributing the gains.",
      "relationships": "Pass benefits and kindness onward. Support given to others can strengthen the whole network.",
      "decision": "If a major step has been waiting, act when the conditions are genuinely ready. Move promptly toward what you recognize as good."
    },
    "judgment": {
      "original": "益：利有攸往。利涉大川。",
      "modern": "Increase: It is favorable to have somewhere to go. It is favorable to cross a great river."
    },
    "lines": [
      {
        "original": "初九：利用為大作，元吉，无咎。",
        "modern": "Nine at the beginning: It is favorable to undertake major work. Great good fortune, with no blame."
      },
      {
        "original": "六二：或益之，十朋之龜弗克違，永貞吉。王用享于帝，吉。",
        "modern": "Six in the second place: Someone brings an increase. Even the ten sets of tortoise shells could not contradict it. Lasting correctness brings good fortune. When the king makes an offering to the Supreme Being, there is good fortune."
      },
      {
        "original": "六三：益之用凶事，无咎。有孚中行，告公用圭。",
        "modern": "Six in the third place: Use the increase to address a crisis; there is no blame. With sincere trust, follow the middle way and report to the authority, presenting the jade tablet."
      },
      {
        "original": "六四：中行，告公從。利用為依遷國。",
        "modern": "Six in the fourth place: Follow the middle way and report to the authority; your proposal will be followed. It is favorable for a major undertaking, such as moving a capital."
      },
      {
        "original": "九五：有孚惠心，勿問元吉。有孚惠我德。",
        "modern": "Nine in the fifth place: With sincere trust and a generous heart, there is no need to ask; great good fortune. Those who trust in sincerity respond to my good influence."
      },
      {
        "original": "上九：莫益之，或擊之，立心勿恆，凶。",
        "modern": "Nine at the top: No one increases him; some may even attack him. If his resolve is not steady, the outcome is bad."
      }
    ]
  },
  "43": {
    "name": "Breakthrough",
    "chineseName": "夬",
    "pinyin": "Guài",
    "keywords": [
      "decision",
      "removal",
      "public disclosure",
      "not relying on force"
    ],
    "essence": "A time to make a clear decision and remove what no longer belongs, openly and without private self-interest.",
    "trigramSymbolism": "Water gathers in a lake until it rises toward the sky, reaching the point of breaking through. What has accumulated must be cut open and released.",
    "classical": "Breakthrough means separating or cutting away. Five firm lines move against the last yielding line, calling for decisive action. The judgment says to make the matter known at the ruler’s court and proclaim it with sincerity, while recognizing the danger. Resorting to force is not favorable.",
    "modern": "An ambiguous problem now needs a definite resolution. Act openly, do not underestimate the risks, and avoid coercion. Even what seems small should not be ignored. The final step especially requires sound procedure.",
    "guidance": {
      "work": "Address problems or end a system publicly, explaining the reasons rather than relying on private maneuvering. Transparency is your strongest protection.",
      "relationships": "If you must end a connection or step down from a role, make it a calm, clear statement rather than an emotional condemnation.",
      "decision": "The need to decide is clear. The remaining question is how to bring the matter to a dignified conclusion."
    },
    "judgment": {
      "original": "夬：揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。",
      "modern": "Make the matter known at the ruler’s court and proclaim it with sincere conviction. Danger remains. Inform your own community first. Do not resort to arms; it is favorable to move toward a clear objective."
    },
    "lines": [
      {
        "original": "初九：壯于前趾，往不勝為咎。",
        "modern": "Strength in the forward toes: advancing without the strength to prevail brings blame."
      },
      {
        "original": "九二：惕號，莫夜有戎，勿恤。",
        "modern": "Stay alert and raise the warning. Even if armed trouble comes in the night, do not be distressed."
      },
      {
        "original": "九三：壯于頄，有凶。君子夬夬，獨行遇雨，若濡有慍，无咎。",
        "modern": "Force showing in the cheekbones brings danger. A principled person makes the necessary decision, goes alone and meets the rain; even if soaked and angered, there is no blame."
      },
      {
        "original": "九四：臀无膚，其行次且。牽羊悔亡，聞言不信。",
        "modern": "The buttocks are chafed and movement is hesitant. Let yourself be led like a sheep and regret will disappear, but you refuse to heed what you hear."
      },
      {
        "original": "九五：莧陸夬夬，中行无咎。",
        "modern": "Cut away the spreading weed decisively. Following the middle way brings no blame."
      },
      {
        "original": "上六：无號，終有凶。",
        "modern": "There is no warning cry, and in the end danger comes."
      }
    ]
  },
  "44": {
    "name": "Coming to Meet",
    "chineseName": "姤",
    "pinyin": "Gòu",
    "keywords": [
      "unexpected encounter",
      "signals not to dismiss",
      "discernment",
      "boundaries"
    ],
    "essence": "An unexpected influence has appeared. Notice it early, and do not let it grow beyond your judgment.",
    "trigramSymbolism": "Wind moves beneath Heaven, reaching everywhere and encountering everything. This suggests an unforeseen meeting or influence.",
    "classical": "Coming to Meet: one yielding line appears beneath five strong lines, representing a sudden encounter. The Judgment warns that what seems small may carry powerful momentum, so it should not be joined to too deeply. As the first line is fastened to a metal brake, early signs are easiest to contain.",
    "modern": "An unplanned meeting, proposal, or change is emerging. Meeting it is natural, like wind passing through the world, but do not rush into commitment before seeing what it may become. Encourage sound beginnings and address dangerous ones while they are still small.",
    "guidance": {
      "work": "Examine an unsolicited opportunity, especially when it seems attractive. Small warning signs are easiest to see at the beginning.",
      "relationships": "Slow the pace with anyone who moves quickly to close the distance. Time is the most reliable test.",
      "decision": "Whether to pursue or decline a chance encounter depends less on momentum than on whether you can imagine a sound outcome."
    },
    "judgment": {
      "original": "姤：女壯，勿用取女。",
      "modern": "A powerful woman appears; do not marry her."
    },
    "lines": [
      {
        "original": "初六：系于金柅，貞吉，有攸往，見凶，羸豕孚踟躅。",
        "modern": "Tie it to a metal brake. Correct restraint brings good fortune. If you proceed, danger appears; even the lean pig may yet struggle free."
      },
      {
        "original": "九二：包有魚，无咎，不利賓。",
        "modern": "The包 contains fish. There is no blame, but do not serve it to guests."
      },
      {
        "original": "九三：臀无膚，其行次且，厲，无大咎。",
        "modern": "The buttocks have no skin; movement is labored. Danger, but no major blame."
      },
      {
        "original": "九四：包无魚，起凶。",
        "modern": "The包 contains no fish. Disaster begins."
      },
      {
        "original": "九五：以杞包瓜，含章，有隕自天。",
        "modern": "Use the leaves of the catalpa to wrap the melon. Keep its inner quality concealed; something may fall from Heaven."
      },
      {
        "original": "上九：姤其角，吝，无咎。",
        "modern": "Meet it at the horns. This is limiting, but there is no blame."
      }
    ]
  },
  "45": {
    "name": "Gathering Together",
    "chineseName": "萃",
    "pinyin": "Cuì",
    "keywords": [
      "gathering",
      "convergence",
      "center",
      "preparedness"
    ],
    "essence": "When people and resources gather, a clear purpose and preparation are needed.",
    "trigramSymbolism": "Water gathers in a low place above the earth: people and resources converge in one place.",
    "classical": "Cui means gathering together. The judgment says that a gathering can succeed, but it needs a meaningful center and capable leadership. It also calls for practical preparation, since gatherings can bring unexpected conflict as well as support.",
    "modern": "People, resources, or attention are concentrating around an opportunity. Gathering is promising, but it needs both a clear center and safeguards against friction and unforeseen problems.",
    "guidance": {
      "work": "As a team or project grows, clarify its purpose and establish workable rules at the same time. A gathering left unmanaged becomes confused.",
      "relationships": "If you are at the center of a group, remain direct and sincere. When the center wavers, the whole group becomes unsettled.",
      "decision": "Expansion may be timely, but prepare the structure to receive it first. Do not increase scale faster than capacity."
    },
    "judgment": {
      "original": "萃：亨。王假有廟，利見大人，亨。利貞。用大牲吉，利有攸往。",
      "modern": "Gathering together can succeed. The ruler goes to the ancestral temple. It is beneficial to meet a great person, and success follows. Perseverance in what is right is beneficial. Offering a substantial sacrifice brings good fortune. Going forward is beneficial."
    },
    "lines": [
      {
        "original": "初六：有孚不終，乃亂乃萃，若號一握為笑，勿恤，往无咎。",
        "modern": "Initial trust does not last, and people gather amid confusion. A cry of alarm may turn into laughter in an instant. Do not worry; going forward brings no blame."
      },
      {
        "original": "六二：引吉，无咎，孚乃利用禴。",
        "modern": "Being drawn together brings good fortune and no blame. With sincere devotion, even a simple offering is enough."
      },
      {
        "original": "六三：萃如，嗟如，无攸利，往无咎，小吝。",
        "modern": "People try to gather, but lament. Nothing is favorable yet; still, going forward brings no blame. There is some frustration."
      },
      {
        "original": "九四：大吉，无咎。",
        "modern": "Great good fortune and no blame."
      },
      {
        "original": "九五：萃有位，无咎。匪孚，元永貞，悔亡。",
        "modern": "Gathering around a position of authority brings no blame. If some remain unconvinced, show them steadfast integrity over time; regret will disappear."
      },
      {
        "original": "上六：齎咨涕洟，无咎。",
        "modern": "Sighing and weeping: the sorrow of being left outside the gathering. There is no blame."
      }
    ]
  },
  "46": {
    "name": "Pushing Upward",
    "chineseName": "升",
    "pinyin": "Shēng",
    "keywords": [
      "rising",
      "steady growth",
      "building step by step",
      "earning trust"
    ],
    "essence": "A tree grows upward from the earth: progress comes one step at a time.",
    "trigramSymbolism": "Wood rises from within the earth. Its growth is not dramatic, but it is steady and sure—the image of advancement built layer by layer.",
    "classical": "Sheng means “to rise.” The judgment encourages wholehearted progress: seek the guidance of a capable person, do not worry, and move toward the light. Like a tree’s growth, genuine advancement comes through accumulated effort rather than sudden leaps.",
    "modern": "Your efforts can build naturally into visible progress. This is a time for steady advancement, not dramatic shortcuts. Change may be hard to notice at first, but the gains become clear over time. Advice from a trustworthy mentor can help you rise more effectively.",
    "guidance": {
      "work": "Consistent results are likely to lead to recognition. Build your record rather than searching for shortcuts.",
      "relationships": "Trust grows through repeated small acts of reliability. Keeping your promises is the surest way to strengthen a bond.",
      "decision": "If you are choosing between steady development and a risky breakthrough, favor the steady path. Include rest in your plan so progress can continue."
    },
    "judgment": {
      "original": "升：元亨，用見大人，勿恤，南征吉。",
      "modern": "Great success. Seek the guidance of a capable person; do not worry. Advancing toward the light brings good fortune."
    },
    "lines": [
      {
        "original": "初六：允升，大吉。",
        "modern": "You are trusted and rise with support. Very good fortune."
      },
      {
        "original": "九二：孚乃利用禴，无咎。",
        "modern": "Sincerity is enough; even a simple offering is acceptable. No blame."
      },
      {
        "original": "九三：升虛邑。",
        "modern": "You rise into an open place, meeting no obstruction."
      },
      {
        "original": "六四：王用亨于岐山，吉无咎。",
        "modern": "The king makes an offering at Mount Qi. Good fortune and no blame."
      },
      {
        "original": "六五：貞吉，升階。",
        "modern": "Correct conduct brings good fortune. Rise step by step."
      },
      {
        "original": "上六：冥升，利于不息之貞。",
        "modern": "Rising in the dark can lead astray. It is beneficial to maintain an unceasing commitment to what is right."
      }
    ]
  },
  "47": {
    "name": "Oppression",
    "chineseName": "困",
    "pinyin": "Kùn",
    "keywords": [
      "hardship",
      "words not believed",
      "integrity",
      "inner strength"
    ],
    "essence": "Even in hardship, do not lose your purpose. Outer deprivation does not have to drain your inner strength.",
    "trigramSymbolism": "Water has drained from the lake below, leaving it dry. The image suggests that although conditions are barren outside, a hidden source of strength remains within.",
    "classical": "Oppression means suffering or constraint. The judgment says that the way remains open when integrity is maintained; a person of inner stature succeeds without blame, though their words are not believed. In such a time, action is stronger than explanation. Give yourself fully to the purpose you can still uphold.",
    "modern": "Resources are scarce, understanding is lacking, and whatever you say is discounted. The more you argue, the more credibility may slip away. Stop trying to persuade everyone; let steady action and results speak. Hardship can restrict your circumstances without taking away your purpose.",
    "guidance": {
      "work": "When recognition is absent, leave solid work behind rather than adding explanations. Records last longer than claims.",
      "relationships": "Do not keep defending yourself to someone who will not hear you. Let time and conduct clarify matters while you preserve your dignity.",
      "decision": "Ask which choice allows you to protect what matters most. A path that merely offers quick relief may cost more later."
    },
    "judgment": {
      "original": "困：亨，貞大人吉，无咎，有言不信。",
      "modern": "Oppression: Progress is possible. With integrity, a person of inner strength finds good fortune and avoids blame. Words may be spoken but will not be believed."
    },
    "lines": [
      {
        "original": "初六：臀困于株木，入于幽谷，三歲不覿。",
        "modern": "Six at the beginning: Oppressed while sitting on a tree stump, one enters a dark valley and is unseen for three years."
      },
      {
        "original": "九二：困于酒食，朱紱方來，利用亨祀，征凶，无咎。",
        "modern": "Nine in the second place: Oppressed through drink and food; a red-clad dignitary is on the way. It is useful to make an offering. Advancing brings misfortune, but there is no blame."
      },
      {
        "original": "六三：困于石，據于蒺藜，入于其宮，不見其妻，凶。",
        "modern": "Six in the third place: Oppressed by a rock and leaning against thorns. Entering the home, one does not see one's wife. Misfortune."
      },
      {
        "original": "九四：來徐徐，困于金車，吝，有終。",
        "modern": "Nine in the fourth place: One comes slowly, oppressed by a carriage of metal. The situation is difficult, but there is an ending."
      },
      {
        "original": "九五：劓刖，困于赤紱，乃徐有說，利用祭祀。",
        "modern": "Nine in the fifth place: With the nose cut and the feet severed, one is oppressed by a red-clad minister. Relief and gladness come gradually. It is useful to make an offering."
      },
      {
        "original": "上六：困于葛藟，于臲卼，曰動悔。有悔，征吉。",
        "modern": "Six at the top: Entangled in vine tendrils and wobbling dangerously, one says that movement will bring regret. Regret the mistake, change course, and advancing becomes fortunate."
      }
    ]
  },
  "48": {
    "name": "The Well",
    "chineseName": "井",
    "pinyin": "Jǐng",
    "keywords": [
      "well",
      "enduring source",
      "maintenance",
      "sharing"
    ],
    "essence": "A town may change, but its well remains. Care for the source that sustains people, and make it accessible to all.",
    "trigramSymbolism": "Wood, like a bucket or lifting device, draws water upward. Communities change, but the well continues to provide from its settled place.",
    "classical": "The Well means that changing the settlement does not change the well: there is neither loss nor gain. Yet even a cleaned well is useless if no one draws from it. A lasting source requires both maintenance and a way for people to use it.",
    "modern": "This is a time to care for what remains foundational: skills, values, health, reliable systems, or habits of learning. Trends may change, but a source must be kept clear and made accessible. Prepare it so everyone can draw from it and contribute to its renewal.",
    "guidance": {
      "work": "Invest in foundations such as documentation, systems, and basic skills. They create value only when everyone can use them.",
      "relationships": "To remain dependable, maintain your own reserves. Those who give also need regular replenishment.",
      "decision": "When changing your circumstances, first identify the enduring source you must preserve and carry forward."
    },
    "judgment": {
      "original": "井：改邑不改井，无喪无得，往來井井。汔至亦未繘井。羸其瓶，凶。",
      "modern": "The town changes, but not the well. Nothing is lost and nothing is gained; people come and go, each drawing from the well. If the rope falls short just as the water is reached and the jar breaks, that is harmful."
    },
    "lines": [
      {
        "original": "初六：井泥不食，舊井无禽。",
        "modern": "A muddy well cannot be used for drinking; an abandoned well attracts no birds."
      },
      {
        "original": "九二：井谷射鮒，瓮敝漏。",
        "modern": "Fish are shot at in the well’s lower channel; the jar is worn out and leaks."
      },
      {
        "original": "九三：井渫不食，為我心惻，可用汲，王明，并受其福。",
        "modern": "The well has been cleared, yet no one drinks from it. My heart aches. It could be drawn from; if the ruler were wise, all would share its benefit."
      },
      {
        "original": "六四：井甃，无咎。",
        "modern": "The inner walls of the well are repaired. No blame."
      },
      {
        "original": "九五：井冽，寒泉食。",
        "modern": "The well is clean, and its cold spring water is fit to drink."
      },
      {
        "original": "上六：井收勿幕，有孚元吉。",
        "modern": "The well is drawn from without being covered. With sincere trust, there is great good fortune."
      }
    ]
  },
  "49": {
    "name": "Revolution",
    "chineseName": "革",
    "pinyin": "Gé",
    "keywords": [
      "transformation",
      "renewal",
      "right timing",
      "earned trust"
    ],
    "essence": "A time for fundamental change, but only when the moment is ripe and people can trust it.",
    "trigramSymbolism": "Fire within the lake: opposing forces consume and remake what is old. This image suggests transformation.",
    "classical": "革 means “to change or reform.” The judgment says that only when the appointed day has arrived will the change be trusted; then it can proceed fully, if it remains right. As the seasons change in their proper order, sound reform must arise from necessity and readiness. The tiger and leopard images suggest a striking renewal of appearance and conduct.",
    "modern": "This is a moment to reconsider an old system at its roots. Success depends not only on the proposal but on timing and credibility. Acting before preparation is complete invites resistance; repeated, unsupported demands win no one over. Build support carefully, then act decisively.",
    "guidance": {
      "work": "Support a reform plan with preparation and evidence, then move decisively when the time is right. Repeated half-measures erode trust.",
      "relationships": "To rebuild a relationship, change your conduct before making declarations. Conversation carries further once the change is credible.",
      "decision": "When change is necessary, pursue it consistently, but choose the right moment to begin. Identify when the appointed day has arrived."
    },
    "judgment": {
      "original": "革：巳日乃孚，元亨。利貞。悔亡。",
      "modern": "Reform: when the appointed day arrives, trust is established. Great progress is possible. It is beneficial to remain true to what is right. Regret disappears."
    },
    "lines": [
      {
        "original": "初九：鞏用黃牛之革。",
        "modern": "Nine at the beginning: Bind it firmly with the hide of a yellow ox."
      },
      {
        "original": "六二：巳日乃革之，征吉，无咎。",
        "modern": "Six in the second place: When the appointed day arrives, make the change. Advancing is fortunate; there is no blame."
      },
      {
        "original": "九三：征凶，貞厲，革言三就，有孚。",
        "modern": "Nine in the third place: Advancing hastily brings misfortune. Even with right intentions, danger remains. When the case for change has been considered three times and brought to completion, trust is possible."
      },
      {
        "original": "九四：悔亡，有孚改命，吉。",
        "modern": "Nine in the fourth place: Regret disappears. With trust, change the mandate. Good fortune."
      },
      {
        "original": "九五：大人虎變，未占有孚。",
        "modern": "Nine in the fifth place: The great person changes like a tiger, with a clear and compelling effect. Trust is present without needing to consult an oracle."
      },
      {
        "original": "上六：君子豹變，小人革面，征凶，居貞吉。",
        "modern": "Six at the top: The exemplary person changes like a leopard; lesser people change their faces. Advancing further brings misfortune. Remaining firmly in what is right brings good fortune."
      }
    ]
  },
  "50": {
    "name": "The Cauldron",
    "chineseName": "鼎",
    "pinyin": "Dǐng",
    "keywords": [
      "The Cauldron",
      "new form",
      "nourishing capable people",
      "stable vessel"
    ],
    "essence": "The Cauldron transforms what is raw into nourishment. Establish a sound vessel that can support and develop people.",
    "trigramSymbolism": "Wood above fire: the Cauldron cooks and nourishes. After a period of upheaval, a new form is established.",
    "classical": "The Cauldron is a three-legged vessel for cooking. It represents turning reform into a stable system that can nourish capable people. Raw ingredients become food, and change becomes lasting support. If one leg is missing, the vessel falls.",
    "modern": "The destructive phase is over; now a new system must be established and made reliable. Stability requires several supporting pillars rather than dependence on one person. The purpose of the new structure is not merely efficient operation, but the growth and well-being of the people within it.",
    "guidance": {
      "work": "Build the new system on several strong supports. A structure dependent on one person is like a cauldron with a broken leg.",
      "relationships": "As a new environment or relationship takes shape, look beyond appearances. Ask whether it truly supports the people involved.",
      "decision": "The decision to dismantle has been made. Now choose what can serve as a durable vessel for the future."
    },
    "judgment": {
      "original": "鼎：元吉，亨。",
      "modern": "The Cauldron: great good fortune and progress."
    },
    "lines": [
      {
        "original": "初六：鼎顛趾，利出否，得妾以其子，无咎。",
        "modern": "The Cauldron is turned upside down, raising its legs, so the old residue can be removed. It is like taking a concubine and gaining a son through her. No blame."
      },
      {
        "original": "九二：鼎有實，我仇有疾，不我能即，吉。",
        "modern": "The Cauldron contains food. An opponent may be hostile, but cannot approach or harm me. Good fortune."
      },
      {
        "original": "九三：鼎耳革，其行塞，雉膏不食，方雨虧悔，終吉。",
        "modern": "The Cauldron’s handles have changed, so it cannot be lifted. The rich pheasant broth goes uneaten. When rain comes, regret is reduced; in the end, good fortune."
      },
      {
        "original": "九四：鼎折足，覆公餗，其形渥，凶。",
        "modern": "The Cauldron’s leg breaks, spilling the ruler’s meal and soiling its contents. Misfortune: the person cannot bear the responsibility entrusted to them."
      },
      {
        "original": "六五：鼎黃耳金鉉，利貞。",
        "modern": "The Cauldron has yellow handles and bronze crossbars. It is favorable to remain principled."
      },
      {
        "original": "上九：鼎玉鉉，大吉，无不利。",
        "modern": "The Cauldron has jade crossbars. Great good fortune; nothing is unfavorable."
      }
    ]
  },
  "51": {
    "name": "The Arousing Thunder",
    "chineseName": "震",
    "pinyin": "Zhèn",
    "keywords": [
      "upheaval",
      "shock",
      "alertness",
      "inner steadiness"
    ],
    "essence": "Thunder strikes again and again. Stay grounded while surprise shakes everything.",
    "trigramSymbolism": "Thunder over thunder: repeated shocks stir everything, bringing both alarm and renewed energy.",
    "classical": "Zhen means shaking or arousing. Thunder may frighten people far away, yet the ritual leader does not drop the ladle or spill the wine. Careful attention in a crisis can turn shock into a constructive response.",
    "modern": "Sudden news, change, or disruption can unsettle you. Be startled if you must, but do not drop what matters most. Shock can reveal weaknesses that need attention.",
    "guidance": {
      "work": "During sudden change, keep essential duties moving. Calm, practical action builds trust.",
      "relationships": "Do not answer startling news immediately. Pause, then reply in words you will still respect later.",
      "decision": "Avoid major decisions at the height of shock, but repair any weakness the disruption exposes without delay."
    },
    "judgment": {
      "original": "震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。",
      "modern": "Success. When thunder comes, people tremble in alarm, then recover their laughter. The thunder startles a hundred miles around, yet the ritual leader does not drop the ladle or spill the wine."
    },
    "lines": [
      {
        "original": "初九：震來虩虩，後笑言啞啞，吉。",
        "modern": "When thunder comes, there is fearful trembling; afterward, laughter returns. Recognizing fear and remaining steady brings good fortune."
      },
      {
        "original": "六二：震來厲，億喪貝，躋于九陵，勿逐，七日得。",
        "modern": "Thunder brings danger. Expecting to lose your valuables, climb to high ground. Do not chase after them; they will be recovered after seven days."
      },
      {
        "original": "六三：震蘇蘇，震行无眚。",
        "modern": "Thunder leaves you restless and uneasy. Move forward with care, and no misfortune will result."
      },
      {
        "original": "九四：震遂泥。",
        "modern": "Thunder sinks into mud and loses its force."
      },
      {
        "original": "六五：震往來厲，億无喪，有事。",
        "modern": "Thunder comes and goes, bringing danger. Yet nothing essential is lost, and the work can still be carried out."
      },
      {
        "original": "上六：震索索，視矍矍，征凶。震不于其躬，于其鄰，无咎。婚媾有言。",
        "modern": "Thunder leaves you shaking and wide-eyed. Advancing brings misfortune. If the warning reaches your neighbor rather than you, and you take heed, there is no blame. A marriage proposal may bring complaints."
      }
    ]
  },
  "52": {
    "name": "The Keeping Still Mountain",
    "chineseName": "艮",
    "pinyin": "Gèn",
    "keywords": [
      "stopping",
      "stillness",
      "composure",
      "knowing when to pause"
    ],
    "essence": "Mountain rests upon mountain: stop where stopping is called for. Stillness is not retreat; it is a way to quiet haste, craving, and comparison.",
    "trigramSymbolism": "Mountain above mountain: solid layers that do not move, representing stability and stillness.",
    "classical": "艮 means “to stop.” The judgment describes stopping at the back, beyond self-conscious grasping; walking through the courtyard without being caught up in others. It praises acting and pausing in response to the time, rather than forcing either one.",
    "modern": "Pause the momentum and recover quiet. Give thoughts their proper place so they do not disturb the mind.",
    "guidance": {
      "work": "Before adding a new initiative, pause to review what is already under way. Stopping can be the most overlooked strategic move.",
      "relationships": "Choose deliberately not to react or interfere. You are not obliged to respond to everything.",
      "decision": "Deciding not to decide yet can be wise. Set a time to review the matter so that pausing does not become stagnation."
    },
    "judgment": {
      "original": "艮：艮其背，不獲其身，行其庭，不見其人，无咎。",
      "modern": "Stop at the back, without grasping at the self. Walk in the courtyard without noticing anyone. No blame."
    },
    "lines": [
      {
        "original": "初六：艮其趾，无咎，利永貞。",
        "modern": "Stop at the toes. Stopping at the outset brings no blame; constancy in what is right is beneficial."
      },
      {
        "original": "六二：艮其腓，不拯其隨，其心不快。",
        "modern": "Stop at the calves. Unable to halt what follows above, the heart is troubled."
      },
      {
        "original": "九三：艮其限，列其夤，厲薰心。",
        "modern": "Stop at the waist; the back muscles strain apart. Danger burns into the heart."
      },
      {
        "original": "六四：艮其身，无咎。",
        "modern": "Stop with the body. No blame."
      },
      {
        "original": "六五：艮其輔，言有序，悔亡。",
        "modern": "Stop at the jaw. Let speech be orderly, and regret disappears."
      },
      {
        "original": "上九：敦艮，吉。",
        "modern": "Stop with deep sincerity. Good fortune."
      }
    ]
  },
  "53": {
    "name": "Development",
    "chineseName": "漸",
    "pinyin": "Jiàn",
    "keywords": [
      "gradual progress",
      "following proper steps",
      "steady growth",
      "marriage rites"
    ],
    "essence": "Move forward step by step, building a secure foundation rather than rushing ahead.",
    "trigramSymbolism": "A tree growing on a mountain rises slowly, adding strength year by year while enduring wind and snow. It represents progress that follows a natural sequence.",
    "classical": "Jiàn means to advance gradually. The judgment says that a woman’s marriage is fortunate when the proper rites and stages are followed, and that steadfastness is beneficial. The lines picture a wild goose moving from the shore to a rock, land, a tree, a hill, and finally the high sky, marking successive stages of development.",
    "modern": "This is a time to proceed without haste or shortcuts. Although careful procedure may seem slow, each secure step becomes a lasting resource. Check the order of progress and the ground beneath you before moving on.",
    "guidance": {
      "work": "Whether seeking promotion or building a venture, skipped stages will later need repair. Make the present stage solid.",
      "relationships": "Relationships deepen at their own pace. Skipping the steps that build trust leaves the foundation weak.",
      "decision": "When an immediate leap competes with a gradual option, the gradual path has the advantage. Decide only the next step if that is enough."
    },
    "judgment": {
      "original": "漸：女歸吉，利貞。",
      "modern": "A woman’s marriage is fortunate when the proper stages are followed. Steadfastness is beneficial."
    },
    "lines": [
      {
        "original": "初六：鴻漸于干，小子厲，有言，无咎。",
        "modern": "The wild goose reaches the shore. A young person faces danger and criticism, but there is no blame."
      },
      {
        "original": "六二：鴻漸于磐，飲食衎衎，吉。",
        "modern": "The wild goose reaches the rock. There is peaceful enjoyment of food and drink. Good fortune."
      },
      {
        "original": "九三：鴻漸于陸，夫征不復，婦孕不育，凶；利禦寇。",
        "modern": "The wild goose reaches the land. The husband goes out and does not return; the wife becomes pregnant but cannot bring the child to birth. Misfortune. It is beneficial to guard against attackers."
      },
      {
        "original": "六四：鴻漸于木，或得其桷，无咎。",
        "modern": "The wild goose reaches a tree. If it finds a level branch, there is no blame."
      },
      {
        "original": "九五：鴻漸于陵，婦三歲不孕，終莫之勝，吉。",
        "modern": "The wild goose reaches a hill. The wife does not conceive for three years, yet in the end nothing overcomes her. Good fortune."
      },
      {
        "original": "上九：鴻漸于陸，其羽可用為儀，吉。",
        "modern": "The wild goose reaches the high sky. Its feathers can serve as ceremonial adornment. Good fortune."
      }
    ]
  },
  "54": {
    "name": "The Marrying Maiden",
    "chineseName": "歸妹",
    "pinyin": "Guī Mèi",
    "keywords": [
      "disordered sequence",
      "a subordinate position",
      "knowing one's place",
      "taking the long view"
    ],
    "essence": "Thunder moves the lake: when a relationship or undertaking begins out of balance, proceed with restraint and patience.",
    "trigramSymbolism": "Thunder sounds above the lake, while the young lake is moved by forces acting on it. This suggests a bond formed without proper order or balance.",
    "classical": "The Marrying Maiden symbolizes a marriage arranged without the usual procedure or proper balance. Its warning against advancing is severe, but it guides conduct that recognizes and corrects the distortion rather than declaring the situation hopeless. Connection remains a necessary human good, yet it must be handled with care.",
    "modern": "Something has begun under unequal, irregular, or poorly balanced conditions. Pretending that the parties are equal and demanding recognition at once may cause it to collapse. Accept the present limits, lower inflated expectations, and build trust over time; even unconventional beginnings can become sound relationships.",
    "guidance": {
      "work": "If a job began under disappointing conditions, fulfill your role without bitterness. Accumulated results, more than status claims, can improve your position.",
      "relationships": "If a relationship is unequal, do not force equality immediately. Give time and steady conduct a chance to create better balance.",
      "decision": "Before starting something new now, examine its conditions and balance more strictly than usual."
    },
    "judgment": {
      "original": "歸妹：征凶，无攸利。",
      "modern": "The Marrying Maiden. Advancing brings misfortune. Nothing is beneficial."
    },
    "lines": [
      {
        "original": "初九：歸妹以娣，跛能履，征吉。",
        "modern": "The Marrying Maiden is given as a secondary wife. Though lame, she can walk; advancing in this limited role brings good fortune."
      },
      {
        "original": "九二：眇能視，利幽人之貞。",
        "modern": "One-eyed, she can still see. The steadfastness of a person who keeps quietly apart is beneficial."
      },
      {
        "original": "六三：歸妹以須，反歸以娣。",
        "modern": "She waits to marry, but in the end marries as a secondary wife."
      },
      {
        "original": "九四：歸妹愆期，遲歸有時。",
        "modern": "The marriage misses its proper time. A delayed marriage may still come when its time arrives."
      },
      {
        "original": "六五：帝乙歸妹，其君之袂，不如其娣之袂良，月幾望，吉。",
        "modern": "King Yi gives his younger sister in marriage. The ruler's sleeves are less fine than those of his secondary wife. The moon is nearly full. Good fortune."
      },
      {
        "original": "上六：女承筐无實，士刲羊无血，无攸利。",
        "modern": "The woman offers an empty basket; the man cuts the sheep, but no blood flows. Nothing is beneficial."
      }
    ]
  },
  "55": {
    "name": "Abundance",
    "chineseName": "豐",
    "pinyin": "Fēng",
    "keywords": [
      "abundance",
      "fullness",
      "a sign of decline",
      "make the present visible"
    ],
    "essence": "Abundance reaches its height, but it cannot last forever. Use the brightness of the present well while quietly preparing for change.",
    "trigramSymbolism": "Thunder and lightning arrive together: force and clarity at their fullest. Yet the midday sun has already begun its descent.",
    "classical": "Abundance means fullness and greatness. The Judgment says that things proceed well, the king comes to this place, there is no need for worry, and midday is fitting. The height of fullness is not a reason for fear, but the tradition also recognizes that what is full will wane. Decline at the height of success is a natural pattern, not an aberration.",
    "modern": "Results, attention, and momentum are at their peak. Do not shrink from success, but do not assume it will last unchanged. Use the present brightness fully, and begin the next preparation while conditions are favorable.",
    "guidance": {
      "work": "At your strongest point, record results, build reliable systems, and train others. Some work can only be done while the light is strong.",
      "relationships": "People who gather during a brilliant period are not always those who remain when circumstances darken. Notice and value those who do remain.",
      "decision": "Do not plan on the assumption that today’s momentum will continue. Ask whether the plan still works if that momentum is cut in half."
    },
    "judgment": {
      "original": "豐：亨。王假之，勿憂，宜日中。",
      "modern": "Abundance: success and progress. The king arrives here. Do not worry; midday is favorable."
    },
    "lines": [
      {
        "original": "初九：遇其配主，雖旬无咎，往有尚。",
        "modern": "At the beginning, meet an equal partner. Even if this lasts ten days, there is no blame; moving forward brings recognition."
      },
      {
        "original": "六二：豐其蔀，日中見斗，往得疑疾，有孚發若，吉。",
        "modern": "The covering is thick, and at midday the stars of the Dipper can be seen. Moving forward may bring suspicion, but sincere trust brought into the open leads to good fortune."
      },
      {
        "original": "九三：豐其沛，日中見沫，折其右肱，无咎。",
        "modern": "The covering is heavy, and at midday a faint star can be seen. It is like having the right arm broken; there is no blame."
      },
      {
        "original": "九四：豐其蔀，日中見斗，遇其夷主，吉。",
        "modern": "The covering is thick, and at midday the Dipper can be seen. Meeting an equal partner brings good fortune."
      },
      {
        "original": "六五：來章，有慶譽，吉。",
        "modern": "A person of distinction arrives, bringing celebration and honor. Good fortune."
      },
      {
        "original": "上六：豐其屋，蔀其家，窺其戶，闃其无人，三歲不覿，凶。",
        "modern": "The house is made grand, but the family is hidden behind coverings. Looking through the door, no one is seen or heard. For three years there is no meeting with anyone. Misfortune."
      }
    ]
  },
  "56": {
    "name": "The Wanderer",
    "chineseName": "旅",
    "pinyin": "Lǚ",
    "keywords": [
      "travel",
      "temporary shelter",
      "restraint",
      "lightness"
    ],
    "essence": "Fire on the mountain: move carefully, stay modest, and make only limited progress while away from home.",
    "trigramSymbolism": "Fire moves across the mountain’s summit, never settling in one place: an image of travel, movement, and temporary presence.",
    "classical": "The Wanderer describes being away from one’s established home and among strangers. The judgment promises only modest progress, and says that steadiness, restraint, and proper conduct protect the traveler. A humble, observant traveler adapts to circumstances; arrogance and overconfidence can cost one shelter and support.",
    "modern": "This applies to a new environment, unfamiliar territory, or a temporary role where past status and achievements carry little weight. Do not seek a major triumph at once. Stay humble and mobile, respect local customs, and build trust through small contributions. Do not behave like the owner when you are only a guest.",
    "guidance": {
      "work": "In a new job, transfer, or market, set aside assumptions based on past success. Observe first and begin with useful, manageable contributions.",
      "relationships": "In a new community, listen more than you speak. A respectful newcomer can gradually establish a real place there.",
      "decision": "Avoid making major commitments while your position is temporary. Keep enough flexibility to recognize where, and whether, you should settle."
    },
    "judgment": {
      "original": "旅：小亨，旅貞吉。",
      "modern": "The Wanderer: modest progress. For the traveler, steadiness and proper conduct bring good fortune."
    },
    "lines": [
      {
        "original": "初六：旅瑣瑣，斯其所取災。",
        "modern": "The traveler is petty and mean-spirited; this is how disaster is invited."
      },
      {
        "original": "六二：旅即次，懷其資，得童僕貞。",
        "modern": "The traveler settles into lodging, keeps money close, and gains a trustworthy young attendant."
      },
      {
        "original": "九三：旅焚其次，喪其童僕，貞厲。",
        "modern": "The traveler’s lodging burns, and the attendant is lost. Even with proper conduct, the situation is dangerous."
      },
      {
        "original": "九四：旅于處，得其資斧，我心不快。",
        "modern": "The traveler stays in temporary quarters and obtains money and an axe, but remains inwardly dissatisfied."
      },
      {
        "original": "六五：射雉一矢亡，終以譽命。",
        "modern": "The traveler shoots a pheasant and loses one arrow. In the end, honor and an official appointment are received."
      },
      {
        "original": "上九：鳥焚其巢，旅人先笑後號咷。喪牛于易，凶。",
        "modern": "The bird’s nest burns. The traveler laughs at first, then cries out in grief. Losing an ox in an open place brings misfortune."
      }
    ]
  },
  "57": {
    "name": "The Gentle Wind",
    "chineseName": "巽",
    "pinyin": "Xùn",
    "keywords": [
      "yielding entry",
      "permeation",
      "repetition",
      "gentle influence"
    ],
    "essence": "Gentle influence works by entering gradually and reaching inward through steady repetition.",
    "trigramSymbolism": "Wind above wind: air moves into every opening, spreading through persistence rather than force.",
    "classical": "Xun means yielding and entering. Its small success comes through continued movement and contact with capable guidance. Yet excessive submission can make a person lose their own resources and direction.",
    "modern": "This is a situation where repeated, flexible influence works better than one forceful move. Ideas, habits, and trust take root gradually. Flexibility is not the same as compliance: without a clear center, yielding becomes drift.",
    "guidance": {
      "work": "Repeat the essential message in varied forms. Lasting influence grows through consistent contact.",
      "relationships": "Use small, steady gestures rather than trying to force change through direct persuasion.",
      "decision": "Choose gradual influence over pressure when possible, but first decide what you will follow and what you will not surrender."
    },
    "judgment": {
      "original": "巽：小亨。利有攸往。利見大人。",
      "modern": "Small success. It is beneficial to have somewhere to go, and beneficial to meet a wise and capable person."
    },
    "lines": [
      {
        "original": "初六：進退，利武人之貞。",
        "modern": "Advancing and retreating without certainty. Firmness, like that of a disciplined warrior, is beneficial."
      },
      {
        "original": "九二：巽在牀下，用史巫紛若，吉无咎。",
        "modern": "Yielding beneath the bed. Using interpreters and ritual specialists in abundance brings good fortune and no blame."
      },
      {
        "original": "九三：頻巽，吝。",
        "modern": "Yielding again and again under pressure. This brings difficulty and regret."
      },
      {
        "original": "六四：悔亡，田獲三品。",
        "modern": "Regret disappears. In the hunt, three kinds of game are captured."
      },
      {
        "original": "九五：貞吉悔亡，无不利。无初有終，先庚三日，後庚三日，吉。",
        "modern": "Firm and correct, good fortune; regret disappears, and nothing is unfavorable. There is a poor beginning but a good ending. Three days before and three days after the geng day, proceed with care. Good fortune."
      },
      {
        "original": "上九：巽在牀下，喪其資斧，貞凶。",
        "modern": "Yielding beneath the bed and losing one’s resources and axe. Even correctness brings misfortune."
      }
    ]
  },
  "58": {
    "name": "The Joyous Lake",
    "chineseName": "兌",
    "pinyin": "Duì",
    "keywords": [
      "joy",
      "conversation",
      "harmony",
      "learning together"
    ],
    "essence": "Joy flows and nourishes when it rests on what is right.",
    "trigramSymbolism": "Two lakes joined together share their water and keep one another fresh. This represents conversation, mutual learning, and shared joy.",
    "classical": "The Joyous Lake means joy and openness. The judgment says that things can proceed smoothly, but joy is beneficial only when supported by integrity. A leader who genuinely brings people joy helps them endure work and hardship. Friends studying and discussing together express the noble form of this joy. Yet flattering pleasure must be avoided.",
    "modern": "Conversation, sharing, and enjoyment can help a situation move forward. Joy naturally draws people and ideas together. But when pleasing others becomes the goal, or a group allows only comfortable views, its vitality becomes stagnant. Joy that includes mutual learning lasts longest.",
    "guidance": {
      "work": "Creating a welcoming atmosphere is valuable work. But suppressing necessary truths merely to seem pleasant is not genuine harmony.",
      "relationships": "Spend more time with people who can learn and talk together with you. Shared joy grows through exchange.",
      "decision": "You may welcome an appealing proposal, but check once what supports it. Choose enjoyment grounded in integrity."
    },
    "judgment": {
      "original": "兌：亨。利貞。",
      "modern": "The Joyous Lake: things proceed smoothly. It is beneficial to remain true and upright."
    },
    "lines": [
      {
        "original": "初九：和兌，吉。",
        "modern": "Harmonious joy. Good fortune."
      },
      {
        "original": "九二：孚兌，吉，悔亡。",
        "modern": "Joy arising from sincerity. Good fortune; regret disappears."
      },
      {
        "original": "六三：來兌，凶。",
        "modern": "Coming with flattery to win approval. Misfortune."
      },
      {
        "original": "九四：商兌，未寧，介疾有喜。",
        "modern": "Weighing and comparing different pleasures, with no inner peace. Cut away what is harmful, and there will be joy."
      },
      {
        "original": "九五：孚于剝，有厲。",
        "modern": "Trusting what seeks to strip you bare. Danger."
      },
      {
        "original": "上六：引兌。",
        "modern": "Joy that draws you in. There is a sign of becoming absorbed and losing yourself."
      }
    ]
  },
  "59": {
    "name": "Dispersion",
    "chineseName": "渙",
    "pinyin": "Huàn",
    "keywords": [
      "disperse",
      "dissolve deadlock",
      "create openness",
      "regather"
    ],
    "essence": "Wind moves across water, loosening what has become stagnant or stuck so it can flow again.",
    "trigramSymbolism": "Wind passes over water, breaking up the surface and easing what has begun to harden. This is the image of dispersion that restores circulation.",
    "classical": "Dispersion means scattering and dissolving. When people are drifting apart, a shared place of reverence can bring their hearts together again. Dispersion and gathering are two sides of the same process: release narrow private loyalties so a larger unity can form.",
    "modern": "This is a time to loosen stagnant feelings, rigid factions, and blocked communication. Let what has accumulated move again, but do not scatter things without direction. After clearing the blockage, provide a shared purpose or focal point for renewed cooperation.",
    "guidance": {
      "work": "Open up entrenched departments or stalled projects through changes of setting, roles, or information flow. Show the new point of coordination at the same time.",
      "relationships": "Long-held tension may ease when people talk in a different setting. A walk or change of scene can help create openness.",
      "decision": "Temporarily release excess possessions, responsibilities, or attachments. Becoming less burdened can make a new, stronger commitment possible."
    },
    "judgment": {
      "original": "渙：亨。王假有廟，利涉大川，利貞。",
      "modern": "Dispersion brings progress. The ruler goes to the ancestral temple to gather people’s hearts. It is favorable to cross a great river, and favorable to remain true."
    },
    "lines": [
      {
        "original": "初六：用拯馬壯，吉。",
        "modern": "Use a strong horse to rescue what is in danger. Good fortune."
      },
      {
        "original": "九二：渙奔其机，悔亡。",
        "modern": "In the midst of dispersion, run to a secure support. Regret disappears."
      },
      {
        "original": "六三：渙其躬，无悔。",
        "modern": "Disperse self-absorption. There will be no regret."
      },
      {
        "original": "六四：渙其群，元吉。渙有丘，匪夷所思。",
        "modern": "Disperse private factions. Great good fortune. From what is dispersed, a gathering as large as a hill can arise, beyond what ordinary people would imagine."
      },
      {
        "original": "九五：渙汗其大號，渙王居，无咎。",
        "modern": "Issue a great proclamation until it spreads through the realm like sweat through the body; disperse the ruler’s stores in generous relief. No blame."
      },
      {
        "original": "上九：渙其血，去逖出，无咎。",
        "modern": "Disperse the bloodshed and move far beyond fear. No blame."
      }
    ]
  },
  "60": {
    "name": "Limitation",
    "chineseName": "節",
    "pinyin": "Jié",
    "keywords": [
      "limits",
      "boundaries",
      "moderation",
      "unsustainable austerity"
    ],
    "essence": "Water held by a boundary does not overflow. Well-chosen limits preserve strength and capacity.",
    "trigramSymbolism": "Water above a lake suggests containment: like a bank or the joints of bamboo, divisions allow what is held to gather without overflowing.",
    "classical": "Limitation means setting appropriate divisions. The judgment says that limitation brings success, but bitter limitation cannot be maintained as a right course. Natural boundaries create order, like the seasons. Easeful limitation succeeds; agreeable limitation is fortunate.",
    "modern": "This is a time to set limits on scope, budgets, deadlines, or habits. Design limits you can actually keep. Excessive restraint invites backlash; moderate boundaries create structure and help strength accumulate.",
    "guidance": {
      "work": "Give open-ended work clear scope and deadlines. Set rules lenient enough to follow consistently.",
      "relationships": "Keep healthy boundaries. Decide in advance what you can decline, reducing repeated friction.",
      "decision": "Make restraint realistic. A sustainable plan is better than an ideal one that cannot be maintained."
    },
    "judgment": {
      "original": "節：亨。苦節不可貞。",
      "modern": "Limitation brings success. But painful restraint cannot be sustained as the right course."
    },
    "lines": [
      {
        "original": "初九：不出戶庭，无咎。",
        "modern": "Do not go beyond the courtyard gate. No blame."
      },
      {
        "original": "九二：不出門庭，凶。",
        "modern": "Do not go beyond the outer gate. Failing to go out when it is time brings trouble."
      },
      {
        "original": "六三：不節若，則嗟若，无咎。",
        "modern": "Without restraint, one ends up lamenting. The result is self-created; do not blame others."
      },
      {
        "original": "六四：安節，亨。",
        "modern": "At ease with restraint. This brings success."
      },
      {
        "original": "九五：甘節，吉；往有尚。",
        "modern": "Pleasant restraint is fortunate. Moving forward brings recognition."
      },
      {
        "original": "上六：苦節，貞凶，悔亡。",
        "modern": "Bitter restraint. Even if one acts rightly, the result is harmful; still, regret fades."
      }
    ]
  },
  "61": {
    "name": "Inner Truth",
    "chineseName": "中孚",
    "pinyin": "Zhōng Fú",
    "keywords": [
      "sincerity",
      "inner trust",
      "mutual understanding",
      "good faith"
    ],
    "essence": "When sincerity is full within, it reaches even the least responsive beings. Trust grounded in truth can carry us through major challenges.",
    "trigramSymbolism": "Wind moves across the lake, touching every part of its surface. Inner sincerity spreads outward and invites a response. The two central yin lines suggest an open, receptive heart.",
    "classical": "Inner Truth means having genuine trust within. The image of a parent bird sheltering its eggs suggests a bond that grows from the inside. Sincerity can reach even pigs and fish, and with it one can cross a great river. What is true in an unseen place naturally calls forth an answering response.",
    "modern": "This is a situation where inner honesty matters more than technique or persuasion. Sincerity can be felt even when hidden, while falsehood shows through despite decoration. Set aside assumptions and calculations; open attention is the condition for genuine connection.",
    "guidance": {
      "work": "The quality of work done unseen shapes your reputation. What you do when no one is watching travels farthest.",
      "relationships": "To connect with others, first be honest within yourself. Sincerity is not a technique but a way of being.",
      "decision": "Ask whether you could explain this choice openly. If so, it may be sound. A sincere decision usually needs little defense."
    },
    "judgment": {
      "original": "中孚：豚魚吉，利涉大川，利貞。",
      "modern": "Inner Truth: Good fortune comes when sincerity reaches even pigs and fish. It is favorable to cross a great river, and favorable to remain true."
    },
    "lines": [
      {
        "original": "初九：虞吉，有他不燕。",
        "modern": "Initial nine: Careful consideration brings good fortune. If your attention turns elsewhere, you will not be at ease."
      },
      {
        "original": "九二：鳴鶴在陰，其子和之，我有好爵，吾與爾靡之。",
        "modern": "Second nine: A crane calls from the shade, and its young answer. I have a fine cup; let us share it together."
      },
      {
        "original": "六三：得敵，或鼓或罷，或泣或歌。",
        "modern": "Third six: You meet a worthy opponent: sometimes beating the drum, sometimes stopping; sometimes weeping, sometimes singing. Your feelings are unsettled."
      },
      {
        "original": "六四：月幾望，馬匹亡，无咎。",
        "modern": "Fourth six: The moon is nearly full. The paired horses separate, and one goes on alone. No blame."
      },
      {
        "original": "九五：有孚攣如，无咎。",
        "modern": "Fifth nine: Trust binds people firmly together. No blame."
      },
      {
        "original": "上九：翰音登于天，貞凶。",
        "modern": "Top nine: A rooster’s call rises to heaven. This is reputation without substance; even if maintained correctly, it brings trouble."
      }
    ]
  },
  "62": {
    "name": "Small Preponderance",
    "chineseName": "小過",
    "pinyin": "Xiǎo Guò",
    "keywords": [
      "Going a little beyond",
      "Flying low",
      "Attention to detail",
      "Do not overreach"
    ],
    "essence": "When circumstances favor small excesses: be especially careful and modest, but do not attempt major undertakings.",
    "trigramSymbolism": "Thunder over the mountain: a strong sound, yet not something that rises endlessly into the sky. The bird should descend rather than climb, symbolizing a low and careful course.",
    "classical": "Small Preponderance concerns going slightly beyond the ordinary in small matters. Courtesy, restraint, and care may be more thorough than usual, but this is not the time for major enterprises. A bird leaves its call behind; it is better to descend than to rise.",
    "modern": "Focus on detail, procedure, and consideration rather than a grand contest. Extra care in greetings, checks, and follow-through can be valuable now. Do not mistake modest, precise progress for a time to make a high-reaching move.",
    "guidance": {
      "work": "Improve the quality of immediate details rather than pursuing a large project. Especially careful checking and reporting can be strengths now.",
      "relationships": "Courtesy, consideration, and apologies may need to be more generous than usual to be properly felt.",
      "decision": "Postpone ambitious plans. Choose only small, dependable improvements for now."
    },
    "judgment": {
      "original": "小過：亨。利貞。可小事，不可大事。飛鳥遺之音，不宜上宜下，大吉。",
      "modern": "Small Preponderance: Success. Keeping to what is right is beneficial. Small matters can be undertaken; great matters should not. A flying bird leaves its call behind. It should not rise, but descend. This brings great good fortune."
    },
    "lines": [
      {
        "original": "初六：飛鳥以凶。",
        "modern": "The flying bird rises too far: misfortune."
      },
      {
        "original": "六二：過其祖，遇其妣；不及其君，遇其臣；无咎。",
        "modern": "Pass beyond the grandfather and meet the grandmother; do not reach the ruler, but meet the minister. There is no blame."
      },
      {
        "original": "九三：弗過防之，從或戕之，凶。",
        "modern": "Do not overdo the defenses. If you let your guard down, you may be harmed. Misfortune."
      },
      {
        "original": "九四：无咎，弗過遇之。往厲必戒，勿用永貞。",
        "modern": "No blame. Without going too far, you meet what is appropriate. Advancing brings danger; remain alert. Do not cling forever to one fixed course."
      },
      {
        "original": "六五：密雲不雨，自我西郊，公弋取彼在穴。",
        "modern": "Dense clouds gather, but no rain falls, from our western outskirts. The duke shoots an arrow and captures what is hiding in a hollow."
      },
      {
        "original": "上六：弗遇過之，飛鳥離之，凶，是謂災眚。",
        "modern": "You fail to meet what is appropriate and go too far. The flying bird is caught in a snare. Misfortune: this is called disaster."
      }
    ]
  },
  "63": {
    "name": "After Completion",
    "chineseName": "既濟",
    "pinyin": "Jì Jì",
    "keywords": [
      "completion",
      "after achievement",
      "maintenance",
      "stay alert"
    ],
    "essence": "The crossing is complete, but disorder can begin within completion itself.",
    "trigramSymbolism": "Water lies above fire: the elements are in their proper relation, like a vessel in which cooking is successfully completed.",
    "classical": "After Completion means having already crossed over. All six lines are in their proper positions, suggesting completion. Yet the judgment warns that what begins auspiciously may end in disorder. Completion is not simply an endpoint; it can also be the start of decline.",
    "modern": "A phase has reached a stable, orderly conclusion. But any completed system gradually loosens when neglected. Shift attention from celebrating success to repairing small weaknesses and creating ways to maintain what has been achieved.",
    "guidance": {
      "work": "Inspect the project just after completion. Record what worked and address likely weak points before they develop.",
      "relationships": "Even stable relationships need care. Put fresh words to appreciation and other things that have become routine.",
      "decision": "A small step that protects and improves the present arrangement may be better than a dramatic new move. Prepare carefully before beginning another crossing."
    },
    "judgment": {
      "original": "既濟：亨小。利貞。初吉終亂。",
      "modern": "After Completion: Small matters go well. Persistence in what is right is beneficial. At first there is good fortune; in the end, disorder."
    },
    "lines": [
      {
        "original": "初九：曳其輪，濡其尾，无咎。",
        "modern": "Nine at the beginning: Pull back the wheel and wet the tail. There is no fault."
      },
      {
        "original": "六二：婦喪其茀，勿逐，七日得。",
        "modern": "Six in the second place: The woman loses her carriage curtain. Do not pursue it; it will return after seven days."
      },
      {
        "original": "九三：高宗伐鬼方，三年克之，小人勿用。",
        "modern": "Nine in the third place: King Gaozong attacked the Gui-fang and conquered them after three years. Do not employ lesser people in major undertakings."
      },
      {
        "original": "六四：繻有衣袽，終日戒。",
        "modern": "Six in the fourth place: Have patched clothing at hand, and remain watchful all day."
      },
      {
        "original": "九五：東鄰殺牛，不如西鄰之禴祭，實受其福。",
        "modern": "Nine in the fifth place: The eastern neighbor’s lavish ox sacrifice is not as effective as the western neighbor’s simple offering, which truly receives blessing."
      },
      {
        "original": "上六：濡其首，厲。",
        "modern": "Six at the top: The head is immersed. This is dangerous."
      }
    ]
  },
  "64": {
    "name": "Before Completion",
    "chineseName": "未濟",
    "pinyin": "Wèi Jì",
    "keywords": [
      "unfinished",
      "one step short",
      "possibility",
      "careful crossing"
    ],
    "essence": "The crossing is not complete. Hope remains within the disorder.",
    "trigramSymbolism": "Fire above and water below are moving toward their proper places but have not yet joined. This is the image of a situation just before it comes together.",
    "classical": "Before Completion means “not yet across.” The final hexagram places incompletion, rather than completion, at the end. A young fox nearly crosses the stream but wets its tail: without care at the last step, even great progress may fail to bear fruit.",
    "modern": "Something is nearly taking shape, but the crossing is not finished. Incompletion is not failure; it leaves possibilities open. As this hexagram stands last, completion is never final: another crossing will always begin. Do not rush the final step.",
    "guidance": {
      "work": "Treat the final ten percent of a project with the same care as the beginning. Last-minute rushing is especially risky.",
      "relationships": "Do not abandon a problem just because it seems resolved. Handle the final exchange with care.",
      "decision": "You can move forward without perfect completion, but do not take the final step lightly."
    },
    "judgment": {
      "original": "未濟：亨。小狐汔濟，濡其尾，无攸利。",
      "modern": "Before Completion: Progress is possible. A young fox nearly crosses the stream but wets its tail. Nothing is gained."
    },
    "lines": [
      {
        "original": "初六：濡其尾，吝。",
        "modern": "The fox wets its tail. It is embarrassing to reach beyond one’s strength and get stuck."
      },
      {
        "original": "九二：曳其輪，貞吉。",
        "modern": "He pulls back the wheel of his cart and restrains himself. Correct conduct brings good fortune."
      },
      {
        "original": "六三：未濟，征凶，利涉大川。",
        "modern": "The crossing is not complete; pressing forward brings misfortune. Yet preparing to cross the great river is beneficial."
      },
      {
        "original": "九四：貞吉，悔亡，震用伐鬼方，三年有賞于大國。",
        "modern": "Correct conduct brings good fortune and erases regret. With force like thunder, he attacks the Gui region; after three years, he receives recognition from a great state."
      },
      {
        "original": "六五：貞吉，无悔，君子之光，有孚，吉。",
        "modern": "Correct conduct brings good fortune and no regret. The light of a noble person has integrity; this brings good fortune."
      },
      {
        "original": "上九：有孚于飲酒，无咎，濡其首，有孚失是。",
        "modern": "With trust, he shares wine, and there is no blame. But if he soaks his head and loses restraint, even his trust is lost."
      }
    ]
  }
};
