import { Timestamp } from 'firebase/firestore';

// Definición actualizada de la interfaz Info
export interface Info {
  startDate: Timestamp;
  expiryDate: Timestamp;  // Asegurándonos de que el tipo sea Timestamp de Firestore
  planType: string;  // Aquí puedes incluir otras propiedades relevantes
}

// Luego definimos la interfaz UserI
export interface UserI {
// La función data ahora devuelve un tipo Info correctamente definido
  data?: () => Info;
  exists?: boolean; // Asumiendo que 'exists' es un booleano para indicar si el documento existe
  uid: string | null;
  name: string | null;
  lastName: string | null;
  rut: string | null;
  email: string | null;
  password: string | null;
  age: number | null;
  numContact: number | null;
  direccion: {
    calle: string | null;
    numeroCalle: string | null;
    ciudad: string | null;
    pais: string | null;
  };
  perfil: 'usuario' | 'admin';
  confirmaNumContact: number | null;
  ocupacion?: string | null;
  confirmaEmail: string | null;
  confirmaPassword: string | null;
  coordenadas: {
    lat: number | null;
    lng: number | null;
  };
}
