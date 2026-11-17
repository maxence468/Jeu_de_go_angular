import { Component } from '@angular/core';
import { Cellule } from '../cellule/cellule';

@Component({
  selector: 'app-plateau',
  imports: [Cellule],
  templateUrl: './plateau.html',
  styleUrl: './plateau.css',
})
export class Plateau {
  fakeArray9 = new Array(9); // Crée un tableau de 9 éléments 
  fakeArray8 = new Array(8);
}
