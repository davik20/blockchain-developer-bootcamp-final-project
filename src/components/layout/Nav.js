import { Link } from 'react-router-dom';
import classes from './Nav.module.css';

function Nav({rentContract, web3, account}) {

  const shorten = (string)=> {
        let start = string.substring(0, 10)
        let end = string.substring((string.length - 1) - 6, string.length)
      const  result = `${start}....${end}`
      return result
  }
  return (
   
    <header className={classes.header}>
      <div className={classes.logo}>V-RENT</div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Dashboard</Link>
          </li>
          <li>
            <Link  to='/my-cars'>My Cars</Link>
          </li>
          <li>
            <Link  to='/new-rent'>Add Rental</Link>
          </li>
          <li>
            <div style={{color: 'white'}}>{shorten(account.toString())}</div>
          </li>
          
        </ul>
      </nav>
    </header>
  );
}

export default Nav;