// Define la interfaz UserI con todas las propiedades requeridas
export interface UserI {
  uid: string | null;
  name: string | null;
  lastName: string | null;
  rut: number | null;
  email: string | null;
  password: string | null;
  age: number | null;
  numContact: number | null;
  direccion: { calle: string | null; numeroCalle: string | null; ciudad: string | null; pais: string | null };
  perfil: 'usuario' | 'admin';
  confirmaNumContact: number | null;
  ocupacion?: string | null;
  confirmaEmail: string | null;
  confirmaPassword: string | null;
  coordenadas: { lat: number | null; lng: number | null };
}
