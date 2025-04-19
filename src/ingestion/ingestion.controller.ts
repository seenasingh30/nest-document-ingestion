import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { AuthGuard } from '@nestjs/passport';
import { InternalServerErrorResponse, SuccessResponse } from 'src/common/utils/response';

@Controller('ingestion')
@UseGuards(AuthGuard('jwt'))
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) { }

  @Post('trigger/:documentId')
  async triggerIngestion(@Param('documentId') docId: number, @Body() body: CreateIngestionDto) {
    try {
      const fileUrl = body.fileUrl;
      const ingestion = await this.ingestionService.triggerIngestion(docId, fileUrl);
      return SuccessResponse(ingestion, 'Ingestion triggered');
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get()
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('documentId') documentId: number,
  ) {
    try {
      const ingest = await this.ingestionService.findAll(documentId, limit, page);
      const meta = {
        page,
        limit,
        total: ingest?.total || 0,
      }
      const data = ingest?.data || [];
      return SuccessResponse(data, 'Ingestion list', meta);
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }

  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const ingestion = await this.ingestionService.findOne(id);
      return SuccessResponse(ingestion, 'Ingestion details');
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Patch('webhook/:id')
  async completeIngestion(@Param('id') id: number, @Body() body: UpdateIngestionDto) {
    try {
      const ingestion = await this.ingestionService.update(id, body);
      return SuccessResponse(ingestion, 'Ingestion completed');
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }
}
