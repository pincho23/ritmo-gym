import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {AppState,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GymStore} from './store';
import {emptyState,records,type GymEvent,type Workout,validateWorkout} from './model';
import {supabase} from './supabase';
import {synchronize} from './sync';
function uuid(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16);});}
export function useGym(owner:string,localOnly:boolean){
 const store=useMemo(()=>new GymStore(AsyncStorage,owner),[owner]);
 const [state,setState]=useState(emptyState);const [ready,setReady]=useState(false);const [error,setError]=useState('');const [syncStatus,setSyncStatus]=useState(localOnly?'Solo en este dispositivo':'Pendiente de sincronizar');
 const busy=useRef(false);const live=useRef(true);
 const sync=useCallback(async()=>{
  if(localOnly||!supabase||busy.current)return;
  if(Platform.OS==='web'&&!navigator.onLine){setSyncStatus('Sin conexión · guardado en el dispositivo');return;}
  busy.current=true;setSyncStatus('Sincronizando…');
  try{const db=supabase;const {data,error:authError}=await db.auth.getUser();if(authError||data.user?.id!==owner)throw new Error('Vuelve a iniciar sesión para sincronizar. Tus registros están guardados aquí.');
   const next=await synchronize(store,{push:async(events)=>{for(let i=0;i<events.length;i+=100){const {error}=await db.from('gym_events').upsert(events.slice(i,i+100),{onConflict:'id',ignoreDuplicates:true});if(error)throw error;}},pull:async()=>{let result:GymEvent[]=[];for(let start=0;;start+=500){const {data,error}=await db.from('gym_events').select('*').eq('user_id',owner).order('id').range(start,start+499);if(error)throw error;result=result.concat(data as GymEvent[]);if(data.length<500)return result;}}});
   if(live.current){setState(next);setSyncStatus(next.pending.length?'Cambios pendientes':'Todo sincronizado');}
  }catch(e){if(live.current)setSyncStatus(e instanceof Error&&e.message.includes('sesión')?e.message:'No se pudo sincronizar · reintentaremos automáticamente');}
  finally{busy.current=false;}
 },[owner,localOnly,store]);
 useEffect(()=>{live.current=true;store.load().then(s=>{if(live.current){setState(s);setReady(true);void sync();}}).catch(()=>setError('No se pudo leer el almacenamiento del dispositivo. No borres sus datos.'));
 const timer=setInterval(()=>{if(AppState.currentState==='active'||Platform.OS==='web')void sync();},30000);
 const app=AppState.addEventListener('change',s=>{if(s==='active')void sync();});
 const online=()=>void sync();if(Platform.OS==='web')window.addEventListener('online',online);
 return()=>{live.current=false;clearInterval(timer);app.remove();if(Platform.OS==='web')window.removeEventListener('online',online);};},[store,sync]);
 const append=async(kind:GymEvent['kind'],payload:Workout|null,target_id:string|null)=>{const event:GymEvent={id:uuid(),user_id:owner,kind,payload,target_id,created_at:new Date().toISOString()};const next=await store.append(event);setState(next);void sync();};
 return {all:records(state.events),pending:localOnly?0:state.pending.length,ready,error,syncStatus,sync,save:async(w:Workout)=>{validateWorkout(w);await append('workout',w,null);},remove:async(id:string)=>append('delete',null,id)};
}
