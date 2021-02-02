import { Nullable } from "@babylonjs/core";
import { Component, createRef, CSSProperties } from "react";
import { Colors } from "../../constants/colors";
import { Padding } from "../../constants/padding";
import { IPaneState } from "../pane";
import { ModalResize } from "./modalResize";
import { ModalControls } from "./modalControls";

const NoSelectStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
}

const SelectStyle: CSSProperties = {
    WebkitTouchCallout: 'initial',
    WebkitUserSelect: 'initial',
    userSelect: 'initial'
}

const modalWrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    pointerEvents: 'initial',
    padding:'3px',
    width: 'auto',
    height: 'auto',
    backgroundColor: 'black',
    ...NoSelectStyle
}

export interface IModalProps{
    uid:string
    state?: IModalState
    onInit?: Function
}

export interface IModalState extends IPaneState{
    uid:string
    title?: string
    enabled?: boolean
    locked?: boolean
    transforms?: IModalTransforms
    constraints?: IModalConstraints
    draggable?: boolean
    minable?: boolean
    canResize?: boolean
    minimized?: boolean
    closeable?: boolean
    absCenter?: boolean
}

export interface IModalTransforms{
    x?: number | string
    y?: number | string
    z?: number
    w?: number | string
    h?: number | string
}
export interface IModalConstraints {
    x?:IModalConstraintsMinMax
    y?:IModalConstraintsMinMax
    w?:IModalConstraintsMinMax
    h?:IModalConstraintsMinMax
}

export interface IModalConstraintsMinMax{
    min?: number
    max?: number
}

export class Modal<T extends IModalProps, S extends IModalState> extends Component<T, S>{
    
    public onInit: Nullable<Function> = null

    public get uid():string{
        return this.props.uid
    }

    public get enabled():boolean{
        return this.state?.enabled ?? true
    }
    
    public get draggable():boolean{
        return this.state?.draggable ?? false
    }

    public get minable():boolean{
        return this.state?.minable ?? false
    }

    public get closeable():boolean{
        return this.state?.closeable ?? false
    }

    public get minimized():boolean{
        return this.state?.minimized ?? false
    }

    public get title():Nullable<string>{
        return this.state?.title ?? null
    }

    public get absCenter():boolean{
        return this.state?.absCenter ?? false
    }

    public get transforms():IModalTransforms{
        return this.state?.transforms ?? {}
    }

    public get constraints():IModalConstraints{
        return this.state?.constraints ?? {}
    }

    public get canResize():boolean{
        return this.state?.canResize ?? false
    }

    private ref = createRef<HTMLDivElement>()
    public getRef(){
        return this.ref
    }
    private headRef = createRef<HTMLDivElement>()
    private titleRef = createRef<HTMLDivElement>()
    private controlRef = createRef<HTMLDivElement>()

    constructor(props){
        super(props)
        this.state = {...props.state, ...{...props.metaData}, uid:props.uid}
        this.mutators = {...props.mutators}
        this.onInit = props.onInit ?? this.onInit
    }

    componentWillMount(){
        if(this.onInit){
            this.onInit()
        }
    }
    
    public content():any{
        return (
            ""
        )
    }

