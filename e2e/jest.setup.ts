import supertest from 'supertest';

// Configura la URL base de tu API
const BASE_URL = 'http://0.0.0.0:3000/dev';

// Exporta una instancia de Supertest para usarla en las pruebas
export const request = supertest(BASE_URL);