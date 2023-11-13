import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  public publishers = [
    { id: 'DC Comics', value: 'Dc Comics' },
    { id: 'Marvel Comics', value: 'Marvel Comics' },
  ]

  constructor(private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero
    return hero
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroService.getHeroById(id)),
      )
      .subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/')

        this.heroForm.reset(hero)
        return
      })
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return

    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`)
        })
      return
    }

    this.heroService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['heroes/edit', hero.id])
        this.showSnackbar(`${hero.superhero} created!`)
      })
  }

  onConfirmDelete(): void {
    if (!this.currentHero.id) throw Error('Hero id is required')
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    })

    dialogRef.afterClosed().subscribe(res => {
      if( !res ) return
      this.heroService.deleteHeroById(this.currentHero.id)
      .subscribe(wasDeleted => {
        if( wasDeleted ) this.router.navigate(['/heroes/list'])
      })
    })
  }

  showSnackbar(msg: string): void {
    this.snackbar.open(msg, 'done', {
      duration: 2500
    })
  }
}
