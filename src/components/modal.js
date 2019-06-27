import React from 'react';
import styled from 'styled-components';

const Modal = ({ handleClose, show, children }) => {
  const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: ${props => props.isShown ? 'block' : 'none'};
    z-index: 1;
  `;

  const Main = styled.section`
    position:fixed;
    background: white;
    width: 80%;
    height: auto;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  `;
  return (
    <Wrapper isShown={show}>
      <Main>
        {children}
        <button onClick={handleClose}>close</button>
      </Main>
    </Wrapper>
  );
};

export default Modal;