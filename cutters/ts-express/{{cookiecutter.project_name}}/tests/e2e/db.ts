import { AppDataSource } from '../../src/db/dataSource';
import * as entities from '../../src/db/entities';

export function initDb(): Promise<any> {
  return AppDataSource.initialize();
}

export function closeDb(): Promise<any> {
  return AppDataSource.destroy();
}

export function resetDb(): Promise<any> {
  const queryBuilder = AppDataSource.createQueryBuilder();
  return Promise.all(
    Object.values(entities).map((entity) => (
      queryBuilder.delete().from(entity).execute()
    )),
  );
}
