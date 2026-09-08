// AL SAFA — LIVING INTELLIGENCE PARK · V2
// Structural placeholder (Step 01). Hero entrance/background motion is
// CSS-only (see al-safa-v2.css, gated by prefers-reduced-motion); this file
// only wires the hero's scroll-to-next-section control (Step 02).

// Global Visual Refinement — true viewport width. `100vw` includes the
// vertical scrollbar gutter on Windows/Chrome/Firefox, so every full-bleed
// section (--vw100 in al-safa-v2.css) reads this instead and stays flush
// with the real, scrollbar-excluded edge of the window.
(function () {
  var root = document.documentElement;
  function setViewportWidth() {
    root.style.setProperty('--vw100', window.innerWidth + 'px');
  }
  setViewportWidth();
  window.addEventListener('resize', setViewportWidth);
})();

(function () {
  var scrollBtn = document.querySelector('#hero .hero-v2__scroll');
  if (!scrollBtn) return;

  scrollBtn.addEventListener('click', function () {
    var next = document.getElementById('challenge');
    if (!next) return;
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
})();

// Challenge + Concept scrollytelling (Step 03) — native IntersectionObserver
// only, no GSAP. Toggles .is-active on the current challenge step (plus its
// paired sticky visual and progress dot) and reveals concept principles /
// the final resolution progressively as they scroll into view.
(function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var steps = document.querySelectorAll('#challenge .challenge-step');
  var images = document.querySelectorAll('#challenge .challenge-visual__img');
  var dots = document.querySelectorAll('#challenge .challenge-progress__item');

  if (steps.length) {
    var setActiveStep = function (key) {
      steps.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      images.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      dots.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
    };

    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveStep(entry.target.getAttribute('data-step'));
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

    steps.forEach(function (el) { stepObserver.observe(el); });
  }

  var reveal = function (selector, options) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('#concept .concept-principle', { threshold: 0.4 });
  reveal('#concept .concept-resolution', { threshold: 0.3 });
  reveal('#challenge .heat-climate', { threshold: 0.2 });

  // HEAT / SOLAR EXPOSURE — SOLAR / SHADE / COMFORT layer toggle. Plain
  // click-driven state, independent of the scroll reveal above.
  var heatMasterplan = document.querySelector('#challenge .heat-climate__masterplan');
  var heatToggleItems = document.querySelectorAll('#challenge .heat-climate__toggle-item');
  var heatCaptions = document.querySelectorAll('#challenge .heat-climate__layer-caption span');
  if (heatMasterplan && heatToggleItems.length) {
    heatToggleItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var layer = btn.getAttribute('data-layer-target');
        heatMasterplan.setAttribute('data-active-layer', layer);
        heatToggleItems.forEach(function (el) {
          var active = el === btn;
          el.classList.toggle('is-active', active);
          el.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        heatCaptions.forEach(function (el) {
          el.classList.toggle('is-active', el.getAttribute('data-for') === layer);
        });
      });
    });
    heatMasterplan.setAttribute('data-active-layer', 'solar');
  }
})();

