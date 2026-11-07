const ENDING_DEFS = {
  bells:      { title:'钟声归位',   cg:IMG.cg.teresaArrested,  bg:IMG.bg.exterior,
                desc:'你指认了特蕾莎，三槽线索全部确认，审判的恐惧也没有越过底线。天亮时警察上了山。她被带走，神父的罪也被翻了出来。钟声第一次按时响起。', tag:'TRUE END' },
  before:     { title:'雪停之前',   cg:IMG.cg.teresaCollapse,  bg:IMG.bg.hall,
                desc:'你揭穿了特蕾莎，但只确认了两槽线索。代价已经太多，真相在雪停之前被说出口，伤痕却留在了每个人身上。', tag:'HARD END' },
  nofree:     { title:'无人自由',   cg:IMG.cg.badEnd,           bg:IMG.bg.darkBasement,
                desc:'审判的恐惧吞掉了所有人。凶手被指认出来了，可再也没有人相信任何人。教堂里剩下的，只是一群互相看守的囚徒。', tag:'BAD END' },
  bellnot:    { title:'未落下的钟', cg:IMG.cg.teresaEscape,     bg:IMG.bg.exterior,
                desc:'你的指认站不住脚。特蕾莎带着惯常的微笑，走进了风雪。那口钟，到最后也没有落下来。', tag:'BAD END' },
  scapegoat:  { title:'替罪的白袍', cg:null,                     bg:IMG.bg.darkBasement,
                desc:'你指认了神父。他在沉默中认罪，而真正的凶手站在人群后微笑。白袍替人背了罪。', tag:'WRONG END' },
  guest13:    { title:'第十三个客人', cg:IMG.cg.teresaSmirk,    bg:IMG.bg.hall,
                desc:'你手里没有任何证据，却硬把手指向了她。又或者，你把自己逼到了人人怀疑的地步。她成了第十三个客人。', tag:'BAD END' },
  nobody:     { title:'无人被逐',   cg:null,                     bg:IMG.bg.exterior,
                desc:'整场风雪里，你没有放逐过任何人。三槽都补全了，怀疑没有越线，恐惧从头到尾都是零。天亮时，没有一个人被关进地窖。', tag:'HIDDEN END' },
  hilllight:  { title:'山下的灯',   cg:IMG.cg.helenEscape,       bg:IMG.bg.inn,
                desc:'你跟着海伦坐上了雪地车。山下旅店的灯一直亮着。故事没有真相，只有活下来的人。', tag:'ESCAPE END' },
  drain:      { title:'排水道尽头的光', cg:IMG.cg.philipEscape, bg:IMG.bg.drain,
                desc:'菲利普撬开了排水道的铁栅。你跟着他爬出去，身后的教堂越来越远。你活着，但没有回头。', tag:'ESCAPE END' },
  wanderer:   { title:'风雪不归人', cg:null,                     bg:IMG.bg.porch,
                desc:'你提着行李跑进了风雪。雪越来越大，你在树林里失去了方向。早知道，就不跑了。', tag:'BAD END' }
};

const ENDING_SLOTS = [
  'bells','before','nofree','bellnot','scapegoat',
  'guest13','nobody','hilllight','drain','wanderer'
];
