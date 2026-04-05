import {
  IsArray,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class GenerateSeoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  productName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  productCategory!: string;

  @IsArray()
  @Length(0, 15)
  keywords!: string[];
}

export class ParsedSeoDto {
  @Expose()
  @IsString()
  @Transform(({ value }) => value ?? '')
  title!: string;

  @Expose()
  @IsString()
  @Transform(({ value }) => value ?? '')
  description!: string;

  @Expose()
  @IsString()
  @Transform(({ value }) => value ?? '')
  meta_description!: string;

  @Expose()
  @IsString()
  @Transform(({ value }) => value ?? '')
  h1!: string;

  @Expose()
  @Transform(({ value }) => {
    if (typeof value !== 'string' || value.length === 0) {
      return [];
    }

    const normalizedValue = value.split('\n');

    if (normalizedValue.length === 0) {
      return [];
    }

    return normalizedValue;
  })
  @IsArray()
  bullets!: string[];
}
