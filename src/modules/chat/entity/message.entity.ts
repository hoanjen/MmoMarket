import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Group } from './group.entity';
import { User } from 'src/modules/user/entity/user.entity';

const MESSAGE_ENTITY = 'messages';

@Entity(MESSAGE_ENTITY)
export class Message {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: false })
  file_name: string;

  @Column({ nullable: false })
  file: string;

  @Column({ nullable: false })
  member_id: string;

  @Column({ nullable: false })
  group_id: string;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.messages)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
