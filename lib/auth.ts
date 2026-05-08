export const fakeUser = {
  email: "admin@sahalabs.com",
  password: "admin123",
};

export function login(email: string, password: string) {
  if (
    email === fakeUser.email &&
    password === fakeUser.password
  ) {
    return {
      success: true,
      role: "admin",
    };
  }

  return {
    success: false,
  };
}