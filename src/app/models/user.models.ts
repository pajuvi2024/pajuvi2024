export interface User{

    uid: string;
    name: string;
    lastName: string,
    rut: string;
    email: string;
    password: string;    
    age: string;    
    numContact: string;
    fechaNacimiento: string;
    direccion: string; 
    direccionComercial: string;
    perfil: 'usuario'|'admin'
}