
import { makeStyles } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import { createContext, createRef, FC, useContext, useEffect, useRef, useState } from "react"
import { Colors, Shadows } from "../../../constants";

const splitPanelContext = createContext<any>({});

const useStyles = makeStyles({
    splitPane: {
        position:'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'     
    },
    seperator:{
        height:1,
        background:Colors.ModalBackgroundLight,
        position:'relative',
        ...Shadows.OutlineSmall,
        zIndex:101
    },
    overAnchor:{ 
        cursor: 'row-resize',
        position:'absolute',
        display: 'block',       
        background:'rgba(0,0,0, 0.001)',
        left:0, top:-2, right:0, bottom:-2
    }
})

export const SplitPanelVertical: FC<any> = ({children, ...props})=>{
    const classes = useStyles()
    const [topHeight, setTopHeight] = useState(props.topHeight ?? 0);    

    const isDragging = useRef<number>()

    const splitPaneRef = createRef<HTMLDivElement>()

    const onMouseDown = e => {
        isDragging.current = 1
    }

    const onMouseMove = e => {
        if (!isDragging.current) {
            return
        }
       
        let newTopHeight = topHeight + (globalThis.MouseData.clientDirY)
        if(splitPaneRef.current?.parentNode){
            const parentHeight = (splitPaneRef.current?.parentNode as HTMLDivElement).getBoundingClientRect().height
            if(newTopHeight <= 0 ){
                newTopHeight = 0
            }else if( newTopHeight >=  parentHeight - 3){
                newTopHeight = parentHeight - 3
            }
            setTopHeight(newTopHeight)
        }
    }

    const onMouseUp = () => {
        isDragging.current = 0
    }

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp);

        return () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        }
    })

    return (
    <div {...props} className={classes.splitPane} ref={splitPaneRef}>
        <splitPanelContext.Provider value={{ topHeight, setTopHeight }}>
        {children[0]}
        <div className={classes.seperator} onMouseDown={onMouseDown}>
            <div className={classes.overAnchor}></div>
        </div>
        {children[1]}
        </splitPanelContext.Provider>
    </div>
    )
}

const useStyles2 = makeStyles({splitPaneVertical:{
    position:'relative',
    flex: 1,
    overflow:'hidden',
    height: '50%'
}})

export const SplitPanelTop: FC<any> =  ({children, ...props}) => {
    const classes = useStyles2()
    const topRef = createRef<HTMLDivElement>()
    const { topHeight, setTopHeight } = useContext(splitPanelContext);

    useEffect(() => {
        if (!topHeight && topRef.current) {
            setTopHeight(topRef.current.clientHeight);
            topRef.current.style.flex = "none";
        return;
        }

        if(topRef.current){
            topRef.current.style.height = `${topHeight}px`;
        }    
    },[topHeight])
    
    return <div {...props} className={classes.splitPaneVertical} ref={topRef} >
        {children}
    </div>
}

export const SplitPanelBottom: FC<any> =  ({children, ...props}) => {
    const classes = useStyles2()
    return <div {...props} className={classes.splitPaneVertical} >
        {children}
    </div>
}

const useStyles3 = makeStyles({
    splitPane: {
        position:'relative',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    seperator:{
        width:1,
        background:Colors.ModalBackgroundLight,        
        zIndex:101,
        ...Shadows.OutlineSmall,
        position:'relative' 
    },
    overAnchor:{ 
        cursor: 'col-resize',
        position:'absolute',
        display: 'block',
        background:'rgba(0,0,0, 0.001)',
        left:-2, top:0, right:-2, bottom:0,
        zIndex:2
    }
})

export const SplitPanelHorizontal: FC<any> = ({children, ...props})=>{
    const classes = useStyles3()
    const [leftWidth, setLeftWidth] = useState(props.leftWidth ?? 0);    

    const isDragging = useRef<number>()

    const splitPaneRef = createRef<HTMLDivElement>()

    const onMouseDown = e => {
        isDragging.current = 1
    }

    const onMouseMove = e => {
        if (!isDragging.current) {
            return
        }
       
        let newLeftWidth = leftWidth + (globalThis.MouseData.clientDirX)
        if(splitPaneRef.current?.parentNode){
            const parentWidth = (splitPaneRef.current?.parentNode as HTMLDivElement).getBoundingClientRect().width
            if(newLeftWidth <= 0 ){
                newLeftWidth = 0
            }else if( newLeftWidth >=  parentWidth - 3){
                newLeftWidth = parentWidth - 3
            }
            setLeftWidth(newLeftWidth)
        }
    }

    const onMouseUp = () => {
        isDragging.current = 0
    }

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp);

        return () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        }
    })

    return (
    <div {...props} className={classes.splitPane} ref={splitPaneRef}>
        <splitPanelContext.Provider value={{ leftWidth, setLeftWidth }}>
        {children[0]}
        <div className={classes.seperator} onMouseDown={onMouseDown}>
            <div className={classes.overAnchor}></div>
        </div>
        {children[1]}
        </splitPanelContext.Provider>
    </div>
    )
}


const useStyles4 = makeStyles({splitPaneHorizontal:{
    position:'relative',
    flex: 1,
    overflow:'hidden',
    width: '50%',
    height: '100%'
}})


export const SplitPanelLeft: FC<any> =  ({children, ...props}) => {
    const classes = useStyles4()
    const leftRef = createRef<HTMLDivElement>()
    const { leftWidth, setLeftWidth } = useContext(splitPanelContext);

    useEffect(() => {
        if (!leftWidth && leftRef.current) {
            setLeftWidth(leftRef.current.clientWidth);
            leftRef.current.style.flex = "none";
        return;
        }

        if(leftRef.current){
            leftRef.current.style.width = `${leftWidth}px`;
        }    
    },[leftWidth])
    
    return <div {...props} className={classes.splitPaneHorizontal} ref={leftRef} >
        {children}
    </div>
}

export const SplitPanelRight: FC<any> =  ({children, ...props}) => {
    const classes = useStyles4()
    return <div {...props} className={classes.splitPaneHorizontal} >
        {children}
    </div>
}