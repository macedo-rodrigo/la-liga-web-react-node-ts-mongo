import { app } from "./server/index";

const PORT = 3000;
export const appInstance = app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
