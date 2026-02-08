const KEY = 'bappam-admin-ads-v1';

const defaultAds = [
  {
    id: 'ad1',
    title: 'Premium Streaming Sale',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    url: '#',
    placement: 'home-top'
  },
  {
    id: 'ad2',
    title: 'Watch on Mobile App',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1200&auto=format&fit=crop',
    url: '#',
    placement: 'detail-mid'
  }
];

const readAds = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaultAds));
    return defaultAds;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(defaultAds));
    return defaultAds;
  }
};

const writeAds = (ads) => localStorage.setItem(KEY, JSON.stringify(ads));

function renderPlacement(placement, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ads = readAds().filter((ad) => ad.placement === placement);
  container.innerHTML = ads
    .map(
      (ad) => `
      <a class="ad-card" href="${ad.url}" target="_blank" rel="noopener noreferrer">
        <img src="${ad.image}" alt="${ad.title}" />
        <span>${ad.title}</span>
      </a>
    `
    )
    .join('');
}

function initAdmin() {
  const form = document.getElementById('ad-form');
  const list = document.getElementById('admin-ads-list');
  if (!form || !list) return;

  const refresh = () => {
    const ads = readAds();
    list.innerHTML = ads
      .map(
        (ad) => `
        <article class="admin-item">
          <img src="${ad.image}" alt="${ad.title}" />
          <div>
            <strong>${ad.title}</strong><br />
            <small>${ad.placement}</small>
          </div>
          <button class="btn" data-delete="${ad.id}">Delete</button>
        </article>
      `
      )
      .join('');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const ad = {
      id: crypto.randomUUID(),
      title: data.get('title')?.toString().trim(),
      image: data.get('image')?.toString().trim(),
      url: data.get('url')?.toString().trim(),
      placement: data.get('placement')?.toString()
    };
    if (!ad.title || !ad.image || !ad.url || !ad.placement) return;
    const next = [...readAds(), ad];
    writeAds(next);
    form.reset();
    refresh();
  });

  list.addEventListener('click', (e) => {
    const btn = e.target;
    if (!(btn instanceof HTMLElement)) return;
    const id = btn.getAttribute('data-delete');
    if (!id) return;
    writeAds(readAds().filter((ad) => ad.id !== id));
    refresh();
  });

  refresh();
}

renderPlacement('home-top', 'home-top-ads');
renderPlacement('home-mid', 'home-mid-ads');
renderPlacement('detail-top', 'detail-top-ads');
renderPlacement('detail-mid', 'detail-mid-ads');
initAdmin();
