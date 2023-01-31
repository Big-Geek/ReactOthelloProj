import React, { useState, useEffect, useContext, useReducer } from 'react';
import 'Components/Game/gameStyles.css';
import 'Components/Square/squareStyles.css';
import { CollectionsNamespace as CN, UtilitiesNamespace as UN, StructuresNamespace as SN } from 'Components';
import classNames from 'classnames';


export const SquareX = (props: CN.iSquareProps) => {
    const [chipState, setChipState] = useState(CN.ChipState.noChip);
    const [playerTurn, setPlayerTurn] = useState<CN.GamePlayer>(CN.GamePlayer.Black);

    // Functional Component LifeCycle "componentDidUpdate" 
    //  because value passed as second parameter
    // useEffect(() => {
    //     // setChipState(props.chipState);
    //     // setPlayerTurn(props.playerTurn);
    //     //console.log("componentDidUpdate");
    //   }, [props]);

    return (
        <>
            <div id={"sq" + props.squareId.toString()} className="squareBase">
                <div className={classNames({ 'uLdot': CN.dottedCorners.includes(props.squareId) })}></div>
                <div className="uLsquareId">{props.squareId}</div>
                <div className="chipBox">
                    {/* {props.chipState} */}
                    <button id={"b" + props.squareId.toString()}
                        className={classNames({
                            'chipButton': true,
                            'noChip': (props.chipState === CN.ChipState.noChip),
                            'blackChip': (props.chipState === CN.ChipState.blackChip),
                            'whiteChip': (props.chipState === CN.ChipState.whiteChip),
                            'candidateChip': (props.chipState === CN.ChipState.candidateChip),
                            'candidateChipWhite': (props.chipState === CN.ChipState.candidateChip && props.playerTurn === CN.GamePlayer.White),
                            'candidateChipBlack': (props.chipState === CN.ChipState.candidateChip && props.playerTurn === CN.GamePlayer.Black),
                        })}
                        onClick={() => {
                            props.onSquareClick(props.squareId);
                            //console.log(`SquareX: props.chipState: ${props.chipState}`)
                        }
                        }>
                        <div id={"lm" + props.squareId.toString()}
                            className={classNames({
                                'lastMove': (props.squareId === props.lastMove)
                            })}></div>
                    </button>
                </div>
            </div>
        </>
    );

}
