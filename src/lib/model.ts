export const exercises = [
  {id:'bench',name:'Press de banca',group:'Pecho'}, {id:'incline',name:'Press inclinado',group:'Pecho'}, {id:'fly',name:'Aperturas con mancuernas',group:'Pecho'},
  {id:'squat',name:'Sentadilla',group:'Piernas'}, {id:'legpress',name:'Prensa de piernas',group:'Piernas'}, {id:'lunge',name:'Zancadas',group:'Piernas'}, {id:'legcurl',name:'Curl femoral',group:'Piernas'}, {id:'calf',name:'Elevación de talones',group:'Piernas'},
  {id:'deadlift',name:'Peso muerto',group:'Espalda'}, {id:'row',name:'Remo con barra',group:'Espalda'}, {id:'pulldown',name:'Jalón al pecho',group:'Espalda'}, {id:'pullup',name:'Dominadas',group:'Espalda'},
  {id:'shoulder',name:'Press de hombros',group:'Hombros'}, {id:'lateral',name:'Elevaciones laterales',group:'Hombros'},
  {id:'curl',name:'Curl de bíceps',group:'Brazos'}, {id:'triceps',name:'Extensión de tríceps',group:'Brazos'}, {id:'pushup',name:'Flexiones',group:'Pecho'}, {id:'crunch',name:'Abdominales',group:'Core'},
];
export type SetEntry = {reps:number;kg:number};
export type Workout = {date:string;exerciseId:string;sets:SetEntry[];notes:string};
export type GymEvent = {id:string;user_id:string;kind:'workout'|'delete';target_id:string|null;payload:Workout|null;created_at:string};
export type RecordEntry = Workout & {id:string};
export type LocalState = {events:GymEvent[];pending:string[]};
export const emptyState = ():LocalState => ({events:[],pending:[]});
export const today = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function validateWorkout(w:Workout) {
 const d=new Date(`${w.date}T12:00:00Z`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(w.date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==w.date||w.date>today()) throw new Error('Introduce una fecha válida, hasta hoy.');
 if(!exercises.some(e=>e.id===w.exerciseId)) throw new Error('Elige un ejercicio.');
 if(w.sets.length<1||w.sets.length>50||w.sets.some(s=>!Number.isInteger(s.reps)||s.reps<1||s.reps>1000||!Number.isFinite(s.kg)||s.kg<0||s.kg>2000)) throw new Error('Revisa las series: de 1 a 1.000 repeticiones y de 0 a 2.000 kg.');
 if(w.notes.length>1000) throw new Error('Las notas admiten hasta 1.000 caracteres.');
}
export const volume = (w:Workout) => w.sets.reduce((n,s)=>n+s.reps*s.kg,0);
export function records(events:GymEvent[]):RecordEntry[] {
 const deleted = new Set(events.filter(e=>e.kind==='delete').map(e=>e.target_id));
 return events.filter(e=>e.kind==='workout'&&e.payload&&!deleted.has(e.id)).map(e=>({...e.payload!,id:e.id})).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export function mergeRemote(local:LocalState, remote:GymEvent[], acknowledged:string[]):LocalState {
 const map = new Map(local.events.map(e=>[e.id,e]));
 for(const event of remote) if(!map.has(event.id)) map.set(event.id,event);
 const ack = new Set(acknowledged);
 return {events:[...map.values()],pending:local.pending.filter(id=>!ack.has(id))};
}
export function filterRecords(all:RecordEntry[],exercise:string,from:string,to:string) {return all.filter(w=>(exercise==='all'||w.exerciseId===exercise)&&(!from||w.date>=from)&&(!to||w.date<=to));}
export function stats(all:RecordEntry[]) {return {volume:all.reduce((s,w)=>s+volume(w),0),sessions:new Set(all.map(w=>w.date)).size,reps:all.reduce((s,w)=>s+w.sets.reduce((n,r)=>n+r.reps,0),0),sets:all.reduce((s,w)=>s+w.sets.length,0)};}
export function daily(all:RecordEntry[]) {const map=new Map<string,number>();for(const w of all)map.set(w.date,(map.get(w.date)||0)+volume(w));return [...map].sort(([a],[b])=>a.localeCompare(b)).map(([date,value])=>({date,value}));}
