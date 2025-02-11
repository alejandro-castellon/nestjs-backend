import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import internal from 'stream';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product #${createProductDto.name} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: { id },
    });
    if (!productFound) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productUpdated = await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
    if (!productUpdated) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return productUpdated;
  }

  async remove(id: number) {
    const productDeleted = await this.prismaService.product.delete({
      where: { id },
    });
    if (!productDeleted) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return productDeleted;
  }
}
