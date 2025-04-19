import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestResponse, InternalServerErrorResponse, SuccessResponse } from 'src/common/utils/response';
import { Role } from 'src/common/enums/role.enum';

@Controller('document')
@UseGuards(AuthGuard('jwt'))
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // folder to save
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
      },
    }),
  }))
  async uploadDocument(
    @Req() req: any,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        return BadRequestResponse('File is required');
      }
      body.uploadedBy = req.user.id;
      const document = await this.documentService.create({
        ...body,
        fileUrl: `/uploads/${file.filename}`,
      });
      if (document) {
        return SuccessResponse(document, 'Document uploaded successfully');
      }
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    try {
      let userId = req.user.id;
      if (req.user.role == Role.Admin || req.user.role == Role.Editor) {
        userId = undefined;
      }
      const document = await this.documentService.findAll(userId, limit, page);
      const meta = {
        page: page,
        limit: limit,
      };
      return SuccessResponse(document, 'Documents fetched successfully', meta);
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      let userId = req.user.id;
      if (req.user.role == Role.Admin || req.user.role == Role.Editor) {
        userId = undefined;
      }
      const document = await this.documentService.findOne(+id);
      if (document) {
        return SuccessResponse(document, 'Document fetched successfully');
      }
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Req() req: any) {
    try {
      let userId = req.user.id;
      if (req.user.role == Role.Admin || req.user.role == Role.Editor) {
        userId = undefined;
      }
      const document = this.documentService.findOne(+id, userId);
      if (!document) {
        return BadRequestResponse('Document not found');
      }
      const updatedDocument = this.documentService.update(+id, updateDocumentDto);
      if (updatedDocument) {
        return SuccessResponse(updatedDocument, 'Document updated successfully');
      } else {
        return BadRequestResponse('Document not found');
      }
    }
    catch (error) {
      return InternalServerErrorResponse(error.message);
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    try {
      let userId = req.user.id;
      if (req.user.role == Role.Admin || req.user.role == Role.Editor) {
        userId = undefined;
      }
      const document = this.documentService.findOne(+id);
      if (!document) {
        return BadRequestResponse('Document not found');
      }
      const deletedDocument = this.documentService.remove(+id);
      if (deletedDocument) {
        return SuccessResponse(deletedDocument, 'Document deleted successfully');
      } else {
        return BadRequestResponse('Document not found');
      }
    }
    catch (error) {
      if (error.message === 'Document not found') {
        return BadRequestResponse('Document not found');
      }
      return InternalServerErrorResponse(error.message);
    }
  }
}
