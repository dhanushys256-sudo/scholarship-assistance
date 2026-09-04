// =============================================
//  SCHOLARBRIDGE — AI SUPPORT CHATBOT ASSISTANT
// =============================================

(function () {
  'use strict';

  // Chatbot Knowledge Base
  const BOT_RESPONSES = [
    {
      keywords: ['hello', 'hi', 'hey', 'start', 'help'],
      reply: "Hello! 👋 I'm **ScholarBot**, your 24/7 scholarship guide. How can I assist you today? You can ask about eligibility, application deadlines, required documents, or tracking your support ticket."
    },
    {
      keywords: ['eligible', 'eligibility', 'criteria', 'qualify'],
      reply: "To check which scholarships you qualify for, you can try our interactive [Eligibility Checker](eligibility.html)! Most government schemes require 60%–80% marks in Class 12 and family income below ₹4.5L–₹6L per year."
    },
    {
      keywords: ['document', 'documents', 'upload', 'certificate', 'aadhaar'],
      reply: "Commonly required documents include:\n• Class 10/12 Marksheet 📋\n• Income Certificate issued by Tahsildar / Revenue Authority 📊\n• Aadhaar Card (Both sides) 💳\n• Bank Passbook with IFSC code 🏦\n• Domicile or Caste Certificate (if applicable)."
    },
    {
      keywords: ['merit', 'high marks', 'topper'],
      reply: "For meritorious students, we have the **National Merit Scholarship** (up to ₹75,000/year, min 80% marks) and the **INSPIRE Scholarship** (up to ₹80,000/year for pure science students)! You can view them on the [Scholarships Page](scholarships.html)."
    },
    {
      keywords: ['girl', 'women', 'female', 'pragati'],
      reply: "We strongly support girl students! Check out the **AICTE Pragati Scholarship for Girls** (₹50,000/year) and special regional women empowerment schemes. Head over to [Scholarships](scholarships.html) and select the 'Girls' filter."
    },
    {
      keywords: ['deadline', 'last date', 'expire'],
      reply: "Upcoming deadlines:\n• National Merit: Oct 31, 2026\n• Post-Matric SC/ST: Sep 30, 2026\n• INSPIRE: Dec 15, 2026\n• AICTE Pragati: Nov 15, 2026\nApply early to avoid last-minute server rush!"
    },
    {
      keywords: ['ticket', 'track', 'status', 'sch-'],
      isTicketCheck: true
    },
    {
      keywords: ['location', 'office', 'address', 'where', 'ewit', 'bangalore', 'bengaluru'],
      reply: "Our assistance center is located at:\n📍 **East West Institute of Technology (EWIT)**,\nAnjananagar, Magadi Main Road,\nBengaluru - 560091, Karnataka.\nSupport hours: Mon–Sat, 9:00 AM – 6:00 PM IST."
    },
    {
      keywords: ['phone', 'contact', 'call', 'email', 'number', 'helpline'],
      reply: "You can reach us through:\n📞 Helpline: **9999999999** (Toll-Free, 9AM–6PM)\n📧 Email: **scholarship777@gmail.com**\n💬 Or submit a detailed inquiry on our [Contact Page](contact.html)."
    }
  ];

  function getSavedTickets() {
    try {
      return JSON.parse(localStorage.getItem('scholarbridge_contact_messages') || '[]');
    } catch (e) {
      return [];
    }
  }

  function handleUserQuery(input) {
    const clean = input.toLowerCase().trim();

    // Check for ticket lookup
    const ticketMatch = clean.match(/#?sch-\d{4}-\w+/i);
    if (ticketMatch || clean.includes('ticket') || clean.includes('track')) {
      const tickets = getSavedTickets();
      if (ticketMatch) {
        const queryId = ticketMatch[0].toUpperCase().replace('#', '');
        const found = tickets.find(t => (t.ticketId || '').toUpperCase().includes(queryId));
        if (found) {
          return `🎫 **Ticket #${found.ticketId || queryId} Found!**\n• Status: **${(found.status || 'Under Review').toUpperCase()}**\n• Subject: ${found.subject || 'Inquiry'}\n• Submitted on: ${new Date(found.createdAt || Date.now()).toLocaleDateString('en-IN')}\nOur team typically responds via email within 24 hours.`;
        }
        return `I couldn't find an active record for ticket **#${queryId}**. Please double-check the ID or enter your registered email on the [Contact Page](contact.html).`;
      }
      if (tickets.length > 0) {
        const latest = tickets[tickets.length - 1];
        return `You have a recent inquiry with reference **#${latest.ticketId || 'SCH-2026-RECENT'}** (${latest.subject || 'General'}). Current status: **Under Review ⏳**. You can also check on the [Contact Page](contact.html).`;
      }
      return "To track an inquiry, please provide your ticket reference number (e.g. *#SCH-2026-4821*).";
    }

    // Keyword match
    for (const item of BOT_RESPONSES) {
      if (item.keywords && item.keywords.some(k => clean.includes(k))) {
        return item.reply;
      }
    }

    return "Thank you for asking! I don't have a direct answer for that yet, but our counselors are on standby. You can [Message Support](contact.html) or call our toll-free helpline at **9999999999**.";
  }

  function renderMarkdownLinks(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--primary);text-decoration:underline;font-weight:600;">$1</a>')
               .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br/>');
  }

  function initChatbot() {
    if (document.getElementById('scholarChatbot')) return;

    // Create Launcher
    const launcher = document.createElement('button');
    launcher.id = 'scholarChatLauncher';
    launcher.className = 'chatbot-launcher';
    launcher.setAttribute('aria-label', 'Open Support Chat');
    launcher.innerHTML = `💬<span class="chatbot-badge"></span>`;
    document.body.appendChild(launcher);

    // Create Window
    const win = document.createElement('div');
    win.id = 'scholarChatbot';
    win.className = 'chatbot-window hidden';
    win.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div style="font-size:1.4rem;">🤖</div>
          <div>
            <h4>ScholarBridge Assistant</h4>
            <span>● Online • Instant Replies</span>
          </div>
        </div>
        <button class="chatbot-close-btn" id="chatCloseBtn" title="Close chat">✕</button>
      </div>
      <div class="chatbot-messages" id="chatMessages">
        <div class="chatbot-bubble bot">
          Hello there! 👋 I am the ScholarBridge virtual advisor. How can I help you find and apply for scholarships today?
          <div class="chatbot-chips">
            <span class="chatbot-chip" data-query="Which scholarships am I eligible for?">🎓 Eligibility</span>
            <span class="chatbot-chip" data-query="What documents do I need to apply?">📋 Documents</span>
            <span class="chatbot-chip" data-query="Upcoming deadlines">🗓️ Deadlines</span>
            <span class="chatbot-chip" data-query="Track my support ticket">🎫 Track Ticket</span>
          </div>
        </div>
      </div>
      <div class="chatbot-input-wrap">
        <input type="text" id="chatInput" class="form-control form-control-sm" placeholder="Ask a question..." style="font-size:0.86rem;padding:8px 12px;" />
        <button class="btn btn-primary btn-sm" id="chatSendBtn" style="padding:0 14px;">➤</button>
      </div>
    `;
    document.body.appendChild(win);

    const messages = win.querySelector('#chatMessages');
    const input = win.querySelector('#chatInput');
    const sendBtn = win.querySelector('#chatSendBtn');
    const closeBtn = win.querySelector('#chatCloseBtn');

    function toggleChat() {
      const isHidden = win.classList.contains('hidden');
      if (isHidden) {
        win.classList.remove('hidden');
        input.focus();
      } else {
        win.classList.add('hidden');
      }
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function addMessage(text, sender = 'bot') {
      const bubble = document.createElement('div');
      bubble.className = `chatbot-bubble ${sender}`;
      bubble.innerHTML = renderMarkdownLinks(text);
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'chatbot-typing';
      typing.id = 'chatTyping';
      typing.innerHTML = `<span></span><span></span><span></span>`;
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      const t = document.getElementById('chatTyping');
      if (t) t.remove();
    }

    function handleSend(userText) {
      const txt = (userText || input.value).trim();
      if (!txt) return;

      addMessage(txt, 'user');
      if (!userText) input.value = '';

      showTyping();
      setTimeout(() => {
        hideTyping();
        const reply = handleUserQuery(txt);
        addMessage(reply, 'bot');
      }, 650);
    }

    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    messages.addEventListener('click', (e) => {
      if (e.target.classList.contains('chatbot-chip')) {
        const q = e.target.dataset.query;
        handleSend(q);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
