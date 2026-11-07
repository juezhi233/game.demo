/* ============================================================
   线索 / 关系网 / 行动 数据层（新版）
   ============================================================ */

// 三槽：机会 / 动机 / 身份。每槽 1 条确认线索（●）即算达成。
const SLOTS = {
  opportunity:{ label:'机会' },
  motive:     { label:'动机' },
  identity:   { label:'身份' }
};
const KEY_OF_SLOT = { opportunity:'C_LOCK', motive:'C_LEDGER', identity:'C_TAG' };

// 12 条关键线索：slot = 所属槽；found = 拿到东西；confirmed = 有证人/笔记解释
const CLUES = {
  C_LOCK:     { name:'阁楼老锁（从外锁）',       slot:'opportunity', src:'第一夜 · 现场搜查 · 门锁',
                confirm:'神父解释 / 自己试钥匙', hint:'谁有这把锁的钥匙？' },
  C_KEY:      { name:'药房旧钥匙',               slot:'opportunity', src:'第二夜 · 药房找特蕾莎',
                confirm:'神父解释 / 试开阁楼门', hint:'旧钥匙能开哪扇门？' },
  C_LEDGER:   { name:'真账本（缺药对不上）',     slot:'motive', src:'第三夜 · 搜药房',
                confirm:'账本药理标注', hint:'缺的是哪种药？用于什么？' },
  C_BUYER:    { name:'买家信「老本得处理」',     slot:'motive', src:'第三夜 · 搜药房',
                confirm:'玛丽证词 / 笔迹对照', hint:'谁在买，为什么提到老本？' },
  C_TAG:      { name:'修女牌「特蕾莎·莫尔」',    slot:'identity', src:'第四夜 · 进墓穴',
                confirm:'神父 / 塞缪尔辨认', hint:'牌子上是谁的名字？' },
  C_SKULL:    { name:'托马斯颅骨钝器伤',         slot:'identity', src:'第四夜 · 进墓穴',
                confirm:'旧登记册 + 修女牌', hint:'他不是摔死的？' },
  C_REGISTER: { name:'旧登记册',                 slot:null, src:'第二夜 · 亨利房间', confirm:'—', hint:'二十年前的名单。' },
  C_CONFESS:  { name:'神父的部分坦白',           slot:null, src:'第三夜 · 找神父',   confirm:'—', hint:'他承认埋过人。' },
  C_OLDKEY:   { name:'地下室的旧钥匙',           slot:null, src:'第二夜 · 地下室找塞缪尔', confirm:'—', hint:'开地下室门的。' },
  C_CORPSE:   { name:'老本的尸体',               slot:null, src:'第一夜 · 现场搜查', confirm:'—', hint:'吊在管风琴旁。' },
  C_BOTTLE:   { name:'药瓶证词 / 瓶型',          slot:null, src:'第一夜 · 厨房找玛丽', confirm:'—', hint:'修女手里拿着瓶子。' },
  C_TIME:     { name:'钟楼时间线',               slot:null, src:'第三夜 · 找艾格尼丝 / 约翰', confirm:'—', hint:'第十三声钟响。' }
};

// 次要线索（旁证，不影响三槽）
const SECONDARY = {
  S_MARY_BOTTLE: { name:'玛丽：瓶证词 / 瓶型',        owner:'mary' },
  S_HENRY_REG:   { name:'亨利：旧登记册 / 残页',      owner:'henry' },
  S_SAMUEL_BURY: { name:'塞缪尔：埋尸证词 / 墓穴旧门', owner:'samuel' },
  S_MARGARET:    { name:'玛格丽特：托马斯是她父亲',   owner:'margaret' },
  S_AGNES:       { name:'艾格尼丝：旧调任信',         owner:'agnes' },
  S_PETER:       { name:'彼得：修女拿绳子的画',       owner:'peter' },
  S_JOHN:        { name:'约翰：钟楼时间线',           owner:'johndoe' },
  S_THERESA:     { name:'特蕾莎：老本没去药房的谎言', owner:'theresa' }
};

