import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Plateau } from './plateau/plateau';
import { GameManager } from './game-manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Plateau],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('jeu_de_go_angular');
  gameManager = inject(GameManager)

  public finDeTour(){
    this.gameManager.finirTour();
  }
  public passer(){
    this.gameManager.passerTour();
  }
  public rejouer(){
    this.gameManager.rejouer();
  }
  public save(){
    this.gameManager.sauvegarderPartie();
  }
  public charger(id: number){
    this.gameManager.chargerPartie(id);
  }
  public supprimer(id:number){
    this.gameManager.supprimerPartie(id)
  }
}
