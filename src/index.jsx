import React from 'react';
import ReactDOM from 'react-dom/client';
import { Game, GameX } from 'Components'
import 'Components/Game/gameStyles.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GameX/>
  </React.StrictMode>
);


