type Lang = 'en' | 'bn';
type Cat = 'nature' | 'heritage' | 'landmark' | 'food';

interface Bi {
  en: string;
  bn: string;
}
interface District extends Bi {
  id: string;
  div: Bi;
  sum: Bi | null;
  months: number[];
  note: string;
  places: Array<Bi & { cat: Exclude<Cat, 'food'> }>;
  food: Bi[];
}

const MONTHS: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
};
const CATS: Array<{ id: Cat; icon: string; label: Bi }> = [
  { id: 'nature', icon: '🌿', label: { en: 'Nature', bn: 'প্রকৃতি' } },
  { id: 'heritage', icon: '🏛️', label: { en: 'Heritage', bn: 'ঐতিহ্য' } },
  { id: 'landmark', icon: '📍', label: { en: 'Landmarks', bn: 'স্থাপনা' } },
  { id: 'food', icon: '🍛', label: { en: 'Famous food', bn: 'বিখ্যাত খাবার' } },
];
const TXT = {
  places: { en: 'Places to see', bn: 'দর্শনীয় স্থান' },
  food: { en: 'Famous food', bn: 'বিখ্যাত খাবার' },
  best: { en: 'Best time', bn: 'সেরা সময়' },
  stays: { en: 'Stays & contacts', bn: 'থাকা ও যোগাযোগ' },
  division: { en: 'Division', bn: 'বিভাগ' },
  placesN: { en: 'places', bn: 'টি স্থান' },
  less: { en: 'Show less', bn: 'কম দেখুন' },
  more: { en: 'Show more', bn: 'আরও দেখুন' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
};
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const num = (lang: Lang, n: number) => (lang === 'bn' ? String(n).replace(/\d/g, (d) => BN_DIGITS[+d]) : String(n));
const PAGE = 12;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function initExplore(getLang: () => Lang) {
  let data: District[] = [];
  let counts = new Map<string, number>();
  let cat: Cat = 'nature';
  let expanded = false;
  let openId: string | null = null;
  const byId = new Map<string, District>();

  const dialog = document.getElementById('place') as HTMLDialogElement | null;
  const name = (d: District, lang: Lang) => (lang === 'bn' ? d.bn : d.en);

  function openPlace(id: string) {
    const d = byId.get(id);
    if (!d || !dialog) return false;
    openId = id;
    fillDialog(d, getLang());
    if (!dialog.open) dialog.showModal();
    return true;
  }

  function fillDialog(d: District, lang: Lang) {
    document.getElementById('place-title')!.textContent = `${d.en} | ${d.bn}`;
    document.getElementById('place-div')!.textContent = `${d.div[lang]} ${TXT.division[lang]}`;
    (document.getElementById('place-close') as HTMLButtonElement).setAttribute('aria-label', TXT.close[lang]);
    const body = document.getElementById('place-body')!;
    body.replaceChildren();
    if (d.sum) body.append(el('p', 'sum', d.sum[lang]));
    if (d.months.length) {
      body.append(el('h3', '', TXT.best[lang]));
      const chips = el('div', 'chips');
      for (const m of d.months) chips.append(el('span', 'chip', MONTHS[lang][m - 1]));
      body.append(chips);
      if (lang === 'en' && d.note) body.append(el('p', 'muted small', d.note));
    }
    if (d.places.length) {
      body.append(el('h3', '', TXT.places[lang]));
      const ul = el('ul', 'plist');
      for (const p of d.places) {
        const li = el('li');
        li.append(el('span', '', `${CATS.find((c) => c.id === p.cat)?.icon ?? ''} ${p[lang]}`));
        ul.append(li);
      }
      body.append(ul);
    }
    if (d.food.length) {
      body.append(el('h3', '', TXT.food[lang]));
      const ul = el('ul', 'plist');
      for (const f of d.food) ul.append(el('li', '', `🍛 ${f[lang]}`));
      body.append(ul);
    }
    (document.getElementById('place-map') as HTMLAnchorElement).href = `/tracker?d=${encodeURIComponent(d.id)}`;
    const stays = document.getElementById('place-stays') as HTMLAnchorElement;
    const n = counts.get(d.id) ?? 0;
    stays.hidden = n === 0;
    stays.href = `/tracker?d=${encodeURIComponent(d.id)}#directory`;
    stays.textContent = `${TXT.stays[lang]} (${num(lang, n)})`;
  }

  function districtButton(d: District, lang: Lang, sub?: string) {
    const b = el('button', 'dcard');
    b.type = 'button';
    b.dataset.district = d.id;
    b.append(el('strong', '', name(d, lang)));
    b.append(el('small', '', sub ?? `${d.div[lang]} · ${num(lang, d.places.length)} ${TXT.placesN[lang]}`));
    return b;
  }

  function render() {
    if (!data.length) return;
    const lang = getLang();

    // This month
    const m = new Date().getMonth() + 1;
    document.getElementById('month-name')!.textContent = MONTHS[lang][m - 1];
    const month = data.filter((d) => d.months.includes(m)).sort((a, b) => b.places.length - a.places.length);
    const rail = document.getElementById('month-list')!;
    rail.replaceChildren(...month.map((d) => districtButton(d, lang, d.places.slice(0, 2).map((p) => p[lang]).join(' · ') || d.div[lang])));
    document.getElementById('month')!.hidden = month.length === 0;

    // Things to do
    const tabs = document.getElementById('todo-tabs')!;
    tabs.replaceChildren(
      ...CATS.map((c) => {
        const b = el('button', c.id === cat ? 'on' : '', `${c.icon} ${c.label[lang]}`);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(c.id === cat));
        b.addEventListener('click', () => {
          cat = c.id;
          expanded = false;
          render();
        });
        return b;
      }),
    );
    const items: Array<{ d: District; label: string }> = [];
    for (const d of data) {
      if (cat === 'food') for (const f of d.food) items.push({ d, label: f[lang] });
      else for (const p of d.places) if (p.cat === cat) items.push({ d, label: p[lang] });
    }
    const shown = expanded ? items : items.slice(0, PAGE);
    const icon = CATS.find((c) => c.id === cat)!.icon;
    document.getElementById('todo-list')!.replaceChildren(
      ...shown.map(({ d, label }) => {
        const b = el('button', 'tcard');
        b.type = 'button';
        b.dataset.district = d.id;
        b.append(el('span', 'ti', icon));
        const t = el('span', 'tt');
        t.append(el('strong', '', label), el('small', '', `${name(d, lang)} · ${d.div[lang]}`));
        b.append(t);
        return b;
      }),
    );
    const more = document.getElementById('todo-more') as HTMLButtonElement;
    more.hidden = items.length <= PAGE;
    more.textContent = expanded ? TXT.less[lang] : `${TXT.more[lang]} (${num(lang, items.length - PAGE)})`;
    document.getElementById('todo')!.hidden = false;

    // All districts by division
    const divs = new Map<string, District[]>();
    for (const d of data) {
      const k = d.div.en;
      if (!divs.has(k)) divs.set(k, []);
      divs.get(k)!.push(d);
    }
    const wrap = document.getElementById('div-list')!;
    wrap.replaceChildren(
      ...[...divs.values()].map((list) => {
        const box = el('div', 'divbox');
        box.append(el('h3', '', `${list[0].div[lang]} ${TXT.division[lang]} (${num(lang, list.length)})`));
        const chips = el('div', 'chips');
        for (const d of [...list].sort((a, b) => name(a, lang).localeCompare(name(b, lang), lang))) {
          const b = el('button', 'chip', name(d, lang));
          b.type = 'button';
          b.dataset.district = d.id;
          chips.append(b);
        }
        box.append(chips);
        return box;
      }),
    );
    document.getElementById('all')!.hidden = false;

    if (openId && dialog?.open) fillDialog(byId.get(openId)!, lang);
  }

  // One delegated handler: any element with data-district opens the place dialog.
  document.addEventListener('click', (e) => {
    const target = (e.target as Element).closest<HTMLElement>('[data-district]');
    if (!target || e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (openPlace(target.dataset.district!)) e.preventDefault();
  });
  document.getElementById('todo-more')?.addEventListener('click', () => {
    expanded = !expanded;
    render();
  });
  document.getElementById('place-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    openId = null;
  });

  Promise.all([
    fetch('/tracker-data/explore.json').then((r) => (r.ok ? r.json() : [])),
    fetch('/tracker-data/listings.json')
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ])
    .then(([d, listings]: [District[], Array<{ district: string }>]) => {
      data = Array.isArray(d) ? d : [];
      for (const x of data) byId.set(x.id, x);
      counts = new Map();
      for (const l of Array.isArray(listings) ? listings : []) counts.set(l.district, (counts.get(l.district) ?? 0) + 1);
      render();
    })
    .catch(() => undefined);

  return render;
}
