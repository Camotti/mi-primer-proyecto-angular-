import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';     
import { UsuarioService, Usuario } from '../service/usuario'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css']
})
export class UsuarioComponent implements OnInit {
  form!: FormGroup; 
  listUsuarios: Usuario[] = [];
  errorMensaje: string | null = null;
  cargando: boolean = false;

  constructor(private svc: UsuarioService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      // Agregamos el validador personalizado aquí 👇
      nombre: ["", [Validators.required, Validators.minLength(3), noPalabrasProhibidas(['admin', 'root', 'spam'])]]
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.svc.getAll().subscribe({
      next: (data: Usuario[]) => {
        this.listUsuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => { 
        this.cargando = false;
        this.errorMensaje = err.status === 0 ? "No hay conexion con el servidor." : `Error: ${err.status}`;
      }
    });
  }

  agregarUsuario(): void {
    // 1. Validamos el formulario reactivo
    if (this.form.invalid) return;

    // 2. Extraemos el valor del formulario { nombre: '...' }
    const nuevoUsuario = this.form.value;

    // 3. Validación de duplicados usando el valor del formulario
    const existe = this.listUsuarios.some(u => u.nombre.toLowerCase() === nuevoUsuario.nombre.toLowerCase());
    if (existe) {
      alert("Este nombre ya existe.");
      return;
    }

    this.cargando = true;
    this.svc.create(nuevoUsuario).subscribe({
      next: () => {
        this.form.reset(); // 4. Limpiamos el formulario
        this.listarUsuarios(); 
      },
      error: (err: HttpErrorResponse) => {
        this.errorMensaje = "Error al guardar el usuario.";
        this.cargando = false;
      }
    });
  }

  eliminarUsuario(id: number | undefined): void {
    if (id === undefined) return; 
    if (confirm("¿Estás seguro que desea eliminar este usuario?")) {
      this.cargando = true;
      this.svc.delete(id).subscribe({
        next: () => this.listarUsuarios(),
        error: (err: HttpErrorResponse) => {
          this.errorMensaje = "No se pudo eliminar.";
          this.cargando = false;
        }
      });
    }
  }
} // <--- AQUÍ TERMINA LA CLASE

// --- ETAPA 4: VALIDADOR PERSONALIZADO ---
// aquí afuera para que sea una función pura
export function noPalabrasProhibidas(prohibidas: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Si el campo está vacío, no validamos (eso lo hace el 'required')
    if (!control.value) return null;

    const valor = control.value.trim().toLowerCase();
    // Buscamos si la palabra prohibida es EXACTAMENTE igual al valor
    const esProhibida = prohibidas.some(p => valor === p.toLowerCase());
    
    return esProhibida ? { 'palabraProhibida': true } : null;
  };
}
