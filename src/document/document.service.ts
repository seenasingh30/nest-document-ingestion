import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {

  constructor(
    @InjectRepository(Document) private readonly documentRepository: Repository<Document>,
  ) { }

  async create(createDocumentDto: CreateDocumentDto) {
    const document = new Document();
    document.title = createDocumentDto.title;
    document.description = createDocumentDto.description;
    if (createDocumentDto?.fileUrl) {
      document.fileUrl = createDocumentDto.fileUrl;
    }
    if (createDocumentDto?.uploadedBy) {
      document.uploadedBy = createDocumentDto.uploadedBy;
    }
    return await this.documentRepository.save(document);
  }

  async findAll(userId?: number, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const take = limit;
    const where = userId ? { where: { uploadedBy: userId } } : {};
    return await this.documentRepository.find({
      ...where,
      skip,
      take,
    });

  }

  async findOne(id: number, userId?: number) {
    const where = userId ? { where: { id, uploadedBy: userId } } : { where: { id } };
    return await this.documentRepository.findOne({
      ...where,
    });
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    updateDocumentDto.uploadedBy = undefined;
    updateDocumentDto.fileUrl = undefined;
    return await this.documentRepository.update(id, updateDocumentDto);
  }

  async remove(id: number) {
    return await this.documentRepository.delete(id);
  }
}
