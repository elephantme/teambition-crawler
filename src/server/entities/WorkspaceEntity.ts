import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_workspace', {})
export class WorkspaceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  workspaceId: string;

  @Column({
    default: false,
  })
  isCategoryReady: boolean;

  @Column({
    default: false,
  })
  isWordReady: boolean;

  @Column({
    default: false,
  })
  isHtmlReady: boolean;

  @Column({
    default: 0,
  })
  downloadTaskCount: number;

  @Column({
    type: 'json',
  })
  data: any;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
