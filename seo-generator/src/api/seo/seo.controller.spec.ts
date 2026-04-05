import { INestApplication } from '@nestjs/common';
import { SeoService } from './seo.service';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FlowiseModule } from '../../flowise/flowise.module';

describe('SeoController', () => {
  let app: INestApplication;
  let seoService: SeoService;

  const mockSeoResponse = {
    title: 'Mock Title',
    meta_description: 'Mock meta description',
    h1: 'Mock H1',
    description: 'Mock Description',
    bullets: ['bullet 1', 'bullet 2'],
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, FlowiseModule],
    })
      .overrideProvider(SeoService)
      .useValue({
        generate: jest.fn().mockResolvedValue(mockSeoResponse),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    seoService = moduleFixture.get<SeoService>(SeoService);
    await app.init();
  });

  it('should return generated SEO data', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/generate-seo')
      .send({
        productName: 'Test',
        productCategory: 'Test',
        keywords: ['KEYWORD_1', 'KEYWORD_2'],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      bullets: [],
      description: 'Mock Description',
      h1: 'Mock H1',
      meta_description: 'Mock meta description',
      title: 'Mock Title',
    });
  });

  it('should return empty response', async () => {
    jest.spyOn(seoService, 'generate').mockResolvedValue({});

    const response = await request(app.getHttpServer())
      .post('/api/generate-seo')
      .send({
        productName: 'Test',
        productCategory: 'Test',
        keywords: ['KEYWORD_1', 'KEYWORD_2'],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      bullets: [],
      description: '',
      h1: '',
      meta_description: '',
      title: '',
    });
  });
});
