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
  joueur = computed(() => this.gameManager.gameAffiche().plateau[this.ligne()][this.colonne()])

  public placer() {
    this.gameManager.placerCellule(this.ligne(), this.colonne())

  }

  public retirer(event: MouseEvent){
    event.preventDefault();
    this.gameManager.retirerCellule(this.ligne(), this.colonne())
  }
}
