import { makeStyles } from '@material-ui/core/styles';
import { Text } from '../../constants'
import { Button } from "../inputs";

const useStyles = makeStyles({
    controlsBlock: {
     position:'absolute',
     ...Text.Small,
        top: '0.15em',
        right: '0.1em',
     '& > *':{
        fontSize:'0.65em',
        fontWeight: 'bolder',
        textShadow: '-1px 1px black, -1px 0px black, 0px 1px black'
     }
    }
  });

const MinButton = (props)=>{
    return (
        <Button onClick={(e)=>{
           props.mutators.onMinClick(e)
        }}>_</Button>
    )
}

const CloseButton = (props)=>{
    return (
        <Button onClick={()=>{
            console.log(this)
            props.mutators.onCloseClick()
        }}>X</Button>
    )
}

export const ModalControls = (props) =>{
    const classes = useStyles()
    return (
    <div ref={props.refPassthough} className={classes.controlsBlock+' modal-controls'}>
        {!props.minable && <MinButton mutators={{onMinClick: props.mutators.onMinClick}} />}
        {!props.closable && <CloseButton mutators={{onCloseClick: props.mutators.onCloseClick}}/>}
    </div>)
}