import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
});

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: Connection, useValue: {} },
        // eslint-disable-next-line prettier/prettier
        {
          provide: getRepositoryToken(Course),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(Tag), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<MockRepository>(getRepositoryToken(Course));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('buscar curso pelo id', () => {
      it('deve retornar o objeto Course', async () => {
        const couseId = '1';
        const expectedCourse = {};

        courseRepository.findOne.mockReturnValue(expectedCourse);

        const course = await service.findOne(couseId);
        expect(course).toEqual(expectedCourse);
      });

      it('deve retornar NotFoundException', async () => {
        const couseId = '1';

        courseRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(couseId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Course ID ${couseId} not found`);
        }
      });
    });
  });
});
