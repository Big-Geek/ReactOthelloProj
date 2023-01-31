import { CollectionsNamespace as CN } from 'Components';

export namespace UtilitiesNamespace {

  export function translateCellNumToAlphaNum(cellNumber: number): string {
    // Return value formatted with preceding letter for column and number for row
    // ie, D3 (col,row)

    // // A : 65    a : (65 + 32) = 97
    // // B : 66    b : (66 + 32) = 98
    // // C : 67    c : (67 + 32) = 99
    // // ...

    let colNum: number = cellNumber % 8;
    // console.log(colNum);
    let colStr: string = String.fromCharCode(65 + colNum);
    // console.log(colStr);
    let rowNum: number = (cellNumber - colNum) / 8 + 1;
    return colStr + rowNum.toString();
  }

  export function calculateCellNumber(rowIndex: number, gridSizeListLength: number, position: number): number {
    // console.log("rowIndex: " + rowIndex.toString());
    let cellNum: number = rowIndex * gridSizeListLength + position;
    //console.log("cellNumber: " + cellNum.toString());
    return (cellNum);

  }

  export const convertCellNumberHistoryToGridArray = (cellNumHistArray: number[]): string[] => {
    let gridArray: string[] = [];
    cellNumHistArray.forEach(element => gridArray.concat(translateCellNumToAlphaNum(element)));
    return gridArray;
  }

  export function getInitChipState(i: number): CN.ChipState {
    let initChipState: CN.ChipState = CN.ChipState.noChip;

    switch (i) {
      /// Temporarily show candidates
      case 19:
        initChipState = CN.ChipState.candidateChip;
        break;
      case 26:
        initChipState = CN.ChipState.candidateChip;
        break;
      // Initial Setup of for core chips
      case 27:
        initChipState = CN.ChipState.whiteChip;
        break;
      case 28:
        initChipState = CN.ChipState.blackChip;
        break;
      case 35:
        initChipState = CN.ChipState.blackChip;
        break;
      case 36:
        initChipState = CN.ChipState.whiteChip;
        break;
      /// Temporarily show candidates
      case 37:
        initChipState = CN.ChipState.candidateChip;
        break;
      case 44:
        initChipState = CN.ChipState.candidateChip;
        break;
      default:
        initChipState = CN.ChipState.noChip;
        break;
    }

    return initChipState as CN.ChipState;
  }

  export function updateChipState(i: number): CN.ChipState {
    let tempChipState: CN.ChipState = CN.ChipState.noChip;
    return tempChipState as CN.ChipState;
  }

  export function getPotentialCandidateSquareIds(squareId: number): number[] {
    let candidates: number[] = [];
    let gridSize = CN.gridSizeList.length;
    // Find cell above
    if (squareId - gridSize >= 0) {
      candidates.push(squareId - gridSize);
    }
    // Find cell below
    if (squareId + gridSize < Math.pow(gridSize, 2)) {
      candidates.push(squareId + gridSize);
    }
    // Find cell to right
    if ((squareId + 1) % gridSize !== 0) {
      candidates.push(squareId + 1)
    }
    // Find cell to left
    // !!! MUST CHECK IF SquareId !== 0 ELSE Square will not change !!! 
    if (squareId !== 0 && ((squareId - 1) % gridSize !== gridSize - 1)) {
      candidates.push(squareId - 1)
    }

    return candidates;
  }

  export function calcSquareIndexByRowAndColIndexes(rowIx: number, colIx: number) {
    return (rowIx * CN.gridSizeList.length + colIx);
  }



