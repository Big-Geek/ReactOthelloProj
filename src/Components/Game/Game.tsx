import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'Components/Game/gameStyles.css';
import { BoardX, CollectionsNamespace as CN, UtilitiesNamespace as UN } from 'Components';

export const GameX = () => {
    const [thisTurn, setTurn ] = useState(CN.GamePlayer.Black);

      const flipTurn = () => {
        let turn: CN.GamePlayer = thisTurn;
        let nextTurn: CN.GamePlayer = UN.getNextTurn(turn);
        // console.log("UN.getNextTurn(playerTurn): " + UN.getNextTurn(turn));
        // console.log("nextTurn: " + nextTurn);
        setTurn(nextTurn);
    }

    return (
        <React.StrictMode>
          Othello Next Turn:&nbsp;
          <div className={thisTurn === CN.GamePlayer.Black ? "blackDot" : "whiteDot"}></div>
          &nbsp;{thisTurn.toString()}&nbsp;&nbsp;
          <br/><br/>
          <button onClick={() => 
              {
                setTurn(thisTurn === CN.GamePlayer.Black ? CN.GamePlayer.White : CN.GamePlayer.Black);
              }
            }>Click to Manually Change Turn (Debugging)</button>
            <br/><br/>
          <BoardX 
            playerTurn={thisTurn}
            flipGameTurn={flipTurn}/>
        </React.StrictMode>
        );
}

