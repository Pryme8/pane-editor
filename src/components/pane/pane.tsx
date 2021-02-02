import { Nullable } from '@babylonjs/core'
import React, {Component, CSSProperties, Fragment} from 'react'


import {ModalMap} from '../../windows/map'

const rootStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    width:'100%',
    height:'100%',
    left:0, top:0,
    background:'rgb(120, 120, 140)'
}

export interface IPaneProps{
    uid:string
    state?:IPaneState
    mutators?: any
}

export interface IPaneState{
    uid: string
    modalName?: string
    children?: IPaneState[]
    metaData?: Nullable<any>
    transforms?:IPaneTransforms
}

export interface IPaneTransforms{
    x?: number | string
    y?: number | string
    z?: number
    w?: number | string
    h?: number | string
}

export class Pane<T extends IPaneProps, S extends IPaneState> extends Component<T, S>{
    public get isRoot(){
        return this.state.metaData?.isRoot || false
    }

    public get children(){
        return this.state.children
    }

    public mutators:any = {
        getBM : null
    }

    constructor(props){
        super(props)
        this.state = {...props.state, uid:props.uid}  
        this.mutators = {...props.mutators}     
        console.log(this)
    }

    closeChild(uid){
        const newChildren = this.children?.filter((child)=>{
            if(child.uid === uid){  
                return false
            }
            return true
        })
        this.setState({
            children: newChildren
        })
    }

    componentDidUpdate(){
        console.log("UPDATED", this)
    }

    childrenRender(){
        return (
        <Fragment>
            {
                this.children?.map((child, index)=>{
                    console.log(child)
                    const ModalType = ModalMap[child.modalName ?? ''] ?? null
                    return (
                        <Fragment key={index}>
                            {!child.modalName && <Pane {...child} mutators={this.props.mutators}/>}
                            {ModalType && <ModalType {...child} mutators={{closeChild:(uid)=>{this.closeChild(uid)}, getBM:this.mutators.getBM}}/>}
                        </Fragment>
                    )
                })
            }
        </Fragment>
        )
    }

    render(){
        return (
            <Fragment>
                {this.isRoot && <div className='root-pane' style={{...rootStyle, pointerEvents:'none'}}>
                    { this.childrenRender() }
                </div>}
                {!this.isRoot && <div className='pane' style={{pointerEvents:'none'}}>
                    { this.props.children }
                    { this.childrenRender() }
                </div>}
            </Fragment>
        )
    }
}