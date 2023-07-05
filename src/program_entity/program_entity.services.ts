import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from 'output/entities/ProgramEntity';
import { ProgramEntityDescription } from 'output/entities/ProgramEntityDescription';
import { Sections } from 'output/entities/Sections';
import { SectionDetail } from 'output/entities/SectionDetail';
import { SectionDetailMaterial } from 'output/entities/SectionDetailMaterial';

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
  ) {}

  public async findAll() {
    return await this.serviceProgEntity.find({});
  }

  public async findOne(id: number) {
    return await this.serviceProgEntity.findOne({
      where: { progEntityId: id },
      relations: [
        'programEntityDescription',
        'sections',
        'sections.sectionDetails',
        'sections.sectionDetails.sectionDetailMaterials',
      ],
    });
  }

  /* 
    Create new Program Entity
    It is include table program_entity, program_entity_description, sections, section_detail, section_detail_material
  */
  public async insert(fields: any) {
    try {
      // Insert Into Table program_entity
      const progEnt = await this.serviceProgEntity.save({
        progTitle: fields.progTitle,
        progHeadline: fields.progHeadline,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalTrainee: fields.progTotalTrainee,
        progCreateDate: new Date(),
        progImage: fields.progImage, // Not Done (logo)
        progBestSeller: fields.progBestSeller,
        progPrice: fields.progPrice,
        progLanguage: fields.progLanguage,
        progModifiedDate: null, // Default Null
        progDuration: fields.progDuration,
        progDurationType: fields.progDurationType,
        progTagSkill: fields.progTagSkill,
        progCityId: fields.progCityId,
        progCateId: fields.progCateId,
        progCreatedBy: fields.progCreatedBy, // This should be from the auth
        progStatus: fields.progStatus,
      });

      // Insert Into Table program_entity_description
      const itemLearning = fields.predItemLearning.split(', '); // Split Item
      const itemLearningJson = JSON.stringify(itemLearning); // Insert itemLearning to JSON

      const progEntityDesc = await this.serviceProgEntDesc.save({
        predProgEntityId: progEnt.progEntityId,
        predItemLearning: JSON.parse(itemLearningJson),
        predItemInclude: null, // Unknow Column
        predRequirement: null, // Unknow Column
        predDescription: fields.description, // Masih belum bisa input ke Json
        predTargetLevel: null, // Unknow Column
      });

      // Insert Into Table Sections and SectionDetails
      const sections = [];
      const sectionDetailList = [];
      for (const section of fields.sections) {
        // Assign Section Detail to Const
        const sectionDetail = section.sectionDetail;
        // Count Total Section
        // Count Total Lecture
        // Count Total Minute
        // Insert Into Table Sections
        const sectionItem = await this.serviceSec.save({
          sectProgEntityId: progEnt.progEntityId,
          sectTitle: section.title,
          sectDescription: section.description,
          sectTotalSection: null,
          sectTotalLecture: null,
          sectTotalMinute: null,
          sectModifiedDate: null, // Default Null
        });
        // Insert Into Table Section Details
        for (const item of sectionDetail) {
          const sectionDetailItem = await this.serviceSecDet.save({
            secdTitle: item.detailtitle,
            secdPreview: item.detailPreview,
            secdScore: item.detailScore,
            secdNote: item.detailNote,
            secdMinute: item.detailMinute,
            secdModifiedDate: null, // Default Null
            secdSectid: sectionItem.sectId,
          });
          sectionDetailList.push(sectionDetailItem);
        }
        sections.push(sectionItem);
      }

      // Insert into section_detail_material table
      // Belum ini

      return {
        progEnt,
        progEntityDesc,
        sections,
        sectionDetailList,
      };
    } catch (error) {
      return error.message;
    }
  }

  public async update(id: number, fields: any) {
    try {
      const progEntity = await this.serviceProgEntity.update(id, {
        progTitle: fields.progTitle,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalTrainee: fields.progTotalTrainee,
        progCreateDate: new Date(),
        progImage: fields.progImage,
        progBestSeller: fields.progBestSeller,
        progPrice: fields.progPrice,
        progLanguage: fields.progLanguage,
        progModifiedDate: fields.progModifiedDate,
        progDuration: fields.progDuration,
        progDurationType: fields.progDurationType,
        progTagSkill: fields.progTagSkill,
        progCityId: fields.progCityId,
        progCateId: fields.progCateId,
        progCreatedBy: fields.progCreatedBy,
        progStatus: fields.progStatus,
      });
      return progEntity;
    } catch (error) {
      return error.message;
    }
  }

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
}
