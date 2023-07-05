import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProgramEntityService } from './program_entity.services';

@Controller('program_entity')
export class ProgramEntityController {
  constructor(private Service: ProgramEntityService) {}

  @Get()
  public async getAll() {
    return this.Service.findAll();
  }

  @Get(':id')
  public async getOne(@Param('id') id: number) {
    return this.Service.findOne(id);
  }

  @Post()
  public async Create(@Body() fields: any) {
    return this.Service.insert(fields);
  }

  @Put(':id')
  public async Update(@Body() fields: any, @Param('id') id: number) {
    return this.Service.update(id, fields);
  }

  @Delete(':id')
  public async Delete(@Param('id') id: number) {
    return this.Service.Delete(id);
  }
}
