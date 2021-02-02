import { BabylonManager } from "../../babylonManager/core";
import { IModalProps, IModalState, Modal } from "../../components/modal/modal";
import { Color3, HemisphericLight, MeshBuilder, StandardMaterial, Vector3, FreeCameraKeyboardMoveInput, Scene, Mesh, ProceduralTexture, DynamicTexture, ShaderMaterial, VertexData, Nullable, Effect, Vector2, Vector4} from "@babylonjs/core";
import React, { createRef } from "react";
import { Padding } from "../../constants";
import  {SplitPanelHorizontal, SplitPanelLeft, SplitPanelRight } from "../../components/panel";
import { TabPanel, PanelSection } from "../../components/panel/tabPanel";

import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent 

export interface IGrassBaseSceneProps extends IModalProps{}
export interface IGrassBaseSceneState extends IModalState{}

export class GrassBaseScene<T extends IModalProps, S extends IModalState> extends Modal<T, S>{
    private canvasId: string = ''  
    private canvasRef = createRef<HTMLCanvasElement>()

    private grassBuilder: Nullable<DynamicGrassBlade> = null
    
    public onInit = ()=>{
        const bm:BabylonManager = this.mutators.getBM()
        const engineSlot = bm.getEngineSlot('grassBase')
        if(!engineSlot){         
            const engineSlot = bm.createEngineSlot(`grassBase`)
            const cacheScene = bm.addSceneToSlot(engineSlot, {
                uid:`grassBase`,
                canvasId:`canvas-grassBase`
            }) 
            engineSlot.engine.inputElement = this.canvasRef.current
            const scene = cacheScene.scene            
            cacheScene.onInit = ()=>{ 
                scene.cameras[0].position.z = -4;        
                (scene.cameras[0] as any).setTarget(Vector3.Zero())      
                scene.cameras[0].attachControl(this.canvasRef.current, false)
                scene.cameras[0].inputs.add(new FreeCameraKeyboardMoveInput());
                this.grassBuilder = new DynamicGrassBlade({scene})
                globalThis.scene = scene
            }          
        }
    }

    componentDidUpdate(){
        // const bm:BabylonManager = this.mutators.getBM()
        // const engineSlot = bm.getEngineSlot('grassBase')
        // if(engineSlot){
        //     engineSlot.scenes[0].scene.detachControl()
        //     engineSlot.engine.inputElement = this.canvasRef.current
        //     engineSlot.scenes[0].scene.attachControl()
        // }
    }
    
    componentDidMount(){

    }

    public content(){
        return (            
            <SplitPanelHorizontal>
            <SplitPanelLeft>             
                <canvas id={`canvas-grassBase`} ref={this.canvasRef} style={{position:'absolute', width:'100%', height:'100%', touchAction:'none'}}/> 
             </SplitPanelLeft >
            <SplitPanelRight>
                <div style={{...Padding.Large}}>
                <TabPanel>
                    <PanelSection title='Base Mesh' style={{...Padding.Normal, minHeight:'100%'}}>
                        <div>
                        Base Height: <br />
                        Base Width: <br />         
                        Base SubDivsXY: <br />          
                        </div>
                    </PanelSection>
                    <PanelSection title='Gradient' style={{...Padding.Normal, minHeight:'100%'}}>
                        <div>Panel Content 1</div>
                    </PanelSection>
                    <PanelSection title='LOD' style={{...Padding.Normal, minHeight:'100%'}}>
                        <div>Panel Content 2</div>
                    </PanelSection>
                </TabPanel>
                 </div> 
            </SplitPanelRight>
        </SplitPanelHorizontal>             
        )
    }
}

interface DynamicGrassBladeParams{
    width?:number
    height?:number
    subDivX?:number
    subDivY?:number
    lodLevels?:number
    scene: Scene
}

// interface DynamicGrassPatchParams{
//     width:number
//     height:number
//     countX:number
//     countY:number
//     lodLevels:number
// }

class DynamicGrassBlade{
    public get scene():Scene{
        return this.params.scene
    }

    // private basePatchParams:DynamicGrassPatchParams = {
    //     width : 40,
    //     height : 40,
    //     countX : 20,
    //     countY : 20,
    //     lodLevels : 3
    // }

    //private baseCount: number = 1000
    private distances: number[] = []
    private baseBlades: Mesh[] = []
    private baseMesh: Mesh[] = []
    //public zones: DynamicGrassPatchZone[] = []
    //private randomBuffer: ProceduralTexture[] = []
    //private bladeGradient: DynamicTexture = null
    private shader: Nullable<ShaderMaterial> = null

