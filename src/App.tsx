import React from "react";
import { Switch, Route } from "react-router-dom";

import QuotationForm from "pages/form";
import Quotes from "pages/Quotes";

function App() {
  return (
    <>
      <Switch>
        <Route path="/">{() => <QuotationForm />}</Route>
        <Route path="/quotation" component={Quotes} />
      </Switch>
    </>
  );
}

export default App;
