import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingestion } from './entities/ingestion.entity';
import { Repository } from 'typeorm';
import { IngestionStatus } from 'src/common/enums/ingestion.enum';
import configuration from 'src/common/config/configuration';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepo: Repository<Ingestion>,
    private readonly httpService: HttpService,
  ) { }

  async triggerIngestion(documentId: number, fileUrl: string) {
    const ingestion = this.ingestionRepo.create({
      documentId,
      status: IngestionStatus.Pending,
    });
    await this.ingestionRepo.save(ingestion);

    try {
      // 👇 Call Python ingestion endpoint
      await this.httpService.axiosRef.post(
        configuration().ingestionUrl,
        { fileUrl, documentId },
      );

      ingestion.status = IngestionStatus.Processing;
    } catch (error) {
      ingestion.status = IngestionStatus.Failed;
      ingestion.error = error.message;
    }

    return this.ingestionRepo.save(ingestion);
  }

  async findOne(id: number) {
    const ingestion = await this.ingestionRepo.findOne({
      where: { id },
    });
    if (!ingestion) {
      throw new Error('Ingestion not found');
    }
    return ingestion;
  }

  async findAll(documentId?: number, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const take = limit;
    const query = this.ingestionRepo.createQueryBuilder('ingestion');
    if (documentId) {
      query.where('ingestion.documentId = :documentId', { documentId });
    }
    query.skip(skip).take(take);
    const [results, total] = await query.getManyAndCount();
    return {
      data: results,
      total,
      page,
      limit,
    };
  }

  async update(id: number, updateIngestionDto: UpdateIngestionDto) {
    const ingestion = await this.ingestionRepo.findOne({
      where: { id },
    });
    if (!ingestion) {
      throw new Error('Ingestion not found');
    }
    Object.assign(ingestion, updateIngestionDto);
    return this.ingestionRepo.save(ingestion);
  }
}
