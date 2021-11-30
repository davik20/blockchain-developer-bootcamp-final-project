import { Route, Switch } from 'react-router-dom';
import Form from './pages/Form';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Layout from './components/layout/Layout';
import EditRent from './pages/EditRent';
import VehicleDetails from './pages/VehicleDetails';
import { useEffect } from 'react';

function Main({ rentContract, web3, account }) {

  return (
    <Layout rentContract={rentContract} web3={web3} account={account}>
      <Switch>
        <Route path="/" exact>
          <Dashboard
            rentContract={rentContract}
            web3={web3}
            account={account}
          />
        </Route>
        <Route
          path="/detail/:id"
          render={(props) => (
            <VehicleDetails
              {...props}
              rentContract={rentContract}
              web3={web3}
              account={account}
            />
          )}
        />
        <Route
          path="/rent/:id"
          render={(props) => (
            <EditRent
              {...props}
              rentContract={rentContract}
              account={account}
              web3={web3}
            />
          )}
        />
        <Route
          path="/my-cars"
          render={(props) => (
            <Cars
              {...props}
              rentContract={rentContract}
              account={account}
              web3={web3}
            />
          )}
        />

        <Route path="/new-rent">
          <Form rentContract={rentContract} account={account} web3={web3} />
        </Route>
      </Switch>
    </Layout>
  );
}

export default Main;
