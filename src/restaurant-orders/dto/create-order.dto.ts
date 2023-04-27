import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantOrderDto {
    @IsString()
    @IsNotEmpty()
    restaurantId: string;
}


