import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { FlowiseService } from './flowise.service';
import { ConfigurationError, InternalServerError } from '../errors';
import { ConfigModule } from '@nestjs/config';

describe('FlowiseService', () => {
  let service: FlowiseService;
  let httpService: HttpService;

  const mockChatflowId = 'test-chatflow-id';
  const mockQuestion = 'Product: Test Product';
  const mockResponseData = {
    json: {
      title: 'Test Title',
      meta_description: 'Test meta description',
      h1: 'Test H1',
      description: 'Test Description',
      bullets: 'bullet 1, bullet 2',
    },
  };

  it('should throw ConfigurationError', () => {
    expect(
      Test.createTestingModule({
        providers: [
          FlowiseService,
          {
            provide: HttpService,
            useValue: {},
          },
        ],
      }).compile(),
    ).rejects.toThrow(ConfigurationError);
  });

  describe('createPrediction', () => {
    let httpServicePostSpy: jest.SpyInstance;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
        providers: [
          FlowiseService,
          {
            provide: HttpService,
            useValue: {
              post: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<FlowiseService>(FlowiseService);
      httpService = module.get<HttpService>(HttpService);
      httpServicePostSpy = jest.spyOn(httpService, 'post');
    });

    it('calls API with correct parameters', async () => {
      httpServicePostSpy.mockReturnValue(of({ data: mockResponseData }));

      const result = await service.createPrediction({
        chatflowId: mockChatflowId,
        question: mockQuestion,
      });

      expect(httpServicePostSpy).toHaveBeenCalledWith(
        'http://example.test.com/api/v1/prediction/test-chatflow-id',
        { question: mockQuestion },
        { headers: { 'Content-Type': 'application/json' } },
      );
    });

    it('returns data', async () => {
      httpServicePostSpy.mockReturnValue(of({ data: mockResponseData }));

      const result = await service.createPrediction({
        chatflowId: mockChatflowId,
        question: mockQuestion,
      });

      expect(result).toEqual(mockResponseData.json);
    });

    it('should retry 3 times on failure', async () => {
      const error = new Error('Network error');
      httpServicePostSpy.mockReturnValue(throwError(() => error));

      await expect(
        service.createPrediction({
          chatflowId: mockChatflowId,
          question: mockQuestion,
        }),
      ).rejects.toThrow(InternalServerError);

      expect(httpServicePostSpy).toHaveBeenCalledTimes(4);
    });
  });
});