    constructor(private params:DynamicGrassBladeParams){
        this.params = {...this.params, ...{
            width : 0.235,
            height : 1,
            subDivX : 2,
            subDivY : 8,
            lodLevels: 4
        }}

        this.createShader()

        // this.buildAllBladeLods()
        // let baseDistance = params.baseDistance ?? 50
        const lodCount = this.params.lodLevels ?? 1
        const offset = (-lodCount * 0.5)*(this.params.width ?? 0)

        for(let i = 0; i <= lodCount; i++){
            this.baseBlades.push(this.createBaseBlade({ level:i }));
            this.baseBlades[i].position.x = offset + (i * (this.params.width ?? 0) *1.5)
            //this.baseBlades[i].material = this.shader            
        }
        this.scene.forceWireframe = true

        // this.buildAllLodMeshes()

        // this.randomBuffer.push( this.getRandomBuffer({seed:4312.35}) )
        // this.randomBuffer.push( this.getRandomBuffer({seed:2234.231234}) )
        // this.randomBuffer.push( this.getRandomBuffer({seed:1235.1254}) )
        // this.buildBladeTexture({resolution:128})
        
        // this.createShader()
        // this.startZoneBuilds()
    }

    // buildAllBladeLods(){
    //     for(let i = 0; i < this.lodLevels; i++){
    //         this.baseBlades.push( this.createBaseBlade({ level:i }) )        
    //     }
    // }

    // buildAllLodMeshes(){
    //     for(let i = 0; i < this.lodLevels; i++){
    //         let level = i+1     
    //         let count = Math.floor(this.baseCount/(level))         
    //         let baseBlade = this.baseBlades[i]
    //         let tempBlades = []  

    //         for(let i = 0; i < count; i++){
    //             tempBlades.push(baseBlade.clone('tempBlade', null))             
    //         }

    //         let baseMesh = BABYLON.Mesh.MergeMeshes(tempBlades, true, true)
    //         baseMesh.setEnabled(false)         

    //         this.baseMesh.push(baseMesh)                  
    //     }
    // }
    
    // startZoneBuilds(){
    //     let i = 0
    //     let target = this.basePatchParams.countX * this.basePatchParams.countY
    //     let engine = this.scene.getEngine()

    //     let onDone = (id)=>{
    //         if(i<target){
    //             setTimeout(()=>{
    //                 this.createZone({id:i, onDone:()=>{
    //                     onDone(i++)
    //                 }})
    //             },0)
    //         }         
    //     }

    //     this.createZone({id:i, onDone:()=>{
    //        onDone(i++)
    //     }})
    // }

    // createZone(args){
    //     let zone = new DynamicGrassPatchZone(args, this)
    //     this.zones.push(zone)
    // }

    createBaseBlade(args){               
        let width = this.params.width ?? 1, height = this.params.height ?? 1
        let widthHalf = width*0.5, heightHalf = height*0.5

        let level = args.level ?? 0
        let subDivX = Math.max(Math.round((this.params.subDivX ?? 1)/(level+1)), 2), subDivY =  Math.max(Math.round((this.params.subDivY ?? 1)/(level+1)), 4)
        let subDivX1 = subDivX+1
        let segmentWidth = width/subDivX, segmentHeight = height/subDivY
       
        let vertexData = new VertexData()
        vertexData.positions = []
        vertexData.indices = []
        vertexData.normals = []
        vertexData.uvs = []
        vertexData.uvs2 = [] //LOD GROUP INFO

        for(let iy = 0; iy <= subDivY; iy++){
            let y = iy * segmentHeight
            for(let ix = 0; ix <= subDivX; ix++){
                let x = ix * segmentWidth
                vertexData.positions.push(x - widthHalf, y, 0)
                vertexData.normals.push(0, 0, 1)
                vertexData.uvs.push(ix/subDivX, 1-(iy/subDivY))
                vertexData.uvs2.push(level, 0)
            }
        }

        for(let iy = 0; iy < subDivY; iy++){
            for(let ix = 0; ix < subDivX; ix++){
                let a = ix + (subDivX1 * iy),
                b = ix + (subDivX1 * (iy + 1)),
                c = (ix + 1) + (subDivX1 * (iy + 1)),
                d = (ix + 1) + (subDivX1 * iy)
                vertexData.indices.push( a, b, d, b, c, d)
            }
        }

        let mesh = new Mesh('baseBlade', this.scene)
        vertexData.applyToMesh(mesh)
        return mesh
    }    

