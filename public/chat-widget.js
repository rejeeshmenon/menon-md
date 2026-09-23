/*
 * Lazy chat widget for menon.md. Loaded only after the visitor clicks
 * "Ask about my work" (or on /chat). Plain JavaScript, no dependencies.
 * Exposes window.__cvChatOpen() and window.__cvChatMount(container, options).
 */
(function () {
  'use strict';
  if (window.__cvChatMount) return;

  var MAX_CHARS = 1000;
  var MAX_TURNS = 8;
  var EMAIL = 'rejeeshmenon85@gmail.com';

  var css =
    '.cvchat{--paper:#fff;--ink:#14181f;--navy:#1f3a5f;--muted:#4f5864;--hair:#e3e6ea;--tint:#f5f7fa;--gold:#8a6a24;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--paper);border:1px solid var(--hair);display:flex;flex-direction:column;min-height:0}' +
    '@media(prefers-color-scheme:dark){.cvchat{--paper:#0e1420;--ink:#ede8df;--navy:#8fb2de;--muted:#a3acba;--hair:#25314a;--tint:#141c2b;--gold:#d2b36a}}' +
    '.cvchat-panel{position:fixed;right:1rem;bottom:1rem;width:min(26rem,calc(100vw - 2rem));height:min(34rem,calc(100dvh - 2rem));z-index:30;box-shadow:0 1px 0 var(--hair)}' +
    '.cvchat-head{display:flex;align-items:baseline;justify-content:space-between;gap:.75rem;padding:.75rem 1rem;border-bottom:1px solid var(--hair)}' +
    '.cvchat-head h2{font:400 1.05rem Georgia,"Times New Roman",serif;color:var(--navy);margin:0}' +
    '.cvchat-head small{color:var(--muted);font-size:.75rem}' +
    '.cvchat-close{background:none;border:1px solid var(--hair);color:var(--muted);font:inherit;font-size:.8rem;padding:.2rem .5rem;cursor:pointer}' +
    '.cvchat-log{flex:1;overflow:auto;padding:1rem;display:flex;flex-direction:column;gap:.75rem;font-size:.95rem;line-height:1.5}' +
    '.cvchat-msg{max-width:92%;white-space:pre-wrap;overflow-wrap:anywhere}' +
    '.cvchat-msg.user{align-self:flex-end;background:var(--tint);border:1px solid var(--hair);padding:.5rem .75rem}' +
    '.cvchat-msg.assistant{align-self:flex-start}' +
    '.cvchat-msg.assistant cite{font-style:normal;color:var(--gold);font-size:.85em}' +
    '.cvchat-msg.assistant cite a{color:inherit;text-decoration-color:color-mix(in oklab,currentColor 55%,transparent)}' +
    '.cvchat-msg.error{color:var(--muted);font-size:.9rem}' +
    '.cvchat-starters{padding:0 1rem .75rem;display:flex;flex-direction:column;gap:.6rem}' +
    '.cvchat-starters-group h3{font:400 .72rem system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 .35rem}' +
    '.cvchat-starters-row{display:flex;flex-wrap:wrap;gap:.5rem}' +
    '.cvchat-starters button{background:none;border:1px solid var(--hair);color:var(--navy);font:inherit;font-size:.8rem;text-align:left;padding:.4rem .6rem;cursor:pointer}' +
    '.cvchat-starters button:hover{border-color:var(--navy)}' +
    '.cvchat-form{display:flex;gap:.5rem;padding:.75rem 1rem;border-top:1px solid var(--hair)}' +
    '.cvchat-form textarea{flex:1;font:inherit;font-size:.95rem;resize:none;border:1px solid var(--hair);background:var(--paper);color:var(--ink);padding:.5rem .6rem;min-height:2.6rem;max-height:8rem}' +
    '.cvchat-form button{font:inherit;font-size:.9rem;background:var(--navy);color:var(--paper);border:1px solid var(--navy);padding:.5rem .9rem;cursor:pointer}' +
    '.cvchat-form button[disabled]{opacity:.6;cursor:default}' +
    '.cvchat-foot{padding:0 1rem .75rem;color:var(--muted);font-size:.72rem}' +
    '.cvchat-foot a{color:inherit}' +
    '.cvchat-vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}' +
    '@media(prefers-reduced-motion:no-preference){.cvchat-panel{animation:cvchat-in .2s cubic-bezier(.22,1,.36,1)}@keyframes cvchat-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}}';

  // Bracketed [Section Name] citations link to the matching CV section anchor
  // when the label matches a known section; otherwise they still render as a
  // <cite>, just not as a link. Kept in sync with src/lib/markdown.ts's
  // SECTION_ORDER by title (short titles are not enough here, the model is
  // instructed to cite the full section title).
  var SECTION_LINKS = {
    'Clinical AI and Software': 'clinical-ai',
    'Technical Capabilities': 'technical',
    'Clinical Practice': 'clinical-practice',
    Entrepreneurship: 'entrepreneurship',
    Research: 'research',
    'Education and Credentials': 'education',
    'Teaching and Recognition': 'recognition',
  };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function injectCss() {
    if (document.getElementById('cvchat-css')) return;
    var s = el('style', { id: 'cvchat-css' });
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Render assistant text safely: escape everything, then mark [Section]
  // citations, linking to the matching on-page section when known.
  function renderAssistant(node, text) {
    node.textContent = '';
    var re = /\[([A-Z][A-Za-z ,&-]{1,60})\]/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      var label = m[1];
      var targetId = SECTION_LINKS[label];
      var cite = el('cite', {});
      if (targetId) {
        var link = el('a', { href: '/#' + targetId, text: '[' + label + ']' });
        cite.appendChild(link);
      } else {
        cite.textContent = '[' + label + ']';
      }
      node.appendChild(cite);
      last = m.index + m[0].length;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
  }

  function mount(container, opts) {
    opts = opts || {};
    injectCss();
    var history = [];
    var busy = false;
    var audience = opts.audience || null;
    var starters = opts.starters || [];

    // The visible transcript is NOT itself an aria-live region: streaming
    // token-by-token into a live region causes most screen readers to
    // re-announce the growing message repeatedly, producing a garbled read.
    // A separate, visually hidden status region announces once per turn
    // ("Responding", then the complete answer), not per token.
    var log = el('div', { class: 'cvchat-log', role: 'log', 'aria-live': 'off', 'aria-label': 'Conversation' });
    var status = el('div', { class: 'cvchat-vh', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
    var startersBox = el('div', { class: 'cvchat-starters' });
    var textarea = el('textarea', { rows: '1', maxlength: String(MAX_CHARS), placeholder: 'Ask about his experience', 'aria-label': 'Your question' });
    var sendBtn = el('button', { type: 'submit', text: 'Send question' });
    var form = el('form', { class: 'cvchat-form' }, [textarea, sendBtn]);
    var foot = el('div', { class: 'cvchat-foot' });
    foot.appendChild(document.createTextNode('Experimental. Answers come only from the CV text and cite its sections. Not medical advice. Up to ' + MAX_TURNS + ' turns and 10 messages per hour. Prefer email? '));
    var mail = el('a', { href: 'mailto:' + EMAIL, text: EMAIL });
    foot.appendChild(mail);

    var head = el('div', { class: 'cvchat-head' }, [
      el('div', {}, [el('h2', { text: 'Ask about my work' }), document.createTextNode(' '), el('small', { text: 'grounded on the CV' })]),
    ]);
    var root = el('section', { class: 'cvchat', 'aria-label': 'Ask about my work' }, [head, log, status, startersBox, form, foot]);
    if (opts.floating) {
      root.classList.add('cvchat-panel');
      var close = el('button', { class: 'cvchat-close', type: 'button', text: 'Close', 'aria-label': 'Close chat' });
      var returnFocusTo = opts.returnFocusTo || document.activeElement;

      function closePanel() {
        // Remove the whole host container (passed in as `container`), not just
        // `root`: __cvChatOpen() checks for a leftover #chat-widget host to
        // decide whether to create a fresh panel or refocus an existing one,
        // so leaving an empty host behind made every reopen after a close
        // silently do nothing.
        container.remove();
        document.removeEventListener('keydown', onKeydown, true);
        if (returnFocusTo && typeof returnFocusTo.focus === 'function') returnFocusTo.focus();
      }

      function focusableEls() {
        return Array.prototype.slice.call(
          root.querySelectorAll('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])')
        ).filter(function (n) { return n.offsetParent !== null; });
      }

      // Escape closes the panel; Tab/Shift+Tab wrap inside it (a simple focus trap)
      // so keyboard users cannot silently tab out into the page behind it.
      function onKeydown(e) {
        if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
        if (e.key !== 'Tab') return;
        var items = focusableEls();
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }

      close.addEventListener('click', closePanel);
      document.addEventListener('keydown', onKeydown, true);
      head.appendChild(close);
    }

    function addMsg(role, text) {
      var n = el('div', { class: 'cvchat-msg ' + role });
      if (role === 'assistant') renderAssistant(n, text); else n.textContent = text;
      log.appendChild(n);
      log.scrollTop = log.scrollHeight;
      return n;
    }

    // Group the same four starter strings (cv.chat.starters, unchanged) under
    // three intent labels rather than one flat row. Indices match the fixed
    // order of cv.chat.starters in cv.yaml: 0=fit, 1=SuperHuman safety,
    // 2=research, 3=seven-clinic deployment.
    var STARTER_GROUPS = [
      { label: 'Evaluate fit', indexes: [0] },
      { label: 'See the evidence', indexes: [1, 3] },
      { label: 'Understand the research', indexes: [2] },
    ];

    function setStarters() {
      startersBox.textContent = '';
      if (history.length) return;
      STARTER_GROUPS.forEach(function (g) {
        var qs = g.indexes.map(function (i) { return starters[i]; }).filter(Boolean);
        if (!qs.length) return;
        var row = el('div', { class: 'cvchat-starters-row' });
        qs.forEach(function (q) {
          var b = el('button', { type: 'button', text: q });
          b.addEventListener('click', function () { ask(q); });
          row.appendChild(b);
        });
        startersBox.appendChild(el('div', { class: 'cvchat-starters-group' }, [el('h3', { text: g.label }), row]));
      });
    }

    function ask(question) {
      question = (question || '').trim();
      if (!question || busy) return;
      if (question.length > MAX_CHARS) question = question.slice(0, MAX_CHARS);
      if (history.length >= MAX_TURNS - 1) {
        addMsg('error', 'This conversation has reached ' + MAX_TURNS + ' turns. Reload to start a new one, or email ' + EMAIL + '.');
        return;
      }
      busy = true;
      sendBtn.disabled = true;
      textarea.value = '';
      history.push({ role: 'user', content: question });
      addMsg('user', question);
      setStarters();
      var node = addMsg('assistant', '');
      status.textContent = "Rejeesh's assistant is responding.";
      var answer = '';
      var payload = { messages: history.slice(-MAX_TURNS) };
      if (audience) payload.audience = audience;

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) {
            return res.json().catch(function () { return {}; }).then(function (j) {
              throw new Error(j.error || ('Request failed (' + res.status + ').'));
            });
          }
          var reader = res.body.getReader();
          var dec = new TextDecoder();
          var buf = '';
          function pump() {
            return reader.read().then(function (r) {
              if (r.done) return;
              buf += dec.decode(r.value, { stream: true });
              var parts = buf.split('\n\n');
              buf = parts.pop();
              parts.forEach(function (chunk) {
                var evm = /^event: (\w+)/m.exec(chunk);
                var dm = /^data: (.*)$/m.exec(chunk);
                if (!evm || !dm) return;
                var data = {};
                try { data = JSON.parse(dm[1]); } catch (e) {}
                if (evm[1] === 'delta') { answer += data.text || ''; renderAssistant(node, answer); log.scrollTop = log.scrollHeight; }
                else if (evm[1] === 'error') { throw new Error(data.error || 'The chat could not answer.'); }
              });
              return pump();
            });
          }
          return pump();
        })
        .then(function () {
          if (!answer) { node.remove(); history.pop(); throw new Error('No answer was returned.'); }
          history.push({ role: 'assistant', content: answer });
          // One clean announcement of the finished answer, not one per token.
          status.textContent = 'Response complete. ' + answer;
        })
        .catch(function (err) {
          if (node.parentNode && !answer) node.remove();
          if (history.length && history[history.length - 1].role === 'user') history.pop();
          var msg = (err && err.message) || 'Something went wrong.';
          addMsg('error', msg);
          status.textContent = msg;
        })
        .then(function () {
          busy = false;
          sendBtn.disabled = false;
          textarea.focus();
        });
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); ask(textarea.value); });
    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(textarea.value); }
    });
    textarea.addEventListener('input', function () {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    });

    setStarters();
    container.appendChild(root);
    textarea.focus();
    return root;
  }

  function readStarters() {
    var s = document.querySelector('script[type="application/json"][data-chat-starters]');
    if (!s) return [];
    try { return JSON.parse(s.textContent) || []; } catch (e) { return []; }
  }

  window.__cvChatMount = mount;
  window.__cvChatOpen = function () {
    var existing = document.getElementById('chat-widget');
    if (existing) { existing.querySelector('textarea') && existing.querySelector('textarea').focus(); return; }
    var launcher = document.querySelector('[data-chat-launcher]');
    var host = el('div', { id: 'chat-widget' });
    document.body.appendChild(host);
    mount(host, {
      floating: true,
      audience: launcher ? launcher.getAttribute('data-audience') : null,
      starters: window.__cvChatStarters || readStarters(),
      returnFocusTo: launcher || document.activeElement,
    });
  };
})();
