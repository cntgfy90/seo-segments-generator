import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigurationError, InternalServerError } from '../errors';

@Injectable()
export class FlowiseService {
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    const baseUrl = process.env.FLOWISE_BASE_URL;

    if (!baseUrl) {
      throw new ConfigurationError('FLOWISE_BASE_URL');
    }

    this.baseUrl = baseUrl;
  }

  async createPrediction({
    chatflowId,
    question,
  }: {
    chatflowId: string;
    question: string;
  }) {
    const baseUrl = this.baseUrl;
    let lastError: Error;

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            `${baseUrl}/api/v1/prediction/${chatflowId}`,
            { question },
            { headers: { 'Content-Type': 'application/json' } },
          ),
        );
        return response.data.json;
      } catch (error) {
        lastError = error as Error;
      }
    }

    throw new InternalServerError();
  }
}
