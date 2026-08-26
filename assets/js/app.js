
/* =========================================================
   CAMPAIGN PLATFORM SHARED STORE — Stage 1
   One local prototype database for all product areas.
   ========================================================= */
window.CP = window.CP || (() => {
  const KEY='campaignPlatformDB:v1';

  const seed = {
    account:{id:'acct-joe',name:'Joe Bloggs',initials:'JB'},
    activeWebsiteId:'site-joe-bloggs',
    websites:{
      'site-joe-bloggs':{
        id:'site-joe-bloggs',
        name:'Joe Bloggs',
        area:'Bloggs Ward',
        type:'Councillor Lite',
        status:'Published',
        domain:'joe-bloggs.example.org',
        surveyId:'survey-residents',
        branding:{primary:'#08254a',secondary:'#1476d4',text:'#ffffff'},
        updatedAt:'2026-08-26T07:00:00'
      }
    },
    campaigns:{
      'campaign-bus':{
        id:'campaign-bus',
        websiteId:'site-joe-bloggs',
        name:'Save the Bloggs Ward bus',
        slug:'save-the-bus',
        status:'Published',
        headline:'Save the Bloggs Ward bus',
        support:'Protect the route and make the case for a reliable service local residents can depend on.',
        points:['Protect the current route','Make the case for a reliable timetable','Keep communities connected'],
        surveyId:'survey-bus',
        supporterCount:2,
        updatedAt:'2026-08-26T06:42:00'
      },
      'campaign-roads':{
        id:'campaign-roads',
        websiteId:'site-joe-bloggs',
        name:'Fix our roads',
        slug:'fix-our-roads',
        status:'Draft',
        headline:'Fix our roads and pavements',
        support:'A local campaign for safer streets and better maintenance.',
        points:['Repair the worst potholes','Improve dangerous crossings','Publish a local repair plan'],
        surveyId:'survey-residents',
        supporterCount:0,
        updatedAt:'2026-08-26T06:10:00'
      }
    },
    surveys:{
      'survey-residents':{
        id:'survey-residents',
        websiteId:'site-joe-bloggs',
        name:'Residents survey',
        status:'Published',
        responses:7,
        questions:[
          {id:'q-issue',type:'single',label:'What is the biggest local issue?',enabled:true,options:['Roads and pavements','Crime and antisocial behaviour','Bins, litter and street cleaning','Local services','Parking and traffic']},
          {id:'q-open',type:'text',label:'If you could change one thing locally, what would it be?',enabled:true,options:[]},
          {id:'q-email',type:'yesno',label:'Would you like campaign updates by email?',enabled:true,options:['Yes','No']},
          {id:'q-vi',type:'single',label:'If there were a council election tomorrow, which party would you be most likely to vote for?',enabled:false,options:['Conservative','Labour','Liberal Democrat','Reform UK','Green','Other','Undecided','Prefer not to say']}
        ],
        updatedAt:'2026-08-26T06:50:00'
      },
      'survey-bus':{
        id:'survey-bus',
        websiteId:'site-joe-bloggs',
        campaignId:'campaign-bus',
        name:'Bus services survey',
        status:'Draft',
        responses:3,
        questions:[
          {id:'q-bus-use',type:'single',label:'How often do you use the Bloggs Ward bus?',enabled:true,options:['Daily','A few times a week','Weekly','Occasionally','Never']},
          {id:'q-bus-change',type:'text',label:'What would make the service better?',enabled:true,options:[]},
          {id:'q-bus-email',type:'yesno',label:'Would you like updates on this campaign?',enabled:true,options:['Yes','No']}
        ],
        updatedAt:'2026-08-26T06:40:00'
      }
    },
    graphics:{
      'graphic-1':{
        id:'graphic-1',
        websiteId:'site-joe-bloggs',
        campaignId:'campaign-bus',
        type:'campaign',
        title:'Save the Bloggs Ward bus',
        format:'square',
        status:'Saved',
        savedAt:'2026-08-26T06:20:00'
      }
    },
    people:{
      'person-sarah':{id:'person-sarah',name:'Sarah Smith',postcode:'BG3 4XX',issue:'Roads',volunteer:true,source:'Facebook',external:{nationbuilder:'nb-1001'}},
      'person-tom':{id:'person-tom',name:'Tom Williams',postcode:'BG1 2AB',issue:'Crime',volunteer:false,source:'Organic',external:{nationbuilder:'nb-1002'}},
      'person-aisha':{id:'person-aisha',name:'Aisha Khan',postcode:'BG2 7PL',issue:'Services',volunteer:true,source:'Email',external:{nationbuilder:'nb-1003'}},
      'person-david':{id:'person-david',name:'David Brown',postcode:'BG4 8HR',issue:'Roads',volunteer:false,source:'Direct',external:{nationbuilder:'nb-1004'}},
      'person-emily':{id:'person-emily',name:'Emily Clarke',postcode:'BG5 1QT',issue:'Parking',volunteer:false,source:'Facebook',external:{nationbuilder:'nb-1005'}},
      'person-michael':{id:'person-michael',name:'Michael Green',postcode:'BG3 9DA',issue:'Bus',volunteer:true,source:'Organic',external:{nationbuilder:'nb-1006'}},
      'person-lucy':{id:'person-lucy',name:'Lucy Baker',postcode:'BG3 2PL',issue:'Roads',volunteer:true,source:'Facebook',external:{nationbuilder:'nb-1007'}},
      'person-mark':{id:'person-mark',name:'Mark Evans',postcode:'BG2 1NN',issue:'Crime',volunteer:false,source:'Direct',external:{nationbuilder:'nb-1008'}},
      'person-priya':{id:'person-priya',name:'Priya Patel',postcode:'BG1 6TR',issue:'Services',volunteer:true,source:'Email',external:{nationbuilder:'nb-1009'}},
      'person-george':{id:'person-george',name:'George White',postcode:'BG4 3ST',issue:'Roads',volunteer:true,source:'Organic',external:{nationbuilder:'nb-1010'}}
    },
    actions:[
      {id:'act-1',type:'campaign_back',personId:'person-sarah',campaignId:'campaign-bus',text:'Sarah Smith backed “Save the Bloggs Ward bus”',time:'2026-08-26T06:52:00'},
      {id:'act-2',type:'survey',personId:'person-tom',surveyId:'survey-residents',text:'Tom Williams completed the residents survey',time:'2026-08-26T06:37:00'},
      {id:'act-3',type:'volunteer',personId:'person-aisha',text:'Aisha Khan offered to deliver leaflets',time:'2026-08-26T06:19:00'},
      {id:'act-4',type:'signup',personId:'person-david',text:'David Brown joined the campaign',time:'2026-08-26T05:58:00'}
    ],
    integrations:{
      nationbuilder:{connected:true,label:'NationBuilder',syncedPeople:10,lastSync:'2026-08-26T06:55:00'},
      votesource:{connected:false,label:'VoteSource'},
      mailchimp:{connected:false,label:'Mailchimp'}
    }
  };

  function load(){
    try{
      const raw=localStorage.getItem(KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    const copy=JSON.parse(JSON.stringify(seed));
    localStorage.setItem(KEY,JSON.stringify(copy));
    return copy;
  }
  function save(db){
    localStorage.setItem(KEY,JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('cp:dbchange',{detail:db}));
    return db;
  }
  function db(){return load()}
  function uid(prefix){return prefix+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)}
  function activeWebsite(){const d=db();return d.websites[d.activeWebsiteId]}
  function setActiveWebsite(id){const d=db();if(d.websites[id]){d.activeWebsiteId=id;save(d)}}
  function list(type,filter={}){
    const d=db(),obj=d[type]||{};
    return Object.values(obj).filter(x=>Object.entries(filter).every(([k,v])=>x[k]===v))
  }
  function get(type,id){return db()[type]?.[id]||null}
  function put(type,item){
    const d=db();d[type]=d[type]||{};d[type][item.id]=item;save(d);return item
  }
  function remove(type,id){
    const d=db();if(d[type])delete d[type][id];
    if(type==='surveys'){
      Object.values(d.websites).forEach(w=>{if(w.surveyId===id)w.surveyId=null});
      Object.values(d.campaigns).forEach(c=>{if(c.surveyId===id)c.surveyId=null});
    }
    save(d)
  }
  function duplicate(type,id){
    const item=get(type,id);if(!item)return null;
    const copy=JSON.parse(JSON.stringify(item));
    copy.id=uid(type.slice(0,-1)||type);
    copy.name=(copy.name||copy.title||'Item')+' copy';
    if('status' in copy)copy.status='Draft';
    copy.updatedAt=new Date().toISOString();
    return put(type,copy)
  }
  function patch(type,id,changes){
    const d=db();if(!d[type]?.[id])return null;
    d[type][id]={...d[type][id],...changes,updatedAt:new Date().toISOString()};
    save(d);return d[type][id]
  }
  function assignSurvey(targetType,targetId,surveyId){
    const d=db();
    if(!d.surveys[surveyId])return;
    if(targetType==='website'&&d.websites[targetId])d.websites[targetId].surveyId=surveyId;
    if(targetType==='campaign'&&d.campaigns[targetId])d.campaigns[targetId].surveyId=surveyId;
    save(d)
  }
  function createSurvey(name){
    const w=activeWebsite();
    const item={id:uid('survey'),websiteId:w?.id||null,name,status:'Draft',responses:0,questions:[],updatedAt:new Date().toISOString()};
    return put('surveys',item)
  }
  function createCampaign(name){
    const w=activeWebsite();
    const item={id:uid('campaign'),websiteId:w?.id||null,name,slug:String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),status:'Draft',headline:name,support:'',points:['Key point one','Key point two','Key point three'],surveyId:w?.surveyId||null,supporterCount:0,updatedAt:new Date().toISOString()};
    return put('campaigns',item)
  }
  function saveGraphic(g){
    const w=activeWebsite();
    const item={id:g.id||uid('graphic'),websiteId:w?.id||null,status:'Saved',savedAt:new Date().toISOString(),...g};
    return put('graphics',item)
  }
  return {db,save,uid,activeWebsite,setActiveWebsite,list,get,put,patch,remove,duplicate,assignSurvey,createSurvey,createCampaign,saveGraphic};
})();


if(!window.CP_STAGE2){
  document.querySelectorAll('[data-demo-login]').forEach(form=>{
    form.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('cpLoggedIn','yes');location.href='dashboard.html'});
  });
}
document.querySelectorAll('[data-save]').forEach(btn=>btn.addEventListener('click',()=>{const old=btn.textContent;btn.textContent='Saved';setTimeout(()=>btn.textContent=old,900)}));
const logout=document.getElementById('logoutLink');if(logout&&!window.CP_STAGE2)logout.addEventListener('click',()=>localStorage.removeItem('cpLoggedIn'));

function cpDefaults(){
  return {
    'joe-bloggs':{name:'Joe Bloggs',area:'Bloggs Ward',status:'live',config:null},
    'sarah-jones':{name:'Sarah Jones',area:'North Bloggs',status:'draft',config:{
      candidateName:'Sarah Jones',candidateInitials:'SJ',candidateArea:'North Bloggs',candidateTitle:'Candidate for North Bloggs',
      candidateEmail:'sarah@example.org',brandNavy:'#08254a',brandBlue:'#1476d4',heroHeadline:'A fresh start for North Bloggs.',
      heroCopy:'Sarah is standing to give North Bloggs a stronger voice on the council.',heroCta:'Tell Sarah what matters',
      aboutHeadline:'Why I’m standing',aboutLead:'North Bloggs needs visible, practical local representation.',aboutCopy:'Sarah wants to put residents first.',
      priorities:[{title:'Cleaner streets',copy:'More action on litter and fly-tipping.'},{title:'Safer roads',copy:'Better crossings and road repairs.'},{title:'Protect local services',copy:'Stand up for the services residents use.'}],
      surveyIntro:'Tell Sarah what matters most locally.',surveyQuestion:'What would you change in North Bloggs?',votingIntentEnabled:false,
      campaignTitle:'Protect the local bus',campaignCopy:'Sarah is campaigning to protect local bus services.',
      volunteerHeadline:'Help Sarah locally',volunteer1:'Deliver leaflets',volunteer2:'Display a poster',volunteer3:'Join Sarah on the doorstep',volunteer4:'Help online',
      footerDescription:'A local campaign website for Sarah Jones in North Bloggs.',sections:[{id:'about',visible:true},{id:'priorities',visible:true},{id:'survey',visible:true},{id:'campaign',visible:true},{id:'volunteer',visible:true}],images:{}
    }}
  };
}
function cpSites(){
  let s;try{s=JSON.parse(localStorage.getItem('cpSites')||'null')}catch(e){}
  if(!s){s=cpDefaults();localStorage.setItem('cpSites',JSON.stringify(s))}
  return s;
}
function saveSites(s){localStorage.setItem('cpSites',JSON.stringify(s))}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

function baseJoeConfig(){
  return {
    candidateName:'Joe Bloggs',candidateInitials:'JB',candidateArea:'Bloggs Ward',candidateTitle:'Candidate for Bloggs Ward',candidateEmail:'hello@example.org',
    brandNavy:'#08254a',brandBlue:'#1476d4',heroHeadline:'A stronger voice for Bloggs Ward.',
    heroCopy:'Joe Bloggs is standing to be your local councillor — listening to residents, campaigning on the issues that matter and offering practical local representation.',
    heroCta:'Tell Joe what matters',aboutHeadline:'Why I’m standing',aboutLead:'Bloggs Ward deserves a councillor who is visible, accessible and focused on the everyday things that make a difference locally.',
    aboutCopy:'Joe lives locally and is standing because he wants residents to have a stronger voice on the council.',
    priorities:[{title:'Fixing roads and pavements',copy:'Push for proper repairs, safer crossings and action on the worst local problem spots.'},{title:'Cleaner, safer streets',copy:'Back practical action on litter, antisocial behaviour and neighbourhood safety.'},{title:'Protecting local services',copy:'Fight for the community facilities and local services residents rely on.'}],
    surveyIntro:'Joe wants to know what should come first and what local change would make the biggest difference to you.',surveyQuestion:'If you could change one thing in Bloggs Ward, what would it be?',votingIntentEnabled:false,
    campaignTitle:'Save the Bloggs Ward bus',campaignCopy:'Joe is campaigning to protect the route and make the case for a service that works for local residents.',
    volunteerHeadline:'Help Joe locally',volunteer1:'Deliver a few leaflets',volunteer2:'Display a poster',volunteer3:'Join Joe on the doorstep',volunteer4:'Help online',
    footerDescription:'A local campaign website for Joe Bloggs in Bloggs Ward.',sections:[{id:'about',visible:true},{id:'priorities',visible:true},{id:'survey',visible:true},{id:'campaign',visible:true},{id:'volunteer',visible:true}],images:{}
  };
}

