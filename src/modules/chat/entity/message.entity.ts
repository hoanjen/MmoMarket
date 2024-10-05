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
  sender_id: string;

  @ManyToOne(() => Member, (member) => member.messages)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
