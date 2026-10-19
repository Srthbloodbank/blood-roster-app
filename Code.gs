// เวรแพทย์ออกหน่วย - Code.gs (เวอร์ชันเพิ่มชีต "ชื่อและเบอร์โทร")
var TZ='Asia/Bangkok';
var TRV={self:'ไปเองพร้อมเบอร์โทร',er:'รอรับที่หน้า ER'};
function trvLabel_(m){return TRV[m]||''}
function trvMode_(l){return l===TRV.self?'self':l===TRV.er?'er':''}
var H={
  'แพทย์':['รหัส','ชื่อแพทย์','สตาร์'],
  'สถานที่':['เลขหน่วย','ชื่อสถานที่'],
  'ชื่อและเบอร์โทร':['เลขหน่วย','ชื่อ','เบอร์โทร','หมายเหตุ'],
  'แผน':['วันที่','เลขหน่วย','เวลา','รหัสแพทย์','รหัสเดิม','สถานที่ (อัตโนมัติ)','ชื่อแพทย์ (อัตโนมัติ)','การเดินทาง','เบอร์โทร','สถานะแผน','ประเภทหน่วย','จำนวนรถ'],
  'ตั้งค่า':['หัวข้อ','ค่า'],
  'ประวัติ':['เวลา','รายการ']
};
var SEED={
"cfg":{
"docs":[
{"code":"D01","name":"นพ.ภูริณัฐ ธีรวิศรุต","tel":"*9279"},
{"code":"D02","name":"พญ.ดวงกมล บุญสงค์","tel":"*9289"},
{"code":"D03","name":"นพ.กิตติธัช วิสาละ","tel":"*9288"},
{"code":"D04","name":"นพ.เจตนิพัทธ์ ปัญญา","tel":"*9057, *9281"},
{"code":"D05","name":"นพ.ธัชพล วรานันตกุล","tel":"*9278"},
{"code":"D06","name":"พญ.ปิ่นรดา กิ่งโพธิ์ตัน","tel":"*9062, *9284"},
{"code":"D07","name":"พญ.มนัชญา มาลารัตน์","tel":"*9061, *9285"},
{"code":"D08","name":"พญ.ทิชา สุวีรานุวัฒน์","tel":"*9254"},
{"code":"D09","name":"พญ.ณัชชา เจนกิจวัฒนาเลิศ","tel":"*9282"},
{"code":"D10","name":"พญ.พชรภา เจียรพันธุ์","tel":"*9250"},
{"code":"D11","name":"พญ.ปุญญิศา ทวี","tel":"*9066, *9249"},
{"code":"D12","name":"พญ.พชรมน วิเศษคณากุล","tel":"*9280"},
{"code":"D13","name":"นพ.น่านเจ้า กันทะมัง","tel":"*9290"},
{"code":"D14","name":"พญ.วิศรุตา แก้วหัวไทร","tel":"*9286"},
{"code":"D15","name":"พญ.กษมา บุญนำ","tel":"*9077, *9291"},
{"code":"D16","name":"นพ.ศุภชัย เชิงดี","tel":"*9251"},
{"code":"D17","name":"พญ.ศุภิสรา กรดแก้ว","tel":"*9260"},
{"code":"D18","name":"พญ.ญาณิศา สาเมือง","tel":"*9292"},
{"code":"D19","name":"นพ.กันต์ธีร์ ทองสีพราย","tel":"*9014"},
{"code":"D20","name":"พญ.ศุภสุดา ยิ่งยง","tel":"*9017"},
{"code":"D21","name":"พญ.ธนภรณ์ ชาคโรทัย","tel":"*9015"},
{"code":"D22","name":"ธันย์ชนก บรรฌราช","tel":"*9258"},
{"code":"D23","name":"นพ.ออมทรัพย์ ลีลาประเสริฐศิลป์","tel":"*9287"},
{"code":"D24","name":"ณัฐมน โงกเขา","tel":"*9253"},
{"code":"D25","name":"ธนธรณ์ วัชราวิวัฒน์","tel":"*9283"}
],
"places":[
{"n":1,"name":"ค่ายวิภาวดีรังสิต"},{"n":2,"name":"ธนาคารเลือด รพ.สุราษฎร์ธานี"},{"n":3,"name":"มหาวิทยาลัยราชภัฏสุราษฎร์ธานี"},{"n":4,"name":"กองบิน 7"},{"n":5,"name":"ค่ายวิภาวดีรังสิต(นักศึกษาวิชาทหาร)"},{"n":6,"name":"อำเภอกาญจนดิษฐ์"},{"n":7,"name":"อำเภอคีรีรัฐนิคม"},{"n":8,"name":"อำเภอเคียนซา"},{"n":9,"name":"อำเภอชัยบุรี"},{"n":10,"name":"อำเภอไชยา"},{"n":11,"name":"อำเภอดอนสัก"},{"n":12,"name":"อำเภอท่าฉาง"},{"n":13,"name":"อำเภอท่าชนะ"},{"n":14,"name":"อำเภอบ้านตาขุน"},{"n":15,"name":"อำเภอบ้านนาสาร"},{"n":16,"name":"อำเภอพนม"},{"n":17,"name":"อำเภอพุนพิน"},{"n":18,"name":"อำเภอวิภาวดี"},{"n":19,"name":"บริษัทซีพีแรม"},{"n":20,"name":"บริษัทโตโยต้า ตาปี"},{"n":21,"name":"บริษัททรงพรเจริญการเกษตรและจักรกล"},{"n":22,"name":"บริษัทบ้านดอนปิยะกลการ จำกัด(Honda BigWing)"},{"n":23,"name":"บริษัทประดิษฐ์พงศ์มอเตอร์"},{"n":24,"name":"บริษัทเพชรศรีวิชัย จำกัด"},{"n":25,"name":"บริษัทศรีตรังโกลฟส์(ประเทศไทย) จำกัด สาขาสุราษฎร์"},{"n":26,"name":"บริษัทศรีสุบรรณฟาร์ม4"},{"n":27,"name":"บริษัทศุภกิตต์มอเตอร์"},{"n":28,"name":"บริษัทสิริสินอำเภอเวียงสระ"},{"n":29,"name":"บ้านรักสุขภาพ อ.เวียงสระ"},{"n":30,"name":"มหาวิทยาลัยสงขลานครินทร์วิทยาเขตสุราษฎร์ธานี"},{"n":31,"name":"เรือนจำกลางสุราษฎร์ธานี"},{"n":32,"name":"รพ.กรุงเทพสุราษฎรธานี"},{"n":33,"name":"รพสต.บ้านกงตาก"},{"n":34,"name":"ร.ร.เทพมิตรศึกษา"},{"n":35,"name":"ร.ร.บางสวรรค์"},{"n":36,"name":"ร.ร.บ้านนาวิทยาคม+อ.บ้านนาเดิม"},{"n":37,"name":"ร.ร.พระแสงวิทยา(อ.พระแสง)"},{"n":38,"name":"ร.ร.เมืองสุราษฎร์ธานี"},{"n":39,"name":"ร.ร.สุราษฎร์ธานี"},{"n":40,"name":"รร.ไดมอนด์ พลาซ่า(คุมประพฤติ)"},{"n":41,"name":"วิทยาลัยอาชีวศึกษาสุราษฎร์ธานี"},{"n":42,"name":"ศาลจังหวัดเวียงสระ"},{"n":43,"name":"ศูนย์ฝึกอบรมตำรวจภูธรภาค 8"},{"n":44,"name":"รพสต.เฉลิมพระเกียรติควนยูง ต.ขุนทะเล"},{"n":45,"name":"สำนักงานตำรวจภูธรจังหวัดสุราษฎร์ธานี"},{"n":46,"name":"ห้างบิ๊กซีสาขาสุราษฎร์ธานี"},{"n":47,"name":"ห้างเซ็นทรัลพลาซ่า"},{"n":48,"name":"ห้างสหไทย(อ.เมืองสุราษฎร์ธานี)"},{"n":49,"name":"บริษัทสิริสินสุราษฎร์ธานี"},{"n":50,"name":"บริษัทโฮมโปรดักเซ็นเตอร์ จำกัด (มหาชน)"},{"n":51,"name":"ร.ร.ราชประชานุเคราะห์"},{"n":52,"name":"รร.สุราษฎร์ธานี2"},{"n":53,"name":"ศูนย์บริการโลหิตแห่งชาติ"},{"n":54,"name":"ภาคบริการโลหิตที่ 11"},{"n":55,"name":"รพ.กาญจนดิษฐ์"},{"n":56,"name":"เขื่อนรัชชประภา"},{"n":57,"name":"รพ.สวนสราญรมณ์"},{"n":58,"name":"วิทยาลัยการอาชีพไชยา"},{"n":59,"name":"ห้างค้าแม็คโคร"},{"n":60,"name":"รพ.มะเร็ง สุราษฎร์ธานี"},{"n":61,"name":"รพ.เกาะสมุย"},{"n":62,"name":"รร.วังใต้"},{"n":63,"name":"วิทยาลัยเทคนิคสุราษฎร์ธานี"},{"n":64,"name":"ศูนย์การค้าโคลีเซี่ยมสุราษฎร์ธานี"},{"n":65,"name":"รพ.หาดใหญ่"},{"n":66,"name":"รพ.สต.คลองสระ"},{"n":67,"name":"ศาลเยาวชน"},{"n":68,"name":"สนง.เทศบาลนครสุราษฎร์ธานี"},{"n":69,"name":"วิทยาลัยพยาบาล"}
],
"coords":[
{"n":19,"name":"กิ่ง","tel":"088-784-2259","note":"บริษัทซีพีแรม"}
],
"reserve":"D18",
"note":"หากมีการเปลี่ยนแปลงกรุณาแจ้ง งานธนาคารเลือด โทร 7301 , 7302"
},
"events":[
{"id":"2026-10-05","date":"2026-10-05","n":0,"codes":[],"orig":[],"time":"8.30 น."},
{"id":"2026-10-06","date":"2026-10-06","n":66,"codes":["D01"],"orig":["D01"],"time":"8.30 น."},
{"id":"2026-10-07","date":"2026-10-07","n":67,"codes":["D02"],"orig":["D02"],"time":"8.30 น."},
{"id":"2026-10-08","date":"2026-10-08","n":64,"codes":["D03"],"orig":["D03"],"time":"8.30 น."},
{"id":"2026-10-09","date":"2026-10-09","n":19,"codes":["D04"],"orig":["D04"],"time":"8.30 น."},
{"id":"2026-10-12","date":"2026-10-12","n":3,"codes":["D05"],"orig":["D05"],"time":"8.30 น."},
{"id":"2026-10-14","date":"2026-10-14","n":43,"codes":["D06"],"orig":["D06"],"time":"8.30 น."},
{"id":"2026-10-15","date":"2026-10-15","n":47,"codes":["D07"],"orig":["D07"],"time":"8.30 น."},
{"id":"2026-10-16","date":"2026-10-16","n":49,"codes":["D08"],"orig":["D08"],"time":"8.30 น."},
{"id":"2026-10-19","date":"2026-10-19","n":12,"codes":["D09"],"orig":["D09"],"time":"8.30 น."},
{"id":"2026-10-20","date":"2026-10-20","n":68,"codes":["D10"],"orig":["D10"],"time":"8.30 น."},
{"id":"2026-10-21","date":"2026-10-21","n":69,"codes":["D11"],"orig":["D11"],"time":"8.30 น."},
{"id":"2026-10-22","date":"2026-10-22","n":14,"codes":["D12"],"orig":["D12"],"time":"8.30 น."},
{"id":"2026-10-24","date":"2026-10-24","n":62,"codes":["D13"],"orig":["D13"],"time":"8.30 น."},
{"id":"2026-10-26","date":"2026-10-26","n":9,"codes":["D14"],"orig":["D14"],"time":"8.30 น."},
{"id":"2026-10-27","date":"2026-10-27","n":0,"codes":[],"orig":[],"time":"8.30 น."},
{"id":"2026-10-28","date":"2026-10-28","n":18,"codes":["D15"],"orig":["D15"],"time":"8.30 น."},
{"id":"2026-10-29","date":"2026-10-29","n":1,"codes":["D16"],"orig":["D16"],"time":"8.30 น."},
{"id":"2026-10-30","date":"2026-10-30","n":42,"codes":["D17"],"orig":["D17"],"time":"8.30 น."}
]
};
function doGet(){
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('เวรแพทย์ออกหน่วย')
    .addMetaTag('viewport','width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function ss_(){return SpreadsheetApp.getActive()||SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SS'))}