  // Flip chips sandwiched between squares
  export function flipChipsBetweenInSquaresArray(inputSquares: CN.iSquareProps[], changeSquare: CN.iSquareProps): CN.iSquareProps[] {
    // console.log("flipChipsBetweenInSquaresArray(): ")
    // console.log(`changeSquare.squareId: ${changeSquare.squareId}`)
    // console.log(`changeSquare.rowIndex: ${changeSquare.rowIndex}`)
    // console.log(`changeSquare.colIndex: ${changeSquare.colIndex}`)
    let gridSize = CN.gridSizeList.length;
    let addValArray: number[] = [-1, 0, 1];
    let rowIx: number = changeSquare.rowIndex;
    let colIx: number = changeSquare.colIndex;
    let squareId: number = changeSquare.squareId;
    let rowIxArray = [rowIx];
    let colIxArray = [colIx];
    let returnIxArray: number[] = [];
    let returnSquares: CN.iSquareProps[] = inputSquares;
    let currentChipStyle: CN.ChipState = changeSquare.chipState;
    let oppositeChipStyle: CN.ChipState = currentChipStyle === CN.ChipState.blackChip ? CN.ChipState.whiteChip : CN.ChipState.blackChip;

    addValArray.forEach( // Row
      (addValRow) => {
        let thisRow = rowIx + addValRow;
        // Eject from row if outside of rows range
        if (thisRow < 0 || thisRow === CN.gridSizeList.length) {
          return;
        }

        // console.log(`addValRow: ${addValRow}`)
        // console.log(`thisRow: ${thisRow}`)

        addValArray.forEach( // Column
          (addValCol) => {
            let thisCol = colIx + addValCol;
            let tempRow = thisRow;
            // Calculate Cell Index for adjacent square based on relative position
            let thisId = calcSquareIndexByRowAndColIndexes(thisRow, thisCol).valueOf();
            
            let sqrToChange: number[] = [];
            let foundSandwichChip: boolean = false;


            //console.log(`thisCol: ${thisCol}`)
            // console.log(`thisRow: ${thisRow}`)
            //  console.log(`thisId: ${thisId}`)

            // Eject column if outside column range
            if (thisCol < 0 || thisCol === CN.gridSizeList.length) {
              return;
            }

            // Checked SquareId equals curent. Don't need to check it. Skip with return.
            if (thisId === squareId) {
              return; // Equal to Next or Continue, preferred to continue
            }

            // Eject from foreach if it's not the opposite chip turn style
            if (inputSquares[thisId].chipState !== oppositeChipStyle) {
              return;
            }

            //console.log(`thisCol: ${thisCol}`)
            // console.log(`thisRow: ${thisRow}`)
            // console.log("Found opposite chip style");
            // console.log(`thisId: ${thisId}`);

            while ((tempRow >= 0 && tempRow < CN.gridSizeList.length)
              && (thisCol >= 0 && thisCol < CN.gridSizeList.length)) {

              // console.log("while()");
              // console.log("before incrementation");
              // console.log(`thisCol: ${thisCol}`)
              // console.log(`tempRow: ${tempRow}`)
              // console.log(`addValCol: ${addValCol}`);
              // console.log(`addValRow: ${addValRow}`);
              // console.log(`thisId: ${thisId}`)

              // If !== opposite chip, determine action
              if (inputSquares[thisId].chipState !== oppositeChipStyle){
                // if current chip, it's a sandwich!!
                if (inputSquares[thisId].chipState === currentChipStyle) {
                  // console.log("found Sandwich Chip at " + thisId);
                  foundSandwichChip = true;
                  break;
                } 
                else {
                  break;
                }
              }

              // Opposite chip found in proximity square, add to array
              sqrToChange.push(thisId);

              // Must iterate to match direction of cell change else INFINITELOOP
              tempRow += addValRow;
              thisCol += addValCol;

              // Recalculate "thisId" incremented to find the next 
              thisId = calcSquareIndexByRowAndColIndexes(tempRow, thisCol).valueOf();

              // Determine if sandwich end found at next chip before loop ejects
              // if (inputSquares[thisId].chipState === currentChipStyle) {
              //   console.log("found Sandwich at " + thisId)
              //   foundSandwichChip = true;
              //   break;
              // }

              // console.log("after incrementation");
              // console.log(`thisCol: ${thisCol}`)
              // console.log(`thisRow: ${tempRow}`)
              // console.log(`addValCol: ${addValCol}`);
              // console.log(`addValRow: ${addValRow}`);
              // console.log(`thisId: ${thisId}`)

            } // -End While Loop

            //Sandwich chip confirmed, iterate change to current turn chip state
            if (foundSandwichChip) {
              sqrToChange.forEach(
                (ix) => {
                  inputSquares[ix].chipState = currentChipStyle;
                  // console.log("foundSandwichChip ix: " + ix);
                }
              )
            }

          }) // -End Foreach Col
      }

    ); // -End Foreach Row

    return returnSquares;
  }