    public render(){        
        const currentStyle: CSSProperties = {
            ...modalWrapperStyle
        }
        
        if(this.absCenter){
            currentStyle.position = 'absolute'
            currentStyle.left = '50%'
            currentStyle.top = '50%'
            currentStyle.transform = 'translate(-50%, -50%)'
        }

        if (this.draggable) {
            currentStyle.position = 'absolute'
            currentStyle.left = this.transforms?.x ?? 0;
            currentStyle.top = this.transforms?.y ?? 0;
            currentStyle.zIndex = this.transforms?.z ?? 0;
            currentStyle.width = this.transforms?.w ?? 'auto';
            currentStyle.height = this.transforms?.h ?? 'auto';
            currentStyle.WebkitBoxShadow = '1px 1px 3px 1px rgba(60,60,60,0.2)';
            currentStyle.boxShadow = '1px 1px 3px 1px rgba(60,60,60,0.2)';
            currentStyle.transform = '';
        }

        if(this.minimized){
            currentStyle.height = this.getModuleHeaderMinHeight()
        }

        const headMutators = {
            onCloseModal: ()=>{this.mutators.closeChild(this.uid)},
            onModalMinToggle: (e)=>{ this.onModalMinToggle(e)},
            onModalDragStart:(e)=>{ this.onModalDragStart(e); console.log(this.uid)}
        }

        return this.enabled ? (
            <ModalBody refPassthough={this.ref} canResize={this.canResize} style={{...currentStyle}} mutators={{onModalResizeStart:(e)=>{ this.onModalResizeStart(e)}}}>
                <ModalHead 
                    refPassthough={{head : this.headRef, title: this.titleRef, controls: this.controlRef}}
                    title={this.title} draggable={this.draggable}
                    mutators={{...headMutators}}
                    minable={this.minable}
                    closeable={this.closeable}
                    />
                {<ModalContent>{this.content()}</ModalContent>}
            </ModalBody>
        ):
        null
    }

    componentDidUpdate(){
        //console.log("UPDATE")
    }

    mutators:any = {}

    getRefParent(): any{
        return this.ref.current?.parentNode ?? null
    }

    getRefParentRect(){
        return this.getRefParent()?.getBoundingClientRect() ?? {
            bottom: 0,
            height: 600,
            left: 0,
            right: 0,
            top: 0,
            width: 800,
            x: 0,
            y: 0
        }
    }

    sortChildrenZ(){
        const children = [...this.getRefParent().children]
        if(children.length){
            const modals = children.filter((el)=>{
                return el.classList.contains('modal-wrapper')
            })
            let i = 0
            const sorted = modals.map((child)=>{
                console.log(child.style.zIndex)
                if(!child.style.zIndex){
                    child.style.zIndex = (i++)
                }
                return child
            }).sort((a,b)=>{return a.style.zIndex-b.style.zIndex})
            i = 0
            const reduced = sorted.map((child)=>{
                child.style.zIndex = i++
                return child
            })          
            const ref = this.getRef().current
            if(ref){
                ref.style.zIndex = (children.length+1)+''
            }
        }        
    }

    onModalDragStart(e){    
        this.sortChildrenZ()     
        const onDragRun = (_e)=>{
            const parentRect = this.getRefParentRect()
            const rect:any = this.ref.current?.getBoundingClientRect()
            const newTrans = {...this.transforms}         

            if( _e.clientX < 0 || 
                _e.clientY < 0 ||
                _e.clientX > parentRect.width ||
                _e.clientY > parentRect.height
            ){
                newTrans.x = Math.min(Math.max(0, _e.clientX), parentRect.width - rect.width)
                newTrans.y = Math.min(Math.max(0, _e.clientY), parentRect.height - rect.height)
            }else{                            
                newTrans.x = Math.min(Math.max(0, (rect.x ?? newTrans.x ?? 0 ) + _e.movementX), parentRect.width - rect.width)
                newTrans.y = Math.min(Math.max(0, (rect.y ?? newTrans.y ?? 0 ) + _e.movementY), parentRect.height - rect.height)               
            }
            this.setState({transforms:newTrans})
        }
        this.mutators.onDragRun = {listener:'mousemove', callback:onDragRun}

        const onModalDragOver = ()=>{
            console.log("MOUSE UP - DRAG", window)
            window.removeEventListener('mousemove', this.mutators.onDragRun.callback)
            window.removeEventListener('mouseup', this.mutators.onModalDragOverUp.callback)
            window.removeEventListener('mouseleave', this.mutators.onModalDragOverLeave.callback)
            this.mutators.onDragRun = null
            this.mutators.onModalDragOverUp = null
            this.mutators.onModalDragOverLeave = null
        }
        this.mutators.onModalDragOverUp =  {listener:'mouseup', callback:onModalDragOver}
        this.mutators.onModalDragOverLeave =  {listener:'mouseleave', callback:onModalDragOver}

        window.addEventListener('mousemove', this.mutators.onDragRun.callback)
        window.addEventListener('mouseup', this.mutators.onModalDragOverUp.callback)
        window.addEventListener('mouseleave', this.mutators.onModalDragOverLeave.callback, {passive:true}) 
    }

