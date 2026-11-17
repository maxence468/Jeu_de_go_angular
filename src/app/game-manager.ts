import { Injectable, signal, WritableSignal } from '@angular/core';

export interface Game {
  scoreJoueur1: number;
  scoreJoueur2: number;
  tourActuel: number;
  plateau: number[][];
}

@Injectable({
  providedIn: 'root',
})
export class GameManager {
  game: WritableSignal<Game>;

  constructor() {
    this.game = signal<Game>({
      scoreJoueur1: 0,
      scoreJoueur2: 0,
      tourActuel: 1,
      plateau: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))
    })
  }

  public placerCellule(ligne: number, colonne: number) {
    let celluleTmp = this.game().plateau[ligne][colonne]
    if (celluleTmp == 0) {
      //copie du plateau qu'on va modifier 
      const copiePlateau = this.game().plateau.map(lignePlateau => [...lignePlateau])
      // on modifie la case voulu dans le plateau modifié 
      copiePlateau[ligne][colonne] = this.game().tourActuel
      // on garde tout les propriété de this.game() dans une copie du jeu et on change le plateau avec la copie modifié du plateau
      const copieGame = {
        ...this.game(),
        plateau: copiePlateau
      }
      // on met à jour le jeu avec la copie 
      this.game.set(copieGame)
      //on change le tour
      this.changerTour()
    }
    else {
      console.log('case deja prise')
    }
  }

  public changerTour() {
    let tourActuel;
    if (this.game().tourActuel == 1) {
      tourActuel = 2
    }
    else {
      tourActuel = 1
    }
    const copieGame = {
      ...this.game(),
      tourActuel: tourActuel
    }
    this.game.set(copieGame)
  }
}
