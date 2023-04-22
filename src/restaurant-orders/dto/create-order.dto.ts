import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRestaurantOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;
}


