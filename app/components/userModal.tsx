"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, User } from "@/db/schema";
import { useState } from "react";
import { DOMAIN, PASSWORD } from "../page";

type Props = {
  close: () => void;
  open: boolean;
  upsertUserHandler: (data: FormData) => Promise<void>;
  title: string;
  selectedUser: User | null;
  roles: Role[];
  selectedRole: string;
  setSelectedRole: (roleId: string) => void;
};

export function UserModal({
  close,
  open,
  upsertUserHandler,
  selectedRole,
  selectedUser,
  setSelectedRole,
  roles,
  title,
}: Props) {
  const [firstName, setFirstName] = useState(selectedUser?.firstName ?? "");
  const [lastName, setLastName] = useState(selectedUser?.lastName ?? "");

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogClose asChild={true} onClick={close} />

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          action={(data) => {
            console.log("data", data);
            upsertUserHandler(data);
            close();
          }}
        >
          <FieldGroup>
            <Field>
              <Label htmlFor="name-first">First Name</Label>
              <Input
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
                id="name-first"
                name="firstName"
                placeholder="First name..."
                defaultValue={selectedUser ? selectedUser.firstName : ""}
              />
            </Field>
            <Field>
              <Label htmlFor="name-last">Last Name</Label>
              <Input
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
                id="name-last"
                name="lastName"
                placeholder="Last name..."
                defaultValue={selectedUser ? selectedUser.lastName : ""}
              />
            </Field>
            {/* <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                value={`${firstName}.${lastName}@${DOMAIN}`}
                defaultValue={`${firstName}.${lastName}@${DOMAIN}`}
                disabled
              />
            </Field> */}
            {/* <Field>
              <Label htmlFor="email">Password</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                defaultValue={PASSWORD}
                disabled
              />
            </Field> */}
            <div className="mb-4">
              <Select
                name="role"
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value)}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>

                    {roles.map((role) => (
                      <SelectItem value={role.id} key={role.id}>
                        {role.role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{selectedUser ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
