import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from 'output/entities/ProgramEntity';
import { ProgramEntityDescription } from 'output/entities/ProgramEntityDescription';
import { Sections } from 'output/entities/Sections';
import { SectionDetail } from 'output/entities/SectionDetail';
import { SectionDetailMaterial } from 'output/entities/SectionDetailMaterial';
import { Users } from 'output/entities/Users';
import { UsersRoles } from 'output/entities/UsersRoles';
import { Roles } from 'output/entities/Roles';

@Injectable()
export class ProgramEntityService {
  constructor(
    @InjectRepository(ProgramEntity)
    private serviceProgEntity: Repository<ProgramEntity>,
    @InjectRepository(ProgramEntityDescription)
    private serviceProgEntDesc: Repository<ProgramEntityDescription>,
    @InjectRepository(Sections)
    private serviceSec: Repository<Sections>,
    @InjectRepository(SectionDetail)
    private serviceSecDet: Repository<SectionDetail>,
    @InjectRepository(SectionDetailMaterial)
    private serviceSecDetMat: Repository<SectionDetailMaterial>,
    @InjectRepository(Users)
    private serviceUser: Repository<Users>,
    @InjectRepository(UsersRoles)
    private serviceUserRole: Repository<UsersRoles>,
    @InjectRepository(Roles)
    private serviceRole: Repository<Roles>,
  ) {}

  /* 
    Get all data Program Entity
  */
  public async findAll() {
    return await this.serviceProgEntity.find({});
  }

  /* 
    Get by Id data Program Entity
    Include table:
      program_entity,
      program_entity_description,
      sections,
      section_detail,
      section_detail_material
  */

  public async findOne(id: number) {
    const progEntity = await this.serviceProgEntity.findOne({
      where: { progEntityId: id },
      relations: [
        'programEntityDescription',
        'sections',
        'sections.sectionDetails',
        'sections.sectionDetails.sectionDetailMaterials',
      ],
    });

    // Beberapa field perlu di parse ke text dari json

    return progEntity;
  }

  /* 
    Create data Program Entity
    Include table:
      program_entity,
      program_entity_description,
      sections,
      section_detail,
      section_detail_material
  */

  public async tes(fields: any) {
    try {
      const user = await this.serviceUser.findOne({
        where: { userEntityId: fields.progCreatedByI },
      });
      const userRole = await this.serviceUserRole.find({
        where: { usroEntityId: user.userEntityId },
      });
      let role = undefined;
      for (const temp of userRole) {
        role = await this.serviceRole.findOne({
          where: { roleId: temp.usroRoleId },
        });
      }

      const { roleName } = role;
      return {
        user,
        userRole,
        role,
        roleName,
      };
    } catch (error) {
      return error.message;
    }
  }
  public async insert(fields: any) {
    try {
      //cek apakah seorang instructor atau tidak
      const user = await this.serviceUser.findOne({
        where: { userEntityId: fields.progCreatedByI },
      });
      const userRole = await this.serviceUserRole.find({
        where: { usroEntityId: user.userEntityId },
      });
      let role = undefined;
      for (const temp of userRole) {
        role = await this.serviceRole.findOne({
          where: { roleId: temp.usroRoleId },
        });
      }

      const { roleName } = role;

      if (roleName !== 'Instructor') {
        return 'need a Instructor';
      }
      // Insert ke Table program_entity
      const progEnt = await this.serviceProgEntity.save({
        progTitle: fields.progTitle,
        progHeadline: fields.progHeadline,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalTrainee: fields.progTotalTrainee,
        progModifiedDate: null, // Default Null saat buat baru
        progImage: fields.progImage, // belum selesai (logo)
        progBestSeller: fields.progBestSeller,
        progPrice: fields.progPrice,
        progLanguage: fields.progLanguage,
        progDuration: fields.progDuration,
        progDurationType: fields.progDurationType,
        progTagSkill: fields.progTagSkill,
        progCityI: fields.progCityI,
        progCateI: fields.progCateI,
        progCreatedByI: fields.progCreatedByI,
        progStatusI: fields.progStatusI,
      });

      const itemLearning = fields.predItemLearning.split(', '); // Split Item dari text ke array
      const itemLearningJson = JSON.stringify(itemLearning); // Insert itemLearning dari array ke JSON

      const progEntityDesc = await this.serviceProgEntDesc.save({
        predProgEntityId: progEnt.progEntityId,
        predItemLearning: JSON.parse(itemLearningJson),
        predItemInclude: null, // Belum tahu format form dan datanya
        predRequirement: null, // Belum tahu format form dan datanya
        predDescription: fields.description, // Masih belum bisa input ke Json
        predTargetLevel: null, // Belum tahu format form dan datanya
      });

      for (const section of fields.sections) {
        const sect = await this.serviceSec.save({
          sectProgEntityId: progEnt.progEntityId,
          sectTitle: section.sectTitle,
          sectDescription: section.sectDescription,
          sectTotalSection: section.sectTotalSection,
          sectTotalLecture: section.sectTotalLecture,
          sectTotalMinute: section.sectTotalMinute,
          sectModifiedDate: null,
        });
        for (const sectD of section.sectionDetail) {
          const sectDet = await this.serviceSecDet.save({
            secdTitle: sectD.secdTitle,
            secdPreview: sectD.secdPreview,
            secdScore: sectD.secdScore,
            secdNote: sectD.secdNote,
            secdMinute: sectD.secdMinute,
            secdModifiedDate: null,
            secdSectIdI: sect.sectId,
          });
          const sectDM = await this.serviceSecDetMat.save({
            sedmFilename: sectD.sedmFilename,
            sedmFilesize: sectD.sedmFilesize,
            sedmFiletype: sectD.sedmFiletype,
            sedmFilelink: sectD.sedmFilelink,
            sedmModifiedDate: null,
            sedmSectIdI: sectDet.secdId,
          });
        }
      }

      const result = await this.serviceProgEntity.findOne({
        where: { progEntityId: progEnt.progEntityId },
        relations: [
          'programEntityDescription',
          'sections',
          'sections.sectionDetails',
          'sections.sectionDetails.sectionDetailMaterials',
        ],
      });
      return result;
    } catch (error) {
      return error.message;
    }
  }