// Interactive Masterplan (Step 04) — one persistent plan image with a
// radial "spotlight" overlay standing in for zone polygons (coordinates
// come from the architect's own zone-badge positions, never guessed), plus
// labeled hotspot markers. Native IntersectionObserver only — no canvas,
// no WebGL, no GSAP. Hover micro-preview is pure CSS (:hover), so it never
// fights scroll-driven activation and is naturally inert on touch devices.
(function () {
  var section = document.getElementById('masterplan');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = section.querySelector('.masterplan-stage');
  var overlay = section.querySelector('.masterplan-overlay');
  var hotspots = section.querySelectorAll('.zone-hotspot');
  var indexItems = section.querySelectorAll('.zone-index__item');
  var zoneSteps = section.querySelectorAll('.zone-step[data-zone]');
  var allSteps = section.querySelectorAll('.zone-step');

  // Coordinates plotted against the approved rendered master plan
  // (aerial_main_c.jpg) — not the zoning study. Do not re-derive from the
  // zoning plate's 1448x890 layout; the two images do not share a coordinate
  // system.
  var SPOTLIGHT = {
    z1: { sx: '14.5%', sy: '26%', srx: '16%', sry: '16%' },
    z2: { sx: '14.5%', sy: '47%', srx: '14%', sry: '14%' },
    z3: { sx: '30%', sy: '60%', srx: '18%', sry: '18%' },
    z4: { sx: '43%', sy: '20%', srx: '20%', sry: '20%' },
    z5: { sx: '56%', sy: '38%', srx: '20%', sry: '20%' },
    z6: { sx: '49%', sy: '84%', srx: '16%', sry: '16%' },
    z7: { sx: '88%', sy: '39%', srx: '14%', sry: '22%' },
    z8: { sx: '91%', sy: '83%', srx: '13%', sry: '13%' }
  };

  var setActiveZone = function (zone) {
    hotspots.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-zone') === zone);
    });
    indexItems.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-zone') === zone);
    });
    zoneSteps.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-zone') === zone);
    });
    if (stage) stage.classList.toggle('is-active', !!zone);
    if (!overlay) return;
    var spot = zone && SPOTLIGHT[zone];
    if (spot) {
      overlay.style.setProperty('--sx', spot.sx);
      overlay.style.setProperty('--sy', spot.sy);
      overlay.style.setProperty('--srx', spot.srx);
      overlay.style.setProperty('--sry', spot.sry);
      overlay.classList.add('is-active');
    } else {
      overlay.classList.remove('is-active');
    }
  };

  if (allSteps.length) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveZone(entry.target.getAttribute('data-zone') || null);
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });
    allSteps.forEach(function (el) { stepObserver.observe(el); });
  }

  hotspots.forEach(function (el) {
    el.addEventListener('click', function () {
      var zone = el.getAttribute('data-zone');
      var target = section.querySelector('.zone-step[data-zone="' + zone + '"]');
      if (!target) return;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });
})();

