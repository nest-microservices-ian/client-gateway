import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderPaginationDto } from './dtos/order-pagination.dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dtos/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send({ cmd: 'create_order' }, createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send(
      { cmd: 'find_all_orders' },
      orderPaginationDto,
    );
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send({ cmd: 'find_one_order' }, { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersClient.send(
      { cmd: 'find_all_orders' },
      { ...statusDto, ...paginationDto },
    );
  }

  @Patch(':id')
  async changeOrderStatus(
    @Body() statusDto: StatusDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send(
          { cmd: 'change_order_status' },
          { id, ...statusDto },
        ),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
