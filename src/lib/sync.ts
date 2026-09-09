import type {GymEvent} from './model';
import type {GymStore} from './store';
export interface Remote {push(events:GymEvent[]):Promise<void>;pull():Promise<GymEvent[]>}
export async function synchronize(store:GymStore,remote:Remote) {
 const snapshot=await store.load();
 const pending=new Set(snapshot.pending);
 const sending=snapshot.events.filter(e=>pending.has(e.id));
 // Immutable UUID events make retries safe, including a crash after server acceptance.
 if(sending.length) await remote.push(sending);
 const received=await remote.pull();
 // Merge against latest durable state: writes made while syncing remain queued.
 return store.merge(received,sending.map(e=>e.id));
}