    // buildBladeTexture(args){
    //     let res = args.resolution ?? 128
    //     let dt = new BABYLON.DynamicTexture('bladeFade', {width:res, height:res}, this.scene, true)
    //     let ctx = dt.getContext()
    //     let grd = ctx.createLinearGradient(0,0,res,0)
    //     grd.addColorStop(0, 'rgba(0,0,0,0)')
    //     grd.addColorStop(0.02, 'black')
    //     grd.addColorStop(0.12, 'white')
    //     grd.addColorStop(0.28, 'gray')
    //     grd.addColorStop(0.4, 'white')
    //     grd.addColorStop(0.5, 'black')
    //     grd.addColorStop(0.54, 'white')
    //     grd.addColorStop(0.66, 'gray')
    //     grd.addColorStop(0.88, 'white')
    //     grd.addColorStop(0.98, 'black')
    //     grd.addColorStop(1, 'rgba(0,0,0,0)')
    //     ctx.fillStyle = grd
    //     ctx.fillRect(0,0,res,res)
    //     dt.update()
    //     this.bladeGradient = dt
    // }

    // getRandomBuffer(args){
    //     let resolution = args.resolution ?? new BABYLON.Vector2(128, 128)
    //     let seed = args.seed ?? 1.01
    //     BABYLON.Effect.ShadersStore['randomTextureBufferPixelShader']=
    //     `   
    //         varying vec2 vUV;
    //         const vec2 resolution = vec2(${resolution.x}, ${resolution.y});
    //         uniform float seed;

    //         ${NoiseGlobalInclude}

    //         void main(){
    //             gl_FragColor = vec4(gold_noise(vUV*resolution, fract(seed)), 1.0);
    //         }        
    //     `

    //     let texture = new BABYLON.ProceduralTexture('randomBuffer', {width:resolution.x, height: resolution.y}, 'randomTextureBuffer', this.scene, null, false, false)
    //         texture.refreshRate = 0
    //         texture.setFloat('seed', seed)

    //     return texture
    // }

    createShader(){      
        let grassPatchVertex = `
            attribute vec3 position;
            attribute vec2 uv;
            attribute vec3 normal;
            attribute vec2 bladeId;
          
            varying vec4 vPosition;
            varying vec3 gPosition;
            varying vec2 vUV;
            varying vec3 vNormal;
            varying float fFogDistance;

            uniform mat4 viewProjection;
            uniform mat4 view;

            #include<instancesDeclaration>

            void main(){
                vUV = uv;
                vPosition.xyz = position;
                vPosition.w = bladeId.x;
                vec3 updatedPosition = position;
                vec3 normalUpdated = normal;
                
                #include<instancesVertex>

                //Shaping
                updatedPosition.x *= 1.0-pow(1.0-uv.y, 4.6);
                updatedPosition.x *= (1.0-(pow(uv.y, 12.6)*0.4));                
                fFogDistance = (view * finalWorld * vec4(updatedPosition, 1.0)).z;

                gl_Position = finalWorld * viewProjection * vec4(updatedPosition, 1.0);       
            }
            `

        let grassPatchFragment = `
            varying vec4 vPosition;
            varying vec2 vUV;
            varying vec3 vNormal;

            void main(){              
                gl_FragColor = vec4(vec3(1.0), 1.0);
            }
            `

        Effect.ShadersStore['grassPatchVertexShader'] = grassPatchVertex
        Effect.ShadersStore['grassPatchFragmentShader'] = grassPatchFragment 
        
        const shader = new ShaderMaterial("grassPatch", this.scene, {
            vertex:'grassPatch',
            fragment:'grassPatch',
        },
        {
            attributes: ["position", "uv", "normal", "bladeId" , "zoneOffset"],
            samplers:["randomBuffer0", "randomBuffer1", "randomBuffer2", "bladeGradient"],
            uniforms: ["viewProjection", "time", "basePatchSize", "world", "view", "vFogInfos", "vFogColor"],
            needAlphaBlending:true,
            needAlphaTesting:true
        })

        shader.setVector2('basePatchSize', new Vector2(
            this.params.width, this.params.height
        ))
        shader.needDepthPrePass = true

        let time = 0
        let engine = this.scene.getEngine()

        shader.onBindObservable.add((effect)=>{
            time += engine.getDeltaTime()*0.001
            shader.setFloat('time', time)          
            shader.setVector4("vFogInfos", new Vector4(this.scene.fogMode, this.scene.fogStart, this.scene.fogEnd, this.scene.fogDensity)); 
            shader.setColor3("vFogColor", this.scene.fogColor);
        })

        this.shader = shader       
    }
}

