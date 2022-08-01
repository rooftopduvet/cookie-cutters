import { DataSource } from 'typeorm';
import { Greeting } from '../entities/Greeting.entity';
import { AppDataSource } from '../dataSource';

export class HelloWorldRepository {
  dataSource: DataSource;

  constructor(dataSource: DataSource = AppDataSource) {
    this.dataSource = dataSource;
  }

  getGreetings = async (offset: number = 0, limit: number = 20): Promise<Greeting[]> => {
    const greetingsRepo = this.dataSource.getRepository(Greeting);
    const greetings = await greetingsRepo.find({
      skip: offset,
      take: limit,
    });
    return greetings;
  };

  addGreeting = async (name: string, message: string): Promise<Greeting> => {
    const greetingsRepo = this.dataSource.getRepository(Greeting);
    const greeting = new Greeting();
    greeting.name = name;
    greeting.message = message;
    await greetingsRepo.save(greeting);
    return greeting;
  };

  getGreeting = async (id: string): Promise<Greeting | null> => {
    const greetingsRepo = this.dataSource.getRepository(Greeting);
    const greeting = await greetingsRepo.findOne({ where: { id } });
    return greeting;
  };
}