function renderPublicSite(c){

    const enabledQ=(typeof cpSelectedSurvey==='function' && cpSelectedSurvey()?cpSelectedSurvey().questions:cpSurveyQuestions()).filter(q=>q.enabled);
    const sections=(c.sections||[]).filter(x=>x.visible).map(x=>x.id);
    const first=(c.candidateName||'Candidate').split(/\s+/)[0];
    const priorities=(c.priorities||[]).map((p,i)=>`<article class="card">${c.images?.['priority'+i]?`<div class="card-img" style="background-image:url('${c.images['priority'+i]}')"></div>`:''}<div class="card-copy"><h3>${esc(p.title)}</h3><p>${esc(p.copy)}</p></div></article>`).join('');
    function renderQuestion(q){
      if(q.type==='text') return `<div class="form-q"><label>${esc(q.label)}</label><textarea placeholder="${esc(q.label)}"></textarea></div>`;
      if(q.type==='single') return `<div class="form-q"><label>${esc(q.label)}</label><select><option value="">Select an option</option>${(q.options||[]).map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
      if(q.type==='multi') return `<div class="form-q"><label>${esc(q.label)}</label><div class="check-grid">${(q.options||[]).map(o=>`<label><input type="checkbox"> ${esc(o)}</label>`).join('')}</div></div>`;
      if(q.type==='yesno') return `<div class="form-q"><label>${esc(q.label)}</label><select><option value="">Select</option><option>Yes</option><option>No</option></select></div>`;
      if(q.type==='rating') return `<div class="form-q"><label>${esc(q.label)}</label><select>${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></div>`;
      if(q.type==='postcode') return `<div class="form-q"><label>${esc(q.label)}</label><input placeholder="Postcode"></div>`;
      if(q.type==='phone') return `<div class="form-q"><label>${esc(q.label)}</label><input placeholder="Phone number"></div>`;
      return '';
    }
    const navItems=[];
    if(sections.includes('about'))navItems.push(['About','#about']);
    if(sections.includes('priorities'))navItems.push(['Priorities','#priorities']);
    if(sections.includes('survey'))navItems.push(['Have your say','#survey']);
    if(sections.includes('campaign'))navItems.push(['Campaign','#campaign']);
    if(sections.includes('volunteer'))navItems.push(['Get involved','#volunteer']);
    const nav=navItems.map(([l,h])=>`<a href="${h}">${l}</a>`).join('');
    const sectionHtml={
      about:`<section class="section" id="about" data-editor-section="about"><div class="container ${c.images?.about?'two-col-site':''}"><div><h2>${esc(c.aboutHeadline)}</h2><p class="lead">${esc(c.aboutLead)}</p><p>${esc(c.aboutCopy||'')}</p></div>${c.images?.about?`<div class="section-photo" style="background-image:url('${c.images.about}')"></div>`:''}</div></section>`,
      priorities:`<section class="section alt" id="priorities" data-editor-section="priorities"><div class="container"><h2>${esc(first)}’s priorities</h2><div class="grid">${priorities}</div></div></section>`,
      survey:`<section class="section" id="survey" data-editor-section="survey"><div class="container"><h2>What matters in ${esc(c.candidateArea)}?</h2><p class="lead">${esc(c.surveyIntro||'Tell us what matters locally.')}</p><form class="survey-form"><div class="form two"><input placeholder="First name"><input placeholder="Last name"><input class="full" type="email" placeholder="Email address"><input class="full" placeholder="Postcode"></div>${enabledQ.map(renderQuestion).join('')}<button class="btn" type="button">Send my views</button></form></div></section>`,
      campaign:`<section class="section alt" id="campaign" data-editor-section="campaign"><div class="container ${c.images?.campaign?'two-col-site':''}"><div><h2>${esc(c.campaignTitle)}</h2><p class="lead">${esc(c.campaignCopy)}</p><a class="btn" href="#">Back the campaign</a></div>${c.images?.campaign?`<div class="section-photo" style="background-image:url('${c.images.campaign}')"></div>`:''}</div></section>`,
      volunteer:`<section class="section navy" id="volunteer" data-editor-section="volunteer"><div class="container"><h2>${esc(c.volunteerHeadline)}</h2><div class="grid"><div class="card dark">${esc(c.volunteer1)}</div><div class="card dark">${esc(c.volunteer2)}</div><div class="card dark">${esc(c.volunteer3)}</div><div class="card dark">${esc(c.volunteer4)}</div></div></div></section>`
    };
    const body=(c.sections||[]).filter(s=>s.visible).map(s=>sectionHtml[s.id]||'').join('');
    const heroImg=c.images?.hero?`url("${c.images.hero}")`:'linear-gradient(135deg,#718ba4,#d8e2eb)';
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
:root{--navy:${c.brandNavy||'#08254a'};--blue:${c.brandBlue||'#1476d4'};--ink:#0a2447;--muted:#6b7a90;--pale:#f3f7fb;--line:#dbe4ee}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:"Proxima Nova","Avenir Next",Arial,sans-serif;color:var(--ink)}a{text-decoration:none;color:inherit}.container{width:min(1180px,calc(100% - 40px));margin:auto}
header{min-height:82px;background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20}header .container{min-height:82px;display:flex;align-items:center;gap:10px}.identity{display:flex;align-items:center;gap:10px}.roundel{width:46px;height:46px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900}.nav{margin-left:auto;display:flex;gap:20px;align-items:center;font-size:13px;font-weight:800}.nav a:hover{color:var(--blue)}.menu{display:none;margin-left:auto;border:1px solid var(--blue);background:#fff;color:var(--blue);padding:10px 13px;font-weight:900}
.hero{min-height:640px;background-image:linear-gradient(90deg,rgba(4,22,45,.92),rgba(4,22,45,.3)),${heroImg};background-size:cover;background-position:center;color:#fff}.hero .container{min-height:640px;display:flex;align-items:flex-end;padding-bottom:48px}.hero h1{font-size:88px;line-height:.88;letter-spacing:-.055em;margin:0 0 16px;max-width:850px}.hero p{font-size:19px;max-width:720px}.section{padding:70px 0}.alt{background:var(--pale)}.navy{background:var(--navy);color:#fff}h2{font-size:50px;letter-spacing:-.045em}.lead{font-size:18px;color:var(--muted);max-width:760px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{border:1px solid var(--line);background:#fff;overflow:hidden}.card-img{aspect-ratio:1.55/1;background:#e8eef4 center/cover no-repeat}.card-copy{padding:20px}.card:not(:has(.card-img)){padding:20px}.two-col-site{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}.section-photo{min-height:380px;background:#dfe7ef center/cover no-repeat}.card.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.3);font-weight:900}.form{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:780px}.form input,.survey-form input,.survey-form textarea,.survey-form select{width:100%;min-height:50px;padding:12px;border:1px solid #cbd6e2}.form .full{grid-column:1/-1}.form-q{max-width:780px;margin-top:14px}.form-q>label{display:block;font-weight:900;margin-bottom:6px}.check-grid{display:grid;gap:6px}.check-grid label{font-weight:500}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;background:var(--blue);color:#fff;font-weight:900;border:0;margin-top:12px}footer{background:#061a34;color:#fff;padding:36px 0}
@media(max-width:800px){.nav{display:none;position:absolute;top:82px;left:0;right:0;background:#fff;padding:16px 20px;flex-direction:column;align-items:stretch;border-bottom:1px solid var(--line)}.nav.open{display:flex}.menu{display:block}.hero h1{font-size:58px}.grid,.form,.two-col-site{grid-template-columns:1fr}.form .full{grid-column:auto}.hero{min-height:700px}.hero .container{min-height:700px}}
</style></head><body><header data-editor-section="header"><div class="container"><div class="identity"><span class="roundel">${esc(c.candidateInitials)}</span><span><strong>${esc(c.candidateName)}</strong><small style="display:block;color:var(--muted)">${esc(c.candidateTitle)}</small></span></div><nav class="nav">${nav}<a class="btn" style="margin:0" href="#volunteer">${esc(c.headerCta||'Join the campaign')}</a></nav><button class="menu" type="button">Menu</button></div></header>
<section class="hero" data-editor-section="hero"><div class="container"><div><h1>${esc(c.heroHeadline)}</h1><p>${esc(c.heroCopy)}</p><a class="btn" href="#survey">${esc(c.heroCta)}</a></div></div></section>${body}<footer data-editor-section="footer"><div class="container"><strong>${esc(c.candidateName)}</strong><p>${esc(c.footerDescription||'')}</p></div></footer><script>const m=document.querySelector('.menu'),n=document.querySelector('.nav');if(m&&n)m.addEventListener('click',()=>n.classList.toggle('open'));<\/script></body></html>`;
}

(function websiteLibrary(){
  const grid=document.getElementById('siteLibraryGrid');if(!grid)return;
  document.querySelectorAll('.site-menu-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();btn.nextElementSibling.classList.toggle('open')}));
  document.querySelectorAll('[data-duplicate-site]').forEach(btn=>btn.addEventListener('click',()=>{
    const sites=cpSites(),id=btn.dataset.duplicateSite,src=sites[id];if(!src)return;const newId=id+'-copy-'+Date.now();sites[newId]={name:src.name+' Copy',area:src.area,status:'draft',config:JSON.parse(JSON.stringify(src.config||baseJoeConfig()))};saveSites(sites);location.reload();
  }));
  document.querySelectorAll('[data-archive-site]').forEach(btn=>btn.addEventListener('click',()=>{
    const sites=cpSites(),id=btn.dataset.archiveSite;if(sites[id]){sites[id].status='archived';saveSites(sites);btn.closest('.site-library-card').style.opacity='.45'}
  }));
})();


(function publicPage(){
  if(!location.pathname.endsWith('public-site.html'))return;const params=new URLSearchParams(location.search),siteId=params.get('site')||localStorage.getItem('cpCurrentSite')||'joe-bloggs',s=cpSites()[siteId];if(s){document.open();document.write(renderPublicSite(s.config||baseJoeConfig()));document.close()}
})();

(function visualEditor(){
  const frame=document.getElementById('visualFrame');if(!frame)return;
  const $=id=>document.getElementById(id);
  const params=new URLSearchParams(location.search);
  let siteId=params.get('site')||localStorage.getItem('cpCurrentSite')||'joe-bloggs';
  let sites=cpSites();if(!sites[siteId])siteId='joe-bloggs';
  localStorage.setItem('cpCurrentSite',siteId);
  let site=sites[siteId];if(!site.config)site.config=baseJoeConfig();
  let config=JSON.parse(JSON.stringify(site.config));
  let dirty=false,timer=null;
  const sectionOrder=()=>config.sections||[{id:'about',visible:true},{id:'priorities',visible:true},{id:'survey',visible:true},{id:'campaign',visible:true},{id:'volunteer',visible:true}];

  function toast(msg){const el=$('visualToast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1200)}
  function status(){const el=$('visualStatus');el.classList.toggle('dirty',dirty);$('visualStatusText').textContent=dirty?'Draft changes':(site.status==='live'?'Published':'Draft')}
  function markDirty(){dirty=true;status();clearTimeout(timer);timer=setTimeout(()=>saveDraft(true),800)}
  function saveDraft(auto=false){site.config=config;sites[siteId]=site;saveSites(sites);dirty=false;status();if(!auto)toast('Draft saved')}
  function writeFrame(el,html){const doc=el.contentDocument||el.contentWindow.document;doc.open();doc.write(html);doc.close()}
  function render(){writeFrame(frame,renderPublicSite(config));setTimeout(buildHotspots,80)}

  function buildHotspots(){
    const overlay=$('visualOverlay');
    overlay.innerHTML='';
    const doc=frame.contentDocument;
    if(!doc)return;

    const labelMap={
      header:'Header',
      hero:'Hero',
      about:'About',
      priorities:'Priorities',
      survey:'Residents survey',
      campaign:'Current campaign',
      volunteer:'Get involved',
      footer:'Footer'
    };

    const nodes=[...doc.querySelectorAll('[data-editor-section]')];
    nodes.forEach(node=>{
      const type=node.getAttribute('data-editor-section');
      const r=node.getBoundingClientRect();

      const hot=document.createElement('div');
      hot.className='edit-hotspot';
      hot.dataset.editType=type;
      hot.style.left=r.left+'px';
      hot.style.top=r.top+'px';
      hot.style.width=r.width+'px';
      hot.style.height=r.height+'px';
      hot.innerHTML=`<span class="edit-badge">Edit ${labelMap[type]||'section'}</span>`;
      hot.addEventListener('click',()=>openDrawer(type));
      overlay.appendChild(hot);
    });

    // Make overlay height match the rendered page so lower sections remain clickable.
    try{
      const h=Math.max(
        doc.documentElement.scrollHeight||0,
        doc.body?.scrollHeight||0
      );
      overlay.style.height=h+'px';
      frame.style.height=Math.max(h,1000)+'px';
    }catch(e){}
  }

  function field(label,key,type='input'){
    const v=config[key]||'';
    if(type==='textarea')return `<label class="field"><span>${label}</span><textarea data-config-key="${key}">${esc(v)}</textarea></label>`;
    return `<label class="field"><span>${label}</span><input data-config-key="${key}" value="${esc(v)}"></label>`
  }
  function sectionTools(type){
    if(!['about','priorities','survey','campaign','volunteer'].includes(type))return '';
    const s=sectionOrder().find(x=>x.id===type)||{visible:true};
    return `<div class="drawer-section-tools"><button class="icon-button" data-move-section="${type}" data-dir="-1" type="button">Move up</button><button class="icon-button" data-move-section="${type}" data-dir="1" type="button">Move down</button><button class="icon-button" data-toggle-section="${type}" type="button">${s.visible?'Hide section':'Show section'}</button></div>`
  }

  function openDrawer(type){
    document.querySelectorAll('.edit-hotspot').forEach(h=>h.classList.toggle('active',h.dataset.editType===type));
    const body=$('drawerBody');let html='';
    if(type==='header'){ $('drawerTitle').textContent='Header';html=field('Candidate name','candidateName')+field('Initials','candidateInitials')+field('Candidate title','candidateTitle')+field('Email','candidateEmail') }
    if(type==='hero'){ $('drawerTitle').textContent='Hero';html=field('Headline','heroHeadline')+field('Supporting copy','heroCopy','textarea')+field('Button text','heroCta')+`<label class="field"><span>Hero image</span><input id="drawerHeroImage" type="file" accept="image/*"></label>` }
    if(type==='about'){ $('drawerTitle').textContent='About';html=field('Headline','aboutHeadline')+field('Lead','aboutLead','textarea')+field('Body copy','aboutCopy','textarea')+`<label class="field"><span>About image</span><input id="drawerAboutImage" type="file" accept="image/*"></label>`+sectionTools(type) }
    if(type==='priorities'){
      $('drawerTitle').textContent='Priorities';
      html='<div id="drawerPriorityList">'+(config.priorities||[]).map((p,i)=>`<div class="priority-editor-item" data-drawer-priority="${i}"><div class="priority-editor-head"><strong>Priority ${i+1}</strong><div><button class="icon-button drawer-duplicate-priority" type="button">Duplicate</button> <button class="icon-button danger drawer-remove-priority" type="button">Remove</button></div></div><label class="field"><span>Title</span><input class="drawer-priority-title" value="${esc(p.title)}"></label><label class="field"><span>Copy</span><textarea class="drawer-priority-copy">${esc(p.copy)}</textarea></label><label class="field"><span>Image</span><input class="drawer-priority-image" data-priority-image="${i}" type="file" accept="image/*"></label></div>`).join('')+'</div><button class="btn secondary small" id="drawerAddPriority" type="button">Add priority</button>'+sectionTools(type)
    }
    if(type==='survey'){ $('drawerTitle').textContent='Residents survey';html=field('Intro','surveyIntro','textarea')+field('Open question','surveyQuestion')+`<div class="toggle-line"><div><strong>Voting intention</strong><small>Optional CRM field</small></div><input id="drawerVotingToggle" type="checkbox" ${config.votingIntentEnabled?'checked':''}></div>`+sectionTools(type) }
    if(type==='campaign'){ $('drawerTitle').textContent='Current campaign';html=field('Campaign title','campaignTitle')+field('Campaign copy','campaignCopy','textarea')+`<label class="field"><span>Campaign image</span><input id="drawerCampaignImage" type="file" accept="image/*"></label>`+sectionTools(type) }
    if(type==='volunteer'){ $('drawerTitle').textContent='Get involved';html=field('Headline','volunteerHeadline')+field('Option 1','volunteer1')+field('Option 2','volunteer2')+field('Option 3','volunteer3')+field('Option 4','volunteer4')+sectionTools(type) }
    if(type==='footer'){ $('drawerTitle').textContent='Footer';html=field('Description','footerDescription','textarea') }
    body.innerHTML=html;
    bindDrawer(type);
    $('visualWorkspace').classList.add('drawer-open'); $('editDrawer').classList.add('open'); setTimeout(buildHotspots,220)
  }

  function bindDrawer(type){
    document.querySelectorAll('[data-config-key]').forEach(el=>el.addEventListener('input',()=>{config[el.dataset.configKey]=el.value;markDirty();render()}));
    const surveyPicker=$('drawerSurveyPicker');if(surveyPicker)surveyPicker.addEventListener('change',()=>{if(typeof cpSetSelectedSurveyId==='function')cpSetSelectedSurveyId(surveyPicker.value);markDirty();render()});
    const heroFile=$('drawerHeroImage');if(heroFile)heroFile.addEventListener('change',()=>{const f=heroFile.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{config.images=config.images||{};config.images.hero=r.result;markDirty();render()};r.readAsDataURL(f)});
    const aboutFile=$('drawerAboutImage');if(aboutFile)aboutFile.addEventListener('change',()=>{const f=aboutFile.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{config.images=config.images||{};config.images.about=r.result;markDirty();render()};r.readAsDataURL(f)});
    const campaignFile=$('drawerCampaignImage');if(campaignFile)campaignFile.addEventListener('change',()=>{const f=campaignFile.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{config.images=config.images||{};config.images.campaign=r.result;markDirty();render()};r.readAsDataURL(f)});
    document.querySelectorAll('.drawer-priority-image').forEach(inp=>inp.addEventListener('change',()=>{const f=inp.files?.[0];if(!f)return;const i=+inp.dataset.priorityImage;const r=new FileReader();r.onload=()=>{config.images=config.images||{};config.images['priority'+i]=r.result;markDirty();render()};r.readAsDataURL(f)}));
    const vt=$('drawerVotingToggle');if(vt)vt.addEventListener('change',()=>{config.votingIntentEnabled=vt.checked;markDirty();render()});
    const add=$('drawerAddPriority');if(add)add.addEventListener('click',()=>{config.priorities.push({title:'New priority',copy:'Describe this priority.'});markDirty();openDrawer('priorities');render()});
    document.querySelectorAll('.drawer-priority-title,.drawer-priority-copy').forEach(el=>el.addEventListener('input',()=>{
      const item=el.closest('[data-drawer-priority]'),i=+item.dataset.drawerPriority;
      config.priorities[i][el.classList.contains('drawer-priority-title')?'title':'copy']=el.value;markDirty();render()
    }));
    document.querySelectorAll('.drawer-remove-priority').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.closest('[data-drawer-priority]').dataset.drawerPriority;if(config.priorities.length>1){config.priorities.splice(i,1);markDirty();openDrawer('priorities');render()}}));
    document.querySelectorAll('.drawer-duplicate-priority').forEach(btn=>btn.addEventListener('click',()=>{const i=+btn.closest('[data-drawer-priority]').dataset.drawerPriority;config.priorities.splice(i+1,0,JSON.parse(JSON.stringify(config.priorities[i])));markDirty();openDrawer('priorities');render()}));
    document.querySelectorAll('[data-toggle-section]').forEach(btn=>btn.addEventListener('click',()=>{const s=config.sections.find(x=>x.id===btn.dataset.toggleSection);if(s){s.visible=!s.visible;markDirty();render();openDrawer(btn.dataset.toggleSection)}}));
    document.querySelectorAll('[data-move-section]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.moveSection,dir=+btn.dataset.dir,i=config.sections.findIndex(x=>x.id===id),j=i+dir;if(i>=0&&j>=0&&j<config.sections.length){[config.sections[i],config.sections[j]]=[config.sections[j],config.sections[i]];markDirty();render();openDrawer(id)}}));
  }

  $('drawerCloseBtn').addEventListener('click',()=>{$('visualWorkspace').classList.remove('drawer-open');$('editDrawer').classList.remove('open');document.querySelectorAll('.edit-hotspot').forEach(h=>h.classList.remove('active'));setTimeout(buildHotspots,220)});
  $('visualSiteSwitcher').value=siteId;
  $('visualSiteSwitcher').addEventListener('change',()=>{saveDraft(true);location.href='editor.html?site='+encodeURIComponent($('visualSiteSwitcher').value)});
  document.querySelectorAll('[data-visual-mode]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-visual-mode]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('visualCanvas').classList.remove('desktop','tablet','mobile');$('visualCanvas').classList.add(btn.dataset.visualMode);setTimeout(buildHotspots,220)}));
  $('visualSaveBtn').addEventListener('click',()=>saveDraft(false));
  $('visualPreviewBtn').addEventListener('click',()=>{writeFrame($('previewOverlayFrame'),renderPublicSite(config));$('previewOverlay').classList.add('open')});
  $('previewOverlayClose').addEventListener('click',()=>$('previewOverlay').classList.remove('open'));
  $('visualPublishBtn').addEventListener('click',()=>$('publishModal').classList.add('open'));
  $('publishCancel').addEventListener('click',()=>$('publishModal').classList.remove('open'));
  $('publishConfirm').addEventListener('click',()=>{site.config=config;site.status='live';sites[siteId]=site;saveSites(sites);dirty=false;status();$('publishModal').classList.remove('open');toast('Website published')});
  $('visualExportBtn').addEventListener('click',()=>{const b=new Blob([renderPublicSite(config)],{type:'text/html'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=siteId+'.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
  frame.addEventListener('load',()=>setTimeout(buildHotspots,40));
  window.addEventListener('resize',()=>setTimeout(buildHotspots,80));
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
  window.addEventListener('focus',()=>render());
  status();render()
})();

(function globalSearch(){
  if(window.CP_STAGE2)return;
  const input=document.getElementById('globalSearchInput'),pop=document.getElementById('globalSearchPopover');
  if(!input||!pop)return;
  const people=[
    {name:'Sarah Smith',meta:'BG3 4XX · Roads · Liberal Democrat',url:'person.html'},
    {name:'Tom Williams',meta:'BG1 2AB · Crime · Undecided',url:'people.html'},
    {name:'Aisha Khan',meta:'BG2 7PL · Local services · Labour',url:'people.html'},
    {name:'David Brown',meta:'BG4 8HR · Roads',url:'people.html'}
  ];
  function sitesData(){
    const s=cpSites();return Object.entries(s).map(([id,x])=>({name:x.name,meta:(x.area||'')+' · '+(x.status==='live'?'Published':x.status==='archived'?'Archived':'Draft'),url:'editor.html?site='+encodeURIComponent(id)}));
  }
  function render(q){
    q=q.toLowerCase().trim();
    const ps=people.filter(x=>!q||x.name.toLowerCase().includes(q)||x.meta.toLowerCase().includes(q));
    const ss=sitesData().filter(x=>!q||x.name.toLowerCase().includes(q)||x.meta.toLowerCase().includes(q));
    pop.innerHTML='<div class="search-group-title">People</div>'+ps.map(x=>`<a class="search-result" href="${x.url}"><span><strong>${x.name}</strong><small>${x.meta}</small></span></a>`).join('')+
      '<div class="search-group-title">Websites</div>'+ss.map(x=>`<a class="search-result" href="${x.url}"><span><strong>${x.name}</strong><small>${x.meta}</small></span></a>`).join('');
    pop.classList.add('open')
  }
  input.addEventListener('focus',()=>render(input.value));input.addEventListener('input',()=>render(input.value));
  document.addEventListener('click',e=>{if(!e.target.closest('.global-search-wrap'))pop.classList.remove('open')});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();render(input.value)}});
})();

(function contextualHelp(){
  const help=document.getElementById('helpPop')||(()=>{const e=document.createElement('div');e.className='help-pop';e.id='helpPop';document.body.appendChild(e);return e})();
  const copy={
    domain:'Connect your own domain by adding the DNS records shown here. The platform address keeps working while you do this.',
    'voting-intention':'Voting intention is political-opinion data. Only enable it when your campaign has the appropriate privacy and access controls in place.'
  };
  document.querySelectorAll('[data-help]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();help.textContent=copy[btn.dataset.help]||'';const r=btn.getBoundingClientRect();
    help.style.left=Math.min(r.left,window.innerWidth-280)+'px';help.style.top=(r.bottom+6+window.scrollY)+'px';help.classList.toggle('open')
  }));
  document.addEventListener('click',()=>help.classList.remove('open'));
})();

(function dashboardEmptyState(){
  const empty=document.getElementById('dashboardEmptyState'),wrap=document.getElementById('dashboardDataWrap');
  if(!empty||!wrap)return;
  const current=localStorage.getItem('cpCurrentSite')||'joe-bloggs';
  const site=cpSites()[current];
  if(site && site.status==='draft' && site.name!=='Joe Bloggs'){
    empty.style.display='block';wrap.style.display='none';
  }
})();

(function visualEditorEnhancements(){
  const save=document.getElementById('visualSaveBtn');if(!save)return;
  const indicator=document.getElementById('autosaveIndicator'),saveText=document.getElementById('autosaveText');
  const undoToast=document.getElementById('undoToast'),undoBtn=document.getElementById('undoBtn'),undoText=document.getElementById('undoText');
  const historyModal=document.getElementById('historyModal'),historyList=document.getElementById('historyList');
  const openHistory=document.getElementById('openHistoryBtn'),closeHistory=document.getElementById('historyCloseBtn');
  let undoStack=[];

  function snapshot(label){
    try{
      const current=localStorage.getItem('campaignPublishedConfig')||localStorage.getItem('campaignEditorDraft')||null;
      undoStack.push({label,data:current});
      if(undoStack.length>8)undoStack.shift();
      if(undoToast){undoText.textContent=label;undoToast.classList.add('show');setTimeout(()=>undoToast.classList.remove('show'),3500)}
    }catch(e){}
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.drawer-remove-priority'))snapshot('Priority removed');
    if(e.target.closest('[data-toggle-section]'))snapshot('Section visibility changed');
    if(e.target.closest('[data-move-section]'))snapshot('Section moved');
  },true);

  if(undoBtn)undoBtn.addEventListener('click',()=>{
    const last=undoStack.pop();if(!last)return;
    if(last.data)localStorage.setItem('campaignEditorDraft',last.data);
    undoToast.classList.remove('show');location.reload()
  });

  const observer=new MutationObserver(()=>{
    if(indicator){indicator.classList.add('saving');saveText.textContent='Saving…';setTimeout(()=>{indicator.classList.remove('saving');saveText.textContent='Saved just now'},900)}
    const dirty=document.getElementById('healthDraft');if(dirty){dirty.textContent='Unpublished changes';dirty.className='health-warn'}
  });
  const status=document.getElementById('visualStatus');
  if(status)observer.observe(status,{attributes:true,subtree:true,childList:true});

  const publish=document.getElementById('publishConfirm');
  if(publish)publish.addEventListener('click',()=>{
    const key='cpPublishHistory';
    let h=[];try{h=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}
    h.unshift({when:new Date().toLocaleString(),label:'Published version'});
    h=h.slice(0,10);localStorage.setItem(key,JSON.stringify(h));
    const dirty=document.getElementById('healthDraft');if(dirty){dirty.textContent='No unpublished changes';dirty.className='health-ok'}
  });

  function showHistory(){
    let h=[];try{h=JSON.parse(localStorage.getItem('cpPublishHistory')||'[]')}catch(e){}
    if(!h.length)h=[{when:'Today, 18:42',label:'Initial published version'}];
    historyList.innerHTML=h.map((x,i)=>`<div class="history-row"><div><strong>${x.label}</strong><small>${x.when}</small></div><button class="btn secondary small restore-version" data-history-index="${i}">Restore</button></div>`).join('');
    historyModal.classList.add('open')
  }
  if(openHistory)openHistory.addEventListener('click',showHistory);
  if(closeHistory)closeHistory.addEventListener('click',()=>historyModal.classList.remove('open'));
  if(historyList)historyList.addEventListener('click',e=>{
    if(e.target.classList.contains('restore-version')){historyModal.classList.remove('open');if(undoToast){undoText.textContent='Version restored';undoToast.classList.add('show')}}
  });
})();

/* ---------- shared functional campaign data ---------- */
function cpCurrentSiteId(){
  return new URLSearchParams(location.search).get('site') || localStorage.getItem('cpCurrentSite') || 'joe-bloggs';
}
function cpPeopleSeed(siteId){
  const joe=[
    {id:1,first:'Sarah',last:'Smith',email:'sarah.smith@example.org',phone:'07700 900111',postcode:'BG3 4XX',area:'Little Bloggs',issues:['Roads','Bus campaign'],voting:'Liberal Democrat',volunteer:'Leaflets',source:'Facebook',consent:true,created:'2026-08-25T17:14:00',actions:['survey','bus_campaign','volunteer']},
    {id:2,first:'Tom',last:'Williams',email:'tom.w@example.org',phone:'',postcode:'BG1 2AB',area:'Bloggs Town Centre',issues:['Crime'],voting:'Undecided',volunteer:'',source:'Organic',consent:true,created:'2026-08-25T16:52:00',actions:['survey']},
    {id:3,first:'Aisha',last:'Khan',email:'aisha.k@example.org',phone:'07700 900222',postcode:'BG2 7PL',area:'North Bloggs',issues:['Local services'],voting:'Labour',volunteer:'Doorstep',source:'Email',consent:true,created:'2026-08-24T20:10:00',actions:['survey','volunteer']},
    {id:4,first:'David',last:'Brown',email:'david.b@example.org',phone:'',postcode:'BG4 8HR',area:'East Bloggs',issues:['Roads'],voting:'',volunteer:'Poster',source:'Direct',consent:true,created:'2026-08-24T18:31:00',actions:['signup','volunteer']},
    {id:5,first:'Emily',last:'Clarke',email:'emily.c@example.org',phone:'',postcode:'BG5 1QT',area:'The Villages',issues:['Parking'],voting:'Conservative',volunteer:'',source:'Facebook',consent:true,created:'2026-08-23T14:41:00',actions:['survey']},
    {id:6,first:'Michael',last:'Green',email:'m.green@example.org',phone:'07700 900333',postcode:'BG3 9DA',area:'Little Bloggs',issues:['Bus campaign'],voting:'Reform UK',volunteer:'Online',source:'Organic',consent:false,created:'2026-08-23T11:17:00',actions:['bus_campaign','volunteer']},
    {id:7,first:'Lucy',last:'Baker',email:'lucy.b@example.org',phone:'',postcode:'BG3 2PL',area:'Little Bloggs',issues:['Roads','Parking'],voting:'Undecided',volunteer:'Leaflets',source:'Facebook',consent:true,created:'2026-08-22T10:14:00',actions:['survey','volunteer']},
    {id:8,first:'Mark',last:'Evans',email:'mark.e@example.org',phone:'',postcode:'BG2 1NN',area:'North Bloggs',issues:['Crime'],voting:'Conservative',volunteer:'',source:'Direct',consent:true,created:'2026-08-21T09:23:00',actions:['signup']},
    {id:9,first:'Priya',last:'Patel',email:'priya.p@example.org',phone:'07700 900444',postcode:'BG1 6TR',area:'Bloggs Town Centre',issues:['Local services'],voting:'Labour',volunteer:'Online',source:'Email',consent:true,created:'2026-08-20T15:02:00',actions:['survey','volunteer']},
    {id:10,first:'George',last:'White',email:'george.w@example.org',phone:'',postcode:'BG4 3ST',area:'East Bloggs',issues:['Roads'],voting:'Liberal Democrat',volunteer:'',source:'Organic',consent:true,created:'2026-08-19T12:35:00',actions:['survey']}
  ];
  if(siteId==='sarah-jones') return [];
  return joe;
}
function cpPeople(){
  const siteId=cpCurrentSiteId(),key='cpPeople:'+siteId;
  let d;try{d=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
  if(!d){d=cpPeopleSeed(siteId);localStorage.setItem(key,JSON.stringify(d))}
  return d;
}
function cpSurveyDefaults(){
  return [
    {id:'issue',type:'single',label:'What is the biggest local issue?',enabled:true,crmField:'issue',options:['Roads and pavements','Crime and antisocial behaviour','Bins, litter and street cleaning','Local services','Parking and traffic','Planning and development']},
    {id:'open',type:'text',label:'If you could change one thing locally, what would it be?',enabled:true,crmField:'note',options:[]},
    {id:'email_optin',type:'yesno',label:'Would you like campaign updates by email?',enabled:true,crmField:'consent',options:['Yes','No']},
    {id:'voting',type:'single',label:'If there were a council election tomorrow, which party would you be most likely to vote for?',enabled:false,crmField:'voting',options:['Conservative','Labour','Liberal Democrat','Reform UK','Green','Other','Undecided','Prefer not to say']}
  ];
}
function cpSurveyQuestions(){
  const siteId=cpCurrentSiteId(),key='cpSurvey:'+siteId;
  let q;try{q=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
  if(!q){q=cpSurveyDefaults();localStorage.setItem(key,JSON.stringify(q))}
  return q;
}
function saveSurveyQuestions(q){localStorage.setItem('cpSurvey:'+cpCurrentSiteId(),JSON.stringify(q))}

/* ---------- People CRM functionality ---------- */
(function peopleCRM(){
  const table=document.querySelector('.table-card table');if(!table)return;
  const siteId=cpCurrentSiteId();
  let people=cpPeople(), filtered=[...people], sortKey='name', sortDir=1, page=1, perPage=6;
  const state={search:'',issue:'',voting:'',volunteer:'',source:'',area:''};

  const app=document.querySelector('.app-content');
  const intro=app.querySelector('.page-intro');
  const existingFilters=app.querySelector('.filters');
  if(existingFilters)existingFilters.remove();
  const toolbar=document.createElement('div');toolbar.innerHTML=`
    <div class="filter-toolbar">
      <input id="peopleSearch" placeholder="Search name, email or postcode">
      <select id="filterIssue"><option value="">All issues</option></select>
      <select id="filterArea"><option value="">All areas</option></select>
      <select id="filterVoting"><option value="">All voting intentions</option></select>
      <select id="filterVolunteer"><option value="">All volunteer types</option></select>
      <select id="filterSource"><option value="">All sources</option></select>
      <button class="btn secondary small" id="clearPeopleFilters">Clear</button>
      <button class="btn secondary small" id="savePeopleView">Save view</button>
    </div>
    <div class="saved-views" id="savedViews"></div>
    <div class="active-filters" id="activeFilters"></div>
    <div class="bulk-bar" id="bulkBar"><span><strong id="selectedCount">0</strong> selected</span><div><button class="btn secondary small" id="bulkTag">Add tag</button><button class="btn secondary small" id="bulkClear">Clear selection</button></div></div>`;
  intro.after(toolbar);

  const uniq=fn=>[...new Set(people.flatMap(fn).filter(Boolean))].sort();
  function fill(id,vals){const s=document.getElementById(id);vals.forEach(v=>s.insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`))}
  fill('filterIssue',uniq(p=>p.issues));fill('filterArea',uniq(p=>[p.area]));fill('filterVoting',uniq(p=>[p.voting]));fill('filterVolunteer',uniq(p=>[p.volunteer]));fill('filterSource',uniq(p=>[p.source]));

  function filter(){
    filtered=people.filter(p=>{
      const hay=(p.first+' '+p.last+' '+p.email+' '+p.postcode).toLowerCase();
      return (!state.search||hay.includes(state.search.toLowerCase())) &&
        (!state.issue||p.issues.includes(state.issue)) &&
        (!state.area||p.area===state.area) &&
        (!state.voting||p.voting===state.voting) &&
        (!state.volunteer||p.volunteer===state.volunteer) &&
        (!state.source||p.source===state.source);
    });
    sort();page=1;render();chips()
  }
  function sort(){
    filtered.sort((a,b)=>{
      let A,B;
      if(sortKey==='name'){A=a.first+' '+a.last;B=b.first+' '+b.last}
      else if(sortKey==='postcode'){A=a.postcode;B=b.postcode}
      else if(sortKey==='voting'){A=a.voting;B=b.voting}
      else if(sortKey==='source'){A=a.source;B=b.source}
      else {A=a[sortKey]||'';B=b[sortKey]||''}
      return String(A).localeCompare(String(B))*sortDir
    })
  }
  function render(){
    const tbody=table.querySelector('tbody'),start=(page-1)*perPage,rows=filtered.slice(start,start+perPage);
    tbody.innerHTML=rows.length?rows.map(p=>`<tr>
      <td><input type="checkbox" class="row-select" data-id="${p.id}"></td>
      <td><a href="person.html?id=${p.id}"><span class="person-name">${esc(p.first+' '+p.last)}</span><span class="person-email">${esc(p.email)}</span></a></td>
      <td>${esc(p.postcode)}</td><td>${esc(p.area)}</td><td>${p.voting?`<span class="intent-pill ${p.voting==='Undecided'?'undecided':''}">${esc(p.voting)}</span>`:'<span class="intent-pill none">Not asked</span>'}</td>
      <td>${esc(p.issues.join(' · '))}</td><td>${esc(p.volunteer||'—')}</td><td>${esc(p.source)}</td><td>${p.consent?'<span class="tag green">Opted in</span>':'<span class="tag grey">No</span>'}</td></tr>`).join(''):`<tr><td colspan="9"><div class="no-results">No supporters match these filters.</div></td></tr>`;
    renderPagination();bindRows()
  }
  table.querySelector('thead').innerHTML=`<tr><th><input type="checkbox" id="selectAllPeople"></th><th class="table-sort" data-sort="name">Supporter</th><th class="table-sort" data-sort="postcode">Postcode</th><th>Area</th><th class="table-sort" data-sort="voting">Voting intention</th><th>Issues / actions</th><th>Volunteer</th><th class="table-sort" data-sort="source">Source</th><th>Email</th></tr>`;
  const pag=document.createElement('div');pag.className='pagination';table.parentElement.after(pag);
  function renderPagination(){
    const pages=Math.max(1,Math.ceil(filtered.length/perPage));
    if(page>pages)page=pages;
    pag.innerHTML=`<span>Showing ${filtered.length?((page-1)*perPage+1):0}–${Math.min(page*perPage,filtered.length)} of ${filtered.length}</span><div class="pagination-controls"><button id="prevPage" ${page<=1?'disabled':''}>Previous</button><button id="nextPage" ${page>=pages?'disabled':''}>Next</button></div>`;
    document.getElementById('prevPage').onclick=()=>{page--;render()};document.getElementById('nextPage').onclick=()=>{page++;render()}
  }
  function chips(){
    const wrap=document.getElementById('activeFilters');wrap.innerHTML='';
    Object.entries(state).filter(([,v])=>v).forEach(([k,v])=>wrap.insertAdjacentHTML('beforeend',`<span class="filter-chip">${esc(v)} <button data-clear="${k}">×</button></span>`));
    wrap.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>{state[b.dataset.clear]='';syncControls();filter()})
  }
  function syncControls(){
    document.getElementById('peopleSearch').value=state.search;document.getElementById('filterIssue').value=state.issue;document.getElementById('filterArea').value=state.area;document.getElementById('filterVoting').value=state.voting;document.getElementById('filterVolunteer').value=state.volunteer;document.getElementById('filterSource').value=state.source
  }
  function bindRows(){
    document.querySelectorAll('.row-select').forEach(c=>c.onchange=bulkUpdate);
    const all=document.getElementById('selectAllPeople');if(all)all.onchange=()=>{document.querySelectorAll('.row-select').forEach(c=>c.checked=all.checked);bulkUpdate()}
  }
  function bulkUpdate(){
    const n=document.querySelectorAll('.row-select:checked').length,bar=document.getElementById('bulkBar');document.getElementById('selectedCount').textContent=n;bar.classList.toggle('show',n>0)
  }
  document.getElementById('bulkClear').onclick=()=>{document.querySelectorAll('.row-select').forEach(c=>c.checked=false);bulkUpdate()};
  document.getElementById('bulkTag').onclick=()=>alert('Prototype: selected supporters tagged.');
  document.querySelectorAll('.table-sort').forEach(h=>h.onclick=()=>{const k=h.dataset.sort;if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=1}sort();render()});
  [['peopleSearch','search'],['filterIssue','issue'],['filterArea','area'],['filterVoting','voting'],['filterVolunteer','volunteer'],['filterSource','source']].forEach(([id,k])=>document.getElementById(id).addEventListener(id==='peopleSearch'?'input':'change',e=>{state[k]=e.target.value;filter()}));
  document.getElementById('clearPeopleFilters').onclick=()=>{Object.keys(state).forEach(k=>state[k]='');syncControls();filter()};
  document.getElementById('savePeopleView').onclick=()=>{const name=prompt('Name this view');if(!name)return;let views=[];try{views=JSON.parse(localStorage.getItem('cpSavedViews:'+siteId)||'[]')}catch(e){}views.push({name,state:{...state}});localStorage.setItem('cpSavedViews:'+siteId,JSON.stringify(views));renderViews()};
  function renderViews(){let views=[];try{views=JSON.parse(localStorage.getItem('cpSavedViews:'+siteId)||'[]')}catch(e){}const w=document.getElementById('savedViews');w.innerHTML=views.map((v,i)=>`<button class="saved-view-btn" data-view="${i}">${esc(v.name)}</button>`).join('');w.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{Object.assign(state,views[+b.dataset.view].state);syncControls();filter()})}
  const exportBtn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Export CSV'));if(exportBtn)exportBtn.onclick=()=>{const rows=[['Name','Email','Postcode','Area','Voting intention','Issues','Volunteer','Source','Email consent'],...filtered.map(p=>[p.first+' '+p.last,p.email,p.postcode,p.area,p.voting,p.issues.join('|'),p.volunteer,p.source,p.consent?'Yes':'No'])];const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='supporters-filtered.csv';a.click()};
  // URL drilldowns
  const qp=new URLSearchParams(location.search);['issue','area','voting','volunteer','source'].forEach(k=>{if(qp.get(k))state[k]=qp.get(k)});if(qp.get('new')==='week')state.search='';
  syncControls();renderViews();filter()
})();

/* ---------- Dashboard live metrics and drilldowns ---------- */
(function dashboardData(){
  const kpis=document.querySelectorAll('.kpi-grid .kpi');if(!kpis.length)return;
  const p=cpPeople(),survey=p.filter(x=>x.actions.includes('survey')),vol=p.filter(x=>x.volunteer),backers=p.filter(x=>x.actions.includes('bus_campaign'));
  const vals=[p.length,survey.length,backers.length,vol.length];
  kpis.forEach((k,i)=>{const strong=k.querySelector('strong');if(strong)strong.textContent=vals[i]});
  const urls=['people.html','campaigns.html','surveys.html','people.html?volunteer=Leaflets'];
  kpis.forEach((k,i)=>{k.classList.add('drill-link');k.onclick=()=>location.href=urls[i]});
  document.querySelectorAll('.issue-row').forEach(row=>{
    const name=row.querySelector('span')?.textContent.trim();if(!name)return;row.classList.add('drill-link');row.onclick=()=>location.href='people.html?issue='+encodeURIComponent(name==='Services'?'Local services':name)
  })
})();

/* ---------- Survey builder functionality ---------- */
(function surveyBuilder(){
  const app=document.querySelector('.app-content');if(!app||!location.pathname.endsWith('__legacy-surveys-disabled.html'))return;
  app.innerHTML=`
  <div class="page-intro"><div><h2>Surveys</h2><p>Build the questions on your website and review the results.</p></div><button class="btn small" id="saveSurveyBtn">Save survey</button></div>
  <div class="survey-tabs"><button class="survey-tab active" data-tab="questions">Questions</button><button class="survey-tab" data-tab="results">Results</button></div>
  <section class="survey-panel active" id="surveyQuestionsPanel">
    <div class="dashboard-grid"><div><div class="question-builder" id="questionBuilder"></div><div class="add-question-menu">
      <button data-add-q="text">+ Open text</button><button data-add-q="single">+ Single choice</button><button data-add-q="multi">+ Multiple choice</button><button data-add-q="yesno">+ Yes / No</button><button data-add-q="rating">+ Rating 1–5</button><button data-add-q="postcode">+ Postcode</button><button data-add-q="phone">+ Phone</button>
    </div></div><aside class="survey-preview"><h3>Website survey preview</h3><div id="surveyBuilderPreview"></div></aside></div>
  </section>
  <section class="survey-panel" id="surveyResultsPanel"><div class="kpi-grid"><div class="card kpi"><strong id="surveyCount">0</strong><span>Responses</span></div><div class="card kpi"><strong id="surveyOptin">0</strong><span>Email opt-ins</span></div><div class="card kpi"><strong id="surveyVotingKnown">0</strong><span>Voting intention known</span></div><div class="card kpi"><strong id="surveyVolunteers">0</strong><span>Volunteers</span></div></div><div class="panel" style="margin-top:16px"><h3>Recent responses</h3><div id="recentSurveyResponses"></div></div></section>`;
  let q=cpSurveyQuestions();
  const builder=document.getElementById('questionBuilder'),preview=document.getElementById('surveyBuilderPreview');
  function labelType(t){return {text:'Open text',single:'Single choice',multi:'Multiple choice',yesno:'Yes / No',rating:'Rating 1–5',postcode:'Postcode',phone:'Phone'}[t]||t}
  function render(){
    saveSurveyQuestions(q);
    builder.innerHTML=q.map((x,i)=>`<div class="question-card" data-q="${i}"><div class="question-card-head"><div><span class="question-type">${labelType(x.type)}</span><strong style="display:block;margin-top:3px">${esc(x.label)}</strong></div><div class="question-controls"><button class="q-up">↑</button><button class="q-down">↓</button><button class="q-dup">Duplicate</button><button class="q-del">Remove</button></div></div><div class="question-grid"><label class="field"><span>Question</span><input class="q-label" value="${esc(x.label)}"></label><label class="question-visibility"><input class="q-enabled" type="checkbox" ${x.enabled?'checked':''}> Show on website</label></div>${['single','multi'].includes(x.type)?`<label class="field question-options"><span>Options — one per line</span><textarea class="q-options">${esc((x.options||[]).join('\n'))}</textarea></label>`:''}</div>`).join('');
    preview.innerHTML=q.filter(x=>x.enabled).map(x=>previewQ(x)).join('')||'<p class="muted">No questions enabled.</p>';
    bind()
  }
  function previewQ(x){
    if(x.type==='text')return `<div class="preview-question"><label>${esc(x.label)}</label><textarea></textarea></div>`;
    if(x.type==='single')return `<div class="preview-question"><label>${esc(x.label)}</label><select><option>Select</option>${(x.options||[]).map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
    if(x.type==='multi')return `<div class="preview-question"><label>${esc(x.label)}</label><div class="choice-list">${(x.options||[]).map(o=>`<label><input type="checkbox"> ${esc(o)}</label>`).join('')}</div></div>`;
    if(x.type==='yesno')return `<div class="preview-question"><label>${esc(x.label)}</label><div class="yesno"><span>Yes</span><span>No</span></div></div>`;
    if(x.type==='rating')return `<div class="preview-question"><label>${esc(x.label)}</label><div class="rating-row">${[1,2,3,4,5].map(n=>`<span>${n}</span>`).join('')}</div></div>`;
    return `<div class="preview-question"><label>${esc(x.label)}</label><input></div>`
  }
  function bind(){
    builder.querySelectorAll('.question-card').forEach(card=>{
      const i=+card.dataset.q;
      card.querySelector('.q-label').oninput=e=>{q[i].label=e.target.value;renderPreviewOnly()};
      card.querySelector('.q-enabled').onchange=e=>{q[i].enabled=e.target.checked;renderPreviewOnly()};
      const opts=card.querySelector('.q-options');if(opts)opts.oninput=e=>{q[i].options=e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);renderPreviewOnly()};
      card.querySelector('.q-del').onclick=()=>{q.splice(i,1);render()};
      card.querySelector('.q-dup').onclick=()=>{q.splice(i+1,0,{...JSON.parse(JSON.stringify(q[i])),id:'q'+Date.now()});render()};
      card.querySelector('.q-up').onclick=()=>{if(i>0){[q[i-1],q[i]]=[q[i],q[i-1]];render()}};
      card.querySelector('.q-down').onclick=()=>{if(i<q.length-1){[q[i+1],q[i]]=[q[i],q[i+1]];render()}}
    })
  }
  function renderPreviewOnly(){saveSurveyQuestions(q);preview.innerHTML=q.filter(x=>x.enabled).map(x=>previewQ(x)).join('')||'<p class="muted">No questions enabled.</p>'}
  document.querySelectorAll('[data-add-q]').forEach(b=>b.onclick=()=>{const t=b.dataset.addQ,labels={text:'Your question',single:'Choose one option',multi:'Choose any that apply',yesno:'Yes or no?',rating:'How would you rate this?',postcode:'What is your postcode?',phone:'What is your phone number?'};q.push({id:'q'+Date.now(),type:t,label:labels[t],enabled:true,crmField:'custom',options:['Option 1','Option 2','Option 3']});render()});
  document.getElementById('saveSurveyBtn').onclick=()=>{saveSurveyQuestions(q);const b=document.getElementById('saveSurveyBtn');const o=b.textContent;b.textContent='Saved';setTimeout(()=>b.textContent=o,900)};
  document.querySelectorAll('.survey-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.survey-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.survey-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab==='questions'?'surveyQuestionsPanel':'surveyResultsPanel').classList.add('active')});
  const p=cpPeople(),s=p.filter(x=>x.actions.includes('survey'));document.getElementById('surveyCount').textContent=s.length;document.getElementById('surveyOptin').textContent=s.filter(x=>x.consent).length;document.getElementById('surveyVotingKnown').textContent=s.filter(x=>x.voting).length;document.getElementById('surveyVolunteers').textContent=p.filter(x=>x.volunteer).length;document.getElementById('recentSurveyResponses').innerHTML=s.slice(0,5).map(x=>`<div class="activity-row"><strong>${esc(x.first+' '+x.last)}</strong><small>${esc(x.postcode)} · ${esc(x.issues.join(', '))}${x.voting?' · '+esc(x.voting):''}</small></div>`).join('');
  render()
})();

(function integrationTabs(){document.querySelectorAll('[data-integration-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.integration-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.integration-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');const id='integration'+b.dataset.integrationTab.charAt(0).toUpperCase()+b.dataset.integrationTab.slice(1)+'Panel';document.getElementById(id)?.classList.add('active')}))})();
(function peopleSyncStatus(){const table=document.querySelector('.table-card table');if(!table)return;function apply(){const trh=table.querySelector('thead tr');if(trh&&!trh.querySelector('[data-sync-head]')){const th=document.createElement('th');th.dataset.syncHead='1';th.textContent='CRM sync';trh.appendChild(th)}table.querySelectorAll('tbody tr').forEach(tr=>{if(tr.querySelector('[data-sync-cell]')||tr.querySelector('.no-results'))return;const td=document.createElement('td');td.dataset.syncCell='1';td.innerHTML='<span class="sync-status"><span class="dot"></span> Synced</span><br><a class="people-sync-link" href="integration-nationbuilder.html">Open in CRM</a>';tr.appendChild(td)})}apply();new MutationObserver(apply).observe(table,{childList:true,subtree:true})})();

/* Campaign microsite preview */
(function campaignMicrositeEditor(){
  const frame=document.getElementById('campaignFrame'); if(!frame) return;
  const data={headline:'Save the Bloggs Ward bus',support:'Joe is campaigning to protect the route and secure a service local residents can rely on.',points:['Protect the current route','Make the case for a reliable timetable','Keep communities connected'],image:'',vi:false};
  function html(){
    return `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;font-family:"Proxima Nova","Avenir Next",Arial,sans-serif;color:#08254a}.wrap{max-width:900px;margin:auto}.hero{background:#08254a;color:#fff;padding:70px 50px}.hero h1{font-size:70px;line-height:.92;margin:0 0 16px}.photo{height:340px;background:#a9b9c8 center/cover no-repeat}.points{padding:45px 50px;background:#f3f7fb}.points div{background:#fff;border:1px solid #dbe4ee;padding:18px;margin-bottom:10px}.signup{padding:45px 50px}.signup input,.signup select{width:100%;padding:12px;margin:5px 0;border:1px solid #ccd7e3}.btn{background:#1476d4;color:#fff;border:0;padding:14px 18px;font-weight:900}.imprint{padding:25px 50px;background:#061a34;color:#fff;font-size:12px}</style></head><body><div class="wrap"><section class="hero"><h1>${data.headline}</h1><p>${data.support}</p></section><div class="photo"></div><section class="points">${data.points.map(p=>`<div>${p}</div>`).join('')}</section><section class="signup"><h2>Back this campaign</h2><input placeholder="First name"><input placeholder="Last name"><input placeholder="Email"><input placeholder="Postcode">${data.vi?'<select><option>Voting intention</option></select>':''}<button class="btn">Back the campaign</button></section><footer class="imprint">Promoted by Joe Bloggs, Bloggs Ward.</footer></div></body></html>`;
  }
  const d=frame.contentDocument; d.open(); d.write(html()); d.close();
})();

/* Creative visual editor */
(function creativeVisualEditor(){
  const art=document.getElementById('creativeArt'); if(!art) return;
  const params=new URLSearchParams(location.search);
  let template=params.get('template')||'announcement';
  const state={
    primary:'#08254a', secondary:'#1476d4', background:'#08254a', fade:'#08254a', text:'#ffffff',
    image:'', headline:'A stronger voice for Bloggs Ward.', support:'Joe Bloggs is standing to deliver practical change locally.',
    eyebrow:'Joe Bloggs', stat:'42%', quote:'“Local people deserve a stronger voice.”', backing:'I’m backing Joe',
    name:'Sarah, Little Bloggs'
  };
  const titles={announcement:'Campaign announcement',quote:'Quote card',campaign:'Campaign / petition',stat:'Local issue stat',backing:'I’m backing Joe'};
  const canvas=document.getElementById('creativeCanvas'),workspace=document.getElementById('creativeWorkspace');
  function body(){
    let main='';
    if(template==='quote') main=`<div class="creative-quote">${state.quote}</div><div class="creative-support">${state.name}</div>`;
    else if(template==='stat') main=`<div class="creative-stat">${state.stat}</div><div class="creative-headline">${state.headline}</div>`;
    else if(template==='backing') main=`<div class="creative-backing">${state.backing}</div><div class="creative-support">${state.name}</div>`;
    else main=`<div class="creative-eyebrow">${state.eyebrow}</div><div class="creative-headline">${state.headline}</div><div class="creative-support">${state.support}</div>`;
    return `<div class="creative-photo" style="${state.image?`background-image:url('${state.image}')`:''}"></div><div class="creative-overlay"></div><div class="creative-copy">${main}</div><div class="creative-footer"><span>Joe Bloggs</span><span>Bloggs Ward</span></div>
    <div class="creative-hotspot" data-edit="text" style="left:4%;top:6%;width:57%;height:78%"><span>Edit text</span></div><div class="creative-hotspot" data-edit="image" style="left:48%;top:0;width:52%;height:100%"><span>Edit image</span></div><div class="creative-hotspot" data-edit="brand" style="left:0;bottom:0;width:100%;height:16%"><span>Edit branding</span></div>`;
  }
  function render(){art.style.setProperty('--creative-bg',state.background);art.style.setProperty('--creative-fade',state.fade||state.primary);art.style.setProperty('--creative-text',state.text);art.innerHTML=body();document.getElementById('creativeTitle').textContent=titles[template];bindHotspots()}
  function openDrawer(type){
    workspace.classList.add('drawer-open');document.getElementById('creativeDrawerTitle').textContent=type==='text'?'Text':type==='image'?'Image':'Branding';
    let html='';
    if(type==='text'){
      if(template==='quote') html=`<label class="field"><span>Quote</span><textarea data-field="quote">${state.quote}</textarea></label><label class="field"><span>Name / area</span><input data-field="name" value="${state.name}"></label>`;
      else if(template==='stat') html=`<label class="field"><span>Stat</span><input data-field="stat" value="${state.stat}"></label><label class="field"><span>Headline</span><textarea data-field="headline">${state.headline}</textarea></label>`;
      else if(template==='backing') html=`<label class="field"><span>Headline</span><input data-field="backing" value="${state.backing}"></label><label class="field"><span>Supporter</span><input data-field="name" value="${state.name}"></label>`;
      else html=`<label class="field"><span>Small line</span><input data-field="eyebrow" value="${state.eyebrow}"></label><label class="field"><span>Headline</span><textarea data-field="headline">${state.headline}</textarea></label><label class="field"><span>Supporting text</span><textarea data-field="support">${state.support}</textarea></label>`;
    } else if(type==='image'){
      html=`<label class="field"><span>One campaign image</span><input id="creativeImageInput" type="file" accept="image/*"></label><p class="muted">Upload one image. It will crop automatically to fit the template.</p>`;
    } else {
      html=`<label class="field"><span>Primary colour</span><input type="color" data-field="primary" value="${state.primary}"></label><label class="field"><span>Fade colour</span><input type="color" data-field="fade" value="${state.fade}"></label><label class="field"><span>Text colour</span><input type="color" data-field="text" value="${state.text}"></label><p class="muted">The image stays full bleed. The selected colour is used only for the dark fade over it.</p>`;
    }
    document.getElementById('creativeDrawerBody').innerHTML=html;
    document.querySelectorAll('#creativeDrawerBody [data-field]').forEach(el=>el.addEventListener('input',()=>{state[el.dataset.field]=el.value;render()}));
    const file=document.getElementById('creativeImageInput'); if(file) file.addEventListener('change',()=>{const f=file.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.image=r.result;render()};r.readAsDataURL(f)});
  }
  function bindHotspots(){document.querySelectorAll('.creative-hotspot').forEach(h=>h.addEventListener('click',()=>openDrawer(h.dataset.edit)))}
  document.getElementById('creativeDrawerClose').onclick=()=>workspace.classList.remove('drawer-open');
  document.getElementById('creativeFormat').onchange=e=>{canvas.className='creative-canvas '+e.target.value};
  document.getElementById('creativeReset').onclick=()=>{state.primary='#08254a';state.background='#08254a';state.fade='#08254a';state.text='#ffffff';render()};
  document.getElementById('creativeExport').onclick=()=>alert('Prototype: export the current graphic as PNG.');
  render();
})();

(function creativeHistory(){
  function history(){let h=[];try{h=JSON.parse(localStorage.getItem('cpCreativeHistory')||'[]')}catch(e){}return h}
  function saveHistory(h){localStorage.setItem('cpCreativeHistory',JSON.stringify(h))}
  const grid=document.getElementById('creativeHistoryGrid');
  if(grid){
    const h=history();
    grid.innerHTML=h.length?h.map((g,i)=>`<article class="saved-graphic-card"><div class="saved-graphic-thumb">${g.image?`<img src="${g.image}">`:''}</div><div class="saved-graphic-card-body"><h4>${esc(g.title||'Campaign graphic')}</h4><small>${esc(g.format||'Square')} · ${new Date(g.savedAt).toLocaleDateString()}</small><div class="button-row" style="margin-top:9px"><a class="btn secondary small" href="creative-editor.html?template=${encodeURIComponent(g.template||'announcement')}&saved=${i}">Edit again</a></div></div></article>`).join(''):'<div class="empty-state-card"><h3>No saved graphics yet</h3><p>Create a graphic and choose “Save graphic” to keep it here.</p></div>';
  }
  const saveBtn=document.getElementById('creativeSaveGraphic');
  if(saveBtn){
    saveBtn.addEventListener('click',()=>{
      const canvas=document.getElementById('creativeCanvas'),art=document.getElementById('creativeArt');
      const h=history();
      const template=new URLSearchParams(location.search).get('template')||'announcement';
      const image=art?.querySelector('.creative-photo')?.style.backgroundImage?.replace(/^url\(["']?/,'').replace(/["']?\)$/,'')||'';
      h.unshift({title:document.getElementById('creativeTitle')?.textContent||'Campaign graphic',template,format:canvas?.className.split(' ').pop()||'square',image,preview:cpCreativeSnapshot(),savedAt:new Date().toISOString()});
      saveHistory(h.slice(0,24));
      const old=saveBtn.textContent;saveBtn.textContent='Saved';setTimeout(()=>saveBtn.textContent=old,1000)
    })
  }
})();

/* ---------- Multi-survey library ---------- */
function cpSurveyLibrary(){
  const key='cpSurveyLibrary:'+cpCurrentSiteId();let lib;
  try{lib=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
  if(!lib){
    const existing=typeof cpSurveyQuestions==='function'?cpSurveyQuestions():cpSurveyDefaults();
    lib=[{id:'residents-survey',name:'Residents survey',status:'Published',questions:existing,created:new Date().toISOString()}];
    localStorage.setItem(key,JSON.stringify(lib))
  }
  return lib
}
function cpSaveSurveyLibrary(lib){localStorage.setItem('cpSurveyLibrary:'+cpCurrentSiteId(),JSON.stringify(lib))}
function cpSelectedSurveyId(){
  const site=cpCurrentSiteId();
  return localStorage.getItem('cpSelectedSurvey:'+site)||cpSurveyLibrary()[0]?.id||'residents-survey'
}
function cpSetSelectedSurveyId(id){localStorage.setItem('cpSelectedSurvey:'+cpCurrentSiteId(),id)}
function cpSelectedSurvey(){
  const lib=cpSurveyLibrary(),id=cpSelectedSurveyId();
  return lib.find(s=>s.id===id)||lib[0]
}

(function multiSurveyPage(){
  const grid=document.getElementById('__legacySurveyLibraryGrid');if(!grid)return;
  const libraryView=document.getElementById('surveyLibraryView'),editorView=document.getElementById('surveyEditorView');
  let lib=cpSurveyLibrary(),current=null,q=[];
  const esc2=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function renderLibrary(){
    lib=cpSurveyLibrary();
    grid.innerHTML=lib.map(s=>`<article class="survey-library-card"><span class="status-chip ${s.status==='Published'?'published':'draft'}">${s.status}</span><h3>${esc2(s.name)}</h3><div class="survey-meta"><span>${s.questions.filter(q=>q.enabled).length} active questions</span>${cpSelectedSurveyId()===s.id?'<span class="sync-badge">Used on website</span>':''}</div><div class="button-row"><button class="btn small" data-edit-survey="${s.id}">Edit</button><button class="btn secondary small" data-use-survey="${s.id}">${cpSelectedSurveyId()===s.id?'Selected':'Use on website'}</button><button class="btn secondary small" data-dup-survey="${s.id}">Duplicate</button></div></article>`).join('');
    grid.querySelectorAll('[data-edit-survey]').forEach(b=>b.onclick=()=>openSurvey(b.dataset.editSurvey));
    grid.querySelectorAll('[data-use-survey]').forEach(b=>b.onclick=()=>{cpSetSelectedSurveyId(b.dataset.useSurvey);renderLibrary()});
    grid.querySelectorAll('[data-dup-survey]').forEach(b=>b.onclick=()=>{const s=lib.find(x=>x.id===b.dataset.dupSurvey);const copy=JSON.parse(JSON.stringify(s));copy.id='survey-'+Date.now();copy.name=s.name+' copy';copy.status='Draft';lib.push(copy);cpSaveSurveyLibrary(lib);renderLibrary()})
  }
  function openSurvey(id){
    current=lib.find(s=>s.id===id);q=JSON.parse(JSON.stringify(current.questions||[]));
    libraryView.style.display='none';editorView.style.display='block';document.getElementById('surveyEditorName').textContent=current.name;
    renderBuilder()
  }
  function previewQ(x){
    if(x.type==='text')return `<div class="preview-question"><label>${esc2(x.label)}</label><textarea></textarea></div>`;
    if(x.type==='single')return `<div class="preview-question"><label>${esc2(x.label)}</label><select><option>Select</option>${(x.options||[]).map(o=>`<option>${esc2(o)}</option>`).join('')}</select></div>`;
    if(x.type==='multi')return `<div class="preview-question"><label>${esc2(x.label)}</label><div class="choice-list">${(x.options||[]).map(o=>`<label><input type="checkbox"> ${esc2(o)}</label>`).join('')}</div></div>`;
    if(x.type==='yesno')return `<div class="preview-question"><label>${esc2(x.label)}</label><div class="yesno"><span>Yes</span><span>No</span></div></div>`;
    if(x.type==='rating')return `<div class="preview-question"><label>${esc2(x.label)}</label><div class="rating-row">${[1,2,3,4,5].map(n=>`<span>${n}</span>`).join('')}</div></div>`;
    return `<div class="preview-question"><label>${esc2(x.label)}</label><input></div>`
  }
  function saveCurrent(){
    current.questions=q;current.status=current.status||'Draft';cpSaveSurveyLibrary(lib)
  }
  function renderBuilder(){
    const builder=document.getElementById('questionBuilder'),preview=document.getElementById('surveyBuilderPreview');
    builder.innerHTML=q.map((x,i)=>`<div class="question-card" data-q="${i}"><div class="question-card-head"><div><span class="question-type">${esc2(x.type)}</span><strong style="display:block;margin-top:3px">${esc2(x.label)}</strong></div><div class="question-controls"><button class="q-up">↑</button><button class="q-down">↓</button><button class="q-dup">Duplicate</button><button class="q-del">Remove</button></div></div><div class="question-grid"><label class="field"><span>Question</span><input class="q-label" value="${esc2(x.label)}"></label><label class="question-visibility"><input class="q-enabled" type="checkbox" ${x.enabled?'checked':''}> Show on website</label></div>${['single','multi'].includes(x.type)?`<label class="field question-options"><span>Options — one per line</span><textarea class="q-options">${esc2((x.options||[]).join('\n'))}</textarea></label>`:''}</div>`).join('');
    preview.innerHTML=q.filter(x=>x.enabled).map(previewQ).join('')||'<p class="muted">No questions enabled.</p>';
    builder.querySelectorAll('.question-card').forEach(card=>{
      const i=+card.dataset.q;
      card.querySelector('.q-label').oninput=e=>{q[i].label=e.target.value;saveCurrent();renderBuilder()};
      card.querySelector('.q-enabled').onchange=e=>{q[i].enabled=e.target.checked;saveCurrent();renderBuilder()};
      const o=card.querySelector('.q-options');if(o)o.onchange=e=>{q[i].options=e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);saveCurrent();renderBuilder()};
      card.querySelector('.q-del').onclick=()=>{q.splice(i,1);saveCurrent();renderBuilder()};
      card.querySelector('.q-dup').onclick=()=>{q.splice(i+1,0,{...JSON.parse(JSON.stringify(q[i])),id:'q'+Date.now()});saveCurrent();renderBuilder()};
      card.querySelector('.q-up').onclick=()=>{if(i>0){[q[i-1],q[i]]=[q[i],q[i-1]];saveCurrent();renderBuilder()}};
      card.querySelector('.q-down').onclick=()=>{if(i<q.length-1){[q[i+1],q[i]]=[q[i],q[i+1]];saveCurrent();renderBuilder()}}
    })
  }
  document.getElementById('newSurveyBtn').onclick=()=>{const name=prompt('Survey name','New survey');if(!name)return;const s={id:'survey-'+Date.now(),name,status:'Draft',questions:cpSurveyDefaults(),created:new Date().toISOString()};lib.push(s);cpSaveSurveyLibrary(lib);renderLibrary()};
  document.getElementById('backToSurveyLibrary').onclick=()=>{saveCurrent();editorView.style.display='none';libraryView.style.display='block';renderLibrary()};
  document.getElementById('saveSurveyBtn').onclick=()=>{saveCurrent();current.status='Published';cpSaveSurveyLibrary(lib);const b=document.getElementById('saveSurveyBtn');b.textContent='Saved';setTimeout(()=>b.textContent='Save survey',800)};
  document.querySelectorAll('[data-add-q]').forEach(b=>b.onclick=()=>{const t=b.dataset.addQ,labels={text:'Your question',single:'Choose one option',multi:'Choose any that apply',yesno:'Yes or no?',rating:'How would you rate this?',postcode:'What is your postcode?',phone:'What is your phone number?'};q.push({id:'q'+Date.now(),type:t,label:labels[t],enabled:true,options:['Option 1','Option 2','Option 3']});saveCurrent();renderBuilder()});
  document.querySelectorAll('.survey-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.survey-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.survey-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab==='questions'?'surveyQuestionsPanel':'surveyResultsPanel').classList.add('active')});
  renderLibrary()
})();


/* =========================================================
   STAGE 1 UI — all libraries/readouts use CP shared store
   ========================================================= */
(function cpDashboard(){
  if(!document.getElementById('dashSupporters'))return;
  const d=CP.db(), campaigns=Object.values(d.campaigns), surveys=Object.values(d.surveys), people=Object.values(d.people), graphics=Object.values(d.graphics);
  document.getElementById('dashSupporters').textContent=people.length;
  document.getElementById('dashCampaignBackers').textContent=campaigns.reduce((n,c)=>n+(c.supporterCount||0),0);
  document.getElementById('dashSurveyResponses').textContent=surveys.reduce((n,s)=>n+(s.responses||0),0);
  document.getElementById('dashVolunteers').textContent=people.filter(p=>p.volunteer).length;
  document.getElementById('dashCampaignList').innerHTML=campaigns.map(c=>`<div class="campaign-row"><div><strong>${c.name}</strong><small>${c.supporterCount||0} supporters · ${c.status}${c.surveyId?' · Survey linked':''}</small></div><div class="mini-actions"><a class="btn secondary small" href="campaign-overview.html?id=${c.id}">Edit</a><a class="link-arrow" href="campaigns.html">→</a></div></div>`).join('');
  const w=d.websites[d.activeWebsiteId];
  document.getElementById('dashWebsiteStatus').innerHTML=w?`<span class="status-chip published">${w.status}</span><h3>${w.domain||w.name}</h3><p class="muted">${w.surveyId?'Survey: '+(d.surveys[w.surveyId]?.name||'Assigned'):'No survey assigned'}</p><a class="btn secondary small" href="editor.html?site=joe-bloggs">Edit site</a>`:'';
  document.getElementById('dashRecentActivity').innerHTML=(d.actions||[]).slice(0,5).map(a=>`<div class="compact-activity"><div><strong>${a.text}</strong><small>${new Date(a.time).toLocaleString()}</small></div></div>`).join('');
  document.getElementById('dashSurveyList').innerHTML=surveys.map(s=>`<div class="survey-row"><div><strong>${s.name}</strong><small>${s.responses||0} responses · ${s.status}</small></div><a class="link-arrow" href="surveys.html?edit=${s.id}">→</a></div>`).join('');
  document.getElementById('dashCreativeSummary').innerHTML=`<strong style="font-size:28px">${graphics.length}</strong><p class="muted">saved graphic${graphics.length===1?'':'s'} across your campaign.</p>`;
  const nb=d.integrations?.nationbuilder;
  document.getElementById('dashIntegrationSummary').innerHTML=nb?.connected?`<span class="sync-status"><span class="dot"></span> NationBuilder connected</span><p class="muted">${nb.syncedPeople||0} people synced.</p>`:'<p class="muted">No external CRM connected.</p>';
})();

(function cpSurveyLibraryUI(){
  const grid=document.getElementById('__legacySurveyLibraryGrid');if(!grid)return;
  const libraryView=document.getElementById('surveyLibraryView'),editorView=document.getElementById('surveyEditorView');
  let currentId=null, working=[];
  function renderLibrary(){
    const d=CP.db(), surveys=Object.values(d.surveys), active=d.websites[d.activeWebsiteId];
    grid.innerHTML=surveys.map(s=>{
      const websiteSelected=active?.surveyId===s.id;
      const campaignUses=Object.values(d.campaigns).filter(c=>c.surveyId===s.id);
      return `<article class="survey-library-card"><span class="status-chip ${s.status==='Published'?'published':'draft'}">${s.status}</span><h3>${s.name}</h3><div class="survey-meta"><span>${s.questions.filter(q=>q.enabled).length} active questions</span><span>${s.responses||0} responses</span></div>${websiteSelected?'<span class="sync-badge">Used on website</span>':''}${campaignUses.length?`<p class="assignment-note">Used by: ${campaignUses.map(c=>c.name).join(', ')}</p>`:''}<div class="library-card-actions"><button class="btn small" data-edit="${s.id}">Edit</button><button class="btn secondary small" data-use="${s.id}">${websiteSelected?'Selected':'Use on website'}</button><button class="btn secondary small" data-dup="${s.id}">Duplicate</button><button class="btn secondary small" data-del="${s.id}">Delete</button></div></article>`
    }).join('');
    grid.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openSurvey(b.dataset.edit));
    grid.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{CP.assignSurvey('website',CP.db().activeWebsiteId,b.dataset.use);renderLibrary()});
    grid.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{CP.duplicate('surveys',b.dataset.dup);renderLibrary()});
    grid.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('Delete this survey?')){CP.remove('surveys',b.dataset.del);renderLibrary()}})
  }
  function openSurvey(id){
    const s=CP.get('surveys',id);if(!s)return;
    currentId=id;working=JSON.parse(JSON.stringify(s.questions||[]));
    libraryView.style.display='none';editorView.style.display='block';
    document.getElementById('surveyEditorName').textContent=s.name;
    renderBuilder()
  }
  function previewQ(x){
    if(x.type==='text')return `<div class="preview-question"><label>${x.label}</label><textarea></textarea></div>`;
    if(x.type==='single')return `<div class="preview-question"><label>${x.label}</label><select><option>Select</option>${(x.options||[]).map(o=>`<option>${o}</option>`).join('')}</select></div>`;
    if(x.type==='multi')return `<div class="preview-question"><label>${x.label}</label>${(x.options||[]).map(o=>`<label><input type="checkbox"> ${o}</label>`).join('')}</div>`;
    if(x.type==='yesno')return `<div class="preview-question"><label>${x.label}</label><div class="yesno"><span>Yes</span><span>No</span></div></div>`;
    if(x.type==='rating')return `<div class="preview-question"><label>${x.label}</label><div class="rating-row">${[1,2,3,4,5].map(n=>`<span>${n}</span>`).join('')}</div></div>`;
    return `<div class="preview-question"><label>${x.label}</label><input></div>`;
  }
  function persist(){CP.patch('surveys',currentId,{questions:working})}
  function renderBuilder(){
    const builder=document.getElementById('questionBuilder'),preview=document.getElementById('surveyBuilderPreview');
    builder.innerHTML=working.map((q,i)=>`<div class="question-card" data-i="${i}"><div class="question-card-head"><div><span class="question-type">${q.type}</span><strong style="display:block">${q.label}</strong></div><div class="question-controls"><button class="up">↑</button><button class="down">↓</button><button class="dup">Duplicate</button><button class="del">Remove</button></div></div><div class="question-grid"><label class="field"><span>Question</span><input class="label" value="${q.label.replace(/"/g,'&quot;')}"></label><label class="question-visibility"><input class="enabled" type="checkbox" ${q.enabled?'checked':''}> Show on website</label></div>${['single','multi'].includes(q.type)?`<label class="field question-options"><span>Options — one per line</span><textarea class="options">${(q.options||[]).join('\n')}</textarea></label>`:''}</div>`).join('');
    preview.innerHTML=working.filter(q=>q.enabled).map(previewQ).join('')||'<p class="muted">No questions enabled.</p>';
    builder.querySelectorAll('.question-card').forEach(card=>{
      const i=+card.dataset.i;
      card.querySelector('.label').onchange=e=>{working[i].label=e.target.value;persist();renderBuilder()};
      card.querySelector('.enabled').onchange=e=>{working[i].enabled=e.target.checked;persist();renderBuilder()};
      const opt=card.querySelector('.options');if(opt)opt.onchange=e=>{working[i].options=e.target.value.split('\n').map(x=>x.trim()).filter(Boolean);persist();renderBuilder()};
      card.querySelector('.del').onclick=()=>{working.splice(i,1);persist();renderBuilder()};
      card.querySelector('.dup').onclick=()=>{working.splice(i+1,0,{...JSON.parse(JSON.stringify(working[i])),id:CP.uid('q')});persist();renderBuilder()};
      card.querySelector('.up').onclick=()=>{if(i>0){[working[i-1],working[i]]=[working[i],working[i-1]];persist();renderBuilder()}};
      card.querySelector('.down').onclick=()=>{if(i<working.length-1){[working[i+1],working[i]]=[working[i],working[i+1]];persist();renderBuilder()}}
    })
  }
  document.getElementById('newSurveyBtn').onclick=()=>{const name=prompt('Survey name','New survey');if(!name)return;const s=CP.createSurvey(name);renderLibrary();openSurvey(s.id)};
  document.getElementById('backToSurveyLibrary').onclick=()=>{editorView.style.display='none';libraryView.style.display='block';renderLibrary()};
  document.getElementById('saveSurveyBtn').onclick=()=>{CP.patch('surveys',currentId,{questions:working,status:'Published'});const b=document.getElementById('saveSurveyBtn');b.textContent='Saved';setTimeout(()=>b.textContent='Save survey',800)};
  document.getElementById('duplicateSurveyBtn').onclick=()=>{const copy=CP.duplicate('surveys',currentId);editorView.style.display='none';libraryView.style.display='block';renderLibrary();if(copy)setTimeout(()=>openSurvey(copy.id),50)};
  document.querySelectorAll('[data-add-q]').forEach(b=>b.onclick=()=>{const type=b.dataset.addQ,labels={text:'Your question',single:'Choose one option',multi:'Choose any that apply',yesno:'Yes or no?',rating:'How would you rate this?',postcode:'What is your postcode?',phone:'What is your phone number?'};working.push({id:CP.uid('q'),type,label:labels[type],enabled:true,options:['Option 1','Option 2','Option 3']});persist();renderBuilder()});
  document.querySelectorAll('.survey-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.survey-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.survey-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.tab==='questions'?'surveyQuestionsPanel':'surveyResultsPanel').classList.add('active');if(b.dataset.tab==='results'){const s=CP.get('surveys',currentId);document.getElementById('surveyResultsSummary').innerHTML=`<div class="kpi-grid"><div class="card kpi"><strong>${s.responses||0}</strong><span>Responses</span></div></div>`}});
  renderLibrary();
  const editParam=new URLSearchParams(location.search).get('edit');if(editParam)setTimeout(()=>openSurvey(editParam),30)
})();

(function cpCampaignLibrary(){
  const grid=document.getElementById('campaignLibraryGrid');if(!grid)return;
  function render(){
    const d=CP.db(), campaigns=Object.values(d.campaigns);
    grid.innerHTML=campaigns.map(c=>`<article class="campaign-card"><div class="campaign-preview"></div><span class="status-chip ${c.status==='Published'?'published':'draft'}">${c.status}</span><h3>${c.name}</h3><p class="muted">${c.supporterCount||0} supporters${c.surveyId?' · '+(d.surveys[c.surveyId]?.name||'Survey linked'):''}</p><div class="library-card-actions"><a class="btn small" href="campaign-overview.html?id=${c.id}">Edit</a><button class="btn secondary small" data-dup="${c.id}">Duplicate</button><button class="btn secondary small" data-del="${c.id}">Delete</button><a class="btn secondary small" href="creative-editor.html?template=campaign&campaign=${c.id}">Create graphic</a></div></article>`).join('');
    grid.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{CP.duplicate('campaigns',b.dataset.dup);render()});
    grid.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('Delete this campaign?')){CP.remove('campaigns',b.dataset.del);render()}})
  }
  document.getElementById('newCampaignBtn').onclick=()=>{const name=prompt('Campaign name','New campaign');if(!name)return;const c=CP.createCampaign(name);location.href='campaign-editor.html?id='+c.id};
  render()
})();

