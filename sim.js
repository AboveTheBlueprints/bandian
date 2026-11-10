// 斑点 网页版的规矩（第五个 第 16 天，照 ~/碰/斑点/斑点.py 一行一行搬；test/对.py 拿随机动作逐行对 py）
var BD_SELL = [75, 50, 30, 15];
var BD_LAST_SEEN = {
  '卖': '是跟着买它的人走的',
  '岛': '它站在河心沙洲上',
  '拴': '它拴在下游那间旧木屋里',
  '换': '它跟着找铜矿的那伙人进了山',
  'Steve': '它半夜朝下游走了'
};
var BD_COME_BACK = {
  '卖': '脖子上还拖着新买主的半截绳子',
  '岛': '浑身是湿的，毛上结着冰碴',
  '拴': '嘴边挂着咬断的绳头',
  '换': '瘦了一圈，爪子磨秃了',
  'Steve': '嘴边一圈油，身上一股 Steve 那烟斗丝的味'
};
var BD_STEVE = [
  'Steve 坐起来，瞪着它：“它怎么知道我们在这儿？”',
  'Steve 说：“我跟你说，这狗眼睛里有东西。”',
  'Steve 半天没说话，后来说：“你告诉我，它怎么知道的？”',
  'Steve 说：“我不想再看它的眼睛了。”',
  'Steve 把毯子拉过头顶。'
];
var BD_NAMES = {'培根': '煎培根', '豆子': '煮豆子', '饼': '拿面粉烙饼', '捎信': '托人给Steve捎句话', '卖': '卖了它', '岛': '划船扔到河心沙洲上',
  '拴': '拴到下游旧木屋里', '换': '换两袋面粉', '不甩': '不甩，带着'};

function bdNew() {
  return {day: 1, bacon: 3, money: 20, flour: 0, spot: '营地', sold: 0, steve_i: 0, log: [], phase: '早饭',
          fried: false, cake: false, today: {}, st_bacon: 0, st_nights: 0, st_paid: 0, last_seen: null, warned: 0, st_stolen: 0};
}

function bdMenu(s) {
  var opts;
  if (s.phase === '早饭') {
    opts = (s.bacon > 0 ? ['培根'] : []).concat(['豆子']).concat(s.flour > 0 ? ['饼'] : []);
    if (s.day >= 5 && !s.warned) opts.push('捎信');
    return opts;
  }
  if (s.phase === '甩') {
    opts = [];
    if (s.sold < BD_SELL.length) opts.push('卖');
    return opts.concat(['岛', '拴', '换', '不甩']);
  }
  return [];
}

function bdMorning(s, out) {
  out.push('');
  out.push('—— 第 ' + s.day + ' 天早上 ——');
  if (s.day === 5) {
    out.push('Steve 从道森回来了，背回六扇培根，给你留下三扇。他说从今天起他一个人跑下游那条线，在亨德森河口另扎一处营地，离你这儿十几里。他把自己那三扇挂在爬犁上，说到了那边头一件事就是煎一锅，叼着烟斗套上狗走了。');
    s.bacon += 3;
    s.st_bacon = 3;
  }
  if (s.warned && s.day === s.warned + 1) out.push('下游捎回 Steve 一句话：“知道了。我把培根埋进雪里了，这几天吃豆子。”');
  if (s.spot === '营地') out.push('斑点在营地里，趴在雪上看着你。');
  else out.push('斑点不在。最后一回见它，' + BD_LAST_SEEN[s.last_seen] + '。');
  out.push('库里培根：' + s.bacon + ' 扇。钱：' + s.money + ' 块。' + (s.flour ? '面粉：' + s.flour + ' 袋。' : ''));
  s.phase = '早饭';
  s.today = {day: s.day};
}

function bdShowMenu(s, out) {
  var m = bdMenu(s);
  if (m.length) out.push('这会儿能做：' + m.map(function (k) { return k + '（' + BD_NAMES[k] + '）'; }).join('　'));
}

