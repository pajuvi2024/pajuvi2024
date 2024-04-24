import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserI } from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';
import { Timestamp } from 'firebase/firestore';

declare var google;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {


  
  registroForm: FormGroup;
  datos: UserI = {
    uid: null,
    name: null,
    lastName: null,
    rut: null,
    age: null,
    email: null,
    confirmaEmail: null,
    password: null,
    confirmaPassword: null,
    numContact: null,
    confirmaNumContact: null,
    direccion: null,
    ocupacion: null,
    perfil: 'usuario',
    coordenadas: { lat: null, lng: null }
  };

  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Sí',
      cssClass: 'alert-button-confirm',
      handler: () => this.registrarme2()
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private utilsServ: UtilsService,
    private router: Router,
    private firestore: FirestoreService,
  
              
              
    
    ) { }

  ngOnInit(): void {
  
    this.registroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      rut: ['', [Validators.required, this.validateRut]],
      age: ['', [Validators.required, Validators.max(99), Validators.min(13)]],
      numContact: ['', [Validators.required, this.validatePhoneNumber]],
      confirmaNumContact: ['', [Validators.required, this.validatePhoneNumber, this.matchPhoneNumber]],
      email: ['', [Validators.required, Validators.email]],
      confirmaEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmaPassword: ['', [Validators.required, Validators.minLength(6)]],
      direccion: ['', [Validators.required, Validators.minLength(4)]],
      ocupacion: [''],
    }, { validators: [this.matchingFields('email', 'confirmaEmail', 'Los correos electrónicos no coinciden.'), this.matchingFields('password', 'confirmaPassword', 'Las contraseñas no coinciden.') ]});
  }
  
  async registrarme2() {

 // Comprobar si la dirección es válida antes de continuar
  if (!this.registroForm.get('direccion').valid) {
    console.log('La dirección no es válida, por favor complete todos los campos obligatorios correctamente');
    return;
  }

    // Verificar si el formulario es válido
    if (this.registroForm.valid) {
      console.log('Formulario válido, procediendo al registro');
  
      // Obtener la dirección del formulario
      const address = this.registroForm.get('direccion').value;
  
      // Obtener coordenadas antes de registrar al usuario
      const coordinates = await this.obtenerCoordenadas(address);
  
      // Registrar al usuario si se obtuvieron las coordenadas
      if (coordinates) {
        console.log('Coordenadas obtenidas:', coordinates);
  
        // Comprobar si la dirección es válida antes de continuar
        if (!this.registroForm.get('direccion').valid) {
          console.log('La dirección no es válida, por favor complete todos los campos obligatorios correctamente');
          return;
        }
        
        // Registrar al usuario
        const res = await this.utilsServ.registrarUser(this.registroForm.value).catch(error => {
          console.log('Error al registrar:', error);
        });

        if (res) {
          console.log('Registro exitoso');
          const path = 'usuarios';
          const id = res.user.uid;

          // Usar la fecha actual para trialStartDate y startDate
          const currentDate = new Date();

          // Definir el planType
          const planType = 'Gratis';

          // Calcular la fecha de expiración sumando 1 mes a la fecha actual
          const expiryDate = new Date(currentDate);
          expiryDate.setMonth(currentDate.getMonth() + 1);

          // Crear un nuevo objeto con los datos del formulario y las coordenadas
          const datos = {
          ...this.registroForm.value,
          uid: id, // El UID del usuario
          planType: planType, // El tipo de plan
          startDate: Timestamp.fromDate(currentDate), // La fecha de inicio (igual a trialStartDate)
          expiryDate: Timestamp.fromDate(expiryDate), // Convertir la fecha de expiración a Timestamp de Firestore
          coordenadas: coordinates // Agregar las coordenadas
          };
    
          // Actualizar el UID en los datos del usuario
          datos.uid = id;
  
          // Guardar los datos en la base de datos
          await this.firestore.createDoc(datos, path, id);
  
          // Mostrar mensaje de registro exitoso y redirigir al usuario
          this.utilsServ.presentToast({
            message: '¡Registrado con éxito!',
            duration: 2000 // Duración del toast en milisegundos
          });
          const alert = await this.alertController.create({
            header: 'Registro exitoso',
            message: '¡Se ha registrado con éxito!',
            buttons: ['OK']
          });
          await alert.present();
          this.router.navigate(['/login']);
        }
      } else {
        console.log('No se pudieron obtener las coordenadas, por favor verifique la dirección.');
      }
    } else {
      console.log('Formulario inválido, por favor complete todos los campos obligatorios correctamente');
    }
  }
  


  async validarDireccion() {
    const address = this.registroForm.get('direccion').value;
    if (address) { // Verifica si la dirección está presente
      try {
        const coordinates = await this.obtenerCoordenadas(address);
        console.log('Coordenadas válidas1:', coordinates);
        this.mostrarMensaje('Dirección válida');
        // Habilitar el botón de registro si la dirección es válida
        this.registroForm.get('direccion').markAsTouched(); // Marcar la dirección como tocada para activar las validaciones
        this.registroForm.updateValueAndValidity(); // Actualizar el estado de validación del formulario

        // Actualizar también la validación del formulario principal
        this.registroForm.controls['direccion'].setValue(address); // Actualizar el valor de la dirección en el formulario principal
        this.registroForm.controls['direccion'].markAsTouched(); // Marcar la dirección como tocada
        this.registroForm.updateValueAndValidity(); // Actualizar la validez del formulario principal
      } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        this.mostrarMensaje('Dirección no válida');
        // Maneja el error según sea necesario, por ejemplo, muestra un mensaje al usuario
      }
    } else {
      console.log('No se ha ingresado una dirección');
      this.mostrarMensaje('Por favor, ingrese una dirección');
      // Puedes mostrar un mensaje al usuario indicando que la dirección es requerida
    }
  }
  
  
  
  async mostrarMensaje(message: string) {
    const alert = await this.alertController.create({
      header: 'Validación de dirección',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  

  async obtenerCoordenadas(address: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          const coordinates = { lat: location.lat(), lng: location.lng() };
          resolve(coordinates);
        } else {
          reject('No se pudieron obtener las coordenadas para la dirección proporcionada');
        }
      });
    });
  }

 


  matchingFields(field1: string, field2: string, errorMessage: string) {
    return (formGroup: FormGroup) => {
      const field1Value = formGroup.get(field1).value;
      const field2Value = formGroup.get(field2).value;

      if (field1Value !== field2Value) {
        const control = formGroup.get(field2);
        control.setErrors({ matchingFields: errorMessage });
      } else {
        const control = formGroup.get(field2);
        control.setErrors(null);
      }
    };
  }

  validatePhoneNumber(control: AbstractControl): { [key: string]: any } | null {
    const phoneNumberPattern = /^[0-9]{9}$/;
    if (control.value && !phoneNumberPattern.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }

  matchPhoneNumber(control: AbstractControl): { [key: string]: any } | null {
    const phoneNumber = control.parent?.get('numContact')?.value;
    if (control.value !== phoneNumber) {
      return { mismatchedPhoneNumber: true };
    }
    return null;
  }



  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas registrarte? Una vez realizado el registro comienza el periodo de prueba de 30 días gratis.',
      buttons: this.alertButtons
    });
    await alert.present();
  }

  formatRut(control: AbstractControl) {
    if (control instanceof FormControl) {
      let rut = control.value;
      if (rut && rut.length > 1) {
        rut = rut.replace(/\./g, ''); // Eliminar puntos
        rut = rut.replace('-', ''); // Eliminar guiones
        rut = rut.replace(/^0+/, ''); // Eliminar ceros al inicio
        rut = rut.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Agregar puntos como separador de miles
        if (rut.length > 1) {
          rut = rut.slice(0, -1) + '-' + rut.slice(-1); // Agregar guion antes del último dígito
        }
      }
      control.setValue(rut, { emitEvent: false }); // Actualizar valor del control sin emitir evento de cambio
    }
  }

  validateRut(control: AbstractControl): { [key: string]: any } | null {
    const rut = control.value;
    
    if (!rut) {
      return null; // Si el campo está vacío, no se valida
    }
    
    const rutArray = rut.split('-');
    
    if (rutArray.length !== 2 || !rutArray[1]) {
      return { invalidRut: true }; // Si el formato del RUT es incorrecto, se devuelve un error
    }
    
    const rutDigits = rutArray[0].split('').reverse();
    const verificador = rutArray[1].toLowerCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = 0; i < rutDigits.length; i++) {
      sum += parseInt(rutDigits[i]) * multiplier;
      multiplier++;
      
      if (multiplier > 7) {
        multiplier = 2;
      }
    }
    
    const remainder = sum % 11;
    const calculatedVerificador = 11 - remainder;
    
    const verificadorToCompare = calculatedVerificador === 11 ? '0' : calculatedVerificador === 10 ? 'k' : calculatedVerificador.toString();
    
    if (verificador !== verificadorToCompare) {
      return { invalidRut: true };
    }
    
    return null;
  }
}
