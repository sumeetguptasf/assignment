import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Order, OrderRelations, OrderItem} from '../models';
import {OrderItemRepository} from './order-item.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly items: HasManyRepositoryFactory<OrderItem, typeof Order.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('OrderItemRepository') protected orderItemRepositoryGetter: Getter<OrderItemRepository>,
  ) {
    super(Order, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor('items', orderItemRepositoryGetter,);
    this.registerInclusionResolver('items', this.items.inclusionResolver);
  }
}
