const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function setMenu(open) {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel);
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const form = document.getElementById('project-form');
if (form) {
  form.querySelector('.form-submit').disabled = false;
  const copy = JSON.parse(form.dataset.copy);
  const phone = form.elements.phone;
  const phoneError = document.getElementById('phone-error');
  const name = form.elements.name;
  const validateName = () => name.setCustomValidity(name.value.trim() ? '' : name.validationMessage || (document.documentElement.lang === 'ru' ? 'Укажите ваше имя.' : document.documentElement.lang === 'es' ? 'Introduce tu nombre.' : 'Enter your name.'));
  const validatePhone = () => {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, '');
    const valid = /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
    phone.setCustomValidity(valid ? '' : copy.invalid);
    phone.setAttribute('aria-invalid', String(!valid));
    phoneError.textContent = valid ? '' : copy.invalid;
    phoneError.hidden = valid;
    return valid;
  };
  name.addEventListener('input', () => name.setCustomValidity(''));
  name.addEventListener('blur', validateName);
  phone.addEventListener('input', () => { phone.setCustomValidity(''); phone.removeAttribute('aria-invalid'); phoneError.hidden = true; });
  phone.addEventListener('blur', validatePhone);
  document.querySelectorAll('[data-property]').forEach(link => link.addEventListener('click', () => {
    const titles = Array.from(document.querySelectorAll('.service h3')).map(element => element.textContent);
    const position = titles.indexOf(link.dataset.property);
    if (position >= 0) form.elements.property.selectedIndex = position + 1;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    validateName();
    validatePhone();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [copy.intro, '', `${copy.name}: ${String(data.get('name')).trim()}`, `${copy.phone}: ${String(data.get('phone')).trim()}`];
    if (data.get('property')) lines.push(`${copy.type}: ${data.get('property')}`);
    if (String(data.get('message')).trim()) lines.push(`${copy.message}: ${String(data.get('message')).trim()}`);
    const message = lines.join('\n');
    const url = new URL(`https://wa.me/${form.dataset.whatsapp}`);
    url.searchParams.set('text', message);
    const result = document.getElementById('form-result');
    document.getElementById('continue-whatsapp').href = url.href;
    document.getElementById('email-fallback').href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Apex Building Group — '+String(data.get('name')).trim())}&body=${encodeURIComponent(message)}`;
    result.hidden = false;
    window.open(url.href, '_blank', 'noopener,noreferrer');
    result.focus({ preventScroll: true });
  });
}
