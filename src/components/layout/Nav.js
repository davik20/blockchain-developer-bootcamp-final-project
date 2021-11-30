import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classes from './Nav.module.css';
import hamClass from './Hamburger.module.css';

function Nav({ rentContract, web3, account }) {
  const [navToggle, setNavToggle] = useState(false);
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
    setNavToggle(false);
  }, [location.pathname]);
  const shorten = (string) => {
    let start = string.substring(0, 10);
    let end = string.substring(string.length - 1 - 6, string.length);
    const result = `${start}....${end}`;
    return result;
  };
  return (
    <header className={classes.header}>
      <Link to="/blockchain-developer-bootcamp-final-project/">
        <div className={classes.logo}>V-RENTALS</div>
      </Link>
      <div className="d-block d-lg-none">
        <button
          className={`${classes.toggleBtn} ${hamClass.hamburger} ${
            hamClass.hamburgerElastic
          } ${navToggle ? hamClass.isActive : ''}`}
          type="button"
          onClick={() => setNavToggle(!navToggle)}
        >
          <span className={hamClass.hamburgerBox}>
            <span className={hamClass.hamburgerInner}></span>
          </span>
        </button>
      </div>
      <nav className={`${classes.navBar} ${navToggle ? classes.show : ''}`}>
        <ul>
          <li>
            <Link
              className={location.pathname === '/blockchain-developer-bootcamp-final-project/' ? classes.isActive : ''}
              to="/blockchain-developer-bootcamp-final-project/"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={
                location.pathname === '/blockchain-developer-bootcamp-final-project/my-cars' ? classes.isActive : ''
              }
              to="/blockchain-developer-bootcamp-final-project/my-cars"
            >
              My Cars
            </Link>
          </li>
          <li>
            <Link
              className={
                location.pathname === '/blockchain-developer-bootcamp-final-project/new-rent' ? classes.isActive : ''
              }
              to="/blockchain-developer-bootcamp-final-project/new-rent"
            >
              Add Rental
            </Link>
          </li>
          <li>
            <div style={{ color: 'white' }}>{shorten(account.toString())}</div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
