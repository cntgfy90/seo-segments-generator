import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SeoService } from './seo.service';
import { GenerateSeoDto, ParsedSeoDto } from './seo.dto';
import { plainToInstance } from 'class-transformer';

// TODO: consider following REST standard
@Controller('api/generate-seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async generateSeoSegments(@Body() body: GenerateSeoDto) {
    const { productName, productCategory, keywords } = body;

    const data = await this.seoService.generate({
      productName,
      productCategory,
      keywords,
    });

    return plainToInstance(ParsedSeoDto, data);
  }
}