// Living Intelligence system diagram + AI workflow index (Step 05) — one
// sticky SVG diagram driven by native IntersectionObserver, cumulative
// SENSE -> UNDERSTAND -> DECIDE -> RESPOND activation (each step keeps
// prior layers lit, so "together" is simply all four active at once), plus
// a flat workflow index that swaps a single detail readout on click. No
// canvas, no WebGL, no GSAP.
(function () {
  var section = document.getElementById('living-intelligence');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STEP_ORDER = ['sense', 'understand', 'decide', 'respond', 'together'];
  var steps = section.querySelectorAll('.intelligence-step');
  var layerNodes = {
    sense: section.querySelectorAll('.intelligence-layer[data-layer="sense"] .intelligence-node'),
    understand: section.querySelectorAll('.intelligence-layer[data-layer="understand"] .intelligence-node'),
    respond: section.querySelectorAll('.intelligence-layer[data-layer="respond"] .intelligence-node'),
    gate: section.querySelectorAll('.intelligence-layer[data-layer="gate"] .intelligence-node')
  };
  var core = section.querySelector('.intelligence-core');
  var decideItems = section.querySelectorAll('.li-decide-item');
  var paths = section.querySelectorAll('.intelligence-path');
  var diagram = section.querySelector('.intelligence-diagram');

  var toggleAll = function (list, active) {
    list.forEach(function (el) { el.classList.toggle('is-active', active); });
  };

  var setStep = function (stepKey) {
    var idx = STEP_ORDER.indexOf(stepKey);
    if (idx === -1) return;

    steps.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-step') === stepKey);
    });

    toggleAll(layerNodes.sense, idx >= 0);
    toggleAll(layerNodes.understand, idx >= 1);
    if (core) core.classList.toggle('is-active', idx >= 2);
    toggleAll(decideItems, idx >= 2);
    toggleAll(layerNodes.respond, idx >= 3);
    toggleAll(layerNodes.gate, idx >= 3);

    paths.forEach(function (path) {
      var stage = path.getAttribute('data-stage');
      var active =
        (stage === 'sense-understand' && idx >= 1) ||
        (stage === 'understand-internal' && idx >= 1) ||
        (stage === 'understand-decide' && idx >= 2) ||
        (stage === 'decide-band' && idx >= 2) ||
        ((stage === 'decide-respond' || stage === 'respond-gate') && idx >= 3) ||
        (stage === 'feedback-loop' && idx >= 4);
      path.classList.toggle('is-active', active);
    });
  };

  if (steps.length) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setStep(entry.target.getAttribute('data-step'));
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });
    steps.forEach(function (el) { stepObserver.observe(el); });
  }

  // Data-pulse motion (<animateMotion> along the curved paths) only plays
  // while the diagram is on screen, and never under reduced motion.
  if (diagram && diagram.pauseAnimations) {
    if (reduceMotion) {
      diagram.pauseAnimations();
    } else {
      diagram.pauseAnimations();
      var pulseObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            diagram.unpauseAnimations();
            diagram.classList.add('is-live');
          } else {
            diagram.pauseAnimations();
            diagram.classList.remove('is-live');
          }
        });
      }, { threshold: 0.15 });
      pulseObserver.observe(section);
    }
  }

  // Workflow -> network path highlighting. RESPOND/DECIDE key is read
  // straight off each panel's own .workflow-detail__family text, so no
  // per-workflow family table needs to be invented or hardcoded here.
  var FAMILY_TO_KEY = {
    'Human Comfort': 'comfort',
    'Landscape + Ecology': 'ecology',
    'Operations': 'operations',
    'Public Realm Response': 'realm'
  };
  // SENSE inputs don't map onto a DOM attribute, so this lookup is explicit.
  // Four workflows (sports booking, inclusive companion, ecology learning,
  // emergency assist) have no genuine match among the six SENSE categories
  // and are intentionally left without a sense-node highlight.
  var SENSE_BY_WORKFLOW = {
    'comfort-routing': ['microclimate'],
    'smart-irrigation': ['soil'],
    'tree-health': ['soil'],
    'water-quality': ['water'],
    'adaptive-lighting': ['occupancy'],
    'crowd-forecast': ['occupancy'],
    'predictive-maintenance': ['assets'],
    'waste-optimisation': ['assets']
  };
  var RESPOND_NODE_BY_KEY = { comfort: 'comfort', ecology: 'landscape', operations: 'operations', realm: 'realm' };

  var highlightWorkflow = function (key, familyText) {
    if (!diagram) return;
    diagram.classList.add('is-filtering');
    diagram.querySelectorAll('.is-highlight').forEach(function (el) { el.classList.remove('is-highlight'); });

    var senseKeys = SENSE_BY_WORKFLOW[key] || [];
    senseKeys.forEach(function (nodeKey) {
      var el = diagram.querySelector('.intelligence-layer[data-layer="sense"] .intelligence-node[data-node="' + nodeKey + '"]');
      if (el) el.classList.add('is-highlight');
    });

    diagram.querySelectorAll('.intelligence-layer[data-layer="understand"] .intelligence-node').forEach(function (el) {
      el.classList.add('is-highlight');
    });
    if (core) core.classList.add('is-highlight');

    var decideKey = FAMILY_TO_KEY[familyText];
    var respondKey = decideKey ? RESPOND_NODE_BY_KEY[decideKey] : null;
    if (decideKey) {
      var decideEl = diagram.querySelector('.li-decide-item[data-decide="' + decideKey + '"]');
      if (decideEl) decideEl.classList.add('is-highlight');
    }
    if (respondKey) {
      var respondEl = diagram.querySelector('.intelligence-layer[data-layer="respond"] .intelligence-node[data-node="' + respondKey + '"]');
      if (respondEl) respondEl.classList.add('is-highlight');
    }

    paths.forEach(function (path) {
      var pk = path.getAttribute('data-path');
      var hit = false;
      senseKeys.forEach(function (sk) { if (pk === 'se-' + sk) hit = true; });
      if (pk === 'edge-platform' || pk === 'platform-twin' || pk === 'twin-core') hit = true;
      if (decideKey && (pk === 'core-' + decideKey || pk === decideKey + '-respond')) hit = true;
      if (hit) path.classList.add('is-highlight');
    });
  };

  var workflowItems = section.querySelectorAll('.workflow-item');
  var workflowPanels = section.querySelectorAll('.workflow-detail__panel');
  workflowItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-workflow');
      workflowItems.forEach(function (el) {
        var active = el === btn;
        el.classList.toggle('is-active', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      var activePanel = null;
      workflowPanels.forEach(function (panel) {
        var active = panel.getAttribute('data-workflow') === key;
        panel.classList.toggle('is-active', active);
        if (active) { panel.removeAttribute('hidden'); activePanel = panel; } else panel.setAttribute('hidden', '');
      });
      var familyEl = activePanel && activePanel.querySelector('.workflow-detail__family');
      highlightWorkflow(key, familyEl ? familyEl.textContent.trim() : '');
    });
  });
})();