// 死亡销毁：某人死了 / 被放逐，对应次要线索断掉，只留替代物
const DESTROY = {
  mary:    { lose:'S_MARY_BOTTLE', alt:'玛丽死了。瓶证词断了——只剩一条撕下的布条，和彼得画里那只瓶子。' },
  henry:   { lose:'S_HENRY_REG',   alt:'亨利死了。登记册被烧——只剩半页残页，和艾格尼丝抄下的一行字。' },
  samuel:  { lose:'S_SAMUEL_BURY', alt:'塞缪尔死了。埋尸证词断了——只剩神父的忏悔，和那枚修女牌。' },
  margaret:{ lose:'S_MARGARET',    alt:'玛格丽特死了。证词断了——只剩她留下的信，和彼得的那张画。' }
};

// 保护网：被保护者 → 保护者
const PROTECT = { henry:'agnes', mary:'samuel', samuel:'priest', margaret:'mary', peter:'margaret' };
// 凶手优先级：从高到低
const KILL_ORDER = ['henry','mary','samuel','margaret','peter'];

// 关系网（证据板）：from = 保护者，to = 被保护者（放逐 from，则 to 失去保护）
// unlockClue = 该槽线索「确认(●)」后，这一行才点亮；否则显示 ???
const RELATION_ROWS = [
  { from:'samuel',   to:'mary',     unlockClue:'C_CONFESS'  },
  { from:'agnes',    to:'henry',    unlockClue:'C_REGISTER' },
  { from:'margaret', to:'peter',    unlockClue:'C_SKULL'    },
  { from:'priest',   to:'samuel',   unlockClue:'C_TAG'      },
  { from:'mary',     to:'margaret', unlockClue:'C_LEDGER'   }
];

// 放逐池（不在池：菲利普、海伦、亨利、约翰、老本）
const CANDIDATE_POOL = {
  1:['joseph','samuel','agnes','peter','mary','margaret'],
  2:['joseph','samuel','agnes','peter','mary','margaret'],
  3:['joseph','samuel','agnes','peter','mary','margaret','priest'],
  4:['joseph','samuel','agnes','peter','mary','margaret','priest','theresa'],
  5:[]
};

