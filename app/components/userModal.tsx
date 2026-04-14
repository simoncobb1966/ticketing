"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Role, roles, User } from "@/db/schema";

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
  return (
    <Dialog open={open} onOpenChange={close}>
      {/* <DialogTrigger asChild> */}
      {/* <Button variant="outline">Open Dialog</Button> */}
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-sm">
        <DialogClose asChild={true} onClick={close} />

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
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
                id="name-first"
                name="firstName"
                placeholder="First name..."
                defaultValue={selectedUser ? selectedUser.firstName : ""}
              />
            </Field>
            <Field>
              <Label htmlFor="name-last">Last Name</Label>
              <Input
                id="name-last"
                name="lastName"
                placeholder="Last name..."
                defaultValue={selectedUser ? selectedUser.lastName : ""}
              />
            </Field>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                defaultValue={selectedUser ? selectedUser.email : ""}
              />
            </Field>
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
            {/* <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field> */}
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
