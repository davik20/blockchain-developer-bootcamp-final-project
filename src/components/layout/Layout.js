import Nav from './Nav';

function Layout({ rentContract, web3, account, children }) {
  return (
    <div className="container">
      <Nav account={account} rentContract={rentContract} web3={web3} />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
