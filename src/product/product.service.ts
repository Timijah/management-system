import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './productSchema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(data: any): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
}
