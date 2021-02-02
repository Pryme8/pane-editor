import {Engine, Scene, FreeCamera, EngineView, Vector3, Nullable, DeviceInputSystem, PointerInput, DeviceType} from '@babylonjs/core'
import { EngineCache } from './engine/engineCache'



export class BabylonManager{ 
    private _engineCache:EngineCache = new EngineCache()   

    constructor(private params){

    }

    createEngineSlot(uid:string, params:any={}){
        return this._engineCache.createEngineSlot(uid, params)
    }

    getEngineSlot(uid:string){
        return this._engineCache.slots.get(uid)
    }

    getAllEngineSlots(){
        return this._engineCache.slots
    }

    addSceneToSlot(slot, params){
        return this._engineCache.addSceneToSlot(slot, params)
    }


    
    // public getScene(uid){
    //     return this._scenes.get(uid)
    // }
    // public getScenes(){
    //     return this._scenes
    // }
}

