import { Controller, Post, Get, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './productSchema/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() body: any): Promise<Product> {
    return this.productService.create(body);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
}
