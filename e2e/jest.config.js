module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'], // Solo ejecuta archivos que terminen en .e2e.ts
  setupFilesAfterEnv: ['./jest.setup.ts'], // Archivo de configuración adicional
};