// Environmental Intelligence (Step 06) — one sticky SVG overlay on the same
// masterplan base image/coordinate system as Step 04. Unlike Step 05's
// cumulative activation, each step here spotlights ONLY its own layer (sun
// exposure explicitly fades as shade takes over, per the section's own
// read-each-condition-in-turn narrative); the final "landscape" step is the
// one moment every layer lights together, standing in for the resolved,
// connected system. A second, unrelated observer reveals the response
// "moments" list once it scrolls into view. Native IntersectionObserver
// only — no canvas, no WebGL, no GSAP.
(function () {
  var section = document.getElementById('environmental-intelligence');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LAYER_KEYS = ['sun', 'heat', 'wind', 'shade', 'water'];
  var stage = section.querySelector('.environment-stage');
  var steps = section.querySelectorAll('.environment-step');
  var layers = {};
  LAYER_KEYS.forEach(function (key) {
    layers[key] = section.querySelector('.environment-layer[data-layer="' + key + '"]');
  });

  // Sun and Wind swap the base plan to the project's own approved verified
  // analysis (Boards 16 and 17); every other step keeps the zoning plate as
  // an internal reference base for the calibrated SVG overlay.
  var BASEPLANS = {
    zoning: section.querySelector('.environment-baseplan--zoning'),
    sun: section.querySelector('.environment-baseplan--sun'),
    wind: section.querySelector('.environment-baseplan--wind')
  };

  var setStep = function (stepKey) {
    steps.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-step') === stepKey);
    });

    if (stage) stage.dataset.current = stepKey;

    var showAll = stepKey === 'landscape';
    LAYER_KEYS.forEach(function (key) {
      var layer = layers[key];
      if (!layer) return;
      // On its own step, Sun/Wind show Board 16/17 full-frame instead of the
      // overlay's own line-art, so the two are never drawn on top of each
      // other. Landscape's "everything together" moment still lights every
      // layer over the zoning-plate base, matching those layers' calibration.
      var ownStepSuppressed = (key === 'sun' || key === 'wind') && key === stepKey;
      layer.classList.toggle('is-active', showAll || (key === stepKey && !ownStepSuppressed));
    });

    var activeBase = stepKey === 'sun' ? 'sun' : stepKey === 'wind' ? 'wind' : 'zoning';
    Object.keys(BASEPLANS).forEach(function (key) {
      var el = BASEPLANS[key];
      if (el) el.classList.toggle('is-active', key === activeBase);
    });
  };

  if (steps.length) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setStep(entry.target.getAttribute('data-step'));
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });
    steps.forEach(function (el) { stepObserver.observe(el); });
  }

  var moments = section.querySelectorAll('.environment-moment');
  if (moments.length) {
    if (reduceMotion) {
      moments.forEach(function (el) { el.classList.add('is-active'); });
    } else {
      var momentObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-active');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      moments.forEach(function (el) { momentObserver.observe(el); });
    }
  }
})();

