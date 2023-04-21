import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRestaurantOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    sizeValue: number;

    @IsString()
    @IsOptional()
    sizeUnit: string;

    // @IsString()
    // @IsOptional()
    // size: string;

    @IsNumber()
    @IsNotEmpty()
    rating: number;
}
