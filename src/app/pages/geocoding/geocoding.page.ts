import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

interface GeocodeResponse {
  status: string;
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

@Component({
  selector: 'app-geocoding',
  templateUrl: './geocoding.page.html',
  styleUrls: ['./geocoding.page.scss'],
})
export class GeocodingPage implements OnInit {

  direccionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    
  ) { }

  ngOnInit() {
    this.direccionForm = this.formBuilder.group({
      direccion: ['', Validators.required]
    });
  }

  async validarDireccion() {
    if (this.direccionForm.valid) {
      const direccionCompleta = `${this.direccionForm.value.calle}, ${this.direccionForm.value.numeroCalle}, ${this.direccionForm.value.ciudad}, ${this.direccionForm.value.pais}`;

      try {
        const coordinates = await this.geocodeAddress(direccionCompleta);
        console.log('Coordenadas:', coordinates);
        // Aquí puedes hacer lo que necesites con las coordenadas, como mostrarlas en un mapa
      } catch (error) {
        console.error('Error al validar la dirección:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    } else {
      console.log('Formulario inválido, por favor complete todos los campos');
    }
  }


  async geocodeAddress(address: string): Promise<{ lat: number, lng: number }> {
    const response = await this.http.get<GeocodeResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`
    ).toPromise();

    if (response.status === 'OK' && response.results && response.results.length > 0) {
      const { lat, lng } = response.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('No se encontraron resultados para la dirección proporcionada.');
    }
  }

}