    onModalMinToggle(e){
        this.sortChildrenZ()         
        this.setState({minimized: !this.minimized})
    }

    getHeaderRef(){
        return this.headRef.current ?? null
    }

    getHeaderRefRect(){
        return this.getHeaderRef()?.getBoundingClientRect()
    }

    getModuleHeaderMinHeight(){      
        return (this.getHeaderRefRect()?.height ?? 0)
    }

    getTitleRef(){
        return this.titleRef.current ?? null
    }

    getTitleRefRect(){
        return this.getTitleRef()?.getBoundingClientRect()
    }

    getModuleTitleMinWidth(){      
        return (this.getTitleRefRect()?.width ?? 0)
    }

    getControlsRef(){
        return this.titleRef.current ?? null
    }

    getControlsRefRect(){
        return this.getControlsRef()?.getBoundingClientRect()
    }

    getModuleControlsMinWidth(){      
        return (this.getControlsRefRect()?.width ?? 0)
    }

    getModuleHeadMinWidth(){
        return this.getModuleTitleMinWidth()+this.getModuleControlsMinWidth()+6
    }

    leftScale(transforms, rect, parentRect, minWidth, change){
        if((this.minimized === true)){
            return
        }   
        if(transforms.w === undefined){
            transforms.w = rect.width
        }
        if(transforms.x === undefined){
            transforms.x = rect.x
        }
        transforms.x = Math.min(Math.max(0, transforms.x + change), parentRect.width - minWidth)
        transforms.w = Math.max(minWidth, transforms.w - change)
    }

    topScale(transforms, rect, parentRect, minHeight, change){
        if((this.minimized === true)){
            return
        }   
        if(transforms.h === undefined){
            transforms.h = rect.height
        }
        if(transforms.y === undefined){
            transforms.y = rect.y
        }
        transforms.y = Math.min(Math.max(0, transforms.y + change), parentRect.height - minHeight)
        transforms.h = Math.max(minHeight, transforms.h - change)
    }

    rightScale(transforms, rect, parentRect, minWidth){
        if((this.minimized === true)){
            return
        }
        if(transforms.w === undefined){
            transforms.w = rect.width
        }
        transforms.w = Math.min(Math.max(minWidth, transforms.w + globalThis.MouseData.clientDirX), parentRect.width - rect.x)
      }

    bottomScale( transforms, rect, parentRect, minHeight){
        if((this.minimized === true)){
            return
        }
        if(transforms.h === undefined){
            transforms.h = rect.height
        }
 
        transforms.h = Math.min(Math.max(minHeight, transforms.h + globalThis.MouseData.clientDirY), parentRect.height - rect.y)
    }

