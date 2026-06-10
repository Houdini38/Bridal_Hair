// byHoward — site interactions

document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll('.stat-number[data-count]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  // Lead forms — submit to the Cloudflare Worker at /api/lead.
  document.querySelectorAll('.js-lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var button = form.querySelector('button[type="submit"]');
      var invalid = [];

      form.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.value.trim() !== '';
        if (ok && field.type === 'email') ok = field.value.includes('@') && !field.validity.typeMismatch;
        if (ok && field.type === 'url') ok = !field.validity.typeMismatch;
        field.classList.toggle('field-error', !ok);
        if (!ok) invalid.push(field);
      });

      if (invalid.length) {
        status.textContent = 'Please fill in the highlighted fields.';
        status.classList.add('error');
        invalid[0].focus();
        return;
      }

      var data = { form: form.id };
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      var name = form.querySelector('[name="name"]');
      var first = name && name.value.trim() ? ' ' + name.value.trim().split(' ')[0] : '';

      status.classList.remove('error');
      status.textContent = 'Sending…';
      button.disabled = true;

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          return res.json();
        })
        .then(function () {
          status.textContent = 'Thanks,' + first + "! We'll be in touch within one business day.";
        })
        .catch(function () {
          button.disabled = false;
          status.classList.add('error');
          status.textContent = "Something went wrong — please email hello@byhoward.com and we'll take care of you.";
        });
    });
  });
});