// Eight Experiences / Zone Cinematic Chapters (Step 07) — each zone is an
// independent, self-contained chapter (not a shared sticky diagram), so this
// needs only a single generic reveal-on-scroll observer toggling .is-active
// on each chapter and Z7 subchapter. Motion is CSS-only (fade + slight scale
// + translate); no parallax, no canvas, no GSAP.
(function () {
  var section = document.getElementById('zones');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var reveal = function (selector, options) {
    var els = section.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('.zone-chapter', { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  reveal('.zone-subchapter', { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
})();

// The Falaj (Step 08) — one sticky masterplan (same zoning_plate_c.jpg /
// 1448x890 coordinate system as Steps 04/06) with an illustrative SVG water
// route. Each scrolling stage sets how much of the route is drawn via a
// single --fj-progress custom property (spotlight-style: one active stage
// at a time, mirroring Step 06's setStep, not Step 05's cumulative layers).
(function () {
  var section = document.getElementById('falaj');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PROGRESS = {
    source: 0.04,
    flow: 0.28,
    landscape: 0.5,
    comfort: 0.7,
    social: 0.87,
    ecology: 1
  };

  var plan = section.querySelector('.falaj-plan');
  var stages = section.querySelectorAll('.falaj-stage');

  var setStep = function (stepKey) {
    stages.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-step') === stepKey);
    });
    if (plan && PROGRESS.hasOwnProperty(stepKey)) {
      plan.style.setProperty('--fj-progress', PROGRESS[stepKey]);
    }
  };

  if (stages.length) {
    if (reduceMotion) {
      stages.forEach(function (el) { el.classList.add('is-active'); });
      if (plan) plan.style.setProperty('--fj-progress', 1);
    } else {
      var stepObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setStep(entry.target.getAttribute('data-step'));
        });
      }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });
      stages.forEach(function (el) { stepObserver.observe(el); });
    }
  }

  var reveal = function (selector, options) {
    var els = section.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('.falaj-moment', { threshold: 0.25 });
})();

// Human Journey (Step 09) — sticky crossfade group (heat/welcome/move/rest/
// discover/learn) driven by IntersectionObserver, same pattern as Step 03's
// challenge scrollytelling (no JS-level reduceMotion branch needed here —
// the crossfade is a plain opacity swap, not an SVG path animation), plus
// a generic reveal() helper for the full-bleed cinematic peaks and the
// simple sunset/departure blocks.
(function () {
  var section = document.getElementById('human-journey');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var steps = section.querySelectorAll('.journey-step');
  var images = section.querySelectorAll('.journey-frame__img');
  var dots = section.querySelectorAll('.journey-progress__item');

  if (steps.length) {
    var setActiveStep = function (key) {
      steps.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      images.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      dots.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
    };

    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveStep(entry.target.getAttribute('data-step'));
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

    steps.forEach(function (el) { stepObserver.observe(el); });
  }

  var reveal = function (selector, options) {
    var els = section.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('.journey-cinematic', { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  reveal('.journey-simple', { threshold: 0.3 });
})();

// Performance (Step 10) — reveals each metric beat on scroll, grows the area
// proportional bar, and runs a one-shot count-up on the large verified
// numbers. The DOM's initial text is always the real final value (see
// data-final on each .metric-value), so the numbers are correct even with
// JS disabled; the animation only ever plays forward from 0 to that value,
// and prefers-reduced-motion skips it entirely (CSS forces the final state).
(function () {
  var section = document.getElementById('performance');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var reveal = function (selector, options) {
    var els = section.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('.metric-block', { threshold: 0.3 });
  reveal('.metric-bar', { threshold: 0.5 });

  if (!reduceMotion && window.IntersectionObserver) {
    var countEls = section.querySelectorAll('.metric-value[data-count-to]');
    var formatCount = function (value, decimals) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    };

    var countUp = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var finalText = el.getAttribute('data-final') || el.textContent;
      var duration = 1300;
      var start = null;

      el.textContent = formatCount(0, decimals);

      var tick = function (now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatCount(target * eased, decimals);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          el.textContent = finalText;
        }
      };
      window.requestAnimationFrame(tick);
    };

    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    countEls.forEach(function (el) { countObserver.observe(el); });
  }
})();

// After Dark (Step 11) — same sticky crossfade pattern as Step 09's Human
// Journey (sunset/paths/social/water/response/quiet), plus reveal() for the
// cinematic peaks, the day-to-night transition strip, the core night logic
// diagram and the layered-lighting recap. No new animation techniques:
// crossfade opacity swaps and one-shot line reveals only, per the spec's
// "restrained line illumination" motion rule — no flicker/pulse/particles.
(function () {
  var section = document.getElementById('after-dark');
  if (!section) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var steps = section.querySelectorAll('.afterdark-step');
  var images = section.querySelectorAll('.afterdark-frame__img');
  var dots = section.querySelectorAll('.afterdark-progress__item');

  if (steps.length) {
    var setActiveStep = function (key) {
      steps.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      images.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
      dots.forEach(function (el) { el.classList.toggle('is-active', el.getAttribute('data-step') === key); });
    };

    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveStep(entry.target.getAttribute('data-step'));
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

    steps.forEach(function (el) { stepObserver.observe(el); });
  }

  var reveal = function (selector, options) {
    var els = section.querySelectorAll(selector);
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-active');
        obs.unobserve(entry.target);
      });
    }, options);
    els.forEach(function (el) { observer.observe(el); });
  };

  reveal('.night-transition', { threshold: 0.3 });
  reveal('.afterdark-cinematic', { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  reveal('.night-logic', { threshold: 0.3 });
  reveal('.lighting-layer', { threshold: 0.3 });
})();

