
(async()=>{
  const sb=window.cpSupabase;
  const root=document.getElementById('publicSiteRoot');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function fail(msg){root.innerHTML=`<div class="public-state"><h1>Site unavailable</h1><p>${esc(msg)}</p></div>`}

  const wanted=new URLSearchParams(location.search).get('site')||localStorage.getItem('cpCurrentSiteShared')||localStorage.getItem('cpCurrentSite');
  let q=sb.from('websites').select('*');
  if(wanted){
    if(/^[0-9a-f-]{36}$/i.test(wanted)) q=q.eq('id',wanted);
    else q=q.eq('slug',wanted);
  }
  const siteR=wanted?await q.maybeSingle():await q.order('created_at').limit(1).maybeSingle();
  if(siteR.error){fail(siteR.error.message);return}
  const w=siteR.data;
  if(!w){fail('This campaign website is not published yet.');return}

  let survey=null,questions=[];
  if(w.selected_survey_id){
    const [sr,qr]=await Promise.all([
      sb.from('surveys').select('*').eq('id',w.selected_survey_id).maybeSingle(),
      sb.from('survey_questions').select('*').eq('survey_id',w.selected_survey_id).order('position')
    ]);
    if(!sr.error)survey=sr.data;
    if(!qr.error)questions=qr.data||[];
  }
  const campaignsR=await sb.from('campaigns').select('*').eq('website_id',w.id).order('created_at');
  const campaigns=campaignsR.error?[]:(campaignsR.data||[]);
  const currentCampaign=campaigns[0]||null;

  const c=w.content||{};
  const flat=c.candidateName?c:null;
  const name=flat?.candidateName||w.name||'Candidate';
  const area=flat?.candidateArea||w.area||'Local area';
  const initials=flat?.candidateInitials||name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
  const navy=flat?.brandNavy||w.branding?.primary||'#08254a';
  const blue=flat?.brandBlue||w.branding?.secondary||'#1476d4';
  const hero=flat?.heroHeadline||c.hero?.headline||`A stronger voice for ${area}.`;
  const heroCopy=flat?.heroCopy||c.hero?.supporting_copy||`${name} is campaigning on the issues that matter locally.`;
  const aboutHeadline=flat?.aboutHeadline||c.about?.heading||'Why I’m standing';
  const aboutLead=flat?.aboutLead||c.about?.body||`${area} deserves visible, practical local representation.`;
  const priorities=(flat?.priorities||c.priorities||[]).map((p,i)=>typeof p==='string'?{title:p,copy:''}:p);
  const campaignTitle=flat?.campaignTitle||currentCampaign?.headline||c.campaign?.headline||'Current campaign';
  const campaignCopy=flat?.campaignCopy||currentCampaign?.supporting_copy||'Back the campaign and help make the case for local action.';
  const first=name.split(/\s+/)[0];

  function question(q){
    const label=`<label>${esc(q.label)}</label>`;
    if(q.question_type==='text')return `<div class="form-q">${label}<textarea name="${q.id}"></textarea></div>`;
    if(q.question_type==='single')return `<div class="form-q">${label}<select name="${q.id}"><option value="">Select an option</option>${(q.options||[]).map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
    if(q.question_type==='multi')return `<div class="form-q">${label}<div class="checks">${(q.options||[]).map(o=>`<label><input type="checkbox" name="${q.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div></div>`;
    if(q.question_type==='yesno')return `<div class="form-q">${label}<select name="${q.id}"><option value="">Select</option><option>Yes</option><option>No</option></select></div>`;
    if(q.question_type==='rating')return `<div class="form-q">${label}<select name="${q.id}">${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></div>`;
    if(q.question_type==='postcode')return `<div class="form-q">${label}<input name="${q.id}" placeholder="Postcode"></div>`;
    if(q.question_type==='phone')return `<div class="form-q">${label}<input name="${q.id}" placeholder="Phone number"></div>`;
    return ''
  }

  root.innerHTML=`<style>:root{--navy:${navy};--blue:${blue}}</style>
  <header class="pub-header"><div class="pub-container"><div class="pub-id"><span class="pub-roundel">${esc(initials)}</span><span><strong>${esc(name)}</strong><small>Candidate for ${esc(area)}</small></span></div><nav><a href="#about">About</a><a href="#priorities">Priorities</a>${survey?'<a href="#survey">Have your say</a>':''}${currentCampaign?'<a href="#campaign">Campaign</a>':''}</nav></div></header>
  <main>
    <section class="pub-hero"><div class="pub-container"><div><h1>${esc(hero)}</h1><p>${esc(heroCopy)}</p>${survey?'<a class="pub-btn" href="#survey">Tell us what matters</a>':''}</div></div></section>
    <section class="pub-section" id="about"><div class="pub-container"><h2>${esc(aboutHeadline)}</h2><p class="pub-lead">${esc(aboutLead)}</p>${flat?.aboutCopy?`<p>${esc(flat.aboutCopy)}</p>`:''}</div></section>
    <section class="pub-section alt" id="priorities"><div class="pub-container"><h2>${esc(first)}’s priorities</h2><div class="pub-grid">${priorities.map(p=>`<article><h3>${esc(p.title)}</h3><p>${esc(p.copy||'')}</p></article>`).join('')}</div></div></section>
    ${survey?`<section class="pub-section" id="survey"><div class="pub-container"><h2>${esc(survey.name)}</h2><p class="pub-lead">Tell ${esc(first)} what matters most locally.</p><form class="pub-form"><div class="two"><input name="first_name" placeholder="First name"><input name="last_name" placeholder="Last name"><input class="full" name="email" type="email" placeholder="Email address"><input class="full" name="postcode" placeholder="Postcode"></div>${questions.filter(q=>q.enabled).map(question).join('')}<button class="pub-btn" type="submit">Send my views</button><p class="form-note">Your information will be stored securely by the campaign.</p></form></div></section>`:''}
    ${currentCampaign?`<section class="pub-section alt" id="campaign"><div class="pub-container"><h2>${esc(campaignTitle)}</h2><p class="pub-lead">${esc(campaignCopy)}</p><form class="pub-action-form" data-action="campaign_back"><div class="two"><input name="first_name" placeholder="First name"><input name="last_name" placeholder="Last name"><input class="full" name="email" type="email" placeholder="Email address"><input class="full" name="postcode" placeholder="Postcode"></div><button class="pub-btn" type="submit">Back the campaign</button></form></div></section>`:''}
    ${(flat?.volunteerHeadline||c.volunteer?.enabled)?`<section class="pub-section" id="volunteer"><div class="pub-container"><h2>${esc(flat?.volunteerHeadline||'Help locally')}</h2><p class="pub-lead">There are lots of ways to help the campaign locally.</p><form class="pub-action-form" data-action="volunteer"><div class="two"><input name="first_name" placeholder="First name"><input name="last_name" placeholder="Last name"><input class="full" name="email" type="email" placeholder="Email address"><input class="full" name="postcode" placeholder="Postcode"></div><select name="volunteer_type"><option value="">How would you like to help?</option><option>Leaflets</option><option>Doorstep</option><option>Poster</option><option>Online</option></select><button class="pub-btn" type="submit">I can help</button></form></div></section>`:''}
  </main>
  <footer class="pub-footer"><div class="pub-container"><strong>${esc(name)}</strong><small>Candidate for ${esc(area)}</small></div></footer>`;

  const form=root.querySelector('.pub-form');
  if(form){
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const button=form.querySelector('button[type=submit]');
      const old=button.textContent;button.disabled=true;button.textContent='Sending…';
      form.querySelector('.submit-message')?.remove();
      const fd=new FormData(form),answers={};
      questions.filter(q=>q.enabled).forEach(q=>{
        if(q.question_type==='multi') answers[q.id]=fd.getAll(q.id);
        else answers[q.id]=fd.get(q.id)||'';
      });
      const {error}=await sb.rpc('public_submit_survey',{
        p_website_id:w.id,p_survey_id:survey.id,p_campaign_id:currentCampaign?.id||null,
        p_first_name:fd.get('first_name')||null,p_last_name:fd.get('last_name')||null,
        p_email:fd.get('email')||null,p_postcode:fd.get('postcode')||null,p_phone:null,
        p_source:new URLSearchParams(location.search).get('source')||'website',p_answers:answers
      });
      const msg=document.createElement('div');msg.className='submit-message '+(error?'error':'success');
      msg.textContent=error?'We could not submit your response. Please try again.':'Thank you — your views have been recorded.';
      form.appendChild(msg);
      button.disabled=false;button.textContent=old;
      if(!error)form.reset();
    })
  }


  root.querySelectorAll('.pub-action-form').forEach(actionForm=>{
    actionForm.addEventListener('submit',async e=>{
      e.preventDefault();
      const button=actionForm.querySelector('button[type=submit]');
      const old=button.textContent;button.disabled=true;button.textContent='Sending…';
      actionForm.querySelector('.submit-message')?.remove();
      const fd=new FormData(actionForm),action=actionForm.dataset.action;
      const payload={};
      if(action==='volunteer')payload.volunteer_type=fd.get('volunteer_type')||'General';
      const {error}=await sb.rpc('public_capture_action',{
        p_website_id:w.id,p_campaign_id:currentCampaign?.id||null,p_action_type:action,
        p_first_name:fd.get('first_name')||null,p_last_name:fd.get('last_name')||null,
        p_email:fd.get('email')||null,p_postcode:fd.get('postcode')||null,p_phone:null,
        p_source:new URLSearchParams(location.search).get('source')||'website',p_payload:payload
      });
      const msg=document.createElement('div');msg.className='submit-message '+(error?'error':'success');
      msg.textContent=error?'We could not save that just now. Please try again.':(action==='volunteer'?'Thank you — the campaign has your offer to help.':'Thank you — your support has been recorded.');
      actionForm.appendChild(msg);button.disabled=false;button.textContent=old;if(!error)actionForm.reset();
    })
  });

})();
