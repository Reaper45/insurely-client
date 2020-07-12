import React from 'react';
import { Switch, Route } from "react-router-dom";

import Header from "components/Header";
import QuotationForm from "pages/form";
import Quotes from "pages/Quotes";

function App() {
  return (
    <>
      <Header page="1" />
      <Switch>
        <Route path="/">{() => <QuotationForm />}</Route>
        <Route path="/quotation" component={Quotes} />
      </Switch>
    </>
  );
}

export default App;
