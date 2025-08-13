import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {OrderItem, OrderItemRelations} from '../models';

export class OrderItemRepository extends DefaultCrudRepository<
  OrderItem,
  typeof OrderItem.prototype.id,
  OrderItemRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(OrderItem, dataSource);
  }
}
