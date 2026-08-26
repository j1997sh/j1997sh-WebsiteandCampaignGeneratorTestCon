(async function(){
'use strict';const sb=window.cpSupabase,grid=document.getElementById('standaloneCampaignGrid');
const {data:{session}}=await sb.auth.getSession();if(!session){location.replace('login.html?next=campaigns.html');return}
const [ar,cr]=await Promise.all([sb.from('accounts').select('name').limit(1).single(),sb.from('campaigns').select('*').order('updated_at',{ascending:false})]);
if(!ar.error){campaignAccountName.textContent=ar.data.name;campaignAccountInitials.textContent=ar.data.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}
campaignLogout.onclick=async e=>{e.preventDefault();await sb.auth.signOut();location.href='login.html'};
if(cr.error){grid.innerHTML=`<div class="state-banner error">${cr.error.message}</div>`;return}
const rows=cr.data||[];
grid.innerHTML=rows.length?rows.map(c=>`<article class="campaign-card"><span class="status-chip ${c.status==='published'?'published':'draft'}">${c.status==='published'?'Published':'Draft'}</span><h3>${c.name}</h3><p class="muted">${c.supporter_count||0} supporters${c.survey_id?' · Survey linked':''}</p><div class="library-card-actions"><a class="btn small" href="campaign-overview.html?id=${c.id}">Manage</a><a class="btn secondary small" href="campaign-editor.html?id=${c.id}">Edit microsite</a><a class="btn secondary small" href="creative-editor.html?template=campaign&campaign=${c.id}">Create graphic</a></div></article>`).join(''):`<div class="empty-state-card"><h3>No campaigns yet</h3><p>Create a standalone campaign microsite.</p><a class="btn" href="campaign-create.html">Create campaign</a></div>`;
})();
