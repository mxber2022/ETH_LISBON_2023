import { Web3Button } from '@web3modal/react'
import "./Nav.css";
import Subscribe from '../Subscribe/Subscribe';

function Nav () {
    return(
        <>
            <nav className="nav">
                <div>
                    <w3m-button />
                    <Subscribe/>
                </div>              
            </nav>
        </>
    );
}

export default Nav;