import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../service/usuario'; // Revisa que esta ruta sea correcta

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.html',                 // Aquí le dices que busque el archivo
  styleUrls: ['./usuario.css']
})

export class UsuarioComponent implements OnInit {
  nombre: string = '';
  listUsuarios: Usuario[] = [];

  constructor(private svc: UsuarioService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    // Usamos (data: any) para que no te dé error de tipo por ahora
    this.svc.getAll().subscribe((data: any) => this.listUsuarios = data);
  }

  agregar() {
    if (!this.nombre.trim()) return;
    this.svc.create({ nombre: this.nombre }).subscribe(() => {
      this.nombre = '';
      this.listar();
    });
  }
}