import type { Lang } from '../domain/types';
import { CONFIG } from '../config';
import { t } from '../i18n';
import { safeTel } from '../domain/listings';

export default function BusinessView({ lang }: { lang: Lang }) {
  const mail = CONFIG.businessEmail
    ? `mailto:${CONFIG.businessEmail}?subject=${encodeURIComponent('WanderNest BD: list my business')}`
    : undefined;
  const wa = safeTel(CONFIG.businessWhatsApp);
  return (
    <section className="view business">
      <h1>{t(lang, 'bizTitle')}</h1>
      <p className="muted">{t(lang, 'bizSub')}</p>
      <div className="plans">
        <div className="plan">
          <h2>{t(lang, 'bizFreeTitle')}</h2>
          <p>{t(lang, 'bizFreeBody')}</p>
        </div>
        <div className="plan feat">
          <h2>
            {t(lang, 'bizFeatTitle')} <span className="tag spons">{t(lang, 'sponsored')}</span>
          </h2>
          <p>{t(lang, 'bizFeatBody')}</p>
        </div>
      </div>
      <h2>{t(lang, 'bizContact')}</h2>
      {mail || wa ? (
        <div className="row">
          {mail && (
            <a className="btn red" href={mail}>
              {t(lang, 'email')}
            </a>
          )}
          {wa && (
            <a className="btn" href={`https://wa.me/${wa.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
              {t(lang, 'whatsapp')}
            </a>
          )}
        </div>
      ) : (
        <p className="muted">
          {t(lang, 'bizNoContact')}
          {import.meta.env.DEV && <em> [Set businessEmail / businessWhatsApp in src/tracker/config.ts]</em>}
        </p>
      )}
      <p className="muted small">{t(lang, 'bizPolicy')}</p>
    </section>
  );
}
