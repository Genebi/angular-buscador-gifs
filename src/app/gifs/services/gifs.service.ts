import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../gifs-page/interfaces/gif.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'xJ5EUBAW23OAp8IyFxwL1HfI9jeXSxoQ';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {

    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(busqueda: string) {

    busqueda = busqueda.trim().toLowerCase();

    if (!this._historial.includes(busqueda)) {

      this._historial.unshift(busqueda);
      this._historial = this._historial.slice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('q', busqueda)
          .set('limit', '10');
    
    this.http.get<SearchGifsResponse>(`${this.servicioURL}/search`, {params})
            .subscribe(resp => {
              console.log(resp.data);
              this.resultados = resp.data;

              localStorage.setItem('resultados', JSON.stringify(this.resultados));
            });
  }
}
