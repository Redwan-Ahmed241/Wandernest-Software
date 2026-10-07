import { useEffect, useMemo, useState } from 'react';
import type { DistrictIndex, Lang, Listing, ListingKind } from '../domain/types';
import { repository } from '../domain/repository';
import { num, t } from '../i18n';
import ListingCard, { UnverifiedNotice } from './ListingCard';
import { sortListings } from '../domain/listings';

const norm = (s: string) => s.toLowerCase().normalize('NFC');

export default function DirectoryView({
  lang,
  index,
  district,
  onDistrict,
}: {
  lang: Lang;
  index: DistrictIndex | null;
  district: string;
  onDistrict: (id: string) => void;
}) {
  const [all, setAll] = useState<Listing[] | null>(null);
  const [kind, setKind] = useState<ListingKind | 'all'>('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    repository.getListings().then(setAll);
  }, []);

  const names = useMemo(
    () => new Map((index?.districts ?? []).map((d) => [d.id, lang === 'bn' ? d.name_bn : d.name_en])),
    [index, lang],
  );
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of all ?? []) m.set(l.district, (m.get(l.district) ?? 0) + 1);
    return m;
  }, [all]);

  const shown = useMemo(() => {
    const qq = norm(q.trim());
    return (all ?? [])
      .filter((l) => (district ? l.district === district : true))
      .filter((l) => (kind === 'all' ? true : l.kind === kind))
      .filter((l) => !qq || norm(`${l.name} ${l.area ?? ''}`).includes(qq))
      .sort(sortListings);
  }, [all, district, kind, q]);

  return (
    <section className="view directory">
      <h1>{t(lang, 'dirTitle')}</h1>
      <UnverifiedNotice lang={lang} />

      <div className="filters">
        <select value={district} onChange={(e) => onDistrict(e.target.value)} aria-label={t(lang, 'allDistricts')}>
          <option value="">
            {t(lang, 'allDistricts')} ({num(lang, all?.length ?? 0)})
          </option>
          {index?.divisions.map((dv) => (
            <optgroup key={dv.id} label={lang === 'bn' ? dv.bn : dv.en}>
              {index.districts
                .filter((d) => d.division === dv.id)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {names.get(d.id)} ({num(lang, counts.get(d.id) ?? 0)})
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <input
          type="search"
          value={q}
          maxLength={40}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, 'dirSearch')}
          aria-label={t(lang, 'dirSearch')}
        />
        <div className="seg" role="group">
          {(['all', 'stay', 'guide', 'tour'] as const).map((k) => (
            <button key={k} type="button" className={kind === k ? 'on' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {t(lang, k === 'all' ? 'kindAll' : k === 'stay' ? 'kindStay' : k === 'guide' ? 'kindGuide' : 'kindTour')}
            </button>
          ))}
        </div>
      </div>

      {all === null ? (
        <p className="muted">…</p>
      ) : shown.length === 0 ? (
        <p className="muted">{t(lang, 'dirEmpty')}</p>
      ) : (
        <>
          <p className="muted">
            {num(lang, shown.length)} {t(lang, 'dirCount')}
          </p>
          <ul className="listings">
            {shown.map((l) => (
              <ListingCard key={l.id} listing={l} lang={lang} districtName={names.get(l.district)} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
