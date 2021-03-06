import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  public async createLesson(
    createLessonInput: CreateLessonInput,
  ): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });
    return this.lessonRepository.save(lesson);
  }

  public async getLesson(id: string): Promise<Lesson> {
    return this.lessonRepository.findOne({ id });
  }

  public async getLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  public async assignStudentsToLessons(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ id: lessonId });
    lesson.students = [...new Set([...lesson.students, ...studentIds])];
    return this.lessonRepository.save(lesson);
  }
}
