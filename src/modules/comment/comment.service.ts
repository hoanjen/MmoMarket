import { BadRequestException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { GetCommentDto } from './dtos/get-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  async createComment(createCommentInput: CreateCommentDto, user_id: string) {
    const { content, product_id, star, image } = createCommentInput;
    const isProduct = await this.productService.getProductById(product_id);
    if (!isProduct) {
      throw new BadRequestException('Product does not exist');
    }

    const isAccess = await this.orderService.isBuyProduct(product_id, user_id);

    if (!isAccess) {
      throw new BadRequestException('You cannot rate a product without purchasing it');
    }

    const newComment = this.commentRepository.create({
      content,
      product_id,
      star,
      user_id,
      image,
    });

    const comment = await this.commentRepository.save(newComment);

    return ReturnCommon({
      message: 'Comment success',
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
      data: comment,
    });
  }

  async getCommentByProductId(getCommentInput: GetCommentDto) {
    const { product_id } = getCommentInput;
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.product_id = :product_id', { product_id })
      .innerJoin('comment.user', 'user')
      .select('comment')
      .addSelect(['user.id', 'user.full_name', 'user.avatar'])
      .getMany();
    return ReturnCommon({
      message: 'Get comment success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: comment,
    });
  }
}
