import { Injectable, signal, WritableSignal, computed } from '@angular/core';

export interface Game {
  scoreJoueur1: number;
  scoreJoueur2: number;
  tourActuel: number;
  plateau: number[][];
  partieTerminee: boolean;
}

export interface HistoriqueCoup {
  game: Game,
  nbPiecePose: number,
  nbTourPasse: number,
}

export interface PartieSauvegardee {
  id: number;
  nom: string;
  game: Game;
  nbDePiecePose: number;
  nbTourPasse: number;
  historiqueCoups: HistoriqueCoup[];
}

@Injectable({
  providedIn: 'root',
})
export class GameManager {
  game: WritableSignal<Game>;
  nbDePiecePose: number = 0;
  nbTourPasse: number = 0;
  labelUtilisateur = signal("");

  partieSauvegardees: PartieSauvegardee[] = []

  historiqueCoups = signal<HistoriqueCoup[]>([]);
  indexHistorique = signal(0);

  gameAffiche = computed(() => {
    if (this.indexHistorique() === this.historiqueCoups().length - 1) {
      return this.game();
    }

    return this.historiqueCoups()[this.indexHistorique()]?.game ?? this.game();
  });

  consultationHistorique = computed(() =>
    this.indexHistorique() < this.historiqueCoups().length - 1
  );


  constructor() {
    const sauvegardes = localStorage.getItem('parties');
    if (sauvegardes !== null) {
      this.partieSauvegardees = JSON.parse(sauvegardes)
    }

    this.game = signal<Game>(this.creerPartie())
    this.enregistrerCoup()
  }

  private creerPartie(taille: number = 19): Game {
    return {
      scoreJoueur1: 0,
      scoreJoueur2: 0,
      tourActuel: 1,
      plateau: Array.from({ length: taille }, () => Array.from({ length: taille }, () => 0)),
      partieTerminee: false
    }
  }

  public placerCellule(ligne: number, colonne: number) {
    if (this.consultationHistorique()) {
      this.labelUtilisateur.set("Reviens au dernier tour pour jouer");
      return;
    }
    if (this.game().partieTerminee) {
      return;
    }
    let celluleTmp = this.game().plateau[ligne][colonne]
    if (this.nbDePiecePose > 0) {
      this.labelUtilisateur.set("on peut poser qu'une piece par tour")
      return;
    }
    if (celluleTmp == 0) {
      this.changerValeurCellule(ligne, colonne, this.game().tourActuel)
      this.nbDePiecePose++;
      this.nbTourPasse = 0;
      this.labelUtilisateur.set('Le joueur ' + this.game().tourActuel + ' a posé sa piece en ' + ligne + ', ' + colonne)
    }
    else {
      this.labelUtilisateur.set('case deja prise')
    }
  }

  public retirerCellule(ligne: number, colonne: number) {
    if (this.consultationHistorique()) {
      this.labelUtilisateur.set("Reviens au dernier tour pour jouer");
      return;
    }
    if (this.game().partieTerminee) {
      return;
    }
    let celluleTmp = this.game().plateau[ligne][colonne]
    if (celluleTmp == 0) {
      this.labelUtilisateur.set('Aucun jeton à retirer ici')
      return;
    }
    if (this.game().tourActuel == celluleTmp) {
      this.labelUtilisateur.set('On ne peut pas retirer sa propre piece')
      return;
    }
    this.changerValeurCellule(ligne, colonne, 0);
    this.donnerPoint(this.game().tourActuel);
    this.labelUtilisateur.set('Piece retiré !')

  }

  public donnerPoint(joueur: number) {
    const copieGame = {
      ...this.game()
    }
    if (joueur == 1) {
      copieGame.scoreJoueur1 += 1
    }
    else {
      copieGame.scoreJoueur2 += 1
    }
    this.game.set(copieGame)
  }

