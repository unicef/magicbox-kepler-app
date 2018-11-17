import React from 'react';

const Button = ({saveable, onClick, children}) => {
    if (saveable) {
      return (
        <button onClick={onClick}>{children}</button>
      );
    } else {
      return (<span></span>)
    }
}
export default Button;