(function cpCreativeLibrary(){
  const grid=document.getElementById('sharedGraphicLibrary');if(!grid)return;
  const graphics=CP.list('graphics');
  grid.innerHTML=graphics.length?graphics.map(g=>`<article class="saved-graphic-card"><div class="saved-graphic-thumb">${g.preview?`<img src="${g.preview}" alt="">`:g.image?`<img src="${g.image}" alt="">`:''}</div><div class="saved-graphic-card-body"><h4>${g.title||'Campaign graphic'}</h4><small>${g.format||'square'}${g.campaignId?' · linked to campaign':''}</small><div class="library-card-actions"><a class="btn secondary small" href="creative-editor.html?template=${g.type||'announcement'}&saved=${g.id}">Edit again</a><button class="btn secondary small" data-del="${g.id}">Delete</button></div></div></article>`).join(''):'<div class="empty-state-card"><h3>No saved graphics yet</h3><p>Create a graphic and save it to keep it here.</p></div>';
  grid.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{CP.remove('graphics',b.dataset.del);location.reload()})
})();

/* Website editor: survey assignment from the shared store */
(function cpWebsiteSurveyPicker(){
  const frame=document.getElementById('visualFrame');if(!frame)return;
  const observer=new MutationObserver(()=>{
    const drawer=document.getElementById('drawerBody');if(!drawer)return;
    const title=document.getElementById('drawerTitle')?.textContent?.toLowerCase()||'';
    if(title.includes('survey') && !document.getElementById('cpSharedSurveyPicker')){
      const d=CP.db(),w=d.websites[d.activeWebsiteId],surveys=Object.values(d.surveys);
      drawer.insertAdjacentHTML('afterbegin',`<label class="field survey-picker"><span>Survey shown on website</span><select id="cpSharedSurveyPicker">${surveys.map(s=>`<option value="${s.id}" ${w?.surveyId===s.id?'selected':''}>${s.name}</option>`).join('')}</select></label><p class="muted">Manage surveys from the Surveys section.</p>`);
      document.getElementById('cpSharedSurveyPicker').onchange=e=>{CP.assignSurvey('website',d.activeWebsiteId,e.target.value);window.dispatchEvent(new Event('focus'))}
    }
  });
  const drawer=document.getElementById('drawerBody');if(drawer)observer.observe(drawer,{childList:true,subtree:true})
})();