function bdNight(s, out) {
  var t = s.today;
  if (s.fried) { s.money += 10; out.push('白天拉了一天货。早上那顿培根顶饿，挣了 10 块。'); }
  else if (s.cake) { s.money += 8; out.push('白天拉了一天货。面饼还算顶饿，挣了 8 块。'); }
  else { s.money += 5; out.push('白天拉了一天货。豆子不顶饿，下午腿就软了，挣了 5 块。'); }
  out.push('夜里。');
  var buried = !!(s.warned && s.day > s.warned);
  var steveFries = s.day >= 5 && s.st_bacon > 0 && !buried;
  if (steveFries) s.st_bacon -= 1;
  var WHERE = {'卖': '买主那儿', '岛': '沙洲', '拴': '旧木屋', '换': '找铜矿的那伙人那儿', 'Steve': '下游'};
  if (s.fried && s.spot !== '营地') {
    var frm = s.spot;
    out.push('半夜营地里一阵狗打架。斑点回来了，' + BD_COME_BACK[frm] + '。它先去把煎锅舔了一遍，锅底舔得锃亮，才回头把你们那几条狗挨个收拾了。');
    if (s.day <= 4) { out.push(BD_STEVE[Math.min(s.steve_i, BD_STEVE.length - 1)]); s.steve_i += 1; }
    else out.push('你一个人坐起来，看着它。');
    s.spot = '营地';
    t['夜'] = '斑点回来了（从' + WHERE[frm] + '），舔了锅';
  } else if (s.spot === '营地' && !s.fried && steveFries) {
    out.push('半夜斑点从火边站起来，鼻子朝下游嗅了一阵，走了。你没拦它。');
    s.spot = 'Steve';
    s.last_seen = 'Steve';
    t['夜'] = '斑点半夜朝下游走了';
  } else if (s.spot === '营地') {
    if (s.fried) out.push('斑点趴在火边，鼻子一直朝着煎锅。');
    t['夜'] = '斑点在营地';
  } else {
    if (steveFries && s.spot !== 'Steve') s.spot = 'Steve';
    out.push('营地里很静。' + (s.day <= 4 ? '你们的狗睡得很好。' : '你的狗睡得很好。'));
    t['夜'] = '斑点没回来';
  }
  if (s.spot === '营地') {
    if (s.bacon > 0) {
      s.bacon -= 1;
      out.push('第二天一早，挂培根的绳子是咬断的，培根少了一扇。');
      t['夜'] += '；偷了一扇培根';
    } else {
      s.money -= 10;
      out.push('第二天一早，隔壁营地的人找上门来，说半夜丢了一整条熏肉，雪上的脚印一直通到你' + (s.day <= 4 ? '们' : '的') + '帐篷。你赔了 10 块。');
      t['夜'] += '；偷了隔壁，赔 10 块';
    }
  }
  if (s.day >= 5) {
    if (s.spot === 'Steve') {
      s.st_nights += 1;
      if (s.st_bacon > 0 && !buried) {
        s.st_bacon -= 1;
        s.st_stolen += 1;
        t['Steve'] = '斑点在他那儿，偷了他一扇培根';
      } else {
        s.st_paid += 10;
        t['Steve'] = '斑点在他那儿，偷了他隔壁，他赔 10 块';
      }
    } else {
      t['Steve'] = steveFries ? '煎了培根' : (buried ? '培根埋了，吃豆子' : '吃豆子');
    }
  }
  s.log.push(t);
  s.day += 1;
}

function bdAct(s, a, out) {
  var m = bdMenu(s);
  if (m.indexOf(a) < 0) { out.push('（“' + a + '”现在做不了。）'); return; }
  out.push('');
  out.push('> ' + BD_NAMES[a]);
  if (s.phase === '早饭') {
    if (a === '捎信') {
      s.warned = s.day;
      out.push('有个往下游去的人在你营地喝了碗茶。你托他给 Steve 捎句话：斑点是闻着培根锅去的。他点点头走了。');
      s.today['捎信'] = true;
      return;
    }
    s.today['早饭'] = {'培根': '培根', '豆子': '豆子', '饼': '面饼'}[a];
    if (a === '饼') {
      s.flour -= 1; s.fried = false; s.cake = true;
      out.push('你拿一袋面粉和了面，在锅里干烙了几张饼，一点油也没放。饼有点硬，可比豆子顶饿。');
    } else if (a === '培根') {
      s.bacon -= 1; s.fried = true; s.cake = false;
      out.push('培根在锅里滋滋响。你把饼干在油里蘸了，夹上一片，吃得很舒坦。' + (s.day <= 4 ? 'Steve 吃得眉开眼笑。' : ''));
    } else {
      s.fried = false; s.cake = false;
      if (s.day <= 4) out.push('你们煮了一锅豆子。Steve 一边吃一边念叨培根。');
      else out.push('你煮了一锅豆子，一个人吃，吃得不怎么香。');
    }
    if (s.spot === '营地') { s.phase = '甩'; return; }
    s.today['甩'] = '（它不在）';
    bdNight(s, out);
    return;
  }
  if (s.phase === '甩') {
    if (a === '不甩') {
      out.push((s.day <= 4 ? '你们' : '你') + '套上爬犁出发。斑点跟在后面，一磅不拉。');
      s.today['甩'] = '不甩';
    } else if (a === '卖') {
      var p = BD_SELL[s.sold];
      s.sold += 1;
      s.money += p;
      s.spot = '卖';
      var lines = ['一个骑警看它长得好，出了 %d 块。你们说"没驯过"，他说不要紧。',
                   '一个往道森送公文的信差出了 %d 块。他说这么好的狗，一路上就能拉熟。',
                   '一个刚上岸的新手出了 %d 块。他看着它的眼睛看了好一会儿，才把钱递过来。',
                   '一个老头出了 %d 块，说是这条河上剩下唯一一个没听说过它的人了。'];
      out.push(lines[s.sold - 1].replace('%d', p));
      s.today['甩'] = '卖（' + p + ' 块）';
    } else if (a === '岛') {
      s.spot = '岛';
      out.push('你们划船到河心，它一跳上沙洲，你们就把船撑开了。它站在沙洲上看着你们走，没叫。');
      s.today['甩'] = '扔沙洲';
    } else if (a === '拴') {
      s.spot = '拴';
      out.push('你们拿最粗的绳子把它拴在下游那间旧木屋里，门从外面顶上了。');
      s.today['甩'] = '拴旧木屋';
    } else if (a === '换') {
      s.spot = '换';
      s.flour += 2;
      out.push('一伙往白河去找铜矿的人拿两袋面粉换了它。他们套上它，往山里去了。');
      s.today['甩'] = '换面粉';
    }
    if (['卖', '岛', '拴', '换'].indexOf(a) >= 0) s.last_seen = a;
    if (s.sold === BD_SELL.length && a === '卖') out.push('（Steve 说，这条河上怕是再没人肯买它了。）');
    bdNight(s, out);
  }
}

