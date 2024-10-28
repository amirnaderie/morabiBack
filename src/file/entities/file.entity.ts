import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
    
  @Entity()
  export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string;
      
    @Column({ nullable: false, length: 100 })
    fileName: string;
  
          
    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  