import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { UserCredentials, UserCredentialsRelations } from '../models/user-credentials.model';


export class UserCredentialsRepository extends DefaultCrudRepository<
    UserCredentials,
    typeof UserCredentials.prototype.id,
    UserCredentialsRelations
> {
    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
    ) {
        super(UserCredentials, dataSource);
    }
}
