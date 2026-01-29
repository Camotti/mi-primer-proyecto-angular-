import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     
import { UsuarioService, Usuario } from '../service/usuario'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css']
})
export class UsuarioComponent implements OnInit {
  nombre: string = '';
  listUsuarios: Usuario[] = [];

  errorMensaje: string | null = null;
  cargando: boolean = false;

  constructor(private svc: UsuarioService) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.svc.getAll().subscribe({
      next: (data: Usuario[]) => { //  Tipamos 'data' como un arreglo de Usuarios
        this.listUsuarios = data;
        this.cargando = false;
      },
      error: (err: HttpErrorResponse) => { 
        this.cargando = false;
        if (err.status === 0) {
          this.errorMensaje= "No hay conexion con el servidor."
        } else {
          this.errorMensaje= `Error del servidor (${err.status}): ${err.message}`;
        }
      }
    });
  }

  agregarUsuario(): void {
    if (!this.nombre.trim()) return;
    // 1. Enviamos la petición
    this.svc.create({ nombre: this.nombre }).subscribe({
      next: () => {
        // 2. SOLO cuando el servidor confirme (next), limpiamos y refrescamos
        this.nombre = ''; 
        this.listarUsuarios(); 
      },
      error: (err: any) => console.error('Error al agregar:', err)
    });
  }

  eliminarUsuario(id: number | undefined): void {
    if (id === undefined) return; // Seguridad
    if (confirm("¿Estás seguro que desea eliminar este usuario?")) {
      this.svc.delete(id).subscribe({
        next: () => {
          console.log('Eliminado con éxito');
          this.listarUsuarios();
        },
        error: (e: any) => console.error("Error al eliminar:", e)
      });
    }
  }
}