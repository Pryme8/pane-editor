import {Component, CSSProperties} from 'react'

const NoSelectStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
}

// const SelectStyle: CSSProperties = {
//     WebkitTouchCallout: 'initial',
//     WebkitUserSelect: 'initial',
//     userSelect: 'initial'
// }

const modalResizeAnchorStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    left:0, right:0, top:0, bottom:0,
    ...NoSelectStyle
}

const modalResizeTopStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    left:3, right:3, height:3, top:0,
    cursor:'n-resize'
}
const modalResizeBottomStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    left:3, right:3, height:3, bottom:0,
    cursor:'s-resize'
}
const modalResizeRightStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    top:3, bottom:3, width:3, right:0,
    cursor:'e-resize'
}
const modalResizeLeftStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    top:3, bottom:3, width:3, left:0,
    cursor:'w-resize'
}
const modalResizeTopLeftStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    top:0, height:3, width:3, left:0,
    cursor:'nw-resize'
}
const modalResizeTopRightStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    top:0, height:3, width:3, right:0,
    cursor:'ne-resize'
}
const modalResizeBottomRightStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    bottom:0, height:3, width:3, right:0,
    cursor:'se-resize'
}
const modalResizeBottomLeftStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    bottom:0, height:3, width:3, left:0,
    cursor:'sw-resize'
}

export class ModalResize extends Component<any>{
    render(){
    return (
        <div style={modalResizeAnchorStyle} onMouseDown={this.props.onMouseDown}>
            <div className='left' style={modalResizeLeftStyle}></div>
            <div className='top-left' style={modalResizeTopLeftStyle}></div>
            <div className='top' style={modalResizeTopStyle}></div>
            <div className='top-right' style={modalResizeTopRightStyle}></div>
            <div className='right' style={modalResizeRightStyle}></div>
            <div className='bottom-right' style={modalResizeBottomRightStyle}></div>
            <div className='bottom' style={modalResizeBottomStyle}></div>
            <div className='bottom-left' style={modalResizeBottomLeftStyle}></div>
        </div>
    )
    }
}