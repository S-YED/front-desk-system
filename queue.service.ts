import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus } from './entities/queue-entry.entity';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import { UpdateQueueEntryDto } from './dto/update-queue-entry.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry)
    private queueRepository: Repository<QueueEntry>,
  ) {}

  async findAll(): Promise<QueueEntry[]> {
    return this.queueRepository.find({
      relations: ['patient'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByStatus(status: QueueStatus): Promise<QueueEntry[]> {
    return this.queueRepository.find({
      where: { status },
      relations: ['patient'],
      order: { createdAt: 'ASC' },
    });
  }

  async create(createQueueEntryDto: CreateQueueEntryDto): Promise<QueueEntry> {
    // Generate queue number
    const count = await this.queueRepository.count();
    const queueNumber = `Q${String(count + 1).padStart(3, '0')}`;

    const queueEntry = this.queueRepository.create({
      ...createQueueEntryDto,
      queueNumber,
      patient: { id: createQueueEntryDto.patientId } as any,
    });

    return this.queueRepository.save(queueEntry);
  }

  async update(id: number, updateQueueEntryDto: UpdateQueueEntryDto): Promise<QueueEntry> {
    const queueEntry = await this.queueRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!queueEntry) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }

    Object.assign(queueEntry, updateQueueEntryDto);
    return this.queueRepository.save(queueEntry);
  }

  async remove(id: number): Promise<void> {
    const result = await this.queueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }
  }
}
