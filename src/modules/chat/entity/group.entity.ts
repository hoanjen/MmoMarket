import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { GROUP_TYPE } from '../chat.constant';

const GROUP_ENTITY = 'groups';

@Entity(GROUP_ENTITY)
export class Group {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  group_name: number;

  @Column({ nullable: false, type: 'enum', enum: GROUP_TYPE, default: GROUP_TYPE.SINGLE })
  group_type: GROUP_TYPE;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