// class DynamicGrassPatchZone{
//     public get scene():BABYLON.Scene{
//         return this.core.scene
//     }

//     public meshes : BABYLON.Mesh[] = []
//     private positonOffset: BABYLON.Vector3 = new BABYLON.Vector3()
//     private noiseOffsetValue: number

//     constructor(private args, private core){
//         this.positonOffset.x = (args.id % this.core.basePatchParams.countX)
//         this.positonOffset.y = 0
//         this.positonOffset.z = Math.floor(args.id / this.core.basePatchParams.countX )
//         this.positonOffset = this.positonOffset.multiplyByFloats(this.core.basePatchParams.width*0.5, 0, this.core.basePatchParams.height*0.5)
//         this.noiseOffsetValue =this.core.baseCount*Math.pow(args.id, 0.342)
//         this.buildSteps()
//         if(this.args.onDone){
//             this.args.onDone()
//         }
//     }

//     buildSteps(){
//         for(let i = 0; i < this.core.lodLevels; i++){
//             this.meshes.push(this.updateLodMesh({level:i}))
//             this.meshes[i].material = this.core.shader
//         }
//         for(let i = 1; i < this.core.lodLevels; i++){
//             this.meshes[0].addLODLevel(this.core.distances[i], this.meshes[i])
//         }
//         this.meshes[0].addLODLevel(this.core.distances[this.core.lodLevels], null)
//     }

//     updateLodMesh(args){
//         let level = args.level ?? 0        
//         let count = Math.floor(this.core.baseCount/(level+1))
//         let ids = []
//         let zoneOffset = []        
//         let subDivX = Math.max(Math.round(this.core.baseBladeParams.subDivX/(level+1)), 2), subDivY =  Math.max(Math.round(this.core.baseBladeParams.subDivY/(level+1)), 4)
//         let vertexCount = (subDivX + 1) * (subDivY + 1)        

//         for(let i = 0; i < count; i++){         
//             for(let v = 0; v < vertexCount; v++){
//                 ids.push(i, this.noiseOffsetValue)
//                 zoneOffset.push(this.positonOffset.x, this.positonOffset.y, this.positonOffset.z)
//             }
//         }

//         let mesh = new BABYLON.Mesh(`Zone-${this.positonOffset.x},${this.positonOffset.z}|${level}`, this.scene)  

//         mesh.setVerticesData(
//             BABYLON.VertexBuffer.PositionKind,
//             this.core.baseMesh[level].getVerticesData(BABYLON.VertexBuffer.PositionKind)
//         )
//         mesh.setVerticesData(
//             BABYLON.VertexBuffer.NormalKind,
//             this.core.baseMesh[level].getVerticesData(BABYLON.VertexBuffer.NormalKind)
//         )
//         mesh.setVerticesData(
//             BABYLON.VertexBuffer.UVKind,
//             this.core.baseMesh[level].getVerticesData(BABYLON.VertexBuffer.UVKind)
//         )
//         mesh.setIndices(this.core.baseMesh[level].getIndices(false))        
        
//         let idBuffer = new BABYLON.Buffer(this.scene.getEngine(), ids, false, 2)
//         mesh.setVerticesBuffer(idBuffer.createVertexBuffer("bladeId", 0, 2))
//         let zoneOffsetBuffer = new BABYLON.Buffer(this.scene.getEngine(), zoneOffset, false, 3)
//         mesh.setVerticesBuffer(zoneOffsetBuffer.createVertexBuffer("zoneOffset", 0, 3))

//         let bbInfo = new BABYLON.BoundingInfo(
//            BABYLON.Vector3.One().scale(-0.5*this.core.basePatchParams.width).add(this.positonOffset), 
//            BABYLON.Vector3.One().scale(0.5*this.core.basePatchParams.height).add(this.positonOffset)
//         )

//         mesh.setBoundingInfo(bbInfo)

//         return mesh        
//     }
// }

// const NoiseGlobalInclude = 
// `
// //https://www.shadertoy.com/view/ltB3zD
// const float PHI = 1.61803398874989484820459; // F = Golden Ratio 

// vec3 gold_noise(in vec2 xy, in float seed){    
//     return vec3(
//         fract(tan(distance(xy*PHI, xy*seed*111.11))*xy.x),
//         fract(tan(distance(xy*PHI, xy)*seed*222.22)*xy.x),
//         fract(tan(distance(xy*PHI, xy*seed*333.333))*xy.x)
//     );
// }
// `