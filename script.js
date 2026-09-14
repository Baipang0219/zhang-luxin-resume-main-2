document.addEventListener('DOMContentLoaded', async () => {
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lb-content');

  try {
    const response = await fetch('./resume-data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderPage(data);
    bindLightbox(lightbox, lbContent);
    animateBars();
  } catch (error) {
    document.querySelector('main').innerHTML = '<p class="load-error">简历内容加载失败，请通过本地服务器打开页面。</p>';
    console.error('无法加载 resume-data.json:', error);
  }

  function renderPage(data) {
    const { profile, education, skills, honors, experience, works, activities, contact, footer } = data;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-role').textContent = profile.role;
    const avatar = document.getElementById('profile-avatar');
    avatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name} 的个人照片">`;
    document.getElementById('profile-contact').innerHTML = `
      <a href="tel:${profile.phone}" aria-label="电话">📞 ${profile.phone}</a>
      <a href="mailto:${profile.email}" aria-label="邮箱">✉️ ${profile.email}</a>
      <span>🎂 ${profile.birthday}</span>`;
    document.getElementById('profile-stats').innerHTML = profile.stats
      .map(stat => `<div><strong>${stat.label}</strong><span>${stat.value}</span></div>`).join('');

    document.getElementById('resume-content').innerHTML = `
      <div class="col">
        <h3>教育背景</h3>
        <p><strong>${education.school}</strong> | ${education.major}（${education.period}）</p>
        <p class="muted">主修课程：${education.courses}</p>
        <h3>技能与证书</h3>
        <ul class="skills">${skills.map(skill => `
          <li><span>${skill.name}</span><div class="bar"><span style="width:${skill.level}%"></span></div></li>`).join('')}
        </ul>
        <h3>荣誉</h3>
        <ul>${honors.map(honor => `<li>${honor}</li>`).join('')}</ul>
      </div>
      <div class="col">
        <h3>实习经历（精选）</h3>
        ${experience.map(item => `<div class="exp">
          <h4>${item.company} — ${item.title}</h4>
          <span class="muted">${item.period}</span>
          <ul>${item.items.map(detail => `<li>${detail}</li>`).join('')}</ul>
        </div>`).join('')}
      </div>`;

    document.getElementById('works-list').innerHTML = works.map((work, index) => `
      <a class="work-card" href="#" data-work-index="${index}">
        <div class="thumb">${work.type}</div>
        <div class="work-meta"><strong>${work.title}</strong><span>${work.description}</span></div>
      </a>`).join('');

    document.getElementById('activities-list').innerHTML = activities.map(activity => `
      <li><strong>${activity.title}</strong>${activity.period ? `（${activity.period}）` : ''} — ${activity.description}</li>`).join('');
    document.getElementById('contact-details').innerHTML = `电话：<a href="tel:${profile.phone}">${profile.phone}</a><br>邮箱：<a href="mailto:${profile.email}">${profile.email}</a>`;
    document.getElementById('contact-address').textContent = `地址：${contact.address}`;
    document.getElementById('footer-copy').textContent = footer;
    window.resumeWorks = works;
  }

  function bindLightbox(container, content) {
    document.getElementById('works-list').addEventListener('click', event => {
      const card = event.target.closest('.work-card');
      if (!card) return;
      event.preventDefault();
      const work = window.resumeWorks[card.dataset.workIndex];
      content.innerHTML = `<h3 style="margin-top:0">${work.title}</h3><p class="muted">${work.detail}</p>`;
      container.style.display = 'flex';
    });
    const close = () => {
      container.style.display = 'none';
      content.innerHTML = '';
    };
    document.getElementById('lb-close').addEventListener('click', close);
    container.addEventListener('click', event => { if (event.target === container) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }

  function animateBars() {
    document.querySelectorAll('.bar span').forEach(bar => {
      const target = bar.style.width;
      bar.style.width = '0';
      requestAnimationFrame(() => { bar.style.width = target; });
    });
  }
});
