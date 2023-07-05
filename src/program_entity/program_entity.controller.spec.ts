import { Test, TestingModule } from '@nestjs/testing';
import { ProgramEntityController } from './program_entity.controller';

describe('ProgramEntityController', () => {
  let controller: ProgramEntityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramEntityController],
    }).compile();

    controller = module.get<ProgramEntityController>(ProgramEntityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
