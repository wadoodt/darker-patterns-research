export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "admin" | "super-admin" | "qa";
  companyId: string;
  status: "created" | "active" | "inactive";
  // The password should never be sent to the client, but is here for mock DB purposes.
  password?: string;
};

export type UserProfile = {
  bio: string;
  avatarUrl: string;
};

export type UserSettings = {
  theme: "light" | "dark";
  notifications: {
    email: boolean;
    push: boolean;
  };
};

export type CreateUserPayload = Omit<User, "id" | "status"> & {
  password: string;
};
