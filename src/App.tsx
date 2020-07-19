import React from "react";
import { Switch, Route } from "react-router-dom";

import QuotationForm from "pages/form";
import Quotes from "pages/Quotes";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          {(props) => <QuotationForm {...props} />}
        </Route>
        <Route path="/quotations" component={Quotes} />
      </Switch>
    </>
  );
}

export default App;
