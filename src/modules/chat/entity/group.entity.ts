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

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: false, type: 'enum', enum: GROUP_TYPE, default: GROUP_TYPE.SINGLE })
  group_type: GROUP_TYPE;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @OneToOne(() => User, (user) => user.group)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