  public changerValeurCellule(ligne: number, colonne: number, valeur: number) {
    //copie du plateau qu'on va modifier 
    const copiePlateau = this.game().plateau.map(lignePlateau => [...lignePlateau])
    // on modifie la case voulu dans le plateau modifié 
    copiePlateau[ligne][colonne] = valeur
    // on garde tout les propriété de this.game() dans une copie du jeu et on change le plateau avec la copie modifié du plateau
    const copieGame = {
      ...this.game(),
      plateau: copiePlateau
    }
    // on met à jour le jeu avec la copie 
    this.game.set(copieGame)
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
    this.nbDePiecePose = 0
    this.labelUtilisateur.set('changement de tour')

    this.enregistrerCoup();
  }

  public finirTour() {
    if (this.consultationHistorique()) {
      this.labelUtilisateur.set("Reviens au dernier tour pour jouer");
      return;
    }
    if (this.game().partieTerminee) {
      return;
    }
    if (this.nbDePiecePose != 1) {
      this.labelUtilisateur.set('Il faut poser une piece pour changer son tour')
      return;
    }
    this.changerTour();
  }

  public passerTour() {
    if (this.consultationHistorique()) {
      this.labelUtilisateur.set("Reviens au dernier tour pour jouer");
      return;
    }
    if (this.game().partieTerminee) {
      return;
    }
    if (this.nbDePiecePose > 0) {
      this.labelUtilisateur.set('on peut pas passer apres avoir joué')
      return;
    }

    this.nbTourPasse++
    this.labelUtilisateur.set("Tour passé")

    if (this.nbTourPasse == 2) {
      //fin du jeu
      this.finirPartie()
    }
    else {
      this.changerTour();
    }
  }

  public finirPartie() {
    const copieGame = {
      ...this.game(),
      partieTerminee: true
    }
    this.game.set(copieGame)
    this.labelUtilisateur.set('fin de la partie')

    this.enregistrerCoup();
  }

  public rejouer(taille: number = this.game().plateau.length) {
    this.game.set(this.creerPartie(taille))
    this.nbDePiecePose = 0;
    this.nbTourPasse = 0;
    this.labelUtilisateur.set('Nouvelle partie lancé !!!!!');

    this.historiqueCoups.set([]);
    this.enregistrerCoup();
  }

  public enregistrerCoup() {
    let copieJeu = structuredClone(this.game())

    let historiqueCoup: HistoriqueCoup = {
      game: copieJeu,
      nbPiecePose: this.nbDePiecePose,
      nbTourPasse: this.nbTourPasse
    }
    this.historiqueCoups.update(historique => [
      ...historique,
      historiqueCoup
    ]);
    this.indexHistorique.set(this.historiqueCoups().length - 1);
  }

  public tourPrecedent() {
    if (this.indexHistorique() > 0) {
      this.indexHistorique.update(index => index - 1)
    }
  }
  public tourSuivant() {
    if (this.indexHistorique() < this.historiqueCoups().length - 1) {
      this.indexHistorique.update(index => index + 1)
    }
  }

  public sauvegarderPartie() {
    let save: PartieSauvegardee = {
      id: Date.now(),
      nom: 'Partie ' + this.partieSauvegardees.length,
      game: this.game(),
      nbDePiecePose: this.nbDePiecePose,
      nbTourPasse: this.nbTourPasse,
      historiqueCoups: structuredClone(this.historiqueCoups())
    }
    this.partieSauvegardees.push(save)

    localStorage.setItem('parties', JSON.stringify(this.partieSauvegardees));
  }

  public chargerPartie(id: number) {
    const partie = this.partieSauvegardees.find(p => p.id === id)
    if (partie === undefined) {
      return;
    }
    this.game.set(structuredClone(partie.game));
    this.nbTourPasse = partie.nbTourPasse;
    this.nbDePiecePose = partie.nbDePiecePose;
    this.historiqueCoups.set(
      structuredClone(partie.historiqueCoups ?? [])
    );
    if (this.historiqueCoups().length === 0) {
      this.enregistrerCoup();
    }
    this.indexHistorique.set(
      this.historiqueCoups().length - 1
    );
  }

  public supprimerPartie(id: number) {
    this.partieSauvegardees = this.partieSauvegardees.filter(ps => ps.id !== id);
    localStorage.setItem('parties', JSON.stringify(this.partieSauvegardees));
  }
}
