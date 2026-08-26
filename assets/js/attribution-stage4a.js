(function(){
'use strict';
const VISITOR_KEY='cp_attribution_visitor_id';
const SESSION_KEY='cp_attribution_session_id';
const TOUCH_KEY='cp_attribution_current_touch';
const uuid=()=>crypto.randomUUID();

function getId(storage,key){
  let id=storage.getItem(key);
  if(!/^[0-9a-f-]{36}$/i.test(id||'')){id=uuid();storage.setItem(key,id)}
  return id;
}
function touch(){
  const q=new URLSearchParams(location.search);
  const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','source','fbclid','gclid','msclkid'];
  const now={};
  keys.forEach(k=>{const v=q.get(k);if(v)now[k]=v});
  if(document.referrer)now.referrer=document.referrer;
  now.landing_path=location.pathname;
  now.captured_at=new Date().toISOString();

  let saved={};
  try{saved=JSON.parse(sessionStorage.getItem(TOUCH_KEY)||'{}')}catch(_){}
  const hasCampaignParams=keys.some(k=>q.get(k));
  if(hasCampaignParams||!Object.keys(saved).length){
    saved={...saved,...now};
    sessionStorage.setItem(TOUCH_KEY,JSON.stringify(saved));
  }else{
    saved={...saved,referrer:saved.referrer||now.referrer,landing_path:saved.landing_path||now.landing_path};
  }
  return saved;
}
const visitorId=getId(localStorage,VISITOR_KEY);
const sessionId=getId(sessionStorage,SESSION_KEY);
let currentTouch=touch();
let tracked=false;

async function track(opts={}){
  if(!window.cpSupabase)return null;
  currentTouch=touch();
  const payload={
    p_session_id:sessionId,
    p_visitor_id:visitorId,
    p_website_id:opts.websiteId||null,
    p_campaign_id:opts.campaignId||null,
    p_path:location.pathname,
    p_full_url:location.href,
    p_referrer:document.referrer||null,
    p_attribution:currentTouch
  };
  const r=await window.cpSupabase.rpc('public_track_visit',payload);
  if(!r.error)tracked=true;
  return r;
}
function context(){
  return {
    visitor_id:visitorId,
    session_id:sessionId,
    attribution:{...currentTouch},
    source:currentTouch.utm_source||currentTouch.source||'direct'
  };
}
window.CPAttribution={track,context,get tracked(){return tracked}};
})();