// 每夜 4 个主行动，选 2（每个 1 行动点）。free:true = 不占行动点。
const ACTIONS = {
  1:[
    { id:'a1_loft', name:'现场搜查（阁楼）', sub:'尸体 · 手杖 · 门锁', bg:'loft',
      seq:[
        {who:'action', text:'管风琴阁楼的门虚掩着。你推开门——'},
        {who:'action', text:'老本吊在管风琴旁，脚下的凳子倒在一旁。他的导盲犬关在钟楼里，叫声顺着风钻上来。'},
        {who:'philip', text:'别动他。手腕……有捆绑的痕迹。不是自杀。'},
        {who:'action', text:'你蹲下看手杖：杖头沾着一层滑石粉，只有药房的柜台上才有。'},
        {who:'action', text:'你再回头看门锁——是从外面锁上的，锁很旧，钥匙该只有少数几把。'},
        {who:'me', text:'门从外面锁着……那锁我好像在哪儿见过。'},
        {who:'philip', text:'先记下来。这屋子里，撒谎的人比雪还多。', endAction:true}
      ],
      clues:['C_CORPSE','C_LOCK'], secondary:['S_MARY_BOTTLE'] },
    { id:'a1_mary', name:'厨房找玛丽', sub:'瓶证词 · 保护提示', bg:'kitchen',
      seq:[
        {who:'action', text:'厨房的炉子还温着。玛丽正把最后一锅汤收起来。'},
        {who:'mary', text:'哎哟，这个点儿还没睡？来，喝碗热的。'},
        {who:'me', text:'谢谢玛丽。今晚……有没有什么不对劲的？'},
        {who:'mary', text:'不对劲？这教堂哪天对劲过。'},
        {who:'action', text:'她压低声音，往门口看了一眼。'},
        {who:'mary', text:'昨晚我起夜，看见修女手里拿着个瓶子，从药房那边过来。瓶子的型我认得，是药房柜子最上层的。'},
        {who:'mary', text:'还有啊，孩子——我总觉得，有人护着我，我才活到现在。你夜里巡，也当心点。'},
        {who:'action', text:'她说这话时，眼睛瞟向了地下室的方向。', endAction:true}
      ],
      clues:['C_BOTTLE'], secondary:['S_MARY_BOTTLE'] },
    { id:'a1_samuel', name:'地下室找塞缪尔', sub:'旧守夜人 · 墓穴旧门', bg:'darkBasement',
      seq:[
        {who:'action', text:'地下室门口挂着锁。塞缪尔提着油灯站在那里，像早知道你要来。'},
        {who:'samuel', text:'你问什么我都不会说。上一个守夜人就是问东问西，后来走了。'},
        {who:'me', text:'走了？怎么走的。'},
        {who:'samuel', text:'……门是有一扇的。墓穴那边，很旧了。别去。'},
        {who:'action', text:'他没有再多讲一个字，把油灯往门内一挪，挡住了你的视线。', endAction:true}
      ],
      clues:[], secondary:['S_SAMUEL_BURY'] },
    { id:'a1_hall', name:'大厅找艾格尼丝 / 约瑟夫', sub:'红鲱鱼 · 旧案线', bg:'hall',
      seq:[
        {who:'action', text:'大厅里，艾格尼丝和约瑟夫隔着壁炉坐着。'},
        {who:'agnes', text:'守夜人。我实话告诉你——约瑟夫半夜在阁楼附近晃。'},
        {who:'joseph', text:'我是去修音管。你倒好，半夜在抄我的东西。'},
        {who:'action', text:'两个人各说各的。你注意到，约瑟夫提到"那桩旧事"时，声音低了半截。'},
        {who:'me', text:'什么旧事？'},
        {who:'joseph', text:'……跟你没关系。二十年前的事了。', endAction:true}
      ],
      clues:[], secondary:['S_AGNES'] }
  ],
  2:[
    { id:'a2_henry', name:'亨利 / 亨利房间', sub:'旧登记册', bg:'archive',
      seq:[
        {who:'action', text:'亨利靠在床头，头上缠着布。他指了指床边的木箱。'},
        {who:'henry', text:'登记册。二十年前的名单——里面有个修女，改了名字。'},
        {who:'action', text:'你翻开登记册，纸页发黄。"特蕾莎·莫尔"这个名字下面，有一行被划掉的旧名。'},
        {who:'henry', text:'别让她们知道你看过这个。我可不想再被砸一次脑袋。', endAction:true}
      ],
      clues:['C_REGISTER'], secondary:['S_HENRY_REG'] },
    { id:'a2_theresa', name:'药房找特蕾莎', sub:'药房钥匙 · 假账本 · 谎言', bg:'apothecary',
      seq:[
        {who:'action', text:'药房的灯还亮着。特蕾莎修女在柜子前清点着什么，听见动静回过头，露出惯常的微笑。'},
        {who:'theresa', text:'守夜人，这么晚还没睡？账本你拿着吧，说不定用得上。'},
        {who:'action', text:'她递来的账本字迹工整、数目清楚。可她递本子时，袖口滑出一串旧钥匙，铜的，齿口很深。'},
        {who:'me', text:'这钥匙是开哪的？'},
        {who:'theresa', text:'库房的罢了。别多想。'},
        {who:'action', text:'你说起老本，她答得很快："老本很少来药房。"——快得像早就想好了。', endAction:true}
      ],
      clues:['C_KEY'], secondary:['S_THERESA'] },
    { id:'a2_samuel', name:'地下室找塞缪尔', sub:'地下室门 · 旧钥匙', bg:'darkBasement',
      seq:[
        {who:'action', text:'这一次塞缪尔没挡你。他把油灯放低，看了你很久。'},
        {who:'samuel', text:'……你既然问了，就自己去看吧。地下室的门，钥匙在我这。'},
        {who:'action', text:'他递过来一把旧钥匙，铜的，齿口很深——和你在别处见过的，一模一样。'},
        {who:'samuel', text:'墓穴那边还有一扇旧门。那门后面的事，我不管，也不想管。', endAction:true}
      ],
      clues:['C_OLDKEY'], secondary:['S_SAMUEL_BURY'] },
    { id:'a2_agnes', name:'艾格尼丝 / 神父', sub:'调任信 · 神父压事', bg:'office',
      seq:[
        {who:'action', text:'艾格尼丝把一张旧纸塞进你手里，纸边发脆。'},
        {who:'agnes', text:'二十年前的调任信。上面有个名字被涂掉了。'},
        {who:'priest', text:'（在门口）守夜人。这事到此为止，对谁都好。'},
        {who:'me', text:'死了一个人，神父。'},
        {who:'priest', text:'……你不懂。这教堂里的账，不是你能翻的。', endAction:true}
      ],
      clues:[], secondary:['S_AGNES'] }
  ],
  3:[
    { id:'a3_apoth', name:'搜药房', sub:'真账本 · 买家信', bg:'apothecary',
      seq:[
        {who:'action', text:'你举着手电进了药房。柜台最下层，压着一本和给亨利的那本不一样的账。'},
        {who:'action', text:'真账本：镇静剂缺十二支，吗啡缺六瓶。旁边夹着一封信，字迹娟秀。'},
        {who:'action', text:'「货到了。老本发现了，得处理。」——没有署名。'},
        {who:'me', text:'老本发现了……所以老本死了。'},
        {who:'action', text:'账页边缘还有一行淡得几乎看不见的药理标注：镇静剂过量，会让人在睡梦里不再醒来。', endAction:true}
      ],
      clues:['C_LEDGER','C_BUYER'], secondary:['S_THERESA'] },
    { id:'a3_margaret', name:'找玛格丽特', sub:'托马斯线', bg:'corridor',
      seq:[
        {who:'action', text:'玛格丽特把女儿支开，才敢开口。'},
        {who:'margaret', text:'托马斯……是我父亲。二十年前，他死在这教堂里。'},
        {who:'me', text:'怎么死的？'},
        {who:'margaret', text:'他们说是摔的。可他的头……（摇头）我不敢说。我女儿还小。', endAction:true}
      ],
      clues:[], secondary:['S_MARGARET'] },
    { id:'a3_priest', name:'找神父', sub:'部分坦白', bg:'office',
      seq:[
        {who:'action', text:'神父的办公室只点了一根蜡烛。他像是等了你很久。'},
        {who:'priest', text:'你查到了什么？'},
        {who:'me', text:'二十年前，墓穴里多了一具尸骨。'},
        {who:'action', text:'他沉默了很久，蜡烛芯爆了一下。'},
        {who:'priest', text:'……我埋过一个人。这是真的。'},
        {who:'priest', text:'但为什么埋，谁让我埋的——我不会现在说。'},
        {who:'me', text:'您在护着谁？'},
        {who:'priest', text:'（不答）', endAction:true}
      ],
      clues:['C_CONFESS'] },
    { id:'a3_agnes', name:'找艾格尼丝 / 约翰', sub:'档案副本 · 时间线', bg:'archive',
      seq:[
        {who:'action', text:'艾格尼丝把一叠手抄的副本铺在桌上，约翰坐在一旁听。'},
        {who:'agnes', text:'档案的正本我拿不出来，但我抄了一份。二十年前的那页，被人撕走了。'},
        {who:'johndoe', text:'我那时候还看得见。那天夜里，钟响了十三下。'},
        {who:'me', text:'十三下。'},
        {who:'johndoe', text:'正常的钟只响十二下。第十三下，是给死人听的。', endAction:true}
      ],
      clues:['C_TIME'], secondary:['S_JOHN'] }
  ],
  4:[
    { id:'a4_crypt', name:'进墓穴', sub:'修女牌 · 颅骨', bg:'crypt',
      seq:[
        {who:'action', text:'你下到墓穴。蜡烛的光只能照亮一小块地方。'},
        {who:'action', text:'角落的遗骨上，挂着一枚修女牌。你把它翻过来——「特蕾莎·莫尔」。'},
        {who:'action', text:'颅骨右侧有一处凹陷，边缘整齐。不是摔的。'},
        {who:'me', text:'托马斯。他是被人杀的。'},
        {who:'action', text:'牌子的字迹很旧，可名字，和药房那位一模一样。', endAction:true}
      ],
      clues:['C_TAG','C_SKULL'], secondary:['S_SAMUEL_BURY'] },
    { id:'a4_priest', name:'找神父', sub:'完整坦白 · 墓穴钥匙', bg:'office',
      seq:[
        {who:'action', text:'神父这次没有点蜡烛。屋子里只剩窗外的雪光。'},
        {who:'priest', text:'那具遗骨，是托马斯。二十年前，她是拿着这个来找我的。'},
        {who:'action', text:'他把一枚旧钥匙放在桌上，推向你。'},
        {who:'priest', text:'墓穴的钥匙。你该自己去看看。'},
        {who:'priest', text:'我是共犯。这一点，我不辩。'},
        {who:'action', text:'你顺着这条线，把"机会"一槽补齐了：这把锁、这把钥匙，对得上。', endAction:true}
      ],
      clues:['C_CONFESS'], onConfirm:['C_LOCK','C_KEY'] },
    { id:'a4_testimony', name:'找塞缪尔 / 玛格丽特', sub:'埋尸证词 · 动机证词', bg:'darkBasement',
      seq:[
        {who:'action', text:'塞缪尔靠着墓穴的门坐着，玛格丽特站在他旁边，两个人都不看对方。'},
        {who:'samuel', text:'是我埋的。二十年前，她给了我一笔钱。'},
        {who:'margaret', text:'她威胁我。她说我女儿也会"不小心摔下楼梯"。'},
        {who:'me', text:'所以你一直不敢说。'},
        {who:'margaret', text:'（点头）她在买药。卖给山下的人。老本发现了。', endAction:true}
      ],
      clues:[], secondary:['S_SAMUEL_BURY','S_MARGARET'] },
    { id:'a4_theresa', name:'找特蕾莎', sub:'对峙 · 销毁证据', bg:'apothecary',
      seq:[
        {who:'action', text:'你在药房堵住了她。她不惊慌，甚至笑了。'},
        {who:'theresa', text:'守夜人，你知道得太多了。'},
        {who:'action', text:'她当着你的面，把一页账丢进蜡烛的火里。'},
        {who:'me', text:'你烧得掉一页，烧不掉所有。'},
        {who:'theresa', text:'那就试试看。天亮之前，这教堂里还有谁会信你？', endAction:true}
      ],
      clues:[], onSuspect:2 }
  ],
  5:[
    { id:'a5_survivor', name:'找幸存者补线索', sub:'补最后一块拼图', bg:'hall', free:false,
      seq:[
        {who:'action', text:'你把还活着的人一个个叫到大厅角落。有人哭着说，有人什么都不肯说。'},
        {who:'action', text:'零碎的证词拼起来，三槽里能找到的东西，都被确认了一遍。', endAction:true}
      ], clueBoost:true },
    { id:'a5_calm', name:'安抚众人', sub:'怀疑 -1', bg:'hall', free:false,
      seq:[
        {who:'action', text:'你把声音压得很低，一句一句地讲，谁都没被打断。'},
        {who:'action', text:'人群终于安静下来。有人放下了手里的东西。', endAction:true}
      ], calm:true },
    { id:'a5_cellar', name:'去地窖问被放逐者', sub:'地窖探视 · 免费', bg:'darkBasement', free:true,
      seq:[
        {who:'action', text:'地窖的门开着一条缝。被放逐的人靠着墙，眼睛在黑暗里亮着。'},
        {who:'exiled', text:'你终于来了。我一直在等有人来问我。', endAction:true}
      ], cellar:true },
    { id:'a5_notes', name:'整理案件笔记', sub:'免费 · 不占行动', bg:'office', free:true,
      seq:[
        {who:'action', text:'你把所有东西摊在桌上：锁、钥匙、账本、牌子、颅骨上的凹陷。'},
        {who:'action', text:'答案并不难。难的是，你得在天亮前说出来。', endAction:true}
      ], notes:true }
  ]
};

