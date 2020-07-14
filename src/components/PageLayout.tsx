import React from "react";

import Header from "./Header";
import { Main } from "./ui";

const PageLayout: React.FC<{
  children: <T>(props: T) => React.ReactElement;
  title: string;
}> = ({ children, title, ...props }) => {
  return (
    <>
      <Header title={title} />
      <Main>{children(props)}</Main>
    </>
  );
};

export default PageLayout;
