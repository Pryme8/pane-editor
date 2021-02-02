import React, { Component } from 'react';
import { CSSProperties } from '@material-ui/styles';
import { Colors } from '../../../constants';

export interface IPanelProps{
  mutators?:any
  selectedTab?:number
}

const panelStyle: CSSProperties = {
    position:'absolute',
    display:'block',
    width:'100%',
    height:'100%',
    top:0,
    left:0    
}

const panelContentStyle: CSSProperties = {
    position:'relative',
    display:'block',
    overflowY:'auto',
    width:'100%',
}

export class TabPanel extends Component<any, any>{
    constructor(props, state){
        super(props)
        this.state = {...state, selectedTab: props.selectedTab ?? 0}
    }
    
    render(){        
        const sections = Array.isArray(this.props?.children)?[...this.props.children]:[this.props.children]
                
        const panelHeightStyle: CSSProperties = {
            height : (sections.length > 1)?'calc(100% - 1.5em)':'100%'
        }   

        return (
        <div style={{...panelStyle, ...this.props.style}}>
            {
                (sections.length > 1) && 
                <PanelTabs {...this.props} onTabClick={(index)=>{
                    this.setState({
                        selectedTab:index
                    })
                }}
                selectedTab={this.state.selectedTab}
                ></PanelTabs>
            }
        
            <div style={{...panelContentStyle, ...panelHeightStyle}} >
                {
                    sections.map((section, index)=>{
                        return (
                            <React.Fragment key={index}>
                                {this.state.selectedTab === index && <PanelSection title={(section as any).props?.title ?? index} {...(section as any).props} selectedTab={this.state.selectedTab} isCurrent={true} />}
                                {this.state.selectedTab !== index && <PanelSection title={(section as any).props?.title ?? index} {...(section as any).props} selectedTab={this.state.selectedTab} isCurrent={false}/>}
                            </React.Fragment>
                        )
                    })
                }
            </div>   
        </div>
        )
    }
}

const panelTabsStyle: CSSProperties = {
    position:'relative',
    display:'block',
    height:'1.5em',
    paddingTop:'0.1em',
    background:Colors.Gray
}

export class PanelTabs extends Component<any, any>{
    constructor(props, state){
        super(props)
        this.state = {...state, selectedTab: props.selectedTab ?? 0}
    }

    render(){
        const selectedTab = this.props.selectedTab ?? 0  
        console.log(this.props)      
        const sections = Array.isArray(this.props?.children)?[...this.props.children]:[this.props.children]
        return (
            <div style={{...panelTabsStyle}}>
                {                    
                    sections.map((section, index)=>{
                        return (
                            <React.Fragment key={index}>
                                {selectedTab === index && <PanelTab isCurrent={true} title={(section as any).props?.title ?? index} index={index} onTabClick={this.props.onTabClick}/>}
                                {selectedTab !== index && <PanelTab isCurrent={false} title={(section as any).props?.title ?? index} index={index} onTabClick={this.props.onTabClick}/>}
                            </React.Fragment>                               
                        )
                    })
                }
            </div>
        )
    }  
}

const panelTabStyle: CSSProperties = {
    display: 'inline-block',
    width: 'auto',
    height: '100%',
    fontWeight:'bold',   
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    textAlign: 'center',
    marginRight:'0.32em',
    textDecoration:'none',
    cursor:'pointer'
}

export interface IPanelTabProps{
    title?:string
    isCurrent?:boolean
    mutators?:any
    frameUid?:string
    modalUid?:string
    index?:number
    onTabClick: Function
}

export class PanelTab extends Component<any, any>{
    constructor(props, state){
        super(props)
        this.state = {...state, selectedTab: props.selectedTab ?? 0}
    }

    render(){
        const isCurrentStyle: CSSProperties = {
            background: (this.props.isCurrent)?Colors.OffWhite:Colors.DarkWhite,
            color: (this.props.isCurrent)?'black':Colors.DarkGray
        }  

        return (
            <a href='#' style={{...panelTabStyle, ...isCurrentStyle}} onClick={()=>{this.props.onTabClick(this.props.index)}}>{this.props.title}</a>
        )
    }  
}

const panelSectionStyle: CSSProperties = {
    width:'100%',
    background: Colors.OffWhite
}

export interface IPanelSectionProps{
    title?:string
    isCurrent?:boolean
    style?:CSSProperties
    mutators?:any
    frameUid?:string
    modalUid?:string
    index?:number
    sectionScroll?:number
}

export class PanelSection extends Component<any, any>{
    constructor(props, state){
        super(props)
        this.state = {...state, selectedTab: props.selectedTab ?? 0}
    }

    render(){
        const displayStyle = {
            display:(this.props.isCurrent)?'block':'none'
        }   

        return (
            <div style={{...panelSectionStyle, ...this.props.style, ...displayStyle}}>{this.props.children}</div>
        )
    }  
}

