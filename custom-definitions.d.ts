enum CUSTOM_ROL {
  "PLAYER" = "PLAYER",
  "CAPTAIN" = "CAPTAIN",
  "ADMIN" = "ADMIN",
}

declare namespace Express {
  export interface Request {
    user: {
      role: CUSTOM_ROL;
      id: string;
    };
  }
}
