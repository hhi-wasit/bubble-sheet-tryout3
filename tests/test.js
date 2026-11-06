require('fake-indexeddb/auto');
const assert=require('assert'),{I18N}=require('../js/i18n.js'),{DB}=require('../js/db.js');
(async()=>{
const en=Object.keys(I18N.en).sort(),ar=Object.keys(I18N.ar).sort();
assert.deepStrictEqual(en,ar,'English and Arabic keys must match');
await DB.put('exams',{id:'a',title:'T',questions:100});
assert.strictEqual((await DB.all('exams')).length,1);
const dump=await DB.dump();assert(DB.validate(dump));
await DB.del('exams','a');assert.strictEqual((await DB.all('exams')).length,0);
await DB.restore(dump);assert.strictEqual((await DB.get('exams','a')).title,'T');
assert(!DB.validate({app:'other'}));assert(!DB.validate({app:'examflow',exams:[{noid:1}]}));
await assert.rejects(()=>DB.restore({app:'examflow',exams:[{noid:1}]}));
assert.strictEqual((await DB.all('exams')).length,1,'invalid restore must change nothing');
console.log('All Stage 1 tests passed ('+en.length+' translation keys)');
})().catch(e=>{console.error(e);process.exit(1)});
