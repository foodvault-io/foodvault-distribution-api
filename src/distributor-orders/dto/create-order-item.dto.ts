import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFoodOrderItemDto {
    @IsString()
    @IsNotEmpty()
    productName: string;
    
    @IsString()
    @IsOptional()
    productId: string;

    @IsString() 
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
} 