function sh_(n){var s=ss_().getSheetByName(n);if(!s){s=ss_().insertSheet(n);s.getRange(1,1,1,H[n].length).setValues([H[n]]).setFontWeight('bold');s.setFrozenRows(1)}return s}
function rows_(n){var s=sh_(n),l=s.getLastRow();return l<2?[]:s.getRange(2,1,l-1,H[n].length).getValues()}
function put_(n,rows,num){var s=sh_(n),w=H[n].length,l=s.getLastRow();if(l>1)s.getRange(2,1,l-1,w).clearContent();if(rows.length){var r=s.getRange(2,1,rows.length,w);r.setNumberFormat('@');(num||[]).forEach(function(c){s.getRange(2,c+1,rows.length,1).setNumberFormat('0')});r.setValues(rows)}}
function str_(v){if(v instanceof Date)return Utilities.formatDate(v,TZ,'yyyy-MM-dd');return String(v==null?'':v).trim()}
function list_(v){return str_(v).split(/[\s,]+/).filter(function(x){return x&&x!=='-'}).map(function(x){return x.toUpperCase()})}

function getState(){
  var kv={};rows_('ตั้งค่า').forEach(function(r){kv[str_(r[0])]=str_(r[1])});
  return {
    cfg:{
      docs:rows_('แพทย์').filter(function(r){return str_(r[0])}).map(function(r){return {code:str_(r[0]).toUpperCase(),name:str_(r[1]),tel:str_(r[2])}}),
      places:rows_('สถานที่').filter(function(r){return str_(r[0])}).map(function(r){return {n:parseInt(str_(r[0]),10)||0,name:str_(r[1])}}),
      coords:rows_('ชื่อและเบอร์โทร').filter(function(r){return str_(r[0])||str_(r[1])}).map(function(r){return {n:parseInt(str_(r[0]),10)||0,name:str_(r[1]),tel:str_(r[2]),note:str_(r[3])||''}}),
      reserve:(kv['แพทย์สำรอง']||'').toUpperCase(),note:kv['หมายเหตุ']||''},
    events:rows_('แผน').filter(function(r){return str_(r[0])}).map(function(r){var d=str_(r[0]),o=str_(r[4]);
      return {id:d,date:d,n:parseInt(str_(r[1]),10)||0,time:str_(r[2])||'8.30 น.',codes:list_(r[3]),orig:o===''?null:list_(o),travel:{mode:trvMode_(str_(r[7])),phone:str_(r[8])},tent:str_(r[9])==='สำรอง',type:str_(r[10])||'',vans:str_(r[11])||''}}),
    log:rows_('ประวัติ').slice(-5).reverse().map(function(r){return {t:str_(r[1])}})
  };
}
function cfg_(c){
  clearMaps_();
  put_('แพทย์',c.docs.map(function(d){return [d.code,d.name,d.tel||'']}));
  put_('สถานที่',c.places.map(function(p){return [Number(p.n),p.name]}),[0]);
  put_('ชื่อและเบอร์โทร',(c.coords||[]).map(function(co){return [Number(co.n)||'',co.name||'',co.tel||'',co.note||'']}),[0]);
  put_('ตั้งค่า',[['แพทย์สำรอง',c.reserve||''],['หมายเหตุ',c.note||'']]);
}
var _PL=null,_DR=null;
function maps_(){
  if(!_PL){_PL={};rows_('สถานที่').forEach(function(r){var n=parseInt(str_(r[0]),10);if(n)_PL[n]=str_(r[1])})}
  if(!_DR){_DR={};rows_('แพทย์').forEach(function(r){var c=str_(r[0]).toUpperCase();if(c)_DR[c]=str_(r[1])})}
  return {p:_PL,d:_DR};
}
function clearMaps_(){_PL=null;_DR=null}
function placeName_(n){n=parseInt(n,10)||0;if(!n)return '';var m=maps_();return m.p[n]||('ไม่พบเลขหน่วย '+n)}
function docNames_(codes){var m=maps_();return (codes||[]).map(function(c){return m.d[c]||('ไม่พบรหัส '+c)}).join(', ')}
function rowOf_(s,id){var l=s.getLastRow();if(l<2)return 0;var v=s.getRange(2,1,l-1,1).getValues();for(var i=0;i<v.length;i++)if(str_(v[i][0])===id)return i+2;return 0}
function ev_(id,d){
  var s=sh_('แผน'),r=rowOf_(s,id),isNew=!r;if(isNew)r=s.getLastRow()+1;
  var keepTrv=null;
  if(!isNew&&d.travel===undefined){var old=s.getRange(r,8,1,2).getValues()[0];keepTrv={mode:trvMode_(str_(old[0])),phone:str_(old[1])}}
  var tv=d.travel||keepTrv||{mode:'',phone:''};
  var g=s.getRange(r,1,1,5);g.setNumberFormat('@');s.getRange(r,2).setNumberFormat('0');
  g.setValues([[id,Number(d.n)||0,d.time||'8.30 น.',(d.codes||[]).join(', '),d.orig==null?'':(d.orig.length?d.orig.join(', '):'-')]]);
  var ng=s.getRange(r,6,1,2);ng.setNumberFormat('@');
  ng.setValues([[placeName_(d.n),docNames_(d.codes)]]);
  var keepT=null,keepType=null,keepVans=null;
  if(!isNew){
    if(d.tent===undefined)keepT=(str_(s.getRange(r,10).getValues()[0][0])==='สำรอง');
    if(d.type===undefined)keepType=str_(s.getRange(r,11).getValues()[0][0]);
    if(d.vans===undefined)keepVans=str_(s.getRange(r,12).getValues()[0][0]);
  }
  var tent=(d.tent===undefined?!!keepT:!!d.tent);
  var type=(d.type===undefined?(keepType||''):(d.type||''));
  var vans=(d.vans===undefined?(keepVans||''):(d.vans||''));
  var tg=s.getRange(r,8,1,5);tg.setNumberFormat('@');tg.setValues([[trvLabel_(tv.mode),tv.phone||'',tent?'สำรอง':'',type,vans]]);
  var l=s.getLastRow();if(isNew&&l>2)s.getRange(2,1,l-1,H['แผน'].length).sort(1);
}
function refreshNames_(){
  var s=sh_('แผน'),l=s.getLastRow();if(l<2)return;
  var v=s.getRange(2,1,l-1,5).getValues(),out=[];
  for(var i=0;i<v.length;i++){
    if(!str_(v[i][0])){out.push(['','']);continue}
    out.push([placeName_(v[i][1]),docNames_(list_(v[i][3]))]);
  }
  var g=s.getRange(2,6,out.length,2);g.setNumberFormat('@');g.setValues(out);
}
function del_(id){var s=sh_('แผน'),r=rowOf_(s,id);if(r)s.deleteRow(r)}
function applyOps(ops){
  var lock=LockService.getScriptLock();lock.waitLock(20000);
  try{
    ops.forEach(function(o){
      if(o.t==='cfg'){cfg_(o.d);refreshNames_()}
      else if(o.t==='ev')ev_(o.id,o.d);
      else if(o.t==='del')del_(o.id);
      else if(o.t==='log')sh_('ประวัติ').appendRow([Utilities.formatDate(new Date(),TZ,'yyyy-MM-dd HH:mm'),o.d.t]);
    });
    SpreadsheetApp.flush();
  }finally{lock.releaseLock()}
  return true;
}
// รันครั้งเดียวจากตัวแก้ไข: สร้างแท็บและใส่ข้อมูลตั้งต้น (รันซ้ำจะไม่ทับข้อมูล)
function setup(){
  var ss=ss_();
  PropertiesService.getScriptProperties().setProperty('SS',ss.getId());
  if(ss.getSheetByName('ตั้งค่า')){Logger.log('ตั้งค่าไว้แล้ว ไม่ทับข้อมูล — ใช้ fixSheet() เพื่อเพิ่มคอลัมน์/ชีตใหม่');return}
  sh_('ตั้งค่า');cfg_(SEED.cfg);
  SEED.events.forEach(function(e){ev_(e.id,e)});
  sh_('ประวัติ');
  ['Sheet1','ชีต1'].forEach(function(n){var s=ss.getSheetByName(n);if(s&&s.getLastRow()===0&&ss.getSheets().length>1)ss.deleteSheet(s)});
  Logger.log('เสร็จแล้ว');
}

