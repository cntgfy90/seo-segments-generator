import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { FlowiseModule } from '../../flowise/flowise.module';

@Module({
  imports: [FlowiseModule],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
