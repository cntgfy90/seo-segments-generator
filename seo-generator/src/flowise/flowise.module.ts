import { Module } from '@nestjs/common';
import { FlowiseService } from './flowise.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [FlowiseService],
  exports: [FlowiseService],
})
export class FlowiseModule {}
