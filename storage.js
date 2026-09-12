window.MemoryStore={
  db:null,
  async open(){return new Promise((resolve,reject)=>{const r=indexedDB.open('ever-us-memories',1);r.onupgradeneeded=()=>r.result.createObjectStore('memories',{keyPath:'id'});r.onsuccess=()=>{this.db=r.result;resolve();};r.onerror=()=>reject(r.error);});},
  async all(){return new Promise((resolve,reject)=>{const r=this.db.transaction('memories').objectStore('memories').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});},
  async write(items,replace=false){return new Promise((resolve,reject)=>{const t=this.db.transaction('memories','readwrite');const s=t.objectStore('memories');if(replace)s.clear();for(const item of items)s.put(item);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('保存已中止'));});},
  async remove(id){return new Promise((resolve,reject)=>{const t=this.db.transaction('memories','readwrite');t.objectStore('memories').delete(id);t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
};
