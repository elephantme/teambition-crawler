import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_resource', {})
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resourceId: string;

  @Column({
    nullable: true,
  })
  parentId: string;

  @Column()
  workspaceId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
