import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    @Type(() => Number) // Intenta transofrmacion de tipo a Number si se recibe como string
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
