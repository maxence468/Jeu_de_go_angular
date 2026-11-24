import { Component, computed, inject } from '@angular/core';
import { Cellule } from '../cellule/cellule';
import { GameManager } from '../game-manager';

@Component({
  selector: 'app-plateau',
  imports: [Cellule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css',
})
export class Plateau {
  //inject : recuperer les instances d'un service 
  //permet d'acceder à la partie partagée entre les composants  
  gameManager = inject(GameManager)

  //adapte la taille de la grille d'affichage pour aligner avec la grille de jeu 
  //pour differentes tailles de plateau 
  tailleGrilleAffichage = computed(() =>
    90 * (this.taille() - 1) / this.taille()
  );

  taille = computed(() => this.gameManager.game().plateau.length)

  fakeArray9 = computed(() => new Array(this.taille())); // Crée un tableau de taille éléments 
  fakeArray8 = computed(() => new Array(this.taille() - 1));
}