// กู้ข้อมูลตั้งต้นทั้งหมด (ทับข้อมูลในชีตด้วยข้อมูลตั้งต้น)
function reseed(){
  var ss=ss_();
  PropertiesService.getScriptProperties().setProperty('SS',ss.getId());
  fixHead_();
  cfg_(SEED.cfg);
  put_('แผน',[]);
  SEED.events.forEach(function(e){ev_(e.id,e)});
  var s=getState();
  Logger.log('แพทย์ '+s.cfg.docs.length+' | หน่วย '+s.cfg.places.length+' | ผู้ประสานงาน '+s.cfg.coords.length+' | แผน '+s.events.length);
}

// ซ่อมชีตที่มีอยู่: เพิ่มคอลัมน์/ชีตใหม่ (รักษาข้อมูลเดิม + ผสาน coords ตั้งต้นถ้ายังไม่มี)
function fixSheet(){
  var st=getState();
  fixHead_();
  // ผสาน coords: ของเดิมที่อยู่ในชีตมาก่อน, แล้วเพิ่มของตั้งต้นที่ยังไม่มีเลขหน่วยซ้ำ
  var cur=st.cfg.coords||[],seen={};
  cur.forEach(function(c){var k=(c.n||0)+'|'+(c.name||'').toLowerCase();seen[k]=1});
  (SEED.cfg.coords||[]).forEach(function(c){var k=(c.n||0)+'|'+(c.name||'').toLowerCase();if(!seen[k]){cur.push(c);seen[k]=1}});
  st.cfg.coords=cur;
  cfg_(st.cfg);
  put_('แผน',[]);
  st.events.forEach(function(e){ev_(e.id,e)});
  Logger.log('แพทย์ '+st.cfg.docs.length+' | หน่วย '+st.cfg.places.length+' | ผู้ประสานงาน '+st.cfg.coords.length+' | แผน '+st.events.length);
}
function fixHead_(){Object.keys(H).forEach(function(n){sh_(n).getRange(1,1,1,H[n].length).setValues([H[n]]).setFontWeight('bold')})}