// Hero audio / project story — a single persistent native <audio> element
// plays the approved Board 04 introduction narration (board04_intro_en.mp3).
// Visitor-initiated only (no autoplay); once started it keeps playing
// through every section (no per-section observer pauses it) and exposes a
// small fixed mini-player once the Hero has scrolled out of view. Pauses
// automatically if the Final Film starts playing, and never auto-resumes.
// Native HTML5 audio + YouTube IFrame API only — no third-party library.
(function () {
  var audio = document.getElementById('heroNarrationAudio');
  var heroAudio = document.getElementById('heroAudio');
  var heroSection = document.getElementById('hero');
  if (!audio || !heroAudio || !heroSection) return;

  var playBtn = document.getElementById('heroAudioPlay');
  var glyph = document.getElementById('heroAudioGlyph');
  var label = document.getElementById('heroAudioLabel');
  var timeEl = document.getElementById('heroAudioTime');
  var progress = document.getElementById('heroAudioProgress');
  var progressFill = document.getElementById('heroAudioProgressFill');
  var muteBtn = document.getElementById('heroAudioMute');

  var mini = document.getElementById('audioMini');
  var miniPlay = document.getElementById('audioMiniPlay');
  var miniGlyph = document.getElementById('audioMiniGlyph');
  var miniTime = document.getElementById('audioMiniTime');
  var miniProgress = document.getElementById('audioMiniProgress');
  var miniProgressFill = document.getElementById('audioMiniProgressFill');
  var miniClose = document.getElementById('audioMiniClose');

  var narrationStarted = false;
  var narrationStopped = false;
  var heroInView = true;

  var formatTime = function (seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  };

  var isNarrow = function () {
    return window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
  };
  var idleLabel = function () {
    return isNarrow() ? 'Listen to the story' : 'Listen to the project story';
  };

  label.textContent = idleLabel();
  window.addEventListener('resize', function () {
    if (audio.paused) label.textContent = idleLabel();
  });

  var setPlayingUI = function (isPlaying) {
    heroAudio.setAttribute('data-state', isPlaying ? 'playing' : 'paused');
    glyph.innerHTML = isPlaying ? '&#10074;&#10074;' : '&#9654;';
    label.textContent = isPlaying ? 'Pause story' : idleLabel();
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause project narration' : 'Listen to the project story');
    miniGlyph.innerHTML = isPlaying ? '&#10074;&#10074;' : '&#9654;';
    miniPlay.setAttribute('aria-label', isPlaying ? 'Pause project narration' : 'Play project narration');
  };

  var updateMiniVisibility = function () {
    if (!narrationStarted || narrationStopped) {
      mini.classList.remove('is-visible');
      return;
    }
    mini.hidden = false;
    mini.classList.toggle('is-visible', !heroInView);
  };

  var play = function () { audio.play(); };
  var pause = function () { audio.pause(); };

  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      narrationStarted = true;
      narrationStopped = false;
      play();
    } else {
      pause();
    }
  });

  miniPlay.addEventListener('click', function () {
    if (audio.paused) { play(); } else { pause(); }
  });

  miniClose.addEventListener('click', function () {
    pause();
    narrationStopped = true;
    updateMiniVisibility();
  });

  audio.addEventListener('play', function () {
    setPlayingUI(true);
    updateMiniVisibility();
  });
  audio.addEventListener('pause', function () {
    setPlayingUI(false);
    updateMiniVisibility();
  });
  audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    setPlayingUI(false);
    heroAudio.setAttribute('data-state', 'idle');
    progressFill.style.width = '0%';
    miniProgressFill.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
    miniProgress.setAttribute('aria-valuenow', '0');
    updateMiniVisibility();
  });

  audio.addEventListener('loadedmetadata', function () {
    var total = formatTime(audio.duration);
    timeEl.textContent = total;
    miniTime.textContent = '00:00 / ' + total;
  });

  audio.addEventListener('timeupdate', function () {
    var dur = audio.duration || 0;
    var pct = dur ? (audio.currentTime / dur) * 100 : 0;
    progressFill.style.width = pct + '%';
    miniProgressFill.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(Math.round(pct)));
    miniProgress.setAttribute('aria-valuenow', String(Math.round(pct)));
    var current = formatTime(audio.currentTime);
    var total = formatTime(dur);
    timeEl.textContent = current + ' / ' + total;
    miniTime.textContent = current + ' / ' + total;
    progress.setAttribute('aria-valuetext', current + ' of ' + total);
    miniProgress.setAttribute('aria-valuetext', current + ' of ' + total);
  });

  var seekFromClientX = function (el, clientX) {
    if (!audio.duration) return;
    var rect = el.getBoundingClientRect();
    var ratio = (clientX - rect.left) / rect.width;
    ratio = Math.min(1, Math.max(0, ratio));
    audio.currentTime = ratio * audio.duration;
  };

  [progress, miniProgress].forEach(function (el) {
    el.addEventListener('click', function (e) { seekFromClientX(el, e.clientX); });
    el.addEventListener('keydown', function (e) {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        e.preventDefault();
      }
    });
  });

  muteBtn.addEventListener('click', function () {
    audio.muted = !audio.muted;
    heroAudio.setAttribute('data-muted', audio.muted ? 'true' : 'false');
    muteBtn.textContent = audio.muted ? 'UNMUTE' : 'MUTE';
    muteBtn.setAttribute('aria-pressed', audio.muted ? 'true' : 'false');
  });

  var heroObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      heroInView = entry.isIntersecting;
      updateMiniVisibility();
    });
  }, { threshold: 0 });
  heroObserver.observe(heroSection);

  // Final Film conflict (§19 of the spec): pause narration automatically
  // when the Final Film starts playing; never auto-resume narration
  // afterward — the visitor decides. Only the primary Final Film iframe
  // (#finalFilmFrame) is wired; the archive facsimile board is untouched.
  var filmFrame = document.getElementById('finalFilmFrame');
  if (filmFrame) {
    var apiScript = document.createElement('script');
    apiScript.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(apiScript);

    window.onYouTubeIframeAPIReady = function () {
      new YT.Player(filmFrame, {
        events: {
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING && !audio.paused) {
              pause();
            }
          }
        }
      });
    };
  }
})();
