// Website <-> club-management boundary. Classic script (works from file://).
// Today: reads window.AYC_DATA (js/data.js). Later: swap get() for fetch(`${CLUB_API_BASE}/${resource}`).
window.AYC_API=(function(){
  const CLUB_ID='ayc', CLUB_API_BASE='./api'; // future: https://api.<platform>/v1/clubs/ayc
  async function get(resource){ return (window.AYC_DATA||{})[resource]||[]; }
  async function post(resource,payload){ // placeholder: no backend yet
    const rec={id:`${resource}_${Date.now()}`,clubId:CLUB_ID,status:'requested',createdAt:new Date().toISOString(),...payload};
    try{const k=`mock:${resource}`;const all=JSON.parse(localStorage.getItem(k)||'[]');all.push(rec);localStorage.setItem(k,JSON.stringify(all));}catch(e){}
    console.info('[mock POST]',resource,rec);return rec;}
  return {CLUB_ID,CLUB_API_BASE,get,post};
})();
