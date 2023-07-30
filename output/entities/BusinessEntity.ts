import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bank } from "./Bank";
import { Fintech } from "./Fintech";
import { Users } from "./Users";
import { UsersAccount } from "./UsersAccount";

@Index("business_entity_pkey", ["entityId"], { unique: true })
@Entity("business_entity", { schema: "users" })
export class BusinessEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "entity_id" })
  entityId: number;

  @Column("date", {
    name: "entity_modified_date",
    nullable: true,
    default: () => "now()",
  })
  entityModifiedDate: string | null;

  @OneToOne(() => Bank, (bank) => bank.bankEntity)
  bank: Bank;

  @OneToOne(() => Fintech, (fintech) => fintech.fintEntity)
  fintech: Fintech;

  @OneToOne(() => Users, (users) => users.userEntity)
  users: Users;

  @OneToMany(() => UsersAccount, (usersAccount) => usersAccount.usacBankEntity)
  usersAccounts: UsersAccount[];
}
