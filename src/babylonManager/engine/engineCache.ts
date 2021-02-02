import { Engine, EngineView, FreeCamera, Nullable, Scene, Vector3 } from "@babylonjs/core";

export interface IEngineCacheSlot{
    uid:    string
    engine: Engine
    workingCanvas: HTMLCanvasElement
    scenes : IEngineCacheScene[]
}
interface IEngineCacheScene{
    uid : string
    scene : Scene
    active : boolean
    initialized: boolean
    onInit: Nullable<Function>
    views : Map<string, IEngineCacheView>
}

interface IEngineCacheView{
    uid : string
    canvasId: string
    view : Nullable<EngineView>
}

interface IEngineCacheParams{}

export class EngineCache{
    private _slots: Map<string, IEngineCacheSlot> = new Map<string, IEngineCacheSlot>()
    public get slots(): Map<string, IEngineCacheSlot>{
        return this._slots
    } 

    constructor(private params:IEngineCacheParams = {}){}

    _slotRenderLoop(slot){
        slot.scenes.forEach((cacheScene)=>{            
            if(!cacheScene.initialized){
                if(cacheScene.onInit){
                    const onInit = cacheScene.onInit
                    onInit()
                    if(!cacheScene.initialized){
                        cacheScene.initialized = true
                    }      
                }
                return false
            }

            cacheScene.views.forEach((view)=>{
                const canvas: Nullable<HTMLCanvasElement>  = document.getElementById(`${view.canvasId}`) as HTMLCanvasElement
                if((canvas) && !view.view){ 
                    view.view = slot.engine.registerView(canvas, cacheScene.scene.cameras[0])
                    cacheScene.scene.detachControl()   
                    slot.engine.inputElement = canvas
                    cacheScene.scene.attachControl(true, true, true)                                                    
                }
                if(slot.engine.activeView === view.view){
                    cacheScene.scene.render()
                }
            })
        })        
    }

    createEngineSlot(uid:string, params:any={}): IEngineCacheSlot{
        const workingCanvas = document.createElement('canvas')
        const engine = new Engine(workingCanvas, false)
        
        const scenes = []
        const slot:IEngineCacheSlot = {
            uid, engine, workingCanvas, scenes
        }
        this._slots.set(uid, slot)
        engine.runRenderLoop(()=>{ 
            this._slotRenderLoop(slot)
        })
        return slot
    }

    addSceneToSlot(slot, params){
        const scene = new Scene(slot.engine)
        const camera = new FreeCamera('mainCam', new Vector3(0,0,-1), scene)
        camera.setTarget(Vector3.Zero())
        const uid = params.uid
        const canvasId = params.canvasId
        const onInit = params.onInit ?? null
        const cacheScene = {
            uid,
            scene,
            active : true,
            initialized: false,
            onInit,
            views : new Map<string, IEngineCacheView>([['main', {
                    uid: 'main',
                    canvasId,
                    view: null
                }
            ]])
        }
        slot.scenes.push(cacheScene)
        return cacheScene
    }

}