import React, { useState, useEffect, useContext, useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import 'Components/Game/gameStyles.css';
import 'Components/Square/squareStyles.css';
import { CollectionsNamespace as CN, UtilitiesNamespace as UN, StructuresNamespace as SN } from 'Components';
import { SquareX } from 'Components'
import classNames from 'classnames';

interface iBoardProps {
    playerTurn: CN.GamePlayer,
    flipGameTurn: any
}

//console.log(UN.getNextTurn(CN.GamePlayer.Black));

export const BoardX = (props: iBoardProps) => {
    /// State objects
    const [lastMove, setLastMove] = useState<SN.Nullable<number>>(null);
    const [winner, setWinner] = useState<SN.Nullable<CN.GamePlayer>>(null);
    const [history, setHistory] = useState<number[]>([]);
    const [translatedHistory, setTranslatedHistory] = useState<string[]>([]);
    const [squares, setSquares] = useState<CN.iSquareProps[]>([]);

    // Functional Component LifeCycle 
    // #region Lifecycle

    // "componentDidMount" 
    //  because empty (or no) value passed as second parameter
    useEffect(() => {
        // setLastMove(null);
        // setSquares(boardSquareArray());
        // setTurn(props.playerTurn);
        //console.log("componentDidMount");
    }, [props]);

    // Functional Component LifeCycle 
    // "componentDidMount" 
    //  because empty (or no) value passed as second parameter
    useEffect(() => {
        setSquares(boardSquareArray());
        
        //clearAllCandidateChips();
        //setChipStates();
        //console.log("componentDidMount");
    }, []);

    // #endregion

    // ---------------------------------------------------
    /// Method Constants
    // ---------------------------------------------------

    // #region Init

    /// Build Board Square Array
    const boardSquareArray = (): CN.iSquareProps[] => {
        let squareArray: CN.iSquareProps[] = [];
        CN.gridSizeList.forEach(
            (rowIndex) =>
                CN.gridSizeList.forEach((i: number) => {

                    let id: number = UN.calculateCellNumber(rowIndex, CN.gridSizeList.length, i);
                    let thisChipState: CN.ChipState = UN.getInitChipState(id);
                    squareArray.push(
                        {
                            squareId: id,
                            rowIndex: rowIndex,
                            colIndex: i,
                            gridSize: CN.gridSizeList.length,
                            key: ("squareKey" + id),
                            chipState: thisChipState,
                            lastMove: lastMove,
                            playerTurn: props.playerTurn,
                            onSquareClick: { onSquareClick: board_onSquareClick }
                        }
                    )
                }
                )
        )
        return squareArray;
    }

    // #endregion

    // #region Basic/State Methods

    const appendHistory = (squareId: number) => {
        setHistory([...history, squareId]);
    }

    const flipTurn = () => {
        props.flipGameTurn();
    }

    // #endregion Basic/State Methods

    /// Filter/Find Squares in State
    // #region FilterFindSquares

    const findSquareBySquareId = (squareId: any): CN.iSquareProps => {
        return squares.find(sq => sq.squareId === squareId)!;
    }

    const filterSquaresByRowIndex = (rowIndex: number): CN.iSquareProps[] => {
        return squares.filter(square => square.rowIndex === rowIndex).sort();
    }

    const filterSquaresByPlayerTurn = (inputSquares: CN.iSquareProps[], thisTurn: CN.GamePlayer = props.playerTurn): CN.iSquareProps[] => {
        let tempSquares: CN.iSquareProps[] = inputSquares.filter(square => square.chipState === UN.getChipStateForTurn(thisTurn));
        return tempSquares;
    }

    const filterCandidateSquaresByTurn = (inputSquares: CN.iSquareProps[], thisTurn: CN.GamePlayer): CN.iSquareProps[] => {
        // console.log("filterCandidateSquaresByTurn(): ");
        let returnSquares: CN.iSquareProps[] = [];
        let thisTurnSquareIds: number[] = [];
        let candSquareIds: number[] = [];

        // Get list of SquareIds for this playerTurn
        thisTurnSquareIds = filterSquaresByPlayerTurn(inputSquares, thisTurn).map(sq => sq.squareId);
        
        // Get list of Candidate Squares Ids based on this turn
        thisTurnSquareIds.forEach(
            (sqId) => {
                let tempSquareIds: number[] = UN.getPotentialCandidateSquareIds(sqId);
                candSquareIds.push(...tempSquareIds);

                // console.log("thisTurnSquareIds.forEach()");
                // console.log(sqId);
                // console.log(tempSquareIds);
            }
        );

        // Eliminate Duplicates
        candSquareIds = [...new Set(candSquareIds)];
        returnSquares = UN.filterSquaresArrayBySquareIdsArray(inputSquares, candSquareIds);
        // console.log("filterCandidateSquaresByTurn(): ");
        // console.log(candSquareIds);

        return returnSquares;
    }

    //#endregion

    ///-----------------------------------------------------------------
    /// Get/Set/Clear Methods
    ///-----------------------------------------------------------------

    // #region Get/Set/Clear Methods

    const clearAllCandidateChipsInSquaresArray = (inputSquares: CN.iSquareProps[]): CN.iSquareProps[] => {
        let tempSquares: CN.iSquareProps[] = inputSquares;
        tempSquares.forEach(sq => { if (sq.chipState === CN.ChipState.candidateChip) sq.chipState = CN.ChipState.noChip });
        return tempSquares;
    }

    const resetAllCandidateChipsInSquaresArray = (inputSquares: CN.iSquareProps[]): CN.iSquareProps[] => {
        console.log("resetAllCandidateChipsInSquaresArray()");
        inputSquares = clearAllCandidateChipsInSquaresArray(inputSquares);
        let nextTurn = props.playerTurn;
        // Get Next Turn Squares
        let nextTurnCandSquares: CN.iSquareProps[] = filterCandidateSquaresByTurn(inputSquares, nextTurn);

        // Set Actual Candidates by Square
        let returnSquares: CN.iSquareProps[] = UN.mergeReplaceArrays(inputSquares, nextTurnCandSquares);

        // console.log("resetAllCandidateChipsInSquaresArray(): ");
        // console.log(nextTurnCandSquares);
        return returnSquares;
    }

    // #endregion Get/Set/Clear Methods

    // ---------------------------------------------------
    /// Event Handling
    // ---------------------------------------------------

    

    const setChipStateBySquareId = (squareId: number, chipState: CN.ChipState) => {
        // Get Square by Id, Get Range above and below 
        let lowerSquares: CN.iSquareProps[] = squares.filter(sq => sq.squareId < squareId).length > 0 ? squares.filter(sq => sq.squareId < squareId) : [];
        let upperSquares: CN.iSquareProps[] = squares.filter(sq => sq.squareId > squareId);
        let sqr: CN.iSquareProps = findSquareBySquareId(squareId);
        let tempSquares: CN.iSquareProps[] = [];

        // Set ChipState to the current turn
        sqr.chipState = UN.getChipStateForTurn(props.playerTurn);
        // Create new deep copy array to hold full range
        // Deep copy will allow a single update to state object

        // console.log("sqr.chipState: " + sqr.chipState);
        // console.log("lowerSquares.length: " + lowerSquares.length);
        // console.log("upperSquares.length: " + upperSquares.length);

        tempSquares = UN.mergeReplaceArrays([...squares], [sqr]);

        // Clear all Candidate Chip states
        tempSquares = resetAllCandidateChipsInSquaresArray(tempSquares);
        // if (sqr.squareId === 0){
        //     console.log(tempSquares);
        // }

        // Set all chips between as current turn color
        tempSquares = UN.flipChipsBetweenInSquaresArray(tempSquares, sqr);

        // Set Squares in State
        setSquares(tempSquares);

        let winnerCount = tempSquares.filter(sqr => sqr.chipState == CN.ChipState.candidateChip)
        // WINNER Calcluation
        // No more candidate squares exist, previous turn wins
        if (winnerCount.length === 0){
            console.log("Winner Calculated: ");
            setWinner(UN.getNextTurn(props.playerTurn));
        }

        // console.log("setChipStateBySquareId(): ");
        // console.log(tempSquares);
        // console.log("setChipStateBySquareId(): ");
        // console.log(`lowerSquares.length: ${lowerSquares.length}`)
        // console.log(`upperSquares.length: ${upperSquares.length}`)
        // console.log(sqr);
        // console.log(squares);
    }

    const board_onSquareClick = (squareId: number) => {
        console.log(`board_onSquareClick(): playerTurn: ${props.playerTurn} squareId: ${squareId}`);
        let squareChipState = squares[squareId].chipState;
        // let thisTurnBeforeFlip = props.playerTurn;
        // let nextTurnBeforeFlip = UN.getNextTurn(props.playerTurn);
        if (!history.includes(squareId) && squareChipState === CN.ChipState.candidateChip) {
            // console.log(`!history.includes() onSquareClick(): playerTurn: ${props.playerTurn} squareId: ${squareId}`);
            let changeChipState: CN.ChipState = UN.getChipStateForTurn(props.playerTurn);
            //console.log(`onSquareClick(): playerTurn: ${props.playerTurn} thisChipState: ${changeChipState}`);
            setChipStateBySquareId(squareId, changeChipState);
            flipTurn();
            
            setLastMove(squareId);
            appendHistory(squareId);
            
        }

        //*** DEBUGGING ***/
        //setLastMove(squareId);
        // console.log("chipState: " + chipState.toString());
        // console.log("squareId: " + squareId);
    }


    const getWinner = (): string => {
        return (winner === null ? "No Winner" : winner === CN.GamePlayer.Black ? "BLACK" : "WHITE");
    } 

    // ---------------------------------------------------
    /// JSX Elements and Return
    // ---------------------------------------------------

    // #region Elements and Return

    const rows = (): JSX.Element => {
        return (
            <>
                {CN.gridSizeList.map((rowIndex) => (
                    <>
                        <div className="rowBase" id={"row" + rowIndex.toString()} key={"row" + rowIndex.toString()}>
                            {
                                filterSquaresByRowIndex(rowIndex).map((i) => (
                                    <>
                                        <SquareX
                                            squareId={i.squareId}
                                            rowIndex={i.rowIndex}
                                            colIndex={i.colIndex}
                                            gridSize={CN.gridSizeList.length}
                                            playerTurn={props.playerTurn}
                                            onSquareClick={board_onSquareClick}
                                            lastMove={lastMove}
                                            chipState={i.chipState}
                                            key={"squareX" + i.key.toString()}
                                        />
                                    </>
                                ))
                            }
                        </div>
                    </>
                ))
                }
            </>);
    }

    return (
        <>
            <div>
                {"Board Turn: " + props.playerTurn.toString()}
                <div>{getWinner()}</div>
                <div className="boardBase" id="gameBoard" key="board">
                <div className=
                {classNames({
                    'winnerClass': true,
                    'winnerWhite': winner === CN.GamePlayer.White,
                    'winnerBlack': winner === CN.GamePlayer.Black,
                    'noWinnerYet': winner === null
                })}>{getWinner()}<br/>WINS!</div>
                    {rows()}
                    
                </div>
            </div>
        </>);

    // #endregion Elements and Return
}

