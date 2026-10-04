import { company, projects, specialists } from '../content/site.mjs';
import { icon, mark } from './icons.mjs';

export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const multiline = value => escape(value).replaceAll('\n', '<br> ');
const paragraphs = values => values.map(value => `<p>${escape(value)}</p>`).join('');

export function renderPage(t, { siteURL, basePath, languages, page = 'home' }) {
  const pathFor = (lang, suffix = '') => `${basePath}${lang === company.defaultLanguage ? '' : `${lang}/`}${suffix}`;
  const currentPath = pathFor(t.lang, page === 'privacy' ? 'privacy/' : page === '404' ? '404.html' : '');
  const url = new URL(currentPath, siteURL).href;
  const homeURL = new URL(pathFor(t.lang), siteURL).href;
  const asset = name => `${basePath}assets/${name}`;
  const wa = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(t.contact.waIntro)}`;
  const button = (label, href = '#contact', style = 'primary', symbol = 'diagonal') => `<a class="button button-${style}" href="${escape(href)}">${escape(label)}${icon(symbol)}</a>`;
  const photo = (name, alt, cls = '', priority = false) => `<img class="${cls}" src="${asset(`${name}-1200.webp`)}" srcset="${asset(`${name}-640.webp`)} 640w, ${asset(`${name}-1200.webp`)} 1200w, ${asset(`${name}-1800.webp`)} 1800w" sizes="${priority ? '100vw' : '(max-width: 700px) 100vw, 55vw'}" width="1800" height="${name === 'living' ? '1350' : '1200'}" alt="${escape(alt)}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"'}>`;
  const languageLinks = languages.map(lang => `<a href="${pathFor(lang.lang, page === 'privacy' ? 'privacy/' : '')}" lang="${lang.lang}" hreflang="${lang.lang}" ${lang.lang === t.lang ? 'aria-current="page"' : ''} aria-label="${escape(lang.label)}">${lang.lang.toUpperCase()}</a>`).join('');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type':'Organization', '@id':`${siteURL}#organization`, name:company.name, url:siteURL,
        logo:new URL(asset('logo.webp'),siteURL).href, telephone:company.phoneLink, email:company.email,
        areaServed:company.areaServed,
        sameAs:[company.instagram], contactPoint:{'@type':'ContactPoint', telephone:company.phoneLink, email:company.email, contactType:'customer service', availableLanguage:['Russian','Spanish','English']} },
      { '@type':'WebSite', '@id':`${siteURL}#website`, url:siteURL, name:company.name, publisher:{'@id':`${siteURL}#organization`}, inLanguage:languages.map(x=>x.lang) },
      { '@type':'WebPage', '@id':`${url}#webpage`, url, name:page === 'privacy' ? t.privacy.title : t.title, inLanguage:t.lang, isPartOf:{'@id':`${siteURL}#website`}, about:{'@id':`${siteURL}#organization`} },
      ...(page === 'home' ? t.services.items.map(service => ({'@type':'Service', name:service.title, description:service.text, serviceType:t.hero.kicker, provider:{'@id':`${siteURL}#organization`}, areaServed:company.areaServed, url:homeURL+'#services'})) : []),
    ],
  };
  const pageTitle = page === 'privacy' ? `${t.privacy.title} | ${company.name}` : page === '404' ? `${t.notFound.title} | ${company.name}` : t.title;
  const navIDs = ['services','about','process','contact'];
  const navLinks = t.nav.map((label, i) => `<a href="${page === 'home' ? '' : pathFor(t.lang)}#${navIDs[i]}">${escape(label)}</a>`).join('');
  const head = `<!doctype html>
<html lang="${t.lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(pageTitle)}</title><meta name="description" content="${escape(page === 'privacy' ? t.privacy.intro : t.description)}">
<meta name="theme-color" content="#32707c"><meta name="robots" content="${page === '404' ? 'noindex, follow' : 'index, follow'}">
<link rel="canonical" href="${url}">
${page !== '404' ? languages.map(lang=>`<link rel="alternate" hreflang="${lang.lang}" href="${new URL(pathFor(lang.lang,page === 'privacy' ? 'privacy/' : ''),siteURL).href}">`).join('\n') : ''}
${page !== '404' ? `<link rel="alternate" hreflang="x-default" href="${new URL(pathFor(company.defaultLanguage,page === 'privacy' ? 'privacy/' : ''),siteURL).href}">` : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="${company.name}">
<meta property="og:title" content="${escape(pageTitle)}"><meta property="og:description" content="${escape(t.description)}"><meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.locale}">${languages.filter(l=>l.lang!==t.lang).map(l=>`<meta property="og:locale:alternate" content="${l.locale}">`).join('')}
<meta property="og:image" content="${new URL(asset('social-cover.jpg'),siteURL).href}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${company.name} — ${escape(t.hero.location)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(pageTitle)}"><meta name="twitter:description" content="${escape(t.description)}"><meta name="twitter:image" content="${new URL(asset('social-cover.jpg'),siteURL).href}">
<link rel="icon" type="image/svg+xml" href="${basePath}favicon.svg">
<link rel="stylesheet" href="${basePath}assets/styles.css">
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>
<script src="${basePath}assets/main.js" defer></script>
</head><body id="top" data-language="${t.lang}">
<a class="skip-link" href="#main">${t.skip}</a>
<header class="site-header"><div class="header-inner">
<a class="brand" href="${pathFor(t.lang)}" aria-label="Apex Building Group"><img src="${asset('logo.webp')}" width="600" height="136" alt="Apex Building Group"></a>
<nav class="desktop-nav" aria-label="${escape(t.navLabel)}">${navLinks}</nav>
<div class="header-actions"><nav class="language-nav" aria-label="${escape(t.language)}">${languageLinks}</nav>${button(t.navCTA,page === 'home' ? '#contact' : pathFor(t.lang)+'#contact','header')}
<button class="menu-toggle" type="button" aria-label="${escape(t.menu)}" data-open-label="${escape(t.menu)}" data-close-label="${escape(t.closeMenu)}" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button></div>
</div><nav id="mobile-nav" class="mobile-nav" aria-label="${escape(t.navLabel)}" hidden>${navLinks}${button(t.navCTA,page === 'home' ? '#contact' : pathFor(t.lang)+'#contact')}</nav></header>`;
  const footer = `<footer class="site-footer"><div class="container footer-top"><a class="footer-brand" href="${pathFor(t.lang)}">${mark}<span>APEX<small>BUILDING GROUP</small></span></a><p>${escape(t.footer.tagline)}</p><nav aria-label="${escape(t.language)}" class="language-nav">${languageLinks}</nav><a class="back-top" href="#top">${escape(t.footer.top)}${icon('arrow')}</a></div><div class="container footer-bottom"><span>© ${new Date().getUTCFullYear()} Apex Building Group. ${escape(t.footer.rights)}</span><a href="${pathFor(t.lang,'privacy/')}">${escape(t.footer.privacy)}</a><span>${escape(t.hero.location)}</span></div></footer></body></html>`;
  if (page === 'privacy') return `${head}<main id="main" class="document-page container"><a class="text-link" href="${pathFor(t.lang)}">${icon('arrow')} ${escape(t.privacy.back)}</a><h1>${escape(t.privacy.title)}</h1><p class="document-intro">${escape(t.privacy.intro)}</p>${t.privacy.sections.map(([title,text])=>`<section><h2>${escape(title)}</h2><p>${escape(text)}</p></section>`).join('')}<a class="text-link" href="mailto:${company.email}">${company.email}</a></main>${footer}`;
  if (page === '404') return `${head}<main id="main" class="document-page container"><span class="error-code">404</span><h1>${escape(t.notFound.title)}</h1><p>${escape(t.notFound.text)}</p>${button(t.notFound.cta,pathFor(t.lang))}</main>${footer}`;
  const content = `<main id="main">
<section class="hero" aria-labelledby="hero-heading">
${photo('living',t.hero.imageAlt,'hero-image',true)}<div class="hero-shade"></div>
<div class="container hero-inner"><div class="hero-location">${icon('pin')}${escape(t.hero.location)}</div>
<h1 id="hero-heading"><span class="hero-kicker">${escape(t.hero.kicker)}</span><span class="hero-title">${t.hero.lines.map(escape).join('<br>')}</span></h1>
<p class="hero-copy">${escape(t.hero.text)}</p><div class="hero-actions">${button(t.hero.cta)}<a class="hero-secondary" href="#process">${escape(t.hero.secondary)}${icon('arrow')}</a></div>
<div class="hero-bottom"><a href="#services">${icon('down')}${escape(t.hero.scroll)}</a><span>${escape(t.hero.imageNote)}</span></div></div>
</section>
<div class="benefits"><div class="container benefits-inner">${t.benefits.map(([symbol,title,text])=>`<div class="benefit">${icon(symbol)}<div><strong>${escape(title)}</strong><span>${escape(text)}</span></div></div>`).join('')}</div></div>
<section id="services" class="section services container" aria-labelledby="services-title"><div class="section-heading"><div><p class="section-label">${escape(t.services.label)}</p><h2 id="services-title">${multiline(t.services.title)}</h2></div><p class="section-intro">${escape(t.services.text)}</p></div>
<div class="services-grid">${t.services.items.map(item=>`<article class="service">${icon(item.icon,'service-icon')}<h3>${escape(item.title)}</h3><p>${escape(item.text)}</p><ul class="service-tags">${item.tags.map(tag=>`<li>${escape(tag)}</li>`).join('')}</ul><a class="service-link" href="#contact" data-property="${escape(item.title)}">${escape(t.services.cta)}${icon('diagonal')}</a></article>`).join('')}</div></section>
<section id="about" class="about" aria-labelledby="about-title"><div class="container about-grid"><div class="about-copy"><p class="section-label">${escape(t.about.label)}</p><h2 id="about-title">${multiline(t.about.title)}</h2>${paragraphs([t.about.text,t.about.text2])}<ul class="about-points">${t.about.points.map(point=>`<li>${icon('check')}${escape(point)}</li>`).join('')}</ul></div><figure class="about-visual">${photo('detail',t.about.imageAlt)}<figcaption><span>${escape(t.about.caption)}</span>${mark}</figcaption></figure></div></section>
<section id="spaces" class="section spaces container" aria-labelledby="spaces-title"><div class="section-heading"><div><p class="section-label">${escape(t.spaces.label)}</p><h2 id="spaces-title">${multiline(t.spaces.title)}</h2></div><p class="section-intro">${escape(t.spaces.text)}</p></div><div class="spaces-grid">${t.spaces.items.map((item,i)=>`<figure class="space space-${i+1}">${photo(item.image,item.alt)}<figcaption><h3>${escape(item.title)}</h3><span>${escape(item.subtitle)}</span></figcaption></figure>`).join('')}</div><p class="image-disclaimer">${escape(t.spaces.note)}</p></section>
${projects.length ? `<section class="section projects container" aria-labelledby="projects-title"><div class="section-heading"><div><h2 id="projects-title">${escape(t.spaces.projectsTitle)}</h2></div><p class="section-intro">${escape(t.spaces.projectsText)}</p></div><div class="projects-grid">${projects.map(p=>`<figure><img src="${asset(p.image)}" alt="${escape(p.alt[t.lang])}" loading="lazy" width="1200" height="900"><figcaption><h3>${escape(p.title[t.lang])}</h3><p>${escape(p.description[t.lang])}</p></figcaption></figure>`).join('')}</div></section>` : ''}
<section id="process" class="process section" aria-labelledby="process-title"><div class="container process-grid"><div class="process-intro"><p class="section-label">${escape(t.process.label)}</p><h2 id="process-title">${multiline(t.process.title)}</h2><p>${escape(t.process.text)}</p>${button(t.process.cta)}<aside class="gift">${icon('sparkle')}<div><h3>${escape(t.process.giftTitle)}</h3><p>${escape(t.process.giftText)}</p></div></aside></div><div class="steps">${t.process.steps.map(([title,text,items],i)=>`<details class="step" name="renovation-steps" ${i===0 ? 'open' : ''}><summary><span class="step-number">${String(i+1).padStart(2,'0')}</span><span class="step-summary"><h3>${escape(title)}</h3><span>${escape(text)}</span></span><span class="plus" aria-hidden="true"></span></summary><div class="step-body"><p>${escape(t.process.included)}</p><ul>${items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul></div></details>`).join('')}</div></div></section>
<section class="section team container" aria-labelledby="team-title"><div class="section-heading"><div><p class="section-label">${escape(t.team.label)}</p><h2 id="team-title">${multiline(t.team.title)}</h2></div><p class="section-intro">${escape(t.team.text)}</p></div><div class="team-roles">${t.team.roles.map(([symbol,title,text])=>`<article>${icon(symbol)}<h3>${escape(title)}</h3><p>${escape(text)}</p></article>`).join('')}</div>${specialists.length ? `<div class="specialists-grid">${specialists.map(s=>`<article><img src="${asset(s.image)}" alt="${escape(s.name)}" loading="lazy" width="600" height="750"><h3>${escape(s.name)}</h3><strong>${escape(s.role[t.lang])}</strong><p>${escape(s.description[t.lang])}</p></article>`).join('')}</div>` : ''}</section>
<section class="faq section" aria-labelledby="faq-title"><div class="container faq-grid"><div><p class="section-label">${escape(t.faq.label)}</p><h2 id="faq-title">${multiline(t.faq.title)}</h2></div><div class="faq-list">${t.faq.items.map(([question,answer])=>`<details name="questions"><summary><h3>${escape(question)}</h3><span class="plus" aria-hidden="true"></span></summary><p>${escape(answer)}</p></details>`).join('')}</div></div></section>
<section id="contact" class="contact section" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="section-label">${escape(t.contact.label)}</p><h2 id="contact-title">${multiline(t.contact.title)}</h2><p>${escape(t.contact.text)}</p><div class="contact-links"><a href="tel:${company.phoneLink}">${icon('phone')}<span><small>${escape(t.contact.phoneLabel)}</small>${company.phone}</span></a><a href="mailto:${company.email}">${icon('mail')}<span><small>${escape(t.contact.emailLabel)}</small>${company.email}</span></a><a href="${escape(company.instagram)}" target="_blank" rel="noopener noreferrer">${icon('instagram')}<span>${escape(company.instagramHandle)}</span>${icon('diagonal')}</a></div><div class="contact-location">${icon('pin')}${escape(t.contact.area)}</div></div>
<div class="form-panel"><h3>${escape(t.contact.formTitle)}</h3><form id="project-form" data-whatsapp="${company.whatsapp}" data-email="${company.email}" data-copy="${escape(JSON.stringify({intro:t.contact.waIntro,name:t.contact.waName,phone:t.contact.waPhone,type:t.contact.waType,message:t.contact.waMessage,invalid:t.contact.invalidPhone}))}">
<div class="form-row"><div class="form-field"><label for="name">${escape(t.contact.name)} <span aria-hidden="true">*</span></label><input id="name" name="name" autocomplete="name" required maxlength="100" placeholder="${escape(t.contact.namePlaceholder)}"></div><div class="form-field"><label for="phone">${escape(t.contact.phone)} <span aria-hidden="true">*</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" required maxlength="30" placeholder="${escape(t.contact.phonePlaceholder)}" aria-describedby="phone-error"><span id="phone-error" class="field-error" hidden></span></div></div>
<div class="form-field"><label for="property">${escape(t.contact.type)}</label><select id="property" name="property">${t.contact.types.map((item,i)=>`<option value="${i ? escape(item) : ''}">${escape(item)}</option>`).join('')}</select></div>
<div class="form-field"><label for="message">${escape(t.contact.message)} <span class="optional">${escape(t.contact.messageOptional)}</span></label><textarea id="message" name="message" rows="3" maxlength="2500" placeholder="${escape(t.contact.messagePlaceholder)}"></textarea></div>
<label class="consent"><input id="consent" type="checkbox" required><span>${escape(t.contact.consent)} <a href="${pathFor(t.lang,'privacy/')}" target="_blank" rel="noopener noreferrer">${escape(t.contact.privacy)}</a></span></label>
<button class="button button-primary form-submit" type="submit" disabled>${escape(t.contact.submit)}${icon('whatsapp')}</button><p class="form-helper">${escape(t.contact.helper)}</p>
<div class="form-result" id="form-result" role="status" tabindex="-1" hidden><p>${escape(t.contact.opened)}</p><a id="continue-whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer">${escape(t.contact.continue)}${icon('diagonal')}</a><a id="email-fallback" href="mailto:${company.email}">${escape(t.contact.fallback)}</a></div>
<noscript><p class="nojs-note">${escape(t.contact.nojs)} <a href="${wa}" target="_blank" rel="noopener noreferrer">WhatsApp</a> · <a href="mailto:${company.email}">Email</a></p></noscript>
</form></div></div></section>
</main><a class="floating-whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer" aria-label="${escape(t.contact.submit)}">${icon('whatsapp')}</a>`;
  return head + content + footer;
}
