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

  // Validación de duplicados (Extra de buena práctica)
  const existe = this.listUsuarios.some(u => u.nombre.toLowerCase() === this.nombre.toLowerCase());
  if (existe) {
    alert("Este nombre ya existe.");
    return;
  }

  this.cargando = true; // Feedback visual
  this.svc.create({ nombre: this.nombre }).subscribe({
    next: () => {
      this.nombre = ''; 
      this.listarUsuarios(); 
    },
    error: (err: HttpErrorResponse) => { // 👈 Tipado correcto
      this.errorMensaje = "Error al guardar el usuario.";
      this.cargando = false;
      console.error('Detalle técnico:', err.message);
    }
  });
}

  eliminarUsuario(id: number | undefined): void {
  if (id === undefined) return; 

  if (confirm("¿Estás seguro que desea eliminar este usuario?")) {
    this.cargando = true; // Bloqueamos acciones mientras borra
    this.svc.delete(id).subscribe({
      next: () => {
        console.log('Eliminado con éxito');
        this.listarUsuarios();
      },
      error: (err: HttpErrorResponse) => { // 👈 Tipado correcto
        this.errorMensaje = "No se pudo eliminar el usuario.";
        this.cargando = false;
        console.error("Error al eliminar:", err.statusText);
      }
    });
  }
}
}