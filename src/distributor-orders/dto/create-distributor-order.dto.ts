import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDistributorOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @IsString()
    @IsNotEmpty()
    orderName: string;

    @IsDate()
    @IsOptional()
    dateOfOrder: Date;

    @IsString()
    @IsOptional()
    orderDescription: string;

    @IsString()
    @IsNotEmpty()
    distributor: string;

    @IsString()
    @IsOptional()
    distributorId: string;
}
