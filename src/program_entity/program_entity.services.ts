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
  public async insert(fields: any) {
    try {
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
        progCityId: fields.progCityId,
        progCateId: fields.progCateId,
        progCreatedBy: fields.progCreatedBy, // belum di ada function cek employee instructor apa bukan
        progStatus: fields.progStatus,
      });

      // Insert ke Table program_entity_description
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

      // Insert ke Table Sections dan SectionDetails
      const sections = [];
      const sectionDetailList = [];
      for (const section of fields.sections) {
        // Jadikan sectionDetail sebagai constanta
        const sectionDetail = section.sectionDetail;
        // Count Total Section (belum)
        // Count Total Lecture (belum)
        // Count Total Minute (belum)

        // Insert ke Table Sections
        const sectionItem = await this.serviceSec.save({
          sectProgEntityId: progEnt.progEntityId,
          sectTitle: section.title,
          sectDescription: section.description,
          sectTotalSection: null,
          sectTotalLecture: null,
          sectTotalMinute: null,
          sectModifiedDate: null, // Default Null saat insert
        });

        // Insert ke Table Section Details
        for (const item of sectionDetail) {
          const sectionDetailItem = await this.serviceSecDet.save({
            secdTitle: item.detailtitle,
            secdPreview: item.detailPreview,
            secdScore: item.detailScore,
            secdNote: item.detailNote,
            secdMinute: item.detailMinute,
            secdModifiedDate: null, // Default Null saat insert
            secdSectid: sectionItem.sectId,
          });
          sectionDetailList.push(sectionDetailItem);
        }
        sections.push(sectionItem);
      }

      // Insert ke table section_detail_material
      // Belum

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
      // Insert ke Table program_entity
      const progEnt = await this.serviceProgEntity.update(id, {
        progTitle: fields.progTitle,
        progHeadline: fields.progHeadline,
        progType: fields.progType,
        progLearningType: fields.progLearningType,
        progRating: fields.progRating,
        progTotalTrainee: fields.progTotalTrainee,
        progModifiedDate: new Date(),
        progImage: fields.progImage, // belum selesai (logo)
        progBestSeller: fields.progBestSeller,
        progPrice: fields.progPrice,
        progLanguage: fields.progLanguage,
        progDuration: fields.progDuration,
        progDurationType: fields.progDurationType,
        progTagSkill: fields.progTagSkill,
        progCityId: fields.progCityId,
        progCateId: fields.progCateId,
        progCreatedBy: fields.progCreatedBy, // belum di ada function cek employee instructor apa bukan
        progStatus: fields.progStatus,
      });

      // Insert ke Table program_entity_description
      const itemLearning = fields.predItemLearning.split(', '); // Split Item dari text ke array
      const itemLearningJson = JSON.stringify(itemLearning); // Insert itemLearning dari array ke JSON

      const progEntityDesc = await this.serviceProgEntDesc.update(id, {
        predItemLearning: JSON.parse(itemLearningJson),
        predItemInclude: null, // Belum tahu format form dan datanya
        predRequirement: null, // Belum tahu format form dan datanya
        predDescription: fields.description, // Masih belum bisa input ke Json
        predTargetLevel: null, // Belum tahu format form dan datanya
      });

      // Insert ke Table Sections dan SectionDetails
      const sections = [];
      const sectionDetailList = [];
      for (const section of fields.sections) {
        // Jadikan sectionDetail sebagai constanta
        const sectionDetail = section.sectionDetail;
        // Count Total Section (belum)
        // Count Total Lecture (belum)
        // Count Total Minute (belum)

        // Insert ke Table Sections
        // const sectionItem = await this.serviceSec.update({
        //   sectProgEntityId: progEnt.progEntityId,
        //   sectTitle: section.title,
        //   sectDescription: section.description,
        //   sectTotalSection: null,
        //   sectTotalLecture: null,
        //   sectTotalMinute: null,
        //   sectModifiedDate: null, // Default Null saat insert
        // });

        // Insert ke Table Section Details
        for (const item of sectionDetail) {
          const sectionDetailItem = await this.serviceSecDet.save({
            secdTitle: item.detailtitle,
            secdPreview: item.detailPreview,
            secdScore: item.detailScore,
            secdNote: item.detailNote,
            secdMinute: item.detailMinute,
            secdModifiedDate: null, // Default Null saat insert
            // secdSectid: sectionItem.sectId,
          });
          sectionDetailList.push(sectionDetailItem);
        }
        // sections.push(sectionItem);
      }

      // Insert ke table section_detail_material
      // Belum

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
