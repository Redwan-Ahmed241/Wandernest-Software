import type { Lang, Listing } from '../domain/types';
import { CONFIG } from '../config';
import { t } from '../i18n';
import { safeHttp, safeTel } from '../domain/listings';

const safeFb = (u: string | undefined) =>
  u && /^https:\/\/(www\.|m\.|web\.)?facebook\.com\//i.test(u) ? u : undefined;
const safeMail = (m: string | undefined) => (m && /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(m) ? m : undefined);

/** Shown once above any group of listings. */
export function UnverifiedNotice({ lang }: { lang: Lang }) {
  return (
    <div className="unverified" role="note">
      <strong>⚠ {t(lang, 'unverifiedTitle')}</strong>
      <p>{t(lang, 'unverifiedBody')}</p>
    </div>
  );
}

const KIND_KEY = { stay: 'kindStay', guide: 'kindGuide', tour: 'kindTour' } as const;

export default function ListingCard({
  listing: l,
  lang,
  districtName,
}: {
  listing: Listing;
  lang: Lang;
  districtName?: string;
}) {
  const tel = safeTel(l.contact.phone);
  const wa = safeTel(l.contact.whatsapp);
  const web = safeHttp(l.contact.website);
  const fb = safeFb(l.contact.facebook);
  const map = safeHttp(l.contact.mapUrl);
  const mail = safeMail(l.contact.email);
  const src = safeHttp(l.sourceUrl);
  const report = CONFIG.reportEmail
    ? `mailto:${CONFIG.reportEmail}?subject=${encodeURIComponent(`WanderNest BD listing: ${l.name} (${l.id})`)}`
    : undefined;

  return (
    <li className={`listing ${l.featured ? 'featured' : ''}`}>
      <div className="listing-head">
        <strong>{l.name}</strong>
        <span className="tags">
          {l.featured && <span className="tag spons">{t(lang, 'sponsored')}</span>}
          <span className="tag">{t(lang, KIND_KEY[l.kind])}</span>
        </span>
      </div>
      {(l.area || districtName) && (
        <small className="muted">
          {l.area && districtName && l.area.toLowerCase().includes(districtName.toLowerCase())
            ? l.area
            : [l.area, districtName].filter(Boolean).join(', ')}
        </small>
      )}
      {l.about && <p>{l.about[lang]}</p>}
      {l.priceNote && (
        <p className="price">
          <span className="muted">{t(lang, 'priceAsListed')}:</span> {l.priceNote}
        </p>
      )}
      <div className="contact">
        {tel && (
          <a className="call" href={`tel:${tel}`}>
            📞 {t(lang, 'callToConfirm')}: {l.contact.phone}
          </a>
        )}
        {wa && (
          <a href={`https://wa.me/${wa.replace('+', '')}`} target="_blank" rel="noopener noreferrer nofollow">
            {t(lang, 'whatsapp')}
          </a>
        )}
        {fb && (
          <a href={fb} target="_blank" rel="noopener noreferrer nofollow">
            {t(lang, 'facebook')}
          </a>
        )}
        {web && (
          <a href={web} target="_blank" rel="noopener noreferrer nofollow">
            {t(lang, 'website')}
          </a>
        )}
        {map && (
          <a href={map} target="_blank" rel="noopener noreferrer nofollow">
            {t(lang, 'map')}
          </a>
        )}
        {mail && <a href={`mailto:${mail}`}>{t(lang, 'email')}</a>}
      </div>
      <small className="muted src">
        {src ? (
          <a href={src} target="_blank" rel="noopener noreferrer nofollow">
            {t(lang, 'source')}
          </a>
        ) : (
          t(lang, 'source')
        )}{' '}
        · {t(lang, 'collectedOn')}: {l.collectedOn}
        {report && (
          <>
            {' '}
            · <a href={report}>{t(lang, 'myBusiness')}</a>
          </>
        )}
      </small>
    </li>
  );
}