  public async update(id: number, fields: any) {
    try {
      //cek apakah seorang instructor atau tidak
      const user = await this.serviceUser.findOne({
        where: { userEntityId: fields.progCreatedByI },
      });
      const userRole = await this.serviceUserRole.find({
        where: { usroEntityId: user.userEntityId },
      });
      let role = undefined;
      for (const temp of userRole) {
        role = await this.serviceRole.findOne({
          where: { roleId: temp.usroRoleId },
        });
      }

      const { roleName } = role;

      if (roleName !== 'Instructor') {
        return 'need a Instructor';
      }
      // Insert ke Table program_entity
      const progEnt = await this.serviceProgEntity.save({
        progTitle: fields.progTitle,
        progHeadline: fields.progHeadline,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalTrainee: fields.progTotalTrainee,
        progModifiedDate: null, // Default Null saat buat baru
        progImage: fields.progImage, // belum selesai (logo)
        progBestSeller: fields.progBestSeller,
        progPrice: fields.progPrice,
        progLanguage: fields.progLanguage,
        progDuration: fields.progDuration,
        progDurationType: fields.progDurationType,
        progTagSkill: fields.progTagSkill,
        progCityI: fields.progCityI,
        progCateI: fields.progCateI,
        progCreatedByI: fields.progCreatedByI,
        progStatusI: fields.progStatusI,
      });

      const itemLearning = fields.predItemLearning.split(', '); // Split Item dari text ke array
      const itemLearningJson = JSON.stringify(itemLearning); // Insert itemLearning dari array ke JSON

      const progEntityDesc = await this.serviceProgEntDesc.save({
        predProgEntityId: progEnt.progEntityId,
        predItemLearning: JSON.parse(itemLearningJson),
        predItemInclude: null, // Belum tahu format form dan datanya
        predRequirement: null, // Belum tahu format form dan datanya
        predDescription: fields.description, // Masih belum bisa input ke Json
        predTargetLevel: null, // Belum tahu format form dan datanya
      });

      for (const section of fields.sections) {
        const sect = await this.serviceSec.save({
          sectProgEntityId: progEnt.progEntityId,
          sectTitle: section.sectTitle,
          sectDescription: section.sectDescription,
          sectTotalSection: section.sectTotalSection,
          sectTotalLecture: section.sectTotalLecture,
          sectTotalMinute: section.sectTotalMinute,
          sectModifiedDate: null,
        });
        for (const sectD of section.sectionDetail) {
          const sectDet = await this.serviceSecDet.save({
            secdTitle: sectD.secdTitle,
            secdPreview: sectD.secdPreview,
            secdScore: sectD.secdScore,
            secdNote: sectD.secdNote,
            secdMinute: sectD.secdMinute,
            secdModifiedDate: null,
            secdSectIdI: sect.sectId,
          });
          const sectDM = await this.serviceSecDetMat.save({
            sedmFilename: sectD.sedmFilename,
            sedmFilesize: sectD.sedmFilesize,
            sedmFiletype: sectD.sedmFiletype,
            sedmFilelink: sectD.sedmFilelink,
            sedmModifiedDate: null,
            sedmSectIdI: sectDet.secdId,
          });
        }
      }

      const result = await this.serviceProgEntity.findOne({
        where: { progEntityId: progEnt.progEntityId },
        relations: [
          'programEntityDescription',
          'sections',
          'sections.sectionDetails',
          'sections.sectionDetails.sectionDetailMaterials',
        ],
      });
      return result;
    } catch (error) {
      return error.message;
    }  }

  public async Delete(id: number) {
    try {
      const section = await this.serviceSec.find({
        where: { sectProgEntityId: id },
        relations: ['sectionDetails', 'sectionDetails.sectionDetailMaterials'],
      });

      for (const item of section) {
        for (const itemDetail of item.sectionDetails) {
          await this.serviceSecDet.remove(itemDetail);
        }
        await this.serviceSec.remove(item);
      }
      await this.serviceProgEntDesc.delete(id);
      await this.serviceProgEntity.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  public async upload(id: number, file) {
    try {
      await this.serviceProgEntity.update(id, {
        progImage: file.originalname,
      });

      return await this.serviceProgEntity.findOne({
        where: { progEntityId: id },
      });
    } catch (error) {
      return error.message;
    }
  }
}
