import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    productId: string;
}