    onModalResizeStart(e){ 
        this.sortChildrenZ()       
        const resizeSwitch = e.target.classList[0]
        const transTemps:any = {
            newTrans : null
        }

        const minHeight = this.getModuleHeaderMinHeight() + (this.constraints?.h?.min ?? 0)
        const minWidth = this.getModuleHeadMinWidth() + (this.constraints?.w?.min ?? 0)
        
        const onResizeRun = (_e)=>{
            const parentRect = this.getRefParentRect()
            const rect:any = this.ref.current?.getBoundingClientRect()  
            transTemps.newTrans = {...this.transforms}
            switch(resizeSwitch){
                case 'left':
                    if( _e.clientX < 0 ||                      
                        (transTemps.newTrans.w <= minWidth && globalThis.MouseData.clientDirX > 0)
                    ){
                        return
                    }else{                            
                        this.leftScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirX)            
                    }
                break;
                case 'top-left':
                    if( _e.clientY < 0 ||                      
                        (transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY > 0)
                    ){
                        return
                    }else{                            
                        this.topScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirY)            
                    }
                    if( _e.clientX < 0 ||                      
                        (transTemps.newTrans.w <= minWidth && globalThis.MouseData.clientDirX > 0)
                    ){
                        return
                    }else{                            
                        this.leftScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirX)            
                    }
                break;
                case 'top':
                    if( _e.clientY < 0 ||                      
                        (transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY > 0)
                    ){
                        return
                    }else{                            
                        this.topScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirY)            
                    }
                break;
                case 'top-right':
                    if( _e.clientY < 0 ||                      
                        (transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY > 0)
                    ){
                        return
                    }else{                            
                        this.topScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirY)            
                    }
                    if( _e.clientX < 0 ||                      
                        _e.clientX > parentRect.width                   
                    ){
                        transTemps.newTrans.w = parentRect.width - rect.x - 6
                    }else{                            
                        this.rightScale(transTemps.newTrans, rect, parentRect, minWidth)            
                    }
                break;
                case 'right':
                    if( _e.clientX < 0 ||                      
                        _e.clientX > parentRect.width                   
                    ){
                        transTemps.newTrans.w = parentRect.width - rect.x - 6
                    }else{                            
                        this.rightScale(transTemps.newTrans, rect, parentRect, minWidth)            
                    }
                break;
                case 'bottom':
                    if((transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY < 0)){
                        return
                    }
                    if(                      
                        _e.clientY > parentRect.height                   
                    ){
                        transTemps.newTrans.h = parentRect.height - rect.y - 6
                    }else{                            
                        this.bottomScale(transTemps.newTrans, rect, parentRect, minHeight)           
                    }
                break;
                case 'bottom-right':
                    if(!(transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY < 0)){
                        if(                      
                            _e.clientY > parentRect.height                   
                        ){
                            transTemps.newTrans.h = parentRect.height - rect.y - 6
                        }else{                            
                            this.bottomScale(transTemps.newTrans, rect, parentRect, minHeight)           
                        }
                    }                   
                    if( _e.clientX < 0 ||                      
                        _e.clientX > parentRect.width                   
                    ){
                        transTemps.newTrans.w = parentRect.width - rect.x - 6
                    }else{                            
                        this.rightScale(transTemps.newTrans, rect, parentRect, minWidth)            
                    }
                break;
                case 'bottom-left':
                    if(!(transTemps.newTrans.h <= minHeight && globalThis.MouseData.clientDirY < 0)){
                        if(                      
                            _e.clientY > parentRect.height                   
                        ){
                            transTemps.newTrans.h = parentRect.height - rect.y - 6
                        }else{                            
                            this.bottomScale(transTemps.newTrans, rect, parentRect, minHeight)           
                        }
                    } 
                    if( _e.clientX < 0 ||                      
                        (transTemps.newTrans.w <= minWidth && globalThis.MouseData.clientDirX > 0)
                    ){
                        return
                    }else{                            
                        this.leftScale(transTemps.newTrans, rect, parentRect, minWidth, globalThis.MouseData.clientDirX)            
                    }
                break;
            }        
            this.setState({transforms:transTemps.newTrans})
        }

        this.mutators.onResizeRun = {listener:'mousemove', callback:onResizeRun}

        const onModalResizeOver = ()=>{
            console.log("MOUSE UP - RESIZE", window)
            window.removeEventListener('mousemove', this.mutators.onResizeRun.callback)
            window.removeEventListener('mouseup', this.mutators.onModalResizeOverUp.callback)
            window.removeEventListener('mouseleave', this.mutators.onModalResizeOverLeave.callback)
            this.mutators.onResizeRun = null
            this.mutators.onModalResizeOverUp = null
            this.mutators.onModalResizeOverLeave = null
        }
        this.mutators.onModalResizeOverUp =  {listener:'mouseup', callback:onModalResizeOver}
        this.mutators.onModalResizeOverLeave =  {listener:'mouseleave', callback:onModalResizeOver}

        window.addEventListener('mousemove', this.mutators.onResizeRun.callback)
        window.addEventListener('mouseup', this.mutators.onModalResizeOverUp.callback)
        window.addEventListener('mouseleave', this.mutators.onModalResizeOverLeave.callback, {passive:true}) 
    }

    componentWillUnmount(){
        console.log("DESTORYING", this)
        Object.keys(this.mutators).forEach( e =>{
            const m = this.mutators[e]
            if(m){
                window.removeEventListener(m.listener, m.callback)
            }
        })
    }
}

