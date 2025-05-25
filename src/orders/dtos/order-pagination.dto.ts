import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Possible values are: ${OrderStatusList.join(', ')}`,
  })
  status?: OrderStatus;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}
