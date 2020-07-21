import React from "react";

import Header from "./Header";
import { Main } from "./ui";

const PageLayout: React.FC<{
  children: <T>(props: T) => React.ReactElement;
  title?: string;
  onLogoClick?: (props: any) => void;
  cancelableHeader?: boolean;
}> = ({ children, onLogoClick, title, cancelableHeader, ...props }) => {
  return (
    <>
      <Header
        onLogoClick={onLogoClick}
        title={title}
        cancelable={cancelableHeader}
      />
      <Main>{children(props)}</Main>
    </>
  );
};

export default PageLayout;
