import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProgramEntity } from 'output/entities/ProgramEntity';
import { ProgramEntityService } from 'src/program_entity/program_entity.services';
import { ProgramEntityController } from 'src/program_entity/program_entity.controller';
import { ProgramEntityDescription } from 'output/entities/ProgramEntityDescription';
import { Sections } from 'output/entities/Sections';
import { SectionDetail } from 'output/entities/SectionDetail';
import { SectionDetailMaterial } from 'output/entities/SectionDetailMaterial';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMulter } from 'src/multer/multer';
import { Users } from 'output/entities/Users';
import { UsersRoles } from 'output/entities/UsersRoles';
import { Roles } from 'output/entities/Roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProgramEntity,
      ProgramEntityDescription,
      Sections,
      SectionDetail,
      SectionDetailMaterial,
      Users,
      UsersRoles,
      Roles,
    ]),
    MulterModule.register(UploadMulter.MulterOption()),
  ],
  providers: [ProgramEntityService],
  controllers: [ProgramEntityController],
})
export class GlobalModule {}
