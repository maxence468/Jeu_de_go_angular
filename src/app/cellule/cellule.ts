import { Component, input, inject, computed } from '@angular/core';
import { GameManager } from '../game-manager';


@Component({
  selector: 'app-cellule',
  imports: [],
  templateUrl: './cellule.html',
  styleUrl: './cellule.css',
})
export class Cellule {
  ligne = input.required<number>()
  colonne = input.required<number>()
  gameManager = inject(GameManager)
  //ce signal recupere la valeur de sa cellule à partir de ses coordonnées 
  //0 si c'est vide 1 si c'est joueur 1 .... 
  //valeur automatiquement recalculé grace à computed à chaque changement 
  joueur = computed(() => this.gameManager.gameAffiche().plateau[this.ligne()][this.colonne()])

  public placer() {
    this.gameManager.placerCellule(this.ligne(), this.colonne())

  }

  public retirer(event: MouseEvent) {
    //empehce le comportement par defaut du clic droit 
    event.preventDefault();
    this.gameManager.retirerCellule(this.ligne(), this.colonne())
  }
}
