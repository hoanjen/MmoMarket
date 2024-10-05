import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { Repository } from 'typeorm';
import { Member } from './entity/member.entity';
import { Message } from './entity/message.entity';
import { CreateMessageDto, JoinSingleChatDto } from './dtos/create-message.dto';
import { EResponse, RequestAuth } from 'src/common/interface.common';
import { GROUP_TYPE } from './chat.constant';
import { UserService } from '../user/user.service';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { Gateway } from '../gateway/app.gateway';
import { GetMessageQueryDto } from './dtos/get-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly gateway: Gateway,
  ) {}

  async joinSingleChat(joinSingleChatInput: JoinSingleChatDto, req: RequestAuth) {
    const { receiver_id } = joinSingleChatInput;
    const receiver = this.userService.findUserById({ user_id: receiver_id });
    const user_id = req.user.sub;
    if (!receiver) {
      throw new BadRequestException('receiver not found');
    }
    const checkGroup = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.group_type = :group_type', { group_type: GROUP_TYPE.SINGLE })
      .innerJoinAndSelect('group.members', 'member')
      .andWhere('member.user_id = :user_id OR member.user_id = :receiver_id', { user_id, receiver_id })
      .getRawMany();
    const setGroupId = new Set();
    let isGroup = false;
    checkGroup.forEach((item) => {
      if (setGroupId.has(item.group_id)) {
        isGroup = true;
      }
      setGroupId.add(item.group_id);
    });

    if (isGroup) {
      throw new BadRequestException('You have already joined group');
    }
    const newGroup = this.groupRepository.create({
      group_name: null,
      group_type: GROUP_TYPE.SINGLE,
    });

    const newGroupSingle = await this.groupRepository.save(newGroup);
    const newMemberSender = this.memberRepository.create({
      user_id: user_id,
      group_id: newGroupSingle.id,
    });

    const newMemberReceiver = this.memberRepository.create({
      user_id: receiver_id,
      group_id: newGroupSingle.id,
    });

    await this.memberRepository.save([newMemberSender, newMemberReceiver]);

    return ReturnCommon({
      data: newGroup,
      message: 'Join group success',
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
    });
  }

  async chat(createMessageInput: CreateMessageDto, req: RequestAuth) {
    const { file, file_name, group_id, text } = createMessageInput;
    const checkGroup = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :group_id', { group_id })
      .innerJoinAndSelect('group.members', 'member')
      .getRawMany();

    if (!checkGroup.length) {
      throw new BadRequestException('Group not found');
    }
    const user_ids = [];
    const newMessages = checkGroup.map((value) => {
      if (value.member_user_id !== req.user.sub) {
        user_ids.push(value.member_user_id);
      }
      return { member_id: value.member_id, text, file_name, file, sender_id: req.user.sub };
    });
    const messages = await this.messageRepository.insert(newMessages);
    await this.gateway.onMessageToUsers(user_ids, { file, file_name, text, sender_id: req.user.sub, group_id });
    return ReturnCommon({
      data: messages.raw,
      message: 'Chat success',
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
    });
  }

  async getAllMessageByToken(getMessageQueryDtoInput: GetMessageQueryDto, req: RequestAuth) {
    const { user } = req;
    const { cursor, limit } = getMessageQueryDtoInput;
    const groupByMemberId = this.memberRepository
      .createQueryBuilder('member')
      .where('member.user_id = :user_id', { user_id: user.sub })
      .innerJoin('member.messages', 'message')
      .select('member.id', 'member_id')
      .addSelect('MAX(message.created_at)', 'max_created')
      .groupBy('member.id')
      .orderBy('max_created', 'DESC');
    if (cursor !== 'first') {
      groupByMemberId.andWhere('message.created_at < :cursor', { cursor }).take(limit);
    }
    const member = await groupByMemberId.getRawMany();

    const member_ids = member.map((item) => item.member_id);
    const getMessages = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.id IN (:...member_ids)', { member_ids })
      .innerJoinAndSelect('member.messages', 'message')
      .innerJoinAndSelect('member.group', 'group')
      .orderBy('message.created_at', 'DESC')
      .getMany();

    const messages = member_ids.map((id) => getMessages.find((item) => item.id === id));

    return ReturnCommon({
      data: messages,
      message: 'Get message success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }
}
