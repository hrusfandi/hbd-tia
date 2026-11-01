const music = document.getElementById('music');
const musicToggle = document.getElementById('music-toggle');
const musicLabel = document.getElementById('music-label');
let musicStarted = false;
function updateMusic() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
  musicLabel.textContent = playing ? 'Jeda musik' : 'Musik';
}
async function playMusic() { try { await music.play(); musicStarted = true; } catch { updateMusic(); } }
musicToggle.addEventListener('click', () => { if (music.paused) playMusic(); else music.pause(); });
music.addEventListener('play', updateMusic);
music.addEventListener('pause', updateMusic);
function show(id) {
  document.querySelectorAll('.screen').forEach(section => { section.hidden = section.id !== id; });
  window.scrollTo(0, 0);
  const heading = document.querySelector(`#${id} h1, #${id} h2`);
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({preventScroll: true}); }
}
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.next === 'flower' && !musicStarted) playMusic();
  show(button.dataset.next);
}));
const rose = document.getElementById('rose');
const roseImages = [...document.querySelectorAll('.rose-image')];
const status = document.getElementById('flower-status');
let timers = [];
rose.addEventListener('click', () => {
  if (rose.classList.contains('blooming')) return;
  rose.classList.add('blooming');
  rose.disabled = true;
  status.textContent = 'SEBUAH KENANGAN UNTUK ADEK';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  roseImages.slice(1).forEach((image, index) => {
    timers.push(setTimeout(() => image.classList.add('active'), reduced ? 0 : 900 * (index + 1)));
  });
  timers.push(setTimeout(() => show('memory'), reduced ? 100 : 4400));
});
const photos = ['photos/1.jpg', 'photos/2.jpg', 'photos/3.jpg', 'photos/4.jpg'];
let photoIndex = 0;
function changePhoto(delta) {
  photoIndex = (photoIndex + delta + photos.length) % photos.length;
  const photo = document.getElementById('memory-photo');
  photo.src = photos[photoIndex];
  photo.alt = `Kenangan bersama Tia, foto ${photoIndex + 1} dari ${photos.length}`;
  document.getElementById('photo-count').textContent = `${String(photoIndex + 1).padStart(2, '0')} / 04`;
}
document.getElementById('previous-photo').addEventListener('click', () => changePhoto(-1));
document.getElementById('next-photo').addEventListener('click', () => changePhoto(1));
document.querySelector('.restart').addEventListener('click', () => {
  timers.forEach(clearTimeout); timers = [];
  rose.classList.remove('blooming'); rose.disabled = false;
  roseImages.slice(1).forEach(image => image.classList.remove('active'));
  status.textContent = 'SENTUH MAWAR UNTUK MELANJUTKAN';
  photoIndex = 0; changePhoto(0);
});
