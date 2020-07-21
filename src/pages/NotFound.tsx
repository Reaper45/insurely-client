import React from "react";

import styled from "emotion";

const NotFoundWrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  img {
    height: 50px;
    margin-bottom: 1rem;
  }
  .content {
    font-weight: 700;
    font-size: 2rem;
    color: ${props => props.theme.colors.secondary};
  }
`;

const NotFound = () => {
  return (
    <NotFoundWrapper>
      <div>
        <img src={require("../assets/img/logo.png")} alt="" />
        <div className="content">404 | Not Found</div>
      </div>
    </NotFoundWrapper>
  );
};

export default NotFound;
