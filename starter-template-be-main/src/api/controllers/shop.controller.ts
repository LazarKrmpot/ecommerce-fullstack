import { OmitType } from '@nestjs/swagger';
import { Shop } from 'api/models/shop.model';
import { Roles } from 'api/models/user.model';
import { ShopService } from 'api/services/shop.service';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';

class postShopBody extends OmitType(Shop, ['__v', '_id']) {
  @Exclude()
  @IsOptional()
  protected_: null;
}

@JsonController('/shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('/')
  @Authorized(Object.values(Roles))
  public async getAllShops() {
    return await this.shopService.find({});
  }

  @Post('/')
  @Authorized(Roles.ADMIN)
  public async createShop(@Body() body: postShopBody) {
    const { name, description, address } = body;
    await this.shopService.create({ name, description, address });
    return { message: 'Shop created successfully' };
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  public async updateShop(
    @Param('id') id: string,
    @Body() shop: Partial<Shop>,
  ) {
    const { name, description, address } = shop;
    return await this.shopService.updateOneById(id, {
      name,
      description,
      address,
    });
  }

  @Delete('/:id')
  @Authorized(Roles.ADMIN)
  public async deleteShop(@Param('id') id: string) {
    await this.shopService.delete(id);
    return { message: 'Shop deleted successfully' };
  }
}
