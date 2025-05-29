import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AnimationController, ToastController } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})

export class HomePage implements OnInit {
  username = '';

  @ViewChild('nombreInput', { read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('apellidoInput', { read: ElementRef }) apellidoInput!: ElementRef;

  infoForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    educacion: ['', Validators.required],
    fnac: [null, Validators.required],
  });

  constructor(private fb: FormBuilder, private router: Router, private animCtrl: AnimationController, private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.username = nav?.extras?.state?.['username'] ?? '';
  }

  // Metodo que ejecuta la accion del boton de limpiar
  limpiar() {
    // Animamos los campos de nombre y apellido
    [this.nombreInput, this.apellidoInput].forEach(ref => {
      const el = ref.nativeElement as HTMLElement;
      el.classList.add('slide-animation');
      // Ahora quitamos la clase al acabar la animación
      setTimeout(() => el.classList.remove('slide-animation'), 1000);
    });

    // Una vez acabado limpiamos correctamente el formulario
    setTimeout(() => {
      this.infoForm.reset();
    }, 1000);
  }

  // Metodo que ejecuta la accion del boton de mostrar
  async mostrar() {
    // Si datos vacios, mostraremos un toast de error
    if (this.infoForm.invalid) {
      const missing: string[] = [];
      const ctrl = this.infoForm.controls;

      if (ctrl.nombre.invalid) missing.push('Nombres');
      if (ctrl.apellido.invalid) missing.push('Apellidos');
      if (ctrl.educacion.invalid) missing.push('Nivel de educación');
      if (ctrl.fnac.invalid) missing.push('Fecha de nacimiento');

      const toast = await this.toastCtrl.create({
        message: `Por favor completa: ${missing.join(', ')}`,
        color: 'danger',
        duration: 4000,
        position: 'middle',
      });
      await toast.present();
      return; // no continúa al toast de éxito
    }
    // Si todo esta correcto, mostramos un toast de éxito
    const { nombre, apellido } = this.infoForm.value;
    const toast = await this.toastCtrl.create({
      message: `¡Hola ${nombre} ${apellido}, bienvenido/a!`,
      color: 'success',
      animated: true,
      duration: 2500, 
      position: 'middle',
    });
    toast.present();
  }
}