/* Creative save -> shared store */
(function cpCreativeSave(){
  const btn=document.getElementById('creativeSaveGraphic');if(!btn)return;
  btn.addEventListener('click',()=>{
    const params=new URLSearchParams(location.search);
    const campaignId=params.get('campaign')||null;
    const type=params.get('template')||'announcement';
    const title=document.getElementById('creativeTitle')?.textContent||'Campaign graphic';
    const format=document.getElementById('creativeCanvas')?.className.split(' ').pop()||'square';
    CP.saveGraphic({campaignId,type,title,format,preview:cpCreativeSnapshot()});
  },true)
})();


/* =========================================================
   SURVEY LIBRARY + DEDICATED EDITOR
   ========================================================= */
(function surveyCardLibrary(){
  const grid=document.getElementById('surveyCardGrid'); if(!grid) return;

  function miniPreview(s){
    const enabled=(s.questions||[]).filter(q=>q.enabled).slice(0,3);
    return `<div class="survey-card-preview">${enabled.map((q,i)=>`
      <div class="survey-card-preview-line ${i? 'short':''}"></div>
      <div class="survey-card-preview-field"></div>`).join('')}</div>`;
  }

  function render(){
    const d=CP.db();
    const surveys=Object.values(d.surveys);
    const active=d.websites[d.activeWebsiteId];

    grid.innerHTML=surveys.map(s=>{
      const websiteSelected=active?.surveyId===s.id;
      const campaigns=Object.values(d.campaigns).filter(c=>c.surveyId===s.id);
      return `<article class="survey-card">
        <div class="survey-card-top">
          <span class="status-chip ${s.status==='Published'?'published':'draft'}">${s.status}</span>
          <button class="survey-card-menu" type="button">•••</button>
        </div>
        <h3>${s.name}</h3>
        <p>${(s.questions||[]).filter(q=>q.enabled).length} active questions</p>
        ${miniPreview(s)}
        <div class="survey-card-meta">
          <span>${s.responses||0} responses</span>
          ${websiteSelected?'<span class="sync-badge">Used on website</span>':''}
        </div>
        ${campaigns.length?`<p class="assignment-note">Used by ${campaigns.map(c=>c.name).join(', ')}</p>`:''}
        <div class="library-card-actions">
          <a class="btn small" href="survey-editor.html?id=${s.id}">Edit survey</a>
          <button class="btn secondary small" data-use="${s.id}">${websiteSelected?'Selected':'Use on website'}</button>
          <button class="btn secondary small" data-duplicate="${s.id}">Duplicate</button>
          <button class="btn secondary small" data-delete="${s.id}">Delete</button>
        </div>
      </article>`
    }).join('') + `
      <article class="survey-card create-card">
        <h3>Create another survey</h3>
        <p>Use a separate survey for a local issue, campaign or audience.</p>
        <button class="btn secondary" id="createAnotherSurvey" style="margin-top:18px">Create survey</button>
      </article>`;

    grid.querySelectorAll('[data-use]').forEach(btn=>btn.onclick=()=>{
      CP.assignSurvey('website',d.activeWebsiteId,btn.dataset.use);
      render();
    });
    grid.querySelectorAll('[data-duplicate]').forEach(btn=>btn.onclick=()=>{
      CP.duplicate('surveys',btn.dataset.duplicate);
      render();
    });
    grid.querySelectorAll('[data-delete]').forEach(btn=>btn.onclick=()=>{
      if(confirm('Delete this survey?')){
        CP.remove('surveys',btn.dataset.delete);
        render();
      }
    });
    document.getElementById('createAnotherSurvey').onclick=()=>{
      const name=prompt('Survey name','New survey');
      if(!name)return;
      const s=CP.createSurvey(name);
      CP.patch('surveys',s.id,{
        questions:[
          {id:CP.uid('q'),type:'single',label:'What matters most to you?',enabled:true,options:['Option 1','Option 2','Option 3']},
          {id:CP.uid('q'),type:'text',label:'Tell us more',enabled:true,options:[]},
          {id:CP.uid('q'),type:'yesno',label:'Would you like campaign updates by email?',enabled:true,options:['Yes','No']}
        ]
      });
      location.href='survey-editor.html?id='+s.id;
    };
  }
  render();
})();

