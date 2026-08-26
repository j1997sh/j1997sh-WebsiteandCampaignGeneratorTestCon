
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
      integrationsR,versionsR
    ]=await Promise.all([
      sb.from('websites').select('*').order('created_at'),
      sb.from('surveys').select('*').order('created_at'),
      sb.from('survey_questions').select('*').order('position'),
      sb.from('campaigns').select('*').order('created_at'),
      sb.from('graphics').select('*').order('created_at'),
      sb.from('people').select('*').order('created_at'),
      sb.from('supporter_actions').select('*').order('created_at',{ascending:false}),
      sb.from('integrations').select('*').order('created_at'),
      sb.from('publish_versions').select('*').order('created_at',{ascending:false})
    ]);
    const responses=[websitesR,surveysR,questionsR,campaignsR,graphicsR,peopleR,actionsR,integrationsR,versionsR];
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
      content:w.content||{},updatedAt:w.updated_at
    });

    (surveysR.data||[]).forEach(s=>local.surveys[s.id]={
      id:s.id,websiteId:s.website_id||null,name:s.name,status:capStatus(s.status),
      responses:s.response_count||0,settings:s.settings||{},
      questions:questionsBySurvey[s.id]||[],updatedAt:s.updated_at
    });

    (campaignsR.data||[]).forEach(c=>local.campaigns[c.id]={
      id:c.id,websiteId:c.website_id,surveyId:c.survey_id||null,name:c.name,slug:c.slug||'',
      status:capStatus(c.status),headline:c.headline||c.name,support:c.supporting_copy||'',
      imagePath:c.image_path||null,points:c.key_points||[],settings:c.settings||{},
      supporterCount:c.supporter_count||0,updatedAt:c.updated_at
    });

    (graphicsR.data||[]).forEach(g=>local.graphics[g.id]={
      id:g.id,websiteId:g.website_id||null,campaignId:g.campaign_id||null,
      title:g.title,type:g.graphic_type,format:g.format,status:g.status==='archived'?'Archived':'Saved',
      ...g.state,previewPath:g.preview_path||null,savedAt:g.updated_at
    });

    (peopleR.data||[]).forEach(p=>local.people[p.id]={
      id:p.id,name:[p.first_name,p.last_name].filter(Boolean).join(' ')||p.email||'Supporter',
      firstName:p.first_name||'',lastName:p.last_name||'',email:p.email||'',postcode:p.postcode||'',
      phone:p.phone||'',source:p.source||'',votingIntention:p.voting_intention||'',
      notes:p.notes||'',external:p.external_ids||{},consentEmail:p.consent_email
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
      selected_survey_id:w.surveyId||null,branding:w.branding||{},content:w.content||{}
    };
    const r=await sb.from('websites').upsert(payload);
    if(r.error) throw r.error;
  }
  async function syncCampaign(c){
    const aid=await accountId();
    const r=await sb.from('campaigns').upsert({
      id:c.id,account_id:aid,website_id:c.websiteId,survey_id:c.surveyId||null,
      name:c.name,slug:c.slug||null,status:dbStatus(c.status),headline:c.headline||c.name,
      supporting_copy:c.support||'',image_path:c.imagePath||null,key_points:c.points||[],
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

  // -------------------------------------------------------
  // Boot
  // -------------------------------------------------------
  bindAuth();
  if(PROTECTED){
    bootOverlay();
    hydrate().then(session=>{
      if(!session)return;
      installCPBridge();
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
