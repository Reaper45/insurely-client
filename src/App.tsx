import React from "react";
import { Switch, Route } from "react-router-dom";

import QuotationForm from "pages/form";
import Quotes from "pages/quote";
import Complete from "pages/Complete";
import NotFound from "pages/NotFound";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          {(props) => <QuotationForm {...props} />}
        </Route>
        <Route exact path="/quotations" component={Quotes} />
        <Route path="/quotations/complete" component={Complete} />
        <Route path="" component={NotFound} />
      </Switch>
    </>
  );
}

export default App;
