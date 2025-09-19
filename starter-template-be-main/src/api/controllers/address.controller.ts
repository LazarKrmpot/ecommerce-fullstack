import { DeliveryAddressInfo, User } from 'api/models/user.model';
import { Roles } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

export class CreateDeliveryAddress {
  @IsBoolean()
  isPrimary: boolean;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsNumber()
  zipcode: number;

  @IsString()
  country: string;

  @IsNumber()
  postalCode: number;

  @IsString()
  phoneNumber: string;
}

@JsonController('/addresses')
export class AddressController {
  constructor(private userService: UserService) {}

  @Get('/')
  @ResponseSchema(CreateDeliveryAddress)
  @Authorized(Object.values(Roles))
  public async getAddresses(@CurrentUser() user: User) {
    const currentUser = await this.userService.findOneById(user._id);
    return {
      data: currentUser?.deliveryAddresses || [],
    };
  }

  @Post('/')
  @Authorized(Object.values(Roles))
  public async createAddress(
    @CurrentUser() user: User,
    @Body() body: CreateDeliveryAddress,
  ) {
    const { address, city, state, zipcode, country, postalCode, phoneNumber } =
      body;

    const currentUser = await this.userService.findOneById(user._id);
    const userAddresses = currentUser?.deliveryAddresses || [];

    if (userAddresses.length >= 3) {
      return {
        message: 'You can only have a maximum of 3 delivery addresses.',
      };
    }

    const newAddress = new DeliveryAddressInfo();
    newAddress.isPrimary = userAddresses.length === 0;
    newAddress.address = address;
    newAddress.city = city;
    newAddress.state = state;
    newAddress.zipcode = zipcode;
    newAddress.country = country;
    newAddress.postalCode = postalCode;
    newAddress.phoneNumber = phoneNumber;

    await this.userService.updateOneById(user._id, {
      $push: { deliveryAddresses: newAddress },
    });

    const updatedUser = await this.userService.findOneById(user._id);
    const addedAddress =
      updatedUser.deliveryAddresses[updatedUser.deliveryAddresses.length - 1];

    return {
      message: 'Address added successfully',
      data: addedAddress,
    };
  }

  @Put('/:addressId')
  @Authorized(Object.values(Roles))
  public async updateAddress(
    @CurrentUser() user: User,
    @Param('addressId') addressId: string,
    @Body() updatedAddress: CreateDeliveryAddress,
  ) {
    const {
      address,
      city,
      state,
      zipcode,
      country,
      postalCode,
      phoneNumber,
      isPrimary,
    } = updatedAddress;

    const currentUser = await this.userService.findOneById(user._id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const addressIndex = currentUser.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    if (isPrimary) {
      currentUser.deliveryAddresses.forEach((addr) => {
        addr.isPrimary = false;
      });
    }

    currentUser.deliveryAddresses[addressIndex] = {
      ...currentUser.deliveryAddresses[addressIndex],
      address,
      city,
      state,
      zipcode,
      country,
      postalCode,
      phoneNumber,
      isPrimary,
    };

    await this.userService.updateOneById(user._id, {
      deliveryAddresses: currentUser.deliveryAddresses,
    });

    return {
      message: 'Address updated successfully',
      data: currentUser.deliveryAddresses[addressIndex],
    };
  }

  @Put('/:addressId/primary')
  @Authorized(Object.values(Roles))
  public async setPrimaryAddress(
    @CurrentUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    const currentUser = await this.userService.findOneById(user._id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const addressIndex = currentUser.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    // Set all addresses to non-primary
    currentUser.deliveryAddresses.forEach((addr) => {
      addr.isPrimary = false;
    });

    // Set the selected address as primary
    currentUser.deliveryAddresses[addressIndex].isPrimary = true;

    await this.userService.updateOneById(user._id, {
      deliveryAddresses: currentUser.deliveryAddresses,
    });

    return {
      message: 'Primary address updated successfully',
      data: currentUser.deliveryAddresses[addressIndex],
    };
  }

  @Delete('/:addressId')
  @Authorized(Object.values(Roles))
  public async deleteAddress(
    @CurrentUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    const currentUser = await this.userService.findOneById(user._id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const addressIndex = currentUser.deliveryAddresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    const wasPrimary = currentUser.deliveryAddresses[addressIndex].isPrimary;
    currentUser.deliveryAddresses.splice(addressIndex, 1);

    // If we deleted the primary address and there are other addresses, make the first one primary
    if (wasPrimary && currentUser.deliveryAddresses.length > 0) {
      currentUser.deliveryAddresses[0].isPrimary = true;
    }

    await this.userService.updateOneById(user._id, {
      deliveryAddresses: currentUser.deliveryAddresses,
    });

    return {
      message: 'Address deleted successfully',
    };
  }
}
