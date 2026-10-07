import { useEffect, useMemo, useState } from 'react';
import type { DistrictIndex, Lang } from '../domain/types';
import { decodeMask, encodeMask } from '../domain/share';
import { MAX_MEMBERS, cleanName, codeFromInput, type Member } from '../domain/group';
import { num, t } from '../i18n';
import LivingFlagMap, { type DistrictInfo, type MapDistrict } from './LivingFlagMap';

const KEY = 'wn.group.v1';
const NAME_KEY = 'wn.group.me';
const MAX = MAX_MEMBERS;

function load(): Member[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .map((m) => ({ name: cleanName(String(m?.name ?? '')), code: String(m?.code ?? '') }))
      .filter((m) => m.name && decodeMask(m.code))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export default function GroupView({
  lang,
  index,
  myVisited,
  districts,
  viewBox,
  info,
  initial,
}: {
  lang: Lang;
  index: DistrictIndex | null;
  myVisited: number[];
  districts: MapDistrict[];
  viewBox: [number, number];
  info: Record<string, DistrictInfo>;
  initial: Member[];
}) {
  const myCode = encodeMask(myVisited);
  const [friends, setFriends] = useState<Member[]>(() => {
    const merged = [...load()];
    for (const m of initial) {
      if (m.code === myCode || merged.some((x) => x.code === m.code) || merged.length >= MAX) continue;
      merged.push(m);
    }
    return merged;
  });
  const [myName, setMyName] = useState(() => {
    try {
      return cleanName(localStorage.getItem(NAME_KEY) ?? '');
    } catch {
      return '';
    }
  });
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [err, setErr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(friends));
    } catch {
      /* ignore */
    }
  }, [friends]);
  useEffect(() => {
    try {
      localStorage.setItem(NAME_KEY, myName);
    } catch {
      /* ignore */
    }
  }, [myName]);

  const bitToId = useMemo(() => districts.map((d) => d.id), [districts]);
  const me = t(lang, 'grpMe');
  const members = useMemo(
    () => [
      { name: me, bits: new Set(myVisited), code: encodeMask(myVisited), self: true },
      ...friends.map((f) => ({ name: f.name, bits: decodeMask(f.code) ?? new Set<number>(), code: f.code, self: false })),
    ],
    [friends, myVisited, me],
  );

  const union = useMemo(() => {
    const s = new Set<number>();
    for (const m of members) for (const b of m.bits) s.add(b);
    return s;
  }, [members]);
  const everyone = useMemo(
    () => [...union].filter((b) => members.every((m) => m.bits.has(b))),
    [union, members],
  );
  const nobody = useMemo(() => bitToId.map((_, i) => i).filter((b) => !union.has(b)), [bitToId, union]);

  const unionIds = useMemo(() => new Set([...union].map((b) => bitToId[b])), [union, bitToId]);
  const everyoneIds = useMemo(() => new Set(everyone.map((b) => bitToId[b])), [everyone, bitToId]);
  const pct = Math.round((union.size / 64) * 100);
  const nameOf = (bit: number) => info[bitToId[bit]]?.name ?? bitToId[bit];

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeFromInput(link);
    const n = cleanName(name);
    if (!code || !n) {
      setErr(true);
      return;
    }
    setErr(false);
    setFriends((f) => (f.length >= MAX ? f : [...f.filter((x) => x.code !== code), { name: n, code }]));
    setName('');
    setLink('');
  };

  const groupLink = useMemo(() => {
    const parts = [`${cleanName(myName) || 'Friend'}.${myCode}`, ...friends.map((f) => `${f.name}.${f.code}`)];
    return `${window.location.origin}${window.location.pathname}?g=${encodeURIComponent(parts.join('~'))}#group`;
  }, [friends, myName, myCode]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(groupLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t(lang, 'grpShare'), groupLink);
    }
  };

  const whoVisited = selected
    ? members.filter((m) => m.bits.has(bitToId.indexOf(selected))).map((m) => m.name)
    : [];

  return (
    <section className="view group">
      <div className="group-grid">
        <div className="group-side">
          <h1>{t(lang, 'grpTitle')}</h1>
          <p className="muted">{t(lang, 'grpSub')}</p>

          <div className="score">
            <div className="big">
              {num(lang, union.size)}
              <span>/{num(lang, 64)}</span>
            </div>
            <div className="meta">
              <strong>
                {num(lang, pct)}% {t(lang, 'grpTogether')}
              </strong>
            </div>
            <div className="progress" aria-hidden="true">
              <i style={{ width: `${pct}%` }} />
            </div>
          </div>

          <ul className="members">
            {members.map((m) => (
              <li key={m.code + m.name}>
                <span>{m.name}</span>
                <span className="track">
                  <i style={{ width: `${(m.bits.size / 64) * 100}%` }} />
                </span>
                <span className="n">{num(lang, m.bits.size)}</span>
                {!m.self && (
                  <button
                    type="button"
                    className="x sm"
                    aria-label={`${t(lang, 'grpRemove')} ${m.name}`}
                    onClick={() => setFriends((f) => f.filter((x) => x.code !== m.code))}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          {friends.length < MAX ? (
            <form className="add-friend" onSubmit={add}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, 'grpName')} maxLength={20} />
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={t(lang, 'grpLink')} maxLength={300} />
              <button type="submit" className="btn red">
                + {t(lang, 'grpAdd')}
              </button>
              {err && <p className="err">{t(lang, 'grpBadLink')}</p>}
            </form>
          ) : (
            <p className="muted">{t(lang, 'grpMax')}</p>
          )}

          <input
            className="my-name"
            value={myName}
            maxLength={20}
            onChange={(e) => setMyName(e.target.value)}
            placeholder={t(lang, 'grpYourName')}
            aria-label={t(lang, 'grpYourName')}
          />
          <button type="button" className="btn wide" onClick={copy} disabled={friends.length === 0}>
            {copied ? t(lang, 'copied') : t(lang, 'grpShare')}
          </button>

          {members.length > 1 && everyone.length > 0 && (
            <>
              <h3>{t(lang, 'grpEveryone')}</h3>
              <div className="chips">
                {everyone.map((b) => (
                  <span key={b} className="chip">
                    {nameOf(b)}
                  </span>
                ))}
              </div>
            </>
          )}
          {index && nobody.length > 0 && (
            <>
              <h3>{t(lang, 'grpNobody')}</h3>
              <div className="chips">
                {nobody.map((b) => (
                  <span key={b} className="chip dim">
                    {nameOf(b)}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="group-map">
          {selected && (
            <p className="who-visited">
              <strong>{info[selected]?.both}</strong>: {whoVisited.length ? whoVisited.join(', ') : '—'}
            </p>
          )}
          <LivingFlagMap
            districts={districts}
            viewBox={viewBox}
            visited={everyoneIds}
            want={new Set([...unionIds].filter((id) => !everyoneIds.has(id)))}
            selected={selected}
            justChanged={null}
            info={info}
            lang={lang}
            onSelect={setSelected}
            legend={[t(lang, 'grpLegendAll'), t(lang, 'grpLegendSome'), t(lang, 'grpLegendNone')]}
          />
        </div>
      </div>
    </section>
  );
}
