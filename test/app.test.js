const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('=== Suite de Pruebas API Ingesta (Nivel Sr) ===', () => {

  it('GET /health - Debe responder status 200 y UP para Kubernetes Probes', async () => {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'UP');
  });

  it('POST /api/eventos - Debe rechazar payloads incompletos con HTTP 400', async () => {
    const res = await request(app)
      .post('/api/eventos')
      .send({ canal: 'Web' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
