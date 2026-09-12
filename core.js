(function(root){
  const DAY=86400000;
  function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);const a=new Date(y,m-1,d);return y>=1900&&y<=2200&&a.getFullYear()===y&&a.getMonth()===m-1&&a.getDate()===d;}
  function parse(s){if(!validDate(s))throw new Error('日期格式不正确');const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);}
  function dayNumber(d){return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/DAY;}
  function daysBetween(s,now=new Date()){return dayNumber(now)-dayNumber(parse(s));}
  function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function nextOccurrence(s,annual,now=new Date()){
    const original=parse(s);let date=original;
    if(annual){let year=Math.max(now.getFullYear(),original.getFullYear());const at=y=>new Date(y,original.getMonth(),Math.min(original.getDate(),new Date(y,original.getMonth()+1,0).getDate()));date=at(year);if(dayNumber(date)<dayNumber(now))date=at(year+1);}
    const days=dayNumber(date)-dayNumber(now);return {date,days,past:days<0};
  }
  function validateBackup(b){
    const str=(s,n)=>typeof s==='string'&&s.length<=n;
    if(!b||b.version!==1||!b.settings||!Array.isArray(b.events)||!Array.isArray(b.memories))throw new Error('请选择本站导出的回忆备份');
    const s=b.settings;if(!str(s.name1,20)||!s.name1.trim()||!str(s.name2,20)||!s.name2.trim()||!validDate(s.start)||daysBetween(s.start)<0||!str(s.quote,120))throw new Error('备份中的情侣信息不完整');
    if(b.events.length>1000||b.memories.length>2000)throw new Error('备份内容过多');
    const ids=new Set();for(const e of b.events){if(!str(e.id,100)||ids.has(e.id)||!str(e.title,60)||!e.title.trim()||!validDate(e.date)||typeof e.annual!=='boolean')throw new Error('备份中的纪念日格式有误');ids.add(e.id);}
    ids.clear();for(const m of b.memories){if(!str(m.id,100)||ids.has(m.id)||!str(m.title,100)||!str(m.note,500)||!str(m.place,60)||!validDate(m.date)||!['image','video'].includes(m.kind)||typeof m.data!=='string'||!/^data:(image\/(jpeg|png|webp|gif)|video\/(mp4|webm|ogg));base64,[A-Za-z0-9+/=]+$/.test(m.data)||!m.data.startsWith('data:'+m.kind+'/'))throw new Error('备份中的照片或视频格式有误');ids.add(m.id);}
    return b;
  }
  const api={validDate,parse,daysBetween,localDate,nextOccurrence,validateBackup};if(typeof module!=='undefined')module.exports=api;else root.LoveCore=api;
})(typeof window==='undefined'?globalThis:window);
