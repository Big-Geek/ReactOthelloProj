# eOthello Description
## Project Structure

The project is built as functional components in React and Typescript. 

## Install Requirements

- `npm install classnames`
- `npm install babel-cli babel-core --save-dev`


# Structural Components
## 3 Major Structures
The project is composed of three major structures:

1) Game
2) Board 
3) Square

### Game Component
The 'Game' structure contains the state objects for:

	Player Turn
	
	const [thisTurn, setTurn ] = useState(CN.GamePlayer.Black);
	
The Game object is external so that any piece of state that may require GUI output can be moved to top level for sharing on the screen. If player history needs to be shown, it can be moved to top level of game and output without affecting the nested Board component. The goal is to keep the code more compact and based on narrow function.

Example: The player turn currently shows on screen and is modified by the nested components. 

Game has gameStyles.css associated for game level styling that may apply to this level or nested components.

### Board Component (named BoardX)
The Board is nested within the Game and contains state objects for:

	Last Move
	
    const [lastMove, setLastMove] = useState<SN.Nullable<number>>(null);
	
	Winner
	
    const [winner, setWinner] = useState<SN.Nullable<CN.GamePlayer>>(null);
	
	History
	
    const [history, setHistory] = useState<number[]>([]);
	
	Translated History - Same as history, but translated into Alphabetical Row and Numeric Column equivalent. Currently unused. 
	
    const [translatedHistory, setTranslatedHistory] = useState<string[]>([]);
	
	Squares - The collection of squares that are used within the game and change on player events. The collecion is an array the interface props which cascade into the nested components.
	
    const [squares, setSquares] = useState<CN.iSquareProps[]>([]);
	
Board Component builds the collection of iSquareProps which are then used to push properties to the nested Square components. The HTML for the squares renders independently of the Squares collection in state.

### Square Component (named SquareX)
The Square component is nested within Board and contains state objects for:


	ChipState - Current Display for the Chip
	
    const [chipState, setChipState] = 
	useState(CN.ChipState.noChip);
	
	Player Turn - Current Player Turn
	
    const [playerTurn, setPlayerTurn] = useState<CN.GamePlayer>(CN.GamePlayer.Black);
	
	** Neither state is used within the Square object. All state object information for the square is managed at the Board Component level. These states can likely be removed at the Square level.
	
Square Component consists of HTML and iSquareProps properties passed from the Board Component. All visible state is managed at the level of the Board.

# Other Important Structures
## Namespace Classes

Much of the functional development, additiona structures and the object types and collections have been moved to external namespaces for import. This allows for less workspace pollution at the time of development. 

	- Collections Namespace
	
	Contains types, enums and interfaces used within the project
	
	- Structures Namespace
	
	Contains additional structures to create Stacks and Nullable types for any Typescript/JS objects.
	
	- Utilities Namespace 
	
	Contains much of the functional code developed for all levels of components. Some universally usable functions exist here to manipulate arrays.


## Known Issues

Known Design problems:

	1) The calculation for next turn candidate moves is not accurate to Othello rules. It creates a playable game, but candidate chips are not placed based on offical flanking rules for turns.
	
	History state may have to change to accommodate this problem. Turns should be able to be limited to official rules.

	2) The winner calcuation is only based on last turn and availability of next moves. It does not account for piece count at the end of the game when the board is filled.

Known Bugs:

	1) Occasionally, the application seems to calculate the winner incorrectly in contrast to programming. This may be corrected once the design problems above are addressed.
	



