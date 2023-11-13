import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs'
import { environments } from 'src/app/environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseURL: string = environments.baserURL
  constructor(private http: HttpClient) { }


  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes`)
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseURL}/heroes/${id}`)
      .pipe(
        catchError(error => of(undefined))
      )
  }

  getSugestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes?q=${query}&_limit=6`)
  }

  //CRUD

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseURL}/heroes`, hero)
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required')
    return this.http.patch<Hero>(`${this.baseURL}/heroes/${hero.id}`, hero)
  }

  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseURL}/heroes/${id}`)
      .pipe(
        map(res => true),
        catchError(err => of(false)),
      )
  }
}