// ซ่อมคอลัมน์ "สถานที่ (อัตโนมัติ)" และ "ชื่อแพทย์ (อัตโนมัติ)" ในแท็บแผน
function fixNames(){
  clearMaps_();fixHead_();refreshNames_();SpreadsheetApp.flush();
  var n=sh_('แผน').getLastRow()-1;
  Logger.log('อัปเดตชื่อสถานที่/ชื่อแพทย์แล้ว '+(n>0?n:0)+' แถว');
}

// ตรวจสอบความถูกต้องทั้งระบบ: รันเพื่อ debug
function selfTest(){
  var s=getState(),w=[];
  s.cfg.coords.forEach(function(c){
    if(!c.n)w.push('ชื่อและเบอร์โทร: "'+c.name+'" ยังไม่ระบุเลขหน่วย');
    else if(!s.cfg.places.some(function(p){return +p.n===+c.n}))w.push('ชื่อและเบอร์โทร: เลขหน่วย '+c.n+' ("'+c.name+'") ไม่พบในชีตสถานที่');
  });
  s.events.forEach(function(e){
    if(e.n&&!s.cfg.places.some(function(p){return +p.n===+e.n}))w.push('แผน '+e.date+': เลขหน่วย '+e.n+' ไม่พบ');
    e.codes.forEach(function(c){if(!s.cfg.docs.some(function(d){return d.code===c}))w.push('แผน '+e.date+': รหัส '+c+' ไม่พบ')});
  });
  Logger.log('— ผลตรวจสอบ —');
  Logger.log('แพทย์: '+s.cfg.docs.length+' | หน่วย: '+s.cfg.places.length+' | ผู้ประสานงาน: '+s.cfg.coords.length+' | แผน: '+s.events.length);
  if(!w.length)Logger.log('✓ ไม่พบปัญหา');
  else{Logger.log('⚠ พบ '+w.length+' จุด:');w.forEach(function(x){Logger.log('  - '+x)})}
}
