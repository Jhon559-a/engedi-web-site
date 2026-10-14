/* Scroll-led editorial scenes. Product, account and fitting data are untouched. */
(() => {
  'use strict';

  function startEditorialMotion() {
    document.body.classList.add('motion-ready');
    const home = document.querySelector('#home-view');
    const showroom = document.querySelector('#showroom');
    const hero = document.querySelector('#hero-scene');
    const story = document.querySelector('#style-story');
    const toggle = document.querySelector('#motion-toggle');
    const steps = story ? Array.from(story.querySelectorAll('.story-step[data-step]')) : [];
    const visuals = story ? Array.from(story.querySelectorAll('.story-visual[data-visual]')) : [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactScreen = window.matchMedia('(max-width: 760px)');
    const preferenceKey = 'engedi-motion-paused';
    let userPaused = false;
    let frame = 0;
    let pageActive = true;
    let activeStep = null;
    let lastScene = '';
    let lastProgress = '';

    try {
      userPaused = window.localStorage.getItem(preferenceKey) === 'true';
    } catch {
      // Motion controls remain usable when browser storage is unavailable.
    }

    const clamp = value => Math.max(0, Math.min(1, value));
    const isPaused = () => userPaused || reducedMotion.matches;

    function setHeroProgress(value) {
      if (!hero) return;
      const next = value.toFixed(3);
      if (next === lastScene) return;
      lastScene = next;
      hero.style.setProperty('--scene', next);
      hero.dataset.progress = next;
    }

    function setActiveStep(id) {
      if (id === activeStep) return;
      activeStep = id;
      steps.forEach(step => step.classList.toggle('is-active', step.dataset.step === id));
      visuals.forEach(visual => {
        const active = visual.dataset.visual === id;
        visual.classList.toggle('is-active', active);
        visual.setAttribute('aria-hidden', String(!active));
      });
      const source = story.querySelector('.story-source');
      if (source) source.textContent = visuals.find(visual => visual.dataset.visual === id)?.dataset.source || '스타일을 위한 AI 시안 이미지';
    }

    function update() {
      frame = 0;
      if (!pageActive || document.hidden || (home && home.hidden)) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const viewportMiddle = viewportHeight / 2;
      const still = isPaused() || compactScreen.matches;
      let sceneProgress = 0;

      // Read all geometry before writing styles to avoid forced layout thrashing.
      if (showroom && hero && !still) {
        const bounds = showroom.getBoundingClientRect();
        sceneProgress = clamp(-bounds.top / Math.max(1, bounds.height));
      }

      const positions = steps.map(step => {
        const bounds = step.getBoundingClientRect();
        return { id: step.dataset.step, center: bounds.top + bounds.height / 2 };
      });

      setHeroProgress(sceneProgress);
      if (!positions.length) return;

      const nearest = positions.reduce((closest, candidate) =>
        Math.abs(candidate.center - viewportMiddle) < Math.abs(closest.center - viewportMiddle)
          ? candidate
          : closest
      );
      setActiveStep(nearest.id);

      const first = positions[0].center;
      const last = positions[positions.length - 1].center;
      const progress = clamp((viewportMiddle - first) / Math.max(1, last - first)).toFixed(3);
      if (story && progress !== lastProgress) {
        lastProgress = progress;
        story.style.setProperty('--story-progress', progress);
      }
    }

    function schedule() {
      if (frame || !pageActive || document.hidden) return;
      frame = window.requestAnimationFrame(update);
    }

    function cancelFrame() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function syncPreference() {
      const paused = isPaused();
      document.body.classList.toggle('motion-paused', paused);
      document.body.classList.toggle('motion-reduced', reducedMotion.matches);
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.disabled = reducedMotion.matches;
        const label = reducedMotion.matches
          ? '기기 설정 · 움직임 꺼짐'
          : userPaused ? '움직임 켜기 ▷' : '움직임 멈추기 Ⅱ';
        toggle.textContent = label;
        toggle.setAttribute('aria-label', reducedMotion.matches
          ? '기기의 움직임 줄이기 설정을 적용하고 있습니다.'
          : userPaused ? '스크롤 움직임 켜기' : '스크롤 움직임 멈추기');
        toggle.title = reducedMotion.matches
          ? '기기의 움직임 줄이기 설정을 변경하면 다시 켤 수 있어요.'
          : '스크롤에 따른 이미지 움직임을 켜거나 끕니다.';
      }
      if (paused || compactScreen.matches) setHeroProgress(0);
      schedule();
    }

    toggle?.addEventListener('click', () => {
      if (reducedMotion.matches) return;
      userPaused = !userPaused;
      try {
        window.localStorage.setItem(preferenceKey, String(userPaused));
      } catch {
        // Keep the current-page preference even if persistence is blocked.
      }
      syncPreference();
    });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('hashchange', schedule);
    window.addEventListener('storage', event => {
      if (event.key !== preferenceKey && event.key !== null) return;
      userPaused = event.key === preferenceKey && event.newValue === 'true';
      syncPreference();
    });
    reducedMotion.addEventListener('change', syncPreference);
    compactScreen.addEventListener('change', syncPreference);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelFrame();
      else schedule();
    });
    window.addEventListener('pagehide', () => {
      pageActive = false;
      cancelFrame();
    });
    window.addEventListener('pageshow', () => {
      pageActive = true;
      syncPreference();
    });

    syncPreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEditorialMotion, { once: true });
  } else {
    startEditorialMotion();
  }
})();
