import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_download_log', {})
export class DownloadLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batchId: number;

  @Column()
  workspaceId: string;

  @Column()
  resourceId: string;

  @Column()
  status: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  desc: any;

  @Column({
    type: 'json'
  })
  task: any;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