function bdRun(acts) {
  var s = bdNew();
  var out = ['你和 Steve 在育空河上给人拉货过冬。去年秋天你们花一百一十块买了条狗，长得是你见过最好看的，身上一块水桶那么大的黑斑，就叫它斑点。',
             '它一磅也不拉。它偷吃。你们商量好了：这个冬天得把它甩掉。'];
  bdMorning(s, out);
  for (var i = 0; i < acts.length; i++) {
    if (s.day > 7) break;
    var before = s.day;
    bdAct(s, acts[i], out);
    if (s.day !== before && s.day <= 7) bdMorning(s, out);
  }
  if (s.day <= 7) {
    var ask = bdMenu(s);
    bdShowMenu(s, out);
    return {out: out, done: false, ask: ask, s: s};
  }
  out.push('');
  out.push('—— 七天过去了 ——');
  out.push('钱：' + s.money + ' 块。面粉：' + s.flour + ' 袋。');
  out.push(s.spot === '营地' ? '斑点还在营地里，趴在雪上看着你。' : '斑点不在你的营地。');
  if (s.st_nights > 0) {
    out.push('');
    out.push('过了几天，下游捎来 Steve 一封信' + (s.warned ? '：' : '，字写得很重：'));
    var L = '斑点这 ' + s.st_nights + ' 夜都在我这儿。';
    if (s.st_stolen) L += '偷了我 ' + s.st_stolen + ' 扇培根。';
    if (s.warned) {
      L += '你捎的话我收到了，剩下的培根我埋进了雪里，它找不着，';
      L += s.st_paid ? '就天天去偷邻居，我替它赔了 ' + s.st_paid + ' 块。' : '倒也没再偷着什么。';
    } else if (s.st_paid) {
      L += '偷完了我的又去偷邻居，我替它赔了 ' + s.st_paid + ' 块。';
    }
    if (s.spot === 'Steve') {
      if (s.warned) L += '它趴在我门口不走。我琢磨着，你那边要是煎一锅，它准回去。';
      else L += '它现在还趴在我门口。我知道它是从你那儿来的。你一个字也没跟我说。';
    } else if (!s.warned) {
      L += '我知道它是从你那儿来的。你一个字也没跟我说。';
    }
    out.push('  “' + L + '”');
  }
  if (s.st_nights === 0 && s.warned) {
    out.push('');
    out.push('过了几天，下游捎来 Steve 一封信：');
    out.push('  “谢谢你捎的话。那几扇培根还在雪里埋着，我天天吃豆子，嘴里淡出鸟来。斑点一回也没来过。”');
  }
  out.push('');
  out.push('回头看这七天：');
  for (var j = 0; j < s.log.length; j++) {
    var t = s.log[j];
    var line = '  第 ' + t.day + ' 天　早饭：' + (t['早饭'] || '') + '　甩：' + (t['甩'] || '') + '　夜里：' + (t['夜'] || '');
    if (t['Steve'] !== undefined) line += '　Steve 那边：' + t['Steve'];
    if (t['捎信']) line += '　（这天你给 Steve 捎了话）';
    out.push(line);
  }
  return {out: out, done: true, ask: [], s: s};
}

if (typeof module !== 'undefined') module.exports = {bdRun: bdRun, BD_NAMES: BD_NAMES};