  // Flip chips sandwiched between squares
  export function flipChipsBetweenInSquaresArrayInverted(inputSquares: CN.iSquareProps[], changeSquare: CN.iSquareProps): CN.iSquareProps[] {
    console.log("flipChipsBetweenInSquaresArray(): ")
    console.log(`changeSquare.squareId: ${changeSquare.squareId}`)
    let gridSize = CN.gridSizeList.length;
    let addValArray: number[] = [-1, 0, 1];
    let rowIx: number = changeSquare.rowIndex;
    let colIx: number = changeSquare.colIndex;
    let rowIxArray = [rowIx];
    let colIxArray = [colIx];
    let returnIxArray: number[] = [];
    let returnSquares: CN.iSquareProps[] = inputSquares;
    let currentChipStyle: CN.ChipState = changeSquare.chipState;
    let oppositeChipStyle: CN.ChipState = currentChipStyle === CN.ChipState.blackChip ? CN.ChipState.whiteChip : CN.ChipState.blackChip;

    addValArray.forEach( // Column
      (addValCol) => {
        let thisCol = colIx + addValCol;
        // Eject column if outside column range
        if (thisCol < 0 || thisCol === CN.gridSizeList.length) {
          return;
        }

        addValArray.forEach( // Row
          (addValRow) => {
            let thisRow = rowIx + addValRow;
            // Eject from row if outside of rows range
            if (thisRow < 0 || thisRow === CN.gridSizeList.length) {
              return;
            }

            // Calculate Cell Index for adjacent square based on relative position
            let thisId = calcSquareIndexByRowAndColIndexes(thisRow, thisCol);

            // Checked SquareId equals curent. Don't need to check it. Skip with return.
            if (inputSquares[thisId].squareId == changeSquare.squareId) {
              return; // Equal to Next or Continue, preferred to continue
            }

            // console.log(`thisIx: ${thisId}`);

            let sqrToChange: number[] = [];
            let foundSandwichChip: boolean = false;


            while (inputSquares[thisId].chipState === oppositeChipStyle
              && thisId >= 0
              && thisId < Math.pow(CN.gridSizeList.length, 2)) {
              sqrToChange.push(thisId);

              thisId = calcSquareIndexByRowAndColIndexes(thisRow, thisCol);

              // Determine if sandwich end found
              if (inputSquares[thisId].chipState == currentChipStyle) foundSandwichChip = true;
              // Must iterate to match direction of cell change else INFINITELOOP
              thisCol += addValCol;
              thisRow += addValRow;

              //console.log(`thisIx: ${thisIx}`);
            }
            // Sandwich chip confirmed, iterate change to current turn chip state
            if (foundSandwichChip) {
              sqrToChange.forEach(
                (ix) => {
                  inputSquares[ix].chipState = currentChipStyle;
                  // console.log(ix);
                }
              )
            }

          })
      }

    );

    return returnSquares;
  }

  export function buildSquareArray(onSquareClickEvent?: any): CN.iSquareProps[] {
    let squareArray: CN.iSquareProps[] = [];
    let gridSizeList: number[] = CN.gridSizeList;
    gridSizeList.forEach(
      (rowIndex) =>
        gridSizeList.forEach((i: number) => {
          let id: number = calculateCellNumber(rowIndex, gridSizeList.length, i);
          let chipState: CN.ChipState = getInitChipState(id);
          squareArray.push(
            {
              squareId: id,
              rowIndex: rowIndex,
              colIndex: i,
              gridSize: gridSizeList.length,
              key: ("square" + id),
              chipState: chipState,
              lastMove: null,
              playerTurn: CN.GamePlayer.Black,
              onSquareClick: onSquareClickEvent
            }
          )
        }
        )
    )

    return squareArray;
  }

  export function getChipStateForTurn(thisTurn: CN.GamePlayer): CN.ChipState {
    return thisTurn === CN.GamePlayer.Black ? CN.ChipState.blackChip : CN.ChipState.whiteChip;
  }

  export function getNextTurn(thisTurn: CN.GamePlayer): CN.GamePlayer {
    return thisTurn === CN.GamePlayer.Black ? CN.GamePlayer.White : CN.GamePlayer.Black;
  }

  ///-----------------------------------------------------------------
  /// Application Specific Array Function Utilities
  ///-----------------------------------------------------------------

  export function filterSquaresArrayBySquareIdsArray(objArray: CN.iSquareProps[], idArray: number[]) {
    let outputArray: CN.iSquareProps[] = [];
    idArray.forEach((id) => {
      outputArray.push(objArray.find(obj => obj.squareId === id)!);
    }
    );
    return outputArray;
  }

  // Function to replace left array with items in right array when they exist
  export function mergeReplaceArrays(primaryArray: CN.iSquareProps[], replacementsArray: CN.iSquareProps[]): CN.iSquareProps[] {
    let mergedArray: CN.iSquareProps[] = [];

    primaryArray.forEach(function (item) {
      let priSquareId: number = item.squareId;

      let selectedItem: CN.iSquareProps;
      if (replacementsArray.find(r => r.squareId === priSquareId)) {
        selectedItem = replacementsArray.find(r => r.squareId === priSquareId)!;
        if (selectedItem.chipState == CN.ChipState.noChip)
          selectedItem.chipState = CN.ChipState.candidateChip;
      }
      else {
        selectedItem = item;
      }

      mergedArray.push(selectedItem);
    }
    );
    // console.log("mergeReplaceArrays(): ")
    // console.log(replacementsArray)
    return mergedArray;
  }

  ///-----------------------------------------------------------------
  /// Universal Function Utilities
  ///-----------------------------------------------------------------
  /// Getting a union of two arrays in JavaScript [duplicate]
  /// Union function eliminates duplicates
  /// https://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
  ///-----------------------------------------------------------------

  export function UnionSameTypeArrays(a: any[], b: any[]) {
    return [... new Set([...a, ...b])];
  }

  export function UnionMixedTypeArrays(x: any[], y: any[]) {
    var obj = [];
    for (var i = x.length - 1; i >= 0; --i)
      obj[x[i]] = x[i];
    for (var i = y.length - 1; i >= 0; --i)
      obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
      if (obj.hasOwnProperty(k))
        res.push(obj[k]);
    }
    return res;
  }



}