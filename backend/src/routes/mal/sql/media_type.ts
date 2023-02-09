import { SQLBuilder } from 'src/utils/sql_builder';
import { exist } from './exist.sql';

export function isMediaTypeExist(name: string) {
    const query = new SQLBuilder('MediaTypes')
        .addSelect('name')
        .addWhere(`name="${name}"`)
        .oneRow()
        .buildQuery();

    return exist(query);
}
