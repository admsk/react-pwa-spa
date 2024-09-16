import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../../src/sidebar.css';

const Layout = () => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

  }, []);


  const [isOpen, setIsOpen] = useState(windowSize.width > 500 ? true : false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const cssCardapio = isOpen ? 'imgMenu' : 'imgMenu-closed';

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <img src={require('../../../src/assets/cardapio.png')} alt="Logo" onClick={toggleSidebar} className={cssCardapio} />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/details">Horses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;