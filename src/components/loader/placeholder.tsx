import {CSSProperties, FC} from 'react'

const placeholderStyle: CSSProperties = {
    display:'block',
    position:'absolute',
    left:0, top:0, right:0, bottom:0,
    background:'rgb(80,80,90)'
}

export const Placeholder : FC = ()=>{
    return (
        <div style={placeholderStyle}></div>
    )
}