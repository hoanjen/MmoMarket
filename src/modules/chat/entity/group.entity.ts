import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { GROUP_TYPE } from '../chat.constant';
import { User } from 'src/modules/user/entity/user.entity';
import { Message } from './message.entity';

const GROUP_ENTITY = 'groups';

@Entity(GROUP_ENTITY)
export class Group {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: true })
  group_name: string;

  @Column({ nullable: true })
  group_avatar: string;

  @Column({ nullable: false, type: 'enum', enum: GROUP_TYPE, default: GROUP_TYPE.SINGLE })
  group_type: GROUP_TYPE;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
