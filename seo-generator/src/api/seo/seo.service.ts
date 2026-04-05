import { Injectable } from '@nestjs/common';
import { FlowiseService } from '../../flowise/flowise.service';
import { GenerateArgs } from './seo.types';
import { ConfigurationError } from '../../errors';

@Injectable()
export class SeoService {
  private readonly chatflowId: string;

  constructor(private readonly flowiseService: FlowiseService) {
    const chatflowId = process.env.CHATFLOW_ID;

    if (!chatflowId) {
      throw new ConfigurationError('CHATFLOW_ID');
    }

    this.chatflowId = chatflowId;
  }

  async generate({
    productName,
    productCategory,
    keywords,
  }: GenerateArgs): Promise<Record<string, string> | undefined> {
    const chatflowId = this.chatflowId;

    return this.flowiseService.createPrediction({
      chatflowId,
      question:
        `Name: ${productName}\n` +
        `Category: ${productCategory}\n` +
        `Keywords: ${keywords.join(', ')}\n`,
    });
  }
}
