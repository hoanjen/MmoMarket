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
import { GetMessageByGroupIdDto, GetSideBarChatQueryDto } from './dtos/get-message.dto';

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
      group_avatar: null,
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
    let member = null;
    const user_ids = [];
    for (const item of checkGroup) {
      item.member_user_id === req.user.sub ? (member = item) : user_ids.push(item.member_user_id);
    }
    if (!member) {
      throw new BadRequestException(`You are not member of ${group_id} group`);
    }
    const user = await this.userService.findUserByIdInternal(req.user.sub);
    const newMessage = this.messageRepository.create({
      group_id,
      file,
      file_name,
      member_id: member.member_id,
      user_id: req.user.sub,
      text,
    });

    const messages = await this.messageRepository.save(newMessage);
    await this.gateway.onMessageToUsers(user_ids, {
      file,
      file_name,
      text,
      user_id: req.user.sub,
      id: newMessage.id,
      member_id: 'member_id',
      created_at: newMessage.created_at.toISOString(),
      updated_at: newMessage.updated_at.toISOString(),
      group_id,
      user,
    });
    return ReturnCommon({
      data: messages,
      message: 'Chat success',
      statusCode: HttpStatus.CREATED,
      status: EResponse.SUCCESS,
    });
  }

  async getSideBarChatByToken(getSideBarDtoInput: GetSideBarChatQueryDto, req: RequestAuth) {
    const { user } = req;
    const { cursor, limit } = getSideBarDtoInput;
    const getGroups = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.user_id = :user_id', { user_id: user.sub })
      .getMany();
    const group_ids = getGroups.map((item) => item.group_id);
    let isCursor = new Date().toISOString();
    if (cursor !== 'first') {
      isCursor = cursor;
    }
    const messageSideBar = await this.groupRepository.query(
      `
      SELECT 
        g.id AS group_id,
        g.group_name AS group_name,
        g.group_type AS group_type,
        m.*,
        u.first_name,
        u.last_name,
        u.username,
        u.avatar
      FROM 
        groups g
      INNER JOIN
        messages m ON m.group_id = g.id
      INNER JOIN
        users u ON u.id = m.user_id
      INNER JOIN (
          SELECT 
            group_id, MAX(created_at) AS latest_message
          FROM 
            messages
          GROUP BY 
            group_id
      ) AS latest ON latest.group_id = m.group_id AND latest.latest_message = m.created_at
      WHERE g.id = ANY ($1) AND m.created_at < ($2)
      ORDER BY 
        m.created_at DESC
      LIMIT ($3);
      `,
      [group_ids, isCursor, limit],
    );
    const group_sort_ids = messageSideBar.map((item) => {
      return item.group_id;
    });

    let groupSideBar = await this.groupRepository.query(
      `SELECT 
        g.id AS group_id,
        g.group_name,
        g.group_type AS group_type,
        g.group_avatar AS avatar,
      CASE
        WHEN g.group_type = 'GROUP' THEN g.group_name
        ELSE u.full_name
      END AS group_name,
      CASE
        WHEN g.group_type = 'GROUP' THEN g.group_avatar
        ELSE u.avatar
      END AS avatar
      FROM
        groups g
      INNER JOIN 
        members m ON m.group_id = g.id
      INNER JOIN
        users u ON u.id = m.user_id
      WHERE m.user_id != ($1) AND g.id = ANY ($2)`,
      [user.sub, group_sort_ids],
    );

    groupSideBar = messageSideBar.map((item) => {
      return groupSideBar.find((item2) => item.group_id === item2.group_id);
    });
    return ReturnCommon({
      data: { groupSideBar, messageSideBar },
      message: 'Get SideBar success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }

  async getMessageByGroupId(getMessageByGroupIdInput: GetMessageByGroupIdDto, req: RequestAuth) {
    const { cursor, limit, group_id } = getMessageByGroupIdInput;
    let isCursor = new Date().toISOString();
    if (cursor !== 'first') {
      isCursor = cursor;
    }
    const isGroup = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :group_id', { group_id })
      .innerJoinAndSelect('group.members', 'member')
      .andWhere('member.user_id =:user_id', { user_id: req.user.sub })
      .getRawMany();

    if (isGroup.length === 0) {
      throw new BadRequestException(`You are not user of group${group_id}`);
    }
    const detailGroup = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :group_id', { group_id })
      .select('group')
      .addSelect('user')
      .innerJoin('group.members', 'member')
      .innerJoin('member.user', 'user')
      .andWhere('member.user_id !=:user_id', { user_id: req.user.sub })
      .getRawMany();

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.group_id = :group_id', { group_id })
      .andWhere('message.created_at < :isCursor', { isCursor })
      .innerJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC')
      .limit(limit)
      .getMany();
    return ReturnCommon({
      data: { messages, detailGroup },
      message: 'Get message success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
    });
  }
  async test() {
    const abc = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.text', 'text')
      .addSelect('COUNT(message.id)')
      .groupBy('message.text')
      .getMany();

    return abc;
  }
}
