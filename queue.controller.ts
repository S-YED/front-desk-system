import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import { UpdateQueueEntryDto } from './dto/update-queue-entry.dto';
import { QueueStatus } from './entities/queue-entry.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() createQueueEntryDto: CreateQueueEntryDto) {
    return this.queueService.create(createQueueEntryDto);
  }

  @Get()
  findAll(@Query('status') status?: QueueStatus) {
    if (status) {
      return this.queueService.findByStatus(status);
    }
    return this.queueService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueueEntryDto: UpdateQueueEntryDto) {
    return this.queueService.update(+id, updateQueueEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}
