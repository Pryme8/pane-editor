import { FC } from 'react';
import { Colors, Padding } from '../../constants';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    position: 'relative',
    display: 'inline-block',
    textDecoration: 'none',
    color: 'black',
    background: Colors.OffWhite,
    border: '3px solid black',
    ...Padding.Tiny,
    margin: '0.2em',
    marginLeft: Padding.Small.paddingLeft,
    marginRight: Padding.Small.paddingRight,
    userDrag: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    transition: 'all 0.35s',
    minWidth:'2.5em',
    textAlign:'center',
    '&:hover': {
      paddingLeft: Padding.Small.paddingLeft,
      paddingRight: Padding.Small.paddingRight,
      background: 'black',
      color: Colors.OffWhite,
      marginLeft: Padding.Tiny.paddingLeft,
      marginRight: Padding.Tiny.paddingRight,
    },
    '&:active': {
      paddingLeft: Padding.Small.paddingLeft,
      paddingRight: Padding.Small.paddingRight,
      background: 'gray',
      borderColor: Colors.OffWhite,
      marginLeft: Padding.Tiny.paddingLeft,
      marginRight: Padding.Tiny.paddingRight,
    },
  },
  buttonSelected: {
    position: 'relative',
    display: 'inline-block',
    textDecoration: 'none',
    border: '3px solid black',
    ...Padding.Small,
    margin: '0.2em',
    paddingLeft: Padding.Small.paddingLeft,
    paddingRight: Padding.Small.paddingRight,
    background: 'black',
    color: Colors.OffWhite,
    marginLeft: Padding.Tiny.paddingLeft,
    marginRight: Padding.Tiny.paddingRight,
    minWidth:'1em',
    textAlign:'center'
  },
});

export interface IButtonProps {
  active?: boolean
  onClick?: any
}

export const Button: FC<IButtonProps> = (props) => {
  const classes = useStyles();

  const getOnClick = () => {
    if (props.onClick) {
      const callback = props.onClick;
      return {
        onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          callback(e);
        },
      };
    }
    return {};
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href='#'
      className={props.active ? classes.buttonSelected : classes.button}
      {...getOnClick()}
    >
      {props.children}
    </a>
  );
};
