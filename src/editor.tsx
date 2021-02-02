import React, {Component, Fragment} from 'react'
import { IPaneState, Pane } from './components/pane/pane'
import { Placeholder } from './components/loader/placeholder'
import { WindowBindings } from './constants/bindings'
import { v4 as getUid } from 'uuid';
import { BabylonManager } from './babylonManager/core';
import { Nullable } from '@babylonjs/core';

export interface IEditorProps{
    uid:string
}

interface IEditorState{
  rootState?: IPaneState
}

const randomSetofScenes = (number)=>{
  const set:any = []
  for(let i=0; i<number; i++){
    set.push({
      uid:getUid(),
      modalName : 'Test',
      children : [],
      metaData : {
        title:"Scene:"+i,
        draggable:true,
        canResize:true,
        transforms:{
          x:Math.random()*600,
          y:Math.random()*600,
          w:Math.random()*600,
          h:(Math.random()*340)+260
        },
        constraints:{
          h:{min:260}
        }
      }
    },)
  }
  return set
}

export class Editor<T extends IEditorProps, S extends IEditorState > extends Component<T, S>{
   
  public get rootState(){
    return this.state.rootState
  }

  private babylonManager: BabylonManager = new BabylonManager({})
  public getBM():BabylonManager{
    return this.babylonManager
  }

  private setRoot(state:IPaneState){
    this.setState({rootState: state})
  }

  constructor(props, state = {}){
    super(props)
    this.state = {...this.state, ...state}
    WindowBindings.EnableMouseData()
  }

  componentWillMount(){
    const rootState = this.rootState
    if(!rootState){
      this.setRoot(
        {
          uid:getUid(),
          children : [ 
            {
              uid:getUid(),
              modalName : 'GrassBaseScene',
              children : [],
              metaData : {
                title:"Grass Base Mesh",
                draggable:true,
                canResize:true,
                transforms:{
                  x:16,
                  y:16,
                  w:600,
                  h:400
                },
                constraints:{
                  h:{min:260}
                }
              }  
            }
          ],
          metaData : {
            isRoot: true
          }
        }
      )
    }
  }

  public render(){
    return (
      <Fragment>
        { this.rootState !== null && <Pane uid='root' state={this.rootState} mutators={{setRoot:(data)=>{this.setRoot(data)}, getBM:()=>{return this.getBM()}}} />} 
        { !this.rootState && <Placeholder />  }
      </Fragment>
    )
  }

}