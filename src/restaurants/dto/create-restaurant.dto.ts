import { RestaurantStatus } from '@prisma/client';
import { 
    IsEnum,
    IsNotEmpty,
    IsString,
    IsUrl,
    IsPhoneNumber,
    IsOptional,
    Max,
} from 'class-validator';

export class CreateRestaurantDto {
    @IsEnum(
        RestaurantStatus
    )
    status: RestaurantStatus;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsPhoneNumber('US')
    phone: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsUrl()
    @IsOptional()
    website: string;
    
    @IsString()
    @Max(500)
    @IsOptional()
    image: string;
}
