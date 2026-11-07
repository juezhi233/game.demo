/* ============================================================
   第一天（night 2）· 定稿剧本数据
   ============================================================ */

/* ---------- 1. 早上 · 走廊 → 大厅 ---------- */
const D1_MORNING = [
  { bg:'bg14', who:'action', text:'你几乎没睡。这样的情况下，谁睡得着呢？你自觉没那么心大。' },
  { who:'action', text:'好不容易熬到天亮，下楼时，雪光从高窗斜进来，把走廊照得发白。' },
  { bg:'bg02', who:'action', text:'人都聚在壁炉那一片，火光明灭，明明是温暖的橙红色，依旧显出了众人脸色的苍白。' },
  { who:'action', text:'老本不在了。阁楼上的尸体不见了。' },
  { who:'action', text:'你强压着面上的疲惫，努力打起精神来。' },
  { who:'me', text:'早上好。老本呢？' },
  { who:'samuel', text:'天不亮我和约瑟夫抬下去的。停在小礼拜堂，盖上了。' },
  { who:'joseph', text:'抬的时候我就后悔了，老本应该不甘心吧，我也挺怕…' },
  { who:'action', text:'他说完自己愣了下，低头不吭声了。' },
  { who:'priest', text:'约瑟夫。' },
  { who:'joseph', text:'……当我什么都没说。' },
  { who:'action', text:'大师的椅子空着。风琴盖着布，没人往那儿看。' },
  { who:'action', text:'亨利站在窗边。哪怕在这种天气里，他依旧穿得讲究。手里翻一本硬壳的册子，翻得很慢。' },
  { who:'henry', text:'我查了旧档。这教堂二十年前出过事，一桩死亡登记。' },
  { who:'me', text:'怎么死的？' },
  { who:'henry', text:'登记上写着"病故"。可同一页边上，有人用铅笔补了两个字。' },
  { who:'me', text:'哪两个字？' },
  { who:'henry', text:'未明。后来被人擦掉了，擦得不干净。' },
  { who:'action', text:'特蕾莎从厨房那头过来，手里端着药盘。她穿一身黑袍，走得很稳。' },
  { who:'theresa', text:'药熬好了。谁的。' },
  { who:'margaret', text:'……我的，谢谢修女。' },
  { who:'action', text:'玛格丽特的存在感并不算高，刚刚你并没有注意到她也在大厅里，直到她开口说话。' },
  { who:'action', text:'同时，你也注意到她的神色很紧绷，不知道是因为什么。' },
  { who:'action', text:'特蕾莎没多看她，转身要回药房。你喊住了她。' },
  { who:'me', text:'修女，稍等一下。' },
  { who:'theresa', text:'嗯？' },
  { who:'me', text:'我没有别的意思，就是单纯问一下，老本出事那晚，你在哪？' },
  { who:'action', text:'她停下，有些诧异地看着你。' },
  { who:'theresa', text:'在药房。那里头的药，夜里也得有人看着。' },
  { who:'me', text:'有人能证明吗？' },
  { who:'theresa', text:'我一个人住药房。你要证人的话，我没有。可你要问的事，我劝你去问活人，别抓着死人做文章。' },
  { who:'action', text:'她走了。你看着她最后有些无语的表情，不知道说些什么，只好尴尬地抿抿唇。' },
  { who:'action', text:'角落里，玛格丽特的小女儿扯了扯她的衣角。' },
  { who:'peter', name:'小女孩', text:'妈妈，昨天晚上地下室有人唱歌。' },
  { who:'margaret', text:'好了，不要再提了。' },
  { who:'peter', name:'小女孩', text:'真的。穿黑衣服的阿姨，唱得轻轻的。' },
  { who:'action', text:'大厅里静了一瞬。你看向地下室的守门人。塞缪尔顿了一顿，你少见地从他身上察觉到一丝无措。' },
  { who:'samuel', text:'我昨晚没在地下室。' },
  { who:'peter', name:'小女孩', text:'不是地下室门里，是门后面，再往下。' },
  { who:'action', text:'你不敢细想这是什么意思。这不纯纯鬼片吗？' },
  { who:'action', text:'如果不是鬼片的话…' },
  { who:'action', text:'你的手不自觉摸到腰上那把锁——地窖的钥匙，一夜没动过。' },
  { who:'priest', text:'听我说。' },
  { who:'action', text:'他站到大厅中间，声音不大。' },
  { who:'priest', text:'路封了，雪没停，警察来不了。等雪化了，我们才能把这桩事交出去。' },
  { who:'joseph', text:'雪化了得几天？' },
  { who:'priest', text:'这要看老天的意思了。也许三天，也许五天。' },
  { who:'action', text:'看老天的意思应该是很没意思，因为老天但凡有意思，就不该下这么场大雪。你苦中作乐地想。' },
  { who:'priest', text:'可凶手留在这院里。昨晚死了一个，今晚还会再有人。我不能等雪化。' },
  { who:'me', text:'你想怎么办。' },
  { who:'priest', text:'钥匙我昨晚交给你了，规矩也说了——从今晚起，每夜一个人，你挑，送进地窖。' },
  { who:'henry', text:'凭什么关人？没有证据，你关的是人不是鬼。' },
  { who:'priest', text:'我知道。可有一个人被关着，凶手至少得掂量掂量。关错了，是我错；不关，死的是你们。' },
  { who:'action', text:'亨利没再说什么，把册子合上，显出种沉思来。' },
  { who:'priest', text:'许赎。' },
  { who:'me', text:'哎。' },
  { who:'priest', text:'我相信你，孩子。' },
  { who:'action', text:'你头脑一阵疼痛。' },
  { who:'action', text:'以前知道你的人生你负责的时候，就已经很头疼了，没有更靠谱的人能负责吗？' },
  { who:'action', text:'现在好了，愚者多劳，别人的人生也要你来负责了。' },
  { who:'me', text:'我尽量吧…' },
  { who:'action', text:'〔线索：亨利发现二十年前死亡登记的"未明"二字被擦过〕', unlock:'S_HENRY_REG' },
  { who:'action', text:'〔线索：特蕾莎说老本出事那晚她独自在药房，无人作证〕', unlock:'S_THERESA' },
  { who:'action', text:'〔线索：玛格丽特的女儿说地下室门后有人唱歌〕', unlock:'S_MARGARET' },
  { proStep:'d1Group' }
];

