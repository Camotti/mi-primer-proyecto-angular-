import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';    // Necesario para *ngIf y *ngFor
import { FormsModule } from '@angular/forms';      // Necesario para [(ngModel)]
import { UsuarioService, Usuario } from '../service/usuario';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule], //  AMBOS deben estar aquí
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css']
})
export class UsuarioComponent implements OnInit {
  nombre: string = '';
  listUsuarios: Usuario[] = [];

  constructor(private svc: UsuarioService) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.svc.getAll().subscribe({
      next: (data) => this.listUsuarios = data,
      error: (err) => console.error('Error al conectar:', err)
    });
  }

  agregarUsuario() {
    if (!this.nombre.trim()) return;
    this.svc.create({ nombre: this.nombre }).subscribe(() => {
      this.nombre = ''; // Limpia el input
      this.listarUsuarios(); // Refresca la lista
    });
  }

  eliminarUsuario(id:number) {
    if (confirm("Estas seuro de querer eliminar este usuario?")) {
      this.svc.delete(id).subscribe({
        next: ()=> this.listarUsuarios(), // refresca la lista tras borrar un usuario
        error: (e) => console.error("no se puedo eliminar el usuario:",e)
      })
    }
  }

}