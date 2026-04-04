import { HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './services/prisma.service';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService { //implements OnModuleInit {
  // onModuleInit() {
  //   this.$connect();
  //   console.log('Database connected');
  // }

  constructor(private prisma: PrismaService) { }

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalRows = await this.prisma.product.count();
    const lastPage = Math.ceil(totalRows / limit);

    return {
      data: await this.prisma.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        page: page,
        total: totalRows,
        lastPage: lastPage
      }
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id, available: true }
    });

    if (!product) throw new RpcException({ message: `Product with id ${id} not found.`, status: HttpStatus.NOT_FOUND });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Destructuramos el objeto para separar el id de los demas datos.
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id: id, available: true },
      data: data
    })
  }

  async remove(id: number) {
    // Hard delete
    // await this.findOne(id);
    // return await this.prisma.product.delete({
    //   where: { id: id }
    // })

    // Soft delete
    const product = await this.prisma.product.update({
      where: { id: id },
      data: {
        available: false
      }
    })

    return product;
  }
}
