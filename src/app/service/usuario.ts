import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// aspecto usuario c#
export interface Usuario {
  id?: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
}) // Esto hace que el servicio esté disponible en toda la app

export class UsuarioService {
  // Ajusta esta URL a la de tu controlador de C# (ej: https://localhost:7001/api/usuario)

  private readonly apiUrl= 'http://localhost:5250/api/usuario';

  constructor(private http: HttpClient) {}

  // Obtener todos (GET)
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  //crear un (POST)
  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}