/* ---------- 2. 白天群聊 ---------- */
const D1_GROUP = [
  {speaker:'priest', text:'雪没停。所有人白天不要单独行动。'},
  {speaker:'agnes',  text:'我在西廊查档案，谁能来搭把手就过来。'},
  {speaker:'henry',  text:'我回房间整理登记册。'},
  {speaker:'samuel', text:'我去把地下室的门加固一下，昨晚风把门吹开了。'},
  {speaker:'joseph', text:'那门本来就没锁好。'},
  {speaker:'samuel', text:'那今晚你下去睡。'},
  {speaker:'joseph', text:'……'},
  {speaker:'mary',   text:'粥在灶上，谁起来晚了自己热，别烫着。'}
];
const D1_GROUP_AFTER = [
  {speaker:'agnes',  text:'行。'},
  {speaker:'peter',  text:'……好的。'}
];

/* ---------- 3. 找人说话（四选一） ---------- */
const D1_TALK_CHOICES = [
  { key:'henry',   t:'找亨利，问那本登记册', then:[
    { who:'action', text:'你快步跟上亨利，斟酌着问。' },
    { who:'me', text:'登记册上那两个字，你打算怎么查实？' },
    { who:'henry', text:'当然是查人。二十年前谁管档案，谁就有机会补那两个字。' },
    { who:'me', text:'可是。' },
    { who:'action', text:'你犹豫了一下，还是说了。' },
    { who:'me', text:'神父，好像是，管了三十年。' },
    { who:'henry', text:'……你啊，问得比我狠。' },
    { who:'action', text:'他笑了一下。' }
  ]},
  { key:'agnes',   t:'找艾格尼丝，问旧档的事', then:[
    { who:'action', text:'你快步跟上艾格尼丝，斟酌着问。' },
    { who:'me', text:'艾格尼丝小姐，你查旧档，查到什么了？' },
    { who:'agnes', text:'啊，守夜人先生。调任记录。北边调来一个人，名字被涂黑了，怎么都看不清。' },
    { who:'me', text:'涂黑？' },
    { who:'agnes', text:'也许是有人不想让人看见。可纸背有压痕，对着光能认出半个字。' }
  ]},
  { key:'margaret', t:'找玛格丽特，问孩子说的"黑衣服阿姨"', then:[
    { who:'action', text:'你快步追上玛格丽特，斟酌着问。' },
    { who:'me', text:'玛格丽特小姐。冒昧问问，孩子说的那个，你不当回事？' },
    { who:'margaret', text:'小孩子夜里睡不着，什么都能编。' },
    { who:'me', text:'她编得出这么详细的吗？' },
    { who:'action', text:'玛格丽特没吭声，抱紧了孩子，过了很久才小声说：' },
    { who:'margaret', text:'……我也听见过一回。在楼下，很低地唱。' },
    { who:'action', text:'她不肯再多说，走得更快了。' }
  ]},
  { key:'loft',    t:'谁都不问，自己到阁楼再走一遍', then:[
    { who:'bg_img', bg:'bg03' },
    { who:'action', text:'你一个人回了阁楼。' },
    { who:'action', text:'绳子已经解了，横梁上留着一圈磨白的印子，位置有点偏，不像是从正上方吊下去的。' },
    { who:'action', text:'地上有半个脚印，兴许是被人擦过，只剩鞋跟一点边。' },
    { who:'action', text:'你蹲下去看。' },
    { who:'action', text:'那印子比老本的脚小。' }
  ]}
];

const D1_AFTER_TALK = [
  { bg:'bg14', who:'action', text:'不管问谁，散场前神父都会在走廊尽头叫住你。' },
  { who:'priest', text:'孩子，你过来一下。' },
  { who:'action', text:'他把一张纸递过来，上头写着几个名字。' },
  { who:'priest', text:'今晚地窖的名单，你自己定。' },
  { who:'action', text:'纸上：约瑟夫、塞缪尔、艾格尼丝、彼得、玛丽。' },
  { who:'action', text:'〔第一天开始。每夜免费巡查一次，行动点 2。〕', proStep:'d1ToFree' }
];
