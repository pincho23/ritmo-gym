import type {GymEvent,LocalState} from './model';
import {emptyState,mergeRemote} from './model';
export interface Storage {getItem(key:string):Promise<string|null>;setItem(key:string,value:string):Promise<void>}
export class GymStore {
 private queue:Promise<unknown>=Promise.resolve();
 constructor(private storage:Storage,private owner:string){}
 private key(){return `ritmo:v1:${this.owner}`;}
 private async read(){const raw=await this.storage.getItem(this.key());return raw?JSON.parse(raw) as LocalState:emptyState();}
 private serial<T>(fn:()=>Promise<T>):Promise<T>{const next=this.queue.then(()=>typeof navigator!=='undefined'&&navigator.locks ? navigator.locks.request(this.key(),fn) : fn());this.queue=next.catch(()=>{});return next;}
 load(){return this.serial(()=>this.read());}
 append(event:GymEvent){return this.serial(async()=>{if(event.user_id!==this.owner)throw new Error('Cuenta incorrecta.');const state=await this.read();if(!state.events.some(e=>e.id===event.id)){state.events.push(event);state.pending.push(event.id);}await this.storage.setItem(this.key(),JSON.stringify(state));return state;});}
 merge(remote:GymEvent[],ack:string[]){return this.serial(async()=>{if(remote.some(e=>e.user_id!==this.owner))throw new Error('Cuenta incorrecta.');const state=mergeRemote(await this.read(),remote,ack);await this.storage.setItem(this.key(),JSON.stringify(state));return state;});}
}
