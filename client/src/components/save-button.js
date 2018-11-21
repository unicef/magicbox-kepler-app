import React from 'react';

const SaveButton = ({saveable, onClick, children}) => {
    if (saveable) {
      return (
        <button className='saveConfigButton' onClick={onClick}>Save Config</button>
      );
    }
}
export default SaveButton;
