

// Primero definimos la interfaz Info, ajusta las propiedades según tus necesidades
export interface Info {
  planType: string;
  
}

// Luego definimos la interfaz UserI
export interface UserI {
  // La función data ahora devuelve un tipo Info correctamente definido
  data?: () => Info;
  exists?: boolean; // Asumiendo que 'exists' es un booleano para indicar si el documento existe
  uid: string | null;
  name: string | null;
  lastName: string | null;
  rut: number | null;
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
