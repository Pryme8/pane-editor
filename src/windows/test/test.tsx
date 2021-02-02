import { BabylonManager } from "../../babylonManager/core";
import { IModalProps, IModalState, Modal } from "../../components/modal/modal";
import { v4 as getUid } from 'uuid';
import { Color3, Engine, HemisphericLight, MeshBuilder, Nullable, StandardMaterial, Vector3 } from "@babylonjs/core";
import { IEngineCacheSlot } from "../../babylonManager/engine/engineCache";

export interface ITestProps extends IModalProps{}
export interface ITestState extends IModalState{}

export class Test<T extends IModalProps, S extends IModalState> extends Modal<T, S>{

    private canvasId: string = ''  
    
    public onInit = ()=>{
        const bm:BabylonManager = this.mutators.getBM()
        const engineSlots = bm.getAllEngineSlots()
        console.log(engineSlots)
        if(engineSlots.size < 12){
            const id = engineSlots.size
            const engineSlot = bm.createEngineSlot(`test-${id}`)
            this.canvasId = `test-${id}`
            const cacheScene = bm.addSceneToSlot(engineSlot, {
                uid:`test-${id}`,
                canvasId:`test-${id}`
            }) 
            const scene = cacheScene.scene
            
            cacheScene.onInit = ()=>{
                const box = MeshBuilder.CreateBox("box", {size: 1}, scene)
                box.rotation.x = Math.PI*Math.random()
                box.bakeCurrentTransformIntoVertices()
                const boxMat = new StandardMaterial("boxMat", scene)
                boxMat.diffuseColor = Color3.Random()
                box.material = boxMat
                const light = new HemisphericLight("mainLight", new Vector3(-0.5, -1, 0.3), scene)              
                scene.cameras[0].position.z = -4
                scene.onBeforeRenderObservable.add(()=>{
                    box.rotate(Vector3.Up(), scene.getEngine().getDeltaTime()*0.001)
                })
            }

            console.log(cacheScene)           
        }

        // this.bjsEngine = bjs.engine
        // const scenes = bjs.getScenes()
        // if(scenes.size < 3){            
        //     const scene:any = bjs.createScene(
        //         { 
        //           uid: scenes.size-1,
        //           canvasId: this.canvasId,
        //           name:'Random Test'
        //         }
        //       )
        //     scene.onInit = ()=>{
        //         
        //         scene.initialized = true
        //     }            
        // }
    }

    componentDidUpdate(){
        //this.bjsEngine.resize()
    }

    public content(){
        return (
            <canvas id={`canvas-${this.canvasId}`} style={{position:'absolute', width:'100%', height:'100%', touchAction:'none'}}/> 
        )
    }
}
