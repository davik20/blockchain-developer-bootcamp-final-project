import { Route, Switch,useLocation } from 'react-router-dom';
import Form from './pages/Form';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Layout from './components/layout/Layout';
import EditRent from './pages/EditRent';
import VehicleDetails from './pages/VehicleDetails';
import { useEffect } from 'react';

function Main({ rentContract, web3, account , forceUpdate}) {

  return (
    <Layout rentContract={rentContract} web3={web3} account={account}>
      <Switch>
        <Route path={`/blockchain-developer-bootcamp-final-project/`} exact>
          <Dashboard
            rentContract={rentContract}
            web3={web3}
            account={account}
            forceUpdate={forceUpdate}
          />
        </Route>
        <Route
          path="/blockchain-developer-bootcamp-final-project/detail/:id"
          render={(props) => (
            <VehicleDetails
              {...props}
              rentContract={rentContract}
              web3={web3}
              account={account}
              forceUpdate={forceUpdate}
            />
          )}
        />
        <Route
          path="/blockchain-developer-bootcamp-final-project/rent/:id"
          render={(props) => (
            <EditRent
              {...props}
              rentContract={rentContract}
              account={account}
              web3={web3}
              forceUpdate={forceUpdate}
            />
          )}
        />
        <Route
          path="/blockchain-developer-bootcamp-final-project/my-cars"
          render={(props) => (
            <Cars
              {...props}
              rentContract={rentContract}
              account={account}
              web3={web3}
              forceUpdate={forceUpdate}
            />
          )}
        />

        <Route path="/blockchain-developer-bootcamp-final-project/new-rent">
          <Form rentContract={rentContract} account={account} web3={web3} forceUpdate={forceUpdate} />
        </Route>
      </Switch>
    </Layout>
  );
}

export default Main;
