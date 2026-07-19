const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.removeAttribute('aria-current'));
    const active = links.find(link => link.getAttribute('href') === `#${entry.target.id}`);
    if (active) active.setAttribute('aria-current', 'page');
  });
}, { rootMargin: '-35% 0px -55%' });

sections.forEach(section => observer.observe(section));

const toast = document.querySelector('.copy-toast');
let toastTimer;

async function copyPrompt(button) {
  const target = document.getElementById(button.dataset.copyTarget);
  if (!target) return;

  const promptText = target.textContent.trim();
  try {
    await navigator.clipboard.writeText(promptText);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = promptText;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  const originalLabel = button.textContent;
  button.textContent = 'Sudah disalin ✓';
  button.classList.add('copied');
  toast.textContent = 'Arahan telah disalin ke clipboard.';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  setTimeout(() => {
    button.textContent = originalLabel;
    button.classList.remove('copied');
  }, 2200);
}

document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', () => copyPrompt(button));
});
