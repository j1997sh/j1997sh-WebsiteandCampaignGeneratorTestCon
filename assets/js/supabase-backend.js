
/* =========================================================
   STAGE 2 — SUPABASE BACKEND BRIDGE
   Supabase is authoritative. localStorage is now a UI cache
   so the existing visual prototype can stay synchronous.
   ========================================================= */
(() => {
  'use strict';
  const sb = window.cpSupabase;
  if (!sb || !window.CP) return;

  const DB_KEY = 'campaignPlatformDB:v1';
  const pathname = location.pathname.split('/').pop() || 'index.html';
  const PUBLIC_PAGES = new Set(['index.html','login.html','forgot-password.html','campaign-thanks.html']);
  const PROTECTED = !PUBLIC_PAGES.has(pathname);
  const bootKey = 'cpStage2Hydrated:' + pathname;

  const $ = id => document.getElementById(id);
  const capStatus = s => s === 'published' ? 'Published' : s === 'archived' ? 'Archived' : 'Draft';
  const dbStatus = s => String(s||'draft').toLowerCase();

  function bootOverlay(message='Connecting to Campaign Platform…'){
    if(document.getElementById('cpStage2Boot')) return;
    const el=document.createElement('div');
    el.id='cpStage2Boot';
    el.innerHTML=`<div class="cp-stage2-boot-card"><span class="cp-stage2-spinner"></span><strong>${message}</strong><small>Your campaign data is loading securely.</small></div>`;
    document.body.appendChild(el);
  }
  function removeBoot(){ document.getElementById('cpStage2Boot')?.remove(); }

  function showBackendError(message){
    removeBoot();
    let host=document.querySelector('.app-content')||document.querySelector('.login-card')||document.body;
    let e=document.getElementById('cpBackendError');
    if(!e){e=document.createElement('div');e.id='cpBackendError';e.className='state-banner error';host.prepend(e)}
    e.textContent=message;
  }

  function editorConfigFromWebsite(w){
    const c=w.content||{};
    if(c.candidateName) return {...c, images:c.images||{}};
    const priorities=(c.priorities||[]).map((p,i)=>typeof p==='string'
      ? {title:p,copy:['Push for proper repairs and safer streets.','Back practical action in the neighbourhood.','Stand up for the local services residents rely on.'][i]||''}
      : p);
    return {
      candidateName:w.name||'Candidate',
      candidateInitials:(w.name||'Candidate').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase(),
      candidateArea:w.area||'Local area',
      candidateTitle:`Candidate for ${w.area||'the local area'}`,
      candidateEmail:'',
      brandNavy:w.branding?.primary||'#08254a',
      brandBlue:w.branding?.secondary||'#1476d4',
      heroHeadline:c.hero?.headline||'A stronger voice for your area.',
      heroCopy:c.hero?.supporting_copy||'Listening to residents and campaigning on the issues that matter locally.',
      heroCta:'Tell us what matters',
      aboutHeadline:c.about?.heading||'Why I’m standing',
      aboutLead:c.about?.body||'Local residents deserve visible, practical representation.',
      aboutCopy:'',
      priorities:priorities.length?priorities:[
        {title:'Roads and pavements',copy:'Push for proper repairs and safer streets.'},
        {title:'Cleaner and safer streets',copy:'Back practical action in the neighbourhood.'},
        {title:'Protecting local services',copy:'Stand up for the services residents rely on.'}
      ],
      surveyIntro:'Tell us what matters most locally.',
      surveyQuestion:'If you could change one thing locally, what would it be?',
      votingIntentEnabled:false,
      campaignTitle:c.campaign?.headline||'Current campaign',
      campaignCopy:'Back the campaign and help make the case for local action.',
      volunteerHeadline:'Help locally',
      volunteer1:'Deliver a few leaflets',
      volunteer2:'Display a poster',
      volunteer3:'Join us on the doorstep',
      volunteer4:'Help online',
      footerDescription:`A local campaign website for ${w.name||'the candidate'} in ${w.area||'the area'}.`,
      sections:[
        {id:'about',visible:true},{id:'priorities',visible:true},{id:'survey',visible:true},
        {id:'campaign',visible:true},{id:'volunteer',visible:true}
      ],
      images:{}
    };
  }

  async function hydrate(){
    const {data:{session},error:sessionError}=await sb.auth.getSession();
    if(sessionError) throw sessionError;
    if(!session){
      if(PROTECTED){
        const next=encodeURIComponent(pathname+location.search);
        location.replace('login.html?next='+next);
      }
      return null;
    }

    if(!PROTECTED) return session;

    const accountRes=await sb.from('accounts').select('*').limit(1).single();
    if(accountRes.error) throw accountRes.error;
    const account=accountRes.data;

    const [
      websitesR,surveysR,questionsR,campaignsR,graphicsR,peopleR,actionsR,
      integrationsR,versionsR,tagsR,personTagsR
    ]=await Promise.all([
      sb.from('websites').select('*').order('created_at'),
      sb.from('surveys').select('*').order('created_at'),
      sb.from('survey_questions').select('*').order('position'),
      sb.from('campaigns').select('*').order('created_at'),
      sb.from('graphics').select('*').order('created_at'),
      sb.from('people').select('*').order('created_at'),
      sb.from('supporter_actions').select('*').order('created_at',{ascending:false}),
      sb.from('integrations').select('*').order('created_at'),
      sb.from('publish_versions').select('*').order('created_at',{ascending:false}),
      sb.from('tags').select('*').order('name'),
      sb.from('person_tags').select('*')
    ]);
    const responses=[websitesR,surveysR,questionsR,campaignsR,graphicsR,peopleR,actionsR,integrationsR,versionsR,tagsR,personTagsR];
    const err=responses.find(r=>r.error)?.error;
    if(err) throw err;

    const questionsBySurvey={};
    (questionsR.data||[]).forEach(q=>{
      (questionsBySurvey[q.survey_id] ||= []).push({
        id:q.id,type:q.question_type,label:q.label,enabled:q.enabled,required:q.required,options:q.options||[]
      });
    });

    let cached={};try{cached=JSON.parse(localStorage.getItem(DB_KEY)||'{}')}catch(e){}
    let active=cached.activeWebsiteId;
    if(!(websitesR.data||[]).some(w=>w.id===active)) active=websitesR.data?.[0]?.id||null;

    const local={
      account:{id:account.id,name:account.name,ownerUserId:account.owner_user_id},
      activeWebsiteId:active,
      websites:{},campaigns:{},surveys:{},graphics:{},people:{},
      actions:[],integrations:{},history:{}
    };

    (websitesR.data||[]).forEach(w=>local.websites[w.id]={
      id:w.id,name:w.name,area:w.area||'',type:w.site_type||'councillor_lite',
      status:capStatus(w.status),domain:w.domain||'',slug:w.slug||'',
      surveyId:w.selected_survey_id||null,branding:w.branding||{},
      content:w.content||{},heroImagePath:w.hero_image_path||null,aboutImagePath:w.about_image_path||null,updatedAt:w.updated_at
    });

    (surveysR.data||[]).forEach(s=>local.surveys[s.id]={
      id:s.id,websiteId:s.website_id||null,name:s.name,status:capStatus(s.status),
      responses:s.response_count||0,settings:s.settings||{},
      questions:questionsBySurvey[s.id]||[],updatedAt:s.updated_at
    });

    (campaignsR.data||[]).forEach(c=>local.campaigns[c.id]={
      id:c.id,websiteId:c.website_id,surveyId:c.survey_id||null,name:c.name,slug:c.slug||'',
      status:capStatus(c.status),headline:c.headline||c.name,support:c.supporting_copy||'',
      imagePath:c.image_path||null,previewPath:c.preview_path||null,points:c.key_points||[],settings:c.settings||{},
      supporterCount:c.supporter_count||0,updatedAt:c.updated_at
    });

    (graphicsR.data||[]).forEach(g=>local.graphics[g.id]={
      id:g.id,websiteId:g.website_id||null,campaignId:g.campaign_id||null,
      title:g.title,type:g.graphic_type,format:g.format,status:g.status==='archived'?'Archived':'Saved',
      ...g.state,previewPath:g.preview_path||null,savedAt:g.updated_at
    });

    const tagById=Object.fromEntries((tagsR.data||[]).map(t=>[t.id,t]));
    const tagsByPerson={};
    (personTagsR.data||[]).forEach(pt=>{const t=tagById[pt.tag_id];if(t)(tagsByPerson[pt.person_id] ||= []).push(t)});
    (peopleR.data||[]).forEach(p=>local.people[p.id]={
      id:p.id,name:[p.first_name,p.last_name].filter(Boolean).join(' ')||p.email||'Supporter',
      firstName:p.first_name||'',lastName:p.last_name||'',email:p.email||'',postcode:p.postcode||'',
      phone:p.phone||'',source:p.source||'',votingIntention:p.voting_intention||'',
      notes:p.notes||'',external:p.external_ids||{},consentEmail:p.consent_email,
      tags:tagsByPerson[p.id]||[]
    });

    local.actions=(actionsR.data||[]).map(a=>({
      id:a.id,type:a.action_type,personId:a.person_id,websiteId:a.website_id,
      campaignId:a.campaign_id,surveyId:a.survey_id,
      text:a.payload?.text||a.action_type,time:a.created_at,payload:a.payload||{}
    }));

    (integrationsR.data||[]).forEach(i=>local.integrations[i.provider]={
      id:i.id,label:i.provider,status:i.status,connected:i.status==='connected',
      lastSync:i.last_sync_at,lastError:i.last_error,settings:i.settings||{}
    });

    (versionsR.data||[]).forEach(v=>{
      const key=(v.entity_type==='website'?'websites':v.entity_type==='campaign'?'campaigns':'surveys')+':'+v.entity_id;
      (local.history[key] ||= []).push({id:v.id,label:v.label||'Published version',time:v.created_at,data:v.snapshot});
    });

    localStorage.setItem(DB_KEY,JSON.stringify(local));
    if(active){
      localStorage.setItem('cpCurrentSite',active);
      localStorage.setItem('cpCurrentSiteShared',active);
    }

    const cpSitesObj={};
    (websitesR.data||[]).forEach(w=>{
      cpSitesObj[w.id]={
        name:w.name,area:w.area||'',status:w.status==='published'?'live':w.status,
        config:editorConfigFromWebsite(w)
      };
    });
    localStorage.setItem('cpSites',JSON.stringify(cpSitesObj));
    return session;
  }

  // -------------------------------------------------------
  // Auth UI
  // -------------------------------------------------------
  async function bindAuth(){
    const login=document.querySelector('form[data-demo-login]');
    if(login){
      const email=login.querySelector('input[type=email]');
      const password=login.querySelector('input[type=password]');
      email.value=''; password.value='';
      login.closest('.login-card')?.querySelector('.muted')?.replaceChildren(document.createTextNode('Sign in to your Campaign Platform account.'));
      login.addEventListener('submit',async e=>{
        e.preventDefault(); e.stopImmediatePropagation();
        const button=login.querySelector('button[type=submit]');
        const old=button.textContent;button.disabled=true;button.textContent='Signing in…';
        document.getElementById('loginError')?.remove();
        const {error}=await sb.auth.signInWithPassword({email:email.value.trim(),password:password.value});
        if(error){
          const n=document.createElement('div');n.id='loginError';n.className='state-banner error';n.textContent=error.message;login.prepend(n);
          button.disabled=false;button.textContent=old;return;
        }
        sessionStorage.clear();
        const next=new URLSearchParams(location.search).get('next')||'dashboard.html';
        location.href=next;
      },true);
    }

    const reset=document.querySelector('form[data-stage2-reset]');
    if(reset){
      reset.addEventListener('submit',async e=>{
        e.preventDefault();
        const email=reset.querySelector('input[type=email]').value.trim();
        const btn=reset.querySelector('button');btn.disabled=true;btn.textContent='Sending…';
        const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:new URL('login.html',location.href).href});
        const msg=document.createElement('div');msg.className='state-banner '+(error?'error':'success');msg.textContent=error?error.message:'Reset link sent. Check your inbox.';
        reset.prepend(msg);btn.disabled=false;btn.textContent='Send reset link';
      })
    }

    const logout=document.getElementById('logoutLink');
    if(logout) logout.addEventListener('click',async e=>{
      e.preventDefault(); await sb.auth.signOut();
      localStorage.removeItem(DB_KEY);localStorage.removeItem('cpSites');sessionStorage.clear();
      location.href='login.html'
    },true);
  }


  window.CPStage2 = window.CPStage2 || {};
  window.CPStage2.addPersonTag=async(personId,tagName)=>{
    const {error}=await sb.rpc('add_person_tag',{p_person_id:personId,p_tag:tagName});
    if(error)throw error;
  };
  window.CPStage2.removePersonTag=async(personId,tagId)=>{
    const {error}=await sb.rpc('remove_person_tag',{p_person_id:personId,p_tag_id:tagId});
    if(error)throw error;
  };
  window.CPStage2.uploadAsset=async(file,folder)=>{
    const d=CP.db(),account=d.account?.id;
    if(!account)throw new Error('Account unavailable');
    const ext=(file.name.split('.').pop()||'bin').toLowerCase();
    const safe=(file.name.replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')||'asset');
    const path=`${account}/${folder}/${Date.now()}-${safe}.${ext}`;
    const {error}=await sb.storage.from('campaign-assets').upload(path,file,{upsert:false,contentType:file.type||undefined});
    if(error)throw error;
    return path;
  };
  window.CPStage2.signedAssetUrl=async(path,seconds=3600)=>{
    if(!path)return null;
    const {data,error}=await sb.storage.from('campaign-assets').createSignedUrl(path,seconds);
    if(error)throw error;return data.signedUrl;
  };

  // -------------------------------------------------------
  // Sync helpers
  // -------------------------------------------------------
  const timers=new Map();
  function debounce(key,fn,delay=450){
    clearTimeout(timers.get(key));
    timers.set(key,setTimeout(()=>{timers.delete(key);fn().catch(err=>showBackendError('Could not save to Supabase: '+err.message))},delay));
  }

  async function accountId(){
    const d=CP.db(); if(d.account?.id) return d.account.id;
    const r=await sb.from('accounts').select('id').limit(1).single();
    if(r.error) throw r.error; return r.data.id;
  }

  async function syncWebsite(w){
    const aid=await accountId();
    const payload={
      id:w.id,account_id:aid,name:w.name,area:w.area||null,site_type:w.type||'councillor_lite',
      status:dbStatus(w.status),domain:w.domain||null,slug:w.slug||null,
      selected_survey_id:w.surveyId||null,branding:w.branding||{},content:w.content||{},
      hero_image_path:w.heroImagePath||null,about_image_path:w.aboutImagePath||null
    };
    const r=await sb.from('websites').upsert(payload);
    if(r.error) throw r.error;
  }
  async function syncCampaign(c){
    const aid=await accountId();
    const r=await sb.from('campaigns').upsert({
      id:c.id,account_id:aid,website_id:c.websiteId,survey_id:c.surveyId||null,
      name:c.name,slug:c.slug||null,status:dbStatus(c.status),headline:c.headline||c.name,
      supporting_copy:c.support||'',image_path:c.imagePath||null,preview_path:c.previewPath||null,key_points:c.points||[],
      settings:c.settings||{},supporter_count:c.supporterCount||0
    }); if(r.error) throw r.error;
  }
  async function syncSurvey(s){
    const aid=await accountId();
    let r=await sb.from('surveys').upsert({
      id:s.id,account_id:aid,website_id:s.websiteId||null,name:s.name,status:dbStatus(s.status),
      settings:s.settings||{},response_count:s.responses||0
    }); if(r.error) throw r.error;
    r=await sb.from('survey_questions').delete().eq('survey_id',s.id); if(r.error) throw r.error;
    if((s.questions||[]).length){
      r=await sb.from('survey_questions').insert((s.questions||[]).map((q,i)=>({
        id:isUuid(q.id)?q.id:crypto.randomUUID(),survey_id:s.id,position:i+1,
        question_type:q.type,label:q.label,enabled:q.enabled!==false,required:!!q.required,options:q.options||[]
      }))); if(r.error) throw r.error;
    }
  }
  async function syncGraphic(g){
    const aid=await accountId();
    const state={...g};['id','websiteId','campaignId','title','type','format','status','previewPath','savedAt'].forEach(k=>delete state[k]);
    const r=await sb.from('graphics').upsert({
      id:g.id,account_id:aid,website_id:g.websiteId||null,campaign_id:g.campaignId||null,
      title:g.title||'Campaign graphic',graphic_type:g.type||'announcement',format:g.format||'square',
      status:String(g.status||'saved').toLowerCase()==='archived'?'archived':'saved',
      state,preview_path:g.previewPath||null
    }); if(r.error) throw r.error;
  }
  async function deleteRemote(type,id){
    const table={websites:'websites',campaigns:'campaigns',surveys:'surveys',graphics:'graphics',people:'people'}[type];
    if(!table)return;const r=await sb.from(table).delete().eq('id',id);if(r.error)throw r.error
  }
  function isUuid(v){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''))}
  function queueSync(type,item){
    if(!item||!isUuid(item.id)) return;
    const fn={websites:syncWebsite,campaigns:syncCampaign,surveys:syncSurvey,graphics:syncGraphic}[type];
    if(fn) debounce(type+':'+item.id,()=>fn(item));
  }

  function installCPBridge(){
    // UUIDs from now on, so records can be written directly to Postgres.
    CP.uid=()=>crypto.randomUUID();

    const originalPut=CP.put.bind(CP),originalPatch=CP.patch.bind(CP),originalRemove=CP.remove.bind(CP);
    CP.put=(type,item)=>{const out=originalPut(type,item);queueSync(type,out);return out};
    CP.patch=(type,id,changes)=>{const out=originalPatch(type,id,changes);queueSync(type,out);return out};
    CP.remove=(type,id)=>{const out=originalRemove(type,id);debounce('delete:'+type+':'+id,()=>deleteRemote(type,id),50);return out};

    CP.createSurvey=(name)=>{
      const d=CP.db(),w=d.websites[d.activeWebsiteId],item={
        id:crypto.randomUUID(),websiteId:w?.id||null,name,status:'Draft',responses:0,questions:[],
        settings:{},updatedAt:new Date().toISOString()
      }; return CP.put('surveys',item)
    };
    CP.createCampaign=(name)=>{
      const d=CP.db(),w=d.websites[d.activeWebsiteId],item={
        id:crypto.randomUUID(),websiteId:w?.id||null,name,
        slug:String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
        status:'Draft',headline:name,support:'',points:['Key point one','Key point two','Key point three'],
        surveyId:w?.surveyId||null,supporterCount:0,settings:{},updatedAt:new Date().toISOString()
      }; return CP.put('campaigns',item)
    };
    CP.saveGraphic=(g)=>{
      const d=CP.db(),w=d.websites[d.activeWebsiteId],item={
        id:isUuid(g.id)?g.id:crypto.randomUUID(),websiteId:w?.id||null,status:'Saved',
        savedAt:new Date().toISOString(),...g
      }; if(!isUuid(item.id))item.id=crypto.randomUUID();return CP.put('graphics',item)
    };
    CP.createWebsite=(name,area='')=>{
      const d=CP.db(),item={
        id:crypto.randomUUID(),name,area,type:'councillor_lite',status:'Draft',domain:'',slug:'',
        surveyId:null,branding:{primary:'#08254a',secondary:'#1476d4',text:'#ffffff'},content:{},
        updatedAt:new Date().toISOString()
      };
      d.websites[item.id]=item;d.activeWebsiteId=item.id;CP.save(d);queueSync('websites',item);return item
    };
    CP.duplicate=(type,id)=>{
      const src=CP.get(type,id);if(!src)return null;
      const copy=JSON.parse(JSON.stringify(src));copy.id=crypto.randomUUID();
      if(copy.name)copy.name+=' copy';if(copy.title)copy.title+=' copy';
      if('status' in copy)copy.status=type==='graphics'?'Saved':'Draft';
      copy.updatedAt=new Date().toISOString();return CP.put(type,copy)
    };

    const origAssign=CP.assignSurvey.bind(CP);
    CP.assignSurvey=(targetType,targetId,surveyId)=>{
      origAssign(targetType,targetId,surveyId);
      if(targetType==='website')queueSync('websites',CP.get('websites',targetId));
      if(targetType==='campaign')queueSync('campaigns',CP.get('campaigns',targetId));
    };

    if(CP.snapshot){
      const origSnapshot=CP.snapshot.bind(CP);
      CP.snapshot=(type,id,label='Published version')=>{
        const v=origSnapshot(type,id,label);
        const d=CP.db(),singular=type==='websites'?'website':type==='campaigns'?'campaign':'survey';
        if(v&&isUuid(id)) debounce('version:'+v.id,async()=>{
          const r=await sb.from('publish_versions').insert({
            account_id:d.account.id,entity_type:singular,entity_id:id,label,snapshot:CP.get(type,id)
          });if(r.error)throw r.error
        },50);
        return v
      }
    }

    // Website visual editor still uses cpSites; sync its full config into websites.content.
    if(typeof saveSites==='function'){
      const localSaveSites=saveSites;
      saveSites=function(sites){
        localSaveSites(sites);
        const d=CP.db();
        Object.entries(sites||{}).forEach(([id,s])=>{
          if(!isUuid(id)||!d.websites[id])return;
          d.websites[id]={...d.websites[id],name:s.name||d.websites[id].name,area:s.area||d.websites[id].area,
            status:s.status==='live'?'Published':capStatus(s.status),content:s.config||{},
            branding:{primary:s.config?.brandNavy||'#08254a',secondary:s.config?.brandBlue||'#1476d4',text:'#ffffff'}};
          CP.save(d);queueSync('websites',d.websites[id])
        })
      }
    }
  }


  // Keep "View public site" tied to the currently selected real website.
  document.querySelectorAll('a[href="public-site.html"]').forEach(a=>{
    const current=CP.db().activeWebsiteId;
    if(current)a.href='public-site.html?site='+encodeURIComponent(current)
  });


  function renderStage2People(){
    if(pathname!=='people.html')return;
    const table=document.querySelector('.table-card table'),filterHost=document.getElementById('stage2PeopleFilters');
    if(!table||!filterHost)return;
    const d=CP.db(),all=Object.values(d.people||{});
    let state={search:'',tag:'',source:'',voting:'',consent:'',action:''},selected=new Set(),filtered=[...all];

    const actionsByPerson={};
    (d.actions||[]).forEach(a=>(actionsByPerson[a.personId] ||= []).push(a));
    const tagNames=[...new Set(all.flatMap(p=>(p.tags||[]).map(t=>t.name)))].sort();
    const sources=[...new Set(all.map(p=>p.source).filter(Boolean))].sort();
    const votings=[...new Set(all.map(p=>p.votingIntention).filter(Boolean))].sort();
    const actionTypes=[...new Set((d.actions||[]).map(a=>a.type).filter(Boolean))].sort();

    filterHost.innerHTML=`<div class="filter-toolbar">
      <input id="realPeopleSearch" placeholder="Search name, email or postcode">
      <select id="realPeopleTag"><option value="">All tags</option>${tagNames.map(x=>`<option>${x}</option>`).join('')}</select>
      <select id="realPeopleSource"><option value="">All sources</option>${sources.map(x=>`<option>${x}</option>`).join('')}</select>
      <select id="realPeopleVoting"><option value="">All voting intentions</option>${votings.map(x=>`<option>${x}</option>`).join('')}</select>
      <select id="realPeopleAction"><option value="">All actions</option>${actionTypes.map(x=>`<option>${x}</option>`).join('')}</select>
      <select id="realPeopleConsent"><option value="">All email consent</option><option value="yes">Opted in</option><option value="no">Not opted in</option></select>
      <button class="btn secondary small" id="realPeopleClear">Clear</button>
    </div>
    <div class="bulk-bar" id="realPeopleBulk"><span><strong id="realPeopleSelected">0</strong> selected</span><button class="btn secondary small" id="realPeopleBulkTag">Add tag</button></div>`;

    table.querySelector('thead').innerHTML='<tr><th><input id="realSelectAll" type="checkbox"></th><th>Supporter</th><th>Postcode</th><th>Tags</th><th>Voting intention</th><th>Recent actions</th><th>Source</th><th>Email</th></tr>';

    const esc2=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    function filter(){
      filtered=all.filter(p=>{
        const hay=[p.name,p.email,p.postcode].join(' ').toLowerCase();
        const tags=(p.tags||[]).map(t=>t.name);
        const acts=actionsByPerson[p.id]||[];
        return (!state.search||hay.includes(state.search.toLowerCase()))
          &&(!state.tag||tags.includes(state.tag))
          &&(!state.source||p.source===state.source)
          &&(!state.voting||p.votingIntention===state.voting)
          &&(!state.action||acts.some(a=>a.type===state.action))
          &&(!state.consent||(state.consent==='yes'?p.consentEmail===true:p.consentEmail!==true));
      });renderRows()
    }
    function renderRows(){
      document.getElementById('peopleRealCount').textContent=`${filtered.length} supporter${filtered.length===1?'':'s'} in this view · ${all.length} total`;
      const tb=table.querySelector('tbody');
      tb.innerHTML=filtered.length?filtered.map(p=>{
        const acts=(actionsByPerson[p.id]||[]).slice(0,2);
        return `<tr><td><input class="real-person-select" data-id="${p.id}" type="checkbox" ${selected.has(p.id)?'checked':''}></td>
          <td><a href="person.html?id=${p.id}"><span class="person-name">${esc2(p.name)}</span><span class="person-email">${esc2(p.email||'No email')}</span></a></td>
          <td>${esc2(p.postcode||'—')}</td>
          <td><div class="person-tag-stack">${(p.tags||[]).map(t=>`<span class="person-tag">${esc2(t.name)} <button data-remove-tag="${t.id}" data-person="${p.id}">×</button></span>`).join('')||'<span class="muted">No tags</span>'}</div><button class="text-button add-person-tag" data-person="${p.id}">+ tag</button></td>
          <td>${esc2(p.votingIntention||'Not asked')}</td>
          <td>${acts.map(a=>`<span class="action-mini">${esc2(a.type)}</span>`).join(' ')||'—'}</td>
          <td>${esc2(p.source||'—')}</td><td>${p.consentEmail===true?'Opted in':'No / unknown'}</td></tr>`
      }).join(''):'<tr><td colspan="8"><div class="no-results">No supporters match these filters.</div></td></tr>';
      bindRows()
    }
    function bindRows(){
      table.querySelectorAll('.real-person-select').forEach(x=>x.onchange=()=>{x.checked?selected.add(x.dataset.id):selected.delete(x.dataset.id);document.getElementById('realPeopleSelected').textContent=selected.size});
      table.querySelectorAll('.add-person-tag').forEach(b=>b.onclick=async()=>{const tag=prompt('Add tag');if(!tag)return;try{await window.CPStage2.addPersonTag(b.dataset.person,tag);sessionStorage.removeItem(bootKey);location.reload()}catch(e){showBackendError('Could not add tag: '+e.message)}});
      table.querySelectorAll('[data-remove-tag]').forEach(b=>b.onclick=async()=>{try{await window.CPStage2.removePersonTag(b.dataset.person,b.dataset.removeTag);sessionStorage.removeItem(bootKey);location.reload()}catch(e){showBackendError('Could not remove tag: '+e.message)}});
    }
    document.getElementById('realSelectAll').onchange=e=>{selected=new Set(e.target.checked?filtered.map(p=>p.id):[]);renderRows();document.getElementById('realPeopleSelected').textContent=selected.size};
    document.getElementById('realPeopleBulkTag').onclick=async()=>{if(!selected.size)return;const tag=prompt(`Add tag to ${selected.size} people`);if(!tag)return;for(const id of selected)await window.CPStage2.addPersonTag(id,tag);sessionStorage.removeItem(bootKey);location.reload()};
    [['realPeopleSearch','search','input'],['realPeopleTag','tag','change'],['realPeopleSource','source','change'],['realPeopleVoting','voting','change'],['realPeopleAction','action','change'],['realPeopleConsent','consent','change']].forEach(([id,k,evt])=>document.getElementById(id).addEventListener(evt,e=>{state[k]=e.target.value;filter()}));
    document.getElementById('realPeopleClear').onclick=()=>{state={search:'',tag:'',source:'',voting:'',consent:'',action:''};filterHost.querySelectorAll('input,select').forEach(x=>x.value='');filter()};
    document.getElementById('peopleExportReal').onclick=()=>{const rows=[['Name','Email','Postcode','Tags','Voting intention','Source','Email consent'],...filtered.map(p=>[p.name,p.email,p.postcode,(p.tags||[]).map(t=>t.name).join('|'),p.votingIntention,p.source,p.consentEmail===true?'Yes':'No'])];const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='supporters.csv';a.click()};
    const qp=new URLSearchParams(location.search);if(qp.get('source'))state.source=qp.get('source');if(qp.get('voting'))state.voting=qp.get('voting');if(qp.get('tag'))state.tag=qp.get('tag');filter();
  }

  // -------------------------------------------------------
  // Boot
  // -------------------------------------------------------
  bindAuth();
  if(PROTECTED){
    bootOverlay();
    hydrate().then(session=>{
      if(!session)return;
      installCPBridge();
      renderStage2People();
      if(!sessionStorage.getItem(bootKey)){
        sessionStorage.setItem(bootKey,'1');
        location.reload(); return;
      }
      removeBoot();
    }).catch(err=>showBackendError('Could not load your Supabase campaign data: '+err.message));
  } else {
    sb.auth.getSession().then(({data:{session}})=>{
      if(pathname==='login.html'&&session){
        const next=new URLSearchParams(location.search).get('next')||'dashboard.html';
        location.replace(next)
      }
    })
  }
})();
