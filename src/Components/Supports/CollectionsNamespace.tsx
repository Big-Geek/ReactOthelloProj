
import { UtilitiesNamespace as UN, StructuresNamespace as SN } from 'Components';

export namespace CollectionsNamespace {
    
    export enum GamePlayer {
      Black = "Black",
      White = "White"
    }
    
    export enum MoveType {
      Placement,
      Flip
    }

    export type GameHistory = {
      cellNumber: number,
      moveType: MoveType
    }
    
    export enum ChipState {
      noChip = "noChip",
      candidateChip = "candidateChip",
      whiteChip = "whiteChip",
      blackChip = "blackChip"
    }

    export const dottedCorners: number[] = [18, 22, 50, 54];

    export const gridSizeList: number[] = Array.from(Array(8).keys());

    export interface iSquareBase {
        squareId: number;
        rowIndex: number;
        colIndex: number;
        gridSize: number;
        key: any;
    }
    
    export interface iSquareAdditional {
        chipState: ChipState;
        lastMove: SN.Nullable<number>;
        playerTurn: GamePlayer;
        onSquareClick?: any;
    }
    
    export interface iSquareProps extends iSquareBase, iSquareAdditional {}

  }