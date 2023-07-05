import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProgramEntityDescription } from './ProgramEntityDescription';
import { ProgramReviews } from './ProgramReviews';
import { Sections } from './Sections';

@Index('program_entity_pkey', ['progEntityId'], { unique: true })
@Entity('program_entity', { schema: 'curriculum' })
export class ProgramEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'prog_entity_id' })
  progEntityId: number;

  @Column('character varying', {
    name: 'prog_title',
    nullable: true,
    length: 256,
  })
  progTitle: string | null;

  @Column('character varying', {
    name: 'prog_headline',
    nullable: true,
    length: 512,
  })
  progHeadline: string | null;

  @Column('character varying', {
    name: 'prog_type',
    nullable: true,
    length: 15,
    default: () => "'course'",
  })
  progType: string | null;

  @Column('character varying', {
    name: 'prog_learning_type',
    nullable: true,
    length: 15,
    default: () => "'offline'",
  })
  progLearningType: string | null;

  @Column('numeric', { name: 'prog_rating', nullable: true })
  progRating: string | null;

  @Column('integer', { name: 'prog_total_trainee', nullable: true })
  progTotalTrainee: number | null;

  @Column('timestamp without time zone', {
    name: 'prog_create_date',
    nullable: true,
  })
  progCreateDate: Date | null;

  @Column('character varying', {
    name: 'prog_image',
    nullable: true,
    length: 256,
  })
  progImage: string | null;

  @Column('character', {
    name: 'prog_best_seller',
    nullable: true,
    length: 1,
    default: () => "'0'",
  })
  progBestSeller: string | null;

  @Column('numeric', { name: 'prog_price', nullable: true })
  progPrice: string | null;

  @Column('character varying', {
    name: 'prog_language',
    nullable: true,
    length: 35,
    default: () => "'english'",
  })
  progLanguage: string | null;

  @Column('timestamp without time zone', {
    name: 'prog_modified_date',
    nullable: true,
  })
  progModifiedDate: Date | null;

  @Column('integer', { name: 'prog_duration', nullable: true })
  progDuration: number | null;

  @Column('character varying', {
    name: 'prog_duration_type',
    nullable: true,
    length: 15,
    default: () => "'days'",
  })
  progDurationType: string | null;

  @Column('character varying', {
    name: 'prog_tag_skill',
    nullable: true,
    length: 512,
  })
  progTagSkill: string | null;

  @Column('integer', { name: 'prog_city_id', nullable: true })
  progCityId: number | null;

  @Column('integer', { name: 'prog_cate_id', nullable: true })
  progCateId: number | null;

  @Column('integer', { name: 'prog_created_by', nullable: true })
  progCreatedBy: number | null;

  @Column('character varying', {
    name: 'prog_status',
    nullable: true,
    length: 15,
    default: () => "'draft'",
  })
  progStatus: string | null;

  @OneToOne(
    () => ProgramEntityDescription,
    (programEntityDescription) => programEntityDescription.predProgEntity,
  )
  programEntityDescription: ProgramEntityDescription;

  @OneToMany(
    () => ProgramReviews,
    (programReviews) => programReviews.prowProgEntity,
  )
  programReviews: ProgramReviews[];

  @OneToMany(() => Sections, (sections) => sections.sectProgEntity)
  sections: Sections[];
}