(function sharedSurveyEditor(){
  const builder=document.getElementById('sharedQuestionBuilder'); if(!builder) return;
  const id=new URLSearchParams(location.search).get('id');
  let survey=CP.get('surveys',id);
  if(!survey){ location.href='surveys.html'; return; }
  let questions=JSON.parse(JSON.stringify(survey.questions||[]));
  const preview=document.getElementById('sharedSurveyPreview');
  document.getElementById('surveyEditTitle').textContent=survey.name;

  function saveChanges(extra={}){
    survey=CP.patch('surveys',id,{questions,...extra});
  }

  function escp(s){
    return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function previewQuestion(q){
    const label=`<label>${escp(q.label)}</label>`;
    if(q.type==='text') return `<div class="preview-question">${label}<textarea placeholder="Type your answer"></textarea></div>`;
    if(q.type==='single') return `<div class="preview-question">${label}<select><option value="">Select an option</option>${(q.options||[]).map(o=>`<option>${escp(o)}</option>`).join('')}</select></div>`;
    if(q.type==='multi') return `<div class="preview-question">${label}<div class="preview-choice-list">${(q.options||[]).map(o=>`<label><input type="checkbox"> ${escp(o)}</label>`).join('')}</div></div>`;
    if(q.type==='yesno') return `<div class="preview-question">${label}<div class="preview-yesno"><button type="button">Yes</button><button type="button">No</button></div></div>`;
    if(q.type==='rating') return `<div class="preview-question">${label}<div class="preview-rating">${[1,2,3,4,5].map(n=>`<button type="button">${n}</button>`).join('')}</div></div>`;
    if(q.type==='postcode') return `<div class="preview-question">${label}<input type="text" placeholder="Postcode"></div>`;
    if(q.type==='phone') return `<div class="preview-question">${label}<input type="tel" placeholder="Phone number"></div>`;
    return `<div class="preview-question">${label}<input type="text"></div>`;
  }

  function renderPreview(){
    const enabled=questions.filter(q=>q.enabled);
    preview.innerHTML=`<div class="preview-form-shell">
      ${enabled.map(previewQuestion).join('')}
      ${enabled.length?'<button class="btn preview-submit" type="button">Send my views</button>':'<p class="muted">No questions enabled.</p>'}
    </div><p class="survey-preview-note">This is the same question set the website will use when this survey is selected.</p>`;
  }

  function render(){
    builder.innerHTML=questions.map((q,i)=>`<article class="question-card" data-index="${i}">
      <div class="question-card-head">
        <div>
          <span class="question-type">${escp(q.type.replace('single','Single choice').replace('multi','Multiple choice').replace('text','Open text').replace('yesno','Yes / No'))}</span>
          <strong style="display:block;margin-top:3px">${escp(q.label)}</strong>
        </div>
        <div class="question-controls">
          <button class="q-up">↑</button><button class="q-down">↓</button><button class="q-duplicate">Duplicate</button><button class="q-delete">Remove</button>
        </div>
      </div>
      <div class="question-grid">
        <label class="field"><span>Question</span><input class="q-label" value="${escp(q.label)}"></label>
        <label class="question-visibility"><input class="q-enabled" type="checkbox" ${q.enabled?'checked':''}> Show on website</label>
      </div>
      ${['single','multi'].includes(q.type)?`<label class="field question-options"><span>Options — one per line</span><textarea class="q-options">${escp((q.options||[]).join('\n'))}</textarea></label>`:''}
    </article>`).join('');

    renderPreview();

    builder.querySelectorAll('.question-card').forEach(card=>{
      const i=+card.dataset.index;
      card.querySelector('.q-label').oninput=e=>{
        questions[i].label=e.target.value;
        saveChanges();
        renderPreview();
      };
      card.querySelector('.q-enabled').onchange=e=>{
        questions[i].enabled=e.target.checked;
        saveChanges();
        render();
      };
      const opts=card.querySelector('.q-options');
      if(opts)opts.oninput=e=>{
        questions[i].options=e.target.value.split('\n').map(x=>x.trim()).filter(Boolean);
        saveChanges();
        renderPreview();
      };
      card.querySelector('.q-delete').onclick=()=>{questions.splice(i,1);saveChanges();render()};
      card.querySelector('.q-duplicate').onclick=()=>{questions.splice(i+1,0,{...JSON.parse(JSON.stringify(questions[i])),id:CP.uid('q')});saveChanges();render()};
      card.querySelector('.q-up').onclick=()=>{if(i>0){[questions[i-1],questions[i]]=[questions[i],questions[i-1]];saveChanges();render()}};
      card.querySelector('.q-down').onclick=()=>{if(i<questions.length-1){[questions[i+1],questions[i]]=[questions[i],questions[i+1]];saveChanges();render()}};
    });
  }

  document.querySelectorAll('[data-shared-add]').forEach(btn=>btn.onclick=()=>{
    const type=btn.dataset.sharedAdd;
    const labels={text:'Your question',single:'Choose one option',multi:'Choose any that apply',yesno:'Yes or no?',rating:'How would you rate this?',postcode:'What is your postcode?',phone:'What is your phone number?'};
    questions.push({id:CP.uid('q'),type,label:labels[type],enabled:true,options:['Option 1','Option 2','Option 3']});
    saveChanges();render();
  });

  document.getElementById('surveyEditorSave').onclick=()=>{
    saveChanges({status:'Published'});
    const btn=document.getElementById('surveyEditorSave');
    btn.textContent='Saved';
    setTimeout(()=>btn.textContent='Save survey',900);
  };
  document.getElementById('surveyEditorDuplicate').onclick=()=>{
    const copy=CP.duplicate('surveys',id);
    if(copy) location.href='survey-editor.html?id='+copy.id;
  };

  document.querySelectorAll('[data-editor-tab]').forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll('[data-editor-tab]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const questionsPanel=document.getElementById('surveyEditorQuestions');
    const resultsPanel=document.getElementById('surveyEditorResults');
    const isQuestions=btn.dataset.editorTab==='questions';
    questionsPanel.classList.toggle('active',isQuestions);
    resultsPanel.classList.toggle('active',!isQuestions);
    if(!isQuestions){
      survey=CP.get('surveys',id);
      document.getElementById('sharedSurveyResults').innerHTML=`<div class="kpi-grid"><div class="card kpi"><strong>${survey.responses||0}</strong><span>Responses</span></div><div class="card kpi"><strong>${questions.filter(q=>q.enabled).length}</strong><span>Active questions</span></div></div>`;
    }
  });

  render();
})();