const modalBodyStyle: CSSProperties = {
    position: 'relative',
    display: 'block',
    pointerEvents: 'initial',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.ModalBackgroundLight,
    ...NoSelectStyle,
    overflow:'hidden'
}

export interface IModalBodyProps{
    refPassthough: any
    canResize?: boolean
    style?:CSSProperties
    mutators?: any
}

class ModalBody<T extends IModalBodyProps, S = {}> extends Component<T, S>{
    get ref(){
        return this.props.refPassthough
    }
    public get canResize():boolean{
        return this.props?.canResize ?? false
    }
    public get mutators():Nullable<any>{
        return this.props?.mutators ?? null
    }
    constructor(props, state){
        super(props)
        this.state = {...state} 
    }
    public render(){
        return (
            <div ref={this.ref} className='modal-wrapper' style={this.props.style}>
                {this.canResize && <ModalResize onMouseDown={this.mutators.onModalResizeStart ?? null}/>}
                <div className='modal-body' style={modalBodyStyle}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const modalHeadStyle: CSSProperties = {
    position: 'relative',
    display: 'block',
    pointerEvents: 'initial',
    width: 'auto',
    height: 'auto',
    backgroundColor: Colors.ModalBackgroundDark
}

const modalTitleStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    pointerEvents: 'none',
    width: 'auto',
    height: 'auto',
    fontWeight:'bolder',
    ...Padding.Small,
    paddingLeft : Padding.Normal.paddingLeft,
    ...NoSelectStyle
}

export interface IModalHeadProps{
    refPassthough: any
    title?: Nullable<string>
    draggable?: boolean
    minable?: boolean
    closeable?: boolean
    mutators?: any
}

class ModalHead<T extends IModalHeadProps, S = {}> extends Component<T, S>{

    public get title():Nullable<string>{
        return this.props?.title ?? null
    }

    public get mutators():Nullable<any>{
        return this.props?.mutators ?? null
    }

    public get refPassthough():any{
        return this.props?.refPassthough
    }
    
    constructor(props, state){
        super(props)
        this.state = {...state} 
    } 

    public render(){
        const currentHeadStyle = {
            ...modalHeadStyle,
            cursor : this.props.draggable?'move':'initial'
        }
        return this.title?(
            <div ref={this.refPassthough.head} className='modal-head' style={currentHeadStyle} onMouseDown={this.mutators.onModalDragStart ?? null}>
                <div className='modal-title' ref={this.refPassthough.title} style={modalTitleStyle}>{this.title}</div>
                {<ModalControls refPassthough={this.refPassthough.controls} mutators={{onMinClick:this.mutators.onModalMinToggle, onCloseClick:this.mutators.onCloseModal}} minable={this.props.minable} closeable={this.props.closeable} />}                
            </div>
        ):null
    }
}

const modalContentStyle: CSSProperties = {
    position: 'absolute',
    display: 'block',
    width: '100%',
    height:'calc(100% - 2.15em)',
    bottom: 0,
    ...SelectStyle
}

export interface IModalContentProps{}
class ModalContent<T extends IModalContentProps, S = {}> extends Component<T, S>{
    constructor(props, state){
        super(props)
        this.state = {...state} 
    }

    public render(){
        return (
            <div className='modal-content' style={modalContentStyle}>
                {this.props.children}
            </div>
        )
    }
}

