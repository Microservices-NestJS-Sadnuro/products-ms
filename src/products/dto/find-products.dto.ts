import { IsArray, IsNumber, IsPositive } from 'class-validator';

export class FindProductsDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    productIds: number[];
}