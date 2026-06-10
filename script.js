// Angela Bernard Hair + Brooklyn Beauty — interactions

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
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Inquiry form submit (demo handler)
  var form = document.getElementById('availability');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var date = document.getElementById('event-date');
      if (!email.value || !date.value) {
        email.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Thank You — We’ll Be In Touch!';
      btn.disabled = true;
      btn.style.background = 'var(--gold-dark)';
      setTimeout(function () { form.reset(); }, 200);
    });
  }

  // Testimonial dots (simple rotation indicator)
  var dots = document.querySelectorAll('.dots .dot');
  if (dots.length) {
    var i = 0;
    setInterval(function () {
      dots.forEach(function (d) { d.classList.remove('active'); });
      i = (i + 1) % dots.length;
      dots[i].classList.add('active');
    }, 3500);
  }
});