function cpCreativeSnapshot(){
  const art=document.getElementById('creativeArt');
  if(!art)return '';
  const canvas=document.getElementById('creativeCanvas');
  const w=canvas?.clientWidth||720, h=canvas?.clientHeight||720;
  const clone=art.cloneNode(true);
  clone.querySelectorAll('.creative-hotspot').forEach(x=>x.remove());
  const cssText=[...document.styleSheets].map(sheet=>{
    try{return [...sheet.cssRules].map(r=>r.cssText).join('\n')}catch(e){return ''}
  }).join('\n');
  const markup=new XMLSerializer().serializeToString(clone);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${cssText}</style>${markup}</div></foreignObject></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


/* SURVEY LIBRARY HARD FIX */
(function hardSurveyLibrary(){
  const grid=document.getElementById('surveyCardGrid');
  if(!grid || typeof CP==='undefined') return;

  function escv(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function render(){
    const d=CP.db();
    const surveys=Object.values(d.surveys||{});
    const active=d.websites?.[d.activeWebsiteId];

    if(!surveys.length){
      grid.innerHTML=`<article class="survey-card create-card"><h3>Create your first survey</h3><p>Build a reusable survey for your website or campaign.</p><button class="btn secondary" id="createFirstSurvey" style="margin-top:18px">Create survey</button></article>`;
      document.getElementById('createFirstSurvey').onclick=createSurvey;
      return;
    }

    grid.innerHTML=surveys.map(s=>{
      const websiteSelected=active?.surveyId===s.id;
      const campaigns=Object.values(d.campaigns||{}).filter(c=>c.surveyId===s.id);
      const enabled=(s.questions||[]).filter(q=>q.enabled);
      return `<article class="survey-card">
        <div class="survey-card-top">
          <span class="status-chip ${s.status==='Published'?'published':'draft'}">${escv(s.status||'Draft')}</span>
          <button class="survey-card-menu" type="button">•••</button>
        </div>
        <h3>${escv(s.name)}</h3>
        <p>${enabled.length} active question${enabled.length===1?'':'s'}</p>
        <div class="survey-card-preview">
          ${enabled.slice(0,3).map((q,i)=>`<div class="survey-card-preview-line ${i?'short':''}"></div><div class="survey-card-preview-field"></div>`).join('')}
        </div>
        <div class="survey-card-meta">
          <span>${s.responses||0} responses</span>
          ${websiteSelected?'<span class="sync-badge">Used on website</span>':''}
        </div>
        ${campaigns.length?`<p class="assignment-note">Used by ${campaigns.map(c=>escv(c.name)).join(', ')}</p>`:''}
        <div class="library-card-actions">
          <a class="btn small" href="survey-editor.html?id=${encodeURIComponent(s.id)}">Edit survey</a>
          <button class="btn secondary small" data-use-survey="${escv(s.id)}">${websiteSelected?'Selected':'Use on website'}</button>
          <button class="btn secondary small" data-duplicate-survey="${escv(s.id)}">Duplicate</button>
          <button class="btn secondary small" data-delete-survey="${escv(s.id)}">Delete</button>
        </div>
      </article>`;
    }).join('')+`
      <article class="survey-card create-card">
        <h3>Create another survey</h3>
        <p>Use a different survey for a local issue, campaign or audience.</p>
        <button class="btn secondary" id="createAnotherSurvey" style="margin-top:18px">Create survey</button>
      </article>`;

    grid.querySelectorAll('[data-use-survey]').forEach(b=>b.onclick=()=>{CP.assignSurvey('website',d.activeWebsiteId,b.dataset.useSurvey);render()});
    grid.querySelectorAll('[data-duplicate-survey]').forEach(b=>b.onclick=()=>{CP.duplicate('surveys',b.dataset.duplicateSurvey);render()});
    grid.querySelectorAll('[data-delete-survey]').forEach(b=>b.onclick=()=>{if(confirm('Delete this survey?')){CP.remove('surveys',b.dataset.deleteSurvey);render()}});
    document.getElementById('createAnotherSurvey').onclick=createSurvey;
  }

  function createSurvey(){
    const name=prompt('Survey name','New survey');
    if(!name)return;
    const s=CP.createSurvey(name);
    CP.patch('surveys',s.id,{questions:[
      {id:CP.uid('q'),type:'single',label:'What matters most to you?',enabled:true,options:['Option 1','Option 2','Option 3']},
      {id:CP.uid('q'),type:'text',label:'Tell us more',enabled:true,options:[]},
      {id:CP.uid('q'),type:'yesno',label:'Would you like campaign updates by email?',enabled:true,options:['Yes','No']}
    ]});
    location.href='survey-editor.html?id='+encodeURIComponent(s.id);
  }

  render();
})();


/* CAMPAIGN MICROSITE VISUAL EDITOR */
(function campaignVisualEditor(){
  const frame=document.getElementById('campaignFrame');
  if(!frame || typeof CP==='undefined') return;

  const id=new URLSearchParams(location.search).get('id');
  let campaign=CP.get('campaigns',id);
  if(!campaign){location.href='campaigns.html';return}

  const d=()=>CP.db();
  const workspace=document.getElementById('campaignWorkspace');
  const drawer=document.getElementById('campaignDrawer');
  const body=document.getElementById('campaignDrawerBody');
  const title=document.getElementById('campaignDrawerTitle');
  const overlay=document.getElementById('campaignOverlay');

  document.getElementById('campaignEditorName').textContent=campaign.name;
  document.getElementById('campaignEditorStatus').textContent=campaign.status;
  document.getElementById('campaignEditorStatus').className='status-chip '+(campaign.status==='Published'?'published':'draft');

  function escv(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function pageHTML(){
    const survey=campaign.surveyId?d().surveys[campaign.surveyId]:null;
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
    *{box-sizing:border-box}body{margin:0;font-family:"Proxima Nova","Avenir Next",Arial,sans-serif;color:#08254a}.container{width:min(960px,calc(100% - 40px));margin:auto}
    .hero{background:#08254a;color:#fff;padding:82px 0}.hero h1{font-size:76px;line-height:.92;letter-spacing:-.04em;margin:0 0 18px}.hero p{font-size:20px;max-width:720px}
    .image{height:420px;background:#bccbd9 center/cover no-repeat}.points{padding:56px 0;background:#f3f7fb}.point-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.point{background:#fff;border:1px solid #dbe4ee;padding:20px;font-weight:900}
    .signup{padding:56px 0}.signup-box{border:1px solid #dbe4ee;padding:24px;max-width:680px}.signup-box input,.signup-box select{width:100%;padding:12px;border:1px solid #ccd7e3;margin:5px 0}.btn{border:0;background:#1476d4;color:#fff;padding:14px 18px;font-weight:900}.imprint{background:#061a34;color:#fff;padding:28px 0;font-size:12px}
    @media(max-width:700px){.hero h1{font-size:52px}.point-grid{grid-template-columns:1fr}}
    </style></head><body>
    <section class="hero" data-campaign-section="hero"><div class="container"><h1>${escv(campaign.headline)}</h1><p>${escv(campaign.support||'')}</p></div></section>
    <section class="image" data-campaign-section="image" style="${campaign.image?`background-image:url('${campaign.image}')`:''}"></section>
    <section class="points" data-campaign-section="points"><div class="container"><div class="point-grid">${(campaign.points||[]).slice(0,3).map(p=>`<div class="point">${escv(p)}</div>`).join('')}</div></div></section>
    <section class="signup" data-campaign-section="signup"><div class="container"><div class="signup-box"><h2>${survey?escv(survey.name):'Back this campaign'}</h2><input placeholder="First name"><input placeholder="Last name"><input placeholder="Email"><input placeholder="Postcode">${survey?`<p>${(survey.questions||[]).filter(q=>q.enabled).length} survey questions linked</p>`:''}<button class="btn">Back the campaign</button></div></div></section>
    <footer class="imprint" data-campaign-section="imprint"><div class="container">Promoted by Joe Bloggs, Bloggs Ward.</div></footer>
    </body></html>`;
  }

  function render(){
    const doc=frame.contentDocument;
    doc.open();doc.write(pageHTML());doc.close();
    setTimeout(buildHotspots,60)
  }

  function buildHotspots(){
    overlay.innerHTML='';
    const doc=frame.contentDocument;
    const labels={hero:'Hero',image:'Image',points:'Three key points',signup:'Signup',imprint:'Imprint'};
    [...doc.querySelectorAll('[data-campaign-section]')].forEach(node=>{
      const type=node.dataset.campaignSection,r=node.getBoundingClientRect();
      const h=document.createElement('div');
      h.className='edit-hotspot';
      h.style.left=r.left+'px';h.style.top=r.top+'px';h.style.width=r.width+'px';h.style.height=r.height+'px';
      h.innerHTML=`<span class="edit-badge">Edit ${labels[type]}</span>`;
      h.onclick=()=>openDrawer(type);
      overlay.appendChild(h)
    });
    const height=Math.max(doc.body.scrollHeight,doc.documentElement.scrollHeight);
    frame.style.height=height+'px';overlay.style.height=height+'px'
  }

  function save(changes){
    campaign=CP.patch('campaigns',id,changes);
    document.getElementById('campaignAutosaveText').textContent='Saving…';
    setTimeout(()=>document.getElementById('campaignAutosaveText').textContent='Saved just now',450);
    render()
  }

  function openDrawer(type){
    workspace.classList.add('drawer-open');
    title.textContent='Edit '+({hero:'hero',image:'image',points:'three key points',signup:'signup',imprint:'imprint'}[type]);
    let html='';
    if(type==='hero') html=`<label class="field"><span>Headline</span><textarea id="cHeadline">${escv(campaign.headline)}</textarea></label><label class="field"><span>Supporting copy</span><textarea id="cSupport">${escv(campaign.support||'')}</textarea></label>`;
    if(type==='image') html=`<label class="field"><span>Campaign image</span><input id="cImage" type="file" accept="image/*"></label>`;
    if(type==='points') html=(campaign.points||[]).slice(0,3).map((p,i)=>`<label class="field"><span>Key point ${i+1}</span><textarea class="cPoint" data-i="${i}">${escv(p)}</textarea></label>`).join('');
    if(type==='signup'){
      const surveys=Object.values(d().surveys||{});
      html=`<label class="field"><span>Linked survey</span><select id="cSurvey"><option value="">No survey</option>${surveys.map(s=>`<option value="${s.id}" ${campaign.surveyId===s.id?'selected':''}>${escv(s.name)}</option>`).join('')}</select></label><p class="muted">The signup box can use any survey created in Surveys.</p>`;
    }
    if(type==='imprint') html=`<p class="muted">Imprint inherits the campaign account details in this prototype.</p>`;
    body.innerHTML=html;

    const headline=document.getElementById('cHeadline'); if(headline)headline.oninput=()=>save({headline:headline.value,support:document.getElementById('cSupport').value});
    const support=document.getElementById('cSupport'); if(support)support.oninput=()=>save({headline:document.getElementById('cHeadline').value,support:support.value});
    document.querySelectorAll('.cPoint').forEach(el=>el.oninput=()=>{const pts=[...(campaign.points||[])];pts[+el.dataset.i]=el.value;save({points:pts})});
    const survey=document.getElementById('cSurvey'); if(survey)survey.onchange=()=>save({surveyId:survey.value||null});
    const image=document.getElementById('cImage'); if(image)image.onchange=()=>{const f=image.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>save({image:r.result});r.readAsDataURL(f)}
  }

  document.getElementById('campaignDrawerClose').onclick=()=>workspace.classList.remove('drawer-open');
  document.getElementById('campaignPublishBtn').onclick=()=>{campaign=CP.patch('campaigns',id,{status:'Published'});document.getElementById('campaignEditorStatus').textContent='Published';document.getElementById('campaignEditorStatus').className='status-chip published'};
  document.getElementById('campaignPreviewBtn').onclick=()=>window.open('campaign-editor.html?id='+encodeURIComponent(id),'_blank');

  render()
})();


/* PRODUCT COHERENCE HELPERS */
CP.archive=function(type,id){return CP.patch(type,id,{status:'Archived'})};
CP.restore=function(type,id){return CP.patch(type,id,{status:'Draft'})};
CP.relationships=function(type,id){
  const d=CP.db();
  if(type==='campaign'){
    const c=d.campaigns[id];
    return {
      website:c?.websiteId?d.websites[c.websiteId]:null,
      survey:c?.surveyId?d.surveys[c.surveyId]:null,
      graphics:Object.values(d.graphics||{}).filter(g=>g.campaignId===id),
      supporters:Object.values(d.people||{}).filter(p=>(d.actions||[]).some(a=>a.personId===p.id&&a.campaignId===id))
    }
  }
  if(type==='survey'){
    const s=d.surveys[id];
    return {
      website:Object.values(d.websites||{}).find(w=>w.surveyId===id)||null,
      campaigns:Object.values(d.campaigns||{}).filter(c=>c.surveyId===id)
    }
  }
  if(type==='graphic'){
    const g=d.graphics[id];
    return {
      website:g?.websiteId?d.websites[g.websiteId]:null,
      campaign:g?.campaignId?d.campaigns[g.campaignId]:null
    }
  }
  return {}
};


/* GLOBAL UNDO */
(function globalUndo(){
  if(document.getElementById('globalUndo'))return;
  const el=document.createElement('div');el.className='undo-global';el.id='globalUndo';el.innerHTML='<span id="globalUndoText">Change made</span><button id="globalUndoBtn">Undo</button>';document.body.appendChild(el);
  let undo=null;
  window.CPUndo=(label,fn)=>{undo=fn;document.getElementById('globalUndoText').textContent=label;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),4500)};
  document.getElementById('globalUndoBtn').onclick=()=>{if(undo)undo();undo=null;el.classList.remove('show')}
})();

/* CAMPAIGN OVERVIEW */
(function campaignOverview(){
  const root=document.getElementById('campaignOverviewRoot');if(!root)return;
  const id=new URLSearchParams(location.search).get('id');const c=CP.get('campaigns',id);if(!c){root.innerHTML='<div class="empty-state-card"><h3>Campaign not found</h3></div>';return}
  const rel=CP.relationships('campaign',id);
  const d=CP.db();
  root.innerHTML=`<div class="campaign-overview-head"><div><span class="status-chip ${c.status==='Published'?'published':c.status==='Archived'?'archived':'draft'}">${c.status}</span><h2 style="margin:9px 0 5px">${c.name}</h2><p class="muted">${c.support||''}</p></div><div class="campaign-overview-actions"><a class="btn small" href="campaign-overview.html?id=${c.id}">Edit microsite</a>${rel.survey?`<a class="btn secondary small" href="survey-editor.html?id=${rel.survey.id}">Open survey</a>`:''}<a class="btn secondary small" href="creative-editor.html?template=campaign&campaign=${c.id}">Create graphic</a></div></div>
  <div class="campaign-stat-grid"><div class="campaign-stat"><strong>${c.supporterCount||0}</strong><span>Supporters</span></div><div class="campaign-stat"><strong>${rel.survey?.responses||0}</strong><span>Survey responses</span></div><div class="campaign-stat"><strong>${rel.graphics.length}</strong><span>Saved graphics</span></div><div class="campaign-stat"><strong>${d.integrations?.nationbuilder?.connected?'✓':'—'}</strong><span>CRM sync</span></div></div>
  <div class="dashboard-grid"><section class="panel"><h3>Linked items</h3><div class="linked-list"><div class="linked-item"><div><strong>Website</strong><small>${rel.website?.name||'Not linked'}</small></div>${rel.website?'<a class="btn secondary small" href="editor.html">Open</a>':''}</div><div class="linked-item"><div><strong>Survey</strong><small>${rel.survey?.name||'No survey linked'}</small></div>${rel.survey?`<a class="btn secondary small" href="survey-editor.html?id=${rel.survey.id}">Open</a>`:''}</div><div class="linked-item"><div><strong>Graphics</strong><small>${rel.graphics.length} linked graphic${rel.graphics.length===1?'':'s'}</small></div><a class="btn secondary small" href="creative.html">View</a></div></div></section><section class="panel"><h3>Recent activity</h3>${(d.actions||[]).filter(a=>a.campaignId===id).slice(0,5).map(a=>`<div class="compact-activity"><strong>${a.text}</strong><small>${new Date(a.time).toLocaleString()}</small></div>`).join('')||'<div class="empty-state-card compact"><p>No campaign activity yet.</p></div>'}</section></div>`;
})();

/* GUIDED CREATE */
(function guidedCreate(){
  const flow=document.querySelector('[data-create-kind]');if(!flow)return;
  const kind=flow.dataset.createKind,steps=[...flow.querySelectorAll('.create-step')],bars=[...flow.querySelectorAll('.create-progress span')];
  const websiteSel=document.getElementById('createWebsite'),surveySel=document.getElementById('createSurvey');
  Object.values(CP.db().websites).forEach(w=>websiteSel.insertAdjacentHTML('beforeend',`<option value="${w.id}">${w.name} — ${w.area}</option>`));
  if(surveySel){surveySel.innerHTML='<option value="">No survey</option>'+Object.values(CP.db().surveys).map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}
  function show(n){steps.forEach((s,i)=>s.classList.toggle('active',i===n-1));bars.forEach((b,i)=>b.classList.toggle('done',i<n))}
  document.getElementById('createNext1').onclick=()=>{if(!document.getElementById('createName').value.trim())return;show(2)};
  document.getElementById('createBack2').onclick=()=>show(1);
  document.getElementById('createNext2').onclick=()=>{document.getElementById('createSummary').textContent=`${document.getElementById('createName').value} will be linked to ${websiteSel.options[websiteSel.selectedIndex].text}.`;show(3)};
  document.getElementById('createBack3').onclick=()=>show(2);
  document.getElementById('createConfirm').onclick=()=>{
    const name=document.getElementById('createName').value.trim();
    if(kind==='campaign'){const c=CP.createCampaign(name);CP.patch('campaigns',c.id,{websiteId:websiteSel.value,surveyId:surveySel.value||null});location.href='campaign-overview.html?id='+c.id}
    else {const s=CP.createSurvey(name);CP.patch('surveys',s.id,{websiteId:websiteSel.value});location.href='survey-editor.html?id='+s.id}
  }
})();

/* Redirect old prompt buttons to guided flows */
const oldCampaignNew=document.getElementById('newCampaignBtn');if(oldCampaignNew)oldCampaignNew.onclick=()=>location.href='campaign-create.html';
document.querySelectorAll('#createAnotherSurvey,#createFirstSurvey').forEach(b=>b.onclick=()=>location.href='survey-create.html');

/* CONSISTENT AUTOSAVE INDICATOR */
(function autosavePattern(){
  ['campaignAutosaveText','autosaveText'].forEach(id=>{
    const e=document.getElementById(id);if(e)e.closest('.autosave-indicator,.autosave-pill')?.classList.remove('saving')
  })
})();

/* LIGHTWEIGHT ERROR STATES */
window.addEventListener('error',e=>{
  const app=document.querySelector('.app-content');if(!app||document.getElementById('runtimeErrorBanner'))return;
  const b=document.createElement('div');b.id='runtimeErrorBanner';b.className='state-banner error';b.textContent='Something on this page did not load correctly. Your saved data has not been removed.';app.prepend(b)
});


/* STAGE 1 HARDENING DATA HELPERS */
CP.history=function(type,id){
  const d=CP.db();
  d.history=d.history||{};
  const key=type+':'+id;
  return d.history[key]||[];
};
CP.snapshot=function(type,id,label='Published'){
  const d=CP.db();
  d.history=d.history||{};
  const key=type+':'+id;
  d.history[key]=d.history[key]||[];
  const item=d[type]?.[id];
  if(!item)return null;
  d.history[key].unshift({id:CP.uid('version'),label,time:new Date().toISOString(),data:JSON.parse(JSON.stringify(item))});
  d.history[key]=d.history[key].slice(0,12);
  CP.save(d);
  return d.history[key][0]
};
CP.restoreVersion=function(type,id,versionId){
  const d=CP.db(),key=type+':'+id;
  const v=(d.history?.[key]||[]).find(x=>x.id===versionId);
  if(!v||!d[type]?.[id])return null;
  d[type][id]={...JSON.parse(JSON.stringify(v.data)),id,updatedAt:new Date().toISOString()};
  CP.save(d);return d[type][id]
};
CP.softDelete=function(type,id){
  const item=CP.get(type,id);if(!item)return null;
  const backup=JSON.parse(JSON.stringify(item));
  CP.remove(type,id);
  return backup
};
CP.createWebsite=function(name,area=''){
  const d=CP.db(),id=CP.uid('site');
  const item={id,name,area,type:'Councillor Lite',status:'Draft',domain:'',surveyId:null,branding:{primary:'#08254a',secondary:'#1476d4',text:'#ffffff'},updatedAt:new Date().toISOString()};
  d.websites[id]=item;d.activeWebsiteId=id;CP.save(d);return item
};
CP.switchWebsite=function(id){CP.setActiveWebsite(id);localStorage.setItem('cpCurrentSiteShared',id)};


/* WEBSITE LIBRARY */
(function websiteLibraryShared(){
  const grid=document.getElementById('sharedWebsiteGrid');if(!grid)return;
  function render(){
    const d=CP.db(),items=Object.values(d.websites||{});
    if(!items.length){
      grid.innerHTML='<div class="empty-state-card library-empty"><h3>No websites yet</h3><p>Create your first campaign website to get started.</p><a class="btn" href="website-create.html">Create website</a></div>';return;
    }
    grid.innerHTML=items.map(w=>`<article class="site-card">
      <div style="display:flex;justify-content:space-between;gap:10px"><span class="status-chip ${w.status==='Published'?'published':w.status==='Archived'?'archived':'draft'}">${w.status}</span><div class="entity-menu-wrap"><button class="entity-menu-btn" data-menu-button="${w.id}">•••</button><div class="entity-menu" data-menu="${w.id}"><button data-duplicate-website="${w.id}">Duplicate</button><button data-archive-website="${w.id}">${w.status==='Archived'?'Restore':'Archive'}</button><button data-delete-website="${w.id}">Delete</button></div></div></div>
      <h3>${w.name}</h3><p class="muted">${w.area} · ${w.type||'Website'}</p><p class="muted">${w.domain||'No custom domain'}</p>
      <div class="library-card-actions"><a class="btn small" href="website-overview.html?id=${w.id}">Overview</a><a class="btn secondary small" href="editor.html?site=${encodeURIComponent(w.id)}">Edit</a><button class="btn secondary small" data-switch-website="${w.id}">${d.activeWebsiteId===w.id?'Current':'Switch to'}</button></div>
    </article>`).join('')+`<article class="site-card create-card"><h3>Create another website</h3><p>Use the same account for another ward, candidate or campaign.</p><a class="btn secondary" href="website-create.html">Create website</a></article>`;
    bindMenus();
    grid.querySelectorAll('[data-switch-website]').forEach(b=>b.onclick=()=>{CP.switchWebsite(b.dataset.switchWebsite);render()});
    grid.querySelectorAll('[data-duplicate-website]').forEach(b=>b.onclick=()=>{CP.duplicate('websites',b.dataset.duplicateWebsite);render()});
    grid.querySelectorAll('[data-archive-website]').forEach(b=>b.onclick=()=>{const w=CP.get('websites',b.dataset.archiveWebsite);w.status==='Archived'?CP.restore('websites',w.id):CP.archive('websites',w.id);render()});
    grid.querySelectorAll('[data-delete-website]').forEach(b=>b.onclick=()=>{const id=b.dataset.deleteWebsite,w=CP.get('websites',id);if(!confirm(`Delete ${w.name}?`))return;const backup=CP.softDelete('websites',id);CPUndo('Website deleted',()=>{CP.put('websites',backup);render()});render()})
  }
  function bindMenus(){
    grid.querySelectorAll('[data-menu-button]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();grid.querySelectorAll('.entity-menu').forEach(m=>m.classList.remove('open'));grid.querySelector(`[data-menu="${btn.dataset.menuButton}"]`)?.classList.toggle('open')});
  }
  document.addEventListener('click',()=>grid.querySelectorAll('.entity-menu').forEach(m=>m.classList.remove('open')));
  render()
})();

/* WEBSITE CREATE */
(function websiteCreateFlow(){
  const flow=document.getElementById('websiteCreateFlow');if(!flow)return;
  const steps=[...flow.querySelectorAll('.create-step')],bars=[...flow.querySelectorAll('.create-progress span')],survey=document.getElementById('wcSurvey');
  Object.values(CP.db().surveys||{}).forEach(s=>survey.insertAdjacentHTML('beforeend',`<option value="${s.id}">${s.name}</option>`));
  const show=n=>{steps.forEach((s,i)=>s.classList.toggle('active',i===n-1));bars.forEach((b,i)=>b.classList.toggle('done',i<n))};
  document.getElementById('wcNext1').onclick=()=>{if(!document.getElementById('wcName').value.trim())return;show(2)};
  document.getElementById('wcBack2').onclick=()=>show(1);
  document.getElementById('wcNext2').onclick=()=>{document.getElementById('wcSummary').textContent=`Create ${document.getElementById('wcName').value} for ${document.getElementById('wcArea').value||'this area'}.`;show(3)};
  document.getElementById('wcBack3').onclick=()=>show(2);
  document.getElementById('wcCreate').onclick=()=>{const w=CP.createWebsite(document.getElementById('wcName').value.trim(),document.getElementById('wcArea').value.trim());if(survey.value)CP.assignSurvey('website',w.id,survey.value);location.href='website-overview.html?id='+w.id}
})();

/* WEBSITE OVERVIEW */
(function websiteOverview(){
  const root=document.getElementById('websiteOverviewRoot');if(!root)return;
  const d=CP.db(),id=new URLSearchParams(location.search).get('id')||d.activeWebsiteId,w=d.websites[id];
  if(!w){root.innerHTML='<div class="empty-state-card"><h3>Website not found</h3></div>';return}
  const campaigns=Object.values(d.campaigns||{}).filter(c=>c.websiteId===id),graphics=Object.values(d.graphics||{}).filter(g=>g.websiteId===id),survey=w.surveyId?d.surveys[w.surveyId]:null,hist=CP.history('websites',id);
  root.innerHTML=`<div class="overview-head"><div><span class="status-chip ${w.status==='Published'?'published':w.status==='Archived'?'archived':'draft'}">${w.status}</span><h2 style="margin:9px 0 5px">${w.name}</h2><p class="muted">${w.area} · ${w.domain||'No custom domain'}</p></div><div class="overview-actions"><a class="btn small" href="editor.html?site=${encodeURIComponent(w.id)}">Edit website</a><button class="btn secondary small" id="websitePublish">${w.status==='Published'?'Publish changes':'Publish'}</button></div></div>
  <div class="overview-stat-grid"><div class="overview-stat"><strong>${campaigns.length}</strong><span>Campaigns</span></div><div class="overview-stat"><strong>${survey?.responses||0}</strong><span>Survey responses</span></div><div class="overview-stat"><strong>${graphics.length}</strong><span>Graphics</span></div><div class="overview-stat"><strong>${d.integrations?.nationbuilder?.connected?'✓':'—'}</strong><span>CRM sync</span></div></div>
  <div class="overview-grid"><section class="panel"><h3>Linked content</h3><div class="overview-list"><div class="overview-item"><div><strong>Survey</strong><small>${survey?.name||'No survey assigned'}</small></div>${survey?`<a class="btn secondary small" href="survey-overview.html?id=${survey.id}">Open</a>`:''}</div>${campaigns.map(c=>`<div class="overview-item"><div><strong>${c.name}</strong><small>Campaign · ${c.status}</small></div><a class="btn secondary small" href="campaign-overview.html?id=${c.id}">Open</a></div>`).join('')||'<div class="empty-state-card compact"><p>No campaigns linked yet.</p></div>'}</div></section><section class="panel"><h3>Publish history</h3><div class="publish-history" id="websitePublishHistory">${hist.length?hist.map(v=>`<div class="publish-version"><div><strong>${v.label}</strong><small>${new Date(v.time).toLocaleString()}</small></div><button class="btn secondary small" data-restore-web="${v.id}">Restore</button></div>`).join(''):'<div class="empty-state-card compact"><p>No previous published versions yet.</p></div>'}</div></section></div>`;
  document.getElementById('websitePublish').onclick=()=>{CP.snapshot('websites',id,'Published version');CP.patch('websites',id,{status:'Published'});location.reload()};
  root.querySelectorAll('[data-restore-web]').forEach(b=>b.onclick=()=>{CP.restoreVersion('websites',id,b.dataset.restoreWeb);location.reload()})
})();

/* SURVEY OVERVIEW */
(function surveyOverview(){
  const root=document.getElementById('surveyOverviewRoot');if(!root)return;
  const id=new URLSearchParams(location.search).get('id'),s=CP.get('surveys',id);if(!s){root.innerHTML='<div class="empty-state-card"><h3>Survey not found</h3></div>';return}
  const d=CP.db(),rel=CP.relationships('survey',id),actions=(d.actions||[]).filter(a=>a.surveyId===id),hist=CP.history('surveys',id);
  root.innerHTML=`<div class="overview-head"><div><span class="status-chip ${s.status==='Published'?'published':'draft'}">${s.status}</span><h2 style="margin:9px 0 5px">${s.name}</h2><p class="muted">${(s.questions||[]).filter(q=>q.enabled).length} active questions</p></div><div class="overview-actions"><a class="btn small" href="survey-editor.html?id=${s.id}">Edit survey</a><button class="btn secondary small" id="surveyPublish">Publish</button></div></div>
  <div class="overview-stat-grid"><div class="overview-stat"><strong>${s.responses||0}</strong><span>Responses</span></div><div class="overview-stat"><strong>${rel.website?1:0}</strong><span>Website using it</span></div><div class="overview-stat"><strong>${rel.campaigns?.length||0}</strong><span>Campaigns using it</span></div><div class="overview-stat"><strong>${(s.questions||[]).filter(q=>q.enabled).length}</strong><span>Questions</span></div></div>
  <div class="overview-grid"><section class="panel"><h3>Used by</h3><div class="overview-list">${rel.website?`<div class="overview-item"><div><strong>${rel.website.name}</strong><small>Main website</small></div><a class="btn secondary small" href="website-overview.html?id=${rel.website.id}">Open</a></div>`:''}${(rel.campaigns||[]).map(c=>`<div class="overview-item"><div><strong>${c.name}</strong><small>Campaign</small></div><a class="btn secondary small" href="campaign-overview.html?id=${c.id}">Open</a></div>`).join('')||(!rel.website?'<div class="empty-state-card compact"><p>This survey is not assigned anywhere yet.</p></div>':'')}</div></section><section class="panel"><h3>Latest responses</h3>${actions.length?actions.slice(0,5).map(a=>`<div class="compact-activity"><strong>${a.text}</strong><small>${new Date(a.time).toLocaleString()}</small></div>`).join(''):'<div class="empty-state-card compact"><p>No responses yet.</p></div>'}</section></div>`;
  document.getElementById('surveyPublish').onclick=()=>{CP.snapshot('surveys',id,'Published version');CP.patch('surveys',id,{status:'Published'});location.reload()}
})();

/* CREATIVE OVERVIEW */
(function creativeOverview(){
  const root=document.getElementById('creativeOverviewRoot');if(!root)return;
  const id=new URLSearchParams(location.search).get('id'),g=CP.get('graphics',id);if(!g){root.innerHTML='<div class="empty-state-card"><h3>Graphic not found</h3></div>';return}
  const rel=CP.relationships('graphic',id);
  root.innerHTML=`<div class="overview-head"><div><span class="status-chip draft">Saved</span><h2 style="margin:9px 0 5px" id="graphicName">${g.title||'Campaign graphic'}</h2><p class="muted">${g.format||'square'} · ${g.type||'graphic'}</p></div><div class="overview-actions"><a class="btn small" href="creative-editor.html?template=${g.type||'announcement'}&saved=${g.id}">Edit graphic</a><button class="btn secondary small" id="renameGraphic">Rename</button><button class="btn secondary small" id="duplicateGraphic">Duplicate</button><button class="btn secondary small" id="deleteGraphic">Delete</button></div></div>
  <div class="overview-grid"><section class="panel"><h3>Preview</h3>${g.preview?`<img src="${g.preview}" style="display:block;max-width:420px;width:100%">`:'<div class="empty-state-card compact"><p>Preview unavailable for this older graphic.</p></div>'}</section><section class="panel"><h3>Linked to</h3><div class="overview-list"><div class="overview-item"><div><strong>Website</strong><small>${rel.website?.name||'Not linked'}</small></div>${rel.website?`<a class="btn secondary small" href="website-overview.html?id=${rel.website.id}">Open</a>`:''}</div><div class="overview-item"><div><strong>Campaign</strong><small>${rel.campaign?.name||'Not linked'}</small></div>${rel.campaign?`<a class="btn secondary small" href="campaign-overview.html?id=${rel.campaign.id}">Open</a>`:''}</div></div></section></div>`;
  document.getElementById('renameGraphic').onclick=()=>{const n=prompt('Graphic name',g.title||'Campaign graphic');if(n){CP.patch('graphics',id,{title:n});location.reload()}};
  document.getElementById('duplicateGraphic').onclick=()=>{const c=CP.duplicate('graphics',id);if(c)location.href='creative-overview.html?id='+c.id};
  document.getElementById('deleteGraphic').onclick=()=>{if(!confirm('Delete this graphic?'))return;const backup=CP.softDelete('graphics',id);CPUndo('Graphic deleted',()=>CP.put('graphics',backup));location.href='creative.html'}
})();

/* STANDARD LIBRARY ACTION MENUS FOR CAMPAIGNS/SURVEYS/CREATIVE */
(function libraryActionUpgrade(){
  // Campaigns
  const cg=document.getElementById('campaignLibraryGrid');
  if(cg){
    setTimeout(()=>{
      cg.querySelectorAll('.campaign-card').forEach(card=>{
        const edit=card.querySelector('a[href*="campaign-overview"]');if(!edit)return;
        const id=new URL(edit.href,location.href).searchParams.get('id');
        const wrap=document.createElement('div');wrap.className='entity-menu-wrap';wrap.innerHTML=`<button class="entity-menu-btn">•••</button><div class="entity-menu"><button data-a="dup">Duplicate</button><button data-a="archive">Archive</button><button data-a="delete">Delete</button></div>`;
        card.prepend(wrap);const menu=wrap.querySelector('.entity-menu');wrap.querySelector('button').onclick=e=>{e.stopPropagation();menu.classList.toggle('open')};
        menu.querySelector('[data-a="dup"]').onclick=()=>{CP.duplicate('campaigns',id);location.reload()};
        menu.querySelector('[data-a="archive"]').onclick=()=>{CP.archive('campaigns',id);location.reload()};
        menu.querySelector('[data-a="delete"]').onclick=()=>{if(confirm('Delete campaign?')){const backup=CP.softDelete('campaigns',id);CPUndo('Campaign deleted',()=>CP.put('campaigns',backup));location.reload()}};
      })
    },80)
  }
  // Survey cards -> overview primary
  const sg=document.getElementById('surveyCardGrid');
  if(sg)setTimeout(()=>sg.querySelectorAll('a[href*="survey-editor"]').forEach(a=>{const id=new URL(a.href,location.href).searchParams.get('id');a.href='survey-overview.html?id='+id;a.textContent='Overview'}),80);
  // Creative cards -> details primary
  const gg=document.getElementById('sharedGraphicLibrary');
  if(gg)setTimeout(()=>gg.querySelectorAll('a[href*="creative-editor"]').forEach(a=>{const saved=new URL(a.href,location.href).searchParams.get('saved');if(saved){a.href='creative-overview.html?id='+saved;a.textContent='Details'}}),80);
})();

/* STANDARD AUTOSAVE BINDING */
window.CPAutosave={
  saving(el){if(!el)return;el.classList.add('saving');const span=el.querySelector('span:last-child');if(span)span.textContent='Saving…'},
  saved(el){if(!el)return;el.classList.remove('saving');const span=el.querySelector('span:last-child');if(span)span.textContent='Saved just now'},
  pulse(el){this.saving(el);setTimeout(()=>this.saved(el),650)}
};

/* BROKEN IMAGE STATE */
document.addEventListener('error',e=>{
  if(e.target?.tagName==='IMG'){e.target.style.display='none';const p=document.createElement('div');p.className='state-banner warn';p.textContent='Image preview could not be loaded.';e.target.after(p)}
},true);

(function sharedPeopleEmpty(){
  const root=document.getElementById('peopleSharedEmpty');if(!root)return;
  if(!Object.keys(CP.db().people||{}).length)root.innerHTML='<div class="empty-state-card"><h3>No supporters yet</h3><p>Publish a website, campaign or survey and new supporter activity will appear here.</p><a class="btn" href="websites.html">Open websites</a></div>'
})();
