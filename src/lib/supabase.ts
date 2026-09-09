import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient,processLock} from '@supabase/supabase-js';
import {Platform} from 'react-native';
const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const supabase=url&&key?createClient(url,key,{auth:{storage:AsyncStorage,storageKey:'ritmo-auth-v1',autoRefreshToken:true,persistSession:true,detectSessionInUrl:Platform.OS==='web',lock:processLock},global:{fetch:async(input,init)=>fetch(input,{...init,signal:init?.signal??AbortSignal.timeout(15000)})}}):null;
