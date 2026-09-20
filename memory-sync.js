'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MemorySync=api;})(typeof window!=='undefined'?window:globalThis,function(){
  const cloudKey=item=>String(item?.cloudId||item?._id||'');
  const identityValues=item=>[item?.id,item?.clientId,item?.cloudId,item?._id].filter(value=>value!==undefined&&value!==null&&String(value)!=='').map(String);
  function findIndex(items,id){const key=String(id??'');return (items||[]).findIndex(item=>identityValues(item).includes(key));}
  function mergeByIdentity(items,id,patch){const index=findIndex(items,id);if(index<0)return{items:[...(items||[])],found:false,index};const next=[...items];next[index]={...next[index],...patch};return{items:next,found:true,index};}
  function match(local,remote){const cloud=cloudKey(local);return remote.find(item=>(cloud&&cloudKey(item)===cloud)||String(item.id||'')===String(local.id||'')||String(item.clientId||'')===String(local.id||''));}
  function staleLocalIds(){return []; /* Missing from a response is never proof of deletion. */}
  function reconcile(local,remote,room){const visible=(local||[]).filter(item=>!item.room||item.room===room),result=[];for(const item of visible){const server=match(item,remote||[]);if(server){result.push({...item,...server,id:item.id,blob:item.blob,room,src:item.blob?item.src:(server.src||server.url||item.src)});}else result.push(item);}for(const server of remote||[]){if(!result.some(item=>match(item,[server])))result.push({...server,remote:true,room,src:server.src||server.url});}return result;}
  return{reconcile,staleLocalIds,findIndex,mergeByIdentity};
});
