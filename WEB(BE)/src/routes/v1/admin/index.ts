import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { config } from "../../..";
import { FastifyRequestWithUser } from "..";
import { APIError, APIErrorType } from "../../../common/error";
import { getTokenFromRequest } from "../../../common/token";
import * as Meiling from "../../../common/meiling";
import * as User from "../../../common/user";

const adminHandler = (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void
): void => {
  app.addHook("onRequest", async (req, rep) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new APIError(APIErrorType.TOKEN_NOT_FOUND, "token not found");
    }

    if (config.admin.token.includes(token.token)) {
      (req as FastifyRequestWithUser).isAdmin = true;
    } else {
      const data = await Meiling.getToken(token.token);
      if (!data) {
        throw new APIError(APIErrorType.INVALID_TOKEN, "token is invalid");
      }

      const permCheck = await Meiling.permCheck(
        token.token,
        config.permissions.required
      );
      if (!permCheck) {
        throw new APIError(
          APIErrorType.INSUFFICIENT_PERMISSION,
          "token does not meet with minimum sufficient permission"
        );
        throw new Error();
      }

      const user = await Meiling.getUser(token.token);
      if (!user) {
        throw new APIError(
          APIErrorType.USER_NOT_FOUND,
          "unable to load user inforamtion"
        );
        throw new Error();
      }

      (req as FastifyRequestWithUser).user = user;
      (req as FastifyRequestWithUser).isAdmin = await User.checkIsAdmin(user);

      await User.createUserIfNotExist(user);
      await User.updateLastAuthorized(user);
    }

    if (!(req as FastifyRequestWithUser).isAdmin) {
      throw new APIError(APIErrorType.INVALID_TOKEN, "invalid token");
      throw new Error();
    }
  });

  app.get("/", (req, rep) => {
    rep.send({
      version: 1,
      admin: true,
    });
  });

  done();
};

export default adminHandler;
