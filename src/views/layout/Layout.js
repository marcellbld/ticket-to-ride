import React from "react";

function Layout({children}) {
  const isGamePage = children.type.name === 'GamePage';
  return (
    <div className="container-fluid h-100 w-100 d-flex justify-content-center align-items-center" style={{backgroundImage: !isGamePage ? `url(background.jpg)` : '', backgroundPosition: 'center'}}>
        {children}
    </div>
  );
}

export default Layout;
